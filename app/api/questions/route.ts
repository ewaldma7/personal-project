import prisma from "@/app/lib/client";
import { createQuestionSchema } from "@/app/validationSchemas";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = createQuestionSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(validation.error.format(), { status: 400 });
        }
        const existingQuestion = await prisma.question.findUnique({
            where: {
                question: body.question
            },
        });
        if (existingQuestion) {
            return NextResponse.json('This question already exists', { status: 400 });
        }
        const newQuestion = await prisma.question.create({ data: { question: body.question, answer: body.answer, category: body.category } });
        return NextResponse.json(newQuestion, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json('Error creating question', { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const allQuestions = await prisma.question.findMany();
        return NextResponse.json(allQuestions, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json('Error retrieving questions', { status: 500 });
    }
}