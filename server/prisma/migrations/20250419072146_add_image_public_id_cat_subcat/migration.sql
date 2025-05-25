/*
  Warnings:

  - You are about to drop the column `image` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `SubCategory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "image",
ADD COLUMN     "catimage" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "catimagePublicId" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "SubCategory" DROP COLUMN "image",
ADD COLUMN     "subcatimage" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "subcatimagePublicId" TEXT NOT NULL DEFAULT '';
