"use client";

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

export function ProjectStackedBar({ projects }: Props) {
  const maxTasks = Math.max(...projects.map((p) => p.totalTasks), 1);

  if (!projects.length) {
    return (
      <div className="bg-white dark:bg-[#1a1c2e] rounded-xl border border-[#E8E8EF] dark:border-[#2a2d45] p-5 shadow-sm flex items-center justify-center h-40">
        <p className="text-sm text-slate-400">No projects yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-[#1a1c2e] rounded-xl border border-[#E8E8EF] dark:border-[#2a2d45] p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-semibold text-slate-950 dark:text-white">Completed vs remaining</p>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#6C5CE7] inline-block" />
            Completed
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-slate-500">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#E8E8EF] dark:bg-[#2a2d45] inline-block" />
            Remaining
          </span>
        </div>
      </div>

      <div className="space-y-3">
        {projects.map((p) => {
          const remaining = p.totalTasks - p.completedTasks;
          const completedW = maxTasks ? (p.completedTasks / maxTasks) * 100 : 0;
          const remainingW = maxTasks ? (remaining / maxTasks) * 100 : 0;

          return (
            <div key={p.projectId} className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-slate-700 dark:text-slate-300 truncate max-w-[60%]">
                  {p.projectName}
                </span>
                <span className="text-[11px] text-slate-400 tabular-nums">
                  {p.completedTasks}/{p.totalTasks}
                </span>
              </div>

              {/* stacked bar */}
              <div className="flex h-5 rounded overflow-hidden gap-px bg-transparent">
                {p.completedTasks > 0 && (
                  <div
                    className="h-full rounded-l transition-all duration-500"
                    style={{ width: `${completedW}%`, background: "#6C5CE7" }}
                  />
                )}
                {remaining > 0 && (
                  <div
                    className="h-full transition-all duration-500 bg-[#E8E8EF] dark:bg-[#2a2d45]"
                    style={{ width: `${remainingW}%` }}
                  />
                )}
              </div>

              <p className="text-[11px] text-slate-400">{p.progressPercent}% done</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}