"use client";

/**
 * useNotificationStream
 *
 * Connects to the backend's SSE endpoint for real-time notifications.
 * When a new notification arrives it dispatches an RTK Query cache
 * invalidation so every component that subscribes to "Notification"
 * refetches automatically — no manual polling needed.
 *
 * Falls back gracefully to aggressive polling (8 s) if SSE is not
 * available or the browser doesn't support EventSource.
 */

import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { baseApi } from "@/lib/features/api/api";

const SSE_PATH = "/notifications/stream"; // relative to NEXT_PUBLIC_API/api/v1
const POLL_INTERVAL_MS  = 8_000;          // fallback polling interval
const RECONNECT_DELAY_MS = 5_000;         // SSE reconnect delay after error

function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find(r => r.startsWith("token="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export function useNotificationStream() {
  const dispatch  = useAppDispatch();
  const token     = useAppSelector((s) => s.auth.token) ?? getToken();
  const sseRef    = useRef<EventSource | null>(null);
  const timerRef  = useRef<ReturnType<typeof setInterval> | null>(null);
  const sseWorking = useRef<boolean>(false);

  /** Invalidate the Notification tag → all subscribers refetch */
  function invalidate() {
    dispatch(baseApi.util.invalidateTags(["Notification"]));
  }

  useEffect(() => {
    if (!token) return;

    const baseUrl = process.env.NEXT_PUBLIC_API;

    // ── Try SSE first ────────────────────────────────────────────────
    const trySSE = () => {
      if (!baseUrl || typeof EventSource === "undefined") {
        startPolling();
        return;
      }

      const url = `${baseUrl}/api/v1${SSE_PATH}?token=${encodeURIComponent(token)}`;

      try {
        const es = new EventSource(url);
        sseRef.current = es;

        es.onopen = () => {
          sseWorking.current = true;
          // SSE connected — stop any fallback polling
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
        };

        es.onmessage = (evt) => {
          // Any message from server means there is a new notification
          try {
            const data = JSON.parse(evt.data);
            // Server can send { type: "NOTIFICATION" } or any payload
            if (data) invalidate();
          } catch {
            invalidate(); // even unparseable events should trigger a refresh
          }
        };

        // Handle named events the backend might emit
        es.addEventListener("NOTIFICATION", () => invalidate());
        es.addEventListener("notification", () => invalidate());
        es.addEventListener("ping", () => {/* keep-alive, no action needed */});

        es.onerror = () => {
          sseWorking.current = false;
          es.close();
          sseRef.current = null;
          // Start polling as a fallback and schedule SSE reconnect
          startPolling();
          setTimeout(trySSE, RECONNECT_DELAY_MS);
        };
      } catch {
        startPolling();
      }
    };

    // ── Polling fallback ─────────────────────────────────────────────
    const startPolling = () => {
      if (timerRef.current) return; // already polling
      timerRef.current = setInterval(() => {
        // If SSE came back online, stop polling
        if (sseWorking.current) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          return;
        }
        invalidate();
      }, POLL_INTERVAL_MS);
    };

    trySSE();

    return () => {
      sseRef.current?.close();
      sseRef.current = null;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);
}