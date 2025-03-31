/*
  Warnings:

  - You are about to drop the column `productId` on the `SubCategory` table. All the data in the column will be lost.
  - You are about to drop the `_CategoryToProduct` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "SubCategory" DROP CONSTRAINT "SubCategory_productId_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToProduct" DROP CONSTRAINT "_CategoryToProduct_A_fkey";

-- DropForeignKey
ALTER TABLE "_CategoryToProduct" DROP CONSTRAINT "_CategoryToProduct_B_fkey";

-- AlterTable
ALTER TABLE "SubCategory" DROP COLUMN "productId";

-- DropTable
DROP TABLE "_CategoryToProduct";

-- CreateTable
CREATE TABLE "ProductCategory" (
    "productId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("productId","categoryId")
);

-- CreateTable
CREATE TABLE "ProductSubCategory" (
    "productId" TEXT NOT NULL,
    "subcategoryId" TEXT NOT NULL,

    CONSTRAINT "ProductSubCategory_pkey" PRIMARY KEY ("productId","subcategoryId")
);

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductCategory" ADD CONSTRAINT "ProductCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSubCategory" ADD CONSTRAINT "ProductSubCategory_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSubCategory" ADD CONSTRAINT "ProductSubCategory_subcategoryId_fkey" FOREIGN KEY ("subcategoryId") REFERENCES "SubCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
