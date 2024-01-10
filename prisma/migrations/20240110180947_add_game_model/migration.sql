/*
  Warnings:

  - Added the required column `date` to the `Result` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('HISTORY', 'GEOGRAPHY', 'SCIENCE', 'SPORTS', 'ART', 'ENTERTAINMENT');

-- AlterTable
ALTER TABLE "Game" ALTER COLUMN "date" SET DATA TYPE VARCHAR(30);

-- AlterTable
ALTER TABLE "Result" ADD COLUMN     "date" VARCHAR(30) NOT NULL;

-- CreateTable
CREATE TABLE "Guess" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "result_id" INTEGER NOT NULL,
    "guess" TEXT NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,

    CONSTRAINT "Guess_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Guess" ADD CONSTRAINT "Guess_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guess" ADD CONSTRAINT "Guess_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "Question"("question_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Guess" ADD CONSTRAINT "Guess_result_id_fkey" FOREIGN KEY ("result_id") REFERENCES "Result"("result_id") ON DELETE RESTRICT ON UPDATE CASCADE;
