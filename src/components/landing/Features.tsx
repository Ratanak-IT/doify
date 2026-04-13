"use client";

import { useTranslation } from "@/lib/i18n/useTranslation";

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="2" width="5.5" height="18" rx="2" fill="currentColor" opacity=".9" />
        <rect x="9.5" y="2" width="10.5" height="12" rx="2" fill="currentColor" opacity=".5" />
      </svg>
    ),
    title: "Kanban Boards",
    desc: "Drag cards across columns and see the whole project at a glance. Backlog to shipped, always in focus.",
    color: "#6C5CE7",
    bg: "#e9f2ff",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="4" width="18" height="3" rx="1.5" fill="currentColor" />
        <rect x="2" y="9.5" width="14" height="3" rx="1.5" fill="currentColor" opacity=".6" />
        <rect x="2" y="15" width="10" height="3" rx="1.5" fill="currentColor" opacity=".35" />
      </svg>
    ),
    title: "Smart Lists",
    desc: "Filter, sort, and group tasks any way you need. Deadline view, priority view, assignee view — all instant.",
    color: "#216e4e",
    bg: "#dcfff1",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="2" y="2" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="2" />
        <path d="M6 11l3 3 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Rich Task Cards",
    desc: "Each card holds checklists, due dates, attachments, comments, and assignees — everything in one place.",
    color: "#5e4db2",
    bg: "#f3f0ff",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 2v4M11 16v4M2 11h4M16 11h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <circle cx="11" cy="11" r="4" fill="currentColor" opacity=".3" />
        <circle cx="11" cy="11" r="2" fill="currentColor" />
      </svg>
    ),
    title: "Automation",
    desc: "Let repetitive work handle itself. Set triggers and actions so your workflow runs on autopilot.",
    color: "#a54800",
    bg: "#fff3eb",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="7" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
        <circle cx="15" cy="15" r="4" stroke="currentColor" strokeWidth="2" />
        <path d="M11 7h6M7 11v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity=".5" />
      </svg>
    ),
    title: "Team Workspaces",
    desc: "Invite teammates, assign tasks, and collaborate in shared workspaces with role-based permissions.",
    color: "#0055cc",
    bg: "#e9f2ff",
  },
  {
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 17l4-4 3 3 4-5 5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <rect x="2" y="2" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="2" opacity=".4" />
      </svg>
    ),
    title: "Reports & Insights",
    desc: "Track velocity, spot blockers, and forecast delivery. Real-time charts that actually make sense.",
    color: "#ae2e24",
    bg: "#ffeceb",
  },
];

export default function Features() {
  const { t } = useTranslation();

  return (
    <section id="features" className="lp-section lp-section--white bg-white text-gray-900 dark:bg-[#0B1120] dark:text-white transition-colors duration-300">
      <div className="lp-container px-4 sm:px-6">
        <div className="lp-section-header">
          <span className="font-bold text-blue-600 text-[18px] dark:text-gray-300">The system</span>
          <h2 className="lp-section-title dark:text-gray-200">{t("landing.features.title")}</h2>
          <p className="lp-section-sub dark:text-gray-200">{t("landing.features.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {FEATURES.map((f, i) => (
            <div key={i} className="p-5 rounded-2xl dark:bg-gray-500">
              <div className="lp-feature-icon" style={{ background: f.bg, color: f.color }}>
                {f.icon}
              </div>
              <h3 className="lp-feature-title dark:text-gray-100">{f.title}</h3>
              <p className="lp-feature-desc dark:text-gray-100">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}