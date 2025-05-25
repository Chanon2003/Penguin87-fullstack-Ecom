/*
  Warnings:

  - You are about to drop the column `subTotalAmt` on the `Order` table. All the data in the column will be lost.
  - Made the column `totalAmt` on table `Order` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Order" DROP COLUMN "subTotalAmt",
ALTER COLUMN "totalAmt" SET NOT NULL;
