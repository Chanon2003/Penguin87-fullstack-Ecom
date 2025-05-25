/*
  Warnings:

  - The primary key for the `ProductCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ProductSubCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `subcategoryId` on the `ProductSubCategory` table. All the data in the column will be lost.
  - The required column `id` was added to the `ProductCategory` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `ProductSubCategory` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `subCategoryId` to the `ProductSubCategory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProductSubCategory" DROP CONSTRAINT "ProductSubCategory_subcategoryId_fkey";

-- AlterTable
ALTER TABLE "ProductCategory" DROP CONSTRAINT "ProductCategory_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProductSubCategory" DROP CONSTRAINT "ProductSubCategory_pkey",
DROP COLUMN "subcategoryId",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "subCategoryId" TEXT NOT NULL,
ADD CONSTRAINT "ProductSubCategory_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "ProductSubCategory" ADD CONSTRAINT "ProductSubCategory_subCategoryId_fkey" FOREIGN KEY ("subCategoryId") REFERENCES "SubCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
