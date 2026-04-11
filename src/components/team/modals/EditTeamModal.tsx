"use client";

import { useState } from "react";
import type { Team } from "@/lib/features/types/task-type";
import { useUpdateTeamMutation } from "@/lib/features/team/teamApi";
import Modal from "./Modal";

type Props = {
  team: Team;
  onClose: () => void;
};

export default function EditTeamModal({ team, onClose }: Props) {
  const [updateTeam, { isLoading }] = useUpdateTeamMutation();
  const [form, setForm] = useState({
    name: team.name,
    description: team.description ?? "",
  });
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    try {
      await updateTeam({ id: team.id, data: form }).unwrap();
      onClose();
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setApiError(error?.data?.message ?? "Failed to update team.");
    }
  };

  return (
    <Modal title="Edit Team" onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {apiError && (
          <p className="text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 rounded-xl">{apiError}</p>
        )}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Team name</label>
          <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-violet-500 bg-white dark:bg-slate-800 dark:text-white transition-colors" />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
          <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-violet-500 bg-white dark:bg-slate-800 dark:text-white resize-none transition-colors" />
        </div>
        <div className="flex gap-3 pt-1 pb-1">
          <button type="button" onClick={onClose}
            className="flex-1 h-12 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 transition-colors">
            Cancel
          </button>
          <button type="submit" disabled={isLoading}
            className="flex-1 h-12 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 active:bg-violet-800 transition-colors disabled:opacity-60">
            {isLoading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </Modal>
  );
}