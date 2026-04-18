import { TrendingUp, TrendingDown } from "lucide-react";
import type { ReactNode } from "react";

interface CardProps {
  label: string;
  value: string | number;
  change: string;
  changeLabel: string;
  trend: "up" | "down";
  icon: ReactNode;
  iconBg: string;
}

export function StatCard({ label, value, change, changeLabel, trend, icon, iconBg }: CardProps) {
  const isUp = trend === "up";
  return (
    <div className="bg-white dark:bg-[#1a1c2e] dark:border-[#2a2d45] border border-[#E8E8EF] rounded-xl p-4 sm:p-5 flex flex-col gap-3 flex-1 min-w-0 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">{label}</p>
          <p className="text-2xl sm:text-[32px] font-bold text-slate-950 dark:text-white leading-none mt-2">{value}</p>
        </div>
        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>{icon}</div>
      </div>
      <div className="flex items-center gap-1.5 pt-1 border-t border-[#F1F5F9] dark:border-[#2a2d45]">
        {isUp ? <TrendingUp size={13} className="text-[#10B981]" /> : <TrendingDown size={13} className="text-[#EF4444]" />}
        <span className={`text-xs font-semibold ${isUp ? "text-[#10B981]" : "text-[#EF4444]"}`}>{change}</span>
        <span className="text-xs text-slate-500 dark:text-slate-400">{changeLabel}</span>
      </div>
    </div>
  );
}