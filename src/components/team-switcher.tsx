"use client";

import Link from "next/link";

export function TeamSwitcher() {
  return (
    <div className="relative">
      <Link href="/">
        <button className="cursor-pointer flex items-center gap-2.5 w-full px-4 sm:px-6 py-3 sm:py-3.5 border-b border-[#E8E8EF] dark:border-[#2a2d45] bg-white dark:bg-[#1E1B2E] hover:bg-[#F8F8FC] dark:hover:bg-[#252840] transition-colors rounded-tl-lg">
          <div className="w-8 h-8 rounded-lg bg-[#6C5CE7] flex items-center justify-center shrink-0 shadow-md shadow-[#6C5CE7]/30">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="4"  height="12" rx="1" fill="white"/>
              <rect x="7" y="1" width="6"  height="8"  rx="1" fill="white" opacity=".8"/>
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#6C5CE7]">Doify</h1>
        </button>
      </Link>
    </div>
  );
}