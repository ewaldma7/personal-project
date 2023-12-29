import prisma from "@/app/lib/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params}:{params: {id: number}}) {
    try {
        const existingUser = await prisma.user.findUnique({
            where: {
                user_id: Number(params.id),
            },
        });
        if (existingUser) {
            const { password_hash: _, ...userResponse } = existingUser;
            return NextResponse.json(userResponse, {status: 200});
        }
        return NextResponse.json('User with this id does not exist', { status: 400 });
    } catch (error) {
        console.log(error);
        return NextResponse.json('Error', { status: 500 });
    }
}

export async function PUT(request: NextRequest, { params }: { params: { id: number } }) {
    try {
        const body = await request.json();
        const userId = Number(params.id);
        const updatedUser = await prisma.user.update({
            where: {
                user_id: userId,
            },
            data: {
                ...body,
            },
        });
        const { password_hash: _, ...userResponse } = updatedUser;
        return NextResponse.json(userResponse, { status: 200 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}