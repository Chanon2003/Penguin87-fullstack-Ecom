import { prisma } from '../lib/prisma.js'

import { cloudinary } from '../utils/cloudinary.js';


export const AddSubCategoryController = async (req, res) => {
  try {
    const { name, categoryId } = req.body;
    const file = req.file

    // ตรวจสอบให้แน่ใจว่ามีการส่งข้อมูล name, image, และ category
    if (!name || !categoryId || !file) {
      return res.status(400).json({
        message: 'Provide name, image, and category',
        error: true,
        success: false
      });
    }

    // ตรวจสอบว่า categories ที่ส่งมามีอยู่ในฐานข้อมูลหรือไม่
    const categories = await prisma.category.findMany({
      where: {
        id: categoryId
      },
    });

    if (!categories) {
      return res.status(404).json({
        message: 'categories not found',
        error: true,
        success: false,
      });
    }

    const uploadedsubCatImages = {
      imageUrl: file.path,        // ถ้าใช้ Cloudinary ต้องเป็น secure_url
      publicId: file.filename,    // หรือ public_id ของ cloudinary
    };

    // สร้าง SubCategory
    const createSubCategory = await prisma.subCategory.create({
      data: {
        name,
        subcatimage: uploadedsubCatImages.imageUrl,
        subcatimagePublicId: uploadedsubCatImages.publicId,
        Category: {
          connect: { id: categoryId }, // ใช้ relation object แบบ connect
        },
      },
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
        Category: true,  // ดึงข้อมูล Category ที่เชื่อมโยง
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
    const file = req.file;
    const { id, name, imagePublicId,categoryId } = req.body;

    if (!id || !name || !categoryId) {
      return res.status(400).json({
        message: 'Required fields missing',
        success: false,
        error: true,
      });
    }

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

    // ตรวจสอบว่า categoryId ที่ส่งมา มีอยู่ในฐานข้อมูลหรือไม่
    const existingCategories = await prisma.category.findMany({
      where: { id:  categoryId  },
      select: { id: true },
    });

    if (existingCategories[0].id !== categoryId) {
      return res.status(400).json({
        message: 'Some category IDs are invalid',
        error: true,
        success: false,
      });
    }

    let updatedData = {
      name,
      categoryId
    };

       if (file) {
          if (imagePublicId) {
            await cloudinary.uploader.destroy(imagePublicId);
          }
          updatedData.subcatimage  = file.path;
          updatedData.subcatimagePublicId = file.filename;
        }

    // อัปเดตข้อมูล SubCategory
    const updateSubCategory = await prisma.subCategory.update({
      where: { id },
      data: updatedData,
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
    const { id,subcatimagePublicId  } = req.body;
    
    if(!id || !subcatimagePublicId){
      return res.status(400).json({ 
        message: 'Form is required',
        success:false,
        error:true
       });
    }

    const checkProduct = await prisma.product.count({
      where: {
        subcategories: { 
          some: { subCategoryId: id }, 
        },
      },
    });

    if (checkProduct > 0) {
      return res.status(400).json({
        message: "SubCategory is already in use in Product and cannot be deleted",
        error: true,
        success: false,
      });
    }

   // ลบรูปเก่าถ้ามี URL ของรูป
    await cloudinary.uploader.destroy(subcatimagePublicId);

    // ลบ SubCategory
    const deleteSub = await prisma.subCategory.delete({
      where: { id:id },
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





