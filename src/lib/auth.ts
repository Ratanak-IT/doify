import { betterAuth } from "better-auth";
import { nextCookies } from "better-auth/next-js";


export const auth = betterAuth({

  // ── Social providers ────────────────────────────────────────────────────
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

});

export type Session = typeof auth.$Infer.Session;
export type User    = typeof auth.$Infer.Session.user;
  