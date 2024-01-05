import prisma from "@/app/lib/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params}:{params: {date: string}}) {
    try {
        const existingGame = await prisma.game.findUnique({
            where: {
                date: new Date(params.date)
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
        return NextResponse.json('Error', { status: 500 });
    }
}