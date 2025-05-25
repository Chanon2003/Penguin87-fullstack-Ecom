import { prisma } from '../lib/prisma.js'

import { cloudinary } from '../utils/cloudinary.js';

export const AddCategoryController = async (req, res) => {
  try {
    const { name } = req.body;
    const file = req.file;

    if (!name || !file) {
      return res.status(400).json({
        message: "Enter required fields",
        error: true,
        success: false,
      });
    }

    const uploadedcatImages = {
      imageUrl: file.path,        // ถ้าใช้ Cloudinary ต้องเป็น secure_url
      publicId: file.filename,    // หรือ public_id ของ cloudinary
    };

    const addCategory = await prisma.category.create({
      data: {
        name,
        catimage: uploadedcatImages.imageUrl,
        catimagePublicId: uploadedcatImages.publicId,
      },
    });

    return res.status(201).json({
      message: "Category created successfully",
      data: addCategory,
      success: true,
      error: false,
    });

  } catch (error) {
    console.error("❌ Error in AddCategoryController1:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};


export const getCategoryController = async(req,res)=>{
  try {
    const data = await prisma.category.findMany({
      orderBy: {
        createdAt: "desc", 
      },
    });

    return res.json({
      data:data,
      error:false,
      success:true
    })
  } catch (error) {
    console.error("Error fetching categories:", error);
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export const updateCategoryController = async (req, res) => {
  try {
    const file = req.file;
    const { id, name, imagePublicId } = req.body;

    if (!id || !name) {
      return res.status(400).json({
        message: 'Required fields missing',
        success: false,
        error: true,
      });
    }

    let updatedData = {
      name,
    };

    // ถ้ามีไฟล์ใหม่ → ลบรูปเดิมแล้วอัปโหลดใหม่
    if (file) {
      if (imagePublicId) {
        await cloudinary.uploader.destroy(imagePublicId);
      }

      updatedData.catimage = file.path;
      updatedData.catimagePublicId = file.filename;
    }

    const update = await prisma.category.update({
      where: { id },
      data: updatedData,
    });

    return res.json({
      message: "Updated Category",
      success: true,
      error: false,
      data: update,
    });

  } catch (error) {
    console.error("❌ updateCategoryController1:", error);
    return res.status(500).json({
      message: error.message || "Internal Server Error",
      error: true,
      success: false,
    });
  }
};

export const deleteCategoryController = async (req, res) => {
  try {
    const { id,catimagePublicId } = req.body;

    if(!id || !catimagePublicId){
      return res.status(400).json({ message: 'Form is required',
        success:false,
        error:true
       });
    }
    // ตรวจสอบว่ามี subCategory ที่ใช้ category นี้หรือไม่
    const checkSubCategory = await prisma.subCategory.count({
      where: {
        categoryId: id, 
      },
    });

    // ตรวจสอบว่ามี product ที่ใช้ category นี้หรือไม่
    const checkProduct = await prisma.product.count({
      where: {
        categoryId: id  
      },
    });

    if (checkSubCategory > 0 || checkProduct > 0) {
      return res.status(400).json({
        message: "Category is already in use and cannot be deleted",
        error: true,
        success: false,
      });
    }

    // ลบรูปเก่าถ้ามี URL ของรูป
    await cloudinary.uploader.destroy(catimagePublicId);

    // ลบหมวดหมู่
    const deleteCategory = await prisma.category.delete({
      where: { id: id },
    });

    return res.json({
      message: "Delete category successfully",
      data: deleteCategory,
      error: false,
      success: true,
    });

  } catch (error) {
    console.error("deleteCategoryController:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

