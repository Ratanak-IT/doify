"use client";

import { useState } from "react";
import { X, User } from "lucide-react";
import { useCreateProjectTaskMutation } from "@/lib/features/tasks/taskApi";
import { useGetTeamMembersQuery } from "@/lib/features/team/teamApi";
import { getAvatarColor, getInitials } from "@/lib/features/team/team.utils";
import type { TaskStatus } from "@/lib/features/types/task-type";

type Props = {
  projectId: string;
  teamId: string;
  defaultStatus?: TaskStatus;
  onClose: () => void;
};

export default function CreateProjectTaskModal({
  projectId,
  teamId,
  defaultStatus,
  onClose,
}: Props) {
  const [createProjectTask, { isLoading }] = useCreateProjectTaskMutation();
  const { data: membersPage } = useGetTeamMembersQuery({ teamId });
  const members = membersPage?.content ?? [];

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "MEDIUM",
    dueDate: "",
    assigneeId: "",
  });

  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");
    if (!form.title.trim()) return;

    try {
      await createProjectTask({
        projectId,
        title: form.title.trim(),
        description: form.description || undefined,
        priority: form.priority,
        dueDate: form.dueDate || undefined,
        assigneeId: form.assigneeId || undefined,
        ...(defaultStatus ? { status: defaultStatus } : {}),
      } as any).unwrap();
      onClose();
    } catch (err: unknown) {
      const e = err as { data?: { message?: string } };
      setApiError(e?.data?.message ?? "Failed to create task.");
    }
  };

  const selectedMember = members.find((m) => m.user.id === form.assigneeId);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-xl shadow-2xl w-full sm:max-w-md max-h-[92dvh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-200 dark:border-slate-800">
          <h2 className="text-base font-bold text-slate-900 dark:text-white">
            New Project Task
          </h2>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X size={15} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {apiError && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
              {apiError}
            </p>
          )}

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Title *
            </label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="Task title"
              className="w-full h-11 px-3 rounded-md border border-slate-200 dark:border-slate-700 text-sm outline-none bg-white dark:bg-slate-800 dark:text-white focus:border-blue-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Description
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Task details..."
              className="w-full px-3 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-blue-500 bg-white dark:bg-slate-800 dark:text-white resize-none"
            />
          </div>

          {/* Priority + Due date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Priority
              </label>
              <select
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
                className="w-full h-11 px-3 rounded-md border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-blue-500 bg-white dark:bg-slate-800 dark:text-white"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Due date
              </label>
              <input
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                className="w-full h-11 px-3 rounded-md border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-blue-500 bg-white dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* ✅ Assignee */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Assign to
            </label>
            <div className="relative">
              <select
                value={form.assigneeId}
                onChange={(e) => setForm({ ...form, assigneeId: e.target.value })}
                className="w-full h-11 pl-9 pr-3 rounded-md border border-slate-200 dark:border-slate-700 text-sm outline-none focus:border-blue-500 bg-white dark:bg-slate-800 dark:text-white appearance-none"
              >
                <option value="">— Unassigned —</option>
                {members.map((m) => (
                  <option key={m.user.id} value={m.user.id}>
                    {m.user.fullName || m.user.username}
                  </option>
                ))}
              </select>

              {/* Avatar preview */}
              <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                {selectedMember ? (
                  selectedMember.user.profilePhoto ? (
                    <img
                      src={selectedMember.user.profilePhoto}
                      className="w-5 h-5 rounded-full object-cover"
                      alt=""
                    />
                  ) : (
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
                      style={{ backgroundColor: getAvatarColor(selectedMember.user.id) }}
                    >
                      {getInitials(selectedMember.user.fullName || selectedMember.user.username)}
                    </div>
                  )
                ) : (
                  <User size={14} className="text-slate-400" />
                )}
              </div>
            </div>

            {/* Member list preview */}
            {members.length > 0 && (
              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                {members.slice(0, 6).map((m) => (
                  <button
                    key={m.user.id}
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        assigneeId: form.assigneeId === m.user.id ? "" : m.user.id,
                      })
                    }
                    title={m.user.fullName || m.user.username}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-bold ring-2 transition-all ${
                      form.assigneeId === m.user.id
                        ? "ring-blue-500 scale-110"
                        : "ring-white dark:ring-slate-900 opacity-70 hover:opacity-100"
                    }`}
                    style={{ backgroundColor: getAvatarColor(m.user.id) }}
                  >
                    {m.user.profilePhoto ? (
                      <img
                        src={m.user.profilePhoto}
                        className="w-full h-full rounded-full object-cover"
                        alt=""
                      />
                    ) : (
                      getInitials(m.user.fullName || m.user.username)
                    )}
                  </button>
                ))}
                {form.assigneeId && (
                  <button
                    type="button"
                    onClick={() => setForm({ ...form, assigneeId: "" })}
                    className="text-xs text-slate-400 hover:text-red-500 ml-1"
                  >
                    Clear
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !form.title.trim()}
              className="flex-1 h-12 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
            >
              {isLoading ? "Creating..." : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}