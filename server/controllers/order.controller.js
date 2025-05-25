import { prisma } from '../lib/prisma.js'

import Stripe from 'stripe';
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)

import dotenv from 'dotenv';

dotenv.config();

export const cashOnDeliveryOrderController = async (req, res) => {
  try {
    const userId = req.user.id;
    const { list_items, addressId,totalAmt } = req.body;

    // 1️⃣ ดึงข้อมูลสินค้าโดยตรงจากฐานข้อมูล เพื่อป้องกันการปลอมแปลงข้อมูล
    const productIds = list_items.map((item) => item.productId);
    const productsFromDB = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true, discount_show: true, stock: true },
    });

    // 2️⃣ ตรวจสอบว่า productId ที่ผู้ใช้ส่งมามีอยู่จริงในฐานข้อมูล
    const productMap = new Map(productsFromDB.map((p) => [p.id, p]));
    const validatedItems = list_items.map((el) => {
      const product = productMap.get(el.productId);
      if (!product) {
        throw new Error(`❌ Product not found: ${el.product.name}`);
      }

      // 3️⃣ ตรวจสอบว่าสต็อกเพียงพอ
      if (product.stock < el.quantity) {
        throw new Error(`❌ Not enough stock for product: ${el.product.name}`);
      }


      // 4️⃣ คำนวณราคาสินค้าตอนทำการสั่งซื้อ โดยใช้ discount_show แทน discount
      const priceAtOrder = product.price;
      const discount = product.discount_show; // ใช้ discount_show แทน discount
      const discountAmount = discount == 0 ? 0 : (priceAtOrder * (discount / 100));

      const discountAtOrder = discount == 0 ? priceAtOrder : priceAtOrder * (discount / 100)

      const subTotalAmt = (priceAtOrder - discountAmount) * el.quantity; // ราคาสินค้าหลังหักส่วนลด
      
      return {
        productId: product.id,
        quantity: el.quantity,
        priceAtOrder, // บันทึกราคา ณ ตอนที่สั่งซื้อ
        discountAtOrder, // บันทึกส่วนลด ณ ตอนที่สั่งซื้อ
        subTotalAmt,
        discount,
      };
    });

    // 5️⃣ คำนวณ totalAmt ใหม่เพื่อป้องกันการแก้ไขราคา
    const totalAmt1 = validatedItems.reduce((sum, item) => sum + item.subTotalAmt, 0);
   
    if(totalAmt!==totalAmt1){
      throw new Error(`❌ มึง แอบโกงราคาใหมหนิ ลอง Refresh หน้าจอใหม่`)
    }

    // 6️⃣ สร้างคำสั่งซื้อ
    const order = await prisma.order.create({
      data: {
        userId,
        payment_status: "Pay By Cash",
        delivery_address: addressId,
        totalAmt:totalAmt1,
      },
    });

    // 7️⃣ เพิ่มข้อมูลสินค้าเข้าไปในคำสั่งซื้อ
    const productOnOrderData = validatedItems.map((el) => {
      const price = el.priceAtOrder;  // ใช้ priceAtOrder แทน price
      return {
        orderId: order.id,
        productId: el.productId,
        quantity: el.quantity,
        discount:el.discount,
        priceAtOrder: el.priceAtOrder,  // บันทึกราคา ณ ตอนที่สั่งซื้อ
        discountAtOrder: el.discountAtOrder,  // บันทึกส่วนลด ณ ตอนที่สั่งซื้อ
        subTotalAmt: el.subTotalAmt,
        price,  // เพิ่ม price ที่นี่
      };
    });

    await prisma.productOnOrder.createMany({
      data: productOnOrderData,
    });

    // 8️⃣ อัปเดตสต็อกสินค้าในฐานข้อมูล
    await prisma.$transaction(
      validatedItems.map((el) =>
        prisma.product.update({
          where: { id: el.productId },
          data: {
            stock: { decrement: el.quantity },
            sold: { increment: el.quantity },
          },
        })
      )
    );
    
    // 9️⃣ ลบสินค้าจากตะกร้าของผู้ใช้
    await prisma.cartProduct.deleteMany({ where: { userId } });

    // 🔟 อัปเดตรายการ shopping_cart ของผู้ใช้
    await prisma.user.update({
      where: { id: userId },
      data: { shopping_cart: { set: [] } },
    });

    return res.json({
      message: "✅ Order Successfully",
      error: false,
      success: true,
      data: productOnOrderData,
    });
  } catch (error) {
    console.error("❌ Error in cashOnDeliveryOrderController:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const paymentOrderController = async (req, res) => {  
  try {     
    const userId = req.user.id;     
    const { list_items, addressId, payment,totalAmt } = req.body;  

    // 0 ตรวจสอบการชำระเงินก่อน    
    if (!payment || payment.status !== "succeeded") {       
      throw new Error('❌ Payment failed or not completed.');     
    }     

    // 1️⃣ ดึงข้อมูลสินค้าโดยตรงจากฐานข้อมูล เพื่อป้องกันการปลอมแปลงข้อมูล     
    const productIds = list_items.map((item) => item.productId);     
    const productsFromDB = await prisma.product.findMany({       
      where: { id: { in: productIds } },       
      select: { id: true, price: true, discount_show: true, stock: true },     
    });  

    // 2️⃣ ตรวจสอบว่า productId ที่ผู้ใช้ส่งมามีอยู่จริงในฐานข้อมูล     
    const productMap = new Map(productsFromDB.map((p) => [p.id, p]));     
    const validatedItems = list_items.map((el) => {       
      const product = productMap.get(el.productId);       
      if (!product) {         
        throw new Error(`❌ Product not found: ${el.product.name}`);       
      }        

      // 3️⃣ ตรวจสอบว่าสต็อกเพียงพอ       
      if (product.stock < el.quantity) {         
        throw new Error(`❌ Not enough stock for product: ${el.product.name}`);       
      }        

      const priceAtOrder = product.price;
      // console.log('priceAtOrder',priceAtOrder)
      const discount = product.discount_show; // ใช้ discount_show แทน discount
      // console.log('discount',discount)
      const discountAmount = discount == 0 ? 0 : (priceAtOrder * (discount / 100));
      // console.log('discountAmount',discountAmount)
      const discountAtOrder = discount == 0 ? priceAtOrder : priceAtOrder * (discount / 100)
      // console.log('discountAtOrder',discountAtOrder)
      const subTotalAmt = (priceAtOrder - discountAmount) * el.quantity; // ราคาสินค้าหลังหักส่วนลด
      // console.log('subtotalAmt',subTotalAmt)
      return {
        productId: product.id,
        quantity: el.quantity,
        priceAtOrder, // บันทึกราคา ณ ตอนที่สั่งซื้อ
        discountAtOrder, // บันทึกส่วนลด ณ ตอนที่สั่งซื้อ
        subTotalAmt,
        discount,
      }; 
    });  

    // 4️⃣ คำนวณ totalAmt ใหม่เพื่อป้องกันการแก้ไขราคา     
    const totalAmt1 = validatedItems.reduce((sum, item) => sum + item.subTotalAmt, 0);  

    if(totalAmt!==totalAmt1){
      throw new Error(`❌ มึง แอบโกงราคาใหมหนิ ลอง Refresh หน้าจอใหม่`)
    }

  
    // 5️⃣ สร้างคำสั่งซื้อ     
    const order = await prisma.order.create({       
      data: {         
        userId,         
        payment_status: "Payment Online",         
        delivery_address: addressId,         
        totalAmt:totalAmt1,       
      },     
    });  

    // 6️⃣ เพิ่มข้อมูลสินค้าเข้าไปในคำสั่งซื้อ     
    const productOnOrderData = validatedItems.map((el) => {
      const price = el.priceAtOrder;  // ใช้ priceAtOrder แทน price
      return {
        orderId: order.id,
        productId: el.productId,
        quantity: el.quantity,
        priceAtOrder: el.priceAtOrder,
        discount:el.discount,  // บันทึกราคา ณ ตอนที่สั่งซื้อ
        discountAtOrder: el.discountAtOrder,  // บันทึกส่วนลด ณ ตอนที่สั่งซื้อ
        subTotalAmt: el.subTotalAmt,
        price,  // เพิ่ม price ที่นี่
      };
    }); 

    await prisma.productOnOrder.createMany({       
      data: productOnOrderData,     
    });  

    // 7️⃣ อัปเดตสต็อกสินค้าในฐานข้อมูล     
    await prisma.$transaction(       
      validatedItems.map((el) =>         
        prisma.product.update({           
          where: { id: el.productId },           
          data: {             
            stock: { decrement: el.quantity },             
            sold: { increment: el.quantity },           
          },         
        })       
      )     
    );           

    // 8️⃣ ลบสินค้าจากตะกร้าของผู้ใช้     
    await prisma.cartProduct.deleteMany({ where: { userId } });  

    // 9️⃣ อัปเดตรายการ shopping_cart ของผู้ใช้     
    await prisma.user.update({       
      where: { id: userId },       
      data: { shopping_cart: { set: [] } },     
    });  

    return res.json({       
      message: "✅ Order Successfully",       
      error: false,       
      success: true,       
      data: productOnOrderData,     
    });   
  } catch (error) {     
    console.error("❌ Error in paymentOrderController:", error);     
    return res.status(500).json({       
      message: error.message || error,       
      error: true,       
      success: false,     
    });   
  } 
};

export const payment = async (req, res) => {
  try {
    const { list_items } = req.body;

    // 1️⃣ ดึงข้อมูลสินค้าโดยตรงจากฐานข้อมูล เพื่อป้องกันการปลอมแปลงข้อมูล
    const productIds = list_items.map((item) => item.productId);
    const productsFromDB = await prisma.product.findMany({
      where: { id: { in: productIds } },
      select: { id: true, price: true, discount: true, stock: true },
    });

    // 2️⃣ ตรวจสอบว่า productId ที่ผู้ใช้ส่งมามีอยู่จริงในฐานข้อมูล
    const productMap = new Map(productsFromDB.map((p) => [p.id, p]));
    const validatedItems = list_items.map((el) => {
      const product = productMap.get(el.productId);
      if (!product) {
        throw new Error(`❌ Product not found: ${el.productId}`);
      }

      // 3️⃣ ตรวจสอบว่าสต็อกเพียงพอ
      if (product.stock < el.quantity) {
        throw new Error(`❌ Not enough stock for product: ${el.productId}`);
      }

      return {
        productId: product.id,
        quantity: el.quantity,
        price: product.price,
        discount: product.discount,
        subTotalAmt: (product.price - (product.price * (product.discount / 100))) * el.quantity,
      };
    });

    const totalAmt = validatedItems.reduce((sum, item) => sum + item.subTotalAmt, 0);

    const totalAmtRounded = Math.round(totalAmt * 100) / 100;  // ปัดเศษในหน่วยบาท

    // แปลงเป็นหน่วยเซนต์เพื่อส่งให้ Stripe
    const amountInCents = Math.round(totalAmtRounded * 100);  // ปัดเศษในหน่วยเซนต์

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInCents,
      currency: "thb",
      automatic_payment_methods: {
        enabled: true,
      }
    })

    res.send({ clientSecret: paymentIntent.client_secret })

  } catch (error) {
    console.error("❌ Error in payment:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export const getOrderController = async (req, res) => {
  try {
    let { page = 1, limit = 10,sortDate = 'desc' } = req.body;
    const userId = req.user.id;

    // คำนวณค่าของ skip และ take เพื่อการแบ่งหน้าตาม page และ limit
    const skip = (page - 1) * limit;
    const take = limit;

    // ใช้ Promise.all เพื่อดึงข้อมูลและจำนวนรวมพร้อมกัน
    const [data, totalCount] = await Promise.all([
      prisma.order.findMany({
        where: { userId }, 
        orderBy: 
          { createdAt: sortDate },
        skip,  
        take, 
        include:{
          productOnOrder:{
            include:{
              product:{
                include:{image:true}
              },
            }
          }
        } 
      }),
      prisma.order.count({
        where: { userId }, 
      }),
    ]);

    // ตรวจสอบว่าไม่มีข้อมูลหรือไม่
    if (data.length === 0) {
      return res.status(400).json({
        message: 'No orders found',
        error: true,
        success: false,
      });
    }

    // ส่งข้อมูลคำสั่งซื้อพร้อมจำนวนทั้งหมดและจำนวนหน้า
    return res.json({
      message: 'Get orders success',
      data,
      error: false,
      success: true,
      totalCount,
      totalNoPage: Math.ceil(totalCount / limit),  // คำนวณจำนวนหน้าทั้งหมด
    });
  } catch (error) {
    console.error("❌ Error in getOrderController:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};


