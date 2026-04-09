"use client";

import { useState } from "react";
import {
  ArrowLeft,
  FolderKanban,
  UserPlus,
  Users,
  Search,
  Plus,
} from "lucide-react";

import type { Project, Team } from "@/lib/features/types/task-type";
import { useGetTeamMembersQuery } from "@/lib/features/team/teamApi";
import { useGetProjectsByTeamQuery } from "@/lib/features/tasks/taskApi";
import {
  TEAM_GRADIENTS,
  TEAM_ICON_BG,
} from "@/lib/features/team/team.constants";
import {
  getAvatarColor,
  getInitials,
} from "@/lib/features/team/team.utils";

import InviteModal from "./modals/InviteModal";
import MembersModal from "./modals/MembersModal";
import ProjectTasksPanel from "./ProjectTasksPanel";

import CreateProjectModal from "../team/modals/CreateProjectModal"; 

type Props = {
  team: Team;
  idx: number;
  onBack: () => void;
};

export default function TeamDetailView({ team, idx, onBack }: Props) {
  const [showInvite, setShowInvite] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectSearch, setProjectSearch] = useState("");

  const gradientCls = TEAM_GRADIENTS[idx % TEAM_GRADIENTS.length];
  const iconBgCls = TEAM_ICON_BG[idx % TEAM_ICON_BG.length];

  const { data: projectsPage, isLoading: projectsLoading } =
    useGetProjectsByTeamQuery({ teamId: team.id });

  const projects = projectsPage?.content ?? [];

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const { data: membersPage } = useGetTeamMembersQuery({ teamId: team.id });
  const members = membersPage?.content ?? [];

  return (
    <div className="flex flex-col h-full">
      {/* Header with gradient */}
      <div className={`bg-gradient-to-r ${gradientCls} px-6 pt-6 pb-5`}>
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1 min-w-0">
            <button
              onClick={onBack}
              className="mt-0.5 w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors shrink-0"
            >
              <ArrowLeft size={15} />
            </button>

            <div className="flex-1 min-w-0">
              <p className="text-white/70 text-xs font-medium mb-0.5">Team</p>
              <h2 className="text-white text-xl font-bold truncate">{team.name}</h2>
              {team.description && (
                <p className="text-white/80 text-sm mt-1 line-clamp-2">
                  {team.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowInvite(true)}
              className="flex items-center gap-1.5 px-3 h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-colors"
            >
              <UserPlus size={14} />
              Invite
            </button>

            <button
              onClick={() => setShowMembers(true)}
              className="flex items-center gap-1.5 px-3 h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-colors"
            >
              <Users size={14} />
              Members
            </button>

            {/* New Project Button - Clean & Consistent Style */}
            <button
              onClick={() => setShowCreateProject(true)}
              className="flex items-center gap-1.5 px-4 h-9 rounded-xl bg-white text-slate-900 hover:bg-white/90 font-semibold text-sm transition-all active:scale-[0.98]"
            >
              <Plus size={15} />
              New Project
            </button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 mt-6">
          <div className="flex items-center gap-1.5 text-white/90 text-sm">
            <Users size={14} />
            <span className="font-semibold">{team.memberCount}</span>
            <span className="text-white/60 text-xs">members</span>
          </div>

          <div className="flex items-center gap-1.5 text-white/90 text-sm">
            <FolderKanban size={14} />
            <span className="font-semibold">{projects.length}</span>
            <span className="text-white/60 text-xs">projects</span>
          </div>

          <div className="flex -space-x-2 ml-auto">
            {members.slice(0, 5).map((m) => {
              const name = m.user.fullName || m.user.username;
              return m.user.profilePhoto ? (
                <img
                  key={m.id}
                  src={m.user.profilePhoto}
                  alt={name}
                  className="w-7 h-7 rounded-full border-2 border-white cursor-pointer hover:scale-110 transition-transform object-cover"
                  title={name}
                  onClick={() => setShowMembers(true)}
                />
              ) : (
                <div
                  key={m.id}
                  className="w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[10px] font-bold cursor-pointer hover:scale-110 transition-transform"
                  style={{ backgroundColor: getAvatarColor(m.user.id) }}
                  title={name}
                  onClick={() => setShowMembers(true)}
                >
                  {getInitials(name)}
                </div>
              );
            })}

            {members.length > 5 && (
              <div
                className="w-7 h-7 rounded-full border-2 border-white bg-white/30 flex items-center justify-center text-white text-[10px] font-bold cursor-pointer hover:scale-110 transition-transform"
                onClick={() => setShowMembers(true)}
              >
                +{members.length - 5}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Projects Sidebar */}
        <div className="w-56 shrink-0 border-r border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50 overflow-auto">
          <div className="px-4 pt-4 pb-2">
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Projects
            </p>
          </div>

          <div className="px-3 mb-3">
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                value={projectSearch}
                onChange={(e) => setProjectSearch(e.target.value)}
                placeholder="Search projects..."
                className="w-full h-9 pl-9 pr-3 rounded-md border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 dark:text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {projectsLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse mx-3 mb-2 h-12 bg-slate-200 dark:bg-slate-700 rounded-xl"
              />
            ))
          ) : projects.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-500 px-4 py-3">
              No projects yet
            </p>
          ) : filteredProjects.length === 0 ? (
            <p className="text-xs text-slate-400 dark:text-slate-500 px-4 py-3">
              No projects found
            </p>
          ) : (
            filteredProjects.map((project) => (
              <button
                key={project.id}
                onClick={() =>
                  setSelectedProject((prev) =>
                    prev?.id === project.id ? null : project
                  )
                }
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 mx-1 rounded-xl text-left transition-all mb-1 ${
                  selectedProject?.id === project.id
                    ? "bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white"
                    : "hover:bg-white dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                }`}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: project.color || "#6d28d9" }}
                />
                <span className="text-xs font-medium truncate flex-1">
                  {project.name}
                </span>

                {((project.tasksCount ?? project.totalTasks) ?? 0) > 0 && (
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 shrink-0">
                    {(project.tasksCount ?? project.totalTasks) ?? 0}
                  </span>
                )}
              </button>
            ))
          )}
        </div>

        {/* Project Tasks Area */}
        <div className="flex-1 overflow-hidden bg-white dark:bg-slate-900">
          {selectedProject ? (
            <ProjectTasksPanel project={selectedProject} />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center p-8">
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${iconBgCls}`}>
                <FolderKanban size={22} />
              </div>
              <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
                Select a project
              </p>
              <p className="text-sm text-slate-400 dark:text-slate-500 max-w-[220px]">
                Choose a project from the left to see its tasks and subtasks.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showInvite && (
        <InviteModal teamId={team.id} onClose={() => setShowInvite(false)} />
      )}

      {showMembers && (
        <MembersModal team={team} onClose={() => setShowMembers(false)} />
      )}

      {showCreateProject && (
        <CreateProjectModal
          defaultTeamId={team.id}        // Pre-selects this team in the modal
          onClose={() => setShowCreateProject(false)}
        />
      )}
    </div>
  );
}