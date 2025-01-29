import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/client";
import { createUserSchema } from "@/app/validationSchemas";
import bcrypt from "bcrypt";
import { verifyJwt } from "@/app/lib/jwt";

async function hashPassword(password: string): Promise<string> {
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    return hashedPassword;
  } catch (error) {
    throw new Error("Error hashing password");
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = createUserSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(validation.error.format(), { status: 400 });
    }
    const existingUser = await prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (existingUser) {
      return NextResponse.json("User with this email already exists", {
        status: 400,
      });
    }
    const password_hash = await hashPassword(body.password);
    const newUser = await prisma.user.create({
      data: {
        name: body.name,
        email: body.email,
        password_hash: password_hash,
      },
    });
    const { password_hash: _, ...userResponse } = newUser;
    return NextResponse.json(userResponse, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json("Error creating user", { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const accessToken = request.headers.get("authorization");
  if (!accessToken || !verifyJwt(accessToken)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const users = await prisma.user.findMany();
    const userResponse = users.map(({ password_hash, ...rest }) => rest);
    return NextResponse.json(userResponse, { status: 200 });
  } catch (error) {
    return NextResponse.json("Error fetching all users", { status: 500 });
  }
}
