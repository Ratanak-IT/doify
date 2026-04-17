import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  /**
   * The URL where your Better Auth API is mounted.
   * Defaults to the same origin, so this env var is only needed when the
   * Next.js front-end and API are deployed on different domains.
   */
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
});

// Convenience re-exports used by login / register pages
export const { signIn, signUp, signOut, useSession } = authClient;