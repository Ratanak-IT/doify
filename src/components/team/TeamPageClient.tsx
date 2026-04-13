"use client";

import DashboardHeader from "@/components/DashboardHeader";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Team } from "@/lib/features/types/task-type";
import {
  useDeleteTeamMutation,
  useGetTeamsQuery,
} from "@/lib/features/team/teamApi";
import { useGetTaskQuery, useGetProjectQuery } from "@/lib/features/tasks/taskApi";

import TeamGrid from "./TeamGrid";
import TeamDetailView from "./TeamDetailView";
import CreateTeamModal from "./modals/CreateTeamModal";
import EditTeamModal from "./modals/EditTeamModal";

export default function TeamPageClient() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const taskId      = searchParams?.get("taskId");
  const teamIdParam = searchParams?.get("teamId"); // persisted in URL

  const [showCreate, setShowCreate] = useState(false);
  const [editTeam,   setEditTeam]   = useState<Team | null>(null);
  const [activeTeam, setActiveTeam] = useState<{ team: Team; idx: number } | null>(null);

  const { data: teamsPage, isLoading, refetch } = useGetTeamsQuery({});
  const [deleteTeam] = useDeleteTeamMutation();
  const { data: task }    = useGetTaskQuery(taskId || "", { skip: !taskId });
  const { data: project } = useGetProjectQuery(task?.projectId || "", { skip: !task?.projectId });

  const teams = teamsPage?.content ?? [];

  // Restore team from URL on load or when teams data arrives
  useEffect(() => {
    if (teams.length === 0) return;

    if (teamIdParam && !activeTeam) {
      const team = teams.find((t) => t.id === teamIdParam);
      if (team) {
        setActiveTeam({ team, idx: teams.indexOf(team) });
        return;
      }
    }

    // taskId-based auto-select
    if (project && project.teamId && !activeTeam) {
      const team = teams.find((t) => t.id === project.teamId);
      if (team) selectTeam(team, teams.indexOf(team));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teams, teamIdParam, project]);

  // Select a team → store its ID in the URL so refresh restores it
  function selectTeam(team: Team, idx: number) {
    setActiveTeam({ team, idx });
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.set("teamId", team.id);
    router.replace(`/dashboard/team?${params.toString()}`);
  }

  // Go back to list → remove teamId from URL
  function goBack() {
    setActiveTeam(null);
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.delete("teamId");
    const qs = params.toString();
    router.replace(`/dashboard/team${qs ? `?${qs}` : ""}`);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden bg-[#F8F9FC] dark:bg-[#1E1B2E]">
      <DashboardHeader
        onRefresh={activeTeam ? undefined : refetch}
        onCreate={activeTeam ? undefined : () => setShowCreate(true)}
        createLabel="Create"
        showCreate={!activeTeam}
      />

      <div className="flex-1 overflow-hidden bg-[#F8F9FC] dark:bg-[#1E1B2E]">
        {activeTeam ? (
          <TeamDetailView
            team={activeTeam.team}
            idx={activeTeam.idx}
            onBack={goBack}
          />
        ) : (
          <TeamGrid
            teams={teams}
            isLoading={isLoading}
            onSelect={selectTeam}
            onEdit={(team) => setEditTeam(team)}
            onDelete={(id) => deleteTeam(id)}
          />
        )}
      </div>

      {showCreate && <CreateTeamModal onClose={() => setShowCreate(false)} />}
      {editTeam   && <EditTeamModal team={editTeam} onClose={() => setEditTeam(null)} />}
    </div>
  );
}