import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const verificationUrl = `${process.env.NEXT_PUBLIC_API_URL}/verify?token=${token}`;

  try {
    await resend.emails.send({
      from: "Daily Trivia Challenge <noreply@ethansdailygames.com>",
      to: email,
      subject: "Verify your email address",
      html: `
        <h1>Welcome to Daily Trivia Challenge!</h1>
        <p>Please click the link below to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
        <p>This link will expire in 24 hours.</p>
      `,
    });
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
