"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { logout } from "@/lib/features/auth/authSlice";
import { useGetUnreadCountQuery } from "@/lib/features/notifications/notificationsApi";
import { LogOut, Settings, User, Bell } from "lucide-react";

export function NavUser() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const user = useAppSelector((s) => s.auth.user);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const { data: unread } = useGetUnreadCountQuery(undefined, { skip: !mounted });
  const unreadCount = mounted ? (unread?.count ?? 0) : 0;

  const displayName  = mounted ? (user?.name  ?? "User") : "User";
  const displayEmail = mounted ? (user?.email ?? "")     : "";
  const avatar       = mounted ? user?.avatar : null;
  const initials = displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);

  const handleLogout = () => { dispatch(logout()); router.push("/login"); };

  return (
    <div className="border-t border-slate-200 dark:border-slate-800 px-3 py-2 relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 w-full rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
      >
        <div className="w-8 h-8 rounded-full bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center shrink-0 text-violet-600 dark:text-violet-400 text-xs font-bold overflow-hidden">
          {avatar
            ? <img src={avatar} alt={displayName} className="w-8 h-8 rounded-full object-cover" />
            : initials
          }
        </div>
        <div className="flex-1 text-left min-w-0">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-200 truncate leading-none">{displayName}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 truncate mt-0.5">{displayEmail}</p>
        </div>
        {unreadCount > 0 && (
          <span className="w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-2 right-2 bottom-full mb-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-xl z-20 py-1 overflow-hidden">
            <div className="px-3 py-2.5 border-b border-slate-100 dark:border-slate-700">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-200">{displayName}</p>
              <p className="text-xs text-slate-400 dark:text-slate-500">{displayEmail}</p>
            </div>

            {[
              { href: "/dashboard/settings", icon: User, label: "Profile" },
              { href: "/dashboard/settings", icon: Settings, label: "Settings" },
            ].map(({ href, icon: Icon, label }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
              >
                <Icon size={14} /> {label}
              </Link>
            ))}

            <Link
              href="/dashboard/notifications"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between w-full px-3 py-2.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-slate-200 transition-colors"
            >
              <span className="flex items-center gap-2.5"><Bell size={14} /> Notifications</span>
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {unreadCount}
                </span>
              )}
            </Link>

            <div className="border-t border-slate-100 dark:border-slate-700 mt-1" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 w-full px-3 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
            >
              <LogOut size={14} /> Sign out
            </button>
          </div>
        </>
      )}
    </div>
  );
}