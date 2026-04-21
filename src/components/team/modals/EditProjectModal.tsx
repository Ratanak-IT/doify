"use client";

import { useState } from "react";
import { toast } from "sonner";
import { X, Calendar, Palette } from "lucide-react";
import type { Project } from "@/lib/features/types/task-type";

type Props = {
  project: Project;
  onClose: () => void;
  onSave: (projectId: string, data: {
    name: string;
    description?: string;
    startDate?: string;
    dueDate?: string;
    color?: string;
  }) => void;
};

const predefinedColors = [
  "#6d28d9", "#7c3aed", "#2563eb", "#0ea5e9",
  "#10b981", "#14b8a6", "#f59e0b", "#ef4444",
  "#8b5cf6", "#ec4899"
];

export default function EditProjectModal({ project, onClose, onSave }: Props) {
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description || "");
  const [startDate, setStartDate] = useState(project.startDate || "");
  const [dueDate, setDueDate] = useState(project.dueDate || "");
  const [color, setColor] = useState(project.color || "#6d28d9");
  const [errors, setErrors] = useState<{ name?: string; startDate?: string; dueDate?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getDueDateError = (start: string, due: string): string | undefined => {
    if (!due) return "Due date is required";
    if (!start) return undefined;
    if (due === start) return "Due date cannot be the same as start date";
    if (new Date(due) < new Date(start)) return "Due date cannot be before start date";
    return undefined;
  };

  const handleStartDateChange = (value: string) => {
    setStartDate(value);
    setDueDate("");
    setErrors((prev) => ({ ...prev, startDate: undefined, dueDate: undefined }));
  };

  const handleDueDateChange = (value: string) => {
    setDueDate(value);
    const err = getDueDateError(startDate, value);
    setErrors((prev) => ({ ...prev, dueDate: err }));
  };

  // Min due date = day after startDate
  const minDueDate = startDate
    ? (() => {
        const d = new Date(startDate);
        d.setDate(d.getDate() + 1);
        return d.toISOString().split("T")[0];
      })()
    : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const fe: typeof errors = {};
    if (!name.trim()) fe.name = "Project name is required";
    if (!startDate) fe.startDate = "Start date is required";
    const dueDateErr = getDueDateError(startDate, dueDate);
    if (dueDateErr) fe.dueDate = dueDateErr;

    if (Object.keys(fe).length > 0) {
      setErrors(fe);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSave(project.id, {
        name: name.trim(),
        description: description.trim() || undefined,
        startDate: startDate || undefined,
        dueDate: dueDate || undefined,
        color,
      });
      toast.success("Project updated.");
      onClose();
    } catch (error: unknown) {
      console.error("Failed to update project:", error);
      toast.error("Failed to update project.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60]">
      <div className="bg-white dark:bg-slate-900 rounded-2xl w-full max-w-lg mx-4 overflow-hidden shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-5 border-b dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: color + "20", color: color }}
            >
              <Palette size={18} />
            </div>
            <h2 className="text-xl font-semibold">Edit Project</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => { setName(e.target.value); setErrors((p) => ({ ...p, name: undefined })); }}
              className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 focus:border-violet-500 outline-none text-sm ${errors.name ? "border-red-400" : "border-slate-200 dark:border-slate-700"}`}
              placeholder="Enter project name"
            />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:border-violet-500 outline-none text-sm resize-y min-h-[80px]"
              placeholder="Project description (optional)"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                <Calendar size={16} /> Start Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 focus:border-violet-500 outline-none text-sm ${errors.startDate ? "border-red-400" : "border-slate-200 dark:border-slate-700"}`}
              />
              {errors.startDate && <p className="text-xs text-red-500 mt-1">{errors.startDate}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-2">
                <Calendar size={16} /> Due Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={dueDate}
                min={minDueDate}
                onChange={(e) => handleDueDateChange(e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border bg-white dark:bg-slate-800 focus:border-violet-500 outline-none text-sm ${errors.dueDate ? "border-red-400" : "border-slate-200 dark:border-slate-700"}`}
              />
              {errors.dueDate && <p className="text-xs text-red-500 mt-1">{errors.dueDate}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Project Color</label>
            <div className="flex flex-wrap gap-3">
              {predefinedColors.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-9 h-9 rounded-2xl border-2 transition-all ${color === c ? "border-white scale-110 shadow-lg" : "border-transparent hover:scale-105"}`}
                  style={{ backgroundColor: c }}
                  aria-label={`Select color ${c}`}
                />
              ))}
            </div>
            <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
              <div className="w-4 h-4 rounded" style={{ backgroundColor: color }} />
              Selected: <span className="font-mono">{color}</span>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t dark:border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3.5 text-sm font-medium border border-slate-300 dark:border-slate-600 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-3.5 text-sm font-semibold bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white rounded-2xl transition-all active:scale-[0.985]"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}