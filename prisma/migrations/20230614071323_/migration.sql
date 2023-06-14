/*
  Warnings:

  - The values [EASY,MEDIUM,DIFFICULT,EXTREME] on the enum `RecipeDifficulty` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RecipeDifficulty_new" AS ENUM ('F', 'D', 'M');
ALTER TABLE "Recipe" ALTER COLUMN "difficulty" TYPE "RecipeDifficulty_new" USING ("difficulty"::text::"RecipeDifficulty_new");
ALTER TYPE "RecipeDifficulty" RENAME TO "RecipeDifficulty_old";
ALTER TYPE "RecipeDifficulty_new" RENAME TO "RecipeDifficulty";
DROP TYPE "RecipeDifficulty_old";
COMMIT;
