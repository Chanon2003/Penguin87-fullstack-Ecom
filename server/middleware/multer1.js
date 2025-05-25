import multer from 'multer';
import { avatar,category, product, subCategory } from '../utils/cloudinary.js'; // หรือ path ที่คุณวางไฟล์ config

export const uploadAvatarMulter = multer({  storage: avatar  });

export const uploadCategory = multer({storage: category})

export const uploadSubCateogry = multer({storage: subCategory})

export const uploadProduct = multer({storage: product})