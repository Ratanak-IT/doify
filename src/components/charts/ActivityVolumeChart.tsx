"use client";

import { useMemo } from "react";

interface ActivityItem {
  activityType: string;
  description: string;
  timestamp: string;
}

interface Props {
  activities: ActivityItem[];
}

const TYPE_COLOR: Record<string, string> = {
  TASK_COMPLETED:  "#22c55e",
  TASK_CREATED:    "#6C5CE7",
  TASK_UPDATED:    "#0EA5E9",
  COMMENT_ADDED:   "#f59e0b",
  TASK_ASSIGNED:   "#8b5cf6",
};
const DEFAULT_COLOR = "#94A3B8";

function last7Days() {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push({
      iso: d.toISOString().split("T")[0],
      label: i === 0 ? "Today" : d.toLocaleDateString("en-US", { weekday: "short" }),
    });
  }
  return days;
}

export function ActivityVolumeChart({ activities }: Props) {
  const days = useMemo(() => last7Days(), []);

  const data = useMemo(() => {
    return days.map((day) => {
      const dayActivities = activities.filter((a) => a.timestamp?.startsWith(day.iso));
      const byType: Record<string, number> = {};
      dayActivities.forEach((a) => {
        byType[a.activityType] = (byType[a.activityType] ?? 0) + 1;
      });
      return { ...day, total: dayActivities.length, byType };
    });
  }, [activities, days]);

  const max = Math.max(...data.map((d) => d.total), 1);
  const BAR_H = 90;

  const allTypes = useMemo(() => {
    const types = new Set<string>();
    activities.forEach((a) => types.add(a.activityType));
    return Array.from(types);
  }, [activities]);

  const totalThisWeek = activities.filter((a) => {
    const d = new Date(a.timestamp);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return d >= weekAgo;
  }).length;

  return (
    <div className="bg-white dark:bg-[#1a1c2e] rounded-xl border border-[#E8E8EF] dark:border-[#2a2d45] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm font-semibold text-slate-950 dark:text-white">Team activity</p>
          <p className="text-xs text-slate-400">{totalThisWeek} events this week</p>
        </div>
      </div>

      {/* legend */}
      {allTypes.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {allTypes.slice(0, 5).map((t) => (
            <span key={t} className="flex items-center gap-1 text-[11px] text-slate-500">
              <span className="w-2 h-2 rounded-sm inline-block" style={{ background: TYPE_COLOR[t] ?? DEFAULT_COLOR }} />
              {t.replace(/_/g, " ").toLowerCase()}
            </span>
          ))}
        </div>
      )}

      {/* bars */}
      <div className="flex items-end justify-between gap-1.5" style={{ height: BAR_H + 40 }}>
        {data.map((day) => {
          const totalH = max ? Math.max((day.total / max) * BAR_H, day.total > 0 ? 6 : 0) : 0;

          // Stack segments by type
          let offset = 0;
          const segments = Object.entries(day.byType).map(([type, count]) => {
            const h = (count / day.total) * totalH;
            const seg = { type, count, h, offset };
            offset += h;
            return seg;
          });

          return (
            <div key={day.iso} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 h-5 flex items-end">
                {day.total > 0 ? day.total : ""}
              </span>

              <div className="w-full flex flex-col-reverse justify-start overflow-hidden rounded" style={{ height: BAR_H }}>
                {day.total > 0 ? (
                  segments.map((seg, i) => (
                    <div
                      key={seg.type}
                      className="w-full transition-all duration-500"
                      style={{
                        height: seg.h,
                        background: TYPE_COLOR[seg.type] ?? DEFAULT_COLOR,
                        borderRadius: i === segments.length - 1 ? "4px 4px 0 0" : 0,
                      }}
                    />
                  ))
                ) : (
                  <div className="w-full h-1 rounded bg-slate-100 dark:bg-[#252840] mt-auto" />
                )}
              </div>

              <span className={`text-[11px] font-medium ${day.label === "Today" ? "text-[#6C5CE7]" : "text-slate-400"}`}>
                {day.label}
              </span>
            </div>
          );
        })}
      </div>

      {activities.length === 0 && (
        <p className="text-xs text-center text-slate-400 mt-2">No recent activity</p>
      )}

      {/* recent feed */}
      <div className="mt-4 pt-4 border-t border-[#E8E8EF] dark:border-[#2a2d45] space-y-2">
        <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wide mb-2">Recent</p>
        {activities.slice(0, 3).map((a, i) => (
          <div key={i} className="flex items-start gap-2">
            <span
              className="w-1.5 h-1.5 rounded-full shrink-0 mt-1.5"
              style={{ background: TYPE_COLOR[a.activityType] ?? DEFAULT_COLOR }}
            />
            <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-1">{a.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}