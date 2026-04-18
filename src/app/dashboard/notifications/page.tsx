"use client";

import DashboardHeader from "@/components/DashboardHeader";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, ChevronLeft, ChevronRight, UserPlus } from "lucide-react";
import {
  useGetNotificationsQuery,
  useMarkAllReadMutation,
  useMarkReadMutation,
} from "@/lib/features/notifications/notificationsApi";
import { useAcceptInvitationMutation } from "@/lib/features/team/teamApi";
import type { Notification } from "@/lib/features/types/task-type";

const TYPE_DOT: Record<string, string> = {
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

const TYPE_BADGE_LIGHT: Record<string, string> = {
  TASK_ASSIGNED:        "bg-blue-100 text-blue-800",
  TASK_CREATED:         "bg-blue-100 text-blue-800",
  DUE_DATE_REMINDER:    "bg-orange-100 text-orange-800",
  OVERDUE_TASK:         "bg-red-100 text-red-800",
  MENTIONED_IN_COMMENT: "bg-yellow-100 text-yellow-800",
  INVITATION_ACCEPTED:  "bg-green-100 text-green-800",
  COMMENT_ADDED:        "bg-purple-100 text-purple-800",
  PROJECT_UPDATED:      "bg-cyan-100 text-cyan-800",
  PROJECT_CREATED:      "bg-cyan-100 text-cyan-800",
  TEAM_INVITATION:      "bg-indigo-100 text-indigo-800",
  TEAM_MEMBER_JOINED:   "bg-green-100 text-green-800",
};

const TYPE_BADGE_DARK: Record<string, string> = {
  TASK_ASSIGNED:        "bg-blue-900/40 text-blue-300",
  TASK_CREATED:         "bg-blue-900/40 text-blue-300",
  DUE_DATE_REMINDER:    "bg-orange-900/40 text-orange-300",
  OVERDUE_TASK:         "bg-red-900/40 text-red-300",
  MENTIONED_IN_COMMENT: "bg-yellow-900/40 text-yellow-300",
  INVITATION_ACCEPTED:  "bg-green-900/40 text-green-300",
  COMMENT_ADDED:        "bg-purple-900/40 text-purple-300",
  PROJECT_UPDATED:      "bg-cyan-900/40 text-cyan-300",
  PROJECT_CREATED:      "bg-cyan-900/40 text-cyan-300",
  TEAM_INVITATION:      "bg-indigo-900/40 text-indigo-300",
  TEAM_MEMBER_JOINED:   "bg-green-900/40 text-green-300",
};

function notifHref(notif: Notification): string {
  if (notif.type === "TEAM_INVITATION") return "/dashboard/team";
  if (!notif.referenceId) return "/dashboard/notifications";
  if (["INVITATION_ACCEPTED", "TEAM_MEMBER_JOINED"].includes(notif.type))
    return `/dashboard/team?teamId=${encodeURIComponent(notif.referenceId)}&notifType=${notif.type}`;
  const q = new URLSearchParams({ notifRef: notif.referenceId, notifType: notif.type });
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

function NotifCard({ notif, onClick, onAcceptInvite }: {
  notif: Notification;
  onClick: () => void;
  onAcceptInvite: (invitationId: string, notifId: string) => void;
}) {
  const dot        = TYPE_DOT[notif.type]         ?? "bg-slate-400";
  const badgeLight = TYPE_BADGE_LIGHT[notif.type]  ?? "bg-slate-100 text-slate-700";
  const badgeDark  = TYPE_BADGE_DARK[notif.type]   ?? "bg-[#252840] text-slate-300";
  const [accepting, setAccepting] = useState(false);
  const isInvite = notif.type === "TEAM_INVITATION";

  return (
    <div
      onClick={onClick}
      className={`mb-1 group rounded-2xl p-5 transition-all hover:-translate-y-0.5 hover:shadow-md cursor-pointer
        bg-white dark:bg-[#252840]
        ${notif.isRead
          ? "border border-slate-200 dark:border-[#2a2d45]"
          : "border border-violet-300 dark:border-violet-700/60"
        }`}
    >
      <div className="flex items-start gap-3">
        <div className={`w-3 h-3 rounded-full mt-1.5 shrink-0 ${notif.isRead ? "bg-slate-300 dark:bg-slate-600" : dot}`} />
        <div className="flex-1 min-w-0 space-y-2">

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {notif.type.replace(/_/g, " ")}
            </span>
            {/* Light badge */}
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold dark:hidden ${badgeLight}`}>
              {notif.referenceType ? notif.referenceType.toLowerCase() : notif.type.toLowerCase()}
            </span>
            {/* Dark badge */}
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold hidden dark:inline ${badgeDark}`}>
              {notif.referenceType ? notif.referenceType.toLowerCase() : notif.type.toLowerCase()}
            </span>
          </div>

          <p className={`text-sm leading-6 ${notif.isRead
            ? "text-slate-500 dark:text-slate-400"
            : "text-slate-900 dark:text-white font-semibold"}`}>
            {notif.message}
          </p>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <span>{timeAgo(notif.createdAt)}</span>
            {notif.referenceId && (
              <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-[#252840] text-slate-500 dark:text-slate-400 text-[11px]">
                ID: {notif.referenceId}
              </span>
            )}
          </div>

          {isInvite && notif.referenceId && !notif.isRead && (
            <button
              disabled={accepting}
              onClick={async (e) => {
                e.stopPropagation();
                setAccepting(true);
                await onAcceptInvite(notif.referenceId!, notif.id);
                setAccepting(false);
              }}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#6C5CE7] hover:bg-[#5B4BD5] px-4 py-2 text-xs font-semibold text-white disabled:opacity-60 transition-colors"
            >
              <UserPlus size={13} />
              {accepting ? "Accepting…" : "Accept Invitation"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NotificationsPage() {
  const router = useRouter();
  const [page, setPage] = useState(0);
  const { data: pageData, isLoading, isError, refetch } = useGetNotificationsQuery({ page, size: 20 });
  const notifications: Notification[] = pageData?.content ?? [];
  const totalPages = pageData?.totalPages ?? 1;
  const [markAllRead] = useMarkAllReadMutation();
  const [markRead]    = useMarkReadMutation();
  const [acceptInvitation] = useAcceptInvitationMutation();

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const displayed = filter === "unread" ? notifications.filter((n) => !n.isRead) : notifications;

  const handleAcceptInvite = async (invitationId: string, notifId: string) => {
    await acceptInvitation(invitationId);
    await markRead(notifId);
  };

  const handleCardClick = async (notif: Notification) => {
    if (!notif.isRead) {
      try { await markRead(notif.id); } catch { /* swallow */ }
    }
    router.push(notifHref(notif));
  };

  return (
    <>
      <DashboardHeader onRefresh={refetch} showCreate={false} />

      {/* Same bg as dashboard: bg-slate-50 dark:bg-[#1E1B2E] */}
      <main className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50 dark:bg-[#1E1B2E]">
        <div className="max-w-5xl mx-auto space-y-4">

          {/* Header card — matches dashboard card style */}
          <div className="rounded-2xl p-6 bg-white dark:bg-[#252840] border border-slate-200 dark:border-[#2a2d45] shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Filtered view</p>
                <h2 className="mt-1.5 text-xl font-semibold text-slate-900 dark:text-white">
                  {filter === "all" ? "All notifications" : "Unread notifications"}
                </h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {unreadCount > 0 && (
                  <button onClick={() => markAllRead()}
                    className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-colors bg-slate-100 dark:bg-[#252840] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#2a2d45]">
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
                {(["all", "unread"] as const).map((f) => (
                  <button key={f} onClick={() => setFilter(f)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      filter === f
                        ? "bg-slate-900 dark:bg-white text-white dark:text-slate-900"
                        : "bg-slate-100 dark:bg-[#252840] text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#2a2d45]"
                    }`}>
                    {f === "all" ? "All" : "Unread"}
                    {f === "unread" && unreadCount > 0 && (
                      <span className="ml-2 inline-flex h-5 items-center justify-center rounded-full bg-[#6C5CE7] px-2 text-[11px] font-semibold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Error */}
          {isError && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-sm text-red-600 dark:text-red-400 flex items-center justify-between">
              Failed to load notifications.
              <button onClick={() => refetch()} className="font-semibold underline">Retry</button>
            </div>
          )}

          {/* List */}
          <div className="space-y-2">
            {isLoading
              ? Array(5).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse flex gap-3 p-5 rounded-2xl bg-white dark:bg-[#252840] border border-slate-200 dark:border-[#2a2d45]">
                    <div className="w-3 h-3 rounded-full mt-1.5 shrink-0 bg-slate-200 dark:bg-[#2a2d45]" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 dark:bg-[#2a2d45] rounded w-3/4" />
                      <div className="h-3 bg-slate-200 dark:bg-[#2a2d45] rounded w-1/2" />
                    </div>
                  </div>
                ))
              : displayed.length === 0
                ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center">
                    <Bell size={32} className="text-slate-300 dark:text-slate-600 mb-3" />
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                      {filter === "unread" ? "No unread notifications" : "No notifications yet"}
                    </p>
                  </div>
                )
                : displayed.map((n) => (
                    <NotifCard
                      key={n.id} notif={n}
                      onClick={() => handleCardClick(n)}
                      onAcceptInvite={handleAcceptInvite}
                    />
                  ))
            }
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-2">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
                className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-40 transition-colors bg-white dark:bg-[#252840] border border-slate-200 dark:border-[#2a2d45] text-slate-500 dark:text-slate-400 hover:bg-white/20 dark:hover:bg-[#2a2d45]">
                <ChevronLeft size={14} />
              </button>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                Page {page + 1} of {totalPages}
              </span>
              <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
                className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-40 transition-colors bg-white dark:bg-[#252840] border border-slate-200 dark:border-[#2a2d45] text-slate-500 dark:text-slate-400 hover:bg-white/20 dark:hover:bg-[#2a2d45]">
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}