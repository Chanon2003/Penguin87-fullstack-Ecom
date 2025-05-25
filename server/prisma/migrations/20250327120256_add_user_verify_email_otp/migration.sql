-- AlterTable
ALTER TABLE "User" ADD COLUMN     "verify_email_expiry" TIMESTAMP(3),
ADD COLUMN     "verify_email_otp" TEXT;
