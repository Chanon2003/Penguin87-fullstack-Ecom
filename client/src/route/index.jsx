import { createBrowserRouter } from 'react-router-dom'
import App from '../App'
import Home from '../pages/Home'
import SearchPage from '../pages/cart/SearchPage'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import ForgotPassword from '../pages/auth/forgotpassword/ForgotPassword'
import OtpVerification from '../pages/auth/forgotpassword/OtpVerification'
import ResetPassword from '../pages/auth/forgotpassword/ResetPassword'
import UserMenuMobile from '../pages/user/UserMenuMobile'
import DashBoard from '../layouts/DashBoard'
import Profile from '../pages/user/Profile'
import MyOrders from '../pages/user/MyOrders'
import Address from '../pages/user/address/Address'
import Category from '../pages/admin/Category'
import SubCategoryPage from '../pages/admin/SubCategoryPage'
import UploadProduct from '../pages/admin/UploadProduct'
import ProductAdmin from '../pages/admin/ProductAdmin'
import AdminPermision from './AdminPermision'
import ProductListPage from '../pages/user/ProductListPage'
import ProductDisplayPage from '../pages/user/ProductDisplayPage'
import CartMobile from '../pages/cart/CartMobile'
import CheckoutPage from '../pages/user/payment/CheckoutPage'
import VerifyEmail from '../pages/auth/VerifyEmail'
import Success from '../pages/user/payment/status/Success'
import Cancel from '../pages/user/payment/status/Cancel'
import Payment from '../pages/user/payment/Payment'
import UserManage from '../pages/admin/UserManage'

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