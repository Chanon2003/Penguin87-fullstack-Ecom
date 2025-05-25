/*
  Warnings:

  - A unique constraint covering the columns `[productId,categoryId]` on the table `ProductCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[productId,subCategoryId]` on the table `ProductSubCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_productId_categoryId_key" ON "ProductCategory"("productId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductSubCategory_productId_subCategoryId_key" ON "ProductSubCategory"("productId", "subCategoryId");
