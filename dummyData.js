const { PrismaClient } = require('@prisma/client');
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');
const { readFileSync } = require('fs');

const prisma = new PrismaClient();

async function runMigration(dataType) {
  try {
    if (dataType === "user") {
      for (let i = 0; i < 10; i++) {
        const first = faker.person.firstName();
        const last = faker.person.lastName();
        const email = faker.internet.email({ firstName: first, lastName: last });
        const password = process.env.DEFAULT_PASSWORD; // Generate a random password
        const location = faker.location.country();
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
          data: {
            name: `${first} ${last}`,
            email,
            password_hash: hashedPassword,
            location
          },
        });
      }
    } else if (dataType === "question") {
      const questionsData = JSON.parse(readFileSync('questions.json', 'utf-8'));
      for (const questionData of questionsData) {
        await prisma.question.create({
          data: {
            question: questionData.question,
            correctChoice: questionData.correctChoice,
            choices: questionData.choices,
            category: questionData.category,
          },
        });
      }
    } else if (dataType === "game") {
      for (let i=19; i < 20; i++) {
        const randomQuestions = await prisma.question.findMany({
          take: 5, // Fetch 5 random questions
          skip: Math.floor(Math.random() * 20), // Assuming you have at least 20 questions in the database
          orderBy: { question_id: 'asc' }, // You can adjust the order based on your requirements
        });
        await prisma.game.create({
          data: {
            date: `5/${i}/2024`,
            questions: {
              connect: randomQuestions.map(question => ({ question_id: question.question_id })),
            }
          }
        })
      }
    } else if (dataType === "result") {
      
    }

    console.log('Migration script executed successfully.');
  } catch (error) {
    console.error('Error executing migration script:', error);
  } finally {
    await prisma.$disconnect();
  }
}

runMigration("game");
