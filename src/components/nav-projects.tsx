"use client";

import Link from "next/link";
import { useGetProjectsQuery } from "@/lib/features/tasks/taskApi";

export function NavProjects() {
  const { data: pageData, isLoading } = useGetProjectsQuery({});
  const projects = pageData?.content ?? [];

  return (
    <div className="px-3 mt-2">
      <p className="px-3 text-[10px] font-bold text-slate-400 dark:text-slate-500 mb-2 uppercase tracking-wider flex items-center gap-1.5">
        <span>+</span> Add Projects
      </p>
      <nav className="space-y-0.5">
        {isLoading && (
          <div className="space-y-1 px-3 py-1">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-7 bg-slate-100 dark:bg-slate-800 rounded-md animate-pulse" />
            ))}
          </div>
        )}
        {projects.slice(0, 6).map(({ id, name, color }) => (
          <Link
            key={id}
            href="/dashboard/projects"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
          >
            <span
              className="w-4 h-4 rounded flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700"
              style={{ backgroundColor: color + "18" }}
            >
              <span className="w-2 h-2 rounded-sm" style={{ backgroundColor: color }} />
            </span>
            <span className="truncate flex-1">{name}</span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-slate-300 dark:text-slate-600 shrink-0">
              <path d="M4.5 3L7.5 6L4.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
        ))}
        {!isLoading && projects.length === 0 && (
          <p className="px-3 py-2 text-xs text-slate-400 dark:text-slate-500">No projects yet</p>
        )}
        <Link
          href="/dashboard/projects"
          className="flex items-center px-3 py-2 rounded-lg text-sm text-slate-400 dark:text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-violet-600 dark:hover:text-violet-400 transition-colors font-medium"
        >
          All Projects →
        </Link>
      </nav>
    </div>
  );
}