/*
  Warnings:

  - You are about to drop the `_FoodToRecipe` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `carbohydrate` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fat` to the `Food` table without a default value. This is not possible if the table is not empty.
  - Added the required column `protein` to the `Food` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_FoodToRecipe" DROP CONSTRAINT "_FoodToRecipe_A_fkey";

-- DropForeignKey
ALTER TABLE "_FoodToRecipe" DROP CONSTRAINT "_FoodToRecipe_B_fkey";

-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "carbohydrate" INTEGER NOT NULL,
ADD COLUMN     "fat" INTEGER NOT NULL,
ADD COLUMN     "protein" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_FoodToRecipe";

-- CreateTable
CREATE TABLE "Recipe_Food" (
    "id" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "foodId" TEXT NOT NULL,
    "recipeId" TEXT NOT NULL,

    CONSTRAINT "Recipe_Food_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_Food_id_key" ON "Recipe_Food"("id");

-- AddForeignKey
ALTER TABLE "Recipe_Food" ADD CONSTRAINT "Recipe_Food_foodId_fkey" FOREIGN KEY ("foodId") REFERENCES "Food"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Recipe_Food" ADD CONSTRAINT "Recipe_Food_recipeId_fkey" FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
