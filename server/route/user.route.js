import {Router} from 'express';
import { changeRoleUser, changeStatusUser, deleteAvatar, forgotPassword, getAllUser, refreshToken, resetPassword, updatedAvatar, updateUserDetails, uploadAvatar, userDetials, userLogin, userLogout, userRegister, verifyEmailController, verifyEmailController1, verifyForgotPasswordOtp } from '../controllers/user.controller.js';
import otpLimiter from '../middleware/ratelimit.js';
import auth from '../middleware/auth.js';
import { admin } from '../middleware/Admin.js';
import { formValidate, resetPasswordValidate } from '../utils/formValidate.js';
import { uploadAvatarMulter } from '../middleware/multer1.js';

const userRouter = Router()

userRouter.post('/register',formValidate,userRegister)
// userRouter.post('/verify-email',otpLimiter,verifyEmailController)
userRouter.put('/verify-email',verifyEmailController1)
userRouter.put('/verify-email-otp',verifyEmailController)
userRouter.post('/login',userLogin)
userRouter.get('/logout',otpLimiter,auth,userLogout)

userRouter.post('/upload-avatar',auth,uploadAvatarMulter.single('avatar'),uploadAvatar);
userRouter.post('/update-avatar',auth,uploadAvatarMulter.single('avatar'),updatedAvatar);
userRouter.post('/delete-avatar',auth,deleteAvatar);

userRouter.put('/update-user',auth,updateUserDetails);
userRouter.put('/forgot-password',forgotPassword);
userRouter.put('/verify-forgot-password-otp',otpLimiter,verifyForgotPasswordOtp)
userRouter.put('/reset-password',otpLimiter,resetPasswordValidate,resetPassword)
userRouter.post('/refresh-token',refreshToken)
userRouter.get('/user-details',auth,userDetials)
userRouter.post('/alluser-details',auth,admin,getAllUser)
userRouter.put('/changerole',auth,admin,changeRoleUser)
userRouter.put('/changestatus',auth,admin,changeStatusUser)

export default userRouter