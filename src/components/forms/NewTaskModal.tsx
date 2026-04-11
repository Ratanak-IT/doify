"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useGetProjectsQuery, useCreatePersonalTaskMutation, useCreateProjectTaskMutation } from "@/lib/features/tasks/taskApi";
import { createPersonalTaskSchema } from "@/lib/schemas";
import type { z } from "zod";

interface Props {
  onClose: () => void;
}

type Form = z.infer<typeof createPersonalTaskSchema> & { projectId?: string };

export function NewTaskModal({ onClose }: Props) {
  const { data: projectsPage } = useGetProjectsQuery({});
  const projects = projectsPage?.content ?? [];

  const [createPersonal, { isLoading: personalLoading }] = useCreatePersonalTaskMutation();
  const [createProject,  { isLoading: projectLoading  }] = useCreateProjectTaskMutation();
  const isLoading = personalLoading || projectLoading;

  const [form, setForm] = useState<Form>({
    title: "", description: "", priority: "MEDIUM", dueDate: "", projectId: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Form, string>>>({});
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); setApiError("");

    const result = createPersonalTaskSchema.safeParse(form);
    if (!result.success) {
      const fe: Partial<Record<keyof Form, string>> = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as keyof Form;
        if (!fe[k]) fe[k] = issue.message;
      }
      setErrors(fe); return;
    }

    try {
      if (form.projectId) {
        await createProject({
          projectId: form.projectId,
          title: result.data.title,
          description: result.data.description,
          priority: result.data.priority,
          dueDate: result.data.dueDate,
        }).unwrap();
      } else {
        await createPersonal({
          title: result.data.title,
          description: result.data.description,
          priority: result.data.priority,
          dueDate: result.data.dueDate,
        }).unwrap();
      }
      onClose();
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setApiError(e?.data?.message ?? "Failed to create task.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-md max-h-[92dvh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-[#F1F5F9] dark:border-slate-700 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <h2 className="text-base font-bold text-[#1E293B] dark:text-white">New Task</h2>
          <button onClick={onClose} className="w-9 h-12 rounded-xl flex items-center justify-center text-[#94A3B8] hover:bg-[#F1F5F9] dark:hover:bg-slate-800 transition-colors" aria-label="Close"><X size={16} /></button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {apiError && (
            <p className="text-sm text-[#EF4444] bg-[#ffeceb] border border-[#ffd5cc] p-3 rounded-lg">{apiError}</p>
          )}

          <div>
            <label className="block text-sm font-semibold text-[#64748B] dark:text-slate-400 mb-1.5">Title *</label>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="What needs to be done?"
              className={`w-full h-11 px-3 rounded-xl border text-sm outline-none bg-white dark:bg-slate-800 dark:text-white transition-colors ${errors.title ? "border-[#EF4444]" : "border-[#D1D5DB] dark:border-slate-600 focus:border-[#6C5CE7]"}`} />
            {errors.title && <p className="text-xs text-[#EF4444] mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#64748B] dark:text-slate-400 mb-1.5">Description</label>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3} placeholder="Add more details…"
              className="w-full px-3 py-3 rounded-xl border border-[#D1D5DB] dark:border-slate-600 text-sm outline-none focus:border-[#6C5CE7] bg-white dark:bg-slate-800 dark:text-white resize-none transition-colors" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-[#64748B] dark:text-slate-400 mb-1.5">Priority</label>
              <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value as Form["priority"] })}
                className="w-full h-11 px-3 rounded-xl border border-[#D1D5DB] dark:border-slate-600 text-sm outline-none focus:border-[#6C5CE7] bg-white dark:bg-slate-800 dark:text-white">
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#64748B] dark:text-slate-400 mb-1.5">Due date</label>
              <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full h-11 px-3 rounded-xl border border-[#D1D5DB] dark:border-slate-600 text-sm outline-none focus:border-[#6C5CE7] bg-white dark:bg-slate-800 dark:text-white transition-colors" />
            </div>
          </div>

          {projects.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-[#64748B] dark:text-slate-400 mb-1.5">Project (optional)</label>
              <select value={form.projectId} onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                className="w-full h-11 px-3 rounded-xl border border-[#D1D5DB] dark:border-slate-600 text-sm outline-none focus:border-[#6C5CE7] bg-white dark:bg-slate-800 dark:text-white appearance-none">
                <option value="">Personal task</option>
                {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
          )}

          <div className="flex gap-3 pt-1 pb-1">
            <button type="button" onClick={onClose} className="flex-1 h-12 rounded-xl border border-[#D1D5DB] dark:border-slate-600 text-sm font-semibold text-[#64748B] dark:text-slate-300 hover:bg-[#F1F5F9] dark:hover:bg-slate-800 active:bg-[#E2E8F0] transition-colors">Cancel</button>
            <button type="submit" disabled={isLoading} className="flex-1 h-12 rounded-xl bg-[#6C5CE7] text-white text-sm font-semibold hover:bg-[#5B4BD5] active:bg-[#4a3cc7] transition-colors disabled:opacity-60">
              {isLoading ? "Creating…" : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
