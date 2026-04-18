"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  AlertTriangle, ListTodo,
  ChevronRight, MoreHorizontal, Calendar, Users, FolderKanban,
  Plus, FolderPlus, UserPlus, Target,
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

          {/* ── Greeting banner ── */}
          {(() => {
            const completedTasks = dashboard?.completedTasks ?? 0;
            const totalTasks     = dashboard?.totalTasks ?? 0;
            const overdueTasks   = dashboard?.overdueTasks ?? 0;
            const pct            = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
            const radius         = 22;
            const circ           = 2 * Math.PI * radius;
            const offset         = circ - (pct / 100) * circ;
            const greetingHour   = mounted ? new Date().getHours() : 12;
            const greeting       = greetingHour < 12 ? "Good morning" : greetingHour < 18 ? "Good afternoon" : "Good evening";
            const firstName      = mounted ? (user?.name?.split(" ")[0] ?? "there") : "there";

            return (
              <div
                className="bg-white dark:bg-[#1a1c2e] rounded-2xl border border-[#E8E8EF] dark:border-[#2a2d45] px-5 sm:px-7 py-5 sm:py-6 mb-3 shadow-sm"
              >
                {/* Top row: text + ring */}
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-tight">
                      {greeting}, {firstName} 👋
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                      {today}
                      {overdueTasks > 0 && (
                        <span className="ml-2 inline-flex items-center gap-1 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs font-semibold px-2 py-0.5 rounded-full border border-red-200 dark:border-red-800">
                          <AlertTriangle size={10} /> {overdueTasks} overdue
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Progress ring */}
                  {!dashLoading && totalTasks > 0 && (
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="relative flex items-center justify-center">
                        <svg width="56" height="56" style={{ transform: "rotate(-90deg)" }}>
                          <circle cx="28" cy="28" r={radius} fill="none" stroke="#E8E8EF" strokeWidth="4" className="dark:stroke-slate-700" />
                          <circle
                            cx="28" cy="28" r={radius} fill="none"
                            stroke="#6C5CE7" strokeWidth="4"
                            strokeDasharray={circ} strokeDashoffset={offset}
                            strokeLinecap="round"
                            style={{ transition: "stroke-dashoffset 0.6s ease" }}
                          />
                        </svg>
                        <span className="absolute text-sm font-bold text-slate-900 dark:text-white">{pct}%</span>
                      </div>
                      <div className="text-left">
                        <p className="text-slate-900 dark:text-white text-sm font-semibold leading-tight">{completedTasks}/{totalTasks}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">tasks done</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Divider */}
                <div className="border-t border-[#E8E8EF] dark:border-[#2a2d45] my-4" />

                {/* Quick actions */}
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#252840] hover:bg-[#F0EDFF] dark:hover:bg-[#6C5CE7]/15 text-slate-600 dark:text-slate-300 hover:text-[#6C5CE7] text-xs font-semibold border border-[#E8E8EF] dark:border-[#2a2d45] transition-colors"
                  >
                    <Plus size={13} /> New Task
                  </button>
                  <Link
                    href="/dashboard/projects"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#252840] hover:bg-[#F0EDFF] dark:hover:bg-[#6C5CE7]/15 text-slate-600 dark:text-slate-300 hover:text-[#6C5CE7] text-xs font-semibold border border-[#E8E8EF] dark:border-[#2a2d45] transition-colors"
                  >
                    <FolderPlus size={13} /> New Project
                  </Link>
                  <Link
                    href="/dashboard/team"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#252840] hover:bg-[#F0EDFF] dark:hover:bg-[#6C5CE7]/15 text-slate-600 dark:text-slate-300 hover:text-[#6C5CE7] text-xs font-semibold border border-[#E8E8EF] dark:border-[#2a2d45] transition-colors"
                  >
                    <UserPlus size={13} /> Invite Member
                  </Link>
                  <Link
                    href="/dashboard/tasks"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-[#252840] hover:bg-[#F0EDFF] dark:hover:bg-[#6C5CE7]/15 text-slate-600 dark:text-slate-300 hover:text-[#6C5CE7] text-xs font-semibold border border-[#E8E8EF] dark:border-[#2a2d45] transition-colors"
                  >
                    <Target size={13} /> My Tasks
                  </Link>
                </div>
              </div>
            );
          })()}

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
                    <div key={projectId} className="mt-1.5 space-y-2 border border-[#E8E8EF] dark:border-[#2a2d45] rounded-xl p-4 bg-white dark:bg-[#1a1c2e]">
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
                    <div key={task.id} className="mt-1.5 border border-[#E8E8EF] dark:border-[#2a2d45] rounded-xl p-4 space-y-3 hover:border-[#D1D5DB] transition-colors bg-slate-50 dark:bg-[#1a1c2e]">
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