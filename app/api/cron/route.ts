import { Category, PrismaClient } from "@prisma/client";
import OpenAI from "openai";
import dotenv from "dotenv";
import { NextRequest, NextResponse } from "next/server";
dotenv.config();

// Initialize both dev and prod Prisma clients
const devPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.POSTGRES_PRISMA_URL_DEV,
    },
  },
});

const prodPrisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.POSTGRES_PRISMA_URL,
    },
  },
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Categories from your existing code
const categories = [
  "HISTORY",
  "GEOGRAPHY",
  "SCIENCE",
  "SPORTS",
  "ART",
  "ENTERTAINMENT",
];

interface Question {
  question: string;
  correctChoice: string;
  choices: string[];
  category: string;
}

async function getUsedTopics(
  prisma: PrismaClient,
  category?: string
): Promise<string[]> {
  const topics = await prisma.usedTopic.findMany({
    where: category ? { category: category as Category } : undefined,
    select: { name: true },
  });
  return topics.map((t) => t.name);
}

async function markTopicAsUsed(
  prisma: PrismaClient,
  category: Category,
  name: string
) {
  await prisma.usedTopic.create({
    data: {
      category,
      name,
      createdAt: new Date(),
    },
  });
}

async function generateTopicsForCategory(
  category: Category,
  usedTopics: string[]
): Promise<string[]> {
  const prompt = `Generate 5 specific topics for ${category} trivia questions.
  
  Previously used topics (DO NOT use these):
  ${usedTopics.join("\n")}

  Requirements:
  - Topics should be specific enough to generate multiple unique questions
  - Topics must NOT be in the previously used list
  - Return as JSON array of strings
  - Each topic should be specific rather than general
    Example: Instead of "World War 2", use specific topics like "Battle of Midway" or "Manhattan Project"
  
  Return format:
  {
    "topics": ["topic1", "topic2", "topic3", "topic4", "topic5"]
  }`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "system", content: prompt }],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0].message.content ?? "");
  return result.topics;
}

async function generateQuestionsForTopic(
  topic: string,
  category: string
): Promise<Question[]> {
  const prompt = `Generate 3 unique trivia questions about "${topic}".
  Return in JSON format:
  {
    "questions": [{
      "question": string,
      "correctChoice": string,
      "choices": string[5],
      "category": "${category}"
    }]
  }
  Requirements:
  - Questions should be challenging but not obscure
  - Each question must have exactly 5 choices
  - Choices array must include the correct answer
  - Questions must be factually accurate
  - No duplicate questions or choices
  - Questions should be self-contained (don't use pronouns without context)`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "system", content: prompt }],
    response_format: { type: "json_object" },
  });

  const result = JSON.parse(response.choices[0].message.content ?? "");
  return result.questions;
}

async function saveQuestionsToDatabase(questions: Question[]) {
  console.log("Saving questions to development database...");
  await devPrisma.question.createMany({
    data: questions,
    skipDuplicates: true,
  });

  console.log("Saving questions to production database...");
  await prodPrisma.question.createMany({
    data: questions,
    skipDuplicates: true,
  });
}

async function createNextDayGame() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(0, 0, 0, 0);

  // Check if game already exists for tomorrow
  const existingGame = await prodPrisma.game.findUnique({
    where: { date: tomorrow },
  });

  if (existingGame) {
    console.log("Game already exists for tomorrow");
    return;
  }

  // Select one unused question from each category
  const selectedQuestions = [];
  for (const category of categories) {
    const question = await prodPrisma.question.findFirst({
      where: {
        category,
        used: false,
      },
    });

    if (question) {
      selectedQuestions.push(question);
      // Mark question as used
      await prodPrisma.question.update({
        where: { question_id: question.question_id },
        data: { used: true },
      });
    }
  }

  if (selectedQuestions.length !== categories.length) {
    throw new Error("Not enough unused questions available for all categories");
  }

  // Create game for tomorrow
  await prodPrisma.game.create({
    data: {
      date: tomorrow,
      questions: {
        connect: selectedQuestions.map((q) => ({ question_id: q.question_id })),
      },
    },
  });

  // Mirror to dev database
  await devPrisma.game.create({
    data: {
      date: tomorrow,
      questions: {
        connect: selectedQuestions.map((q) => ({ question_id: q.question_id })),
      },
    },
  });

  console.log(
    `Created game for ${tomorrow.toISOString()} with ${
      selectedQuestions.length
    } questions`
  );
}

export async function GET(request: NextRequest) {
  // Check authorization
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Check if we need to generate new questions
    const unusedQuestionCount = await prodPrisma.question.count({
      where: { used: false },
    });

    if (unusedQuestionCount < 10) {
      // Generate more questions when pool is low
      console.log("Generating new questions...");
      // Your existing question generation code here
      for (const category of categories) {
        const categoryUsedTopics = await getUsedTopics(prodPrisma, category);
        const newTopics = await generateTopicsForCategory(
          category as Category,
          categoryUsedTopics
        );

        for (const topic of newTopics) {
          const questions = await generateQuestionsForTopic(topic, category);
          await saveQuestionsToDatabase(questions);
          await markTopicAsUsed(prodPrisma, category as Category, topic);
          await markTopicAsUsed(devPrisma, category as Category, topic);
        }
      }
    }

    // Create next day's game
    await createNextDayGame();

    return NextResponse.json(
      { message: "Successfully processed daily tasks" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in cron job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  } finally {
    await devPrisma.$disconnect();
    await prodPrisma.$disconnect();
  }
}
