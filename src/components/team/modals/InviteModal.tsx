"use client";

import { useState } from "react";
import { useInviteMemberMutation } from "@/lib/features/team/teamApi";
import Modal from "./Modal";

type Props = {
  teamId: string;
  onClose: () => void;
};

export default function InviteModal({ teamId, onClose }: Props) {
  const [inviteMember, { isLoading }] = useInviteMemberMutation();
  const [form, setForm] = useState({
    email: "",
    role: "MEMBER" as "MEMBER" | "ADMIN",
  });
  const [msg, setMsg] = useState<{ text: string; ok: boolean } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim()) return;

    try {
      await inviteMember({
        teamId,
        email: form.email,
        role: form.role,
      }).unwrap();

      setMsg({ text: "Invitation sent!", ok: true });
      setTimeout(onClose, 1500);
    } catch (err: unknown) {
      const error = err as { data?: { message?: string } };
      setMsg({
        text: error?.data?.message ?? "Failed to send invitation",
        ok: false,
      });
    }
  };

  return (
    <Modal title="Invite Member" onClose={onClose}>
      <form onSubmit={handleSubmit} className="p-5 space-y-4">
        {msg && (
          <p
            className={`text-sm p-3 rounded-xl border ${
              msg.ok
                ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
                : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600"
            }`}
          >
            {msg.text}
          </p>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Email address *
          </label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="teammate@company.com"
            className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-violet-500 bg-white dark:bg-slate-800 dark:text-white transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
            Role
          </label>
          <select
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value as "MEMBER" | "ADMIN" })
            }
            className="w-full h-11 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-violet-500 bg-white dark:bg-slate-800 dark:text-white appearance-none"
          >
            <option value="MEMBER">Member</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 h-12 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 h-12 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors disabled:opacity-60"
          >
            {isLoading ? "Sending..." : "Send Invite"}
          </button>
        </div>
      </form>
    </Modal>
  );
}