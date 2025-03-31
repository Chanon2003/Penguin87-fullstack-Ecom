/*
  Warnings:

  - You are about to drop the column `categoryId` on the `SubCategory` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "SubCategory" DROP CONSTRAINT "SubCategory_categoryId_fkey";

-- AlterTable
ALTER TABLE "SubCategory" DROP COLUMN "categoryId";

-- CreateTable
CREATE TABLE "CategorySubCategory" (
    "categoryId" TEXT NOT NULL,
    "subcategoryId" TEXT NOT NULL,

    CONSTRAINT "CategorySubCategory_pkey" PRIMARY KEY ("categoryId","subcategoryId")
);

-- AddForeignKey
ALTER TABLE "CategorySubCategory" ADD CONSTRAINT "CategorySubCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategorySubCategory" ADD CONSTRAINT "CategorySubCategory_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "SubCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
