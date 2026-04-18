"use client";

import { useTheme } from "@/lib/contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="
        fixed top-4 right-4 z-50
        w-10 h-10 rounded-xl
        flex items-center justify-center
        bg-white/10 hover:bg-white/20
        dark:bg-white/10 dark:hover:bg-white/20
        border border-white/20 dark:border-white/20
        text-slate-600 dark:text-[#E2E0F0]
        backdrop-blur-sm
        transition-all duration-200
        shadow-sm
      "
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeToggle />
      {children}
    </>
  );
}