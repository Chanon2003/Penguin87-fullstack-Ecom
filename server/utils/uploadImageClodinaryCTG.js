import {v2 as cloudinary} from 'cloudinary'
import { v4 as uuidv4 } from "uuid";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key : process.env.CLOUDINARY_API_KEY,
  api_secret:  process.env.CLOUDINARY_API_SECRET_KEY
})

const uploadImageClodinaryCTG = async (file) => {
    try {
      if (!file) {
        throw new Error('No file provided');
      }
      
      console.log('มาถึง 3.1')
      const uniqueId = uuidv4();
      const publicId = `Seen/${uniqueId}`;
  
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            public_id: publicId,
            folder: "penguin87/category",
          },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        ).end(file.buffer); // ใช้ file.buffer
      });
  
      console.log('มาถึง 3.2')
      // ตรวจสอบว่า result มีข้อมูลที่ต้องการหรือไม่
      if (!result?.secure_url || !result?.public_id) {
        throw new Error('Cloudinary upload failed: Missing data');
      }
      
      console.log('มาถึง 3.3')
      return {
        public_id: result.public_id,
        url: result.secure_url,
      };
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      throw error;
    }
  };
  
  




export default uploadImageClodinaryCTG;

// import { v2 as cloudinary } from 'cloudinary';

// cloudinary.config({
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//     api_key : process.env.CLOUDINARY_API_KEY,
//     api_secret:  process.env.CLOUDINARY_API_SECRET_KEY
// })

// const uploadImageClodinaryCTG = async(image)=>{
//     if (!image?.buffer) throw new Error("Invalid image buffer");
//     console.log('กุมาถึง 1')
//     const buffer = image?.buffer || Buffer.from(await image.arrayBuffer())

//     const uploadImage = await new Promise((resolve,reject)=>{
//         cloudinary.uploader.upload_stream({ folder : "penguin87/category"},(error,uploadResult)=>{
//             return resolve(uploadResult)
//         }).end(buffer)
//     })

//     console.log('กุมาถึง 2')
//     return uploadImage
// }

// export default uploadImageClodinaryCTG

















