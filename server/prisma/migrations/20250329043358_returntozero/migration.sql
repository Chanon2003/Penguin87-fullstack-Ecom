/*
  Warnings:

  - You are about to drop the column `productId` on the `ProductDetails` table. All the data in the column will be lost.
  - Made the column `invoice_receipt` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_product_details_fkey";

-- DropForeignKey
ALTER TABLE "Product" DROP CONSTRAINT "Product_id_fkey";

-- DropIndex
DROP INDEX "ProductDetails_productId_key";

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "invoice_receipt" SET NOT NULL;

-- AlterTable
ALTER TABLE "ProductDetails" DROP COLUMN "productId";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_product_details_fkey" FOREIGN KEY ("productId") REFERENCES "ProductDetails"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
