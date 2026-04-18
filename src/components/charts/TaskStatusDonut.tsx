"use client";

import { useMemo } from "react";

interface Props {
  completedTasks: number;
  pendingTasks: number;
  overdueTasks: number;
  totalTasks: number;
}

interface Segment {
  label: string;
  value: number;
  color: string;
  pct: number;
}

function polarToCartesian(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arcPath(cx: number, cy: number, r: number, startDeg: number, endDeg: number) {
  const s = polarToCartesian(cx, cy, r, startDeg);
  const e = polarToCartesian(cx, cy, r, endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 1 ${e.x} ${e.y}`;
}

export function TaskStatusDonut({ completedTasks, pendingTasks, overdueTasks, totalTasks }: Props) {
  const inProgress = Math.max(0, totalTasks - completedTasks - pendingTasks - overdueTasks);

  const segments: Segment[] = useMemo(() => {
    const total = totalTasks || 1;
    const raw: Omit<Segment, "pct">[] = [
      { label: "Completed",  value: completedTasks, color: "#22c55e" },
      { label: "In progress", value: inProgress,    color: "#6C5CE7" },
      { label: "Pending",    value: pendingTasks,   color: "#f59e0b" },
      { label: "Overdue",    value: overdueTasks,   color: "#ef4444" },
    ];
    return raw.map((s) => ({ ...s, pct: (s.value / total) * 100 })).filter((s) => s.value > 0);
  }, [completedTasks, pendingTasks, overdueTasks, inProgress, totalTasks]);

  const completionPct = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const CX = 80, CY = 80, R = 60, STROKE = 18;
  let cursor = -90;

  return (
    <div className="bg-white dark:bg-[#1a1c2e] rounded-xl border border-[#E8E8EF] dark:border-[#2a2d45] p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-950 dark:text-white mb-4">Task status</p>

      <div className="flex items-center gap-6">
        {/* SVG donut */}
        <div className="relative shrink-0">
          <svg width={160} height={160} viewBox="0 0 160 160">
            {/* background ring */}
            <circle cx={CX} cy={CY} r={R} fill="none" stroke="#F1F5F9" strokeWidth={STROKE} className="dark:stroke-slate-800" />

            {segments.map((seg, i) => {
              const sweep = (seg.pct / 100) * 360;
              const end = cursor + sweep;
              const path = arcPath(CX, CY, R, cursor, end - 0.5);
              cursor = end;
              return (
                <path
                  key={i}
                  d={path}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={STROKE}
                  strokeLinecap="round"
                />
              );
            })}

            {/* centre label */}
            <text x={CX} y={CY - 8} textAnchor="middle" className="fill-slate-950 dark:fill-white" fontSize={22} fontWeight={600}>
              {completionPct}%
            </text>
            <text x={CX} y={CY + 10} textAnchor="middle" fill="#94A3B8" fontSize={11}>
              done
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {segments.map((seg) => (
            <div key={seg.label} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: seg.color }} />
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{seg.label}</span>
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                {seg.value}
              </span>
            </div>
          ))}

          <div className="mt-1 pt-2 border-t border-[#E8E8EF] dark:border-[#2a2d45] flex justify-between">
            <span className="text-xs text-slate-400">Total</span>
            <span className="text-xs font-bold text-slate-700 dark:text-slate-200">{totalTasks}</span>
          </div>
        </div>
      </div>
    </div>
  );
}