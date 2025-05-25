/*
  Warnings:

  - Added the required column `discountAtOrder` to the `ProductOnOrder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priceAtOrder` to the `ProductOnOrder` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "discount_end" TIMESTAMP(3),
ADD COLUMN     "discount_show" DOUBLE PRECISION,
ADD COLUMN     "discount_start" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "ProductOnOrder" ADD COLUMN     "discountAtOrder" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "priceAtOrder" DOUBLE PRECISION NOT NULL;
