"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Check,
  Edit2,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  RefreshCw,
  X,
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
  { id: "TODO",        label: "TO DO",       dot: "#97a0af", bg: "#F1F5F9", accent: "#97a0af" },
  { id: "IN_PROGRESS", label: "IN PROGRESS", dot: "#6C5CE7", bg: "#F0EDFF", accent: "#6C5CE7" },
  { id: "IN_REVIEW",   label: "IN REVIEW",   dot: "#ff991f", bg: "#fff7e6", accent: "#ff991f" },
  { id: "DONE",        label: "DONE",        dot: "#00875a", bg: "#e3fcef", accent: "#00875a" },
];

const PRIORITY_STYLE: Record<string, string> = {
  LOW:    "bg-slate-50 text-slate-600 border-slate-200",
  MEDIUM: "bg-orange-50 text-orange-600 border-orange-200",
  HIGH:   "bg-red-50 text-red-600 border-red-200",
  URGENT: "bg-red-100 text-red-800 border-red-300",
};

const STATUS_CYCLE: TaskStatus[] = ["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"];

const STATUS_STYLE: Record<TaskStatus, string> = {
  TODO:        "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200",
  IN_PROGRESS: "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100",
  IN_REVIEW:   "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100",
  DONE:        "bg-green-50 text-green-700 border-green-200 hover:bg-green-100",
};

const ARROW_LABEL: Record<TaskStatus, string> = {
  TODO:        "→ TO DO",
  IN_PROGRESS: "→ IN PROGRESS",
  IN_REVIEW:   "→ IN REVIEW",
  DONE:        "→ DONE",
};

// ─── Status Badge (always visible, same as TeamTaskCard) ──────────────────────

function StatusBadge({
  status,
  onCycle,
}: {
  status: TaskStatus;
  onCycle: (next: TaskStatus) => void;
}) {
  const next = STATUS_CYCLE.filter((s) => s !== status);
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {next.map((s) => (
        <button
          key={s}
          onClick={(e) => { e.stopPropagation(); onCycle(s); }}
          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border transition-colors cursor-pointer ${STATUS_STYLE[s]}`}
        >
          {ARROW_LABEL[s]}
        </button>
      ))}
    </div>
  );
}

// ─── Inline Edit Form (same as TeamTaskCard) ──────────────────────────────────

function InlineEditForm({
  title,
  description,
  onSave,
  onCancel,
}: {
  title: string;
  description: string;
  onSave: (title: string, description: string) => void;
  onCancel: () => void;
}) {
  const [editTitle, setEditTitle] = useState(title);
  const [editDesc, setEditDesc] = useState(description);

  const handleSave = () => {
    if (!editTitle.trim()) return;
    onSave(editTitle.trim(), editDesc.trim());
  };

  return (
    <div className="flex-1 space-y-1.5" onClick={(e) => e.stopPropagation()}>
      <input
        autoFocus
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSave();
          if (e.key === "Escape") onCancel();
        }}
        className="w-full h-7 px-2 text-sm rounded border border-blue-500 outline-none dark:bg-slate-800 dark:text-white"
      />
      <textarea
        value={editDesc}
        onChange={(e) => setEditDesc(e.target.value)}
        placeholder="Description (optional)"
        rows={3}
        className="w-full px-2 py-1 text-xs rounded border border-slate-200 outline-none resize-none dark:bg-slate-800 dark:text-white focus:border-blue-400"
      />
      <div className="flex gap-1">
        <button
          onClick={handleSave}
          className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-semibold hover:bg-blue-700"
        >
          <Check size={10} /> Save
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1 px-2 py-0.5 rounded border text-slate-500 text-[10px] hover:bg-slate-100 dark:hover:bg-slate-700"
        >
          <X size={10} /> Cancel
        </button>
      </div>
    </div>
  );
}

// ─── SubtaskCard — now identical in style to TeamTaskCard ─────────────────────

function SubtaskCard({
  task,
  col,
  onMove,
  onDelete,
  onUpdate,
}: {
  task: Task;
  col: ColDef;
  onMove: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, title: string, description: string) => void;
}) {
  const [editing, setEditing] = useState(false);

  const handleSave = (title: string, description: string) => {
    onUpdate(task.id, title, description);
    setEditing(false);
  };

  return (
    <div
      className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 border-l-[3px] p-3.5 space-y-3 hover:shadow-md transition-all group"
      style={{ borderLeftColor: col.accent }}
    >
      {/* ── Header row ── */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {/* Dot — no children so no chevron */}
          <div className="mt-1.5 w-5 h-5 flex items-center justify-center shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          </div>

          {editing ? (
            <InlineEditForm
              title={task.title}
              description={task.description ?? ""}
              onSave={handleSave}
              onCancel={() => setEditing(false)}
            />
          ) : (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white leading-snug break-words">
                {task.title}
              </p>
              {task.description && (
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                  {task.description}
                </p>
              )}
            </div>
          )}
        </div>

        {!editing && (
          <div className="flex gap-0.5 shrink-0">
            <button
              onClick={() => setEditing(true)}
              className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-blue-600"
              title="Edit subtask"
            >
              <Edit2 size={13} />
            </button>
            <button
              onClick={() => { if (confirm("Delete this subtask?")) onDelete(task.id); }}
              className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-red-600"
            >
              <Trash2 size={13} />
            </button>
            <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600">
              <MoreHorizontal size={13} />
            </button>
          </div>
        )}
      </div>

      {/* ── Badges — always visible, same as TeamTaskCard ── */}
      {!editing && (
        <div className="space-y-2 mt-3">
          <StatusBadge
            status={task.status as TaskStatus}
            onCycle={(next) => onMove(task.id, next)}
          />

          <div className="flex items-center justify-between gap-2 flex-wrap mt-3">
            {task.priority && (
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border capitalize ${
                  PRIORITY_STYLE[task.priority] ?? ""
                }`}
              >
                {task.priority.toLowerCase()}
              </span>
            )}

            {task.dueDate && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 shrink-0 ml-auto">
                <Calendar size={10} />
                {new Date(task.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── ParentTaskDetailView ─────────────────────────────────────────────────────

export default function ParentTaskDetailView({
  task,
  onBack,
}: {
  task: Task;
  onBack: () => void;
}) {
  const [search, setSearch] = useState("");
  const [showCreateSubtask, setShowCreateSubtask] = useState(false);

  const { data: subtasks = [], isLoading, refetch } = useGetSubtasksQuery(task.id);
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

  const handleUpdate = (id: string, title: string, description: string) => {
    updateTask({ id, data: { title, description: description || undefined } });
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
      <div className="flex flex-col h-full bg-[#F1F5F9] dark:bg-slate-950">
        {/* ── Header ── */}
        <div className="min-h-14 sm:h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-4 sm:px-6 py-2 sm:py-0 shrink-0">
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

        {/* ── Progress bar ── */}
        <div className="h-1 bg-slate-200 dark:bg-slate-800">
          <div
            className="h-full bg-violet-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* ── Search ── */}
        <div className="px-5 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="relative max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search subtasks..."
              className="w-full h-9 pl-9 pr-3 rounded-md border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 dark:text-white outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* ── Kanban columns ── */}
        <main className="flex-1 overflow-auto p-5">
          <div className="flex gap-4 min-w-max h-full">
            {COLUMNS.map((col) => {
              const colTasks = filteredSubtasks.filter((t) => t.status === col.id);
              return (
                <div key={col.id} className="w-[290px] flex flex-col">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: col.dot }} />
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
                          <div key={i} className="animate-pulse bg-white rounded-lg h-28" />
                        ))
                      : colTasks.map((subtask) => (
                          <SubtaskCard
                            key={subtask.id}
                            task={subtask}
                            col={col}
                            onMove={handleMove}
                            onDelete={handleDeleteSubtask}
                            onUpdate={handleUpdate}
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