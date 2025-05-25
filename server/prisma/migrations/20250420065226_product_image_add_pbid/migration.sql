/*
  Warnings:

  - You are about to drop the column `url` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the `ProductCategory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productimage` to the `Image` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productimagePublicId` to the `Image` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductCategory" DROP CONSTRAINT "ProductCategory_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "ProductCategory" DROP CONSTRAINT "ProductCategory_productId_fkey";

-- AlterTable
ALTER TABLE "Image" DROP COLUMN "url",
ADD COLUMN     "productimage" TEXT NOT NULL,
ADD COLUMN     "productimagePublicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "categoryId" TEXT;

-- DropTable
DROP TABLE "ProductCategory";

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
