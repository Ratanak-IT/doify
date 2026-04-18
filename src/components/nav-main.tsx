"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, FolderKanban, CheckSquare, Users, Settings, Bell } from "lucide-react";
import { useGetUnreadCountQuery } from "@/lib/features/notifications/notificationsApi";

const navItems = [
  { label: "Dashboard",     href: "/dashboard",               icon: LayoutDashboard },
  { label: "Projects",      href: "/dashboard/projects",      icon: FolderKanban },
  { label: "My Tasks",      href: "/dashboard/tasks",         icon: CheckSquare },
  { label: "Team",          href: "/dashboard/team",          icon: Users },
  { label: "Notifications", href: "/dashboard/notifications", icon: Bell, badge: true },
  { label: "Settings",      href: "/dashboard/settings",      icon: Settings },
];

export function NavMain() {
  const pathname = usePathname();
  const { data: unread } = useGetUnreadCountQuery();
  const unreadCount = unread?.count ?? 0;

  return (
    <div className="px-3">
      <nav className="space-y-1">
        {navItems.map(({ label, href, icon: Icon, badge }) => {
          const isActive = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors group
                ${isActive
                  ? "bg-violet-100 dark:bg-violet-900/20 text-violet-700 dark:text-violet-400 font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
            >
              <Icon
                size={17}
                className={isActive
                  ? "text-violet-600 dark:text-violet-400"
                  : "text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                }
              />
              <span className="flex-1">{label}</span>
              {badge && unreadCount > 0 && (
                <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}