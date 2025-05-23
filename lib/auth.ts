import type { AuthOptions, DefaultSession } from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/db";
import CoinbaseProvider from "next-auth/providers/coinbase";

declare module "next-auth" {
  interface Session {
    user?: {
      id: string;
    } & DefaultSession["user"]
  }
}

const authorizationUrl = "https://www.coinbase.com/oauth/authorize?scope=wallet:accounts:read+wallet:user:read+wallet:user:email";

if (!process.env.COINBASE_CLIENT_ID || !process.env.COINBASE_CLIENT_SECRET || !process.env.NEXTAUTH_SECRET) {
  throw new Error("Missing environment variables");
}

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CoinbaseProvider({
      authorization: authorizationUrl,
      clientId: process.env.COINBASE_CLIENT_ID,
      clientSecret: process.env.COINBASE_CLIENT_SECRET,
    }),
  ],
  adapter: DrizzleAdapter(db),
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        // biome-ignore lint/style/noNonNullAssertion: next-auth doesn't infer the type of the user object
        session.user!.id = user.id;
      }
      return session;
    },
  }
};