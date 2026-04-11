"use client";
import { useState } from "react";
import { Calendar, Edit2, Check, X, Trash2 } from "lucide-react";
import type { Task } from "@/lib/features/types/task-type";
import { useUpdateProjectTaskMutation } from "@/lib/features/tasks/taskApi";

type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

type ColDef = {
  id: TaskStatus;
  accent: string;
};

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

// ─── Status Badge (same as parent) ───────────────────────────────────────────

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

// ─── Inline Edit Form (same as parent) ───────────────────────────────────────

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

// ─── SubtaskRow ───────────────────────────────────────────────────────────────

type Props = {
  subtask: Task;
  col: ColDef;
  projectId: string;
  onMove: (taskId: string, status: TaskStatus) => void;
  onDelete?: (id: string) => void;
};

export default function SubtaskRow({ subtask, col, projectId, onMove, onDelete }: Props) {
  const [editing, setEditing] = useState(false);
  const [updateProjectTask] = useUpdateProjectTaskMutation();

  const handleSave = async (title: string, description: string) => {
    await updateProjectTask({
      projectId,
      taskId: subtask.id,
      data: { title, description: description || undefined },
    });
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
          {/* Dot indicator (no children, so no chevron) */}
          <div className="mt-1.5 w-5 h-5 flex items-center justify-center shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          </div>

          {/* Title */}
          {editing ? (
            <InlineEditForm
              title={subtask.title}
              description={subtask.description ?? ""}
              onSave={handleSave}
              onCancel={() => setEditing(false)}
            />
          ) : (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white leading-snug break-words">
                {subtask.title}
              </p>
              {subtask.description && (
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                  {subtask.description}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Action buttons (same as parent card) */}
        {!editing && (
          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => setEditing(true)}
              className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-blue-600"
              title="Edit subtask"
            >
              <Edit2 size={13} />
            </button>
            {onDelete && (
              <button
                onClick={() => { if (confirm("Delete this subtask?")) onDelete(subtask.id); }}
                className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-red-600"
              >
                <Trash2 size={13} />
              </button>
            )}
          </div>
        )}
      </div>

      {/* ── Badges row ── */}
      {!editing && (
        <div className="space-y-2">
          <StatusBadge
            status={subtask.status as TaskStatus}
            onCycle={(next) => onMove(subtask.id, next)}
          />

          <div className="flex items-center justify-between gap-2 flex-wrap">
            {subtask.priority && (
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border capitalize ${
                  PRIORITY_STYLE[subtask.priority] ?? ""
                }`}
              >
                {subtask.priority.toLowerCase()}
              </span>
            )}

            {subtask.dueDate && (
              <span className="text-[11px] text-slate-400 dark:text-slate-500 flex items-center gap-1 shrink-0 ml-auto">
                <Calendar size={10} />
                {new Date(subtask.dueDate).toLocaleDateString("en-US", {
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