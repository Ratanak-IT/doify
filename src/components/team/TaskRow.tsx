"use client";

import { useState } from "react";
import {
  Calendar,
  ChevronDown,
  ChevronRight,
  Flag,
  Layers,
} from "lucide-react";
import type { Task } from "@/lib/features/types/task-type";
import { useGetSubtasksQuery } from "@/lib/features/tasks/taskApi";
import {
  PRIORITY_CONFIG,
  STATUS_CONFIG,
  type PriorityKey,
  type StatusKey,
} from "@/lib/features/team/team.constants";
import SubtaskRow from "./SubtaskRow";

type Props = {
  task: Task;
};

export default function TaskRow({ task }: Props) {
  const [expanded, setExpanded] = useState(false);

  const hasSubtasks = (task.subtaskCount ?? 0) > 0;

  const { data: subtasks, isLoading: subtasksLoading } = useGetSubtasksQuery(
    task.id,
    { skip: !expanded || !hasSubtasks }
  );

  const status = STATUS_CONFIG[task.status as StatusKey] ?? STATUS_CONFIG.TODO;
  const priority = PRIORITY_CONFIG[task.priority as PriorityKey];
  const StatusIcon = status.icon;
  const isDone = task.status === "DONE";
  const firstAssignee = task.assignees?.[0] ?? null;

  return (
    <div>
      <div className="flex items-center gap-3 p-3.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group">
        <button
          onClick={() => hasSubtasks && setExpanded((v) => !v)}
          className={`shrink-0 w-5 h-5 flex items-center justify-center rounded transition-colors ${
            hasSubtasks
              ? "hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer"
              : "cursor-default"
          }`}
        >
          {hasSubtasks ? (
            expanded ? (
              <ChevronDown size={13} className="text-slate-500" />
            ) : (
              <ChevronRight size={13} className="text-slate-500" />
            )
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
          )}
        </button>

        <StatusIcon size={15} className={`shrink-0 ${status.cls}`} />

        <span
          className={`flex-1 text-sm font-medium truncate ${
            isDone
              ? "line-through text-slate-400 dark:text-slate-500"
              : "text-slate-800 dark:text-slate-100"
          }`}
        >
          {task.title}
        </span>

        {firstAssignee && (
          <div
            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-semibold shrink-0"
            style={{ backgroundColor: firstAssignee.color }}
            title={firstAssignee.name}
          >
            {firstAssignee.initials}
          </div>
        )}

        {priority && (
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 hidden sm:inline-flex items-center gap-1 ${priority.bg}`}
          >
            <Flag size={8} />
            {priority.label}
          </span>
        )}

        <span
          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 hidden md:inline-flex ${status.bg}`}
        >
          {status.label}
        </span>

        {task.dueDate && (
          <span className="text-[11px] text-slate-400 dark:text-slate-500 items-center gap-1 shrink-0 hidden lg:flex">
            <Calendar size={10} />
            {new Date(task.dueDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}

        {hasSubtasks && (
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 shrink-0 flex items-center gap-1">
            <Layers size={9} />
            {task.subtaskCount}
          </span>
        )}
      </div>

      {expanded && (
        <div className="ml-8 border-l-2 border-slate-200 dark:border-slate-700 pl-4 mb-1">
          {subtasksLoading ? (
            [1, 2].map((i) => (
              <div
                key={i}
                className="animate-pulse flex items-center gap-2 py-2.5 px-3"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-slate-200 dark:bg-slate-700" />
                <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded flex-1 max-w-[200px]" />
              </div>
            ))
          ) : (subtasks ?? []).length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-500 py-2 px-3">
              No subtasks found
            </p>
          ) : (
            (subtasks ?? []).map((st) => <SubtaskRow key={st.id} subtask={st} col={{ id: st.status as any, accent: "#6C5CE7" }} projectId={task.projectId ?? ""} onMove={() => {}} />)
          )}
        </div>
      )}
    </div>
  );
}