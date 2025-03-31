/*
  Warnings:

  - The primary key for the `ProductDetailsOnOrder` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `priceAtOrder` on the `ProductDetailsOnOrder` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `ProductDetailsOnOrder` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `ProductDetailsOnOrder` table. All the data in the column will be lost.
  - The required column `id` was added to the `ProductDetailsOnOrder` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `productDetailsId` to the `ProductDetailsOnOrder` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductDetailsOnOrder" DROP CONSTRAINT "ProductDetailsOnOrder_productId_fkey";

-- AlterTable
ALTER TABLE "ProductDetailsOnOrder" DROP CONSTRAINT "ProductDetailsOnOrder_pkey",
DROP COLUMN "priceAtOrder",
DROP COLUMN "productId",
DROP COLUMN "quantity",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "productDetailsId" TEXT NOT NULL,
ADD CONSTRAINT "ProductDetailsOnOrder_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "ProductDetailsOnOrder" ADD CONSTRAINT "ProductDetailsOnOrder_productDetailsId_fkey" FOREIGN KEY ("productDetailsId") REFERENCES "ProductDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
