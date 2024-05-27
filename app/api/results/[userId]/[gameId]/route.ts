import prisma from "@/app/lib/client";
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
        },
        include: {
          guesses: true
        }
      });
      return NextResponse.json(existingResult || {}, { status: 200 });
    }

    const filter = userId === "*" ? { game_id: Number(gameId) } : { user_id: Number(userId) };
    const orderBy = userId === "*" ? undefined : { date: 'desc' as const};
    const results = await prisma.result.findMany({
      where: filter,
      orderBy: orderBy,
      include: {guesses: true}
    });

    return NextResponse.json(results, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
