import { v2 as cloudinary } from "cloudinary";
import { v4 as uuidv4 } from "uuid";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY,
});

/**
 * Upload multiple images to Cloudinary and return their URLs & public_ids.
 * @param {Express.Multer.File[]} images - Array of image buffers from multer
 * @param {string} identifier - Unique identifier (e.g., productId, userId)
 * @param {Object} options - Additional options (e.g., folder name)
 * @returns {Promise<{ public_id: string, url: string }[]>}
 */
const uploadProductImages = async (images, identifier, options = {}) => {
  if (!images || images.length === 0) {
    throw new Error("❌ No images provided");
  }

  const folderPath = options.folder || "penguin87/products";

  try {
    const uploadPromises = images.map((image, index) => {
      return new Promise((resolve, reject) => {
        if (!image?.buffer) {
          return reject(new Error(`❌ Invalid image buffer at index ${index}`));
        }

        const uniqueId = uuidv4();
        const publicId = `${folderPath}/${identifier}-${uniqueId}`;

        const stream = cloudinary.uploader.upload_stream(
          { public_id: publicId },
          (err, result) => {
            if (err) return reject(err);
            if (!result?.secure_url || !result?.public_id) {
              return reject(new Error("❌ Cloudinary upload failed: Missing data"));
            }

            resolve({ public_id: result.public_id, url: result.secure_url });
          }
        );

        stream.end(image.buffer);
      });
    });

    return await Promise.all(uploadPromises);
  } catch (error) {
    console.error("❌ Error uploading product images:", error);
    throw error;
  }
};

export default uploadProductImages;
