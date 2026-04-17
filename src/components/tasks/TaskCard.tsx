"use client";

import { useState } from "react";
import {
  MessageSquare,
  Trash2,
  MoreHorizontal,
  Calendar,
  ChevronDown,
  ChevronRight,
  Edit2,
  Check,
  X,
  Layers,
  Plus,
} from "lucide-react";
import type { Task, TaskStatus } from "@/lib/features/types/task-type";
import {
  useGetSubtasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} from "@/lib/features/tasks/taskApi";


const PRIORITY_STYLE: Record<string, string> = {
  LOW:    "bg-slate-50  text-slate-600  border-slate-200  dark:bg-slate-700/40 dark:text-slate-400  dark:border-slate-600/50",
  MEDIUM: "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-700/40",
  HIGH:   "bg-red-50    text-red-600    border-red-200    dark:bg-red-900/20    dark:text-red-400    dark:border-red-700/40",
  URGENT: "bg-red-100   text-red-800    border-red-300    dark:bg-red-900/30    dark:text-red-300    dark:border-red-700/50",
};

type ColDef = {
  id: TaskStatus;
  label: string;
  dot: string;
  bg: string;
  darkBg: string;
  accent: string;
};

const COLUMNS: ColDef[] = [
  { id: "TODO",        label: "To Do",       dot: "#94A3B8", bg: "#F1F5F9", darkBg: "#1e2235", accent: "#94A3B8" },
  { id: "IN_PROGRESS", label: "In Progress", dot: "#6C5CE7", bg: "#F0EDFF", darkBg: "#1e1a35", accent: "#6C5CE7" },
  { id: "IN_REVIEW",   label: "In Review",   dot: "#ff991f", bg: "#fff7e6", darkBg: "#211c0e", accent: "#ff991f" },
  { id: "DONE",        label: "Done",        dot: "#10B981", bg: "#e3fcef", darkBg: "#0e2119", accent: "#10B981" },
];

const STATUS_STYLE: Record<TaskStatus, string> = {
  TODO:        "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700 dark:hover:bg-slate-700",
  IN_PROGRESS: "bg-purple-50 text-purple-600 border-purple-200 hover:bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800 dark:hover:bg-purple-900/50",
  IN_REVIEW:   "bg-orange-50 text-orange-600 border-orange-200 hover:bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800 dark:hover:bg-orange-900/50",
  DONE:        "bg-green-50 text-green-700 border-green-200 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800 dark:hover:bg-green-900/50",
};

const ARROW_LABEL: Record<TaskStatus, string> = {
  TODO: "→ TO DO",
  IN_PROGRESS: "→ IN PROGRESS",
  IN_REVIEW: "→ IN REVIEW",
  DONE: "→ DONE",
};


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
        className="w-full h-8 px-2 text-sm rounded-lg border border-[#6C5CE7] outline-none bg-white dark:bg-[#252840] dark:text-white"
      />
      <textarea
        value={editDesc}
        onChange={(e) => setEditDesc(e.target.value)}
        placeholder="Description (optional)"
        rows={2}
        className="w-full px-2 py-1.5 text-xs rounded-lg border border-[#D1D5DB] dark:border-[#2a2d45] outline-none resize-none bg-white dark:bg-[#252840] dark:text-white focus:border-[#6C5CE7] transition-colors"
      />
      <div className="flex gap-1">
        <button
          onClick={handleSave}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#6C5CE7] text-white text-[10px] font-semibold hover:bg-[#5B4BD5] min-h-[28px] transition-colors"
        >
          <Check size={10} /> Save
        </button>
        <button
          onClick={onCancel}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#D1D5DB] dark:border-[#2a2d45] text-[#64748B] dark:text-slate-400 text-[10px] hover:bg-[#F1F5F9] dark:hover:bg-[#252840] min-h-[28px] transition-colors"
        >
          <X size={10} /> Cancel
        </button>
      </div>
    </div>
  );
}


function StatusBadge({
  status,
  onCycle,
}: {
  status: TaskStatus;
  onCycle: (next: TaskStatus) => void;
}) {
  const others = (["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"] as TaskStatus[]).filter(
    (s) => s !== status
  );
  return (
    <div className="flex items-center gap-1 flex-wrap">
      {others.map((s) => (
        <button
          key={s}
          onClick={(e) => { e.stopPropagation(); onCycle(s); }}
          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border transition-colors cursor-pointer min-h-[26px] ${STATUS_STYLE[s]}`}
        >
          {ARROW_LABEL[s]}
        </button>
      ))}
    </div>
  );
}


function SubtaskCard({
  subtask,
  col,
  onMove,
  onDelete,
}: {
  subtask: Task;
  col: ColDef;
  onMove: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [updateTask] = useUpdateTaskMutation();

  const handleSave = async (title: string, description: string) => {
    await updateTask({ id: subtask.id, data: { title, description: description || undefined } });
    setEditing(false);
  };

  return (
    <div
      className="bg-white dark:bg-[#1a1c2e] rounded-xl border border-[#E8E8EF] dark:border-[#2a2d45] border-l-[3px] p-3 space-y-2.5 hover:shadow-sm dark:hover:shadow-black/20 transition-all group"
      style={{ borderLeftColor: col.accent }}
    >
      {/* Header */}
      <div className="flex items-start gap-2 justify-between">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          <div className="mt-1.5 w-4 h-4 flex items-center justify-center shrink-0">
            <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
          </div>

          {editing ? (
            <InlineEditForm
              title={subtask.title}
              description={subtask.description ?? ""}
              onSave={handleSave}
              onCancel={() => setEditing(false)}
            />
          ) : (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#1E293B] dark:text-white leading-snug break-words">
                {subtask.title}
              </p>
              {subtask.description && (
                <p className="text-xs text-[#94A3B8] dark:text-slate-500 mt-0.5 line-clamp-1">
                  {subtask.description}
                </p>
              )}
            </div>
          )}
        </div>

        {!editing && (
          <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
            <button
              onClick={() => setEditing(true)}
              className="w-6 h-6 flex items-center justify-center text-[#94A3B8] dark:text-slate-600 hover:text-[#6C5CE7] transition-colors"
              title="Edit subtask"
            >
              <Edit2 size={12} />
            </button>
            <button
              onClick={() => { if (confirm("Delete this subtask?")) onDelete(subtask.id); }}
              className="w-6 h-6 flex items-center justify-center text-[#94A3B8] dark:text-slate-600 hover:text-red-500 transition-colors"
              title="Delete subtask"
            >
              <Trash2 size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Badges */}
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
              <span className="text-[10px] text-[#94A3B8] dark:text-slate-500 flex items-center gap-1 ml-auto">
                <Calendar size={9} />
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


type TaskCardProps = {
  task: Task;
  col: ColDef;
  onMove: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  onComment: (task: Task) => void;
  onAddSubtask?: (task: Task) => void;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
};

export default function TaskCard({
  task,
  col,
  onMove,
  onDelete,
  onComment,
  onAddSubtask,
  onDragStart,
  onDragEnd,
}: TaskCardProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);

  const hasSubtasks = (task.subtaskCount ?? 0) > 0;

  const { data: subtasks, isLoading: subtasksLoading } = useGetSubtasksQuery(task.id, {
    skip: !expanded || !hasSubtasks,
  });

  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const handleSave = async (title: string, description: string) => {
    await updateTask({ id: task.id, data: { title, description: description || undefined } });
    setEditing(false);
  };

  const handleSubtaskMove = (subtaskId: string, status: TaskStatus) => {
    updateTask({ id: subtaskId, data: { status } });
  };

  const handleSubtaskDelete = (subtaskId: string) => {
    deleteTask(subtaskId);
  };

  return (
    <div
      draggable
      onDragStart={(e) => {
        setIsDragging(true);
        onDragStart(task);
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("taskId", task.id);
      }}
      onDragEnd={() => { setIsDragging(false); onDragEnd(); }}
      className={`bg-white dark:bg-[#1a1c2e] rounded-xl border border-[#E8E8EF] dark:border-[#2a2d45] border-l-[3px]
                 hover:shadow-md dark:hover:shadow-black/30 transition-all cursor-grab active:cursor-grabbing select-none
                 ${isDragging ? "opacity-40 scale-95 rotate-1 shadow-lg" : ""}`}
      style={{ borderLeftColor: col.accent }}
    >
      {/* ── Card Body ── */}
      <div className="p-3.5 space-y-3">

        {/* Title row */}
        <div className="flex items-start gap-2">
          {/* Expand / collapse toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (hasSubtasks) setExpanded((v) => !v);
            }}
            className={`mt-0.5 shrink-0 w-5 h-5 flex items-center justify-center rounded transition-colors ${
              hasSubtasks
                ? "hover:bg-[#F1F5F9] dark:hover:bg-[#252840] cursor-pointer"
                : "cursor-default"
            }`}
            title={hasSubtasks ? (expanded ? "Collapse subtasks" : "Expand subtasks") : undefined}
          >
            {hasSubtasks ? (
              expanded ? (
                <ChevronDown size={13} className="text-[#94A3B8] dark:text-slate-500" />
              ) : (
                <ChevronRight size={13} className="text-[#94A3B8] dark:text-slate-500" />
              )
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
            )}
          </button>

          {editing ? (
            <InlineEditForm
              title={task.title}
              description={task.description ?? ""}
              onSave={handleSave}
              onCancel={() => setEditing(false)}
            />
          ) : (
            <p className="flex-1 text-sm font-semibold text-[#1E293B] dark:text-white leading-snug">
              {task.title}
            </p>
          )}

          {/* Action buttons */}
          {!editing && (
            <div className="flex gap-0.5 shrink-0">
              <button
                onClick={() => setEditing(true)}
                title="Edit task"
                className="w-6 h-6 flex items-center justify-center text-[#94A3B8] dark:text-slate-600 hover:text-[#6C5CE7] transition-colors"
              >
                <Edit2 size={12} />
              </button>
              <button
                onClick={() => onComment(task)}
                title="Comments"
                className="w-6 h-6 flex items-center justify-center text-[#94A3B8] dark:text-slate-600 hover:text-[#6C5CE7] transition-colors"
              >
                <MessageSquare size={12} />
              </button>
              <button
                onClick={() => { if (confirm("Delete this task?")) onDelete(task.id); }}
                title="Delete"
                className="w-6 h-6 flex items-center justify-center text-[#94A3B8] dark:text-slate-600 hover:text-red-500 transition-colors"
              >
                <Trash2 size={12} />
              </button>
              <button
                title="More"
                className="w-6 h-6 flex items-center justify-center text-[#94A3B8] dark:text-slate-600 hover:text-[#64748B] transition-colors"
              >
                <MoreHorizontal size={12} />
              </button>
            </div>
          )}
        </div>

        {/* Description preview */}
        {!editing && task.description && (
          <p className="text-xs text-[#94A3B8] dark:text-slate-500 ml-7 line-clamp-1">
            {task.description}
          </p>
        )}

        {/* Priority + subtask count */}
        {!editing && (
          <div className="flex items-center gap-1.5 flex-wrap ml-7">
            <span
              className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border capitalize ${
                PRIORITY_STYLE[task.priority] ?? ""
              }`}
            >
              {task.priority.toLowerCase()}
            </span>

            {hasSubtasks && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="flex items-center gap-1 text-[10px] text-[#94A3B8] dark:text-slate-500 bg-[#F1F5F9] dark:bg-[#252840] px-1.5 py-0.5 rounded border border-[#D1D5DB] dark:border-[#2a2d45] hover:border-[#6C5CE7] dark:hover:border-[#6C5CE7] hover:text-[#6C5CE7] transition-colors"
              >
                <Layers size={9} />
                {task.subtaskCount} subtask{task.subtaskCount !== 1 ? "s" : ""}
              </button>
            )}
          </div>
        )}

        {/* Assignees + due date */}
        {!editing && (
          <div className="flex items-center justify-between ml-7">
            <div className="flex items-center">
              {(task.assignees ?? []).slice(0, 3).map((a, i) => (
                <div
                  key={a.id}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-medium ring-[1.5px] ring-white dark:ring-[#1a1c2e]"
                  style={{ backgroundColor: a.color, marginLeft: i > 0 ? "-4px" : "0" }}
                  title={a.name}
                >
                  {a.initials}
                </div>
              ))}
            </div>
            {task.dueDate && (
              <span className="flex items-center gap-1 text-[10px] text-[#94A3B8] dark:text-slate-500">
                <Calendar size={10} />
                {new Date(task.dueDate).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            )}
          </div>
        )}

        {!editing && (
          <div className="flex gap-1 flex-wrap ml-7">
            {COLUMNS.filter((c) => c.id !== task.status).map((c) => (
              <button
                key={c.id}
                onClick={() => onMove(task.id, c.id)}
                className={`text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wide transition-all hover:opacity-80 hover:scale-105 ${STATUS_STYLE[c.id]}`}
              >
                {ARROW_LABEL[c.id]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* ── Subtasks Panel ── */}
      {expanded && hasSubtasks && (
        <div className="border-t border-[#E8E8EF] dark:border-[#2a2d45] px-3.5 pb-3.5 pt-3">
          <div className="ml-5 border-l-2 border-[#E8E8EF] dark:border-[#2a2d45] pl-3 space-y-2">
            {subtasksLoading
              ? [1, 2].map((i) => (
                  <div
                    key={i}
                    className="animate-pulse h-16 bg-[#F1F5F9] dark:bg-[#252840] rounded-xl"
                  />
                ))
              : (subtasks ?? []).length === 0
              ? (
                  <p className="text-xs text-[#94A3B8] dark:text-slate-600 py-1">
                    No subtasks found.
                  </p>
                )
              : (subtasks ?? []).map((st) => (
                  <SubtaskCard
                    key={st.id}
                    subtask={st}
                    col={col}
                    onMove={handleSubtaskMove}
                    onDelete={handleSubtaskDelete}
                  />
                ))}

            {/* Add subtask button */}
            {onAddSubtask && (
              <button
                onClick={() => onAddSubtask(task)}
                className="flex items-center gap-1.5 text-xs text-[#94A3B8] dark:text-slate-600 hover:text-[#6C5CE7] transition-colors py-1 font-medium"
              >
                <Plus size={12} />
                Add subtask
              </button>
            )}
          </div>
        </div>
      )}

      {/* Add subtask footer (when not expanded or no subtasks) */}
      {!expanded && onAddSubtask && (
        <div className="border-t border-[#F1F5F9] dark:border-[#2a2d45] px-3.5 py-2">
          <button
            onClick={() => onAddSubtask(task)}
            className="flex items-center gap-1.5 text-[11px] text-[#94A3B8] dark:text-slate-600 hover:text-[#6C5CE7] transition-colors font-medium"
          >
            <Plus size={11} />
            Add subtask
          </button>
        </div>
      )}
    </div>
  );
}

export type { ColDef };
export { COLUMNS };