"use client";

import DashboardHeader from "@/components/DashboardHeader";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, CheckCheck, RefreshCw, ChevronLeft, ChevronRight, UserPlus } from "lucide-react";
import {
  useGetNotificationsQuery,
  useMarkAllReadMutation,
  useMarkReadMutation,
} from "@/lib/features/notifications/notificationsApi";
import { useAcceptInvitationMutation } from "@/lib/features/team/teamApi";
import type { Notification } from "@/lib/features/types/task-type";

const TYPE_STYLE: Record<string, { bg: string; dot: string }> = {
  TASK_ASSIGNED:       { bg: "bg-blue-50 dark:bg-blue-950",   dot: "bg-blue-500" },
  TASK_CREATED:        { bg: "bg-blue-50 dark:bg-blue-950",   dot: "bg-blue-400" },
  DUE_DATE_REMINDER:   { bg: "bg-orange-50 dark:bg-orange-950", dot: "bg-orange-500" },
  OVERDUE_TASK:        { bg: "bg-red-50 dark:bg-red-950",    dot: "bg-red-500" },
  MENTIONED_IN_COMMENT:{ bg: "bg-yellow-50 dark:bg-yellow-950", dot: "bg-yellow-500" },
  INVITATION_ACCEPTED: { bg: "bg-green-50 dark:bg-green-950",  dot: "bg-green-500" },
  COMMENT_ADDED:       { bg: "bg-purple-50 dark:bg-purple-950", dot: "bg-purple-500" },
  PROJECT_UPDATED:     { bg: "bg-cyan-50 dark:bg-cyan-950",   dot: "bg-cyan-500" },
  PROJECT_CREATED:     { bg: "bg-cyan-50 dark:bg-cyan-950",   dot: "bg-cyan-400" },
  TEAM_INVITATION:     { bg: "bg-indigo-50 dark:bg-indigo-950", dot: "bg-indigo-500" },
  TEAM_MEMBER_JOINED:  { bg: "bg-green-50 dark:bg-green-950",  dot: "bg-green-400" },
};

function notifHref(notif: Notification): string {
  if (notif.type === "TEAM_INVITATION") return "/dashboard/team";
  if (!notif.referenceId) return "/dashboard/notifications";

  if (["INVITATION_ACCEPTED", "TEAM_MEMBER_JOINED"].includes(notif.type)) {
    return `/dashboard/team?teamId=${encodeURIComponent(notif.referenceId)}&notifType=${notif.type}`;
  }

  const q = new URLSearchParams({
    notifRef:  notif.referenceId,
    notifType: notif.type,
  });
  if (notif.referenceType) q.set("notifRefType", notif.referenceType);
  return `/dashboard/team?${q}`;
}

function Skeleton() {
  return (
    <div className="animate-pulse flex gap-3 p-4">
      <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-700 mt-1.5 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
      </div>
    </div>
  );
}

function NotifCard({
  notif,
  onClick,
  onAcceptInvite,
}: {
  notif: Notification;
  onClick: () => void;
  onAcceptInvite: (invitationId: string, notifId: string) => void;
}) {
  const style = TYPE_STYLE[notif.type] ?? { bg: "bg-slate-50 dark:bg-[#1a1c2e]", dot: "bg-slate-400" };
  const [accepting, setAccepting] = useState(false);

  const timeAgo = (iso: string) => {
    const mins = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    if (mins < 1440) return `${Math.round(mins / 60)}h ago`;
    return `${Math.round(mins / 1440)}d ago`;
  };

  const isInvite = notif.type === "TEAM_INVITATION";

  return (
    <div
      className={`mb-1 group rounded-3xl border p-5 transition-all ${
        notif.isRead 
          ? "border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1c2e] shadow-sm" 
          : "border-transparent bg-slate-50 dark:bg-[#1a1c2e] shadow-md"
      } hover:-translate-y-0.5 hover:shadow-lg cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className={`w-3 h-3 rounded-full mt-1.5 ${notif.isRead ? "bg-slate-300 dark:bg-slate-600" : style.dot}`} />
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
              {notif.type.replace(/_/g, " ")}
            </span>
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${style.bg} ${style.dot === "bg-slate-400" ? "text-slate-700 dark:text-slate-300" : "text-slate-800 dark:text-slate-200"}`}>
              {notif.referenceType ? notif.referenceType : notif.type.toLowerCase()}
            </span>
          </div>
          <p className={`text-sm leading-6 ${notif.isRead ? "text-slate-500 dark:text-slate-400" : "text-slate-950 dark:text-white font-semibold"}`}>
            {notif.message}
          </p>
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 dark:text-slate-500">
            <span>{timeAgo(notif.createdAt)}</span>
            {notif.referenceId && <span className="px-2 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">ID: {notif.referenceId}</span>}
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
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#615fff] px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-[#4f46e5] disabled:opacity-60 transition-colors"
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
  const [markRead] = useMarkReadMutation();
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

      <main className="flex-1 overflow-auto p-4 sm:p-6 bg-[#F8F9FC] dark:bg-[#1E1B2E]">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="rounded-[32px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1c2e] p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Filtered view</p>
                <h2 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{filter === "all" ? "All notifications" : "Unread notifications"}</h2>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={() => markAllRead()}
                    className="flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition-colors"
                  >
                    <CheckCheck size={14} />
                    Mark all read
                  </button>
                )}
                {(["all", "unread"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                      filter === f
                        ? "bg-slate-950 text-white shadow-sm dark:bg-slate-200 dark:text-slate-950"
                        : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                    }`}
                  >
                    {f === "all" ? "All" : "Unread"}
                    {f === "unread" && unreadCount > 0 && (
                      <span className="ml-2 inline-flex h-6 items-center justify-center rounded-full bg-[#615fff] px-2 text-[11px] font-semibold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isError && (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400 flex items-center justify-between mt-3">
              Failed to load notifications.
              <button onClick={() => refetch()} className="font-semibold underline">Retry</button>
            </div>
          )}

          <div className="space-y-2 mt-3">
            {isLoading
              ? Array(5).fill(0).map((_, i) => <Skeleton key={i} />)
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
                      key={n.id}
                      notif={n}
                      onClick={() => handleCardClick(n)}
                      onAcceptInvite={handleAcceptInvite}
                    />
                  ))
            }
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-sm text-slate-500 dark:text-slate-400">Page {page + 1} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="w-8 h-8 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 transition-colors"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          )}
        </div>
      </main>
    </>
  );
}