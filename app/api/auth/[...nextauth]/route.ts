import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password) {
          console.log("Missing credentials");
          return null;
        }

        try {
          console.log("Attempting login for:", credentials.username);
          console.log("API URL:", "/api/login");

          const res = await fetch("/api/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: credentials?.username,
              password: credentials?.password,
            }),
          });

          console.log("Login response status:", res.status);

          const user = await res.json();
          console.log("Login response:", user);

          if (user) {
            return user;
          } else {
            console.log("No user returned from login");
            return null;
          }
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 86400,
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("JWT Callback - Token:", token);
      console.log("JWT Callback - User:", user);
      return { ...token, ...user };
    },
    async session({ session, token }) {
      console.log("Session Callback - Session:", session);
      console.log("Session Callback - Token:", token);
      return session;
    },
  },
});

export { handler as GET, handler as POST };
