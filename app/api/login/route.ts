import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcrypt';
import prisma from "@/app/lib/client";
import { signJwtAccessToken } from "@/app/lib/jwt";

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { email, password } = body;
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });
        if (user && (await bcrypt.compare(password, user.password_hash))) {
            const {password_hash, ...userWithoutPass} = user;
            const accessToken = signJwtAccessToken(userWithoutPass);
            const result = {...userWithoutPass, accessToken};
            return NextResponse.json(result, {status: 201});
        } else {
            return NextResponse.json(null);
        }
    } catch (error) {
        return NextResponse.json('Error logging in', { status: 500 });
    }
}