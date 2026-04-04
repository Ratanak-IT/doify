import {
  AlertCircle,
  CheckCircle2,
  Circle,
  Clock,
} from "lucide-react";

export const AVATAR_PALETTE = [
  "#0052cc",
  "#00875a",
  "#ff5630",
  "#6554c0",
  "#ff991f",
  "#00b8d9",
  "#36b37e",
  "#de350b",
];

export const TEAM_GRADIENTS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-500",
  "from-emerald-500 to-teal-500",
  "from-orange-500 to-amber-500",
  "from-pink-500 to-rose-500",
  "from-indigo-500 to-blue-600",
];

export const TEAM_ICON_BG = [
  "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-300",
  "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300",
  "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300",
  "bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-300",
  "bg-pink-100 dark:bg-pink-900/40 text-pink-600 dark:text-pink-300",
  "bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300",
];

export const STATUS_CONFIG = {
  TODO: {
    label: "To Do",
    icon: Circle,
    cls: "text-slate-500 dark:text-slate-400",
    bg: "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300",
  },
  IN_PROGRESS: {
    label: "In Progress",
    icon: Clock,
    cls: "text-blue-500",
    bg: "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300",
  },
  IN_REVIEW: {
    label: "In Review",
    icon: AlertCircle,
    cls: "text-amber-500",
    bg: "bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300",
  },
  DONE: {
    label: "Done",
    icon: CheckCircle2,
    cls: "text-emerald-500",
    bg: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300",
  },
} as const;

export const PRIORITY_CONFIG = {
  LOW: {
    label: "Low",
    cls: "text-slate-400",
    bg: "bg-slate-100 dark:bg-slate-800 text-slate-500",
  },
  MEDIUM: {
    label: "Medium",
    cls: "text-amber-500",
    bg: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300",
  },
  HIGH: {
    label: "High",
    cls: "text-orange-500",
    bg: "bg-orange-100 dark:bg-orange-900/40 text-orange-600",
  },
  URGENT: {
    label: "Urgent",
    cls: "text-red-500",
    bg: "bg-red-100 dark:bg-red-900/40 text-red-600",
  },
} as const;

export type StatusKey = keyof typeof STATUS_CONFIG;
export type PriorityKey = keyof typeof PRIORITY_CONFIG;