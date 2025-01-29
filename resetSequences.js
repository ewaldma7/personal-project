import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function resetSequences() {
  try {
    console.log("Starting sequence reset...");

    await prisma.$executeRaw`
      SELECT setval(pg_get_serial_sequence('public."User"', 'user_id'), 
        COALESCE((SELECT MAX(user_id) FROM public."User"), 0) + 1, false);
    `;
    console.log("Reset User sequence");

    await prisma.$executeRaw`
      SELECT setval(pg_get_serial_sequence('public."Game"', 'game_id'), 
        COALESCE((SELECT MAX(game_id) FROM public."Game"), 0) + 1, false);
    `;
    console.log("Reset Game sequence");

    await prisma.$executeRaw`
      SELECT setval(pg_get_serial_sequence('public."Question"', 'question_id'), 
        COALESCE((SELECT MAX(question_id) FROM public."Question"), 0) + 1, false);
    `;
    console.log("Reset Question sequence");

    await prisma.$executeRaw`
      SELECT setval(pg_get_serial_sequence('public."Result"', 'result_id'), 
        COALESCE((SELECT MAX(result_id) FROM public."Result"), 0) + 1, false);
    `;
    console.log("Reset Result sequence");

    await prisma.$executeRaw`
      SELECT setval(pg_get_serial_sequence('public."Guess"', 'id'), 
        COALESCE((SELECT MAX(id) FROM public."Guess"), 0) + 1, false);
    `;
    console.log("Reset Guess sequence");

    console.log("All sequences reset successfully");
  } catch (error) {
    console.error("Error resetting sequences:", error);
  } finally {
    await prisma.$disconnect();
  }
}

resetSequences();
