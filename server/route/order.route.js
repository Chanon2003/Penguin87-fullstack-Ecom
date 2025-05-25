import {Router} from 'express'
import auth from '../middleware/auth.js'
import { cashOnDeliveryOrderController, getOrderController, payment, paymentOrderController } from '../controllers/order.controller.js'

const orderRouter = Router()

orderRouter.post('/cash-on-delivery',auth,cashOnDeliveryOrderController)
orderRouter.post('/payment',auth,payment)
orderRouter.post('/payment1',auth,paymentOrderController)
orderRouter.post('/get',auth,getOrderController)

export default orderRouter