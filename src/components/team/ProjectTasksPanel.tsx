"use client";

import { useMemo, useState } from "react";
import {
  Calendar,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Edit2,
  Check,
  X,
  Send,
} from "lucide-react";

import type { Project, Task } from "@/lib/features/types/task-type";
import {
  useGetProjectTasksQuery,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
  useGetCommentsQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} from "@/lib/features/tasks/taskApi";

type TaskStatus = "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";

type ColDef = {
  id: TaskStatus;
  label: string;
  dot: string;
  bg: string;
  accent: string;
};

const COLUMNS: ColDef[] = [
  {
    id: "TODO",
    label: "TO DO",
    dot: "#97a0af",
    bg: "#f4f5f7",
    accent: "#97a0af",
  },
  {
    id: "IN_PROGRESS",
    label: "IN PROGRESS",
    dot: "#0052cc",
    bg: "#e9f2ff",
    accent: "#0052cc",
  },
  {
    id: "IN_REVIEW",
    label: "IN REVIEW",
    dot: "#ff991f",
    bg: "#fff7e6",
    accent: "#ff991f",
  },
  {
    id: "DONE",
    label: "DONE",
    dot: "#00875a",
    bg: "#e3fcef",
    accent: "#00875a",
  },
];

const PRIORITY_STYLE: Record<string, string> = {
  LOW: "bg-slate-50 text-slate-600 border-slate-200",
  MEDIUM: "bg-orange-50 text-orange-600 border-orange-200",
  HIGH: "bg-red-50 text-red-600 border-red-200",
  URGENT: "bg-red-100 text-red-800 border-red-300",
};

function CommentsDrawer({
  task,
  onClose,
}: {
  task: Task;
  onClose: () => void;
}) {
  const { data: pageData, isLoading } = useGetCommentsQuery({
    taskId: task.id,
  });
  const comments = pageData?.content ?? [];
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
  };

  const timeAgo = (iso: string) => {
    const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    return m < 60 ? `${m}m ago` : `${Math.round(m / 60)}h ago`;
  };

  const getInitials = (fullName: string) =>
    fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join("");

  const getAvatarColor = (seed: string) => {
    const colors = [
      "#0052cc",
      "#00875a",
      "#ff5630",
      "#6554c0",
      "#ff991f",
      "#00b8d9",
      "#36b37e",
      "#de350b",
    ];
    let hash = 0;
    for (let i = 0; i < seed.length; i++) {
      hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-sm flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">
              {task.title}
            </p>
            <p className="text-xs text-slate-400">
              {comments.length} comment{comments.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {isLoading && (
            <p className="text-center text-xs text-slate-400 py-8">Loading…</p>
          )}

          {!isLoading && comments.length === 0 && (
            <p className="text-center text-xs text-slate-400 py-8">
              No comments yet.
            </p>
          )}

          {comments.map((c) => {
            const authorName =
              c.author?.fullName ?? c.author?.username ?? "Unknown";
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

                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {authorName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {timeAgo(c.createdAt)}
                    </span>

                    <div className="ml-auto opacity-0 group-hover:opacity-100 flex gap-1 transition-opacity">
                      <button
                        onClick={() => {
                          setEditId(c.id);
                          setEditText(c.content);
                        }}
                        className="text-slate-400 hover:text-blue-600"
                        title="Edit"
                      >
                        <Edit2 size={11} />
                      </button>

                      <button
                        onClick={() => {
                          if (confirm("Delete this comment?")) {
                            deleteComment({ taskId: task.id, commentId: c.id });
                          }
                        }}
                        className="text-slate-400 hover:text-red-600"
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
                        className="flex-1 h-8 px-2 text-xs rounded border border-blue-500 outline-none"
                      />
                      <button
                        onClick={() => saveEdit(c.id)}
                        className="w-7 h-7 rounded bg-blue-600 text-white flex items-center justify-center"
                      >
                        <Check size={11} />
                      </button>

                      <button
                        onClick={() => setEditId(null)}
                        className="w-7 h-7 rounded border text-slate-400 flex items-center justify-center"
                      >
                        <X size={11} />
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">
                      {c.content}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-slate-200 dark:border-slate-800 p-4 shrink-0">
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
              className="flex-1 h-9 px-3 rounded-md border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-blue-500 bg-white dark:bg-slate-800 dark:text-white"
            />
            <button
              onClick={submit}
              disabled={posting || !text.trim()}
              className="w-9 h-9 rounded-md bg-blue-600 text-white flex items-center justify-center disabled:opacity-40 hover:bg-blue-700 transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function TeamTaskCard({
  task,
  col,
  onMove,
  onDelete,
  onComment,
}: {
  task: Task;
  col: ColDef;
  onMove: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  onComment: (task: Task) => void;
}) {
  return (
    <div
      className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 border-l-[3px] p-3.5 space-y-3 hover:shadow-md transition-all group"
      style={{ borderLeftColor: col.accent }}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-slate-900 dark:text-white leading-snug">
          {task.title}
        </p>

        <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
          <button
            onClick={() => onComment(task)}
            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-blue-600"
          >
            <MessageSquare size={13} />
          </button>
          <button
            onClick={() => {
              if (confirm("Delete this task?")) onDelete(task.id);
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

        {task.commentsCount != null && task.commentsCount > 0 && (
          <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            {task.commentsCount} comment{task.commentsCount !== 1 ? "s" : ""}
          </span>
        )}

        {task.subtasksCount != null && task.subtasksCount > 0 && (
          <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            {task.subtasksCount} subtask{task.subtasksCount !== 1 ? "s" : ""}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {task.assignees?.slice(0, 3).map((a, i) => (
            <div
              key={a.id}
              className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[8px] font-medium ring-[1.5px] ring-white"
              style={{
                backgroundColor: a.color,
                marginLeft: i > 0 ? "-4px" : "0",
              }}
            >
              {a.initials}
            </div>
          ))}
        </div>

        {task.dueDate && (
          <span className="flex items-center gap-1 text-[10px] text-slate-400">
            <Calendar size={10} />
            {new Date(task.dueDate).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </span>
        )}
      </div>

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

export default function ProjectTasksPanel({ project }: { project: Project }) {
  const [search, setSearch] = useState("");
  const [commentTask, setCommentTask] = useState<Task | null>(null);

  const {
    data: tasksPage,
    isLoading,
    refetch,
  } = useGetProjectTasksQuery({
    projectId: project.id,
    size: 100,
  });

  const [updateTask] = useUpdateTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();

  const tasks: Task[] = tasksPage?.content ?? [];

  const filteredTasks = useMemo(() => {
    if (!search.trim()) return tasks;
    return tasks.filter((t) =>
      t.title.toLowerCase().includes(search.toLowerCase()),
    );
  }, [tasks, search]);

  const progress =
    project.progressPercent ??
    project.progress ??
    (tasks.length
      ? Math.round(
          (tasks.filter((t) => t.status === "DONE").length / tasks.length) *
            100,
        )
      : 0);

  const handleMove = (id: string, status: TaskStatus) => {
    updateTask({ id, data: { status } });
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
  };

  return (
    <>
      <div className="flex flex-col h-full bg-[#f4f5f7] dark:bg-slate-950">
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: project.color || "#6d28d9" }}
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">
              {project.name}
            </p>
            {project.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {project.description}
              </p>
            )}
          </div>
          <button
            onClick={() => refetch()}
            className="text-xs px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700"
          >
            Refresh
          </button>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">
            {progress}%
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
              placeholder="Search tasks..."
              className="w-full h-9 pl-9 pr-3 rounded-md border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 dark:text-white outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <main className="flex-1 overflow-auto p-5">
          <div className="flex gap-4 min-w-max h-full">
            {COLUMNS.map((col) => {
              const colTasks = filteredTasks.filter((t) => t.status === col.id);

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

                    <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white dark:hover:bg-slate-900 rounded transition-colors">
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
                      : colTasks.map((task) => (
                          <TeamTaskCard
                            key={task.id}
                            task={task}
                            col={col}
                            onMove={handleMove}
                            onDelete={handleDelete}
                            onComment={setCommentTask}
                          />
                        ))}

                    {!isLoading && colTasks.length === 0 && (
                      <div className="border-2 border-dashed border-black/10 rounded-lg p-6 text-center text-xs text-slate-400 font-medium">
                        No tasks
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {commentTask && (
        <CommentsDrawer
          task={commentTask}
          onClose={() => setCommentTask(null)}
        />
      )}
    </>
  );
}
