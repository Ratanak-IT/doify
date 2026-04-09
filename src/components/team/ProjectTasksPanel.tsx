"use client";
import CreateProjectTaskModal from "./CreateProjectTaskModal";
import EditProjectTaskModal from "./EditProjectTaskModal";
import { useMemo, useState } from "react";
import {
  MessageSquare,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Edit2,
  Check,
  X,
  Send,
  ChevronDown,
  ChevronRight,
  Settings,
} from "lucide-react";

import type { Project, Task } from "@/lib/features/types/task-type";
import {
  useGetProjectTasksQuery,
  useUpdateProjectTaskMutation,
  useDeleteTaskMutation,
  useGetCommentsQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useGetSubtasksQuery,
  useDeleteProjectMutation,
} from "@/lib/features/tasks/taskApi";
import ParentTaskDetailView from "./ParentTaskDetailView";
import UpdateProjectModal from "./modals/UpdateProjectModal";

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

// ─── Status Badge ─────────────────────────────────────────────────────────────

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

// ─── Inline Edit Form ─────────────────────────────────────────────────────────

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
        rows={2}
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

// ─── Subtask Row ──────────────────────────────────────────────────────────────

function SubtaskRow({
  subtask,
  col,
  projectId,
  onMove,
}: {
  subtask: Task;
  col: ColDef;
  projectId: string;
  onMove: (taskId: string, status: TaskStatus) => void;
}) {
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
      className="bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 border-l-[3px] p-3 space-y-2 group/subtask"
      style={{ borderLeftColor: col.accent }}
    >
      <div className="flex items-start gap-2">
        {editing ? (
          <InlineEditForm
            title={subtask.title}
            description={subtask.description ?? ""}
            onSave={handleSave}
            onCancel={() => setEditing(false)}
          />
        ) : (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 dark:text-white break-words">
                {subtask.title}
              </p>
              {subtask.description && (
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                  {subtask.description}
                </p>
              )}
            </div>
            <button
              onClick={() => setEditing(true)}
              className=" w-5 h-5 flex items-center justify-center text-slate-400 hover:text-blue-600 shrink-0"
              title="Edit subtask"
            >
              <Edit2 size={11} />
            </button>
          </>
        )}
      </div>

      {!editing && (
        <div className="flex items-center gap-1.5 flex-wrap">
          <span
            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border capitalize ${
              PRIORITY_STYLE[subtask.priority] ?? ""
            }`}
          >
            {subtask.priority?.toLowerCase()}
          </span>
          <StatusBadge
            status={subtask.status as TaskStatus}
            onCycle={(next) => onMove(subtask.id, next)}
          />
        </div>
      )}
    </div>
  );
}


function CommentsDrawer({ task, onClose }: { task: Task; onClose: () => void }) {
  const { data: pageData, isLoading } = useGetCommentsQuery({ taskId: task.id });
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
    await updateComment({ taskId: task.id, commentId, content: editText.trim() });
    setEditId(null);
  };

  const timeAgo = (iso: string) => {
    const m = Math.round((Date.now() - new Date(iso).getTime()) / 60000);
    return m < 60 ? `${m}m ago` : `${Math.round(m / 60)}h ago`;
  };

  const getInitials = (fullName: string) =>
    fullName.split(" ").filter(Boolean).slice(0, 2).map((n) => n[0].toUpperCase()).join("");

  const getAvatarColor = (seed: string) => {
    const colors = ["#6C5CE7","#00875a","#ff5630","#6554c0","#ff991f","#00b8d9","#36b37e","#EF4444"];
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = seed.charCodeAt(i) + ((hash << 5) - hash);
    return colors[Math.abs(hash) % colors.length];
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-sm flex flex-col shadow-2xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div>
            <p className="text-sm font-semibold text-slate-900 dark:text-white line-clamp-1">{task.title}</p>
            <p className="text-xs text-slate-400">{comments.length} comment{comments.length !== 1 ? "s" : ""}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {isLoading && <p className="text-center text-xs text-slate-400 py-8">Loading…</p>}
          {!isLoading && comments.length === 0 && (
            <p className="text-center text-xs text-slate-400 py-8">No comments yet.</p>
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
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">{authorName}</span>
                    <span className="text-[10px] text-slate-400">{timeAgo(c.createdAt)}</span>
                    <div className="ml-auto flex gap-1">
                      <button
                        onClick={() => { setEditId(c.id); setEditText(c.content); }}
                        className="text-slate-400 hover:text-blue-600"
                        title="Edit"
                      >
                        <Edit2 size={11} />
                      </button>
                      <button
                        onClick={() => { if (confirm("Delete this comment?")) deleteComment({ taskId: task.id, commentId: c.id }); }}
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
                    <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{c.content}</p>
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
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); submit(); } }}
              placeholder="Write a comment…"
              className="flex-1 h-9 px-3 rounded-md border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-blue-500 bg-white dark:bg-slate-800 dark:text-white"
            />
            <button
              onClick={submit}
              disabled={posting || !text.trim()}
              className="w-9 h-9 rounded-md bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors"
            >
              <Send size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Task Card ────────────────────────────────────────────────────────────────

function TeamTaskCard({
  task,
  col,
  projectId,
  onMove,
  onOpenTask,
  onDelete,
  onComment,
}: {
  task: Task;
  col: ColDef;
  projectId: string;
  onMove: (taskId: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  onComment: (task: Task) => void;
  onOpenTask: (task: Task) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const hasSubtasks = (task.subtaskCount ?? 0) > 0;

  const { data: subtasks = [], isLoading: subtasksLoading } = useGetSubtasksQuery(task.id, {
    skip: !expanded || !hasSubtasks,
  });

  const toggleExpand = () => {
    if (hasSubtasks) setExpanded((v) => !v);
  };

  return (
    <div
      className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 border-l-[3px] p-3.5 space-y-3 hover:shadow-md transition-all group"
      style={{ borderLeftColor: col.accent }}
    >
      {/* ── Header row ── */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {/* Chevron toggle */}
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); toggleExpand(); }}
            className="mt-0.5 w-5 h-5 rounded flex items-center justify-center shrink-0 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            {hasSubtasks ? (
              expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />
            ) : (
              <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            )}
          </button>

          {/* Title — opens detail view */}
          <button
            type="button"
            onClick={() => onOpenTask(task)}
            className="flex-1 min-w-0 text-left"
          >
            <p className="text-sm font-medium text-slate-900 dark:text-white leading-snug break-words">
              {task.title}
            </p>
            {task.description && (
              <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                {task.description}
              </p>
            )}
          </button>
        </div>

        {/* Action buttons */}
        <div className="flex gap-0.5 shrink-0">
          <button
            onClick={() => setShowEdit(true)}
            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-blue-600"
            title="Edit task"
          >
            <Edit2 size={13} />
          </button>
          <button
            onClick={() => onComment(task)}
            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-blue-600"
          >
            <MessageSquare size={13} />
          </button>
          <button
            onClick={() => { if (confirm("Delete this task?")) onDelete(task.id); }}
            className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-red-600"
          >
            <Trash2 size={13} />
          </button>
          <button className="w-6 h-6 flex items-center justify-center text-slate-400 hover:text-slate-600">
            <MoreHorizontal size={13} />
          </button>
        </div>
      </div>

      {/* ── Badges row ── */}
      <div className="items-center gap-1.5 flex-wrap mt-3">
        <StatusBadge
          status={task.status as TaskStatus}
          onCycle={(next) => onMove(task.id, next)}
        />
        {hasSubtasks && (
          <div className="flex justify-between mt-3">

          <span className="text-[10px] text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
            {task.subtaskCount ?? 0} subtask{(task.subtaskCount ?? 0) !== 1 ? "s" : ""}
          </span>
          <span
          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border capitalize ${
            PRIORITY_STYLE[task.priority] ?? ""
          }`}
        >
          {task.priority?.toLowerCase()}
        </span>
          </div>

        )}
      </div>

      {/* ── Subtasks ── */}
      {expanded && (
        <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
          <div className="pl-7 space-y-2">
            {subtasksLoading ? (
              <>
                <div className="animate-pulse bg-slate-100 dark:bg-slate-800 rounded-lg h-16" />
                <div className="animate-pulse bg-slate-100 dark:bg-slate-800 rounded-lg h-16" />
              </>
            ) : subtasks.length === 0 ? (
              <div className="text-xs text-slate-400 py-2">No subtasks</div>
            ) : (
              subtasks.map((subtask: Task) => (
                <SubtaskRow
                  key={subtask.id}
                  subtask={subtask}
                  col={col}
                  projectId={projectId}
                  onMove={onMove}
                />
              ))
            )}
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEdit && (
        <EditProjectTaskModal
          task={task}
          projectId={projectId}
          onClose={() => setShowEdit(false)}
        />
      )}
    </div>
  );
}


export default function ProjectTasksPanel({ project }: { project: Project }) {
  const [search, setSearch] = useState("");
  const [commentTask, setCommentTask] = useState<Task | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showUpdateProject, setShowUpdateProject] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus | undefined>();
  const [activeParentTask, setActiveParentTask] = useState<Task | null>(null);

  const openCreateModal = (status?: TaskStatus) => {
    setDefaultStatus(status);
    setShowCreate(true);
  };

  const { data: tasksPage, isLoading, refetch } = useGetProjectTasksQuery({
    projectId: project.id,
    size: 100,
  });

  const [updateProjectTask] = useUpdateProjectTaskMutation();
  const [deleteTask] = useDeleteTaskMutation();
  const [deleteProject] = useDeleteProjectMutation();

  const allTasks: Task[] = tasksPage?.content ?? [];
  const tasks = allTasks.filter((t) => !t.parentTaskId);

  const filteredTasks = useMemo(() => {
    if (!search.trim()) return tasks;
    return tasks.filter((t) => t.title.toLowerCase().includes(search.toLowerCase()));
  }, [tasks, search]);

  const progress =
    project.progress ??
    (tasks.length
      ? Math.round((tasks.filter((t) => t.status === "DONE").length / tasks.length) * 100)
      : 0);

  const handleMove = (taskId: string, status: TaskStatus) => {
    updateProjectTask({ projectId: project.id, taskId, data: { status } });
  };

  const handleDelete = (id: string) => {
    deleteTask(id);
  };

  if (activeParentTask) {
    return (
      <ParentTaskDetailView
        task={activeParentTask}
        onBack={() => setActiveParentTask(null)}
      />
    );
  }

  return (
    <>
      <div className="flex flex-col h-full bg-[#F1F5F9] dark:bg-slate-950">
        {/* ── Project header ── */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: project.color || "#6d28d9" }} />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 dark:text-white truncate">{project.name}</p>
            {project.description && (
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{project.description}</p>
            )}
          </div>
          <button
            onClick={() => setShowUpdateProject(true)}
            className="text-xs px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5"
          >
            <Settings size={14} />
            Edit
          </button>
          <button
            onClick={() => { if (confirm("Delete this project?")) deleteProject(project.id); }}
            className="text-xs px-3 py-1.5 rounded-md border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-1.5"
          >
            <Trash2 size={14} />
            Delete
          </button>
          <button
            onClick={() => refetch()}
            className="text-xs px-3 py-1.5 rounded-md border border-slate-200 dark:border-slate-700"
          >
            Refresh
          </button>
          <div className="text-xs font-medium text-slate-500 dark:text-slate-400 shrink-0">{progress}%</div>
        </div>

        {/* ── Progress bar ── */}
        <div className="h-1 bg-slate-200 dark:bg-slate-800">
          <div className="h-full bg-violet-500 transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        {/* ── Search bar ── */}
        <div className="px-5 py-3 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
          <div className="relative max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="w-full h-9 pl-9 pr-3 rounded-md border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 dark:text-white outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* ── Kanban columns ── */}
        <main className="flex-1 overflow-auto p-5">
          <div className="flex gap-4 min-w-max h-full">
            {COLUMNS.map((col) => {
              const colTasks = filteredTasks.filter((t) => t.status === col.id);
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
                      onClick={() => openCreateModal(col.id)}
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
                          <div key={i} className="animate-pulse bg-white rounded-lg h-28 opacity-60" />
                        ))
                      : colTasks.map((task) => (
                          <TeamTaskCard
                            key={task.id}
                            task={task}
                            col={col}
                            projectId={project.id}
                            onMove={handleMove}
                            onDelete={handleDelete}
                            onComment={setCommentTask}
                            onOpenTask={setActiveParentTask}
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
        <CommentsDrawer task={commentTask} onClose={() => setCommentTask(null)} />
      )}
      {showCreate && (
        <CreateProjectTaskModal
          projectId={project.id}
          defaultStatus={defaultStatus}
          onClose={() => setShowCreate(false)}
        />
      )}
      {showUpdateProject && (
        <UpdateProjectModal
          project={project}
          onClose={() => setShowUpdateProject(false)}
        />
      )}
    </>
  );
}