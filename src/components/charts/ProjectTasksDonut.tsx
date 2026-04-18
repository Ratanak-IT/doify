"use client";

import { useMemo } from "react";

interface ProjectProgress {
  projectId: string;
  projectName: string;
  totalTasks: number;
  completedTasks: number;
  progressPercent: number;
}

interface Props {
  projects: ProjectProgress[];
}

const COLORS = ["#6C5CE7", "#0EA5E9", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#84cc16"];

function polarToXY(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function slicePath(cx: number, cy: number, r: number, ri: number, startDeg: number, endDeg: number) {
  const s  = polarToXY(cx, cy, r,  startDeg);
  const e  = polarToXY(cx, cy, r,  endDeg);
  const si = polarToXY(cx, cy, ri, startDeg);
  const ei = polarToXY(cx, cy, ri, endDeg);
  const lg = endDeg - startDeg > 180 ? 1 : 0;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${lg} 1 ${e.x} ${e.y} L ${ei.x} ${ei.y} A ${ri} ${ri} 0 ${lg} 0 ${si.x} ${si.y} Z`;
}

export function ProjectTasksDonut({ projects }: Props) {
  const total = useMemo(() => projects.reduce((a, p) => a + p.totalTasks, 0), [projects]);

  const slices = useMemo(() => {
    let cursor = 0;
    return projects.map((p, i) => {
      const sweep = total ? (p.totalTasks / total) * 360 : 0;
      const start = cursor;
      cursor += sweep;
      return { ...p, start, end: cursor - 0.5, color: COLORS[i % COLORS.length] };
    });
  }, [projects, total]);

  const CX = 80, CY = 80, R = 68, RI = 46;

  if (!projects.length) {
    return (
      <div className="bg-white dark:bg-[#1a1c2e] rounded-xl border border-[#E8E8EF] dark:border-[#2a2d45] p-5 shadow-sm flex items-center justify-center h-40">
        <p className="text-sm text-slate-400">No projects yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1a1c2e] rounded-xl border border-[#E8E8EF] dark:border-[#2a2d45] p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-950 dark:text-white mb-4">Tasks by project</p>

      <div className="flex items-center gap-5">
        <div className="shrink-0">
          <svg width={160} height={160} viewBox="0 0 160 160">
            {slices.map((s) => (
              <path key={s.projectId} d={slicePath(CX, CY, R, RI, s.start, s.end)} fill={s.color} opacity={0.9} />
            ))}
            <text x={CX} y={CY - 6} textAnchor="middle" fontSize={20} fontWeight={700} className="fill-slate-950 dark:fill-white">{total}</text>
            <text x={CX} y={CY + 11} textAnchor="middle" fontSize={11} fill="#94A3B8">total tasks</text>
          </svg>
        </div>

        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {slices.map((s) => (
            <div key={s.projectId} className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: s.color }} />
                <span className="text-xs text-slate-500 dark:text-slate-400 truncate">{s.projectName}</span>
              </div>
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 tabular-nums">
                {s.totalTasks}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}