import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import helmet from 'helmet'
import userRouter from './route/user.route.js'
dotenv.config()
import categoryRouter from './route/category.route.js'
import subCategoryRouter from './route/subCategory.route.js'
import productRouter from './route/product.route.js'
import cartRouter from './route/cart.route.js'
import addressRouter from './route/address.route.js'
import orderRouter from './route/order.route.js'

const app = express()
app.use(cors({
  credentials:true,
  origin : process.env.FRONTEND_URL
}))

app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ extended: true, limit: '20mb' }));
app.use(cookieParser())
app.use(morgan('dev'))
app.use(helmet.frameguard({ action: 'deny' }));

app.use('/api/user',userRouter)
app.use('/api/category',categoryRouter)
app.use('/api/subcategory',subCategoryRouter)
app.use('/api/product',productRouter)
app.use('/api/cart',cartRouter)
app.use('/api/address',addressRouter)
app.use('/api/order',orderRouter)

const PORT = process.env.PORT || 8080 

app.listen(PORT,()=>{
  console.log('Server running on :',PORT)
})

