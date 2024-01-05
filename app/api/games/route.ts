import prisma from "@/app/lib/client";
import { createGameSchema } from "@/app/validationSchemas";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = createGameSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(validation.error.format(), { status: 400 });
        }
        const existingQuestion = await prisma.game.findUnique({
            where: {
                game_id: body.game_id
            },
        });
        if (existingQuestion) {
            return NextResponse.json('This game already exists', { status: 400 });
        }
        const newQuestion = await prisma.question.create({ data: { question: body.question, answer: body.answer, category: body.category } });
        return NextResponse.json(newQuestion, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json('Error creating game', { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const allGames = await prisma.game.findMany({
            include: {
              questions: true,
            },
          });          
        return NextResponse.json(allGames, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json('Error retrieving games', { status: 500 });
    }
}