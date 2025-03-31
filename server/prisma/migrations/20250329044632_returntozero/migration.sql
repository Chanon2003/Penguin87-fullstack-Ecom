/*
  Warnings:

  - A unique constraint covering the columns `[productId]` on the table `ProductDetails` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `productId` to the `ProductDetails` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_product_details_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_product_fkey";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "productId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProductDetails" ADD COLUMN     "productId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ProductDetailsOnOrder" (
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "priceAtOrder" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ProductDetailsOnOrder_pkey" PRIMARY KEY ("orderId","productId")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductDetails_productId_key" ON "ProductDetails"("productId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDetailsOnOrder" ADD CONSTRAINT "ProductDetailsOnOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductDetailsOnOrder" ADD CONSTRAINT "ProductDetailsOnOrder_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductDetails"("productId") ON DELETE RESTRICT ON UPDATE CASCADE;
