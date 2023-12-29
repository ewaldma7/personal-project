/*
  Warnings:

  - You are about to drop the `users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "users";

-- CreateTable
CREATE TABLE "User" (
    "user_id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "email" VARCHAR(100) NOT NULL,
    "password_hash" VARCHAR(255) NOT NULL,
    "location" VARCHAR(255),
    "role" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "User_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "Question" (
    "question_id" SERIAL NOT NULL,
    "question" TEXT NOT NULL,
    "answer" VARCHAR(255) NOT NULL,
    "category" VARCHAR(255) NOT NULL,
    "createdAt" DATE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATE,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("question_id")
);

-- CreateTable
CREATE TABLE "Game" (
    "game_id" SERIAL NOT NULL,
    "date" DATE NOT NULL,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("game_id")
);

-- CreateTable
CREATE TABLE "Result" (
    "result_id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "game_id" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,

    CONSTRAINT "Result_pkey" PRIMARY KEY ("result_id")
);

-- CreateTable
CREATE TABLE "_GameToQuestion" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Question_question_key" ON "Question"("question");

-- CreateIndex
CREATE UNIQUE INDEX "Game_date_key" ON "Game"("date");

-- CreateIndex
CREATE UNIQUE INDEX "Result_user_id_game_id_key" ON "Result"("user_id", "game_id");

-- CreateIndex
CREATE UNIQUE INDEX "_GameToQuestion_AB_unique" ON "_GameToQuestion"("A", "B");

-- CreateIndex
CREATE INDEX "_GameToQuestion_B_index" ON "_GameToQuestion"("B");

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Result" ADD CONSTRAINT "Result_game_id_fkey" FOREIGN KEY ("game_id") REFERENCES "Game"("game_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameToQuestion" ADD CONSTRAINT "_GameToQuestion_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("game_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GameToQuestion" ADD CONSTRAINT "_GameToQuestion_B_fkey" FOREIGN KEY ("B") REFERENCES "Question"("question_id") ON DELETE CASCADE ON UPDATE CASCADE;
