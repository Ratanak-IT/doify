"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setCredentials } from "@/lib/features/auth/authSlice";
import { useSession } from "@/lib/auth-client";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export function AuthRehydrator() {
  const dispatch = useAppDispatch();
  const token = useAppSelector((s) => s.auth.token);
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (token) return;

    // First, try to get from custom cookies (for traditional login/register)
    const cookieToken        = getCookie("token");
    const cookieRefreshToken = getCookie("refreshToken");
    const cookieUserStr      = getCookie("user");

    if (cookieToken) {
      try {
        const user = cookieUserStr ? JSON.parse(cookieUserStr) : null;
        if (user) {
          dispatch(
            setCredentials({
              user,
              token: cookieToken,
              refreshToken: cookieRefreshToken ?? undefined,
            })
          );
        }
      } catch {
        // cookie parse failed — user must re-login
      }
      return;
    }

    // If no custom cookies, check Better Auth session
    if (!isPending && session?.user) {
      // For social login, we have the session, but need to get tokens from backend
      // Since the backend was called in hooks, perhaps we can assume the user is authenticated
      // But to get tokens, we might need to call an API
      // For now, set a placeholder or fetch tokens
      // This might need backend changes to support getting tokens by Better Auth user id
      console.log("Better Auth session:", session);
      // TODO: Fetch tokens from backend using session.user.id
    }
  }, [dispatch, token, session, isPending]);

  return null;
}