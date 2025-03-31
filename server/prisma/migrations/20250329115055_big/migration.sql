/*
  Warnings:

  - You are about to drop the column `productId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `ProductDetails` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductDetailsOnOrder` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_productId_fkey";

-- DropForeignKey
ALTER TABLE "ProductDetailsOnOrder" DROP CONSTRAINT "ProductDetailsOnOrder_orderId_fkey";

-- DropForeignKey
ALTER TABLE "ProductDetailsOnOrder" DROP CONSTRAINT "ProductDetailsOnOrder_productDetailsId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "productId";

-- DropTable
DROP TABLE "ProductDetails";

-- DropTable
DROP TABLE "ProductDetailsOnOrder";

-- CreateTable
CREATE TABLE "ProductOnOrder" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION,

    CONSTRAINT "ProductOnOrder_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductOnOrder" ADD CONSTRAINT "ProductOnOrder_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductOnOrder" ADD CONSTRAINT "ProductOnOrder_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
