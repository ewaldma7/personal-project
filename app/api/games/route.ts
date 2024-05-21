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
        const existingGame = await prisma.game.findUnique({
            where: {
                game_id: body.game_id
            },
        });
        if (existingGame) {
            return NextResponse.json('This game already exists', { status: 400 });
        }
        const newGame = await prisma.game.create({ data: { date: body.date } });
        return NextResponse.json(newGame, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json('Error creating game', { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const params = request.nextUrl.searchParams;
        if (params.size === 0) {
            const allGames = await prisma.game.findMany({
                include: {
                  questions: true,
                },
              });          
            return NextResponse.json(allGames, { status: 200 });
        }
        const existingGame = await prisma.game.findUnique({
            where: {
                date: new Date(params.get('date') as string)
            },
            include: {
                questions: true
            }
        });
        if (existingGame) {
            return NextResponse.json(existingGame, {status: 200});
        }
        return NextResponse.json('Game with this date does not exist', { status: 400 });
    } catch (error) {
        console.log(error);
        return NextResponse.json('Error retrieving games', { status: 500 });
    }
}