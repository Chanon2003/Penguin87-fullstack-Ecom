/*
  Warnings:

  - A unique constraint covering the columns `[productId]` on the table `ProductDetails` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productId` to the `ProductDetails` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_product_details_fkey";

-- AlterTable
ALTER TABLE "ProductDetails" ADD COLUMN     "productId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProductDetails_productId_key" ON "ProductDetails"("productId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_product_details_fkey" FOREIGN KEY ("productId") REFERENCES "ProductDetails"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_id_fkey" FOREIGN KEY ("id") REFERENCES "ProductDetails"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;
