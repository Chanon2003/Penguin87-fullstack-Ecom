import {Router} from 'express'
import { AddCategoryController, deleteCategoryController, getCategoryController, updateCategoryController } from '../controllers/category.controller.js'
import auth from '../middleware/auth.js'
import { admin } from '../middleware/Admin.js'
import { uploadCategory } from '../middleware/multer1.js'
const categoryRouter = Router()

categoryRouter.post('/add-category',auth,admin,uploadCategory.single('category'),AddCategoryController) 
categoryRouter.get('/get',getCategoryController)
categoryRouter.put('/update-category',auth,admin,uploadCategory.single('category'),updateCategoryController)
categoryRouter.delete('/delete-category',auth,admin,deleteCategoryController)


export default categoryRouter