"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell, Plus, CheckCircle2, Clock, AlertTriangle, ListTodo,
  ChevronRight, MoreHorizontal, Calendar, Users, FolderKanban,
  Search, Settings, LayoutDashboard, CheckSquare, X, LogOut,
} from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { logout } from "@/lib/features/auth/authSlice";
import { useRouter } from "next/navigation";
import { useGetUnreadCountQuery } from "@/lib/features/notifications/notificationsApi";
import { useGetPersonalTasksQuery } from "@/lib/features/tasks/taskApi";
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

// ─────────────────────────────────────────────────────────────────────────────

function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-slate-100 dark:bg-slate-700 rounded-lg ${className}`} />;
}

const PRIORITY_LABEL: Record<string, string> = {
  LOW:    "bg-slate-50  text-slate-600 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
  MEDIUM: "bg-orange-50 text-orange-600 border border-orange-200 dark:bg-orange-900/40 dark:text-orange-300",
  HIGH:   "bg-red-50    text-red-600   border border-red-200 dark:bg-red-900/40 dark:text-red-300",
  URGENT: "bg-red-100   text-red-800   border border-red-300 dark:bg-red-900/60 dark:text-red-200",
};

export default function DashboardPage() {
  const dispatch = useAppDispatch();
  const router   = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  const [showModal, setShowModal] = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const handleLogout = () => { dispatch(logout()); router.push("/login"); };

  const today = mounted
    ? new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
    : "";

  // ── ONE unified dashboard call ──────────────────────────────────────────────
  const { data: dashboard, isLoading: dashLoading, error: dashError } = useGetDashboardQuery();

  // My tasks (in-progress) — kept as separate call because it paginates
  const { data: myTasksPage, isLoading: tasksLoading } =
    useGetPersonalTasksQuery({ status: "IN_PROGRESS" });
  const myTasks = myTasksPage?.content ?? [];

  const { data: unread } = useGetUnreadCountQuery();
  const unreadCount = unread?.count ?? 0;

  // ── Derived values ──────────────────────────────────────────────────────────
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
      {/* ── Header (unchanged from your original) ── */}
      <header className="h-14 sm:h-16 bg-white dark:bg-slate-900 border-b border-[#E8E8EF] dark:border-slate-700 flex items-center justify-between px-3 sm:px-5 gap-2 shrink-0 sticky top-0 z-30">
        <Link href="/" className="flex items-center gap-2 shrink-0 group">
          <div className="w-8 h-8 rounded-lg bg-[#6C5CE7] flex items-center justify-center shadow-md shadow-[#6C5CE7]/30">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <rect x="1" y="1" width="4" height="12" rx="1" fill="white"/>
              <rect x="7" y="1" width="6" height="8" rx="1" fill="white" opacity=".8"/>
            </svg>
          </div>
          <span className="font-bold text-[15px] text-[#1E293B] dark:text-white tracking-tight hidden xs:block">Doify</span>
        </Link>

        <div className="flex items-center gap-1.5">
          <button className="w-9 h-9 sm:w-auto sm:h-9 sm:px-3 flex items-center gap-2 rounded-lg text-[#64748B] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Search size={16} />
            <span className="hidden sm:inline text-sm font-medium">Search</span>
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 h-9 px-3 sm:px-4 rounded-lg bg-[#6C5CE7] hover:bg-[#5B4BD5] text-white text-sm font-bold shadow-sm shadow-[#6C5CE7]/30"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span className="hidden xs:inline">Create</span>
          </button>
          <Link href="/dashboard/notifications" className="relative w-9 h-9 rounded-lg flex items-center justify-center text-[#64748B] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
            <Bell size={17} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[9px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className={`w-9 h-9 rounded-lg flex items-center justify-center ${menuOpen ? "bg-[#6C5CE7] text-white" : "text-[#64748B] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"}`}
            >
              {menuOpen ? <X size={17} /> : <MoreHorizontal size={18} />}
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl shadow-black/15 border border-[#E8E8EF] dark:border-slate-700 z-50 overflow-hidden">
                  {user && (
                    <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#F1F5F9] dark:border-slate-800">
                      <div className="w-9 h-9 rounded-full bg-[#6C5CE7]/10 flex items-center justify-center text-[#6C5CE7] text-sm font-bold shrink-0">
                        {user.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#1E293B] dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-[#94A3B8] truncate">{user.email}</p>
                      </div>
                    </div>
                  )}
                  <nav className="p-2">
                    {[
                      { label: "Dashboard",    href: "/dashboard",               icon: LayoutDashboard },
                      { label: "Projects",      href: "/dashboard/projects",      icon: FolderKanban },
                      { label: "My Tasks",      href: "/dashboard/tasks",         icon: CheckSquare },
                      { label: "Team",          href: "/dashboard/team",          icon: Users },
                      { label: "Notifications", href: "/dashboard/notifications", icon: Bell, badge: unreadCount },
                      { label: "Settings",      href: "/dashboard/settings",      icon: Settings },
                    ].map(({ label, href, icon: Icon, badge }) => (
                      <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#64748B] dark:text-slate-300 hover:bg-[#F0EDFF] hover:text-[#6C5CE7] dark:hover:bg-[#6C5CE7]/10 transition-colors group">
                        <Icon size={17} className="shrink-0 text-[#94A3B8] group-hover:text-[#6C5CE7]" />
                        <span className="flex-1">{label}</span>
                        {badge ? <span className="bg-[#EF4444] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{badge > 9 ? "9+" : badge}</span> : null}
                      </Link>
                    ))}
                  </nav>
                  <div className="px-2 pb-2 border-t border-[#F1F5F9] dark:border-slate-800 pt-1">
                    <button onClick={handleLogout} className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-950/30">
                      <LogOut size={16} className="shrink-0" />Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {showModal && <NewTaskModal onClose={() => setShowModal(false)} />}

      <main className="flex-1 overflow-auto px-4 py-6 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* Greeting */}
          <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#E8E8EF] dark:border-slate-700 px-4 sm:px-6 py-4 sm:py-5 shadow-sm">
            <h1 className="text-[22px] font-bold text-slate-950 dark:text-white leading-tight">
              Good morning, {mounted ? (user?.name?.split(" ")[0] ?? "there") : "there"} 👋
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{today}</p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dashLoading ? (
              <>
                <Skeleton className="h-72" />
                <Skeleton className="h-72" />
              </>
            ) : dashboard ? (
              <>
                <DueDateTimeline tasks={dashboard.upcomingDueDates} />
                <UpcomingPriorityBar tasks={dashboard.upcomingDueDates} />
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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <TextCard
              title="Projects"
              action={
                <Link href="/dashboard/projects" className="flex items-center gap-1 text-sm text-[#6C5CE7] font-semibold hover:underline">
                  View all <ChevronRight size={14} />
                </Link>
              }
            >
              {dashLoading ? (
                <div className="space-y-4">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-10" />)}</div>
              ) : projects.length === 0 ? (
                <p className="text-sm text-slate-500 py-4 text-center">No projects yet.</p>
              ) : (
                <div className="space-y-4">
                  {projects.slice(0, 4).map(({ projectId, projectName, progressPercent }) => (
                    <div key={projectId} className="space-y-2 border border-[#E8E8EF] dark:border-slate-700 rounded-xl p-4 bg-white dark:bg-slate-900">
                      <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-slate-950 dark:text-white">{projectName}</span>
                        <span className="text-sm font-semibold text-slate-500">{progressPercent}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-[#E8E8EF] dark:bg-slate-700 overflow-hidden">
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
                <div className="space-y-3">
                  {myTasks.slice(0, 2).map((task) => (
                    <div key={task.id} className="border border-[#E8E8EF] dark:border-slate-700 rounded-xl p-4 space-y-3 hover:border-[#D1D5DB] transition-colors bg-slate-50 dark:bg-slate-900">
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