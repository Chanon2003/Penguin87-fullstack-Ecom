import { prisma } from '../lib/prisma.js'

export const addToCartItemController = async(req,res)=>{
  try {
    const userId = req.user.id
    const {productId} = req.body
    if(!productId){
      return res.status(402).json({
        message: 'Provide productId',
        error:true,
        success:false
      })
    }

    const checkItemCart = await prisma.cartProduct.findFirst({
      where:{userId:userId,productId:productId},
    })

    if(checkItemCart){
      return res.status(400).json({
        message:'Item already in cart'
      })
    }

    const cartItem = await prisma.cartProduct.create({
      data: {
        quantity: 1,
        userId: userId,
        productId: productId
      }
    });

    const updateCartUser = await prisma.user.update({
      where: { id: userId },
      data: {
        shopping_cart: {
          connect: { id: cartItem.id } // ✅ ใช้ `connect` ลิงก์ `CartProduct` กับ `User`
        }
      }
    });

    return res.json({
      data:cartItem,
      message:"cart item add",
      error:false,
      success:true
    })

  } catch (error) {
    console.error("❌ Error in addToCartItemController:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export const getCartItemController = async (req, res) => {
  try {
    const userId = req.user.id;

    const cartItems = await prisma.cartProduct.findMany({
      where: { userId: userId },
      include: {
        product: {
          include: {
            subcategories: true,
            image:true
          }
        },
      }
    });

    return res.json({
      data: cartItems,
      error: false,
      success: true
    });

  } catch (error) {
    console.error("❌ Error in getCartItemController:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const updateCartItemQtyController = async(req,res)=>{
  try {
    const userId = req.user.id
    const {id,qty} = req.body
    
    if(!id || !qty){
      return res.status(400).json({
        message:"provide id,qty"
      })
    }

    const updateCartItem = await prisma.cartProduct.update({
      where:{id:id,userId:userId},
      data:{
        quantity:qty
      }
    })

    return res.json({
      message:'Updated cart',
      data:updateCartItem,
      success:true,
      error:false
    })

  } catch (error) {
    console.error("❌ Error in updateCartItemQtyController:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export const deleteCartItemQtyController = async(req,res)=>{
  try {
    const userId = req.user.id
    const {id} = req.body

    if(!id){
      return res.status(400).json({
        message:'Provide id',
        error:true,
        success:false
      })
    }

    const deleteCartItem = await prisma.cartProduct.delete({
      where:{id:id,userId:userId}
    })

    return res.json({
      message:'Item remove',
      error:false,
      success:true,
      data:deleteCartItem
    })

  } catch (error) {
    console.error("❌ Error in deleteCartItemQtyController:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}