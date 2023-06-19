/*
  Warnings:

  - A unique constraint covering the columns `[foodId,recipeId]` on the table `Recipe_Food` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Recipe_Food_foodId_recipeId_key" ON "Recipe_Food"("foodId", "recipeId");
