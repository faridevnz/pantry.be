-- CreateEnum
CREATE TYPE "QuantityType" AS ENUM ('MG', 'PZ', 'ML');

-- CreateEnum
CREATE TYPE "RecipeDifficulty" AS ENUM ('EASY', 'MEDIUM', 'DIFFICULT', 'EXTREME');

-- CreateTable
CREATE TABLE "Food" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "expiration" TEXT,
    "quantity_type" "QuantityType" NOT NULL,
    "quantity_value" INTEGER NOT NULL,

    CONSTRAINT "Food_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Recipe" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "process" TEXT,
    "difficulty" "RecipeDifficulty" NOT NULL,
    "time" INTEGER NOT NULL,

    CONSTRAINT "Recipe_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_FoodToRecipe" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Food_id_key" ON "Food"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Recipe_id_key" ON "Recipe"("id");

-- CreateIndex
CREATE UNIQUE INDEX "_FoodToRecipe_AB_unique" ON "_FoodToRecipe"("A", "B");

-- CreateIndex
CREATE INDEX "_FoodToRecipe_B_index" ON "_FoodToRecipe"("B");

-- AddForeignKey
ALTER TABLE "_FoodToRecipe" ADD CONSTRAINT "_FoodToRecipe_A_fkey" FOREIGN KEY ("A") REFERENCES "Food"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_FoodToRecipe" ADD CONSTRAINT "_FoodToRecipe_B_fkey" FOREIGN KEY ("B") REFERENCES "Recipe"("id") ON DELETE CASCADE ON UPDATE CASCADE;
