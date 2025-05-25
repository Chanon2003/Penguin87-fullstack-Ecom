import rateLimit from "express-rate-limit";

const getClientIp = (req) => {
  return req.headers["x-forwarded-for"]?.split(",")[0] || req.ip;
};

const otpLimiter = rateLimit({
  keyGenerator: (req) => req.ip + req.headers["user-agent"], // ใช้ IP แท้จริง
  windowMs: 10 * 60 * 1000, // 10 นาที
  max: 10, // จำกัด 5 ครั้งต่อ IP ใน 10 นาที
  message: "Too many attempts, please try again later",
  standardHeaders: true, // เปิดมาตรฐาน RateLimit headers
  legacyHeaders: false, // ปิด X-RateLimit-* headers
  handler: (req, res, next, options) => {
    console.warn(`Rate limit exceeded: ${getClientIp(req)}`);
    res.status(options.statusCode).json({ message: options.message });
  }
});


export default otpLimiter