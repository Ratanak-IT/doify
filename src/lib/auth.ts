// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";
import Database from "better-sqlite3";

const db = new Database("./doify.db");   // ← This creates the database automatically

export const auth = betterAuth({
  database: db,

  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false, // change to true later if you want verification
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
    facebook: {
      clientId: process.env.FACEBOOK_CLIENT_ID!,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
    },
  },

  plugins: [nextCookies()],

  session: {
    expiresIn: 60 * 60 * 24 * 30, // 30 days
  },

  // Optional: match your existing user fields
  user: {
    additionalFields: {
      fullName: { type: "string", required: false },
      username: { type: "string", required: false },
      gender: { type: "string", required: false },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;