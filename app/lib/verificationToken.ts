import jwt from "jsonwebtoken";

interface VerificationPayload {
  email: string;
  exp: number;
}

export function generateVerificationToken(email: string): string {
  const payload: VerificationPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60, // 24 hours
  };

  return jwt.sign(payload, process.env.VERIFICATION_TOKEN_SECRET as string);
}

export function verifyEmailToken(token: string): string | null {
  try {
    const decoded = jwt.verify(
      token,
      process.env.VERIFICATION_TOKEN_SECRET as string
    ) as VerificationPayload;
    return decoded.email;
  } catch (error) {
    return null;
  }
}
