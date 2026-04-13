"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { logout } from "@/lib/features/auth/authSlice";
import { useGetUnreadCountQuery } from "@/lib/features/notifications/notificationsApi";
import { useTheme } from "@/lib/contexts/ThemeContext";
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
} from "lucide-react";

const NAV = [
  { label: "Dashboard",    href: "/dashboard",               icon: LayoutDashboard },
  { label: "Projects",     href: "/dashboard/projects",      icon: FolderKanban },
  { label: "My Tasks",     href: "/dashboard/tasks",         icon: CheckSquare },
  { label: "Team",         href: "/dashboard/team",          icon: Users },
  { label: "Notifications",href: "/dashboard/notifications", icon: Bell, badge: true },
  { label: "Settings",     href: "/dashboard/settings",      icon: Settings },
];

interface Props {
  createLabel?: string;
  onCreate?: () => void;
  showCreate?: boolean;
  onRefresh?: () => void;
}

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
  const [menuOpen, setMenuOpen] = useState(false);

  const { data: unread } = useGetUnreadCountQuery();
  const unreadCount = unread?.count ?? 0;

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

        {/* Notifications bell */}
        <Link
          href="/dashboard/notifications"
          className="relative w-9 h-9 rounded-lg flex items-center justify-center text-[#64748B] dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-[#252840] transition-colors"
          aria-label="Notifications"
        >
          <Bell size={17} />
          {unreadCount > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-[#EF4444] text-white text-[9px] font-bold flex items-center justify-center leading-none">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Link>

        {/* More menu */}
        <div className="relative">
          <button
            onClick={() => setMenuOpen((o) => !o)}
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
                            {count > 9 ? "9+" : count}
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