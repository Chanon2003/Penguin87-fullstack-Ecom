const SummaryApi = {
  register: {
    url: '/api/user/register',
    method: 'post',
    credentials: 'include',
  },
  login: {
    url: '/api/user/login',
    method: 'post',
    credentials: 'include',
  },
  checkEmailVerify: {
    url: '/api/user/verify-email',
    method: 'put'
  },
  verifyEmailOtp: {
    url: '/api/user/verify-email-otp',
    method: 'put'
  },
  forgot_password: {
    url: '/api/user/forgot-password',
    method: 'put'
  },
  forgot_password_otp_verification: {
    url: '/api/user/verify-forgot-password-otp',
    method: 'put'
  },
  resetPassword: {
    url: '/api/user/reset-password',
    method: 'put'
  },
  refreshToken: {
    url: '/api/user/refresh-token',
    method: 'post'
  },
  userDetails: {
    url: '/api/user/user-details',
    method: 'get'
  },
  logout: {
    url: '/api/user/logout',
    method: 'get'
  },
  uploadAvatar: {
    url: '/api/user/upload-avatar',
    method: 'post'
  },
  updateAvatar: {
    url: '/api/user/update-avatar',
    method: 'post'
  },
  deleteAvatar: {
    url: '/api/user/delete-avatar',
    method: 'post'
  },
  updateUserDetails: {
    url: '/api/user/update-user',
    method: 'put'
  },
  addCategory: {
    url: '/api/category/add-category',
    method: 'post'
  },
  uploadImage: {
    url: '/api/file/upload',
    method: 'post'
  },
  uploadImages: {
    url: '/api/file/uploads',
    method: 'post'
  },
  uploadImagess: {
    url: '/api/file/uploadss',
    method: 'post'
  },
  deleteImages: {
    url: '/api/file/delete',
    method: 'post'
  },
  uploadSubCtgImage: {
    url: '/api/file/upload',
    method: 'post'
  },
  getCategory: {
    url: '/api/category/get',
    method: 'get'
  },
  updateCategory: {
    url: '/api/category/update-category',
    method: 'put'
  },
  deleteCategory: {
    url: '/api/category/delete-category',
    method: 'delete'
  },
  createSubCategory: {
    url: '/api/subcategory/create',
    method: 'post'
  },
  getSubCategory: {
    url: '/api/subcategory/get',
    method: 'post'
  },
  updateSubCategory: {
    url: '/api/subcategory/update',
    method: 'put'
  },
  deleteSubCategory: {
    url: '/api/subcategory/delete',
    method: 'delete'
  },
  createProduct: {
    url: '/api/product/create',
    method: 'post'
  },
  getProduct: {
    url: '/api/product/get',
    method: 'post'
  },
  getProductByCategory: {
    url: '/api/product/get-product-by-category',
    method: 'post'
  },
  getProductByCategoryAndSubCategory: {
    url: '/api/product/get-product-by-category-and-subcategory',
    method: 'post'
  },
  getProductDetails: {
    url: '/api/product/get-product-details',
    method: 'post'
  },
  updateProductDetails: {
    url: '/api/product/update-product-details',
    method: 'put'
  },
  deleteProduct: {
    url: '/api/product/delete-product',
    method: 'delete'
  },
  searchProduct: {
    url: '/api/product/search-product',
    method: 'post'
  },
  addTocart: {
    url: '/api/cart/create',
    method: 'post'
  },
  getCartItem: {
    url: '/api/cart/get',
    method: 'get'
  },
  updateCartItemQty: {
    url: '/api/cart/update-qty',
    method: 'put'
  },
  deleteCartItem: {
    url: '/api/cart/delete-cart-item',
    method: 'delete'
  },
  createAddress: {
    url: '/api/address/create',
    method: 'post'
  },
  getAddress: {
    url: '/api/address/get',
    method: 'get'
  },
  updateAddress: {
    url: '/api/address/update',
    method: 'put'
  },
  disableAddress: {
    url: '/api/address/disable',
    method: 'delete'
  },
  cashOnDeliveryOrder: {
    url: '/api/order/cash-on-delivery',
    method: 'post'
  },
  payment_url: {
    url: '/api/order/checkout',
    method: 'post'
  },
  payment: {
    url: '/api/order/payment',
    method: 'post'
  },
  payment1: {
    url: '/api/order/payment1',
    method: 'post'
  },
  getOrder: {
    url: '/api/order/get',
    method: 'post'
  },
  getAllUser: {
    url: '/api/user/alluser-details',
    method: 'post'
  },
  changeRoleUser: {
    url: '/api/user/changerole',
    method: 'put'
  },
  changeStatusUser: {
    url: '/api/user/changestatus',
    method: 'put'
  }


}


export default SummaryApi