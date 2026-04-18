"use client";

import { useMemo } from "react";

type Priority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";

interface UpcomingTask {
  id: string;
  title: string;
  dueDate: string; // "YYYY-MM-DD"
  priority: Priority;
  projectName: string;
}

interface Props {
  tasks: UpcomingTask[];
}

const PRIORITY_COLOR: Record<Priority, string> = {
  URGENT: "#ef4444",
  HIGH:   "#f97316",
  MEDIUM: "#f59e0b",
  LOW:    "#6C5CE7",
};

function buildWeek(tasks: UpcomingTask[]) {
  const days: { date: string; label: string; short: string; count: number; urgent: number }[] = [];
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const iso = d.toISOString().split("T")[0];
    const label = i === 0 ? "Today" : i === 1 ? "Tmrw" : d.toLocaleDateString("en-US", { weekday: "short" });
    const short = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

    const dayTasks = tasks.filter((t) => t.dueDate === iso);
    days.push({
      date: iso,
      label,
      short,
      count: dayTasks.length,
      urgent: dayTasks.filter((t) => t.priority === "URGENT" || t.priority === "HIGH").length,
    });
  }
  return days;
}

export function DueDateTimeline({ tasks }: Props) {
  const week = useMemo(() => buildWeek(tasks), [tasks]);
  const max = Math.max(...week.map((d) => d.count), 1);
  const BAR_MAX_H = 80;

  return (
    <div className="bg-white dark:bg-[#1a1c2e] rounded-xl border border-[#E8E8EF] dark:border-[#2a2d45] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-slate-950 dark:text-white">
          Due this week
          <span className="ml-2 text-xs font-normal text-slate-400">{tasks.length} tasks</span>
        </p>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#ef4444] inline-block" />High priority</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#6C5CE7] inline-block" />Other</span>
        </div>
      </div>

      {/* bar chart */}
      <div className="flex items-end justify-between gap-1" style={{ height: BAR_MAX_H + 40 }}>
        {week.map((day) => {
          const totalH = max ? Math.max((day.count / max) * BAR_MAX_H, day.count > 0 ? 8 : 0) : 0;
          const urgentH = day.urgent ? (day.urgent / day.count) * totalH : 0;
          const normalH = totalH - urgentH;

          return (
            <div key={day.date} className="flex flex-col items-center gap-1 flex-1">
              {/* count label */}
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 tabular-nums h-5 flex items-end">
                {day.count > 0 ? day.count : ""}
              </span>

              {/* stacked bar */}
              <div className="w-full flex flex-col justify-end rounded overflow-hidden" style={{ height: BAR_MAX_H }}>
                {day.count > 0 ? (
                  <>
                    {urgentH > 0 && (
                      <div className="w-full rounded-t transition-all duration-500" style={{ height: urgentH, background: "#ef4444" }} />
                    )}
                    {normalH > 0 && (
                      <div className="w-full transition-all duration-500" style={{ height: normalH, background: "#6C5CE7", borderRadius: urgentH > 0 ? 0 : "4px 4px 0 0" }} />
                    )}
                  </>
                ) : (
                  <div className="w-full h-1 rounded bg-slate-100 dark:bg-[#252840]" />
                )}
              </div>

              {/* day label */}
              <span className={`text-[11px] font-medium mt-0.5 ${day.label === "Today" ? "text-[#6C5CE7]" : "text-slate-400"}`}>
                {day.label}
              </span>
              <span className="text-[10px] text-slate-300 dark:text-slate-600">{day.short}</span>
            </div>
          );
        })}
      </div>

      {/* no data state */}
      {tasks.length === 0 && (
        <p className="text-sm text-center text-slate-400 mt-4">No upcoming due dates</p>
      )}
    </div>
  );
}