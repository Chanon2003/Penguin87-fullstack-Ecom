import { Router } from "express";
import auth from "../middleware/auth.js";
import uploadImageController, { deleteImageControllers, updateImageControllers, uploadImageControllers } from "../controllers/uploadImage.controller.js";
import upload from "../middleware/multer.js";

const uploadRouter = Router()

uploadRouter.post('/upload',auth,upload.single('image'),uploadImageController)
uploadRouter.post('/uploads',auth,upload.array('image[]', 10),uploadImageControllers)
uploadRouter.post('/uploadss',auth,upload.array('image[]', 10),updateImageControllers)
uploadRouter.post('/delete',auth,upload.array('image[]', 10),deleteImageControllers)

export default uploadRouter