import jwt from 'jsonwebtoken';

const auth = async (req, res, next) => {
  try {
    // ดึง token จาก Cookie หรือ Authorization header
    const token =
      req.cookies?.accessToken || req.headers?.authorization?.split(" ")[1];

    if (!token) {
       return res.status(401).json({
        message: "You haven't Login",
        error: true,
        success: false,
      });
    }

    // 🔹 Verify Token
    const decode = jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN);

    if (!decode || !decode.id) {
      return res.status(401).json({
        message: "Unauthorized: Invalid token",
        error: true,
        success: false,
      });
    }

    req.user = decode;
    
    next(); // 🔹 ไปยัง middleware หรือ controller ถัดไป

  } catch (error) {
    return res.status(401).json({
      message: "Unauthorized: Token verification failed",
      error: true,
      success: false,
    });
  }
};

export default auth;
