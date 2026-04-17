"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle, ListTodo,
  ChevronRight, MoreHorizontal, Calendar, Users, FolderKanban,
} from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import { useGetPersonalTasksQuery } from "@/lib/features/tasks/taskApi";
import DashboardHeader from "@/components/DashboardHeader";
import { StatCard } from "@/components/Card";
import { TextCard } from "@/components/TextCard";
import { NewTaskModal } from "@/components/forms/NewTaskModal";

import { useGetDashboardQuery } from "@/lib/features/dashboard/dashboardApi";

import {
  TaskStatusDonut,
  CompletionGauge,
  ProjectTasksDonut,
  ProjectStackedBar,
  UpcomingPriorityBar,
  DueDateTimeline,
  ActivityVolumeChart,
} from "@/components/charts";


function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-100 dark:bg-[#2a2d45] rounded-lg ${className}`} />;
}

const PRIORITY_LABEL: Record<string, string> = {
  LOW:    "bg-slate-50  text-slate-600 border border-slate-200 dark:bg-[#252840] dark:text-slate-300 dark:border-[#2a2d45]",
  MEDIUM: "bg-orange-50 text-orange-600 border border-orange-200 dark:bg-orange-900/40 dark:text-orange-300",
  HIGH:   "bg-red-50    text-red-600   border border-red-200 dark:bg-red-900/40 dark:text-red-300",
  URGENT: "bg-red-100   text-red-800   border border-red-300 dark:bg-red-900/60 dark:text-red-200",
};

export default function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const today = mounted
    ? new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    : "";


  const { data: dashboard, isLoading: dashLoading, error: dashError } = useGetDashboardQuery(undefined, {
  pollingInterval: 30_000,
  refetchOnFocus: true,
  refetchOnReconnect: true,
});

  const { data: myTasksPage, isLoading: tasksLoading } =
    useGetPersonalTasksQuery({ status: "IN_PROGRESS" });
  const myTasks = myTasksPage?.content ?? [];

  const statCards = [
    {
      label: "Total Tasks",
      value: dashboard?.totalTasks ?? 0,
      change: "", changeLabel: "", trend: "up" as const,
      icon: <ListTodo size={18} className="text-[#6C5CE7]" />, iconBg: "bg-[#F0EDFF]",
    },
    {
      label: "Team",
      value: dashboard?.totalTeamMembers ?? 0,
      change: "", changeLabel: "", trend: "up" as const,
      icon: <Users size={18} className="text-[#6366F1]" />, iconBg: "bg-[#EEF2FF]",
    },
    {
      label: "Projects",
      value: dashboard?.totalProjects ?? 0,
      change: "", changeLabel: "", trend: "up" as const,
      icon: <FolderKanban size={18} className="text-[#0EA5E9]" />, iconBg: "bg-[#E0F2FE]",
    },
    {
      label: "Overdue",
      value: dashboard?.overdueTasks ?? 0,
      change: "", changeLabel: "", trend: "down" as const,
      icon: <AlertTriangle size={18} className="text-[#EF4444]" />, iconBg: "bg-[#FEE2E2]",
    },
  ];

  const projects = dashboard?.projectProgressSummary ?? [];

  return (
    <>
      <DashboardHeader onCreate={() => setShowModal(true)} createLabel="Create" />

      {showModal && <NewTaskModal onClose={() => setShowModal(false)} />}

      <main className="flex-1 overflow-auto px-4 py-6 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#1E1B2E]">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* Greeting */}
          <div className="bg-white dark:bg-[#1a1c2e] rounded-xl border border-[#E8E8EF] dark:border-[#2a2d45] px-4 sm:px-6 py-4 sm:py-5 shadow-sm mb-3" >
            <h1 className="text-[22px] font-bold text-slate-950 dark:text-white leading-tight">
              Good morning, {mounted ? (user?.name?.split(" ")[0] ?? "there") : "there"} 👋
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{today}</p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
            {dashLoading
              ? Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-[140px]" />)
              : dashError
              ? <div className="col-span-full bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-xl p-4">
                  <p className="text-red-600 text-sm">Failed to load dashboard. Please refresh.</p>
                </div>
              : statCards.map((s) => <StatCard key={s.label} {...s} />)
            }
          </div>

          {/* ── ROW 1: Donut + Gauge ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3 [&>*]:min-w-0 [&>*]:overflow-hidden">
            {dashLoading ? (
              <>
                <Skeleton className="h-56" />
                <Skeleton className="h-56" />
              </>
            ) : dashboard ? (
              <>
                <TaskStatusDonut
                  completedTasks={dashboard.completedTasks}
                  pendingTasks={dashboard.pendingTasks}
                  overdueTasks={dashboard.overdueTasks}
                  totalTasks={dashboard.totalTasks}
                />
                <CompletionGauge
                  completedTasks={dashboard.completedTasks}
                  totalTasks={dashboard.totalTasks}
                />
              </>
            ) : null}
          </div>

          {/* ── ROW 2: Project donuts + stacked bars ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3 [&>*]:min-w-0 [&>*]:overflow-hidden">
            {dashLoading ? (
              <>
                <Skeleton className="h-64" />
                <Skeleton className="h-64" />
              </>
            ) : dashboard ? (
              <>
                <ProjectTasksDonut projects={projects} />
                <ProjectStackedBar projects={projects} />
              </>
            ) : null}
          </div>

          {/* ── ROW 3: Due date timeline + Priority bar ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3 min-w-0">
            {dashLoading ? (
              <>
                <Skeleton className="h-72" />
                <Skeleton className="h-72" />
              </>
            ) : dashboard ? (
              <>
                <div className="min-w-0 overflow-hidden">
                  <DueDateTimeline tasks={dashboard.upcomingDueDates} />
                </div>
                <div className="min-w-0 overflow-hidden">
                  <UpcomingPriorityBar tasks={dashboard.upcomingDueDates} />
                </div>
              </>
            ) : null}
          </div>

          {/* ── ROW 4: Activity volume (full width) ── */}
          {dashLoading ? (
            <Skeleton className="h-56" />
          ) : dashboard ? (
            <ActivityVolumeChart activities={dashboard.recentActivities} />
          ) : null}

          {/* ── Original: Projects + My Tasks ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-3">
            <TextCard
              title="Projects"
              action={
                <Link href="/dashboard/projects" className="flex items-center gap-1 text-sm text-[#6C5CE7] font-semibold hover:underline">
                  View all <ChevronRight size={14} />
                </Link>
              }
            >
              {dashLoading ? (
                <div className="space-y-4 mb-3">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
              ) : projects.length === 0 ? (
                <p className="text-sm text-slate-500 py-4 text-center">No projects yet.</p>
              ) : (
                <div className="space-y-4 mb-3">
                  {projects.slice(0, 4).map(({ projectId, projectName, progressPercent }) => (
                    <div key={projectId} className="space-y-2 border border-[#E8E8EF] dark:border-[#2a2d45] rounded-xl p-4 bg-white dark:bg-[#1a1c2e]">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-slate-950 dark:text-white">{projectName}</span>
                        <span className="text-sm font-semibold text-slate-500">{progressPercent}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#E8E8EF] dark:bg-[#2a2d45] overflow-hidden">
                        <div className="h-full rounded-full bg-[#6C5CE7]" style={{ width: `${progressPercent}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TextCard>

            <TextCard
              title="My Tasks"
              action={
                <Link href="/dashboard/tasks" className="flex items-center gap-1 text-sm text-[#6C5CE7] font-semibold hover:underline">
                  View all <ChevronRight size={14} />
                </Link>
              }
            >
              {tasksLoading ? (
                <div className="space-y-3">{Array(2).fill(0).map((_, i) => <Skeleton key={i} className="h-24" />)}</div>
              ) : myTasks.length === 0 ? (
                <p className="text-sm text-slate-500 py-4 text-center">No tasks in progress.</p>
              ) : (
                <div className="space-y-3 mb-3">
                  {myTasks.slice(0, 2).map((task) => (
                    <div key={task.id} className="border border-[#E8E8EF] dark:border-[#2a2d45] rounded-xl p-4 space-y-3 hover:border-[#D1D5DB] transition-colors bg-slate-50 dark:bg-[#1a1c2e]">
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-sm font-semibold text-slate-950 dark:text-white">{task.title}</h4>
                        <button className="text-slate-500"><MoreHorizontal size={15} /></button>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${PRIORITY_LABEL[task.priority] ?? ""}`}>
                          {task.priority.toLowerCase()}
                        </span>
                        {task.dueDate && (
                          <span className="flex items-center gap-1 text-xs text-slate-500 ml-auto">
                            <Calendar size={11} /> {task.dueDate}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </TextCard>
          </div>
        </div>
      </main>
    </>
  );
}