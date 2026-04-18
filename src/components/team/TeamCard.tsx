"use client";

import { useState } from "react";
import {
  ChevronRight,
  Edit2,
  MoreHorizontal,
  Trash2,
  Users,
} from "lucide-react";
import type { Team } from "@/lib/features/types/task-type";
import { useGetTeamMembersQuery } from "@/lib/features/team/teamApi";
import { TEAM_GRADIENTS, TEAM_ICON_BG } from "@/lib/features/team/team.constants";
import { getAvatarColor, getInitials } from "@/lib/features/team/team.utils";

type Props = {
  team: Team;
  idx: number;
  onSelect: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

export default function TeamCard({
  team,
  idx,
  onSelect,
  onEdit,
  onDelete,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const gradientCls = TEAM_GRADIENTS[idx % TEAM_GRADIENTS.length];
  const iconBgCls = TEAM_ICON_BG[idx % TEAM_ICON_BG.length];

  const { data: membersPage } = useGetTeamMembersQuery({ teamId: team.id });
  const members = (membersPage?.content ?? []).slice(0, 4);

  return (
    <div
      className="group relative bg-white dark:bg-[#1a1c2e] rounded-2xl border border-slate-200 dark:border-[#2a2d45] hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-lg hover:shadow-slate-200/60 dark:hover:shadow-slate-900/60 transition-all duration-200 cursor-pointer overflow-hidden"
      onClick={onSelect}
    >
      <div className={`h-1 w-full bg-gradient-to-r ${gradientCls}`} />

      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBgCls}`}
          >
            <Users size={18} />
          </div>

          <div className="relative ml-auto" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-[#252840] opacity-0 group-hover:opacity-100 transition-all"
            >
              <MoreHorizontal size={14} />
            </button>

            {menuOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setMenuOpen(false)}
                />
                <div className="absolute right-0 top-8 z-20 bg-white dark:bg-[#1a1c2e] rounded-xl shadow-xl border border-slate-200 dark:border-[#2a2d45] py-1 min-w-[140px]">
                  <button
                    onClick={() => {
                      onEdit();
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#252840]"
                  >
                    <Edit2 size={13} />
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Delete "${team.name}"?`)) onDelete();
                      setMenuOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    <Trash2 size={13} />
                    Delete
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        <h3 className="font-semibold text-slate-900 dark:text-white text-base leading-snug mb-1 truncate">
          {team.name}
        </h3>

        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 min-h-[2.5rem]">
          {team.description || (
            <span className="italic text-slate-300 dark:text-slate-600">
              No description
            </span>
          )}
        </p>

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 dark:border-[#2a2d45]">
          <div className="flex -space-x-2">
            {members.map((m) => {
              const name = m.user.fullName || m.user.username;
              return (
                <div
                  key={m.id}
                  className="w-7 h-7 rounded-full border-2 border-white dark:border-[#2a2d45] flex items-center justify-center text-white text-[10px] font-bold"
                  style={{ backgroundColor: getAvatarColor(m.user.id) }}
                  title={name}
                >
                  {getInitials(name)}
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Users size={12} />
            <span className="font-semibold text-slate-700 dark:text-slate-200">
              {team.memberCount}
            </span>
            member{team.memberCount !== 1 ? "s" : ""}
          </div>

          <div className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-[#252840] flex items-center justify-center text-slate-400 group-hover:bg-violet-100 dark:group-hover:bg-violet-900/30 group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
            <ChevronRight size={14} />
          </div>
        </div>
      </div>
    </div>
  );
}