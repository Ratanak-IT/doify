"use client";

import { useMemo } from "react";

type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

interface UpcomingTask {
  id: string;
  title: string;
  dueDate: string;
  priority: Priority;
  projectName: string;
}

interface Props {
  tasks: UpcomingTask[];
}

const PRIORITY_CONFIG: Record<Priority, { label: string; color: string; bg: string; text: string }> = {
  URGENT: { label: "Urgent", color: "#ef4444", bg: "bg-red-50 dark:bg-red-900/30",   text: "text-red-600 dark:text-red-400" },
  HIGH:   { label: "High",   color: "#f97316", bg: "bg-orange-50 dark:bg-orange-900/30", text: "text-orange-600 dark:text-orange-400" },
  MEDIUM: { label: "Medium", color: "#f59e0b", bg: "bg-amber-50 dark:bg-amber-900/30",  text: "text-amber-600 dark:text-amber-400" },
  LOW:    { label: "Low",    color: "#6C5CE7", bg: "bg-purple-50 dark:bg-purple-900/30", text: "text-purple-600 dark:text-purple-400" },
};

const ORDER: Priority[] = ["URGENT", "HIGH", "MEDIUM", "LOW"];

export function UpcomingPriorityBar({ tasks }: Props) {
  const counts = useMemo(() => {
    const c: Record<Priority, number> = { URGENT: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
    tasks.forEach((t) => { if (t.priority in c) c[t.priority]++; });
    return c;
  }, [tasks]);

  const max = Math.max(...Object.values(counts), 1);

  if (!tasks.length) {
    return (
      <div className="bg-white dark:bg-[#1a1c2e] rounded-xl border border-[#E8E8EF] dark:border-[#2a2d45] p-5 shadow-sm flex items-center justify-center h-40 min-w-0 overflow-hidden">
        <p className="text-sm text-slate-400">No upcoming tasks</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1a1c2e] rounded-xl border border-[#E8E8EF] dark:border-[#2a2d45] p-4 sm:p-5 shadow-sm min-w-0 overflow-hidden">
      <p className="text-sm font-semibold text-slate-950 dark:text-white mb-4">
        Upcoming tasks by priority
        <span className="ml-2 text-xs text-slate-400 font-normal">{tasks.length} total</span>
      </p>

      <div className="space-y-3">
        {ORDER.map((priority) => {
          const cfg = PRIORITY_CONFIG[priority];
          const count = counts[priority];
          const widthPct = (count / max) * 100;

          return (
            <div key={priority} className="flex items-center gap-2 sm:gap-3 min-w-0">
              {/* Label — fixed width so all rows align */}
              <span className={`text-[11px] font-semibold w-12 sm:w-14 shrink-0 text-right ${cfg.text}`}>
                {cfg.label}
              </span>

              {/* Bar track — min-w-0 prevents flex overflow */}
              <div className="flex-1 min-w-0 h-6 rounded-md bg-slate-100 dark:bg-[#252840] overflow-hidden">
                <div
                  className="h-full rounded-md transition-all duration-500"
                  style={{
                    width: `${widthPct}%`,
                    minWidth: count > 0 ? "1.5rem" : "0",
                    background: cfg.color,
                  }}
                />
              </div>

              {/* Count — always outside bar, fixed width for consistent alignment */}
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 w-4 shrink-0 text-right tabular-nums">
                {count}
              </span>
            </div>
          );
        })}
      </div>

      {/* mini task list */}
      <div className="mt-4 pt-4 border-t border-[#E8E8EF] dark:border-[#2a2d45] space-y-2">
        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-2">Upcoming</p>
        {tasks.slice(0, 4).map((t) => {
          const cfg = PRIORITY_CONFIG[t.priority];
          return (
            <div key={t.id} className="flex items-center gap-2 min-w-0">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: cfg.color }} />
              <span className="text-xs text-slate-700 dark:text-slate-300 truncate flex-1 min-w-0">{t.title}</span>
              <span className="text-[11px] text-slate-400 tabular-nums shrink-0">{t.dueDate}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}