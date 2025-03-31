import {v2 as cloudinary} from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key : process.env.CLOUDINARY_API_KEY,
  api_secret:  process.env.CLOUDINARY_API_SECRET_KEY
})

const deleteImageCloudinary = async (publicId) => {
  try {
      console.log('public id',publicId)
      const deleteResult = await cloudinary.uploader.destroy(publicId);
      console.log("Delete Result:", deleteResult);
      return deleteResult;

  } catch (error) {
      console.error("Error deleting image from Cloudinary:", error);
      throw error;
  }
};

export default deleteImageCloudinary;
