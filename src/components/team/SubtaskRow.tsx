import { Calendar } from "lucide-react";
import type { Task } from "@/lib/features/types/task-type";
import {
  PRIORITY_CONFIG,
  STATUS_CONFIG,
  type PriorityKey,
  type StatusKey,
} from "@/lib/features/team/team.constants";

type Props = {
  subtask: Task;
};

export default function SubtaskRow({ subtask }: Props) {
  const status = STATUS_CONFIG[subtask.status as StatusKey] ?? STATUS_CONFIG.TODO;
  const priority = PRIORITY_CONFIG[subtask.priority as PriorityKey];
  const StatusIcon = status.icon;
  const isDone = subtask.status === "DONE";

  return (
    <div className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors">
      <StatusIcon size={14} className={`shrink-0 ${status.cls}`} />

      <span
        className={`flex-1 text-sm truncate ${
          isDone
            ? "line-through text-slate-400 dark:text-slate-500"
            : "text-slate-700 dark:text-slate-200"
        }`}
      >
        {subtask.title}
      </span>

      {priority && (
        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${priority.bg}`}
        >
          {priority.label}
        </span>
      )}

      {subtask.dueDate && (
        <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 shrink-0">
          <Calendar size={10} />
          {new Date(subtask.dueDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}
        </span>
      )}
    </div>
  );
}