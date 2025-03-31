import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import SearchPage from '../pages/SearchPage'
import Login from '../pages/Login'
import Register from '../pages/Register'
import ForgotPassword from '../pages/ForgotPassword'
import OtpVerification from '../pages/OtpVerification'
import ResetPassword from '../pages/ResetPassword'
import UserMenuMobile from '../pages/UserMenuMobile'
import DashBoard from '../layouts/DashBoard'
import Profile from '../pages/Profile'
import MyOrders from '../pages/MyOrders'
import Address from '../pages/Address'
import Category from '../pages/Category'
import SubCategoryPage from '../pages/SubCategoryPage'
import UploadProduct from '../pages/UploadProduct'
import ProductAdmin from '../pages/ProductAdmin'
import AdminPermision from './AdminPermision'
import ProductListPage from '../pages/ProductListPage'
import ProductDisplayPage from '../pages/ProductDisplayPage'
import CartMobile from '../pages/CartMobile'
import CheckoutPage from '../pages/CheckoutPage'
import VerifyEmail from '../pages/VerifyEmail'
import Success from '../pages/Success'
import Cancel from '../pages/Cancel'
import Payment from '../pages/Payment'
import UserManage from '../pages/UserManage'

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { path: "", element: <Home /> },
      { path: "search", element: <SearchPage /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forgot-password", element: <ForgotPassword /> },
      { path: "verification-otp", element: <OtpVerification /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "user", element: <UserMenuMobile /> },
      {
        path: 'verify-email',
        element: <VerifyEmail />
      },
      {
        path: "dashboard", element: <DashBoard />,
        children: [
          {
            path: 'profile', element: <Profile />
          },
          {
            path: 'myorders', element: <MyOrders />
          },
          {
            path: 'address', element: <Address />
          },
          {
            path: 'category',
            element: <AdminPermision><Category /></AdminPermision>,
          },
          { path: 'subcategory', element: <AdminPermision><SubCategoryPage /></AdminPermision> },
          { path: 'upload-product', element: <AdminPermision><UploadProduct /></AdminPermision> },
          { path: 'product', element: <AdminPermision><ProductAdmin /></AdminPermision> },
          { path: 'user', element: <AdminPermision><UserManage /></AdminPermision> },
        ]
      },
      {
        path: ":category",
        children: [
          {
            path: ":subCategory",
            element: <ProductListPage />
          }
        ]
      },
      {
        path: "product/:product",
        element: <ProductDisplayPage />
      },
      {
        path: 'cart',
        element: <CartMobile />
      },
      {
        path: 'checkout',
        element: <CheckoutPage />
      },
      {
        path: 'success',
        element: <Success />
      },
      {
        path: 'cancel',
        element: <Cancel />
      },
      {
        path: 'payment',
        element: <Payment />
      }



    ]
  },
  {

  }
])

export default router