import { Router } from "express";
import auth from "../middleware/auth.js";
import { createProductController, deleteProductDetails, getProductByCategory, getProductByCategoryAndSubCategory, getProductController,  getProductDetails, searchProduct, updateProductDetails} from "../controllers/product.controller.js";
import { admin } from "../middleware/Admin.js";
import { uploadProduct } from "../middleware/multer1.js";

const productRouter = Router()

productRouter.post('/create',auth,admin,uploadProduct.array('product',10),createProductController)
productRouter.post('/get',getProductController)
productRouter.post('/get-product-by-category',getProductByCategory)
productRouter.post('/get-product-by-category-and-subcategory',getProductByCategoryAndSubCategory)
productRouter.post('/get-product-details',getProductDetails)
productRouter.put('/update-product-details',auth,admin,uploadProduct.array('product',10),updateProductDetails)
productRouter.delete('/delete-product',auth,admin,deleteProductDetails)
productRouter.post('/search-product',searchProduct)

export default productRouter