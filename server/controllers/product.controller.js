import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient();


export const createProductController = async (req, res) => {
  try {
    const {
      name,
      image = [], 
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
      category = [],
      subCategory = []
    } = req.body;

    console.log("📷 รูปภาพที่ได้รับ:", image);

    // 🔥 กรอง blob ออก (เพราะเป็น preview URL ของเบราว์เซอร์)
    const filteredImages = image.filter(img => !img.startsWith("blob:"));

    // console.log("✅ รูปภาพที่จะถูกบันทึกลงฐานข้อมูล:", filteredImages);

    // แปลงค่าให้ถูกต้อง
    const parsedStock = parseInt(stock, 10);
    const parsedPrice = parseFloat(price);
    const parsedDiscount = parseFloat(discount);

    // 🛒 สร้าง Product
    const newProduct = await prisma.product.create({
      data: {
        name,
        unit,
        stock: parsedStock,
        price: parsedPrice,
        discount: parsedDiscount,
        description,
        more_details: more_details || {},

        // เชื่อม Category
        categories: {
          create: category.map(cat => ({
            category: { connect: { id: cat.id } }
          }))
        },

        // เชื่อม SubCategory
        subcategories: {
          create: subCategory.map(subCat => ({
            subCategory: { connect: { id: subCat.id } }
          }))
        }
      },
    });

    console.log("🆕 สร้างสินค้าสำเร็จ:", newProduct);

    // 🖼️ เพิ่มรูปภาพไปยังตาราง Image (หลังจาก newProduct ถูกสร้างแล้ว)
    if (filteredImages.length > 0) {
      await prisma.image.createMany({
        data: filteredImages.map(img => ({
          url: img,
          productId: newProduct.id,
        })),
      });
    }

    // 📸 ดึงข้อมูลเฉพาะรูปภาพที่เพิ่งสร้าง
    const createdImages = await prisma.image.findMany({
      where: { productId: newProduct.id }
    });

    // 🔄 ดึงข้อมูลสินค้าที่เพิ่งสร้าง (รวม category และ subCategory)
    const createdProduct = await prisma.product.findUnique({
      where: { id: newProduct.id },
      include: {
        categories: true,
        subcategories: true
      }
    });

    return res.json({
      message: "✅ Product created successfully",
      data: {
        ...createdProduct,
        image: createdImages, // ส่งรูปภาพที่เชื่อมกับ product
      },
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
          categories: {
            include: {
              category: {
                select: {
                  name: true // ✅ ดึง name จาก Category
                }
              }
            }
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
        categories: {
          some: {
            categoryId: id, // ✅ ใช้ categoryId จากตารางกลาง
          },
        },
      },
      include: {
        categories: true, // ดึงข้อมูลหมวดหมู่ของสินค้า
        subcategories: true, // ดึงข้อมูลหมวดหมู่ย่อย
        image: true, // ✅ ดึงข้อมูลรูปภาพที่เชื่อมโยงกับสินค้า
      },
      take: 15, // จำกัดผลลัพธ์ไม่เกิน 15 รายการ
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

    // 🔥 ถ้า `subCategoryId` เป็น string เดียว ให้เปลี่ยนเป็น array
    if (!Array.isArray(subCategoryId)) {
      subCategoryId = [subCategoryId];
    }

    const skip = (page - 1) * limit;

    // 🔥 ดึงข้อมูลสินค้า
    const products = await prisma.product.findMany({
      where: {
        categories: {
          some: { categoryId: categoryId }, // ✅ ค้นหาสินค้าจาก categoryId
        },
        subcategories: {
          some: { subCategoryId: { in: subCategoryId } }, // ✅ ค้นหาสินค้าจากหลาย subCategoryId
        },
      },
      orderBy: { createdAt: "desc" }, // ✅ เรียงตามวันที่สร้างใหม่ล่าสุด
      skip,
      take: limit,
      include: {
        categories: { select: { category: true } }, // ✅ ดึงข้อมูล Category
        subcategories: { select: { subCategory: true } }, // ✅ ดึงข้อมูล SubCategory
        image: true, // ✅ ดึงข้อมูลรูปภาพของสินค้า
      },
    });

    // 🔥 นับจำนวนสินค้าทั้งหมด
    const totalCount = await prisma.product.count({
      where: {
        categories: { some: { categoryId: categoryId } },
        subcategories: { some: { subCategoryId: { in: subCategoryId } } },
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
        categories: { select: { category: true } }, // ✅ ดึงข้อมูล Category
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

    // console.log("✅ Product Details:", product);

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

//update product
export const updateProductDetails1 = async (req, res) => {
  try {
    const {
      id,
      name,
      image = [],
      unit,
      stock,
      price,
      discount,
      description,
      more_details,
      category = [], // รับ id ของตารางกลาง ProductCategory หรือ id ของ Category
      subCategory = [], // รับ id ของตารางกลาง ProductSubCategory หรือ id ของ SubCategory
    } = req.body;

    if (!id) {
      return res.status(400).json({
        message: "❌ Provide product ID",
        error: true,
        success: false,
      });
    }

    const filteredImages = image.filter((img) => !img.startsWith("blob:"));
    const parsedStock = parseInt(stock, 10);
    const parsedPrice = parseFloat(price);
    const parsedDiscount = parseFloat(discount);

    console.log("📂 categories (ใหม่)", category);
    console.log("📂 subcategories (ใหม่)", subCategory);

    // ✅ ดึงข้อมูลสินค้าเดิม
    const existingProduct = await prisma.product.findUnique({
      where: { id },
      include: {
        categories: { select: { id: true, categoryId: true } },
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

    const existingCategoryIds = existingProduct.categories?.map((c) => c.id) || [];
    const existingSubCategoryIds = existingProduct.subcategories?.map((s) => s.id) || [];
    const existingImages = existingProduct.image?.map((img) => img.url) || [];

    console.log("🔍 Categories เดิม:", existingCategoryIds);
    console.log("🔍 Subcategories เดิม:", existingSubCategoryIds);

    // ✅ หาค่าที่ต้องเพิ่ม
    const newCategoryIds = category.map((cat) => cat.id); // ใช้ id ของตารางกลาง ProductCategory หรือ id ของ Category
    const newSubCategoryIds = subCategory.map((sub) => sub.id); // ใช้ id ของตารางกลาง ProductSubCategory หรือ id ของ SubCategory

    console.log("✅ Categories ที่ต้องเพิ่ม:", newCategoryIds);
    console.log("✅ SubCategories ที่ต้องเพิ่ม:", newSubCategoryIds);

    // ✅ ตรวจสอบว่าหมวดหมู่ใหม่มีอยู่ในตาราง ProductCategory หรือ Category
    const existingCategories = await prisma.productCategory.findMany({
      where: { id: { in: newCategoryIds } },
      select: { id: true, categoryId: true },
    });

    const existingCategoriesFallback = await prisma.category.findMany({
      where: { id: { in: newCategoryIds } },
      select: { id: true },
    });

    const validCategoryIds = [
      ...existingCategories.map((c) => c.id),
      ...existingCategoriesFallback.map((c) => c.id),
    ];
    const invalidCategoryIds = newCategoryIds.filter((id) => !validCategoryIds.includes(id));

    if (invalidCategoryIds.length > 0) {
      console.warn("⚠️ Some categories do not exist in the database:", invalidCategoryIds);
      return res.status(400).json({
        message: `❌ Some categories do not exist in the database: ${invalidCategoryIds.join(", ")}`,
        error: true,
        success: false,
      });
    }

    // ✅ ตรวจสอบว่าหมวดหมู่ย่อยใหม่มีอยู่ในตาราง ProductSubCategory หรือ SubCategory
    const existingSubCategories = await prisma.productSubCategory.findMany({
      where: { id: { in: newSubCategoryIds } },
      select: { id: true, subCategoryId: true },
    });

    const existingSubCategoriesFallback = await prisma.subCategory.findMany({
      where: { id: { in: newSubCategoryIds } },
      select: { id: true },
    });

    const validSubCategoryIds = [
      ...existingSubCategories.map((s) => s.id),
      ...existingSubCategoriesFallback.map((s) => s.id),
    ];
    const invalidSubCategoryIds = newSubCategoryIds.filter((id) => !validSubCategoryIds.includes(id));

    if (invalidSubCategoryIds.length > 0) {
      console.warn("⚠️ Some subcategories do not exist in the database:", invalidSubCategoryIds);
      return res.status(400).json({
        message: `❌ Some subcategories do not exist in the database: ${invalidSubCategoryIds.join(", ")}`,
        error: true,
        success: false,
      });
    }

    // ✅ อัปเดต Categories โดยใช้ deleteMany และ create
    await prisma.product.update({
      where: { id },
      data: {
        categories: {
          deleteMany: {}, // ลบข้อมูลเดิมทั้งหมด
          create: [
            ...existingCategories.map((cat) => ({
              category: { connect: { id: cat.categoryId } }, // เชื่อมโยงกับ Category ผ่าน categoryId
            })),
            ...existingCategoriesFallback.map((cat) => ({
              category: { connect: { id: cat.id } }, // เชื่อมโยงกับ Category ผ่าน id
            })),
          ],
        },
      },
    });

    // ✅ อัปเดต Subcategories โดยใช้ deleteMany และ create
    await prisma.product.update({
      where: { id },
      data: {
        subcategories: {
          deleteMany: {}, // ลบข้อมูลเดิมทั้งหมด
          create: [
            ...existingSubCategories.map((sub) => ({
              subCategory: { connect: { id: sub.subCategoryId } }, // เชื่อมโยงกับ SubCategory ผ่าน subCategoryId
            })),
            ...existingSubCategoriesFallback.map((sub) => ({
              subCategory: { connect: { id: sub.id } }, // เชื่อมโยงกับ SubCategory ผ่าน id
            })),
          ],
        },
      },
    });

    // ✅ อัปเดตรูปภาพ: ลบรูปที่ไม่มีอยู่แล้ว
    const imagesToRemove = existingImages.filter((img) => !filteredImages.includes(img));
    if (imagesToRemove.length > 0) {
      await prisma.image.deleteMany({
        where: {
          productId: id,
          url: { in: imagesToRemove },
        },
      });
    }

    // ✅ เพิ่มเฉพาะรูปที่ยังไม่มี
    const newImages = filteredImages.filter((img) => !existingImages.includes(img));
    if (newImages.length > 0) {
      await prisma.image.createMany({
        data: newImages.map((img) => ({
          url: img,
          productId: id,
        })),
      });
    }

    // ✅ อัปเดตข้อมูลสินค้า
    await prisma.product.update({
      where: { id },
      data: {
        name,
        unit,
        stock: parsedStock,
        price: parsedPrice,
        discount: parsedDiscount,
        description,
        more_details,
      },
    });

    // 🔄 ดึงข้อมูลสินค้าใหม่
    const updatedProductData = await prisma.product.findUnique({
      where: { id },
      include: {
        categories: { include: { category: true } },
        subcategories: { include: { subCategory: true } },
        image: true,
      },
    });

    return res.json({
      message: "✅ Product updated successfully",
      data: {
        ...updatedProductData,
        image: filteredImages,
      },
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
    const { id } = req.body

    if (!id) {
      return res.status(400).json({
        message: 'provide id',
        error: true,
        success: false
      })
    }

    const soi = await prisma.$transaction([
      prisma.productCategory.deleteMany({ where: { productId: id } }),
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
        orderBy: { createdAt: "desc" },
        skip: skip,
        take: limit,
        include: {
          categories: true,
          subcategories: true,
          image:true
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
      totalPage : Math.ceil(dataCount/limit),
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










