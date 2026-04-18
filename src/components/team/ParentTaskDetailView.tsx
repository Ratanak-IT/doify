"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft, Calendar, Check, Edit2, MessageSquare,
  Plus, Search, Send, Trash2, RefreshCw, X,
} from "lucide-react";
import type { Task } from "@/lib/features/types/task-type";
import {
  useGetSubtasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetCommentsQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} from "@/lib/features/tasks/taskApi";
import CreateSubtaskModal from "./CreateSubtaskModal";

type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

type ColDef = {
  id: TaskStatus;
  label: string;
  dot: string;
  bg: string;
  darkBg: string;
  accent: string;
};

const COLUMNS: ColDef[] = [
  { id: "TODO",        label: "TO DO",       dot: "#97a0af", bg: "#F1F5F9", darkBg: "#1e293b", accent: "#97a0af" },
  { id: "IN_PROGRESS", label: "IN PROGRESS", dot: "#6C5CE7", bg: "#F0EDFF", darkBg: "#1e293b", accent: "#6C5CE7" },
  { id: "IN_REVIEW",   label: "IN REVIEW",   dot: "#ff991f", bg: "#fff7e6", darkBg: "#1e293b", accent: "#ff991f" },
  { id: "DONE",        label: "DONE",        dot: "#00875a", bg: "#e3fcef", darkBg: "#1e293b", accent: "#00875a" },
];

const PRIORITY_STYLE: Record<string, string> = {
  LOW:    "bg-slate-50  text-slate-600  border-slate-200  dark:bg-slate-700/40 dark:text-slate-400  dark:border-slate-600/50",
  MEDIUM: "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-700/40",
  HIGH:   "bg-red-50    text-red-600    border-red-200    dark:bg-red-900/20    dark:text-red-400    dark:border-red-700/40",
  URGENT: "bg-red-100   text-red-800    border-red-300    dark:bg-red-900/30    dark:text-red-300    dark:border-red-700/50",
};

/* ── Dark mode hook ─────────────────────────────────────────────── */
function useIsDark() {
  const [isDark, setIsDark] = useState(false);
  useEffect(() => {
    const el = document.documentElement;
    const sync = () => setIsDark(el.classList.contains("dark"));
    sync();
    const obs = new MutationObserver(sync);
    obs.observe(el, { attributes: true, attributeFilter: ["class"] });
    return () => obs.disconnect();
  }, []);
  return isDark;
}

/* ── Avatar helpers ─────────────────────────────────────────────── */
const AVATAR_PALETTE = ["#6C5CE7","#10B981","#ff5630","#6554c0","#ff991f","#00b8d9","#36b37e","#EF4444"];

function getInitials(name: string) {
  return name.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0].toUpperCase()).join("");
}
function getAvatarColor(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = seed.charCodeAt(i) + ((h << 5) - h);
  return AVATAR_PALETTE[Math.abs(h) % AVATAR_PALETTE.length];
}

/* ── Inline Edit Form ───────────────────────────────────────────── */
function InlineEditForm({ title, description, onSave, onCancel }: {
  title: string; description: string;
  onSave: (t: string, d: string) => void; onCancel: () => void;
}) {
  const [t, setT] = useState(title);
  const [d, setD] = useState(description);
  const save = () => { if (!t.trim()) return; onSave(t.trim(), d.trim()); };
  return (
    <div className="flex-1 space-y-1.5" onClick={(e) => e.stopPropagation()}>
      <input autoFocus value={t} onChange={(e) => setT(e.target.value)}
        onKeyDown={(e) => { if (e.key === "Enter") save(); if (e.key === "Escape") onCancel(); }}
        className="w-full h-7 px-2 text-sm rounded border border-blue-500 outline-none bg-white dark:bg-slate-700 dark:text-white" />
      <textarea value={d} onChange={(e) => setD(e.target.value)} placeholder="Description (optional)" rows={3}
        className="w-full px-2 py-1 text-xs rounded border border-slate-200 dark:border-slate-700 outline-none resize-none bg-white dark:bg-slate-700 dark:text-white focus:border-blue-400" />
      <div className="flex gap-1">
        <button onClick={save} className="flex items-center gap-1 px-2 py-0.5 rounded bg-blue-600 text-white text-[10px] font-semibold hover:bg-blue-700">
          <Check size={10} /> Save
        </button>
        <button onClick={onCancel} className="flex items-center gap-1 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-[10px] hover:bg-slate-100 dark:hover:bg-slate-700">
          <X size={10} /> Cancel
        </button>
      </div>
    </div>
  );
}

/* ── Comments Drawer ────────────────────────────────────────────── */
function CommentsDrawer({ task, onClose }: { task: Task; onClose: () => void }) {
  const { data: pageData, isLoading } = useGetCommentsQuery({ taskId: task.id });
  const comments = pageData?.content ?? [];
  const [addComment, { isLoading: posting }] = useAddCommentMutation();
  const [updateComment] = useUpdateCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const [text, setText] = useState("");
  const [editId, setEditId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isLoading && scrollRef.current)
      setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, 150);
  }, [isLoading, comments.length]);

  const submit = async () => {
    if (!text.trim()) return;
    await addComment({ taskId: task.id, content: text.trim() });
    setText("");
    setTimeout(() => { if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, 300);
  };
  const saveEdit = async (cid: string) => {
    if (!editText.trim()) return;
    await updateComment({ taskId: task.id, commentId: cid, content: editText.trim() });
    setEditId(null);
  };
  const timeAgo = (iso: string) => {
    const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    return m < 60 ? `${m}m ago` : `${Math.round(m / 60)}h ago`;
  };
  const getInitialsLocal = (n: string) => n.split(" ").filter(Boolean).slice(0, 2).map((s) => s[0].toUpperCase()).join("");
  const getColorLocal = (seed: string) => {
    const c = ["#6C5CE7","#00875a","#ff5630","#6554c0","#ff991f","#00b8d9","#36b37e","#EF4444"];
    let h = 0; for (let i = 0; i < seed.length; i++) h = seed.charCodeAt(i) + ((h << 5) - h);
    return c[Math.abs(h) % c.length];
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 dark:bg-black/50" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-sm flex flex-col shadow-2xl border-l border-slate-200 dark:border-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">{task.title}</p>
            <p className="text-xs text-slate-400">{comments.length} comment{comments.length !== 1 ? "s" : ""}</p>
          </div>
          <button onClick={onClose} className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">✕</button>
        </div>
        {/* List */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-3">
          {isLoading && <p className="text-center text-xs text-slate-400 py-8">Loading…</p>}
          {!isLoading && comments.length === 0 && <p className="text-center text-xs text-slate-400 py-8">No comments yet.</p>}
          {comments.map((c) => {
            const authorName = c.author?.fullName ?? c.author?.username ?? "Unknown";
            const authorId   = c.author?.id ?? authorName;
            return (
              <div key={c.id} className="flex gap-3 group">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-medium shrink-0 mt-0.5"
                  style={{ backgroundColor: getColorLocal(authorId) }}>
                  {getInitialsLocal(authorName)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{authorName}</span>
                    <span className="text-[10px] text-slate-400">{timeAgo(c.createdAt)}</span>
                    <div className="ml-auto flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditId(c.id); setEditText(c.content); }} className="text-slate-400 hover:text-blue-600"><Edit2 size={11} /></button>
                      <button onClick={() => { if (confirm("Delete?")) deleteComment({ taskId: task.id, commentId: c.id }); }} className="text-slate-400 hover:text-red-600"><Trash2 size={11} /></button>
                    </div>
                  </div>
                  {editId === c.id ? (
                    <div className="flex gap-1 mt-1">
                      <input value={editText} onChange={(e) => setEditText(e.target.value)}
                        className="flex-1 h-8 px-2 text-xs rounded-lg border border-blue-500 outline-none bg-white dark:bg-slate-800 dark:text-white" />
                      <button onClick={() => saveEdit(c.id)} className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center"><Check size={11} /></button>
                      <button onClick={() => setEditId(null)} className="w-7 h-7 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-400 flex items-center justify-center"><X size={11} /></button>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed break-words">{c.content}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        {/* Input */}
        <div className="border-t border-slate-200 dark:border-slate-800 p-4 shrink-0">
          <div className="flex gap-2">
            <input value={text} onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
              placeholder="Write a comment…"
              className="flex-1 h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-blue-500 bg-white dark:bg-slate-800 dark:text-white transition-colors" />
            <button onClick={submit} disabled={posting || !text.trim()}
              className="w-11 h-11 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors disabled:opacity-40">
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Subtask Card ───────────────────────────────────────────────── */
function SubtaskCard({ task, col, onMove, onDelete, onUpdate }: {
  task: Task; col: ColDef;
  onMove: (id: string, s: TaskStatus) => void;
  onDelete: (id: string) => void;
  onUpdate: (id: string, t: string, d: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [commentTask, setCommentTask] = useState<Task | null>(null);
  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 border-l-[3px] p-3.5 space-y-3 hover:shadow-md dark:hover:shadow-black/30 transition-all"
        style={{ borderLeftColor: col.accent }}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <div className="mt-1.5 w-4 h-4 flex items-center justify-center shrink-0">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-600" />
            </div>
            {editing ? (
              <InlineEditForm title={task.title} description={task.description ?? ""}
                onSave={(t, d) => { onUpdate(task.id, t, d); setEditing(false); }}
                onCancel={() => setEditing(false)} />
            ) : (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-900 dark:text-white leading-snug break-words">{task.title}</p>
                {task.description && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 line-clamp-2">{task.description}</p>}
              </div>
            )}
          </div>
          {!editing && (
            <div className="flex gap-0.5 shrink-0">
              <button onClick={() => setEditing(true)} className="w-6 h-6 flex items-center justify-center text-slate-400 dark:text-slate-600 hover:text-blue-600 transition-colors"><Edit2 size={12} /></button>
              <button onClick={() => setCommentTask(task)} className="w-6 h-6 flex items-center justify-center text-slate-400 dark:text-slate-600 hover:text-blue-600 transition-colors"><MessageSquare size={12} /></button>
              <button onClick={() => { if (confirm("Delete?")) onDelete(task.id); }} className="w-6 h-6 flex items-center justify-center text-slate-400 dark:text-slate-600 hover:text-red-500 transition-colors"><Trash2 size={12} /></button>
            </div>
          )}
        </div>
      {!editing && (
        <div className="space-y-2">
          <div className="flex gap-1 flex-wrap">
            {COLUMNS.filter((c) => c.id !== task.status).map((c) => (
              <button key={c.id} onClick={() => onMove(task.id, c.id)}
                className="text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wide transition-all hover:opacity-80 hover:scale-105"
                style={{ color: c.accent, borderColor: c.accent, backgroundColor: `${c.accent}18` }}>
                → {c.label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {task.priority && (
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border capitalize ${PRIORITY_STYLE[task.priority] ?? ""}`}>
                {task.priority.toLowerCase()}
              </span>
            )}
            {task.dueDate && (
              <span className="text-[10px] text-slate-400 dark:text-slate-500 flex items-center gap-1 ml-auto">
                <Calendar size={10} />
                {new Date(task.dueDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
              </span>
            )}
          </div>
        </div>
      )}
      </div>
      {commentTask && <CommentsDrawer task={commentTask} onClose={() => setCommentTask(null)} />}
    </>
  );
}

/* ── Main Component ─────────────────────────────────────────────── */
export default function ParentTaskDetailView({ task, onBack }: { task: Task; onBack: () => void }) {
  const [search, setSearch]          = useState("");
  const [showCreateSubtask, setShow] = useState(false);
  const isDark                       = useIsDark();

  const { data: subtasks = [], isLoading, refetch } = useGetSubtasksQuery(task.id);
  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const filteredSubtasks = useMemo(() => {
    if (!search.trim()) return subtasks;
    return subtasks.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));
  }, [subtasks, search]);

  const progress = subtasks.length > 0
    ? Math.round((subtasks.filter((t) => t.status === "DONE").length / subtasks.length) * 100)
    : 0;

  const handleMove   = (id: string, status: TaskStatus) => updateTask({ id, data: { status } });
  const handleUpdate = (id: string, title: string, desc: string) =>
    updateTask({ id, data: { title, description: desc || undefined } });
  const handleDeleteSubtask = (id: string) => deleteTask(id);
  const handleDeleteParent  = async () => {
    if (!confirm("Delete this parent task and all its subtasks?")) return;
    await deleteTask(task.id);
    onBack();
  };

  const avatarBg      = getAvatarColor(task.id ?? task.title);
  const avatarLetters = getInitials(task.title);

  return (
    <>
      <div className="flex flex-col h-full bg-[#F1F5F9] dark:bg-[#1E1B2E]">

        {/* ════════════════════════════════
            HERO BANNER
        ════════════════════════════════ */}
        <div
          className="relative shrink-0 w-full"
          style={{ background: "linear-gradient(135deg,#6C5CE7 0%,#9B8FFF 55%,#a78bfa 100%)" }}
        >
          {/* Blobs — overflow visible but pointer-events disabled */}
          <div className="absolute inset-0 pointer-events-none select-none">
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute top-0 left-1/2 w-32 h-32 rounded-full bg-white/5 blur-2xl" />
            <div className="absolute -bottom-6 right-1/3 w-24 h-24 rounded-full bg-white/10 blur-xl" />
          </div>

          {/* ── Main row ── */}
          <div className="relative z-10 px-4 sm:px-6 pt-5 pb-3">
            <div className="flex items-start gap-3 flex-wrap">

              {/* Back button */}
              <button onClick={onBack}
                className="shrink-0 mt-0.5 w-9 h-9 rounded-xl bg-white/20 hover:bg-white/35 active:bg-white/40 text-white flex items-center justify-center transition-colors">
                <ArrowLeft size={16} />
              </button>

              {/* ── Profile avatar (fully visible) ── */}
              <div className="shrink-0 relative">
                <div
                  className="w-12 h-12 rounded-full flex items-center justify-center text-white text-base font-extrabold shadow-xl"
                  style={{
                    backgroundColor: avatarBg,
                    boxShadow: `0 0 0 3px rgba(255,255,255,0.5), 0 4px 12px rgba(0,0,0,0.25)`,
                  }}
                >
                  {avatarLetters}
                </div>
                {/* Online dot */}
                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 rounded-full border-2 border-white" />
              </div>

              {/* Title + meta */}
              <div className="flex-1 min-w-0 pt-1">
                <h1 className="text-base sm:text-lg font-bold text-white leading-tight line-clamp-1">{task.title}</h1>
                {task.description && (
                  <p className="text-xs text-white/70 mt-0.5 line-clamp-1">{task.description}</p>
                )}
                <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                  <span className="text-[10px] text-white/60 font-medium">
                    {subtasks.length} subtask{subtasks.length !== 1 ? "s" : ""}
                  </span>
                  <span className="text-[10px] text-white/40">·</span>
                  <span className="text-[10px] text-white/80 font-bold">{progress}% complete</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-1.5 flex-wrap shrink-0 ml-auto pt-0.5">
                <button onClick={() => refetch()}
                  className="h-8 px-3 rounded-xl bg-white/15 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/20 backdrop-blur-sm">
                  <RefreshCw size={12} />
                  <span className="hidden sm:inline">Refresh</span>
                </button>
                <button onClick={() => setShow(true)}
                  className="h-8 px-3 rounded-xl bg-white text-[#6C5CE7] text-xs font-bold flex items-center gap-1.5 hover:bg-white/90 transition-colors shadow-lg">
                  <Plus size={13} />
                  <span className="hidden sm:inline">Add Subtask</span>
                  <span className="sm:hidden">Add</span>
                </button>
                <button onClick={handleDeleteParent}
                  className="h-8 px-3 rounded-xl bg-red-500/80 hover:bg-red-500 active:bg-red-600 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-red-400/30">
                  <Trash2 size={12} />
                  <span className="hidden sm:inline">Delete</span>
                </button>
              </div>
            </div>
          </div>

          {/* ── Progress bar ── */}
          <div className="relative z-10 px-4 sm:px-6 pb-5 pt-2">
            <div className="flex items-center justify-between text-[10px] text-white/70 mb-1.5 font-semibold">
              <span>Subtask Progress</span>
              <span className="text-white">{progress}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-700 ease-out shadow-[0_0_8px_rgba(255,255,255,0.5)]"
                style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        {/* ════════════════════════════════
            SEARCH
        ════════════════════════════════ */}
        <div className="px-4 sm:px-6 py-3 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <div className="relative max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-600 pointer-events-none" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search subtasks…"
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-700 dark:text-white outline-none focus:border-[#6C5CE7] dark:focus:border-[#6C5CE7] transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-600" />
          </div>
        </div>

        {/* ════════════════════════════════
            KANBAN BOARD
        ════════════════════════════════ */}
        <main className="flex-1 overflow-auto p-4 sm:p-5">
          <div className="flex gap-3 sm:gap-4 min-w-max h-full">
            {COLUMNS.map((col) => {
              const colTasks = filteredSubtasks.filter((t) => t.status === col.id);
              const colBg    = isDark ? col.darkBg : col.bg;

              return (
                <div key={col.id} className="w-[260px] sm:w-[280px] flex flex-col">

                  {/* Column header */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: col.dot }} />
                      <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider truncate">
                        {col.label}
                      </span>
                      {/* Count badge */}
                      <span className="shrink-0 min-w-[20px] h-5 px-1.5 flex items-center justify-center text-[10px] font-bold rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400">
                        {colTasks.length}
                      </span>
                    </div>
                    {/* Plus button — always visible with accent color */}
                    <button onClick={() => setShow(true)} title="Add subtask"
                      className="shrink-0 w-7 h-7 flex items-center justify-center rounded-lg font-bold transition-all hover:scale-110 active:scale-95"
                      style={{ color: col.accent, backgroundColor: `${col.accent}20` }}>
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Column body — JS-driven dark/light bg */}
                  <div className="flex-1 rounded-2xl p-2 flex flex-col gap-2 transition-colors duration-200"
                    style={{ backgroundColor: colBg }}>

                    {isLoading
                      ? Array.from({ length: 2 }).map((_, i) => (
                          <div key={i} className="animate-pulse rounded-xl h-28 opacity-60"
                            className="bg-white dark:bg-slate-700" />
                        ))
                      : colTasks.map((subtask) => (
                          <SubtaskCard key={subtask.id} task={subtask} col={col}
                            onMove={handleMove} onDelete={handleDeleteSubtask} onUpdate={handleUpdate} />
                        ))
                    }

                    {/* Empty state */}
                    {!isLoading && colTasks.length === 0 && (
                      <div className="border-2 border-dashed rounded-xl p-5 text-center text-xs font-medium"
                        style={{
                          borderColor: `${col.accent}40`,
                          color: isDark ? `${col.accent}90` : "#94A3B8",
                        }}>
                        No subtasks
                      </div>
                    )}

                    {/* Add card button */}
                    <button onClick={() => setShow(true)}
                      className="mt-auto flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-colors"
                      style={{ color: col.accent }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = `${col.accent}18`)}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}>
                      <Plus size={12} /> Add a card
                    </button>
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
          onClose={() => setShow(false)}
        />
      )}
    </>
  );
}