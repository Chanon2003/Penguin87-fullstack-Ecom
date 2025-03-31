import { PrismaClient } from "@prisma/client";
import Cors from "cors";

const prisma = new PrismaClient();

// ตั้งค่า CORS (ถ้าต้องใช้)
const cors = Cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
});

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
}
