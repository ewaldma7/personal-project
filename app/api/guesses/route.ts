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
        const newGuesses = await prisma.guess.createMany({
            data: body
        })
        return NextResponse.json(newGuesses, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json('Error creating result', { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const allResults = await prisma.guess.findMany();         
        return NextResponse.json(allResults, { status: 200 });
    } catch (error) {
        console.log(error);
        return NextResponse.json('Error retrieving results', { status: 500 });
    }
}