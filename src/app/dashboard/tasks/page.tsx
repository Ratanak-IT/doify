"use client";

import DashboardHeader from "@/components/DashboardHeader";

import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  Plus, Search, Calendar, RefreshCw,
  Trash2, X, Send, Edit2, Check, Pencil,
} from "lucide-react";
import {
  useGetPersonalTasksQuery,
  useCreatePersonalTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetCommentsQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useGetTaskQuery,
} from "@/lib/features/tasks/taskApi";
import type { Task, TaskStatus, Comment } from "@/lib/features/types/task-type";
import { createPersonalTaskSchema } from "@/lib/schemas";
import type { z } from "zod";

const PRIORITY_STYLE: Record<string, string> = {
  LOW:    "bg-slate-50  text-slate-600  border-slate-200  dark:bg-slate-700/40 dark:text-slate-400  dark:border-slate-600/50",
  MEDIUM: "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-700/40",
  HIGH:   "bg-red-50    text-red-600    border-red-200    dark:bg-red-900/20    dark:text-red-400    dark:border-red-700/40",
  URGENT: "bg-red-100   text-red-800    border-red-300    dark:bg-red-900/30    dark:text-red-300    dark:border-red-700/50",
};

type ColDef = { id: TaskStatus; label: string; dot: string; bg: string; darkBg: string; accent: string };
const COLUMNS: ColDef[] = [
  { id: "TODO",        label: "To Do",       dot: "#94A3B8", bg: "#F1F5F9", darkBg: "#1e2235", accent: "#94A3B8" },
  { id: "IN_PROGRESS", label: "In Progress", dot: "#6C5CE7", bg: "#F0EDFF", darkBg: "#1e1a35", accent: "#6C5CE7" },
  { id: "IN_REVIEW",   label: "In Review",   dot: "#ff991f", bg: "#fff7e6", darkBg: "#211c0e", accent: "#ff991f" },
  { id: "DONE",        label: "Done",        dot: "#10B981", bg: "#e3fcef", darkBg: "#0e2119", accent: "#10B981" },
];

const AVATAR_PALETTE = [
  "#6C5CE7", "#10B981", "#ff5630", "#6554c0",
  "#ff991f", "#00b8d9", "#36b37e", "#EF4444",
];

function getInitials(fullName: string): string {
  return fullName.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0].toUpperCase()).join("");
}

function getAvatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

/* ── New Task Modal ─────────────────────────────────────────────── */
type TaskForm = z.infer<typeof createPersonalTaskSchema>;

function NewTaskModal({ defaultStatus, onClose }: { defaultStatus?: TaskStatus; onClose: () => void }) {
  const [createTask, { isLoading }] = useCreatePersonalTaskMutation();
  const [form, setForm] = useState<TaskForm>({
    title: "", description: "", priority: "MEDIUM", dueDate: "", parentTaskId: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof TaskForm, string>>>({});
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError("");
    const result = createPersonalTaskSchema.safeParse(form);
    if (!result.success) {
      const fe: Partial<Record<keyof TaskForm, string>> = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as keyof TaskForm;
        if (!fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      return;
    }
    try {
      const payload: Record<string, string> = { title: result.data.title, priority: result.data.priority };
      if (result.data.description) payload.description = result.data.description;
      if (result.data.dueDate) payload.dueDate = result.data.dueDate;
      if (result.data.parentTaskId) payload.parentTaskId = result.data.parentTaskId;
      if (defaultStatus) payload.status = defaultStatus;
      await createTask(payload as Parameters<typeof createTask>[0]).unwrap();
      onClose();
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setApiError(e?.data?.message ?? "Failed to create task. Please try again.");
    }
  };

  const inputCls = (hasErr?: boolean) =>
    `w-full h-11 px-3 rounded-md border text-sm outline-none bg-white dark:bg-[#252840] dark:text-white transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-600 ${
      hasErr
        ? "border-red-400 dark:border-red-700"
        : "border-[#D1D5DB] dark:border-[#2a2d45] focus:border-[#6C5CE7] dark:focus:border-[#6C5CE7]"
    }`;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-[#1a1c2e] rounded-t-2xl sm:rounded-xl shadow-2xl dark:shadow-black/50 w-full sm:max-w-md max-h-[92dvh] overflow-y-auto border-0 dark:border dark:border-[#2a2d45]">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#F1F5F9] dark:border-[#2a2d45]">
          <h2 className="text-base font-bold text-[#1E293B] dark:text-white">New Task</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center text-[#94A3B8] dark:text-slate-500 hover:bg-[#F1F5F9] dark:hover:bg-[#252840] transition-colors">
            <X size={15} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {apiError && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 p-3 rounded-lg">{apiError}</p>
          )}
          <div>
            <label className="block text-sm font-semibold text-[#64748B] dark:text-slate-400 mb-1.5">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="What needs to be done?" className={inputCls(!!errors.title)} />
            {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#64748B] dark:text-slate-400 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3} placeholder="Add more details…"
              className="w-full px-3 py-3 rounded-xl border border-[#D1D5DB] dark:border-[#2a2d45] text-sm outline-none focus:border-[#6C5CE7] dark:focus:border-[#6C5CE7] bg-white dark:bg-[#252840] dark:text-white resize-none transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-600" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#64748B] dark:text-slate-400 mb-1.5">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as TaskForm["priority"] })}
                className="w-full h-11 px-3 rounded-md border border-[#D1D5DB] dark:border-[#2a2d45] text-sm outline-none focus:border-[#6C5CE7] bg-white dark:bg-[#252840] dark:text-white">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#64748B] dark:text-slate-400 mb-1.5">Due date</label>
              <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full h-11 px-3 rounded-md border border-[#D1D5DB] dark:border-[#2a2d45] text-sm outline-none focus:border-[#6C5CE7] bg-white dark:bg-[#252840] dark:text-white transition-colors" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 h-12 rounded-xl border border-[#D1D5DB] dark:border-[#2a2d45] text-sm font-semibold text-[#64748B] dark:text-slate-400 hover:bg-[#F1F5F9] dark:hover:bg-[#252840] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading}
              className="flex-1 h-12 rounded-xl bg-[#6C5CE7] hover:bg-[#5B4BD5] text-white text-sm font-semibold transition-colors disabled:opacity-60">
              {isLoading ? "Creating…" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Comments Drawer ────────────────────────────────────────────── */
function CommentsDrawer({ task, onClose }: { task: Task; onClose: () => void }) {
  const { data: pageData, isLoading } = useGetCommentsQuery({ taskId: task.id });
  const comments: Comment[] = pageData?.content ?? [];
  const [addComment, { isLoading: posting }] = useAddCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [text, setText] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const submit = async () => {
    if (!text.trim()) return;
    await addComment({ taskId: task.id, content: text.trim() });
    setText("");
  };

  const saveEdit = async (commentId: string) => {
    if (!editText.trim()) return;
    await updateComment({ taskId: task.id, commentId, content: editText.trim() });
    setEditId(null);
  };

  const timeAgo = (iso: string) => {
    const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    return m < 60 ? `${m}m ago` : `${Math.round(m / 60)}h ago`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white dark:bg-[#1a1c2e] w-full max-w-sm flex flex-col shadow-2xl dark:shadow-black/50 border-l border-transparent dark:border-[#2a2d45]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8EF] dark:border-[#2a2d45] shrink-0">
          <div>
            <p className="text-sm font-semibold text-[#1E293B] dark:text-white line-clamp-1">{task.title}</p>
            <p className="text-xs text-[#94A3B8] dark:text-slate-500">{comments.length} comment{comments.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center text-[#94A3B8] dark:text-slate-500 hover:bg-[#F1F5F9] dark:hover:bg-[#252840]">
            <X size={15} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {isLoading && <p className="text-center text-xs text-[#94A3B8] py-8">Loading…</p>}
          {!isLoading && comments.length === 0 && <p className="text-center text-xs text-[#94A3B8] dark:text-slate-600 py-8">No comments yet.</p>}
          {comments.map((c) => {
            const authorName = c.author?.fullName ?? c.author?.username ?? "Unknown";
            const authorId   = c.author?.id ?? authorName;
            return (
              <div key={c.id} className="flex gap-3 group">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-medium shrink-0"
                  style={{ backgroundColor: getAvatarColor(authorId) }}>
                  {getInitials(authorName)}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold text-[#1E293B] dark:text-white">{authorName}</span>
                    <span className="text-[10px] text-[#94A3B8]">{timeAgo(c.createdAt)}</span>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                      <button onClick={() => { setEditId(c.id); setEditText(c.content); }} className="text-[#94A3B8] hover:text-[#6C5CE7]"><Edit2 size={11} /></button>
                      <button onClick={() => deleteComment({ taskId: task.id, commentId: c.id })} className="text-[#94A3B8] hover:text-red-500"><Trash2 size={11} /></button>
                    </div>
                  </div>
                  {editId === c.id ? (
                    <div className="flex gap-1 mt-1">
                      <input value={editText} onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 h-7 px-2 text-xs rounded border border-[#6C5CE7] outline-none bg-white dark:bg-[#252840] dark:text-white" />
                      <button onClick={() => saveEdit(c.id)} className="w-7 h-7 rounded bg-[#6C5CE7] text-white flex items-center justify-center"><Check size={11} /></button>
                      <button onClick={() => setEditId(null)} className="w-7 h-7 rounded border border-[#D1D5DB] dark:border-[#2a2d45] text-[#94A3B8] flex items-center justify-center"><X size={11} /></button>
                    </div>
                  ) : (
                    <p className="text-sm text-[#64748B] dark:text-slate-400 mt-0.5 leading-relaxed">{c.content}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-t border-[#E8E8EF] dark:border-[#2a2d45] p-4 shrink-0">
          <div className="flex gap-2">
            <input value={text} onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
              placeholder="Write a comment…"
              className="flex-1 h-9 px-3 rounded-md border border-[#D1D5DB] dark:border-[#2a2d45] text-sm outline-none focus:border-[#6C5CE7] bg-white dark:bg-[#252840] dark:text-white transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-600" />
            <button onClick={submit} disabled={posting || !text.trim()}
              className="w-9 h-9 rounded-xl bg-[#6C5CE7] hover:bg-[#5B4BD5] text-white flex items-center justify-center disabled:opacity-40 transition-colors">
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Edit Task Modal ────────────────────────────────────────────── */
function EditTaskModal({ task, onClose }: { task: Task; onClose: () => void }) {
  const [updateTask, { isLoading }] = useUpdateTaskMutation();
  const [form, setForm] = useState({
    title: task.title ?? "",
    description: task.description ?? "",
    priority: task.priority ?? "MEDIUM",
    dueDate: task.dueDate ?? "",
  });
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!form.title.trim()) { setApiError("Title is required."); return; }
    try {
      await updateTask({ id: task.id, data: { ...form } }).unwrap();
      onClose();
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setApiError(e?.data?.message ?? "Failed to update task.");
    }
  };

  const inputCls = (hasErr?: boolean) =>
    `w-full h-11 px-3 rounded-md border text-sm outline-none bg-white dark:bg-[#252840] dark:text-white transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-600 ${
      hasErr
        ? "border-red-400 dark:border-red-700"
        : "border-[#D1D5DB] dark:border-[#2a2d45] focus:border-[#6C5CE7] dark:focus:border-[#6C5CE7]"
    }`;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-[#1a1c2e] rounded-t-2xl sm:rounded-xl shadow-2xl dark:shadow-black/50 w-full sm:max-w-md max-h-[92dvh] overflow-y-auto border-0 dark:border dark:border-[#2a2d45]">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#F1F5F9] dark:border-[#2a2d45]">
          <h2 className="text-base font-bold text-[#1E293B] dark:text-white">Edit Task</h2>
          <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center text-[#94A3B8] dark:text-slate-500 hover:bg-[#F1F5F9] dark:hover:bg-[#252840] transition-colors">
            <X size={15} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {apiError && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 p-3 rounded-lg">{apiError}</p>
          )}
          <div>
            <label className="block text-sm font-semibold text-[#64748B] dark:text-slate-400 mb-1.5">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="What needs to be done?" className={inputCls(!form.title.trim())} />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#64748B] dark:text-slate-400 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3} placeholder="Add more details…"
              className="w-full px-3 py-3 rounded-xl border border-[#D1D5DB] dark:border-[#2a2d45] text-sm outline-none focus:border-[#6C5CE7] dark:focus:border-[#6C5CE7] bg-white dark:bg-[#252840] dark:text-white resize-none transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-600" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#64748B] dark:text-slate-400 mb-1.5">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Task["priority"] })}
                className="w-full h-11 px-3 rounded-md border border-[#D1D5DB] dark:border-[#2a2d45] text-sm outline-none focus:border-[#6C5CE7] bg-white dark:bg-[#252840] dark:text-white">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#64748B] dark:text-slate-400 mb-1.5">Due date</label>
              <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full h-11 px-3 rounded-md border border-[#D1D5DB] dark:border-[#2a2d45] text-sm outline-none focus:border-[#6C5CE7] bg-white dark:bg-[#252840] dark:text-white transition-colors" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose}
              className="flex-1 h-12 rounded-xl border border-[#D1D5DB] dark:border-[#2a2d45] text-sm font-semibold text-[#64748B] dark:text-slate-400 hover:bg-[#F1F5F9] dark:hover:bg-[#252840] transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={isLoading}
              className="flex-1 h-12 rounded-xl bg-[#6C5CE7] hover:bg-[#5B4BD5] text-white text-sm font-semibold transition-colors disabled:opacity-60">
              {isLoading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


function TaskCard({
  task, col, onMove, onDelete, onEdit, onDragStart, onDragEnd,
}: {
  task: Task; col: ColDef;
  onMove: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onDragStart: (task: Task) => void;
  onDragEnd: () => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

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
      className={`bg-white dark:bg-[#1a1c2e] rounded-xl border border-[#E8E8EF] dark:border-[#2a2d45] border-l-[3px] p-3.5 space-y-3
                 hover:shadow-md dark:hover:shadow-black/30 transition-all cursor-grab active:cursor-grabbing select-none
                 ${isDragging ? "opacity-40 scale-95 rotate-1 shadow-lg" : ""}`}
      style={{ borderLeftColor: col.accent }}
    >
      {/* Title + actions */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-semibold text-[#1E293B] dark:text-white leading-snug">{task.title}</p>
        <div className="flex gap-0.5 shrink-0">
          <button onClick={() => onEdit(task)} title="Edit task"
            className="w-6 h-6 flex items-center justify-center text-[#94A3B8] dark:text-slate-600 hover:text-[#6C5CE7] transition-colors">
            <Pencil size={13} />
          </button>
          <button onClick={() => { if (confirm("Delete this task?")) onDelete(task.id); }} title="Delete"
            className="w-6 h-6 flex items-center justify-center text-[#94A3B8] dark:text-slate-600 hover:text-red-500 transition-colors">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      {/* Priority + subtask badges */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border capitalize ${PRIORITY_STYLE[task.priority] ?? ""}`}>
          {task.priority.toLowerCase()}
        </span>
        {task.subtaskCount != null && task.subtaskCount > 0 && (
          <span className="text-[10px] text-[#94A3B8] dark:text-slate-500 bg-[#F1F5F9] dark:bg-[#252840] px-1.5 py-0.5 rounded border border-[#D1D5DB] dark:border-[#2a2d45]">
            {task.subtaskCount} subtask{task.subtaskCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* Assignees + due date */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {(task.assignees ?? []).slice(0, 3).map((a, i) => (
            <div key={a.id}
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-medium ring-[1.5px] ring-white dark:ring-[#1a1c2e]"
              style={{ backgroundColor: a.color, marginLeft: i > 0 ? "-4px" : "0" }}>
              {a.initials}
            </div>
          ))}
        </div>
        {task.dueDate && (
          <span className="flex items-center gap-1 text-[10px] text-[#94A3B8] dark:text-slate-500">
            <Calendar size={10} />
            {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        )}
      </div>

      {/* ── Status move buttons — colored per target column ── */}
      <div className="flex gap-1 flex-wrap">
        {COLUMNS.filter((c) => c.id !== task.status).map((c) => (
          <button
            key={c.id}
            onClick={() => onMove(task.id, c.id)}
            className="text-[9px] px-2 py-0.5 rounded border font-bold uppercase tracking-wide transition-all hover:opacity-80 hover:scale-105"
            style={{
              color: c.accent,
              borderColor: c.accent,
              backgroundColor: `${c.accent}18`, // ~10% opacity tint
            }}
          >
            → {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function TasksPage() {
  const searchParams = useSearchParams();
  const taskId = searchParams?.get("taskId");

  const [search, setSearch]           = useState("");
  const [showModal, setModal]         = useState(false);
  const [defaultStatus, setDefault]   = useState<TaskStatus | undefined>();
  const [editTask, setEditTask]       = useState<Task | null>(null);

  const dragTaskRef = useRef<Task | null>(null);
  const [dragOverCol, setDragOverCol] = useState<TaskStatus | null>(null);

  const { data: pageData, isLoading, isError, refetch } = useGetPersonalTasksQuery({ search });
  const tasks: Task[] = pageData?.content ?? [];
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  // taskId arrives here only for personal tasks — no longer auto-opens comments drawer
  const { data: fetchedTask, isSuccess: taskFetched } = useGetTaskQuery(taskId ?? "", {
    skip: !taskId,
  });

  useEffect(() => {
    if (!taskId || !taskFetched || !fetchedTask || editTask) return;
    // Could open edit modal from URL param if desired; left as-is for now
  }, [taskId, taskFetched, fetchedTask, editTask]);

  const handleMove   = (id: string, status: TaskStatus) => updateTask({ id, data: { status } });
  const handleDelete = (id: string) => deleteTask(id);
  const openModal    = (status?: TaskStatus) => { setDefault(status); setModal(true); };

  const handleDragOver = (e: React.DragEvent, colId: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverCol(colId);
  };

  const handleDrop = (e: React.DragEvent, colId: TaskStatus) => {
    e.preventDefault();
    const task = dragTaskRef.current ?? tasks.find((t) => t.id === e.dataTransfer.getData("taskId"));
    if (task && task.status !== colId) handleMove(task.id, colId);
    dragTaskRef.current = null;
    setDragOverCol(null);
  };

  const handleDragEnd = () => { dragTaskRef.current = null; setDragOverCol(null); };

  return (
    <>
      <DashboardHeader onRefresh={refetch} onCreate={() => openModal()} createLabel="Create" />

      {/* Search bar */}
      <div className="px-4 sm:px-6 py-3 bg-white dark:bg-[#1a1c2e] border-b border-[#E8E8EF] dark:border-[#2a2d45]">
        <div className="relative w-full max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] dark:text-slate-600" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks…"
            className="w-full h-9 pl-9 pr-3 rounded-md border border-[#D1D5DB] dark:border-[#2a2d45] text-sm bg-white dark:bg-[#252840] dark:text-white outline-none focus:border-[#6C5CE7] dark:focus:border-[#6C5CE7] transition-colors placeholder:text-[#94A3B8] dark:placeholder:text-slate-600" />
        </div>
      </div>

      {isError && (
        <div className="mx-4 sm:mx-6 mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-sm text-red-600 dark:text-red-400 flex items-center justify-between">
          Failed to load tasks.
          <button onClick={refetch} className="font-semibold underline">Retry</button>
        </div>
      )}

      {/* Kanban board */}
      <main className="flex-1 overflow-auto p-3 sm:p-4 md:p-6 bg-[#F1F5F9] dark:bg-[#1E1B2E]">
        <div className="flex gap-3 sm:gap-4 min-w-max h-full">
          {COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);
            const isOver   = dragOverCol === col.id;

            return (
              <div key={col.id}
                className="w-60 sm:w-72 flex flex-col gap-0"
                onDragOver={(e) => handleDragOver(e, col.id)}
                onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setDragOverCol(null); }}
                onDrop={(e) => handleDrop(e, col.id)}
              >
                {/* Column header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: col.dot }} />
                    <span className="text-xs font-bold text-[#1E293B] dark:text-white uppercase tracking-wide">{col.label}</span>
                    <span className="text-xs text-[#94A3B8] dark:text-slate-500 bg-white dark:bg-[#1e2035] border border-[#D1D5DB] dark:border-[#2a2d45] px-1.5 py-0.5 rounded-full font-semibold">
                      {colTasks.length}
                    </span>
                  </div>
                  <button onClick={() => openModal(col.id)}
                    className="w-6 h-6 flex items-center justify-center text-[#94A3B8] dark:text-slate-500 hover:text-[#64748B] hover:bg-white dark:hover:bg-[#1e2035] rounded transition-colors">
                    <Plus size={14} />
                  </button>
                </div>

                {/* Column body */}
                <div
                  className="flex-1 rounded-2xl p-2 flex flex-col gap-2 transition-all duration-150"
                  style={{
                    backgroundColor: isOver
                      ? `${col.accent}22`
                      : (typeof window !== "undefined" && document.documentElement.classList.contains("dark"))
                        ? col.darkBg
                        : col.bg,
                    outline: isOver ? `2px dashed ${col.accent}` : "2px dashed transparent",
                    outlineOffset: "-2px",
                  }}
                >
                  {isLoading
                    ? Array(2).fill(0).map((_, i) => (
                        <div key={i} className="animate-pulse bg-white dark:bg-[#1a1c2e] rounded-xl h-28 opacity-60" />
                      ))
                    : colTasks.map((task) => (
                        <TaskCard
                          key={task.id} task={task} col={col}
                          onMove={handleMove}
                          onDelete={handleDelete}
                          onEdit={setEditTask}
                          onDragStart={(t) => { dragTaskRef.current = t; }}
                          onDragEnd={handleDragEnd}
                        />
                      ))
                  }

                  {/* Empty state */}
                  {!isLoading && colTasks.length === 0 && (
                    <div className="border-2 border-dashed rounded-xl p-6 text-center text-xs font-semibold transition-colors"
                      style={{
                        borderColor: isOver ? col.accent : "rgba(0,0,0,0.08)",
                        color: isOver ? col.accent : "#94A3B8",
                      }}>
                      {isOver ? "Drop here" : "No tasks"}
                    </div>
                  )}

                  {/* Extra drop zone at bottom of non-empty columns */}
                  {!isLoading && colTasks.length > 0 && isOver && (
                    <div className="rounded-xl p-3 text-center text-xs font-semibold border-2 border-dashed"
                      style={{ borderColor: col.accent, color: col.accent }}>
                      Drop here
                    </div>
                  )}

                  {/* Add card button */}
                  <button onClick={() => openModal(col.id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm text-[#94A3B8] dark:text-slate-600 hover:bg-white dark:hover:bg-[#1a1c2e] hover:text-[#6C5CE7] transition-colors font-medium mt-auto">
                    <Plus size={13} /> Add a card
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {showModal && <NewTaskModal defaultStatus={defaultStatus} onClose={() => setModal(false)} />}
      {editTask && <EditTaskModal task={editTask} onClose={() => setEditTask(null)} />}
    </>
  );
}