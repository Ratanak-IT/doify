"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  RefreshCw,
} from "lucide-react";
import type { Task } from "@/lib/features/types/task-type";
import {
  useGetSubtasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "@/lib/features/tasks/taskApi";
import CreateSubtaskModal from "./CreateSubtaskModal";

type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

type ColDef = {
  id: TaskStatus;
  label: string;
  dot: string;
  bg: string;
  accent: string;
};

const COLUMNS: ColDef[] = [
  { id: "TODO", label: "TO DO", dot: "#97a0af", bg: "#f4f5f7", accent: "#97a0af" },
  { id: "IN_PROGRESS", label: "IN PROGRESS", dot: "#0052cc", bg: "#e9f2ff", accent: "#0052cc" },
  { id: "IN_REVIEW", label: "IN REVIEW", dot: "#ff991f", bg: "#fff7e6", accent: "#ff991f" },
  { id: "DONE", label: "DONE", dot: "#00875a", bg: "#e3fcef", accent: "#00875a" },
];

const PRIORITY_STYLE: Record<string, string> = {
  LOW: "bg-slate-50 text-slate-600 border-slate-200",
  MEDIUM: "bg-orange-50 text-orange-600 border-orange-200",
  HIGH: "bg-red-50 text-red-600 border-red-200",
  URGENT: "bg-red-100 text-red-800 border-red-300",
};

function SubtaskCard({
  task,
  col,
  onMove,
  onDelete,
}: {
  task: Task;
  col: ColDef;
  onMove: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 border-l-[3px] p-3.5 space-y-3 hover:shadow-md transition-all group"
      style={{ borderLeftColor: col.accent }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-slate-900 dark:text-white leading-snug break-words">
          {task.title}
        </p>

        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => {
              if (confirm("Delete this subtask?")) onDelete(task.id);
            }}
            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-red-600"
          >
            <Trash2 size={13} />
          </button>
          <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600">
            <MoreHorizontal size={13} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <span
          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border capitalize ${
            PRIORITY_STYLE[task.priority] ?? ""
          }`}
        >
          {task.priority?.toLowerCase()}
        </span>
      </div>

      {task.dueDate && (
        <div className="flex items-center justify-end">
          <span className="flex items-center gap-1 text-[10px] text-slate-400">
            <Calendar size={10} />
            {new Date(task.dueDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        </div>
      )}

      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-wrap">
        {COLUMNS.filter((c) => c.id !== task.status).map((c) => (
          <button
            key={c.id}
            onClick={() => onMove(task.id, c.id)}
            className="text-[9px] px-1.5 py-0.5 rounded border border-slate-200 text-slate-500 hover:border-blue-500 hover:text-blue-600 transition-colors font-medium"
          >
            → {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ParentTaskDetailView({
  task,
  onBack,
}: {
  task: Task;
  onBack: () => void;
}) {
  const [search, setSearch] = useState("");
  const [showCreateSubtask, setShowCreateSubtask] = useState(false);

  const {
    data: subtasks = [],
    isLoading,
    refetch,
  } = useGetSubtasksQuery(task.id);

  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const filteredSubtasks = useMemo(() => {
    if (!search.trim()) return subtasks;
    return subtasks.filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase())
    );
  }, [subtasks, search]);

  const progress =
    subtasks.length > 0
      ? Math.round(
          (subtasks.filter((t) => t.status === "DONE").length / subtasks.length) * 100
        )
      : 0;

  const handleMove = (id: string, status: TaskStatus) => {
    updateTask({ id, data: { status } });
  };

  const handleDeleteSubtask = (id: string) => {
    deleteTask(id);
  };

  const handleDeleteParentTask = async () => {
    if (!confirm("Delete this parent task?")) return;
    await deleteTask(task.id);
    onBack();
  };

  return (
    <>
      <div className="flex flex-col h-full bg-[#f4f5f7] dark:bg-slate-950">
        <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBack}
              className="h-9 px-3 rounded-md border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              <ArrowLeft size={14} />
              Back
            </button>

            <div className="min-w-0">
              <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">
                {task.title}
              </h1>
              {task.description && (
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {task.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              className="h-9 px-3 rounded-md border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-2"
            >
              <RefreshCw size={14} />
              Refresh
            </button>

            <button
              onClick={handleDeleteParentTask}
              className="h-9 px-3 rounded-md border border-red-200 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
            >
              <Trash2 size={14} />
              Delete
            </button>

            <div className="text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">
              {progress}%
            </div>
          </div>
        </div>

        <div className="h-1 bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full bg-violet-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <div className="px-5 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="relative max-w-sm">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subtasks..."
              className="w-full h-9 pl-9 pr-3 rounded-md border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 dark:text-white outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <main className="flex-1 overflow-auto p-5">
          <div className="flex gap-4 min-w-max h-full">
            {COLUMNS.map((col) => {
              const colTasks = filteredSubtasks.filter((t) => t.status === col.id);

              return (
                <div key={col.id} className="w-[290px] flex flex-col">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: col.dot }}
                      />
                      <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wide">
                        {col.label}
                      </span>
                      <span className="text-xs text-slate-500 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 px-1.5 py-0.5 rounded-full font-semibold">
                        {colTasks.length}
                      </span>
                    </div>

                    <button
                      onClick={() => setShowCreateSubtask(true)}
                      className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-900 rounded transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div
                    className="flex-1 rounded-xl p-2 flex flex-col gap-2"
                    style={{ backgroundColor: col.bg }}
                  >
                    {isLoading
                      ? Array.from({ length: 2 }).map((_, i) => (
                          <div
                            key={i}
                            className="animate-pulse bg-white rounded-lg h-28 opacity-60"
                          />
                        ))
                      : colTasks.map((subtask) => (
                          <SubtaskCard
                            key={subtask.id}
                            task={subtask}
                            col={col}
                            onMove={handleMove}
                            onDelete={handleDeleteSubtask}
                          />
                        ))}

                    {!isLoading && colTasks.length === 0 && (
                      <div className="border-2 border-dashed border-black/10 rounded-lg p-6 text-center text-xs text-slate-400 font-medium">
                        No subtasks
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {showCreateSubtask && (
        <CreateSubtaskModal
  projectId={task.projectId}
  parentTaskId={task.id}
  onClose={() => setShowCreateSubtask(false)}
/>
      )}
    </>
  );
}