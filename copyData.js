const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

// Create two Prisma clients with different connection strings
const devPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.POSTGRES_PRISMA_URL_DEV
    }
  }
});

const prodPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.POSTGRES_PRISMA_URL
    }
  }
});

async function copyData() {
  try {
    console.log('Starting data copy process...');

    // Copy Users
    const users = await devPrisma.user.findMany();
    console.log(`Found ${users.length} users to copy`);
    for (const user of users) {
      await prodPrisma.user.create({
        data: user
      });
    }

    // Copy Questions
    const questions = await devPrisma.question.findMany();
    console.log(`Found ${questions.length} questions to copy`);
    for (const question of questions) {
      await prodPrisma.question.create({
        data: question
      });
    }

    // Copy Games
    const games = await devPrisma.game.findMany({
      include: {
        questions: true
      }
    });
    console.log(`Found ${games.length} games to copy`);
    for (const game of games) {
      const { questions, ...gameData } = game;
      await prodPrisma.game.create({
        data: {
          ...gameData,
          questions: {
            connect: questions.map(q => ({ question_id: q.question_id }))
          }
        }
      });
    }

    // Copy Friends
    const friends = await devPrisma.friend.findMany();
    console.log(`Found ${friends.length} friend relationships to copy`);
    for (const friend of friends) {
      await prodPrisma.friend.create({
        data: friend
      });
    }

    // Copy Results and their associated Guesses
    const results = await devPrisma.result.findMany({
      include: {
        guesses: true
      }
    });
    console.log(`Found ${results.length} results to copy`);
    for (const result of results) {
      const { guesses, ...resultData } = result;
      const newResult = await prodPrisma.result.create({
        data: resultData
      });

      // Create associated guesses
      if (guesses.length > 0) {
        await prodPrisma.guess.createMany({
          data: guesses.map(guess => ({
            ...guess,
            result_id: newResult.result_id
          }))
        });
      }
    }

    console.log('Data copy completed successfully!');
  } catch (error) {
    console.error('Error copying data:', error);
  } finally {
    await devPrisma.$disconnect();
    await prodPrisma.$disconnect();
  }
}

copyData(); 