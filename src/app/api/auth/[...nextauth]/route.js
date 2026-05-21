import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/db";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {},

      async authorize(credentials) {
        await connectDB();

        const email = credentials.username?.toLowerCase().trim();

        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("User not found");
        }

        const isMatch = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isMatch) {
          throw new Error("Invalid password");
        }

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },

    async session({ session, token }) {
      session.user.role = token.role;
      session.user.email = token.email;
      session.user.name = token.name;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };