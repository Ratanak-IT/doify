"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import KanbanDemo from "./KanbanDemo";


export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative pt-32 pb-0 overflow-hidden min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-[#0B1120] dark:via-[#111827] dark:to-[#0B1120]">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-[#0B1120] dark:via-[#111827] dark:to-[#0B1120] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(197,212,240,0.3)_1px,transparent_0)] bg-[length:28px_28px] opacity-45 pointer-events-none dark:bg-[radial-gradient(circle_at_1px_1px,rgba(100,116,139,0.2)_1px,transparent_0)]" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 bg-white dark:bg-[#111827] text-purple-600 dark:text-purple-400 text-xs font-bold px-3.5 py-1.5 rounded-full border border-purple-200 dark:border-purple-800 mb-7 shadow-sm animate-pulse">
          <span className="w-1.5 h-1.5 rounded-full bg-purple-600 dark:bg-purple-400 animate-pulse" />
          Now with AI-powered automation
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-center text-slate-900 dark:text-white leading-tight mb-6 max-w-4xl">
          {t("landing.hero.title")}
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 text-center mb-8 max-w-2xl leading-relaxed">
          {t("landing.hero.subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 shadow-purple-500/25"
          >
            {t("landing.hero.cta")} — no credit card
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-1.5 bg-transparent hover:bg-slate-100 dark:hover:bg-[#111827] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-gray-600 font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:shadow-sm hover:-translate-y-0.5"
          >
            Sign in to workspace
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 text-center mb-12">
          Trusted by 50,000+ teams at startups, agencies, and Fortune 500s
        </p>

        <div className="w-full max-w-5xl">
          <KanbanDemo />
        </div>
      </div>
    </section>
  );
}