import {v2 as cloudinary} from 'cloudinary'
import { v4 as uuidv4 } from "uuid";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key : process.env.CLOUDINARY_API_KEY,
  api_secret:  process.env.CLOUDINARY_API_SECRET_KEY
})

const uploadImageCloudinary = async (image) => {
  try {
    if (!image?.buffer) throw new Error("Invalid image buffer");

    const uniqueId = uuidv4();
    const publicId = `Seen/${uniqueId}`;

    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { public_id: publicId, folder: "penguin87" },
        (err, result) => {
          if (err) return reject(err);

          if (!result?.secure_url || !result?.public_id) {
            return reject(new Error("Cloudinary upload failed: Missing data"));
          }

          resolve({
            public_id: result.public_id,
            url: result.secure_url,
          });
        }
      );

      stream.end(image.buffer);
    });
  } catch (error) {
    console.error("❌ Error uploading image:", error);
    throw error;
  }
};




export default uploadImageCloudinary;