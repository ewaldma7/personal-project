import prisma from "@/app/lib/client";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log(body);

    const existingResult = await prisma.result.findUnique({
      where: {
        user_id_game_id: {
          user_id: body.user_id,
          game_id: body.game_id,
        },
      },
    });

    if (existingResult) {
      return NextResponse.json("This result already exists", { status: 400 });
    }

    // Create result and guesses in a single transaction
    const newResult = await prisma.$transaction(async (tx) => {
      // Create the result first
      const result = await tx.result.create({
        data: {
          user_id: body.user_id,
          game_id: body.game_id,
          score: body.score,
          date: body.date,
        },
      });

      // Create all guesses with the new result_id
      await tx.guess.createMany({
        data: body.guesses.map((guess: any) => ({
          ...guess,
          result_id: result.result_id,
        })),
      });

      return result;
    });

    return NextResponse.json(newResult, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Error creating result", { status: 500 });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string; gameId: string } }
) {
  try {
    const { userId, gameId } = params;

    if (gameId !== "*" && userId !== "*") {
      const existingResult = await prisma.result.findUnique({
        where: {
          user_id_game_id: {
            user_id: Number(userId),
            game_id: Number(gameId),
          },
        },
        include: {
          guesses: true,
        },
      });
      return NextResponse.json(existingResult || {}, { status: 200 });
    }

    const filter =
      userId === "*"
        ? { game_id: Number(gameId) }
        : { user_id: Number(userId) };

    const results = await prisma.result.findMany({
      where: filter,
      include: { guesses: true },
    });

    // Sort results by converting string dates to Date objects
    const sortedResults = results.sort((a, b) => {
      const dateA = new Date(a.date.split("-").join("/"));
      const dateB = new Date(b.date.split("-").join("/"));
      return dateB.getTime() - dateA.getTime();
    });

    return NextResponse.json(sortedResults, { status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(error, { status: 500 });
  }
}
