import prisma from "@/app/lib/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, {params}:{params: {id: number}}) {
    try {
        const existingUser = await prisma.users.findUnique({
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