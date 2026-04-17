"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { logout } from "@/lib/features/auth/authSlice";
import {
  useGetUnreadCountQuery,
  useGetNotificationsQuery,
  useMarkReadMutation,
  useMarkAllReadMutation,
} from "@/lib/features/notifications/notificationsApi";
import { useTheme } from "@/lib/contexts/ThemeContext";
import type { Notification } from "@/lib/features/types/task-type";
import {
  MoreHorizontal,
  X,
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  Bell,
  Settings,
  LogOut,
  Plus,
  RefreshCw,
  Sun,
  Moon,
  CheckCheck,
  ChevronRight,
  AlertCircle,
  MessageSquare,
  UserPlus,
  Calendar,
  Folder,
} from "lucide-react";

const NAV = [
  { label: "Dashboard",     href: "/dashboard",               icon: LayoutDashboard },
  { label: "Projects",      href: "/dashboard/projects",      icon: FolderKanban },
  { label: "My Tasks",      href: "/dashboard/tasks",         icon: CheckSquare },
  { label: "Team",          href: "/dashboard/team",          icon: Users },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell, badge: true },
  { label: "Settings",      href: "/dashboard/settings",      icon: Settings },
];

// ─── helpers ────────────────────────────────────────────────────────────────

/** Read the auth token from the browser cookie (same token the RTK Query layer uses). */
/**
 * Build a navigation URL for a notification.
 * We pass the raw referenceId to the team page and let it resolve
 * client-side via RTK Query (which always has correct auth + caching).
 */
function notifHref(notif: Notification): string {
  if (notif.type === "TEAM_INVITATION") return "/dashboard/team";
  if (!notif.referenceId) return "/dashboard/notifications";

  if (["INVITATION_ACCEPTED", "TEAM_MEMBER_JOINED"].includes(notif.type)) {
    return `/dashboard/team?teamId=${encodeURIComponent(notif.referenceId)}&notifType=${notif.type}`;
  }

  const q = new URLSearchParams({
    notifRef:    notif.referenceId,
    notifType:   notif.type,
  });
  if (notif.referenceType) q.set("notifRefType", notif.referenceType);
  return `/dashboard/team?${q}`;
}

function timeAgo(iso: string) {
  const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
  return `${Math.round(mins / 1440)}d ago`;
}

const NOTIF_ICON: Record<string, React.ReactNode> = {
  TASK_ASSIGNED:        <CheckSquare size={13} className="text-blue-500" />,
  TASK_CREATED:         <CheckSquare size={13} className="text-blue-400" />,
  DUE_DATE_REMINDER:    <Calendar    size={13} className="text-orange-500" />,
  OVERDUE_TASK:         <AlertCircle size={13} className="text-red-500" />,
  MENTIONED_IN_COMMENT: <MessageSquare size={13} className="text-yellow-500" />,
  INVITATION_ACCEPTED:  <UserPlus    size={13} className="text-green-500" />,
  COMMENT_ADDED:        <MessageSquare size={13} className="text-purple-500" />,
  PROJECT_UPDATED:      <Folder      size={13} className="text-cyan-500" />,
  PROJECT_CREATED:      <Folder      size={13} className="text-cyan-400" />,
  TEAM_INVITATION:      <Users       size={13} className="text-indigo-500" />,
  TEAM_MEMBER_JOINED:   <Users       size={13} className="text-green-400" />,
};

const NOTIF_DOT: Record<string, string> = {
  TASK_ASSIGNED:        "bg-blue-500",
  TASK_CREATED:         "bg-blue-400",
  DUE_DATE_REMINDER:    "bg-orange-500",
  OVERDUE_TASK:         "bg-red-500",
  MENTIONED_IN_COMMENT: "bg-yellow-500",
  INVITATION_ACCEPTED:  "bg-green-500",
  COMMENT_ADDED:        "bg-purple-500",
  PROJECT_UPDATED:      "bg-cyan-500",
  PROJECT_CREATED:      "bg-cyan-400",
  TEAM_INVITATION:      "bg-indigo-500",
  TEAM_MEMBER_JOINED:   "bg-green-400",
};

// ─── Notification dropdown ───────────────────────────────────────────────────

function NotificationDropdown({
  onClose,
}: {
  onClose: () => void;
}) {
  const router = useRouter();
  const { data: pageData, isLoading } = useGetNotificationsQuery({ page: 0, size: 8 });
  const [markRead] = useMarkReadMutation();
  const [markAllRead] = useMarkAllReadMutation();

  const notifications: Notification[] = pageData?.content ?? [];
  const unread = notifications.filter((n) => !n.isRead);

  const handleClick = async (notif: Notification) => {
    onClose();
    if (!notif.isRead) {
      try { await markRead(notif.id); } catch { /* ignore */ }
    }
    router.push(notifHref(notif));
  };

  return (
    <div className="absolute right-0 top-full mt-2 w-[360px] max-w-[calc(100vw-24px)] bg-white dark:bg-[#1a1c2e] rounded-2xl shadow-2xl shadow-black/15 dark:shadow-black/50 border border-[#E8E8EF] dark:border-[#2a2d45] z-50 overflow-hidden flex flex-col">

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[#F1F5F9] dark:border-[#2a2d45]">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-[#1E293B] dark:text-white">Notifications</span>
          {unread.length > 0 && (
            <span className="bg-[#EF4444] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              {unread.length}
            </span>
          )}
        </div>
        {unread.length > 0 && (
          <button
            onClick={async () => { await markAllRead(); }}
            className="flex items-center gap-1 text-xs font-semibold text-[#6C5CE7] hover:text-[#5B4BD5] transition-colors"
          >
            <CheckCheck size={12} />
            Mark all read
          </button>
        )}
      </div>

      {/* List */}
      <div className="overflow-y-auto max-h-[400px]">
        {isLoading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse flex gap-3 px-4 py-3 border-b border-[#F1F5F9] dark:border-[#2a2d45]">
              <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700 mt-1.5 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
              </div>
            </div>
          ))
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center px-4">
            <Bell size={24} className="text-slate-300 dark:text-slate-600 mb-2" />
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">No notifications yet</p>
          </div>
        ) : (
          notifications.map((notif) => (
            <button
              key={notif.id}
              onClick={() => handleClick(notif)}
              className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-[#F1F5F9] dark:border-[#2a2d45] hover:bg-slate-50 dark:hover:bg-[#252840] transition-colors last:border-b-0 ${
                !notif.isRead ? "bg-[#F8F7FF] dark:bg-[#6C5CE7]/5" : ""
              }`}
            >
              {/* Colored dot */}
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.isRead ? "bg-slate-300 dark:bg-slate-600" : (NOTIF_DOT[notif.type] ?? "bg-slate-400")}`} />

              <div className="flex-1 min-w-0">
                {/* Type label + icon */}
                <div className="flex items-center gap-1.5 mb-0.5">
                  {NOTIF_ICON[notif.type]}
                  <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
                    {notif.type.replace(/_/g, " ")}
                  </span>
                </div>
                {/* Message */}
                <p className={`text-xs leading-5 truncate ${
                  notif.isRead
                    ? "text-slate-500 dark:text-slate-400"
                    : "text-slate-900 dark:text-white font-semibold"
                }`}>
                  {notif.message}
                </p>
                {/* Time */}
                <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block">
                  {timeAgo(notif.createdAt)}
                </span>
              </div>

              <ChevronRight size={13} className="text-slate-300 dark:text-slate-600 mt-1.5 shrink-0" />
            </button>
          ))
        )}
      </div>

      {/* Footer */}
      <div className="px-4 py-2.5 border-t border-[#F1F5F9] dark:border-[#2a2d45]">
        <Link
          href="/dashboard/notifications"
          onClick={onClose}
          className="flex items-center justify-center gap-1.5 w-full py-2 rounded-xl text-xs font-semibold text-[#6C5CE7] hover:bg-[#F0EDFF] dark:hover:bg-[#6C5CE7]/10 transition-colors"
        >
          View all notifications
          <ChevronRight size={12} />
        </Link>
      </div>
    </div>
  );
}

// ─── Props ───────────────────────────────────────────────────────────────────

interface Props {
  createLabel?: string;
  onCreate?: () => void;
  showCreate?: boolean;
  onRefresh?: () => void;
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function DashboardHeader({
  createLabel = "Create",
  onCreate,
  showCreate = true,
  onRefresh,
}: Props) {
  const dispatch  = useAppDispatch();
  const router    = useRouter();
  const pathname  = usePathname();
  const user      = useAppSelector((s) => s.auth.user);
  const { theme, toggleTheme } = useTheme();
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [bellOpen,  setBellOpen]  = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  // Poll every 10 s so the badge stays fresh and other users' actions appear quickly
  const { data: unread } = useGetUnreadCountQuery(undefined, { pollingInterval: 10_000 });
  const { data: recentPage } = useGetNotificationsQuery({ page: 0, size: 20 }, { pollingInterval: 10_000 });
  const countFromList = (recentPage?.content ?? []).filter((n) => !n.isRead).length;
  const unreadCount = Math.max(unread?.count ?? 0, countFromList);

  const initials = user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?";

  const handleLogout = () => {
    setMenuOpen(false);
    dispatch(logout());
    router.push("/login");
  };

  // Close bell dropdown when clicking outside
  useEffect(() => {
    if (!bellOpen) return;
    const handler = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setBellOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [bellOpen]);

  return (
    <header className="h-14 sm:h-16 bg-white dark:bg-[#1a1c2e] border-b border-[#E8E8EF] dark:border-[#2a2d45] flex items-center justify-between px-3 sm:px-5 gap-2 shrink-0 sticky top-0 z-30">

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 shrink-0 group">
        <div className="w-8 h-8 rounded-lg bg-[#6C5CE7] flex items-center justify-center shadow-md shadow-[#6C5CE7]/30 group-hover:shadow-[#6C5CE7]/50 transition-shadow">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="4" height="12" rx="1" fill="white"/>
            <rect x="7" y="1" width="6" height="8" rx="1" fill="white" opacity=".8"/>
          </svg>
        </div>
        <span className="font-bold text-[15px] text-[#1E293B] dark:text-white tracking-tight hidden sm:block">
          Doify
        </span>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-1">

        {/* Refresh */}
        {onRefresh && (
          <button
            onClick={onRefresh}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-[#64748B] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#252840] transition-colors"
            aria-label="Refresh"
          >
            <RefreshCw size={15} />
          </button>
        )}

        {/* Create button */}
        {showCreate && onCreate && (
          <button
            onClick={onCreate}
            className="flex items-center gap-1.5 h-9 px-3 sm:px-4 rounded-lg bg-[#6C5CE7] hover:bg-[#5B4BD5] active:bg-[#4a3cc7] text-white text-sm font-bold transition-colors shadow-sm shadow-[#6C5CE7]/30"
          >
            <Plus size={15} strokeWidth={2.5} />
            <span className="hidden sm:inline">{createLabel}</span>
          </button>
        )}

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-[#64748B] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#252840] transition-colors"
          aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        >
          {theme === "dark" ? (
            <Sun size={17} className="text-amber-400" />
          ) : (
            <Moon size={17} className="text-[#6C5CE7]" />
          )}
        </button>

        {/* ── Bell with dropdown ── */}
        <div ref={bellRef} className="relative">
          <button
            onClick={() => { setBellOpen((o) => !o); setMenuOpen(false); }}
            className={`relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              bellOpen
                ? "bg-[#6C5CE7] text-white"
                : "text-[#64748B] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#252840]"
            }`}
            aria-label="Notifications"
            aria-expanded={bellOpen}
          >
            <Bell size={17} />
          </button>

          {/* Badge — outside button so absolute positioning works reliably */}
          {unreadCount > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-6px",
                right: "-6px",
                minWidth: "20px",
                height: "20px",
                padding: "0 5px",
                borderRadius: "9999px",
                backgroundColor: "#ef4444",
                color: "#fff",
                fontSize: "11px",
                fontWeight: "800",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                lineHeight: "1",
                border: "2.5px solid white",
                zIndex: 30,
                userSelect: "none",
                pointerEvents: "none",
                boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
              }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}

          {bellOpen && (
            <NotificationDropdown onClose={() => setBellOpen(false)} />
          )}
        </div>

        {/* More menu */}
        <div className="relative">
          <button
            onClick={() => { setMenuOpen((o) => !o); setBellOpen(false); }}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
              menuOpen
                ? "bg-[#6C5CE7] text-white"
                : "text-[#64748B] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#252840]"
            }`}
            aria-label="More options"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={17} /> : <MoreHorizontal size={18} />}
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />

              <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-[#1a1c2e] rounded-2xl shadow-2xl shadow-black/15 dark:shadow-black/40 border border-[#E8E8EF] dark:border-[#2a2d45] z-50 overflow-hidden">

                {/* User row */}
                {user && (
                  <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#F1F5F9] dark:border-[#2a2d45]">
                    <div className="w-9 h-9 rounded-full bg-[#6C5CE7]/10 dark:bg-[#6C5CE7]/20 flex items-center justify-center text-[#6C5CE7] text-sm font-bold shrink-0">
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#1E293B] dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-[#94A3B8] dark:text-slate-500 truncate">{user.email}</p>
                    </div>
                    <button
                      onClick={toggleTheme}
                      className="ml-auto w-8 h-8 rounded-lg flex items-center justify-center bg-slate-100 dark:bg-[#252840] hover:bg-slate-200 dark:hover:bg-[#2a2d45] transition-colors shrink-0"
                      aria-label="Toggle theme"
                    >
                      {theme === "dark"
                        ? <Sun size={14} className="text-amber-400" />
                        : <Moon size={14} className="text-[#6C5CE7]" />}
                    </button>
                  </div>
                )}

                {/* Nav links */}
                <nav className="p-2">
                  {NAV.map(({ label, href, icon: Icon, badge }) => {
                    const isActive = pathname === href || (href !== "/dashboard" && pathname?.startsWith(href));
                    const count = badge ? unreadCount : 0;
                    return (
                      <Link
                        key={href}
                        href={href}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors group ${
                          isActive
                            ? "bg-[#F0EDFF] dark:bg-[#6C5CE7]/15 text-[#6C5CE7]"
                            : "text-[#64748B] dark:text-slate-300 hover:bg-[#F0EDFF] hover:text-[#6C5CE7] dark:hover:bg-[#6C5CE7]/10 dark:hover:text-[#6C5CE7]"
                        }`}
                      >
                        <Icon
                          size={17}
                          className={`shrink-0 transition-colors ${
                            isActive ? "text-[#6C5CE7]" : "text-[#94A3B8] group-hover:text-[#6C5CE7]"
                          }`}
                        />
                        <span className="flex-1">{label}</span>
                        {count > 0 && (
                          <span className="bg-[#EF4444] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                            {count > 99 ? "99+" : count}
                          </span>
                        )}
                        {isActive && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#6C5CE7] shrink-0" />
                        )}
                      </Link>
                    );
                  })}
                </nav>

                {/* Sign out */}
                <div className="px-2 pb-2 pt-1 border-t border-[#F1F5F9] dark:border-[#2a2d45]">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-[#EF4444] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  >
                    <LogOut size={16} className="shrink-0" />
                    Sign out
                  </button>
                </div>

              </div>
            </>
          )}
        </div>

      </div>
    </header>
  );
}