"use client";

import { useAppSelector } from "@/lib/hooks";
import { getTranslation } from "./locales";

export function useTranslation() {
  const language = useAppSelector((state) => state.i18n?.language || "en") as "en" | "kh";

  const t = (key: string, defaultValue?: string): string => {
    return getTranslation(language, key, defaultValue);
  };

  return { t, language };
}
