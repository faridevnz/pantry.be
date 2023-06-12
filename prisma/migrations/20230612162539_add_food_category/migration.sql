/*
  Warnings:

  - Added the required column `foodCategory` to the `Food` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Food" ADD COLUMN     "foodCategory" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "FoodCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "FoodCategory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FoodCategory_id_key" ON "FoodCategory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "FoodCategory_name_key" ON "FoodCategory"("name");

-- AddForeignKey
ALTER TABLE "Food" ADD CONSTRAINT "Food_foodCategory_fkey" FOREIGN KEY ("foodCategory") REFERENCES "FoodCategory"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
