"use client";

import Link from "next/link";
import { useTranslation } from "@/lib/i18n/useTranslation";
import KanbanDemo from "./KanbanDemo";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";

export default function Hero() {
  const { t } = useTranslation();

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.0, 0.0, 0.2, 1] as [number, number, number, number],
      },
    },
  };

  return (
    <motion.section
      className="relative pt-20 sm:pt-28 lg:pt-32 pb-0 overflow-hidden min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-[#0B1120] dark:via-[#111827] dark:to-[#0B1120]"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-[#0B1120] dark:via-[#111827] dark:to-[#0B1120] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(197,212,240,0.3)_1px,transparent_0)] bg-[length:28px_28px] opacity-45 pointer-events-none dark:bg-[radial-gradient(circle_at_1px_1px,rgba(100,116,139,0.2)_1px,transparent_0)]" />
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {/* Badge */}
        <motion.div
          className="inline-flex items-center gap-2 bg-white dark:bg-[#111827] text-blue-600 dark:text-gray-200 text-xs font-bold px-3.5 py-1.5 rounded-full border border-purple-200 dark:border-blue-800 mb-5 sm:mb-7 shadow-sm"
          variants={itemVariants}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-green-400 animate-pulse" />
          {t("landing.hero.badge")}
        </motion.div>

        {/* Title */}
        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-center text-slate-900 dark:text-white leading-tight mb-4 sm:mb-6 max-w-xs sm:max-w-2xl md:max-w-3xl lg:max-w-4xl"
          variants={itemVariants}
        >
          <span className="text-blue-600">Doify</span> {t("landing.hero.title")}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 text-center mb-6 sm:mb-8 max-w-sm sm:max-w-xl md:max-w-2xl leading-relaxed px-2 sm:px-0"
          variants={itemVariants}
        >
          {t("landing.hero.subtitle")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col sm:flex-row w-fit gap-3 sm:gap-4 mb-6 sm:mb-8 p-3"
          variants={itemVariants}
        >
          <Link
            href="/register"
            className="inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:-translate-y-0.5 text-sm sm:text-base"
          >
            {t("landing.hero.cta")}
          </Link>

          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-1.5 bg-transparent hover:bg-slate-100 dark:hover:bg-[#111827] text-gray-800 dark:text-gray-200 border border-slate-300 dark:border-gray-600 font-semibold px-6 py-3 rounded-lg transition-all duration-200 hover:-translate-y-0.5 text-sm sm:text-base"
          >
            {t("nav.signInToDashboard")}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                d="M3 7h8M8 4l3 3-3 3"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
        </motion.div>

        {/* Trust line */}
        <motion.p
          className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 text-center mb-8 sm:mb-12 px-4 sm:px-0"
          variants={itemVariants}
        >
          {t("landing.hero.trust")}
        </motion.p>

        {/* Kanban Demo */}
        <motion.div
          className="w-full max-w-sm sm:max-w-2xl md:max-w-4xl lg:max-w-5xl overflow-hidden"
          variants={itemVariants}
        >
          <KanbanDemo />
        </motion.div>
      </div>
    </motion.section>
  );
}