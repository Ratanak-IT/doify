import Link from "next/link";

export default function DashboardFooter() {
  return (
    <footer className="bg-white dark:bg-[#1a1c2e] border-t border-slate-200 dark:border-[#2a2d45] text-slate-500 dark:text-slate-400 pt-10 sm:pt-14 pb-6 sm:pb-8 px-4 sm:px-8 transition-colors">
      <div className="max-w-5xl mx-auto mb-10">
        {/* Top row: Brand + Columns */}
        <div className="flex flex-col sm:flex-row sm:justify-between gap-10">
          {/* Brand */}
          <div className="shrink-0">
            <div className="flex items-center gap-2.5 mb-3.5">
              <img
                src="/logo-doify.png"
                alt="Doify Logo"
                className="h-8 w-8 object-contain"
              />
              <span className="font-bold text-base text-slate-900 dark:text-white">
                Doify
              </span>
            </div>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400 max-w-[220px]">
              Simplifying teamwork and productivity for everyone, everywhere.
            </p>
          </div>

          {/* Page + Setting side by side */}
          <div className="grid grid-cols-2 gap-10 sm:gap-16">
            {/* Page */}
            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white uppercase tracking-widest mb-4">
                Page
              </h4>
              <ul className="flex flex-col gap-2.5">
                <li>
                  <Link
                    href="/about"
                    className="text-base text-slate-500 dark:text-slate-400 hover:text-violet-600 transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-base text-slate-500 dark:text-slate-400 hover:text-violet-600 transition-colors"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard"
                    className="text-base text-slate-500 dark:text-slate-400 hover:text-violet-600 transition-colors"
                  >
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            {/* Setting */}
            <div>
              <h4 className="text-lg font-semibold text-slate-900 dark:text-white uppercase tracking-widest mb-4">
                Setting
              </h4>
              <ul className="flex flex-col gap-2.5">
                <li>
                  <Link
                    href="/dashboard/settings"
                    className="text-base text-slate-500 dark:text-slate-400 hover:text-violet-600 transition-colors"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    href="/dashboard/notifications"
                    className="text-base text-slate-500 dark:text-slate-400 hover:text-violet-600 transition-colors"
                  >
                    Notification
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-slate-200 dark:border-[#2a2d45] max-w-5xl mx-auto mb-6" />

      <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-2">
        <span className="text-sm text-slate-400 dark:text-slate-600">
          © 2026 Doify. All rights reserved.
        </span>
        <span className="text-sm text-slate-400 dark:text-slate-600">
          Made by student from ISTAD
        </span>
      </div>
    </footer>
  );
}