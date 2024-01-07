import prisma from "@/app/lib/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params}:{params: {userId: string, gameId: string}}) {
    try {
        const existingResult = await prisma.result.findUnique({
            where: {
              user_id_game_id: {
                user_id: Number(params.userId),
                game_id: Number(params.gameId)
              }
            }
          });
        if (existingResult) {
            return NextResponse.json(existingResult, {status: 200});
        }
        return NextResponse.json({}, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json('Error', { status: 500 });
    }
}