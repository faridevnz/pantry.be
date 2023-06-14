/*
  Warnings:

  - Added the required column `category` to the `Recipe` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Recipe" ADD COLUMN     "category" TEXT NOT NULL,
ADD COLUMN     "recipeCategoryId" TEXT;

-- CreateTable
CREATE TABLE "RecipeCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "RecipeCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RecipeCategory_id_key" ON "RecipeCategory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "RecipeCategory_name_key" ON "RecipeCategory"("name");

-- AddForeignKey
ALTER TABLE "Recipe" ADD CONSTRAINT "Recipe_recipeCategoryId_fkey" FOREIGN KEY ("recipeCategoryId") REFERENCES "RecipeCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
