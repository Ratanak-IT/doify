"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  MoreHorizontal,
  Users,
  Calendar,
  TrendingUp,
  X,
  Trash2,
  Edit2,
  ArrowLeft,
} from "lucide-react";
import {
  useGetProjectsQuery,
  useGetProjectTasksQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "@/lib/features/tasks/taskApi";
import { useGetTeamsQuery } from "@/lib/features/team/teamApi";
import type { Project } from "@/lib/features/types/task-type";
import { createProjectSchema, updateProjectSchema } from "@/lib/schemas";
import type { z } from "zod";
import ProjectTasksPanel from "@/components/team/ProjectTasksPanel";
import DashboardHeader from "@/components/DashboardHeader";

const STATUS_STYLE: Record<string, string> = {
  in_progress:
    "bg-[#F0EDFF] text-[#6C5CE7] border-[#cce0ff] dark:bg-[#6C5CE7]/20 dark:text-[#a78bfa] dark:border-[#6C5CE7]/30",
  almost_done:
    "bg-[#D1FAE5] text-[#10B981] border-[#b3f5d5] dark:bg-[#10B981]/20 dark:text-[#34d399] dark:border-[#10B981]/30",
  planning:
    "bg-[#F1F5F9] text-[#64748B] border-[#D1D5DB] dark:bg-slate-700/40 dark:text-slate-400 dark:border-slate-600/40",
  active:
    "bg-[#F0EDFF] text-[#6C5CE7] border-[#cce0ff] dark:bg-[#6C5CE7]/20 dark:text-[#a78bfa] dark:border-[#6C5CE7]/30",
};

const STATUS_LABEL: Record<string, string> = {
  in_progress: "In Progress",
  almost_done: "Almost Done",
  planning: "Planning",
  active: "Active",
};

const PROJECT_COLORS = [
  "#6C5CE7",
  "#f6339a",
  "#ff6900",
  "#10B981",
  "#00a3bf",
  "#EF4444",
  "#2b7fff",
  "#9810fa",
];

function Skeleton() {
  return (
    <div className="animate-pulse bg-[#F1F5F9] dark:bg-[#1e2235] rounded-xl h-52" />
  );
}

type CreateForm = z.infer<typeof createProjectSchema>;

function NewProjectModal({ onClose }: { onClose: () => void }) {
  const [createProject, { isLoading }] = useCreateProjectMutation();
  const { data: teamsPage } = useGetTeamsQuery({});
  const teams = teamsPage?.content ?? [];

  const [form, setForm] = useState<CreateForm>({
    name: "",
    description: "",
    startDate: "",
    dueDate: "",
    color: "#6C5CE7",
    teamId: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateForm, string>>
  >({});
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError("");

    const result = createProjectSchema.safeParse(form);
    if (!result.success) {
      const fe: Partial<Record<keyof CreateForm, string>> = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as keyof CreateForm;
        if (!fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      return;
    }

    try {
      const payload: {
        name: string;
        color: string;
        description?: string;
        startDate?: string;
        dueDate?: string;
        teamId?: string;
      } = {
        name: result.data.name,
        color: result.data.color,
      };

      if (result.data.description) payload.description = result.data.description;
      if (result.data.startDate) payload.startDate = result.data.startDate;
      if (result.data.dueDate) payload.dueDate = result.data.dueDate;
      if (result.data.teamId) payload.teamId = result.data.teamId;
      await createProject(payload).unwrap();
      onClose();
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setApiError(e?.data?.message ?? "Failed to create project.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1a1c2e] rounded-xl shadow-2xl dark:shadow-black/40 w-full max-w-md border border-transparent dark:border-[#2a2d45]">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#F1F5F9] dark:border-[#2a2d45]">
          <h2 className="text-base font-bold text-[#1E293B] dark:text-white">
            New Project
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#94A3B8] dark:text-slate-500 hover:bg-[#F1F5F9] dark:hover:bg-[#252840] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {apiError && (
            <p className="text-sm text-[#EF4444] bg-[#FEE2E2] dark:bg-red-900/20 border border-[#ffd5cc] dark:border-red-800/40 p-3 rounded-lg">
              {apiError}
            </p>
          )}

          <div>
            <label className="block text-sm font-semibold text-[#64748B] dark:text-slate-400 mb-1.5">
              Project name *
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Website Redesign"
              className={`w-full h-10 px-3 rounded-md border text-sm outline-none bg-white dark:bg-[#252840] dark:text-white transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-600 ${
                errors.name
                  ? "border-[#EF4444] dark:border-red-700"
                  : "border-[#D1D5DB] dark:border-[#2a2d45] focus:border-[#6C5CE7] dark:focus:border-[#6C5CE7]"
              }`}
            />
            {errors.name && (
              <p className="text-xs text-[#EF4444] mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#64748B] dark:text-slate-400 mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              placeholder="What is this project about?"
              className="w-full px-3 py-2.5 rounded-md border border-[#D1D5DB] dark:border-[#2a2d45] text-sm outline-none focus:border-[#6C5CE7] dark:focus:border-[#6C5CE7] bg-white dark:bg-[#252840] dark:text-white resize-none transition-colors placeholder:text-slate-400 dark:placeholder:text-slate-600"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#64748B] dark:text-slate-400 mb-1.5">
                Start date
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-[#D1D5DB] dark:border-[#2a2d45] text-sm outline-none focus:border-[#6C5CE7] dark:focus:border-[#6C5CE7] bg-white dark:bg-[#252840] dark:text-white transition-colors"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#64748B] dark:text-slate-400 mb-1.5">
                Due date
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-[#D1D5DB] dark:border-[#2a2d45] text-sm outline-none focus:border-[#6C5CE7] dark:focus:border-[#6C5CE7] bg-white dark:bg-[#252840] dark:text-white transition-colors"
              />
            </div>
          </div>

          {teams.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-[#64748B] dark:text-slate-400 mb-1.5">
                Team
              </label>
              <select
                value={form.teamId}
                onChange={(e) => setForm({ ...form, teamId: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-[#D1D5DB] dark:border-[#2a2d45] text-sm outline-none focus:border-[#6C5CE7] dark:focus:border-[#6C5CE7] bg-white dark:bg-[#252840] dark:text-white appearance-none"
              >
                <option value="">No team</option>
                {teams.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-[#64748B] dark:text-slate-400 mb-2">
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, color: c })}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    form.color === c
                      ? "ring-2 ring-offset-2 dark:ring-offset-[#1a1c2e] ring-[#6C5CE7] scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-9 rounded-md border border-[#D1D5DB] dark:border-[#2a2d45] text-sm font-semibold text-[#64748B] dark:text-slate-400 hover:bg-[#F1F5F9] dark:hover:bg-[#252840] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-9 rounded-md bg-[#6C5CE7] hover:bg-[#5B4BD5] text-white text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {isLoading ? "Creating…" : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Edit Project Modal ─────────────────────────────────────────── */
type UpdateForm = z.infer<typeof updateProjectSchema>;

function EditProjectModal({
  project,
  onClose,
}: {
  project: Project;
  onClose: () => void;
}) {
  const [updateProject, { isLoading }] = useUpdateProjectMutation();

  const [form, setForm] = useState<UpdateForm>({
    name: project.name,
    description: project.description ?? "",
    dueDate: project.dueDate ?? "",
    color: project.color,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof UpdateForm, string>>
  >({});
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError("");

    const result = updateProjectSchema.safeParse(form);
    if (!result.success) {
      const fe: Partial<Record<keyof UpdateForm, string>> = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as keyof UpdateForm;
        if (!fe[k]) fe[k] = issue.message;
      }
      setErrors(fe);
      return;
    }

    try {
      await updateProject({ id: project.id, data: result.data }).unwrap();
      onClose();
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setApiError(e?.data?.message ?? "Failed to update project.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#1a1c2e] rounded-xl shadow-2xl dark:shadow-black/40 w-full max-w-md border border-transparent dark:border-[#2a2d45]">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#F1F5F9] dark:border-[#2a2d45]">
          <h2 className="text-base font-bold text-[#1E293B] dark:text-white">
            Edit Project
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#94A3B8] dark:text-slate-500 hover:bg-[#F1F5F9] dark:hover:bg-[#252840] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {apiError && (
            <p className="text-sm text-[#EF4444] bg-[#FEE2E2] dark:bg-red-900/20 border border-[#ffd5cc] dark:border-red-800/40 p-3 rounded-lg">
              {apiError}
            </p>
          )}

          <div>
            <label className="block text-sm font-semibold text-[#64748B] dark:text-slate-400 mb-1.5">
              Project name
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`w-full h-10 px-3 rounded-md border text-sm outline-none bg-white dark:bg-[#252840] dark:text-white transition-colors ${
                errors.name
                  ? "border-[#EF4444] dark:border-red-700"
                  : "border-[#D1D5DB] dark:border-[#2a2d45] focus:border-[#6C5CE7] dark:focus:border-[#6C5CE7]"
              }`}
            />
            {errors.name && (
              <p className="text-xs text-[#EF4444] mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#64748B] dark:text-slate-400 mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2.5 rounded-md border border-[#D1D5DB] dark:border-[#2a2d45] text-sm outline-none focus:border-[#6C5CE7] dark:focus:border-[#6C5CE7] bg-white dark:bg-[#252840] dark:text-white resize-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#64748B] dark:text-slate-400 mb-1.5">
              Due date
            </label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="w-full h-10 px-3 rounded-md border border-[#D1D5DB] dark:border-[#2a2d45] text-sm outline-none focus:border-[#6C5CE7] dark:focus:border-[#6C5CE7] bg-white dark:bg-[#252840] dark:text-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#64748B] dark:text-slate-400 mb-2">
              Color
            </label>
            <div className="flex gap-2 flex-wrap">
              {PROJECT_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, color: c })}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    form.color === c
                      ? "ring-2 ring-offset-2 dark:ring-offset-[#1a1c2e] ring-[#6C5CE7] scale-110"
                      : "hover:scale-105"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-9 rounded-md border border-[#D1D5DB] dark:border-[#2a2d45] text-sm font-semibold text-[#64748B] dark:text-slate-400 hover:bg-[#F1F5F9] dark:hover:bg-[#252840] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-9 rounded-md bg-[#6C5CE7] hover:bg-[#5B4BD5] text-white text-sm font-semibold transition-colors disabled:opacity-60"
            >
              {isLoading ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Project Card ───────────────────────────────────────────────── */
function ProjectCard({
  project,
  onEdit,
  onDelete,
  onSelect,
}: {
  project: Project;
  onEdit: (p: Project) => void;
  onDelete: (id: string) => void;
  onSelect: (p: Project) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const progress = Math.min(100, Math.max(0, project.progress ?? 0));
  const statusKey = project.status ?? "active";
  const { data: projectTasksPage } = useGetProjectTasksQuery({
    projectId: project.id,
    size: 100,
  });

  const parentTasks =
    projectTasksPage?.content.filter((task) => !task.parentTaskId) ?? [];
  const queryHasTasks = projectTasksPage?.content !== undefined;
  const parentTasksCount = queryHasTasks
    ? parentTasks.length
    : project.tasksCount ?? project.totalTasks ?? 0;
  const parentTasksDone = queryHasTasks
    ? parentTasks.filter((task) => task.status === "DONE").length
    : project.tasksDone ?? Math.round((progress / 100) * parentTasksCount);

  function formatDate(dateStr: string) {
    const months = [
      "Jan","Feb","Mar","Apr","May","Jun",
      "Jul","Aug","Sep","Oct","Nov","Dec",
    ];
    const d = new Date(dateStr);
    return `${months[d.getUTCMonth()]} ${d.getUTCDate()}`;
  }

  return (
    <div
      onClick={() => onSelect(project)}
      className="bg-white dark:bg-[#1a1c2e] rounded-xl border border-[#E8E8EF] dark:border-[#2a2d45] overflow-hidden hover:shadow-md dark:hover:shadow-black/30 hover:border-[#6C5CE7]/30 dark:hover:border-[#6C5CE7]/40 transition-all group cursor-pointer"
    >
      {/* Color top bar */}
      <div className="h-1.5" style={{ backgroundColor: project.color }} />

      <div className="p-5 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
              style={{ backgroundColor: project.color }}
            >
              {project.name[0].toUpperCase()}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#1E293B] dark:text-white leading-tight">
                {project.name}
              </h3>
              {project.description && (
                <p className="text-xs text-[#94A3B8] dark:text-slate-500 mt-0.5 line-clamp-1">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          {/* Kebab menu */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="w-7 h-7 flex items-center justify-center text-[#94A3B8] dark:text-slate-600 hover:bg-[#F1F5F9] dark:hover:bg-[#252840] rounded transition-all"
            >
              <MoreHorizontal size={14} />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-8 z-20 bg-white dark:bg-[#1e2035] rounded-lg shadow-lg dark:shadow-black/40 border border-[#E8E8EF] dark:border-[#2a2d45] py-1 min-w-[120px]">
                  <button
                    onClick={() => { onEdit(project); setMenuOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#64748B] dark:text-slate-400 hover:bg-[#F1F5F9] dark:hover:bg-[#252840]"
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                  <button
                    onClick={() => {
                      if (confirm("Delete this project?")) {
                        onDelete(project.id);
                        setMenuOpen(false);
                      }
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#EF4444] dark:text-red-400 hover:bg-[#FEE2E2] dark:hover:bg-red-900/20"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Status badge */}
        {project.status && (
          <span
            className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
              STATUS_STYLE[statusKey] ?? STATUS_STYLE.active
            }`}
          >
            {STATUS_LABEL[statusKey] ?? statusKey}
          </span>
        )}

        {/* Progress */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-[#94A3B8] dark:text-slate-500 py-1">
            <span>Progress</span>
            <span className="font-semibold text-[#64748B] dark:text-slate-400">
              {progress}%
            </span>
          </div>
          <div className="w-full bg-[#F1F5F9] dark:bg-[#252840] rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all"
              style={{ width: `${progress}%`, backgroundColor: project.color }}
            />
          </div>
        </div>

        {/* Footer meta */}
        <div className="flex items-center justify-between pt-1 text-xs text-[#94A3B8] dark:text-slate-500">
          <span className="flex items-center gap-1">
            <TrendingUp size={11} />
            {parentTasksDone}/{parentTasksCount} tasks
          </span>

          {project.members && project.members.length > 0 && (
            <span className="flex items-center gap-1">
              <Users size={11} /> {project.members.length}
            </span>
          )}

          {project.dueDate && (
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {formatDate(project.dueDate)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────── */
export default function ProjectsPage() {
  const [search, setSearch] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [editProject, setEdit] = useState<Project | null>(null);
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  const { data: pageData, isLoading, isError, refetch } = useGetProjectsQuery({});
  const projects: Project[] = pageData?.content ?? [];
  const [deleteProject] = useDeleteProjectMutation();

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  /* ── Active project view ── */
  if (activeProject) {
    return (
      <div className="flex flex-col h-full overflow-hidden bg-[#F8F9FC] dark:bg-[#1E1B2E]">
        <div className="h-16 bg-white dark:bg-[#1a1c2e] border-b border-[#E8E8EF] dark:border-[#2a2d45] flex items-center px-6 shrink-0">
          <button
            onClick={() => setActiveProject(null)}
            className="h-9 px-3 rounded-md border border-[#D1D5DB] dark:border-[#2a2d45] text-sm font-medium text-[#64748B] dark:text-slate-400 hover:bg-[#F1F5F9] dark:hover:bg-[#252840] transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={14} />
            Back
          </button>
          <div className="ml-4 min-w-0">
            <h1 className="text-lg font-bold text-[#1E293B] dark:text-white truncate">
              {activeProject.name}
            </h1>
            {activeProject.description && (
              <p className="text-xs text-[#94A3B8] dark:text-slate-500 truncate">
                {activeProject.description}
              </p>
            )}
          </div>
        </div>
        <ProjectTasksPanel project={activeProject} />
      </div>
    );
  }

  /* ── Projects grid ── */
  return (
    <div className="flex flex-col h-full bg-[#F8F9FC] dark:bg-[#1E1B2E]">
      {/* Header */}
      <DashboardHeader
        onRefresh={refetch}
        onCreate={() => setShowNew(true)}
        createLabel="New Project"
      />

      {/* Search bar */}
      <div className="px-6 py-3 bg-white dark:bg-[#1a1c2e] border-b border-[#E8E8EF] dark:border-[#2a2d45]">
        <div className="relative max-w-xs">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] dark:text-slate-600"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects…"
            className="w-full h-9 pl-9 pr-3 rounded-md border border-[#D1D5DB] dark:border-[#2a2d45] text-sm bg-white dark:bg-[#252840] dark:text-white outline-none focus:border-[#6C5CE7] dark:focus:border-[#6C5CE7] transition-colors placeholder:text-[#94A3B8] dark:placeholder:text-slate-600"
          />
        </div>
      </div>

      {/* Error banner */}
      {isError && (
        <div className="mx-6 mt-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-sm text-red-600 dark:text-red-400 flex items-center justify-between">
          Failed to load projects.
          <button onClick={refetch} className="font-semibold underline">
            Retry
          </button>
        </div>
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6).fill(0).map((_, i) => <Skeleton key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="w-12 h-12 rounded-xl bg-[#F0EDFF] dark:bg-[#6C5CE7]/20 flex items-center justify-center mb-3">
              <Plus size={22} className="text-[#6C5CE7]" />
            </div>
            <p className="text-[#64748B] dark:text-slate-400 font-semibold text-sm">
              No projects found
            </p>
            <p className="text-[#94A3B8] dark:text-slate-600 text-xs mt-1">
              Create a project to get started
            </p>
            <button
              onClick={() => setShowNew(true)}
              className="mt-4 flex items-center gap-2 h-9 px-4 rounded-md bg-[#6C5CE7] hover:bg-[#5B4BD5] text-white text-sm font-semibold transition-colors"
            >
              <Plus size={15} /> New Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <ProjectCard
                key={p.id}
                project={p}
                onEdit={setEdit}
                onDelete={(id) => deleteProject(id)}
                onSelect={setActiveProject}
              />
            ))}
          </div>
        )}
      </main>

      {showNew && <NewProjectModal onClose={() => setShowNew(false)} />}
      {editProject && (
        <EditProjectModal
          project={editProject}
          onClose={() => setEdit(null)}
        />
      )}
    </div>
  );
}