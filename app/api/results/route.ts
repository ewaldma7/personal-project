import prisma from "@/app/lib/client";
import { createResultSchema } from "@/app/validationSchemas";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        console.log(body);
        // const validation = createResultSchema.safeParse(body);
        // if (!validation.success) {
        //     return NextResponse.json(validation.error.format(), { status: 400 });
        // }
        const existingResult = await prisma.result.findUnique({
            where: {
              user_id_game_id: {
                user_id: body.user_id,
                game_id: body.game_id
              }
            }
          });
        if (existingResult) {
            return NextResponse.json('This result already exists', { status: 400 });
        }
        const newResult = await prisma.result.create(
            { data: { user_id: body.user_id, game_id: body.game_id, guesses: body.guesses, score: body.score, date:body.date},
        include: {game: true} });
        return NextResponse.json(newResult, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json('Error creating result', { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const allResults = await prisma.result.findMany();          
        return NextResponse.json(allResults, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json('Error retrieving results', { status: 500 });
    }
}