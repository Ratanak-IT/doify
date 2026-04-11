import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "../../store";

function getTokenFromCookie(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.split("; ").find((row) => row.startsWith("token="));
  return match ? decodeURIComponent(match.split("=")[1]) : null;
}

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/api/v1",
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token ?? getTokenFromCookie();
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
    responseHandler: async (response) => {
      const text = await response.text();
      if (!text) return null;
      try {
        const json = JSON.parse(text);
        return json?.data !== undefined ? json.data : json;
      } catch {
        return text;
      }
    },
  }),
  tagTypes: [
    "Task", "PersonalTask", "ProjectTask",
    "Project", "Team", "TeamMember",
    "Stats", "Activity",
    "Notification",
    "Profile",
    "Comment", "Attachment",
    "Dashboard",
  ],
  endpoints: () => ({}),
});