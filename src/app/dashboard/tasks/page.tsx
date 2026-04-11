"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Plus, Search, Calendar, MoreHorizontal, RefreshCw,
  Trash2, MessageSquare, X, Send, Edit2, Check,
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
} from "@/lib/features/tasks/taskApi";
import type { Task, TaskStatus, Comment } from "@/lib/features/types/task-type";
import { createPersonalTaskSchema } from "@/lib/schemas";
import type { z } from "zod";

const PRIORITY_STYLE: Record<string, string> = {
  LOW:    "bg-slate-50  text-slate-600 border-slate-200",
  MEDIUM: "bg-orange-50 text-orange-600 border-orange-200",
  HIGH:   "bg-red-50    text-red-600   border-red-200",
  URGENT: "bg-red-100   text-red-800   border-red-300",
};

type ColDef = { id: TaskStatus; label: string; dot: string; bg: string; accent: string };
const COLUMNS: ColDef[] = [
  { id: "TODO",        label: "To Do",       dot: "#94A3B8", bg: "#F1F5F9", accent: "#94A3B8" },
  { id: "IN_PROGRESS", label: "In Progress", dot: "#6C5CE7", bg: "#F0EDFF", accent: "#6C5CE7" },
  { id: "IN_REVIEW",   label: "In Review",   dot: "#ff991f", bg: "#fff7e6", accent: "#ff991f" },
  { id: "DONE",        label: "Done",        dot: "#10B981", bg: "#e3fcef", accent: "#10B981" },
];

const AVATAR_PALETTE = [
  "#6C5CE7", "#10B981", "#ff5630", "#6554c0",
  "#ff991f", "#00b8d9", "#36b37e", "#EF4444",
];

function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

function getAvatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

/* ── New Task Modal ─────────────────────────────────────────────── */
type TaskForm = z.infer<typeof createPersonalTaskSchema>;

function NewTaskModal({ defaultStatus, onClose }: { defaultStatus?: TaskStatus; onClose: () => void }) {
  const [createTask, { isLoading }] = useCreatePersonalTaskMutation();
  const [form, setForm] = useState<TaskForm>({
    title: "", description: "", priority: "MEDIUM",
    dueDate: "", parentTaskId: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof TaskForm, string>>>({});
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError("");

    const result = createPersonalTaskSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof TaskForm, string>> = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as keyof TaskForm;
        if (!fieldErrors[k]) fieldErrors[k] = issue.message;
      }
      setErrors(fieldErrors);
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

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#F1F5F9]">
          <h2 className="text-base font-bold text-[#1E293B]">New Task</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-md flex items-center justify-center text-[#94A3B8] hover:bg-[#F1F5F9] transition-colors">
            <X size={15} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {apiError && (
            <p className="text-sm text-[#EF4444] bg-[#FEE2E2] border border-[#ffd5cc] p-3 rounded-lg">{apiError}</p>
          )}
          <div>
            <label className="block text-sm font-semibold text-[#64748B] mb-1.5">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="What needs to be done?"
              className={`w-full h-10 px-3 rounded-md border text-sm outline-none bg-white transition-colors ${errors.title ? "border-[#EF4444]" : "border-[#D1D5DB] focus:border-[#6C5CE7]"}`} />
            {errors.title && <p className="text-xs text-[#EF4444] mt-1">{errors.title}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#64748B] mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2} placeholder="Add more details…"
              className="w-full px-3 py-2.5 rounded-md border border-[#D1D5DB] text-sm outline-none focus:border-[#6C5CE7] bg-white resize-none transition-colors" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#64748B] mb-1.5">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as TaskForm["priority"] })}
                className="w-full h-10 px-3 rounded-md border border-[#D1D5DB] text-sm outline-none focus:border-[#6C5CE7] bg-white">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#64748B] mb-1.5">Due date</label>
              <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-[#D1D5DB] text-sm outline-none focus:border-[#6C5CE7] bg-white transition-colors" />
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 h-9 rounded-md border border-[#D1D5DB] text-sm font-semibold text-[#64748B] hover:bg-[#F1F5F9] transition-colors">Cancel</button>
            <button type="submit" disabled={isLoading} className="flex-1 h-9 rounded-md bg-[#6C5CE7] text-white text-sm font-semibold hover:bg-[#5B4BD5] transition-colors disabled:opacity-60">
              {isLoading ? "Creating…" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

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
      <div className="relative bg-white w-full max-w-sm flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8EF] shrink-0">
          <div>
            <p className="text-sm font-semibold text-[#1E293B] line-clamp-1">{task.title}</p>
            <p className="text-xs text-[#94A3B8]">{comments.length} comment{comments.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-md flex items-center justify-center text-[#94A3B8] hover:bg-[#F1F5F9]"><X size={15} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {isLoading && <p className="text-center text-xs text-[#94A3B8] py-8">Loading…</p>}
          {!isLoading && comments.length === 0 && <p className="text-center text-xs text-[#94A3B8] py-8">No comments yet.</p>}
          {comments.map((c) => {
            // FIX: API returns `author` (UserResponse), not `user`.
            // `color` and `initials` are not in the API — derive them.
            const authorName = c.author?.fullName ?? c.author?.username ?? "Unknown";
            const authorId   = c.author?.id ?? authorName;
            const initials   = getInitials(authorName);
            const color      = getAvatarColor(authorId);

            return (
              <div key={c.id} className="flex gap-3 group">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-medium shrink-0"
                  style={{ backgroundColor: color }}
                >
                  {initials}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold text-[#1E293B]">{authorName}</span>
                    <span className="text-[10px] text-[#94A3B8]">{timeAgo(c.createdAt)}</span>
                    <div className="ml-auto opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                      <button
                        onClick={() => { setEditId(c.id); setEditText(c.content); }}
                        className="text-[#94A3B8] hover:text-[#6C5CE7]"
                      >
                        <Edit2 size={11} />
                      </button>
                      <button
                        onClick={() => deleteComment({ taskId: task.id, commentId: c.id })}
                        className="text-[#94A3B8] hover:text-[#EF4444]"
                      >
                        <Trash2 size={11} />
                      </button>
                    </div>
                  </div>
                  {editId === c.id ? (
                    <div className="flex gap-1 mt-1">
                      <input
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 h-7 px-2 text-xs rounded border border-[#6C5CE7] outline-none"
                      />
                      <button onClick={() => saveEdit(c.id)} className="w-7 h-7 rounded bg-[#6C5CE7] text-white flex items-center justify-center">
                        <Check size={11} />
                      </button>
                      <button onClick={() => setEditId(null)} className="w-7 h-7 rounded border text-[#94A3B8] flex items-center justify-center">
                        <X size={11} />
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-[#64748B] mt-0.5 leading-relaxed">{c.content}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <div className="border-t border-[#E8E8EF] p-4 shrink-0">
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
              placeholder="Write a comment…"
              className="flex-1 h-9 px-3 rounded-md border border-[#D1D5DB] text-sm outline-none focus:border-[#6C5CE7] bg-white transition-colors"
            />
            <button
              onClick={submit}
              disabled={posting || !text.trim()}
              className="w-9 h-9 rounded-md bg-[#6C5CE7] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#5B4BD5] transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TaskCard({
  task, col, onMove, onDelete, onComment,
}: {
  task: Task; col: ColDef;
  onMove: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  onComment: (task: Task) => void;
}) {
  return (
    <div
      className="bg-white rounded-lg border border-[#E8E8EF] border-l-[3px] p-3.5 space-y-3 hover:shadow-md transition-all cursor-pointer group"
      style={{ borderLeftColor: col.accent }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-[#1E293B] leading-snug">{task.title}</p>
        <div className="flex gap-0.5">
          <button onClick={() => onComment(task)} title="Comments" className="w-6 h-6 flex items-center justify-center text-[#94A3B8] hover:text-[#6C5CE7]">
            <MessageSquare size={13} />
          </button>
          <button onClick={() => { if (confirm("Delete this task?")) onDelete(task.id); }} title="Delete" className="w-6 h-6 flex items-center justify-center text-[#94A3B8] hover:text-[#EF4444]">
            <Trash2 size={13} />
          </button>
          <button title="More" className="w-6 h-6 flex items-center justify-center text-[#94A3B8] hover:text-[#64748B]">
            <MoreHorizontal size={13} />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border capitalize ${PRIORITY_STYLE[task.priority] ?? ""}`}>
          {task.priority.toLowerCase()}
        </span>
        {task.subtaskCount != null && task.subtaskCount > 0 && (
          <span className="text-[10px] text-[#94A3B8] bg-[#F1F5F9] px-1.5 py-0.5 rounded border border-[#D1D5DB]">
            {task.subtaskCount} subtask{task.subtaskCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {(task.assignees ?? []).slice(0, 3).map((a, i) => (
            <div key={a.id}
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-medium ring-[1.5px] ring-white"
              style={{ backgroundColor: a.color, marginLeft: i > 0 ? "-4px" : "0" }}>
              {a.initials}
            </div>
          ))}
        </div>
        {task.dueDate && (
          <span className="flex items-center gap-1 text-[10px] text-[#94A3B8]">
            <Calendar size={10} />
            {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </span>
        )}
      </div>

      <div className="flex gap-1 flex-wrap">
        {COLUMNS.filter((c) => c.id !== task.status).map((c) => (
          <button key={c.id} onClick={() => onMove(task.id, c.id)}
            className="text-[9px] px-1.5 py-0.5 rounded border border-[#D1D5DB] text-[#94A3B8] hover:border-[#6C5CE7] hover:text-[#6C5CE7] transition-colors font-medium">
            → {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function TasksPage() {
  const searchParams = useSearchParams();
  const taskId = searchParams?.get("taskId");

  const [search, setSearch]           = useState("");
  const [showModal, setModal]         = useState(false);
  const [defaultStatus, setDefault]   = useState<TaskStatus | undefined>();
  const [commentTask, setCommentTask] = useState<Task | null>(null);

  const { data: pageData, isLoading, isError, refetch } = useGetPersonalTasksQuery({ search });
  const tasks: Task[] = pageData?.content ?? [];
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  useEffect(() => {
    if (!taskId || commentTask || isLoading) return;
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      setCommentTask(task);
    }
  }, [taskId, tasks, isLoading, commentTask]);

  const handleMove   = (id: string, status: TaskStatus) => updateTask({ id, data: { status } });
  const handleDelete = (id: string) => deleteTask(id);
  const openModal    = (status?: TaskStatus) => { setDefault(status); setModal(true); };

  return (
    <>
      <header className="h-16 bg-white border-b border-[#E8E8EF] flex items-center justify-between px-6 shrink-0">
        <h1 className="text-lg font-bold text-[#1E293B]">My Tasks</h1>
        <div className="flex items-center gap-2">
          <button onClick={() => refetch()} className="w-9 h-9 rounded-md border border-[#D1D5DB] flex items-center justify-center text-[#94A3B8] hover:bg-[#F1F5F9] transition-colors">
            <RefreshCw size={14} />
          </button>
          <button onClick={() => openModal()} className="flex items-center gap-2 h-9 px-4 rounded-md bg-[#6C5CE7] text-white text-sm font-semibold hover:bg-[#5B4BD5] transition-colors">
            <Plus size={15} /> New Task
          </button>
        </div>
      </header>

      <div className="px-6 py-3 bg-white border-b border-[#E8E8EF]">
        <div className="relative max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search tasks…"
            className="w-full h-9 pl-9 pr-3 rounded-md border border-[#D1D5DB] text-sm bg-white outline-none focus:border-[#6C5CE7] transition-colors placeholder:text-[#94A3B8]" />
        </div>
      </div>

      {isError && (
        <div className="mx-6 mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 flex items-center justify-between">
          Failed to load tasks. <button onClick={refetch} className="font-semibold underline">Retry</button>
        </div>
      )}

      <main className="flex-1 overflow-auto p-6 bg-[#F1F5F9]">
        <div className="flex gap-4 min-w-max h-full">
          {COLUMNS.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.id);
            return (
              <div key={col.id} className="w-68 flex flex-col gap-0">
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: col.dot }} />
                    <span className="text-xs font-bold text-[#1E293B] uppercase tracking-wide">{col.label}</span>
                    <span className="text-xs text-[#94A3B8] bg-white border border-[#D1D5DB] px-1.5 py-0.5 rounded-full font-semibold">{colTasks.length}</span>
                  </div>
                  <button onClick={() => openModal(col.id)} className="w-6 h-6 flex items-center justify-center text-[#94A3B8] hover:text-[#64748B] hover:bg-white rounded transition-colors">
                    <Plus size={14} />
                  </button>
                </div>

                <div className="flex-1 rounded-xl p-2 flex flex-col gap-2" style={{ backgroundColor: col.bg }}>
                  {isLoading
                    ? Array(2).fill(0).map((_, i) => <div key={i} className="animate-pulse bg-white rounded-lg h-28 opacity-60" />)
                    : colTasks.map((task) => (
                        <TaskCard key={task.id} task={task} col={col}
                          onMove={handleMove} onDelete={handleDelete} onComment={setCommentTask} />
                      ))
                  }
                  {!isLoading && colTasks.length === 0 && (
                    <div className="border-2 border-dashed border-black/10 rounded-lg p-6 text-center text-xs text-[#94A3B8] font-medium">No tasks</div>
                  )}
                  <button onClick={() => openModal(col.id)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-[#94A3B8] hover:bg-white hover:text-[#6C5CE7] transition-colors font-medium mt-auto">
                    <Plus size={13} /> Add a card
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {showModal && <NewTaskModal defaultStatus={defaultStatus} onClose={() => setModal(false)} />}
      {commentTask && <CommentsDrawer task={commentTask} onClose={() => setCommentTask(null)} />}
    </>
  );
}