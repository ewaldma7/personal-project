import NextAuth from "next-auth/next";

declare module 'next-auth' {
    interface Session {
        user: {
            user_id: number;
            name: string;
            email: string;
            accessToken: string;
            location: string;
            role: number;
        }
    }
}