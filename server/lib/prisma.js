// lib/prisma.js
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

const prisma = globalForPrisma.prisma || new PrismaClient({
  // 🔇 ปิด log ทั้งหมด
  log: [],
})

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

export { prisma }
