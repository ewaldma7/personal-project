import prisma from "@/app/lib/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params}:{params: {id: number}}) {
    try {
        const existingQuestion = await prisma.question.findUnique({
            where: {
                question_id: Number(params.id),
            },
        });
        if (existingQuestion) {
            return NextResponse.json(existingQuestion, {status: 200});
        }
        return NextResponse.json('Question with this id does not exist', { status: 400 });
    } catch (error) {
        console.log(error);
        return NextResponse.json('Error', { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: number }}) {
    try {
        const body = await request.json();
        const questionId = Number(params.id);
        const updatedQuestion = await prisma.question.update({
            where: {
                question_id: questionId,
            },
            data: {
                ...body,
            },
        });
        return NextResponse.json(updatedQuestion, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}