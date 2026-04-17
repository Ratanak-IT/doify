"use client";

import { useNotificationStream } from "@/lib/features/notifications/useNotificationStream";

/**
 * Thin client wrapper that activates the SSE / polling notification stream.
 * Placed inside the dashboard layout so it runs on every dashboard page.
 */
export function NotificationStreamProvider() {
  useNotificationStream();
  return null;
}