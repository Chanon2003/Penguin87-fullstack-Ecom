import {Router} from 'express'
import auth from '../middleware/auth.js'
import { AddSubCategoryController, deleteSubCategoryController, getSubCategoryController, updateSubCategoryController } from '../controllers/subCategory.controller.js'
import { admin } from '../middleware/Admin.js'
import { uploadSubCateogry } from '../middleware/multer1.js'

const subCategoryRouter = Router()

subCategoryRouter.post('/create',auth,admin,uploadSubCateogry.single('subcategory'),AddSubCategoryController)
subCategoryRouter.post('/get',getSubCategoryController)
subCategoryRouter.put('/update',auth,admin,uploadSubCateogry.single('subcategory'),updateSubCategoryController)
subCategoryRouter.delete('/delete',auth,admin,deleteSubCategoryController)

export default subCategoryRouter