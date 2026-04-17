"use client";

import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  FolderKanban,
  UserPlus,
  Users,
  Search,
  Plus,
  PanelLeftClose,
  PanelLeftOpen,
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
  initialProjectId?: string;
  initialTaskId?: string;
  initialCommentId?: string;
  initialOpenComments?: boolean;
};

export default function TeamDetailView({ team, idx, onBack, initialProjectId, initialTaskId, initialCommentId, initialOpenComments }: Props) {
  const [showInvite, setShowInvite] = useState(false);
  const [showMembers, setShowMembers] = useState(false);
  const [showCreateProject, setShowCreateProject] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projectSearch, setProjectSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const gradientCls = TEAM_GRADIENTS[idx % TEAM_GRADIENTS.length];
  const iconBgCls = TEAM_ICON_BG[idx % TEAM_ICON_BG.length];

  const { data: projectsPage, isLoading: projectsLoading } =
    useGetProjectsByTeamQuery({ teamId: team.id });

  const projects = projectsPage?.content ?? [];

  // Auto-select project when arriving from a notification deep-link.
  // useRef guard ensures this fires ONCE — so user can freely go back
  // without the effect immediately re-selecting the same project.
  const didAutoSelect = useRef(false);
  useEffect(() => {
    if (didAutoSelect.current || !initialProjectId || projects.length === 0) return;
    const p = projects.find((proj) => proj.id === initialProjectId);
    if (p) { didAutoSelect.current = true; setSelectedProject(p); }
  }, [initialProjectId, projects]);

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(projectSearch.toLowerCase())
  );

  const { data: membersPage } = useGetTeamMembersQuery({ teamId: team.id });
  const members = membersPage?.content ?? [];

  return (
    <div className="flex flex-col h-full">
      {/* ── Header with gradient ── */}
      <div className={`bg-gradient-to-r ${gradientCls} px-3 sm:px-6 pt-3 sm:pt-5 pb-3 sm:pb-4`}>

        {/* Row 1: back button + team name/description — full width, no truncation */}
        <div className="flex items-start gap-2 sm:gap-4">
          <button
            onClick={onBack}
            className="mt-0.5 w-8 h-8 rounded-xl bg-white/20 hover:bg-white/30 flex items-center justify-center text-white transition-colors shrink-0"
          >
            <ArrowLeft size={15} />
          </button>

          <div className="flex-1 min-w-0">
            <p className="text-white/70 text-xs font-medium mb-0.5">Team</p>
            <h2 className="text-white text-lg sm:text-xl font-bold break-words">{team.name}</h2>
            {team.description && (
              <p className="text-white/80 text-xs sm:text-sm mt-0.5 sm:mt-1 break-words">
                {team.description}
              </p>
            )}
          </div>
        </div>

        {/* Row 2: stats + avatars + action buttons all on the left */}
        <div className="flex items-center gap-2 sm:gap-3 mt-3 flex-wrap">
          {/* Stats */}
          <div className="flex items-center gap-1.5 text-white/90 text-xs sm:text-sm">
            <Users size={13} />
            <span className="font-semibold">{team.memberCount}</span>
            <span className="text-white/60 text-xs">members</span>
          </div>

          <div className="flex items-center gap-1.5 text-white/90 text-xs sm:text-sm">
            <FolderKanban size={13} />
            <span className="font-semibold">{projects.length}</span>
            <span className="text-white/60 text-xs">projects</span>
          </div>

          {/* Member avatars */}
          <div className="flex -space-x-2">
            {members.slice(0, 5).map((m) => {
              const name = m.user.fullName || m.user.username;
              return m.user.profilePhoto ? (
                <img
                  key={m.id}
                  src={m.user.profilePhoto}
                  alt={name}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white cursor-pointer hover:scale-110 transition-transform object-cover"
                  title={name}
                  onClick={() => setShowMembers(true)}
                />
              ) : (
                <div
                  key={m.id}
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white flex items-center justify-center text-white text-[9px] sm:text-[10px] font-bold cursor-pointer hover:scale-110 transition-transform"
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
                className="w-6 h-6 sm:w-7 sm:h-7 rounded-full border-2 border-white bg-white/30 flex items-center justify-center text-white text-[9px] sm:text-[10px] font-bold cursor-pointer hover:scale-110 transition-transform"
                onClick={() => setShowMembers(true)}
              >
                +{members.length - 5}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-white/30 hidden sm:block" />

          {/* Action buttons — moved here from top-right */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setShowInvite(true)}
              className="flex items-center gap-1.5 px-2 sm:px-3 h-8 sm:h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-colors"
              aria-label="Invite"
            >
              <UserPlus size={13} />
              <span className="hidden sm:inline">Invite</span>
            </button>

            <button
              onClick={() => setShowMembers(true)}
              className="flex items-center gap-1.5 px-2 sm:px-3 h-8 sm:h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold transition-colors"
              aria-label="Members"
            >
              <Users size={13} />
              <span className="hidden sm:inline">Members</span>
            </button>

            <button
              onClick={() => setShowCreateProject(true)}
              className="flex items-center gap-1.5 px-2 sm:px-4 h-8 sm:h-9 rounded-xl bg-white text-slate-900 hover:bg-white/90 font-semibold text-xs transition-all active:scale-[0.98]"
              aria-label="New Project"
            >
              <Plus size={14} />
              <span className="hidden sm:inline">New Project</span>
            </button>
          </div>
        </div>
      </div>

      {/* ── Main Content ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Projects Sidebar — collapsible */}
        <div
          className={[
            "flex-col shrink-0 border-r border-slate-200 dark:border-slate-700",
            "bg-[#F4F5F7] dark:bg-[#1a1c2e] overflow-auto transition-all duration-300",
            sidebarOpen
              ? selectedProject
                ? "hidden md:flex md:w-56"
                : "flex w-full md:w-56"
              : "hidden",
          ].join(" ")}
        >
          {/* Sidebar header + collapse button */}
          <div className="flex items-center justify-between px-4 pt-4 pb-2">
            <p className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Projects
            </p>
            <button
              onClick={() => setSidebarOpen(false)}
              className="w-6 h-6 flex items-center justify-center rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="Collapse sidebar"
            >
              <PanelLeftClose size={14} />
            </button>
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
                className="w-full h-10 pl-9 pr-3 rounded-md border border-slate-200 dark:border-slate-700 text-sm bg-white dark:bg-slate-800 dark:text-white outline-none focus:border-blue-500"
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
                className={`w-full flex items-center gap-2.5 px-3 py-3 mx-1 rounded-xl text-left transition-all mb-1 ${
                  selectedProject?.id === project.id
                    ? "bg-white dark:bg-slate-800 shadow-sm text-slate-900 dark:text-white"
                    : "hover:bg-white dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400"
                }`}
              >
                <div
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: project.color || "#6d28d9" }}
                />
                <span className="text-sm font-medium truncate flex-1">
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
        <div
          className={[
            "overflow-hidden bg-white dark:bg-[#1E1B2E]",
            selectedProject || !sidebarOpen
              ? "flex flex-col flex-1"
              : "hidden md:flex md:flex-col md:flex-1",
          ].join(" ")}
        >
          {/* Show-sidebar button — visible only when sidebar is collapsed */}
          {!sidebarOpen && (
            <div className="flex items-center gap-2 px-4 py-2 border-b border-slate-200 dark:border-slate-700 bg-white dark:bg-[#1a1c2e] shrink-0">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
                title="Show projects"
              >
                <PanelLeftOpen size={14} />
                <span>Projects</span>
              </button>
            </div>
          )}

          {selectedProject ? (
            <ProjectTasksPanel
              project={selectedProject}
              onBack={() => setSelectedProject(null)}
              initialTaskId={initialTaskId}
              initialCommentId={initialCommentId}
              initialOpenComments={initialOpenComments}
            />
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
          defaultTeamId={team.id}
          onClose={() => setShowCreateProject(false)}
        />
      )}
    </div>
  );
}