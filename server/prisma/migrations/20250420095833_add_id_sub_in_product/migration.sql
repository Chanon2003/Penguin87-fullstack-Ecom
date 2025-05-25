-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "subCategoryIds" TEXT[] DEFAULT ARRAY[]::TEXT[];
