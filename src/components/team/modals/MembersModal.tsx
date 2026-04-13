"use client";

import { useState } from "react";
import { X, Trash2, Shield, Users } from "lucide-react";
import type { Team, TeamMember } from "@/lib/features/types/task-type";
import {
  useGetTeamMembersQuery,
  useUpdateMemberRoleMutation,
  useRemoveMemberMutation,
} from "@/lib/features/team/teamApi";
import { getAvatarColor, getInitials } from "@/lib/features/team/team.utils";

type Props = {
  team: Team;
  onClose: () => void;
};

const ROLES = ["MEMBER", "ADMIN", "OWNER"];

export default function MembersModal({ team, onClose }: Props) {
  const [editingMemberId, setEditingMemberId] = useState<string | null>(null);

  const { data: membersPage, isLoading } = useGetTeamMembersQuery({
    teamId: team.id,
  });
  const [updateMemberRole, { isLoading: isUpdating }] =
    useUpdateMemberRoleMutation();
  const [removeMember, { isLoading: isRemoving }] = useRemoveMemberMutation();

  const members = membersPage?.content ?? [];

  const handleRoleChange = async (member: TeamMember, newRole: string) => {
    await updateMemberRole({
      teamId: team.id,
      memberId: member.id,
      role: newRole,
    });
    setEditingMemberId(null);
  };

  const handleRemoveMember = async (member: TeamMember) => {
    if (
      confirm(
        `Remove ${member.user.fullName || member.user.username} from team?`
      )
    ) {
      await removeMember({
        teamId: team.id,
        userId: member.user.id,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white dark:bg-slate-900 rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-2xl sm:mx-4 max-h-[92dvh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-slate-700 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                Team Members
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {members.length} member{members.length !== 1 ? "s" : ""}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
          >
            <X size={18} />
          </button>
        </div>

        {/* Members List */}
        <div className="flex-1 overflow-y-auto p-4">
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse h-14 bg-slate-200 dark:bg-slate-800 rounded-lg"
                />
              ))}
            </div>
          ) : members.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-3">
                <Users size={20} className="text-slate-400" />
              </div>
              <p className="text-sm font-medium text-slate-900 dark:text-white">
                No members yet
              </p>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Invite team members to get started
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {members.map((member) => {
                const displayName =
                  member.user.fullName;
                  const username=member.user.username;
                const initials = getInitials(displayName);
                const avatarColor = getAvatarColor(member.user.id);

                return (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg dark:hover:bg-slate-800 transition-colors group"
                  >
                    {member.user.profilePhoto ? (
                      <img
                        src={member.user.profilePhoto}
                        alt={displayName}
                        className="w-10 h-10 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                        style={{ backgroundColor: avatarColor }}
                      >
                        {initials}
                      </div>
                    )}

                    {/* Member Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                        {displayName} & {username}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {member.user.email}
                      </p>
                    </div>

                    {/* Role & Actions */}
                    <div className="flex items-center gap-2 shrink-0 ml-auto">
                      {editingMemberId === member.id ? (
                        <select
                          value={member.role}
                          onChange={(e) =>
                            handleRoleChange(member, e.target.value)
                          }
                          disabled={isUpdating}
                          className="px-3 py-1.5 text-xs font-medium rounded-lg border border-blue-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white outline-none focus:border-blue-600"
                        >
                          {ROLES.map((role) => (
                            <option key={role} value={role}>
                              {role}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <button
                          onClick={() => setEditingMemberId(member.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                        >
                          <Shield size={13} />
                          {member.role}
                        </button>
                      )}

                      <button
                        onClick={() => handleRemoveMember(member)}
                        disabled={isRemoving}
                        className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Remove member"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
