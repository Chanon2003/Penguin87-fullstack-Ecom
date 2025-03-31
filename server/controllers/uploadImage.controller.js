import deleteImageCloudinary from '../utils/deleteImageCloudinary.js';
import uploadImageClodinaryCTG from '../utils/uploadImageClodinaryCTG.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const uploadImageController = async (req, res) => {
  try {
    console.log('🟢 req.file:', req.file);
    console.log('req body', req.body)

    const file = req.file;
    let { categoryId, oldImageUrl } = req.body;

    console.log('old image url uploadImage ctr', oldImageUrl)

    // ฟังก์ชันตรวจสอบและดึง public_id จาก URL
    const getPublicIdFromUrl = (url) => {
      try {
        // ใช้ regex เพื่อจับ public_id จาก URL ของ Cloudinary
        const regex = /\/upload\/v\d+\/(.+?)\.\w{3,4}$/;
        const match = url.match(regex);

        if (match) {
          const public_id = match[1];  // แสดงส่วนของ public_id
          return public_id;
        } else {
          throw new Error('Invalid URL format');
        }
      } catch (error) {
        console.error("❌ Error parsing the URL:", error);
        return null;
      }
    };

    // ลบไฟล์เก่าหากมี oldImageUrl
    if (oldImageUrl) {
      console.log("🔍 Checking old image URL:", oldImageUrl);
      const public_id = getPublicIdFromUrl(oldImageUrl);

      if (public_id) {
        console.log("🗑️ Extracted public_id:", public_id);

        try {
          console.log("🚀 Attempting to delete old image:", public_id);
          await deleteImageCloudinary(public_id);  // ลบไฟล์เก่า
          console.log("✅ Old image deleted successfully");
        } catch (deleteError) {
          console.error("❌ Error deleting old image:", deleteError);
        }
      } else {
        console.error("❌ No valid public_id found in oldImageUrl");
      }
    }

    // อัปโหลดไฟล์ใหม่ถ้ามี
    let uploadImage = null;
    if (file) {
      console.log("🚀 Uploading new image to Cloudinary...");
      uploadImage = await uploadImageClodinaryCTG(file);  // อัปโหลดไฟล์ใหม่
      console.log("✅ Upload success:", uploadImage);
    } else {
      console.log("⚠️ No new file uploaded.");
    }

    return res.json({
      message: "Upload done",
      data: uploadImage,  // ส่งข้อมูลไฟล์ที่อัปโหลดกลับ
      success: true,
      error: false
    });

  } catch (error) {
    console.error("❌ Error in uploadImageController:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const uploadImageControllers = async (req, res) => {
  try {
    console.log('🟢 req.files:', req.files);
    console.log('req body', req.body);

    const files = req.files; // รับอาร์เรย์ของไฟล์
    let { categoryId, oldImageUrls } = req.body;

    console.log('old image urls uploadimagess ctr', oldImageUrls);

    // ฟังก์ชันตรวจสอบและดึง public_id จาก URL
    const getPublicIdFromUrl = (url) => {
      try {
        const regex = /\/upload\/v\d+\/(.+?)\.\w{3,4}$/;
        const match = url.match(regex);
        return match ? match[1] : null;
      } catch (error) {
        console.error("❌ Error parsing the URL:", error);
        return null;
      }
    };

    // ลบไฟล์เก่าหากมี oldImageUrls (รองรับหลายไฟล์)
    if (oldImageUrls) {
      const oldImagesArray = Array.isArray(oldImageUrls) ? oldImageUrls : [oldImageUrls]; // แปลงเป็นอาร์เรย์ถ้าไม่ใช่
      console.log("🔍 Checking old image URLs:", oldImagesArray);

      for (const url of oldImagesArray) {
        const public_id = getPublicIdFromUrl(url);
        console.log('url before delete', url)
        if (public_id) {
          console.log("🗑️ Deleting old image:", public_id);
          try {
            await deleteImageCloudinary(public_id);
            console.log("✅ Old image deleted:", public_id);
          } catch (deleteError) {
            console.error("❌ Error deleting old image:", deleteError);
          }
        }
      }
    }

    // อัปโหลดไฟล์ใหม่ถ้ามี
    let uploadedImages = [];
    if (files.length > 0) {
      console.log("🚀 Uploading new images to Cloudinary...");
      uploadedImages = await Promise.all(
        files.map(async (file) => {
          const result = await uploadImageClodinaryCTG(file);
          return result;
        })
      );
      console.log("✅ Upload success:", uploadedImages);
    } else {
      console.log("⚠️ No new files uploaded.");
    }

    return res.json({
      message: "Upload done",
      data: uploadedImages, // ส่งข้อมูลไฟล์ที่อัปโหลดกลับ
      success: true,
      error: false,
    });

  } catch (error) {
    console.error("❌ Error in uploadImageController:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const updateImageControllers = async (req, res) => {
  try {
    console.log('🟢 req.files:', req.files);
    console.log('🟢 req.body:', req.body);

    
    let oldImageUrls = req.body.oldImageUrls || req.body.get("oldImageUrls");
    console.log('🔍 Received oldImageUrls:', oldImageUrls);

    const files = req.files; // รับอาร์เรย์ของไฟล์
    let { oldImagesToDelete } = req.body; // ✅ รับค่าที่ส่งมาจาก frontend

    // ✅ ฟังก์ชันแปลง URL -> Public ID
    const getPublicIdFromUrl = (url) => {
      try {
        const regex = /\/upload\/v\d+\/(.+?)\.\w{3,4}$/;
        const match = url.match(regex);
        return match ? match[1] : null;
      } catch (error) {
        console.error("❌ Error parsing the URL:", error);
        return null;
      }
    };

    // ✅ ตรวจสอบและแปลง `oldImagesToDelete` เป็นอาร์เรย์
    if (oldImagesToDelete) {
      try {
        oldImagesToDelete = JSON.parse(oldImagesToDelete);
        console.log("🔍 Parsed old image URLs:", oldImagesToDelete);
      } catch (error) {
        console.error("❌ Error parsing oldImagesToDelete:", error);
        return res.status(400).json({
          message: "Invalid oldImagesToDelete format",
          error: true,
          success: false,
        });
      }
    }

    // ✅ ลบไฟล์เก่าถ้ามี
    if (Array.isArray(oldImagesToDelete) && oldImagesToDelete.length > 0) {
      console.log("🗑️ Deleting old images...");
      for (const url of oldImagesToDelete) {
        const public_id = getPublicIdFromUrl(url);
        if (public_id) {
          console.log("🗑️ Deleting:", public_id);
          try {
            await deleteImageCloudinary(public_id);
            console.log("✅ Deleted:", public_id);
          } catch (deleteError) {
            console.error("❌ Error deleting image:", deleteError);
          }
        }
      }
    }

    // ✅ อัปโหลดไฟล์ใหม่ถ้ามี
    let uploadedImages = [];
    if (files.length > 0) {
      console.log("🚀 Uploading new images...");
      uploadedImages = await Promise.all(
        files.map(async (file) => {
          const result = await uploadImageClodinaryCTG(file);
          return result;
        })
      );
      console.log("✅ Upload success:", uploadedImages);
    } else {
      console.log("⚠️ No new files uploaded.");
    }

    return res.json({
      message: "Upload done",
      data: uploadedImages,
      success: true,
      error: false,
    });

  } catch (error) {
    console.error("❌ Error in updateImageControllers:", error);
    return res.status(500).json({
      message: error.message || error,
      error: true,
      success: false,
    });
  }
};

export const deleteImageControllers = async (req, res) => {
  try {
    console.log("🟢 req.body:", req.body);

    // ✅ ดึงค่า oldImageUrls จาก req.body และแปลง JSON
    let oldImagesToDelete = req.body.oldImageUrls;

    if (typeof oldImagesToDelete === "string") {
      try {
        oldImagesToDelete = JSON.parse(oldImagesToDelete);
        console.log("🔍 Parsed old image URLs:", oldImagesToDelete);
      } catch (error) {
        console.error("❌ Error parsing oldImagesToDelete:", error);
        return res.status(400).json({
          message: "Invalid oldImagesToDelete format",
          error: true,
          success: false,
        });
      }
    }

    // ✅ ตรวจสอบให้แน่ใจว่าเป็นอาร์เรย์
    if (!Array.isArray(oldImagesToDelete)) {
      oldImagesToDelete = [oldImagesToDelete];
    }

    const getPublicIdFromUrl = (url) => {
      try {
        const regex = /\/upload\/(?:v\d+\/)?(.+?)\.\w{3,4}$/;
        const match = url.match(regex);
        return match ? match[1] : null;
      } catch (error) {
        console.error("❌ Error parsing the URL:", error);
        return null;
      }
    };

    console.log("🗑️ Deleting old images...");
    for (const url of oldImagesToDelete) {
      const public_id = getPublicIdFromUrl(url);
      console.log("publicId:", public_id);

      if (public_id) {
        try {
          console.log("🗑️ Deleting:", public_id);
          await deleteImageCloudinary(public_id);
          console.log("✅ Deleted:", public_id);
        } catch (deleteError) {
          console.error("❌ Error deleting image:", deleteError);
        }
      } else {
        console.error("❌ Failed to extract public ID from:", url);
      }
    }

    return res.json({
      message: "✅ Successfully deleted images",
      data: [],
      success: true,
      error: false,
    });

  } catch (error) {
    console.error("❌ Error in deleteImageControllers:", error);
    return res.status(500).json({
      message: error.message || "Server error",
      error: true,
      success: false,
    });
  }
};














export default uploadImageController;
