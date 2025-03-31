import { PrismaClient } from '@prisma/client'
import deleteImageCloudinary from '../utils/deleteImageCloudinary.js';
const prisma = new PrismaClient();


export const AddSubCategoryController = async (req, res) => {
  try {
    const { name, image, category } = req.body;

    // ตรวจสอบให้แน่ใจว่ามีการส่งข้อมูล name, image, และ category
    if (!name || !image || !category || category.length === 0) {
      return res.status(400).json({
        message: 'Provide name, image, and category',
        error: true,
        success: false
      });
    }

    // ตรวจสอบว่า categories ที่ส่งมามีอยู่ในฐานข้อมูลหรือไม่
    const categories = await prisma.category.findMany({
      where: {
        id: {
          in: category.map((cat) => cat.id), // ตรวจสอบ id ที่ส่งมา
        },
      },
    });

    if (categories.length !== category.length) {
      return res.status(404).json({
        message: 'Some categories not found',
        error: true,
        success: false,
      });
    }

    // สร้าง payload สำหรับการสร้าง SubCategory
    const payload = {
      name,
      image,
      categoryRelations: { // ใช้ categoryRelations แทน category
        create: category.map(cat => ({
          category: { connect: { id: cat.id } } // เชื่อม Category ที่มี id
        }))
      }
    };

    // สร้าง SubCategory
    const createSubCategory = await prisma.subCategory.create({
      data: payload
    });

    // ส่ง response กลับไป
    return res.json({
      message: 'Sub category created',
      data: createSubCategory,
      error: false,
      success: true
    });

  } catch (error) {
    console.error("❌ Error in AddSubCategoryController:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};


export const getSubCategoryController = async (req, res) => {
  try {
    const data = await prisma.subCategory.findMany({
      orderBy: {
        createdAt: 'desc'  // เรียงจากใหม่ไปเก่า
      },
      include: {
        categoryRelations: {  // ใช้ categoryRelations เพื่อดึงความสัมพันธ์ Many-to-Many
          include: {
            category: true,  // ดึงข้อมูล Category ที่เชื่อมโยง
          }
        }
      }
    });

    return res.json({
      message: 'Sub Category data',
      error: false,
      success: true,
      data: data
    });

  } catch (error) {
    console.error("❌ Error in getSubCategoryController:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export const updateSubCategoryController = async (req, res) => {
  try {
    const { id, name, image, category } = req.body;

    console.log("📌 Received category data:", category);

    // ตรวจสอบว่า ID มีอยู่ในฐานข้อมูลหรือไม่
    const checkSub = await prisma.subCategory.findUnique({
      where: { id },
    });

    if (!checkSub) {
      return res.status(400).json({
        message: 'Invalid subcategory ID',
        error: true,
        success: false,
      });
    }

    // ตรวจสอบ category
    if (!Array.isArray(category) || category.length === 0) {
      return res.status(400).json({
        message: 'Category must be a non-empty array',
        error: true,
        success: false,
      });
    }

    // ดึง categoryIds และตรวจสอบค่าที่ถูกต้อง
    const categoryIds = category
      .map(cat => cat.id || cat.categoryId) // รองรับทั้ง id และ categoryId
      .filter(id => typeof id === 'string' && id.trim() !== '');

    console.log("✅ Extracted categoryIds:", categoryIds);

    if (categoryIds.length === 0) {
      return res.status(400).json({
        message: 'No valid category IDs found',
        error: true,
        success: false,
      });
    }

    // ตรวจสอบว่า categoryId ที่ส่งมา มีอยู่ในฐานข้อมูลหรือไม่
    const existingCategories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true },
    });

    if (existingCategories.length !== categoryIds.length) {
      return res.status(400).json({
        message: 'Some category IDs are invalid',
        error: true,
        success: false,
      });
    }

    // ลบความสัมพันธ์เก่าของ SubCategory ใน CategorySubCategory
    await prisma.categorySubCategory.deleteMany({
      where: { subcategoryId: id },
    });

    // สร้างความสัมพันธ์ใหม่
    await prisma.categorySubCategory.createMany({
      data: categoryIds.map(categoryId => ({
        subcategoryId: id,
        categoryId: categoryId,
      })),
    });

    // อัปเดตข้อมูล SubCategory
    const updateSubCategory = await prisma.subCategory.update({
      where: { id },
      data: { name, image },
    });

    return res.json({
      message: 'Subcategory updated successfully',
      data: updateSubCategory,
      error: false,
      success: true,
    });

  } catch (error) {
    console.error("❌ Error in updateSubCategoryController:", error);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: true,
      success: false,
    });
  }
};


export const deleteSubCategoryController = async (req, res) => {
  try {
    const { id } = req.body;
    const url1 = req.body.image
    
    const getPublicIdFromUrl = (url) => {
      try {
        // Regex to match the public_id from the URL
        const regex = /\/upload\/v\d+\/(.+?)\.\w{3,4}$/;
        const match = url.match(regex);

        if (match) {
          const public_id = match[1]; // Extract the public_id
          return public_id;
        } else {
          throw new Error('Invalid URL format');
        }
      } catch (error) {
        console.error("❌ Error parsing the URL:", error);
        return null;
      }
    };

    if (url1) {
      console.log("🔍 Checking old image URL:", url1);
      const public_id = getPublicIdFromUrl(url1);

      if (public_id) {
        console.log("🗑️ Extracted public_id:", public_id);

        try {
          console.log("🚀 Attempting to delete old image:", public_id);
          await deleteImageCloudinary(public_id); // ลบรูปภาพเก่า
          console.log("✅ Old image deleted successfully");
        } catch (deleteError) {
          console.error("❌ Error deleting old image:", deleteError);
        }
      } else {
        console.error("❌ No valid public_id found in oldImageUrl");
      }
    }

    // ลบความสัมพันธ์ใน CategorySubCategory ก่อน
    await prisma.categorySubCategory.deleteMany({
      where: { subcategoryId: id },
    });

    // ลบ SubCategory
    const deleteSub = await prisma.subCategory.delete({
      where: { id },
    });

    return res.json({
      message: 'Deleted successfully',
      data: deleteSub,
      error: false,
      success: true,
    });
  } catch (error) {
    console.error("❌ Error in deleteSubCategoryController:", error);
    return res.status(500).json({
      message: 'Internal Server Error',
      error: true,
      success: false,
    });
  }
};





