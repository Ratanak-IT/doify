"use client";

import Link from "next/link";

export function TeamSwitcher() {
  return (
    <div className="relative">
      <Link href="/">
        <button className="cursor-pointer flex items-center gap-2.5 w-full px-4 sm:px-6 py-3 sm:py-3.5 border-b border-[#E8E8EF] dark:border-[#2a2d45] bg-white dark:bg-[#1E1B2E] hover:bg-[#F8F8FC] dark:hover:bg-[#252840] transition-colors rounded-tl-lg">
          <img src="/logo-doify.png" alt="Doify Logo" className="h-8 w-8 object-contain" />
          <h1 className="text-2xl sm:text-3xl font-bold text-[#6C5CE7]">Doify</h1>
        </button>
      </Link>
    </div>
  );
}