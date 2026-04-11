"use client";

import { useState } from "react";
import { useCreateTeamMutation } from "@/lib/features/team/teamApi";
import Modal from "./Modal";

type Props = {
  onClose: () => void;
};

export default function CreateTeamModal({ onClose }: Props) {
  const [createTeam, { isLoading }] = useCreateTeamMutation();
  const [form, setForm] = useState({ name: "", description: "" });
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setApiError("");

    if (!form.name.trim()) {
      setErrors({ name: "Team name is required" });
      return;
    }

    try {
      await createTeam({
        name: form.name.trim(),
        description: form.description,
      }).unwrap();
      onClose();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setApiError(error?.data?.message ?? "Failed to create team.");
    }
  };

  return (
    <Modal title="Create Team" onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {apiError && (
          <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-xl">
            {apiError}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Team name *</label>
          <input
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Design Team"
            className={`w-full h-11 px-3 rounded-xl border text-sm outline-none bg-white dark:bg-slate-800 dark:text-white transition-colors ${
              errors.name ? "border-red-400" : "border-slate-200 dark:border-slate-700 focus:border-violet-500"
            }`}
          />
          {errors.name && <p className="text-xs text-red-600 mt-1">{errors.name}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            placeholder="What does this team work on?"
            className="w-full px-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-violet-500 bg-white dark:bg-slate-800 dark:text-white resize-none transition-colors"
          />
        </div>

        <div className="flex gap-3 pt-1 pb-1">
          <button type="button" onClick={onClose}
            className="flex-1 h-12 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isLoading}
            className="flex-1 h-12 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 active:bg-violet-800 transition-colors disabled:opacity-60">
            {isLoading ? "Creating..." : "Create Team"}
          </button>
        </div>
      </form>
    </Modal>
  );
}