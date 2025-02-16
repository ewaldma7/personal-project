import { NextRequest, NextResponse } from "next/server";
import prisma from "@/app/lib/client";
import { verifyEmailToken } from "@/app/lib/verificationToken";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Invalid token" }, { status: 400 });
  }

  const email = verifyEmailToken(token);
  if (!email) {
    return NextResponse.json(
      { error: "Invalid or expired token" },
      { status: 400 }
    );
  }

  try {
    await prisma.user.update({
      where: { email },
      data: { verified: true },
    });

    return NextResponse.redirect(new URL("/login?verified=true", request.url));
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
