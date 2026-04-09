"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ListTodo,
  ChevronRight,
  MoreHorizontal,
  Calendar,
  Users,
  FolderKanban,
} from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import {
  useGetDashboardStatsQuery,
  useGetPersonalTasksQuery,
  useGetRecentActivityQuery,
  useGetProjectsQuery,
} from "@/lib/features/tasks/taskApi";
import { useGetTeamsQuery } from "@/lib/features/team/teamApi";
import { useGetUnreadCountQuery } from "@/lib/features/notifications/notificationsApi";
import { StatCard } from "@/components/Card";
import { TextCard } from "@/components/TextCard";
import { NewTaskModal } from "@/components/forms/NewTaskModal";

const chartData = [
  { day: "Mon", completed: 24, created: 27 },
  { day: "Tue", completed: 32, created: 30 },
  { day: "Wed", completed: 28, created: 35 },
  { day: "Thu", completed: 40, created: 38 },
  { day: "Fri", completed: 36, created: 42 },
  { day: "Sat", completed: 45, created: 30 },
  { day: "Sun", completed: 38, created: 32 },
];

function TaskActivityChart() {
  const W = 680,
    H = 220,
    PAD = { top: 20, right: 10, bottom: 40, left: 40 };
  const maxVal = 60;
  const xStep = (W - PAD.left - PAD.right) / (chartData.length - 1);
  const yScale = (v: number) =>
    H - PAD.bottom - (v / maxVal) * (H - PAD.top - PAD.bottom);
  const toPath = (key: "completed" | "created") =>
    chartData
      .map(
        (d, i) =>
          `${i === 0 ? "M" : "L"} ${PAD.left + i * xStep} ${yScale(d[key])}`,
      )
      .join(" ");
  const toArea = (key: "completed" | "created") => {
    const pts = chartData
      .map((d, i) => `${PAD.left + i * xStep} ${yScale(d[key])}`)
      .join(" L ");
    const lastX = PAD.left + (chartData.length - 1) * xStep;
    return `M ${PAD.left} ${H - PAD.bottom} L ${pts} L ${lastX} ${H - PAD.bottom} Z`;
  };
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-auto">
      <defs>
        <linearGradient id="gC" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6C5CE7" stopOpacity=".15" />
          <stop offset="100%" stopColor="#6C5CE7" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="gR" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#00a3bf" stopOpacity=".12" />
          <stop offset="100%" stopColor="#00a3bf" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 15, 30, 45, 60].map((t) => (
        <g key={t}>
          <line
            x1={PAD.left}
            y1={yScale(t)}
            x2={W - PAD.right}
            y2={yScale(t)}
            stroke="#F1F5F9"
            strokeWidth="1"
          />
          <text
            x={PAD.left - 6}
            y={yScale(t) + 4}
            fontSize="11"
            fill="#94A3B8"
            textAnchor="end"
          >
            {t}
          </text>
        </g>
      ))}
      {chartData.map((d, i) => (
        <text
          key={d.day}
          x={PAD.left + i * xStep}
          y={H - PAD.bottom + 16}
          fontSize="11"
          fill="#94A3B8"
          textAnchor="middle"
        >
          {d.day}
        </text>
      ))}
      <path d={toArea("completed")} fill="url(#gC)" />
      <path d={toArea("created")} fill="url(#gR)" />
      <path
        d={toPath("completed")}
        fill="none"
        stroke="#6C5CE7"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {chartData.map((d, i) => (
        <circle
          key={`c${i}`}
          cx={PAD.left + i * xStep}
          cy={yScale(d.completed)}
          r="4"
          fill="#fff"
          stroke="#6C5CE7"
          strokeWidth="2"
        />
      ))}
      <path
        d={toPath("created")}
        fill="none"
        stroke="#00a3bf"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {chartData.map((d, i) => (
        <circle
          key={`r${i}`}
          cx={PAD.left + i * xStep}
          cy={yScale(d.created)}
          r="4"
          fill="#fff"
          stroke="#00a3bf"
          strokeWidth="2"
        />
      ))}
      <g transform={`translate(${W / 2 - 80}, ${H - 6})`}>
        <circle cx="6" cy="0" r="5" fill="#6C5CE7" />
        <text x="14" y="4" fontSize="11" fill="#6C5CE7" fontWeight="600">
          Completed
        </text>
        <circle cx="92" cy="0" r="5" fill="#00a3bf" />
        <text x="100" y="4" fontSize="11" fill="#00a3bf" fontWeight="600">
          Created
        </text>
      </g>
    </svg>
  );
}

function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-slate-100 dark:bg-slate-700 rounded-lg ${className}`} />
  );
}

const PRIORITY_LABEL: Record<string, string> = {
  LOW:    "bg-slate-50  text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  MEDIUM: "bg-orange-50 text-orange-600 border border-orange-200 dark:bg-orange-900/40 dark:text-orange-300",
  HIGH:   "bg-red-50    text-red-600   border border-red-200 dark:bg-red-900/40 dark:text-red-300",
  URGENT: "bg-red-100   text-red-800   border border-red-300 dark:bg-red-900/60 dark:text-red-200",
};

export default function DashboardPage() {
  const user = useAppSelector((s) => s.auth.user);
  const [showModal, setShowModal] = useState(false);
  const [mounted, setMounted] = useState(false);
  const today = mounted
    ? new Date().toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : "";
  const { data: stats, isLoading: statsLoading, error: statsError } = useGetDashboardStatsQuery();
  const { data: activity, isLoading: activityLoading } =
    useGetRecentActivityQuery();
  const { data: projectsPage, isLoading: projectsLoading } =
    useGetProjectsQuery({});
  const projects = projectsPage?.content ?? [];
  const { data: teamsPage, isLoading: teamsLoading } = useGetTeamsQuery({});
  const teamsCount = teamsPage?.totalElements ?? 0;
  const projectsCount = projectsPage?.totalElements ?? 0;
  const { data: myTasksPage, isLoading: tasksLoading } =
    useGetPersonalTasksQuery({ status: "IN_PROGRESS" });
  const myTasks = myTasksPage?.content ?? [];
  const { data: unread } = useGetUnreadCountQuery();

  const unreadCount = unread?.count ?? 0;
  useEffect(() => {
    setMounted(true);
  }, []);

const statCards = [
    {
      label: "Total Tasks",
      value: stats?.totalTasks ?? 0,
      change: stats?.totalTasksChange ?? "0",
      changeLabel: "from last week",
      trend: "up" as const,
      icon: <ListTodo size={18} className="text-[#6C5CE7]" />,
      iconBg: "bg-[#F0EDFF]",
    },
    {
      label: "Team",
      value: teamsCount,
      change: "",
      changeLabel: "",
      trend: "up" as const,
      icon: <Users size={18} className="text-[#6366F1]" />,
      iconBg: "bg-[#EEF2FF]",
    },
    {
      label: "Projects",
      value: projectsCount,
      change: "",
      changeLabel: "",
      trend: "up" as const,
      icon: <FolderKanban size={18} className="text-[#0EA5E9]" />,
      iconBg: "bg-[#E0F2FE]",
    },
    {
      label: "Overdue",
      value: stats?.overdue ?? 0,
      change: stats?.overdueChange ?? "0",
      changeLabel: "",
      trend: "down" as const,
      icon: <AlertTriangle size={18} className="text-[#EF4444]" />,
      iconBg: "bg-[#FEE2E2]",
    },
  ];

  return (
    <>
      <header className="h-16 bg-white dark:bg-slate-900 border-b border-[#E8E8EF] dark:border-slate-700 flex items-center justify-end px-4 sm:px-6 lg:px-8 gap-3 shrink-0">
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 h-9 px-4 rounded-lg bg-[#6C5CE7] text-white text-sm font-semibold hover:bg-[#5B4BD5] transition-colors"
        >
          <Plus size={15} /> New Task
        </button>
        <Link
          href="/dashboard/notifications"
          className="relative w-9 h-9 rounded-lg border border-[#E8E8EF] dark:border-slate-700 flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Bell size={16} className="text-[#64748B] dark:text-slate-400" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#EF4444] text-white text-[10px] font-semibold flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>
      </header>

      <main className="flex-1 overflow-auto px-4 py-6 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Greeting */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#E8E8EF] dark:border-slate-700 px-6 py-5 shadow-sm">
            <div>
              <h1 className="text-[22px] font-bold text-slate-950 dark:text-white leading-tight">
                Good morning,{" "}
                {mounted ? (user?.name?.split(" ")[0] ?? "there") : "there"} 👋
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{today}</p>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statsLoading ? (
              Array(4)
                .fill(0)
                .map((_, i) => <Skeleton key={i} className="h-[140px]" />)
            ) : statsError ? (
              <div className="col-span-full bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  Failed to load dashboard stats. Please try refreshing the page.
                </p>
                <details className="mt-2">
                  <summary className="text-xs text-red-500 cursor-pointer">Error details</summary>
                  <pre className="text-xs text-red-400 mt-1 overflow-auto">
                    {JSON.stringify(statsError, null, 2)}
                  </pre>
                </details>
              </div>
            ) : (
              statCards.map((s) => <StatCard key={s.label} {...s} />)
            )}
          </div>

          <TextCard
            title="Task Activity"
            description="Tasks created vs completed this week"
          >
            <TaskActivityChart />
          </TextCard>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Projects */}
            <TextCard
              title="Projects"
              action={
                <Link
                  href="/dashboard/projects"
                  className="flex items-center gap-1 text-sm text-[#6C5CE7] dark:text-sky-300 font-semibold hover:underline"
                >
                  View all <ChevronRight size={14} />
                </Link>
              }
            >
              {projectsLoading ? (
                <div className="space-y-4">
                  {Array(4)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-10" />
                    ))}
                </div>
              ) : (projects ?? []).length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 py-4 text-center">
                  No projects yet.
                </p>
              ) : (
                <div className="space-y-4">
                  {(projects ?? [])
                    .slice(0, 4)
                    .map(({ id, name, color, progress }) => (
                      <div
                        key={id}
                        className="space-y-2 border border-[#E8E8EF] dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-900"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-2">
                            <span
                              className="w-2.5 h-2.5 rounded-sm shrink-0"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-sm font-medium text-slate-950 dark:text-white">
                              {name}
                            </span>
                          </div>
                          <span className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                            {progress}%
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-[#E8E8EF] dark:bg-slate-700 overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${progress}%`,
                              backgroundColor: color,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </TextCard>

            {/* My Tasks */}
            <TextCard
              title="My Tasks"
              action={
                <Link
                  href="/dashboard/tasks"
                  className="flex items-center gap-1 text-sm text-[#6C5CE7] dark:text-sky-300 font-semibold hover:underline"
                >
                  View all <ChevronRight size={14} />
                </Link>
              }
            >
              {tasksLoading ? (
                <div className="space-y-3">
                  {Array(2)
                    .fill(0)
                    .map((_, i) => (
                      <Skeleton key={i} className="h-24" />
                    ))}
                </div>
              ) : (myTasks ?? []).length === 0 ? (
                <p className="text-sm text-slate-500 dark:text-slate-400 py-4 text-center">
                  No tasks in progress.
                </p>
              ) : (
                <div className="space-y-3">
                  {(myTasks ?? []).slice(0, 2).map((task) => (
                    <div
                      key={task.id}
                      className="border border-[#E8E8EF] dark:border-slate-700 rounded-xl p-4 space-y-3 hover:border-[#D1D5DB] dark:hover:border-slate-600 transition-colors bg-slate-50 dark:bg-slate-900"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <h4 className="text-sm font-semibold text-slate-950 dark:text-white">
                          {task.title}
                        </h4>
                        <button className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200">
                          <MoreHorizontal size={15} />
                        </button>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize ${PRIORITY_LABEL[task.priority] ?? ""}`}
                        >
                          {task.priority.toLowerCase()}
                        </span>
                        {task.dueDate && (
                          <span className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400 ml-auto">
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