/*
  Warnings:

  - You are about to drop the `CategorySubCategory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CategorySubCategory" DROP CONSTRAINT "CategorySubCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "CategorySubCategory" DROP CONSTRAINT "CategorySubCategory_subcategoryId_fkey";

-- AlterTable
ALTER TABLE "SubCategory" ADD COLUMN     "categoryId" TEXT;

-- DropTable
DROP TABLE "CategorySubCategory";

-- AddForeignKey
ALTER TABLE "SubCategory" ADD CONSTRAINT "SubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
