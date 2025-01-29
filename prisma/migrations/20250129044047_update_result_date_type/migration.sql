/*
  Warnings:

  - Changed the type of `date` on the `Result` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Result" DROP COLUMN "date",
ADD COLUMN     "date" DATE NOT NULL;