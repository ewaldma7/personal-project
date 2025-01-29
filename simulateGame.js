const { PrismaClient } = require('@prisma/client');
const dotenv = require('dotenv');

dotenv.config();
const prisma = new PrismaClient();

/**
 * Simulates a game play for a specific user and date
 * @param {Object} options
 * @param {number} options.userId - The ID of the user
 * @param {string} options.date - The date in YYYY-MM-DD format
 * @param {number} [options.forceScore] - Optional: force a specific score (0-5)
 */
async function simulateGame({ userId, date, forceScore }) {
  try {
    console.log(`Simulating game for User ${userId} on ${date}`);

    // Get game for the specified date
    const game = await prisma.game.findUnique({
      where: { date: new Date(date) },
      include: { questions: true }
    });

    if (!game) {
      console.log('No game found for this date');
      return;
    }

    // Check if user already played this game
    const existingResult = await prisma.result.findUnique({
      where: {
        user_id_game_id: {
          user_id: userId,
          game_id: game.game_id
        }
      }
    });

    if (existingResult) {
      console.log('User has already played this game');
      return;
    }

    // Generate guesses
    const guesses = game.questions.map(question => {
      let isCorrect;
      if (forceScore !== undefined) {
        // If forcing a score, distribute correct/incorrect answers to match the desired score
        const correctNeeded = forceScore;
        isCorrect = correctNeeded > 0;
        forceScore--;
      } else {
        // Random correct/incorrect if no score specified
        isCorrect = Math.random() > 0.5;
      }

      // Pick either correct answer or random wrong answer
      const guess = isCorrect 
        ? question.correctChoice 
        : question.choices.find(c => c !== question.correctChoice) || question.choices[0];

      return {
        question_id: question.question_id,
        category: question.category,
        guess,
        isCorrect,
        user_id: userId
      };
    });

    const score = guesses.filter(g => g.isCorrect).length;

    // Create result and guesses in transaction
    const result = await prisma.$transaction(async (tx) => {
      const newResult = await tx.result.create({
        data: {
          user_id: userId,
          game_id: game.game_id,
          score,
          date: new Date(date),
        },
      });

      await tx.guess.createMany({
        data: guesses.map(guess => ({
          ...guess,
          result_id: newResult.result_id,
        })),
      });

      return newResult;
    });

    console.log(`Successfully simulated game with score ${score}`);
    console.log('Result:', result);
    console.log('Guesses:', guesses);

  } catch (error) {
    console.error('Error simulating game:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Example usage
const options = {
  userId: 1,           // Replace with desired user ID
  date: '2025-01-24', // Replace with desired date
  forceScore: 5       // Optional: force a specific score (0-5)
};

simulateGame(options)
  .catch(console.error); 