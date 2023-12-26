import { NextRequest, NextResponse } from "next/server";
import prisma from "@/prisma/client";
import { createUserSchema } from "@/app/validationSchemas";
import bcrypt from 'bcrypt';

async function hashPassword(password: string): Promise<string> {
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        return hashedPassword;
    } catch (error) {
        throw new Error('Error hashing password');
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const validation = createUserSchema.safeParse(body);
        if (!validation.success) {
            return NextResponse.json(validation.error.format(), { status: 400 });
        }
        const existingUser = await prisma.users.findUnique({
            where: {
                email: body.email,
            },
        });
        if (existingUser) {
            return NextResponse.json('User with this email already exists', { status: 400 });
        }
        const password_hash = await hashPassword(body.password);
        const newUser = await prisma.users.create({data: {name: body.name, email: body.email, password_hash: password_hash, }});
        const { password_hash: _, ...userResponse } = newUser;
        return NextResponse.json(userResponse, {status: 201});
    } catch (error) {
        return NextResponse.json('Error creating user', { status: 500 });
    }
}