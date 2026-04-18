import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";

const BACKEND_URL = process.env.NEXT_PUBLIC_API;

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,

  baseURL: process.env.BETTER_AUTH_URL,

  socialProviders: {
    google: {
      clientId:     process.env.GOOGLE_CLIENT_ID     as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
    github: {
      clientId:     process.env.GITHUB_CLIENT_ID     as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    facebook: {
      clientId:     process.env.FACEBOOK_CLIENT_ID     as string,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET as string,
    },
  },
  databaseHooks: {
    user: {
      create: {
        after: async (user) => {
          try {
            await fetch(`${BACKEND_URL}/api/v1/auth/social-register`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                id:       user.id,
                name:     user.name,
                email:    user.email,
                avatar:   user.image ?? null,
              }),
            });
          } catch (err) {
            console.error("[better-auth] Failed to sync user to backend:", err);
          }
        },
      },
    },
  },

  plugins: [
    nextCookies(),
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User    = typeof auth.$Infer.Session.user;