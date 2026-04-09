"use client";

import { useState } from "react";
import { X, Pencil, Loader } from "lucide-react";
import type { Project } from "@/lib/features/types/task-type";
import { useUpdateProjectMutation } from "@/lib/features/tasks/taskApi";

type Props = {
  project: Project;
  onClose: () => void;
};

const COLORS = [
  "#6d28d9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#3b82f6",
  "#ec4899",
  "#8b5cf6",
];

export default function UpdateProjectModal({ project, onClose }: Props) {
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description || "",
    color: project.color || "#6d28d9",
    dueDate: project.dueDate ? project.dueDate.slice(0, 10) : "",
  });

  const [updateProject, { isLoading }] = useUpdateProjectMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    await updateProject({
      id: project.id,
      data: {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        color: formData.color,
        dueDate: formData.dueDate || undefined,
      },
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
              <Pencil
                className="text-violet-600 dark:text-violet-400"
                size={18}
              />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Update Project
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Project Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              placeholder="e.g. E-commerce Platform"
              className="w-full h-12 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-base focus:border-violet-500 outline-none transition-all"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="What is this project about?"
              rows={3}
              className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm resize-y min-h-[90px] focus:border-violet-500 outline-none"
            />
          </div> 

          
          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className="w-full h-12 px-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm focus:border-violet-500 outline-none"
            />
          </div>

          {/* Color Picker */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
              Color
            </label>
            <div className="flex gap-3 flex-wrap">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFormData({ ...formData, color: c })}
                  className={`w-9 h-9 rounded-2xl border-4 transition-all duration-200 ${
                    formData.color === c
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
              disabled={isLoading || !formData.name.trim()}
              className="flex-1 h-12 rounded-2xl bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-semibold flex items-center justify-center gap-2 transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
