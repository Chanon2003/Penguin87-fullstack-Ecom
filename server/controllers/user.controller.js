import { PrismaClient } from '@prisma/client'
import bcryptjs from 'bcryptjs'
import sendEmail from '../config/sendEmail.js';
import verifyEmailTemplate from '../utils/verifyEmailTemplate.js';
import generatedAccessToken from '../utils/generatedAccessToken.js';
import generatedRefreshToken from '../utils/generatedRefreshToken.js';
const prisma = new PrismaClient();
import xss from 'xss';
import deleteImageCloudinary from '../utils/deleteImageCloudinary.js';
import uploadImageCloudinary from '../utils/uploadImageCloudinary.js';
import { generateOtp } from '../utils/generatedOtp.js';
import { forgotPasswordTemplate, verifyEmailTemplatesoi } from '../utils/forgotPasswordTemplate.js';
import jwt from 'jsonwebtoken';

export async function userRegister(req, res) {
  try {
    const { name, password } = req.body;
    const email = req.body.email?.toLowerCase();

    // ป้องกัน XSS: sanitize ข้อมูล name และ email
    const sanitizedName = xss(name); // sanitize name
    const sanitizedEmail = xss(email); // sanitize email

    if (!sanitizedName || !sanitizedEmail || !password) {
      return res.status(400).json({
        message: "Provide email, name, and password",
        error: true,
        success: false,
      });
    }

    const existingUser = await prisma.user.findFirst({
      where: { email: sanitizedEmail },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email is already registered",
        error: true,
        success: false,
      });
    }

    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(password, salt);

    const newUser = await prisma.user.create({
      data: {
        name: sanitizedName,
        email: sanitizedEmail,
        password: hashPassword,
      },
    });

    const verifyEmailUrl = `${process.env.FRONTEND_URL}/verify-email?code=${newUser?.id}`;
    console.log("Verify Email URL:", verifyEmailUrl);

    await sendEmail({
      sendTo: sanitizedEmail,
      subject: "Verify your email - Penguin87",
      html: verifyEmailTemplate({
        name: sanitizedName,
        url: verifyEmailUrl,
      }),
    });

    return res.status(201).json({
      message: "User registered successfully",
      error: false,
      success: true,
      data: newUser,
    });

  } catch (error) {
    console.error("Error in userRegister:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
}

// export async function verifyEmailController(req, res) {
//   try {
//     const { code } = req.body;

//     // ตรวจสอบว่า code ถูกส่งมาหรือไม่
//     if (!code) {
//       return res.status(400).json({
//         message: "Code is required",
//         error: true,
//         success: false,
//       });
//     }

//     // ค้นหาผู้ใช้โดยใช้ id ที่ตรงกับ code
//     const user = await prisma.user.findFirst({
//       where: { id: code },
//     });

//     if (!user) {
//       return res.status(404).json({
//         message: "Invalid Code",
//         error: true,
//         success: false,
//       });
//     }

//     // อัปเดตสถานะ verify_email
//     const updateUser = await prisma.user.update({
//       where: { id: code },
//       data: { verify_email: true },
//     });

//     return res.json({
//       message: "Email verified successfully",
//       success: true,
//       error: false,
//     });

//   } catch (error) {
//     console.error("Error in verifyEmailController:", error);
//     return res.status(500).json({
//       message: "Internal server error",
//       error: true,
//       success: false,
//     });
//   }
// }

export async function verifyEmailController(req, res) {
  try {
    const email = xss(req.body.email?.toLowerCase().trim());
    const otp = xss(req.body.otp?.trim());

    if (!email || !otp) {
      return res.status(400).json({
        message: "Provide required fields: email, otp.",
        error: true,
        success: false,
      });
    }

    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      return res.status(400).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    const currentTime = new Date();

    // ✅ เช็คว่า OTP หมดอายุหรือยัง
    if (!user.verify_email_otp|| user.verify_email_expiry < currentTime) {
      return res.status(400).json({
        message: "OTP expired",
        error: true,
        success: false,
      });
    }

    // ✅ เช็คว่า OTP ถูกต้องหรือไม่
    if (otp !== user.verify_email_otp) {
      return res.status(400).json({
        message: "Invalid OTP Email Verify",
        error: true,
        success: false,
      });
    }

    // ✅ อัปเดต verify_email = true และเคลียร์ OTP
    await prisma.user.update({
      where: { id: user.id },
      data: {
        verify_email: true,
        verify_email_otp: null,
        verify_email_expiry: null,
      },
    });

    return res.json({
      message: "Email verified successfully!",
      success: true,
      error: false,
    });

  } catch (error) {
    console.error("verifyOtp:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
}

//emi1l veri 1
export async function verifyEmailController1(req, res) {
  try {
    const email = xss(req.body.email?.toLowerCase().trim());
    const password = req.body.password

    console.log('email password',email,password)
  
    if (!email || !password ) {
      return res.status(400).json({
        message: "Provide required fields: email or password",
        error: true,
        success: false,
      });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({
        message: "Email not available",
        error: true,
        success: false,
      });
    }

    const checkPassword = await bcryptjs.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: "Incorrect password.",
        error: true,
        success: false,
      });
    }

    const otp = generateOtp();
    const expireTime = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        verify_email_otp: otp,
        verify_email_expiry: expireTime, 
      },
    });

    await sendEmail({
      sendTo: email,
      subject: "Verify Email from Penguin87",
      html: verifyEmailTemplatesoi({
        name: user.name,
        otp: otp,
      }),
    });

    return res.json({
      message: "Check your Email",
      error: false,
      success: true,
      data:{verify_email:user?.verify_email, email:user?.email}
    });


  } catch (error) {
    console.error("verifyOtp:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
}

export async function userLogin(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
        error: true,
        success: false,
      });
    }

    const sanitizedEmail = xss(email.toLowerCase()); // sanitize email

    const user = await prisma.user.findFirst({ where: { email: sanitizedEmail } });

    if (!user) {
      return res.status(400).json({
        message: "User does not exist.",
        error: true,
        success: false,
      });
    }

    if (user.status !== 'ACTIVE') {
      return res.status(400).json({
        message: "Account not active. Please contact admin.",
        error: true,
        success: false,
      });
    }
    
    const checkPassword = await bcryptjs.compare(password, user.password);

    if (!checkPassword) {
      return res.status(400).json({
        message: "Incorrect password.",
        error: true,
        success: false,
      });
    }

    const accessToken = await generatedAccessToken(user.id);
    const refreshToken = await generatedRefreshToken(user.id);

    const updateUser = await prisma.user.update({
      where:{id:user.id},
      data:{
        last_login_date : new Date()
      }
    })

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    };

    res.cookie('accessToken', accessToken, cookiesOption);
    res.cookie('refreshToken', refreshToken, cookiesOption);

    const email1 = await prisma.user.findFirst({
      where:{email:sanitizedEmail}
    })

    return res.json({
      message: "Login successfully",
      success: true,
      error: false,
      data: {
        accessToken,
        refreshToken,
        email:email1
      },
    });

  } catch (error) {
    console.error("Error in userLogin:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
}

export async function userLogout(req, res) {
  try {
    const userid = req.user.id

    const cookiesOption = {
      httpOnly: true,
      secure: true,
      sameSite: 'Strict',
    };
    res.clearCookie('accessToken', cookiesOption);
    res.clearCookie('refreshToken', cookiesOption);

    const removeRefreshToken = await prisma.user.update({
      where: { id: userid },
      data: { refresh_token: "" },
    });

    return res.json({
      message: "Logout succesfully",
      error: false,
      success: true,
    })
  } catch (error) {
    console.error("Error in userLogout:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
}

export const updateAvatar = async (req, res) => {
  try {
    const userId = req.user?.id; // ดึง ID จาก middleware
    const image = req.file; // รับไฟล์จาก multer

    if (!userId) {
      return res.status(400).json({ error: "User not found" });
    }

    if (!image) {
      return res.status(400).json({ error: "No avatar file provided" });
    }

    // ✅ 📌 ดึงข้อมูล `avatarPublicId` จากฐานข้อมูลก่อนลบ
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { avatarPublicId: true }, // ดึงแค่ `avatarPublicId`
    });

    const oldAvatarPublicId = user?.avatarPublicId; // เอา public_id เก่ามาใช้

    // ✅ 📌 ถ้ามีรูปเก่า -> ลบทิ้ง
    if (oldAvatarPublicId) {
      try {
        console.log("🗑️ Deleting old avatar:", oldAvatarPublicId);
        await deleteImageCloudinary(oldAvatarPublicId);
      } catch (deleteError) {
        console.error("❌ Error deleting old avatar:", deleteError);
      }
    }

    // ✅ 📌 อัปโหลดรูปใหม่
    console.log("🚀 Uploading new avatar...");
    const newAvatar = await uploadImageCloudinary(image);

    if (!newAvatar || !newAvatar.url || !newAvatar.public_id) {
      return res.status(500).json({ error: "Failed to upload avatar" });
    }

    // ✅ 📌 อัปเดตฐานข้อมูล
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        avatar: newAvatar.url, // บันทึก URL ใหม่
        avatarPublicId: newAvatar.public_id, // บันทึก public_id ใหม่
      },
    });

    // ✅ 📌 ส่ง response กลับไป
    res.status(200).json({
      message: "✅ Avatar updated successfully",
      avatarUrl: newAvatar.url,
    });

  } catch (error) {
    console.error("Error in Avatar upload:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
};

export async function updateUserDetails(req, res) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        message: "Unauthorized: User ID is required",
        error: true,
        success: false,
      });
    }

    console.log("Updating user:", userId);

    // ✅ รับเฉพาะ name, mobile, password
    const { name, mobile, password } = req.body;

    const dataToUpdate = {};
    if (name) dataToUpdate.name = name;
    if (mobile) dataToUpdate.mobile = mobile;

    if (password) {
      const salt = await bcryptjs.genSalt(10);
      dataToUpdate.password = await bcryptjs.hash(password, salt);
    }

    const updateUser = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      select: { name: true, mobile: true }, // ✅ return แค่ name, mobile
    });

    return res.json({
      message: "User updated successfully",
      error: false,
      success: true,
      data: updateUser, // ✅ return เฉพาะ name, mobile
    });

  } catch (error) {
    console.error("updateUserDetails Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
}

//forgot password
export async function forgotPassword(req, res) {
  try {
    // ✅ ป้องกัน XSS และปรับ email เป็น lowercase
    const email = xss(req.body.email?.toLowerCase().trim());

    // ✅ ตรวจสอบว่า email ถูกส่งมาหรือไม่
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        error: true,
        success: false,
      });
    }

    // ✅ ตรวจสอบว่า email มีอยู่หรือไม่
    const user = await prisma.user.findFirst({ where: { email } });
    if (!user) {
      return res.status(400).json({
        message: "Email not available",
        error: true,
        success: false,
      });
    }

    // ✅ ใช้ Date.getTime() เพื่อคำนวณเวลาหมดอายุ
    const otp = generateOtp();
    const expireTime = new Date(Date.now() + 60 * 60 * 1000); // 1 ชั่วโมง

    // ✅ อัปเดต OTP และเวลาหมดอายุ
    await prisma.user.update({
      where: { id: user.id },
      data: {
        forgot_password_otp: otp,
        forgot_password_expiry: expireTime, 
      },
    });

    // ✅ ใช้ await เพื่อให้แน่ใจว่าส่งอีเมลสำเร็จ
    await sendEmail({
      sendTo: email,
      subject: "Forgot password from Penguin87",
      html: forgotPasswordTemplate({
        name: user.name,
        otp: otp,
      }),
    });

    return res.json({
      message: "Check your Email",
      error: false,
      success: true,
    });

  } catch (error) {
    console.error("forgotPassword:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
}

export async function verifyForgotPasswordOtp(req, res) {
  try {
    // ✅ ป้องกัน XSS และปรับ email เป็น lowercase
    const email = xss(req.body.email?.toLowerCase().trim());
    const otp = xss(req.body.otp?.trim());

    if (!email || !otp) {
      return res.status(400).json({
        message: "Provide required fields: email, otp.",
        error: true,
        success: false,
      });
    }

    // ✅ ค้นหาผู้ใช้ในฐานข้อมูลด้วย Prisma
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({
        message: "Email not available",
        error: true,
        success: false,
      });
    }

    const currentTime = new Date();

    // ✅ เช็คว่า OTP หมดอายุหรือยัง
    if (user.forgot_password_expiry && user.forgot_password_expiry < currentTime) {
      return res.status(400).json({
        message: "OTP expired",
        error: true,
        success: false,
      });
    }

    // ✅ เช็คว่า OTP ถูกต้องหรือไม่
    if (otp !== user.forgot_password_otp) {
      return res.status(400).json({
        message: "Invalid OTP",
        error: true,
        success: false,
      });
    }

    // ✅ OTP ถูกต้อง -> อัปเดตให้ user isVerified = true และเคลียร์ OTP
    await prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        forgot_password_otp: null, // ล้าง OTP เพื่อป้องกันการใช้ซ้ำ
        forgot_password_expiry: null,
      },
    });

    

    return res.json({
      message: "OTP verified successfully",
      error: false,
      success: true,
    });

  } catch (error) {
    console.error("verifyForgotPasswordOtp:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
}

export async function resetPassword(req, res) {
  try {
    // ✅ ป้องกัน XSS และปรับ email เป็น lowercase
    const email = xss(req.body.email?.toLowerCase().trim());
    const newPassword = xss(req.body.newPassword?.trim());
    const confirmPassword = xss(req.body.confirmPassword?.trim());

    if (!email || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Provide required fields: email, newPassword, confirmPassword.",
        error: true,
        success: false,
      });
    }

    // ✅ ค้นหาผู้ใช้ในฐานข้อมูล
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(400).json({
        message: "Email is not available",
        error: true,
        success: false,
      });
    }

    // ✅ ตรวจสอบว่าผู้ใช้ได้ยืนยันตัวตนผ่าน OTP แล้ว
    if (!user.isVerified) {
      return res.status(400).json({
        message: "User is not verified. Please verify OTP first.",
        error: true,
        success: false,
      });
    }

    // ✅ ตรวจสอบว่า newPassword กับ confirmPassword ตรงกันไหม
    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "newPassword and confirmPassword not same.",
        error: true,
        success: false,
      });
    }

    // ✅ เช็คว่า newPassword ไม่เหมือนรหัสผ่านเก่า
    const isMatch = await bcryptjs.compare(newPassword, user.password);
    if (isMatch) {
      return res.status(400).json({
        message: "New password must be different from the old password.",
        error: true,
        success: false,
      });
    }

    // ✅ ทำการเข้ารหัสรหัสผ่านใหม่
    const salt = await bcryptjs.genSalt(10);
    const hashPassword = await bcryptjs.hash(newPassword, salt);

    // ✅ อัปเดตรหัสผ่านใหม่ + ตั้ง isVerified = false เพื่อป้องกันการใช้ OTP เดิม
    await prisma.user.update({
      where: { email },
      data: {
        password: hashPassword,
        isVerified: false,
      },
    });

    return res.json({
      message: "Password reset successfully",
      error: false,
      success: true,
    });

  } catch (error) {
    console.error("resetPassword:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: true,
      success: false,
    });
  }
}

export async function refreshToken(req, res) {
  try {
    // ✅ ดึง Refresh Token จาก Cookie
    const refreshToken = req.cookies.refreshToken || req?.headers?.authorization?.spilt(" ")[1];

    if (!refreshToken) {
      return res.status(401).json({
        message: "Invalid token",
        error: true,
        success: false,
      });
    }

    // ✅ ตรวจสอบความถูกต้องของ Refresh Token

    // const verifyToken = await jwt.verify(refreshToken,process.env.SECRET_KEY_REFRESH_TOKEN)
    let verifyToken;

    try {
      verifyToken = jwt.verify(refreshToken, process.env.SECRET_KEY_REFRESH_TOKEN);
    } catch (err) {
      return res.status(401).json({
        message: "Token is expired or invalid",
        error: true,
        success: false,
      });
    }

    // ✅ ดึง userId จาก Token
    const userId = verifyToken.id;

    if (!userId) {
      return res.status(401).json({
        message: "Invalid token payload",
        error: true,
        success: false,
      });
    }

    // ✅ ค้นหาผู้ใช้จากฐานข้อมูล (ใช้ Prisma)
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
        success: false,
      });
    }

    // ✅ สร้าง Access Token ใหม่
    const newAccessToken = await generatedAccessToken(user.id);

    // ✅ ตั้งค่า Cookies อย่างปลอดภัย
    res.cookie("accesstoken", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // ใช้ secure เฉพาะใน production
      sameSite: "None",
    });

    return res.json({
      message: "New Access Token generated",
      error: false,
      success: true,
      data: {
        accesstoken: newAccessToken,
      },
    });
  } catch (error) {
    console.error("refreshToken Error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}

//get login user Details
export async function userDetials(req, res) {
  try {
    const userId = req.user.id
    const user = await prisma.user.findFirst({
      where: { id: userId }
      ,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        avatarPublicId: true,
        address_details:true,
        shopping_cart:true,
        orderHistory:true,
        mobile: true,
        verify_email: true,
        isVerified: true,
        last_login_date: true,
        role: true,
        status: true,
        createdAt:true,
        updatedAt:true
      }
    })

    return res.json({
      message: "User detials",
      error: false,
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("userDetials Error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}

export async function getAllUser(req, res) {
  try {
    // const userId = req.user.id
    const user = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        avatarPublicId: true,
        address_details:true,
        shopping_cart:true,
        orderHistory:true,
        mobile: true,
        verify_email: true,
        isVerified: true,
        last_login_date: true,
        role: true,
        status: true,
        createdAt:true,
        updatedAt:true
      }
    })

    return res.json({
      message: "User detials",
      error: false,
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("userDetials Error:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}

export async function changeRoleUser(req,res) {
  try {
    const {userId,role} = req.body

    const changeRole = await prisma.user.update({
      where:{id:userId},
      data:{role:role}
    })

    return res.json({
      message:'Change Role Success',
      data:changeRole,
      success:true,
      error:false
    })
  } catch (error) {
    console.error("changeRoleUser:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}

export async function changeStatusUser(req,res) {
  try {
    const {userId,status} = req.body

    const changeStatus = await prisma.user.update({
      where:{id:userId},
      data:{status:status}
    })

    return res.json({
      message:'Change status Success',
      data:changeStatus,
      success:true,
      error:false
    })
  } catch (error) {
    console.error("changeRoleUser:", error);
    return res.status(500).json({
      message: error.message || "Internal server error",
      error: true,
      success: false,
    });
  }
}