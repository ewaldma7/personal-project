import prisma from "@/app/lib/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: { userId: string, gameId: string } }) {
  try {
    const { userId, gameId } = params;

    if (gameId !== "*" && userId !== "*") {
      const existingResult = await prisma.result.findUnique({
        where: {
          user_id_game_id: {
            user_id: Number(userId),
            game_id: Number(gameId)
          }
        }
      });
      return NextResponse.json(existingResult || {}, { status: 200 });
    }

    const filter = userId === "*" ? { game_id: Number(gameId) } : { user_id: Number(userId) };
    const orderBy = userId === "*" ? undefined : { date: 'desc' as const};
    const results = await prisma.result.findMany({
      where: filter,
      orderBy: orderBy
    });

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
