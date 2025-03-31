import { PrismaClient } from '@prisma/client'
import deleteImageCloudinary from '../utils/deleteImageCloudinary.js';
const prisma = new PrismaClient();


export const AddCategoryController = async (req, res) => {
  try {
    const { name, image } = req.body;

    // ตรวจสอบว่ามีการส่งข้อมูลที่จำเป็นหรือไม่
    if (!name || !image) {
      return res.status(400).json({
        message: "Enter required fields",
        error: true,
        success: false,
      });
    }

    // สร้าง Category ใหม่ในฐานข้อมูล
    const addCategory = await prisma.category.create({
      data: {
        name,
        image,
      },
    });

    // ตรวจสอบว่าการสร้างสำเร็จหรือไม่
    if (!addCategory) {
      return res.status(500).json({
        message: "Not Created",
        error: true,
        success: false,
      });
    }

    return res.json({
      message: "Add Category",
      data: addCategory,
      success: true,
      error: false,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
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

export const updateCategoryController = async(req,res)=>{
  try {
    const {name,image} = req.body
    const categoryId = req.body.id
    // console.log('categoryid',categoryId)

    const update = await prisma.category.update({
      where:{id:categoryId},
      data:{
        name,
        image
      }
    })

    return res.json({
      message : 'Updated Category',
      success:true,
      error:false,
      data:update
    })
  } catch (error) {
    console.error("updateCategoryController:", error);
    return response.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
}

export const deleteCategoryController = async (req, res) => {
  try {
    const { id } = req.body;
    const url1 = req.body.image;

    // ตรวจสอบว่ามี subCategory ที่ใช้ category นี้หรือไม่
    const checkSubCategory = await prisma.categorySubCategory.count({
      where: {
        categoryId: id, 
      },
    });

    // ตรวจสอบว่ามี product ที่ใช้ category นี้หรือไม่
    const checkProduct = await prisma.product.count({
      where: {
        categories: { 
          some: { categoryId: id }, 
        },
      },
    });

    if (checkSubCategory > 0 || checkProduct > 0) {
      return res.status(400).json({
        message: "Category is already in use and cannot be deleted",
        error: true,
        success: false,
      });
    }

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

    // ลบรูปเก่าถ้ามี URL ของรูป
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

