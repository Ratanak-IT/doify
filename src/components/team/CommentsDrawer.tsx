"use client";

import { useState } from "react";
import { Check, Edit2, Trash2, X, Send } from "lucide-react";
import {
  useGetCommentsQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} from "@/lib/features/tasks/taskApi";
import type { Task, Comment } from "@/lib/features/types/task-type";

function getInitials(fullName: string): string {
  return fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0].toUpperCase())
    .join("");
}

function getAvatarColor(seed: string): string {
  const AVATAR_PALETTE = [
    "#6C5CE7",
    "#00875a",
    "#ff5630",
    "#6554c0",
    "#ff991f",
    "#00b8d9",
    "#36b37e",
    "#EF4444",
  ];

  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_PALETTE[Math.abs(hash) % AVATAR_PALETTE.length];
}

export default function CommentsDrawer({
  task,
  onClose,
}: {
  task: Task;
  onClose: () => void;
}) {
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
    await updateComment({
      taskId: task.id,
      commentId,
      content: editText.trim(),
    });
    setEditId(null);
    setEditText("");
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText("");
  };

  const handleDelete = async (commentId: string) => {
    await deleteComment({ taskId: task.id, commentId });
  };

  const timeAgo = (iso: string) => {
    const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    return m < 60 ? `${m}m ago` : `${Math.round(m / 60)}h ago`;
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-sm flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#E8E8EF] dark:border-slate-800 shrink-0">
          <div>
            <p className="text-sm font-semibold text-[#1E293B] dark:text-white line-clamp-1">
              {task.title}
            </p>
            <p className="text-xs text-[#97a0af] dark:text-slate-400">
              {comments.length} comment{comments.length !== 1 ? "s" : ""}
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-[#97a0af] hover:bg-[#F1F5F9] dark:hover:bg-slate-800"
          >
            <X size={15} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {isLoading && (
            <p className="text-center text-xs text-[#97a0af] py-8">Loading…</p>
          )}

          {!isLoading && comments.length === 0 && (
            <p className="text-center text-xs text-[#97a0af] py-8">
              No comments yet.
            </p>
          )}

          {comments.map((c) => {
            const authorName = c.author?.fullName ?? c.author?.username ?? "Unknown";
            const authorId = c.author?.id ?? authorName;
            const initials = getInitials(authorName);
            const color = getAvatarColor(authorId);

            return (
              <div key={c.id} className="flex gap-3 group">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-medium shrink-0"
                  style={{ backgroundColor: color }}
                >
                  {initials}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold text-[#1E293B] dark:text-white">
                      {authorName}
                    </span>
                    <span className="text-[10px] text-[#97a0af] dark:text-slate-400">
                      {timeAgo(c.createdAt)}
                    </span>

                    <div className="ml-auto opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                      <button
                        onClick={() => {
                          setEditId(c.id);
                          setEditText(c.content);
                        }}
                        className="text-[#97a0af] hover:text-[#6C5CE7]"
                        title="Edit"
                      >
                        <Edit2 size={11} />
                      </button>

                      <button
                        onClick={() => handleDelete(c.id)}
                        className="text-[#97a0af] hover:text-[#EF4444]"
                        title="Delete"
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
                        className="flex-1 h-9 px-2 text-sm rounded-lg border border-[#6C5CE7] outline-none bg-white dark:bg-slate-800 dark:text-white"
                      />
                      <button
                        onClick={() => saveEdit(c.id)}
                        className="w-9 h-9 rounded-lg bg-[#6C5CE7] text-white flex items-center justify-center"
                      >
                        <Check size={11} />
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="w-9 h-9 rounded-lg border text-[#97a0af] flex items-center justify-center"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-[#64748B] dark:text-slate-300 mt-0.5 leading-relaxed break-words">
                      {c.content}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-[#E8E8EF] dark:border-slate-800 p-4 shrink-0">
          <div className="flex gap-2">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  submit();
                }
              }}
              placeholder="Write a comment…"
              className="flex-1 h-11 px-3 rounded-xl border border-[#D1D5DB] dark:border-slate-700 text-sm outline-none focus:border-[#6C5CE7] bg-white dark:bg-slate-800 dark:text-white transition-colors"
            />
            <button
              onClick={submit}
              disabled={posting || !text.trim()}
              className="w-9 h-12 rounded-xl bg-[#6C5CE7] text-white flex items-center justify-center disabled:opacity-40 hover:bg-[#5B4BD5] transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}