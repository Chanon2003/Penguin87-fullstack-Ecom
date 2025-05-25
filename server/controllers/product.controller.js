import { prisma } from '../lib/prisma.js'

import { cloudinary } from "../utils/cloudinary.js";

export const createProductController = async (req, res) => {
  try {
    const {
      name,
      unit,
      stock,
      price,
      discount,
      discountStartTime,
      discountEndTime,
      description,
      more_details,
      category,
      subCategory = [],
    } = req.body;

    const image = req.files;

    const parsedStock = parseInt(stock, 10);
    const parsedPrice = parseFloat(price);
    const parsedDiscount = parseFloat(discount);

    // เตรียมรูปภาพ (หากมี)
    let uploadproductImage = [];
    if (image && image.length > 0) {
      uploadproductImage = image.map((file) => ({
        productimage: file.path,
        productimagePublicId: file.filename,
      }));
    }

    // ✅ ปรับให้ subCategory กลายเป็น array เสมอ
    const parsedSubCategory = Array.isArray(subCategory)
      ? subCategory
      : typeof subCategory === "string"
        ? [subCategory]
        : [];

    // ✅ คำนวณ discount_show
    let discountShow = parsedDiscount;

    if (discountStartTime && discountEndTime) {
      const now = new Date();

      // เช็คว่าเวลาปัจจุบันอยู่ในช่วงเวลาของ discount หรือไม่
      if (now >= new Date(discountStartTime) && now <= new Date(discountEndTime)) {
        discountShow = parsedDiscount; // ใช้ discount ปกติ
      } else {
        discountShow = 0; // ถ้าไม่อยู่ในช่วงเวลา ลดเป็น 0
      }
    }

    // ✅ Step 1: สร้าง product ก่อน
    const newProduct = await prisma.product.create({
      data: {
        name,
        unit,
        stock: parsedStock,
        price: parsedPrice,
        discount: parsedDiscount,
        discount_show: discountShow, // อัปเดต discount_show
        discount_start: discountStartTime ? new Date(discountStartTime) : null,
        discount_end: discountEndTime ? new Date(discountEndTime) : null,

        description,
        more_details: more_details || {},

        Category: {
          connect: { id: category },  // ส่ง parsedCategory ตรงๆ
        },

        image: {
          create: uploadproductImage,
        },
      },
      include: {
        image: true,
        Category: true,
      },
    });

    // ✅ Step 2: เก็บ relation productId <-> subCategoryId
    if (parsedSubCategory.length > 0) {
      const subCategoryRelations = parsedSubCategory.map((subId) => ({
        productId: newProduct.id,
        subCategoryId: subId,
      }));

      await prisma.productSubCategory.createMany({
        data: subCategoryRelations,
        skipDuplicates: true,
      });
    }

    // ✅ Step 3: ดึง product พร้อม relation กลับไปแสดง
    const fullProduct = await prisma.product.findUnique({
      where: { id: newProduct.id },
      include: {
        image: true,
        Category: true,
        subcategories: {
          include: {
            subCategory: true,
          },
        },
      },
    });

    return res.json({
      message: "✅ Product created successfully",
      data: fullProduct,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("❌ Error in createProductController:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getProductController = async (req, res) => {
  try {
    let { page, limit, search } = req.body;

    // Set default values for page and limit if not provided
    if (!page) {
      page = 1;
    }

    if (!limit) {
      limit = 10;
    }

    // Create the where clause for search if provided
    const whereClause = search
      ? {
        OR: [
          {
            name: {
              contains: search,
              mode: 'insensitive', // Case-insensitive search
            },
          },
          {
            description: {
              contains: search,
              mode: 'insensitive', // Case-insensitive search
            },
          },
        ],
      }
      : {};

    const skip = (page - 1) * limit;

    // Fetch data and count the total number of products
    const [data, totalCount] = await Promise.all([
      prisma.product.findMany({
        where: whereClause, // Apply search filter
        orderBy: {
          createdAt: 'desc', // Sort by createdAt in descending order
        },
        skip: skip, // Pagination offset
        take: limit, // Limit the number of records
        include: {
          Category: {
            select: { name: true }
          }, // Include related categories
          subcategories: {
            include: {
              subCategory: {
                select: {
                  name: true
                }
              }
            }
          },
          image: true,
          // Include related subcategories
        },
      }),
      prisma.product.count({
        where: whereClause, // Apply search filter for count
      }),
    ]);

    // Return the res with data, total count, and pagination details
    return res.json({
      message: 'Product data',
      error: false,
      success: true,
      totalCount: totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
      data: data,
    });
  } catch (error) {
    // Return error res in case of an exception
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getProductByCategory = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "❌ Provide category ID",
        error: true,
        success: false,
      });
    }

    // 🔎 ค้นหาสินค้าตาม category ID
    const products = await prisma.product.findMany({
      where: {
        Category: {
          id: id // ใช้ `connect` เพื่อเชื่อมโยงด้วย `id`
        }
      },
      include: {
        Category: true, // ดึงข้อมูลหมวดหมู่ของสินค้า
        subcategories: true, // ดึงข้อมูลหมวดหมู่ย่อย
        image: true, // ✅ ดึงข้อมูลรูปภาพที่เชื่อมโยงกับสินค้า
      },
      take: 15, 
      orderBy: {
        sold: 'desc'
      }// จำกัดผลลัพธ์ไม่เกิน 15 รายการ
    });

    return res.json({
      message: "✅ Category product list",
      data: products,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("❌ Error in getProductByCategory:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const getProductByCategoryAndSubCategory = async (req, res) => {
  try {
    let { page = 1, limit = 10, categoryId, subCategoryId } = req.body;

    if (!categoryId || !subCategoryId) {
      return res.status(400).json({
        message: "❌ Provide both categoryId and subCategoryId",
        error: true,
        success: false,
      });
    }

    // 🔥 ถ้า subCategoryId เป็น string เดียว → แปลงเป็น array
    if (!Array.isArray(subCategoryId)) {
      subCategoryId = [subCategoryId];
    }

    const skip = (page - 1) * limit;

    // ✅ ดึงสินค้า (ใช้ Category เป็น singular)
    const products = await prisma.product.findMany({
      where: {
        Category: { id: categoryId }, // ✅ ใช้แบบ relation ปกติ
        subcategories: {
          some: {
            subCategoryId: { in: subCategoryId },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: {
        Category: true, // ✅ ดึงข้อมูล category (เปลี่ยนจาก categories)
        subcategories: { select: { subCategory: true } },
        image: true,
      },
      orderBy:{sold:'desc'}
    });

    // ✅ นับจำนวนสินค้าทั้งหมด
    const totalCount = await prisma.product.count({
      where: {
        Category: { id: categoryId },
        subcategories: {
          some: {
            subCategoryId: { in: subCategoryId },
          },
        },
      },
    });

    return res.json({
      message: "✅ Product list retrieved successfully",
      data: products,
      totalCount,
      totalNoPage: Math.ceil(totalCount / limit),
      page,
      limit,
      success: true,
      error: false,
    });
  } catch (error) {
    console.error("❌ Error in getProductByCategoryAndSubCategory:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const getProductDetails = async (req, res) => {
  try {
    const { productId } = req.body;
  
    if (!productId) {
      return res.status(400).json({
        message: "❌ Product ID is required",
        error: true,
        success: false,
      });
    }

    // 🔥 ดึงข้อมูลสินค้า พร้อม `image`, `categories`, และ `subcategories`
    const product = await prisma.product.findFirst({
      where: { id: productId },
      include: {
        Category: true, // ✅ ดึงข้อมูล Category
        subcategories: { select: { subCategory: true } }, // ✅ ดึงข้อมูล SubCategory
        image: true, // ✅ ดึงข้อมูลรูปภาพ
      },
    });


    if (!product) {
      return res.status(404).json({
        message: "❌ Product not found",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "✅ Product details retrieved successfully",
      data: product,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("❌ Error in getProductDetails:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const updateProductDetails = async (req, res) => {
  try {
    const {
      id,
      name,
      unit,
      stock,
      price,
      discount,
      discountStartTime,
      discountEndTime,
      description,
      more_details,
      categoryId,
      subCategoryId = [],
    } = req.body;

    const { oldImagePublicIds } = req.body;
    let idsToDelete = [];
    try {
      idsToDelete = JSON.parse(oldImagePublicIds);
    } catch (err) {
      console.log("❌ Failed to parse publicIds");
    }

    let subCategory = [];
    if (typeof subCategoryId === 'string') {
      try {
        subCategory = JSON.parse(subCategoryId); // แปลงเป็น array
      } catch (err) {
        return res.status(400).json({
          message: "❌ Invalid subCategory format",
          error: true,
          success: false,
        });
      }
    }

    const files = req.files;

    if (!id) {
      return res.status(400).json({
        message: "❌ Provide product ID",
        error: true,
        success: false,
      });
    }

    const parsedStock = parseInt(stock, 10);
    const parsedPrice = parseFloat(price);
    const parsedDiscount = parseFloat(discount);

    // ✅ ตรวจสอบสินค้าว่ามีอยู่หรือไม่
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        Category: true,
        subcategories: { select: { id: true, subCategoryId: true } },
        image: true,
      },
    });

    if (!existingProduct) {
      return res.status(404).json({
        message: "❌ Product not found",
        error: true,
        success: false,
      });
    }

    // ✅ ตรวจสอบ category
    const existingCategory = await prisma.category.findFirst({
      where: { id: categoryId },
      select: { id: true },
    });

    const subCategoryIds = subCategory.map((el) => el);

    const existingSubCategories = await prisma.subCategory.findMany({
      where: {
        id: {
          in: subCategoryIds,
        },
      },
    });

    if (!existingCategory || existingSubCategories.length !== subCategoryIds.length) {
      return res.status(400).json({
        message: "❌ Some category or subcategory does not exist",
        error: true,
        success: false,
      });
    }

    // 1. ลบความสัมพันธ์เดิมในตารางกลางก่อน
    await prisma.productSubCategory.deleteMany({
      where: {
        productId: id, // id ของสินค้าที่กำลังอัปเดต
      },
    });

    // 2. เพิ่มความสัมพันธ์ใหม่เข้าไปใน ProductSubCategory
    if (Array.isArray(subCategory) && subCategory.length > 0) {
      const subCategoryData = subCategory.map((subId) => ({
        productId: id,
        subCategoryId: subId,
      }));

      await prisma.productSubCategory.createMany({
        data: subCategoryData,
      });
    }

    // ตั้งค่า discount_show ถ้ามีช่วงเวลาสำหรับส่วนลด
    let discountShow = discount;

    if (discountStartTime && discountEndTime) {
      const now = new Date();

      // เช็คว่าเวลาปัจจุบันอยู่ในช่วงเวลาของ discount หรือไม่
      if (now >= new Date(discountStartTime) && now <= new Date(discountEndTime)) {
        discountShow = discount; // ใช้ discount ปกติ
      } else {
        discountShow = 0; // ถ้าไม่อยู่ในช่วงเวลา ลดเป็น 0
      }
    }

    const parsedDiscountShow = parseFloat(discountShow); 
    
    const updateProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        unit,
        stock: parsedStock,
        price: parsedPrice,
        discount: parsedDiscount,
        discount_start: discountStartTime || null, // แปลงเป็น Date object
        discount_end: discountEndTime || null,
        description,
        more_details,
        Category: {
          connect: { id: categoryId },
        },
        discount_show: parsedDiscountShow, // อัปเดต discount_show
      },
    });

    // ถ้ามีรูปใหม่ให้เพิ่ม
    if (files && files.length > 0) {
      const imageCreateData = files.map((file) => ({
        productimage: file.path,
        productimagePublicId: file.filename,
        productId: id, // เชื่อมกับสินค้าที่อัปเดต
      }));

      await prisma.image.createMany({
        data: imageCreateData,
      });
    }

    // ✅ ลบรูปเดิมถ้ามี
    if (idsToDelete && idsToDelete.length > 0) {
      try {
        for (const img of idsToDelete) {
          // ลบจากฐานข้อมูลก่อน
          const deleteimage = await prisma.image.deleteMany({
            where: { productimagePublicId: img }
          });
          console.log(`ลบข้อมูลจากฐานข้อมูล: ${img}`);

          // ลบจาก Cloudinary
          console.log(`ลบรูปจาก Cloudinary: ${img}`);
          const result = await cloudinary.uploader.destroy(img);

          // ตรวจสอบผลลัพธ์จาก Cloudinary
          if (result.result === 'not found') {
            console.log(`ไม่พบรูปใน Cloudinary: ${img}`);
          } else {
            console.log('ผลการลบรูปจาก Cloudinary:', result);
          }
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการลบรูปจาก Cloudinary:', error);
        return res.status(500).json({
          message: '❌ ลบรูปจาก Cloudinary ล้มเหลว',
          error: true,
          success: false,
        });
      }
    } else {
      console.log('ไม่มีรูปให้ลบ');
    }

    // ✅ ดึงข้อมูลสินค้าใหม่ที่อัปเดตแล้ว
    const updatedProductData = await prisma.product.findUnique({
      where: { id },
      include: {
        Category: true,
        subcategories: { include: { subCategory: true } },
        image: true,
      },
    });

    return res.json({
      message: "✅ Product updated successfully",
      data: updatedProductData,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("❌ Error in updateProductDetails:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

//delete 
export const deleteProductDetails = async (req, res) => {
  try {
    const { id, oldImagePublicIds } = req.body

    if (!id) {
      return res.status(400).json({
        message: 'provide id',
        error: true,
        success: false
      })
    }

    if (oldImagePublicIds) {
      try {
        for (const img of oldImagePublicIds) {
          const result = await cloudinary.uploader.destroy(img);
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการลบรูปจาก Cloudinary:', error);
        return res.status(500).json({
          message: '❌ ลบรูปจาก Cloudinary ล้มเหลว',
          error: true,
          success: false,
        });
      }
    } else {
      console.log('ไม่มีรูปให้ลบ');
    }

    const soi = await prisma.$transaction([
      prisma.productSubCategory.deleteMany({ where: { productId: id } }),
      prisma.image.deleteMany({ where: { productId: id } }),
      prisma.product.delete({ where: { id: id } })
    ]);

    return res.json({
      message: 'Delete ProductSuccess',
      error: false,
      success: true,
      data: soi
    })
  } catch (error) {
    console.error("❌ Error in deleteProductDetails:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

//search product
export const searchProduct = async (req, res) => {
  try {
    let { search, page = 1, limit = 10 } = req.body;

    const where = search
      ? {
        OR: [
          { name: { contains: search, mode: "insensitive" } },
          { description: { contains: search, mode: "insensitive" } }
        ]
      }
      : {};

    const skip = (page - 1) * limit;

    const [data, dataCount] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { sold: "desc" },
        skip: skip,
        take: limit,
        include: {
          Category: true,
          subcategories: true,
          image: true
        }
      }),
      prisma.product.count({ where })
      
    ]);

    return res.json({
      message: "Product Data",
      error: false,
      success: true,
      data: data,
      totalCount: dataCount,
      totalPage: Math.ceil(dataCount / limit),
      page: page,
      limit: limit
    });

  } catch (error) {
    console.error("❌ Error in searchProduct:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}


import cron from 'node-cron';


cron.schedule('* * * * *', async () => {
  const now = new Date();

  try {
    // อัปเดต discount_show เมื่อถึงเวลาเริ่มต้น
    await prisma.product.updateMany({
      where: {
        discount_start: {
          lte: now,
        },
        discount_end: {
          gte: now,
        },
        discount_show: {
          lt: 1, // แสดงเฉพาะสินค้าที่ยังไม่มีการตั้งค่า discount_show
        },
      },
      data: {
        discount_show: prisma.product.discount, // ตั้งค่า discount_show ให้เป็น discount
      },
    });

    // อัปเดต discount_show เป็น 0 เมื่อหมดเวลา
    await prisma.product.updateMany({
      where: {
        discount_end: {
          lte: now,
        },
        discount_show: {
          gt: 0, // แสดงเฉพาะสินค้าที่มี discount_show
        },
        discount: {
          gt: 0, 
        }
      },
      data: {
        discount_show: 0, // ตั้งค่า discount_show เป็น 0
      },
    });

      // ✅ ปิด discount_show เมื่อ stock หมด
      await prisma.product.updateMany({
        where: {
          stock: {
            lte: 0,
          },
          discount_show: {
            gt: 0,
          },
          discount: {
            gt: 0,
          }
        },
        data: {
          discount_show: 0,
        },
      });

    console.log('Updated discount_show based on discount start/end times');
  } catch (error) {
    console.error('Error updating discount_show:', error);
  }
});










