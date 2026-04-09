"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/contexts/ThemeContext";
import { useTranslation } from "@/lib/i18n/useTranslation";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setLanguage } from "@/lib/features/i18n/i18nSlice";
import { useGetUnreadCountQuery } from "@/lib/features/notifications/notificationsApi";
import { Sun, Moon, Globe, Bell, User, LogOut, Settings } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const router = useRouter();
  const dispatch = useAppDispatch();
  const { theme, toggleTheme } = useTheme();
  const { t, language } = useTranslation();

  const user = useAppSelector((s) => s.auth.user);
  const { data: unread } = useGetUnreadCountQuery(undefined, {
    skip: !mounted || !user,
  });
  const unreadCount = mounted ? (unread?.count ?? 0) : 0;

  const displayName = mounted && user ? (user.name ?? "User") : "User";
  const avatar = mounted && user ? user.avatar : null;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLanguageChange = (newLang: "en" | "kh") => {
    dispatch(setLanguage(newLang));
    setLangOpen(false);
  };

  if (!mounted) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50">
      <nav
        className={`lp-nav${scrolled ? " lp-nav--scrolled" : ""} dark:bg-slate-900 dark:border-b dark:border-slate-800`}
      >
        <div className="lp-nav-inner">
          <Link href="/" className="lp-logo-wrap">
            <div className="lp-logo-mark">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="12" rx="1.5" fill="white" />
                <rect x="9" y="2" width="5" height="8" rx="1.5" fill="white" opacity=".8" />
              </svg>
            </div>
            <span className="lp-logo-text dark:text-white">TaskFlow</span>
          </Link>

          <div className="lp-nav-links">
            {["Features", "Templates", "Pricing", "Enterprise"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="lp-nav-link dark:text-gray-300 dark:hover:text-white"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="lp-nav-actions flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              title="Toggle theme"
              aria-label="Toggle dark mode"
            >
              {theme === "light" ? (
                <Moon size={18} className="text-gray-600 dark:text-gray-300" />
              ) : (
                <Sun size={18} className="text-gray-600 dark:text-yellow-400" />
              )}
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
                title="Change language"
              >
                <Globe size={18} className="text-gray-600 dark:text-gray-300" />
                <span className="text-sm font-semibold dark:text-gray-300">
                  {language.toUpperCase()}
                </span>
              </button>

              {langOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setLangOpen(false)}
                  />
                  <div className="absolute right-0 top-full mt-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-20 min-w-[120px] overflow-hidden">
                    <button
                      onClick={() => handleLanguageChange("en")}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors ${
                        language === "en"
                          ? "bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-semibold"
                          : "dark:text-gray-300"
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => handleLanguageChange("kh")}
                      className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors ${
                        language === "kh"
                          ? "bg-blue-50 dark:bg-slate-700 text-blue-600 dark:text-blue-400 font-semibold"
                          : "dark:text-gray-300"
                      }`}
                    >
                      ខ្មែរ
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* User Actions */}
            {user ? (
              <>
                {/* Notification Bell */}
                <Link
                  href="/dashboard/notifications"
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors relative"
                  title="Notifications"
                >
                  <Bell size={18} className="text-gray-600 dark:text-gray-300" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Profile Menu */}
                <div className="relative">
                  <button
                    onClick={() => setProfileOpen(!profileOpen)}
                    className="w-9 h-9 rounded-full hover:ring-2 hover:ring-blue-500 transition-all overflow-hidden flex items-center justify-center bg-blue-100 dark:bg-slate-700"
                  >
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={displayName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                        {displayName.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </button>

                  {profileOpen && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setProfileOpen(false)}
                      />
                      <div className="absolute right-0 top-full mt-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg shadow-lg z-20 min-w-[200px] overflow-hidden">
                        <div className="px-4 py-3 border-b border-gray-200 dark:border-slate-700">
                          <p className="text-sm font-semibold dark:text-white">
                            {displayName}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {user.email}
                          </p>
                        </div>

                        <Link
                          href="/dashboard/settings"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          <User size={14} /> Profile
                        </Link>

                        <Link
                          href="/dashboard/settings"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          <Settings size={14} /> Settings
                        </Link>

                        <Link
                          href="/dashboard/notifications"
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center justify-between w-full px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          <span className="flex items-center gap-2.5">
                            <Bell size={14} /> Notifications
                          </span>
                          {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                              {unreadCount}
                            </span>
                          )}
                        </Link>

                        <div className="border-t border-gray-200 dark:border-slate-700 mt-1" />

                        <button
                          onClick={() => {
                            setProfileOpen(false);
                            router.push("/login");
                          }}
                          className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-slate-700 transition-colors"
                        >
                          <LogOut size={14} /> Sign out
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="lp-btn-ghost dark:text-gray-300 dark:hover:bg-slate-800">
                  {t("nav.login")}
                </Link>
                <Link
                  href="/register"
                  className="lp-btn-primary lp-btn-sm"
                >
                  {t("nav.getStarted")}
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}
