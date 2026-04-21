"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";
import { useCreateProjectMutation } from "@/lib/features/tasks/taskApi";

type Props = {
  defaultTeamId?: string;
  onClose: () => void;
};

const CreateProjectModal = ({ defaultTeamId, onClose }: Props) => {
  const [createProject, { isLoading }] = useCreateProjectMutation();

  const [form, setForm] = useState({
    name: "",
    description: "",
    teamId: defaultTeamId || "",
    startDate: "",
    dueDate: "",
    color: "#6d28d9",
  });

  const [errors, setErrors] = useState<{
    name?: string;
    teamId?: string;
    startDate?: string;
    dueDate?: string;
  }>({});
  const [apiError, setApiError] = useState("");

  // Due date is invalid if: not set, same as start, or before start
  const getDueDateError = (start: string, due: string): string | undefined => {
    if (!due) return "Due date is required";
    if (!start) return undefined;
    if (due === start) return "Due date cannot be the same as start date";
    if (new Date(due) < new Date(start)) return "Due date cannot be before start date";
    return undefined;
  };

  const handleStartDateChange = (value: string) => {
    setForm((prev) => ({ ...prev, startDate: value, dueDate: "" }));
    setErrors((prev) => ({ ...prev, startDate: undefined, dueDate: undefined }));
  };

  const handleDueDateChange = (value: string) => {
    setForm((prev) => ({ ...prev, dueDate: value }));
    const err = getDueDateError(form.startDate, value);
    setErrors((prev) => ({ ...prev, dueDate: err }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    const fe: typeof errors = {};
    if (!form.name.trim()) fe.name = "Project name is required";
    if (!form.teamId) fe.teamId = "Team is required";
    if (!form.startDate) fe.startDate = "Start date is required";
    const dueDateErr = getDueDateError(form.startDate, form.dueDate);
    if (dueDateErr) fe.dueDate = dueDateErr;

    if (Object.keys(fe).length > 0) {
      setErrors(fe);
      return;
    }

    try {
      await createProject({
        name: form.name.trim(),
        description: form.description.trim() || undefined,
        teamId: form.teamId,
        startDate: form.startDate || undefined,
        dueDate: form.dueDate || undefined,
        color: form.color,
      }).unwrap();

      toast.success("Project created.");
      onClose();
    } catch (err: any) {
      const message = err?.data?.message || err?.message || "Failed to create project";
      setApiError(message);
      toast.error(message);
    }
  };

  // Min due date = day after startDate
  const minDueDate = form.startDate
    ? (() => {
        const d = new Date(form.startDate);
        d.setDate(d.getDate() + 1);
        return d.toISOString().split("T")[0];
      })()
    : undefined;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
              <Plus className="text-violet-600 dark:text-violet-400" size={22} />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">New Project</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-12 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {apiError && (
            <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 text-sm">
              {apiError}
            </div>
          )}

          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => { setForm({ ...form, name: e.target.value }); setErrors((p) => ({ ...p, name: undefined })); }}
              placeholder="e.g. E-commerce Platform"
              className={`w-full h-12 px-4 rounded-2xl border bg-white dark:bg-slate-800 text-base focus:border-violet-500 outline-none transition-all ${errors.name ? "border-red-400" : "border-slate-200 dark:border-slate-700"}`}
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              placeholder="What is this project about?"
              rows={3}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm resize-y min-h-[90px] focus:border-violet-500 outline-none"
            />
          </div>

          {/* Team */}
          {!defaultTeamId && (
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Team <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.teamId}
                onChange={(e) => { setForm({ ...form, teamId: e.target.value }); setErrors((p) => ({ ...p, teamId: undefined })); }}
                placeholder="Enter Team ID"
                className={`w-full h-12 px-4 rounded-2xl border bg-white dark:bg-slate-800 text-sm focus:border-violet-500 outline-none ${errors.teamId ? "border-red-400" : "border-slate-200 dark:border-slate-700"}`}
              />
              {errors.teamId && <p className="text-xs text-red-500 mt-1">{errors.teamId}</p>}
            </div>
          )}

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className={`w-full h-12 px-4 rounded-2xl border bg-white dark:bg-slate-800 text-sm focus:border-violet-500 outline-none ${errors.startDate ? "border-red-400" : "border-slate-200 dark:border-slate-700"}`}
              />
              {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={form.dueDate}
                min={minDueDate}
                onChange={(e) => handleDueDateChange(e.target.value)}
                className={`w-full h-12 px-4 rounded-2xl border bg-white dark:bg-slate-800 text-sm focus:border-violet-500 outline-none ${errors.dueDate ? "border-red-400" : "border-slate-200 dark:border-slate-700"}`}
              />
              {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>}
            </div>
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Color</label>
            <div className="flex gap-3 flex-wrap">
              {["#6d28d9", "#10b981", "#f59e0b", "#ef4444", "#3b82f6", "#ec4899", "#8b5cf6"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setForm({ ...form, color: c })}
                  className={`w-9 h-9 rounded-2xl border-4 transition-all duration-200 ${
                    form.color === c
                      ? "border-white shadow-xl scale-110"
                      : "border-transparent hover:scale-110"
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-6">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-2xl border border-slate-200 dark:border-slate-700 font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 h-12 rounded-2xl bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {isLoading ? "Creating Project..." : "Create Project"}
              {!isLoading && <Plus size={18} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;