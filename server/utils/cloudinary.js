import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET_KEY
});

const avatar = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'FullStackPenguin87/user/avatar', // ชื่อโฟลเดอร์ใน Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp','avif'],
  },
});

const category = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'FullStackPenguin87/category', 
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp','avif'],
  },
});

const subCategory = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'FullStackPenguin87/subCategory', 
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp','avif'],
  },
});

const product = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'FullStackPenguin87/product', 
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp','avif'],
  },
});

export { cloudinary, avatar,category,subCategory,product };
