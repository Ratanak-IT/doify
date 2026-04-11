"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { setCredentials } from "@/lib/features/auth/authSlice";

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

  useEffect(() => {
    if (token) return;

    const cookieToken        = getCookie("token");
    const cookieRefreshToken = getCookie("refreshToken");
    const cookieUserStr      = getCookie("user");

    if (!cookieToken) return;

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
  }, [dispatch, token]);

  return null;
}