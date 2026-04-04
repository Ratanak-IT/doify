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
  RefreshCw,
  Edit2,
  ArrowLeft,
} from "lucide-react";
import {
  useGetProjectsQuery,
  useCreateProjectMutation,
  useUpdateProjectMutation,
  useDeleteProjectMutation,
} from "@/lib/features/tasks/taskApi";
import { useGetTeamsQuery } from "@/lib/features/team/teamApi";
import type { Project } from "@/lib/features/types/task-type";
import { createProjectSchema, updateProjectSchema } from "@/lib/schemas";
import type { z } from "zod";
import ProjectTasksPanel from "@/components/team/ProjectTasksPanel";

/* ── Constants ──────────────────────────────────────────────────── */
const STATUS_STYLE: Record<string, string> = {
  in_progress: "bg-[#e9f2ff] text-[#0052cc] border-[#cce0ff]",
  almost_done: "bg-[#dcfff1] text-[#00875a] border-[#b3f5d5]",
  planning: "bg-[#f4f5f7] text-[#44526e]  border-[#dfe1e6]",
  active: "bg-[#e9f2ff] text-[#0052cc] border-[#cce0ff]",
};

const STATUS_LABEL: Record<string, string> = {
  in_progress: "In Progress",
  almost_done: "Almost Done",
  planning: "Planning",
  active: "Active",
};

const PROJECT_COLORS = [
  "#0052cc",
  "#5e4db2",
  "#f6339a",
  "#ff6900",
  "#00875a",
  "#00a3bf",
  "#de350b",
  "#2b7fff",
  "#9810fa",
];

function Skeleton() {
  return <div className="animate-pulse bg-[#f4f5f7] rounded-xl h-52" />;
}

/* ── New Project Modal ──────────────────────────────────────────── */
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
    color: "#0052cc",
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
      const payload: Record<string, string> = {
        name: result.data.name,
        color: result.data.color,
      };

      if (result.data.description) payload.description = result.data.description;
      if (result.data.startDate) payload.startDate = result.data.startDate;
      if (result.data.dueDate) payload.dueDate = result.data.dueDate;
      if (result.data.teamId) payload.teamId = result.data.teamId;

      await createProject(
        payload as Parameters<typeof createProject>[0]
      ).unwrap();

      onClose();
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setApiError(e?.data?.message ?? "Failed to create project.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#f4f5f7]">
          <h2 className="text-base font-bold text-[#172b4d]">New Project</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#97a0af] hover:bg-[#f4f5f7] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {apiError && (
            <p className="text-sm text-[#de350b] bg-[#ffeceb] border border-[#ffd5cc] p-3 rounded-lg">
              {apiError}
            </p>
          )}

          <div>
            <label className="block text-sm font-semibold text-[#44526e] mb-1.5">
              Project name *
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. Website Redesign"
              className={`w-full h-10 px-3 rounded-md border text-sm outline-none bg-white transition-colors ${
                errors.name
                  ? "border-[#de350b]"
                  : "border-[#dfe1e6] focus:border-[#0052cc]"
              }`}
            />
            {errors.name && (
              <p className="text-xs text-[#de350b] mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#44526e] mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={2}
              placeholder="What is this project about?"
              className="w-full px-3 py-2.5 rounded-md border border-[#dfe1e6] text-sm outline-none focus:border-[#0052cc] bg-white resize-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#44526e] mb-1.5">
                Start date
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-[#dfe1e6] text-sm outline-none focus:border-[#0052cc] bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#44526e] mb-1.5">
                Due date
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-[#dfe1e6] text-sm outline-none focus:border-[#0052cc] bg-white transition-colors"
              />
            </div>
          </div>

          {teams.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-[#44526e] mb-1.5">
                Team
              </label>
              <select
                value={form.teamId}
                onChange={(e) => setForm({ ...form, teamId: e.target.value })}
                className="w-full h-10 px-3 rounded-md border border-[#dfe1e6] text-sm outline-none focus:border-[#0052cc] bg-white appearance-none"
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
            <label className="block text-sm font-semibold text-[#44526e] mb-2">
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
                      ? "ring-2 ring-offset-2 ring-[#0052cc] scale-110"
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
              className="flex-1 h-9 rounded-md border border-[#dfe1e6] text-sm font-semibold text-[#44526e] hover:bg-[#f4f5f7] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-9 rounded-md bg-[#0052cc] text-white text-sm font-semibold hover:bg-[#0041a3] transition-colors disabled:opacity-60"
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
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-[#f4f5f7]">
          <h2 className="text-base font-bold text-[#172b4d]">Edit Project</h2>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-md flex items-center justify-center text-[#97a0af] hover:bg-[#f4f5f7] transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {apiError && (
            <p className="text-sm text-[#de350b] bg-[#ffeceb] border border-[#ffd5cc] p-3 rounded-lg">
              {apiError}
            </p>
          )}

          <div>
            <label className="block text-sm font-semibold text-[#44526e] mb-1.5">
              Project name
            </label>
            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className={`w-full h-10 px-3 rounded-md border text-sm outline-none bg-white transition-colors ${
                errors.name
                  ? "border-[#de350b]"
                  : "border-[#dfe1e6] focus:border-[#0052cc]"
              }`}
            />
            {errors.name && (
              <p className="text-xs text-[#de350b] mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#44526e] mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              rows={2}
              className="w-full px-3 py-2.5 rounded-md border border-[#dfe1e6] text-sm outline-none focus:border-[#0052cc] bg-white resize-none transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#44526e] mb-1.5">
              Due date
            </label>
            <input
              type="date"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              className="w-full h-10 px-3 rounded-md border border-[#dfe1e6] text-sm outline-none focus:border-[#0052cc] bg-white transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#44526e] mb-2">
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
                      ? "ring-2 ring-offset-2 ring-[#0052cc] scale-110"
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
              className="flex-1 h-9 rounded-md border border-[#dfe1e6] text-sm font-semibold text-[#44526e] hover:bg-[#f4f5f7] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-9 rounded-md bg-[#0052cc] text-white text-sm font-semibold hover:bg-[#0041a3] transition-colors disabled:opacity-60"
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

  return (
    <div
      onClick={() => onSelect(project)}
      className="bg-white rounded-xl border border-[#ebecf0] overflow-hidden hover:shadow-md transition-all group cursor-pointer"
    >
      <div className="h-2" style={{ backgroundColor: project.color }} />

      <div className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-md flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ backgroundColor: project.color }}
            >
              {project.name[0].toUpperCase()}
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#172b4d] leading-tight">
                {project.name}
              </h3>
              {project.description && (
                <p className="text-xs text-[#97a0af] mt-0.5 line-clamp-1">
                  {project.description}
                </p>
              )}
            </div>
          </div>

          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="w-7 h-7 flex items-center justify-center text-[#97a0af] hover:bg-[#f4f5f7] rounded opacity-0 group-hover:opacity-100 transition-all"
            >
              <MoreHorizontal size={14} />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-8 z-20 bg-white rounded-lg shadow-lg border border-[#ebecf0] py-1 min-w-[120px]">
                  <button
                    onClick={() => {
                      onEdit(project);
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#44526e] hover:bg-[#f4f5f7]"
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
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#de350b] hover:bg-[#ffeceb]"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {project.status && (
          <span
            className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
              STATUS_STYLE[statusKey] ?? STATUS_STYLE.active
            }`}
          >
            {STATUS_LABEL[statusKey] ?? statusKey}
          </span>
        )}

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-[#6b778c]">
            <span>Progress</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <div className="w-full bg-[#f4f5f7] rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full transition-all"
              style={{
                width: `${progress}%`,
                backgroundColor: project.color,
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-[#6b778c]">
          <span className="flex items-center gap-1">
            <TrendingUp size={11} /> {project.tasksDone ?? 0}/
            {project.tasksCount ?? 0} tasks
          </span>

          {project.members && project.members.length > 0 && (
            <span className="flex items-center gap-1">
              <Users size={11} /> {project.members.length}
            </span>
          )}

          {project.dueDate && (
            <span className="flex items-center gap-1">
              <Calendar size={11} />
              {new Date(project.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
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

  const { data: pageData, isLoading, isError, refetch } = useGetProjectsQuery(
    {}
  );
  const projects: Project[] = pageData?.content ?? [];
  const [deleteProject] = useDeleteProjectMutation();

  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (activeProject) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="h-16 bg-white border-b border-[#ebecf0] flex items-center px-6 shrink-0">
          <button
            onClick={() => setActiveProject(null)}
            className="h-9 px-3 rounded-md border border-[#dfe1e6] text-sm font-medium text-[#44526e] hover:bg-[#f4f5f7] transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={14} />
            Back
          </button>

          <div className="ml-4 min-w-0">
            <h1 className="text-lg font-bold text-[#172b4d] truncate">
              {activeProject.name}
            </h1>
            {activeProject.description && (
              <p className="text-xs text-[#97a0af] truncate">
                {activeProject.description}
              </p>
            )}
          </div>
        </div>

        <ProjectTasksPanel project={activeProject} />
      </div>
    );
  }

  return (
    <>
      <header className="h-16 bg-white border-b border-[#ebecf0] flex items-center justify-between px-6 shrink-0">
        <h1 className="text-lg font-bold text-[#172b4d]">Projects</h1>

        <div className="flex items-center gap-2">
          <button
            onClick={() => refetch()}
            className="w-9 h-9 rounded-md border border-[#dfe1e6] flex items-center justify-center text-[#6b778c] hover:bg-[#f4f5f7] transition-colors"
          >
            <RefreshCw size={14} />
          </button>

          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-2 h-9 px-4 rounded-md bg-[#0052cc] text-white text-sm font-semibold hover:bg-[#0041a3] transition-colors"
          >
            <Plus size={15} /> New Project
          </button>
        </div>
      </header>

      <div className="px-6 py-3 bg-white border-b border-[#ebecf0]">
        <div className="relative max-w-xs">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[#97a0af]"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search projects…"
            className="w-full h-9 pl-9 pr-3 rounded-md border border-[#dfe1e6] text-sm bg-white outline-none focus:border-[#0052cc] transition-colors placeholder:text-[#97a0af]"
          />
        </div>
      </div>

      {isError && (
        <div className="mx-6 mt-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 flex items-center justify-between">
          Failed to load projects.
          <button onClick={refetch} className="font-semibold underline">
            Retry
          </button>
        </div>
      )}

      <main className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array(6)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} />
              ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <p className="text-[#44526e] font-semibold text-sm">
              No projects found
            </p>
            <p className="text-[#97a0af] text-xs mt-1">
              Create a project to get started
            </p>
            <button
              onClick={() => setShowNew(true)}
              className="mt-4 flex items-center gap-2 h-9 px-4 rounded-md bg-[#0052cc] text-white text-sm font-semibold hover:bg-[#0041a3] transition-colors"
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
        <EditProjectModal project={editProject} onClose={() => setEdit(null)} />
      )}
    </>
  );
}