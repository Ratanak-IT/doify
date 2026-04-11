"use client";

import DashboardHeader from "@/components/DashboardHeader";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { Team } from "@/lib/features/types/task-type";
import {
  useDeleteTeamMutation,
  useGetTeamsQuery,
} from "@/lib/features/team/teamApi";
import { useGetTaskQuery, useGetProjectQuery } from "@/lib/features/tasks/taskApi";

import TeamHeader from "./TeamHeader";
import TeamGrid from "./TeamGrid";
import TeamDetailView from "./TeamDetailView";
import CreateTeamModal from "./modals/CreateTeamModal";
import EditTeamModal from "./modals/EditTeamModal";

export default function TeamPageClient() {
  const searchParams = useSearchParams();
  const taskId = searchParams?.get("taskId");

  const [showCreate, setShowCreate] = useState(false);
  const [editTeam, setEditTeam] = useState<Team | null>(null);
  const [activeTeam, setActiveTeam] = useState<{ team: Team; idx: number } | null>(null);

  const { data: teamsPage, isLoading, refetch } = useGetTeamsQuery({});
  const [deleteTeam] = useDeleteTeamMutation();
  const { data: task } = useGetTaskQuery(taskId || "", { skip: !taskId });
  const { data: project } = useGetProjectQuery(task?.projectId || "", { skip: !task?.projectId });

  const teams = teamsPage?.content ?? [];

  useEffect(() => {
    if (project && project.teamId && teams.length > 0 && !activeTeam) {
      const team = teams.find((t) => t.id === project.teamId);
      if (team) {
        const idx = teams.indexOf(team);
        setActiveTeam({ team, idx });
      }
    }
  }, [project, teams, activeTeam]);

  if (activeTeam) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <TeamDetailView
          team={activeTeam.team}
          idx={activeTeam.idx}
          onBack={() => setActiveTeam(null)}
        />
      </div>
    );
  }

  return (
    <>
      <DashboardHeader onRefresh={refetch} onCreate={() => setShowCreate(true)} createLabel="Create" />

      <TeamGrid
        teams={teams}
        isLoading={isLoading}
        onSelect={(team, idx) => setActiveTeam({ team, idx })}
        onEdit={(team) => setEditTeam(team)}
        onDelete={(id) => deleteTeam(id)}
      />

      {showCreate && <CreateTeamModal onClose={() => setShowCreate(false)} />}
      {editTeam && (
        <EditTeamModal team={editTeam} onClose={() => setEditTeam(null)} />
      )}
    </>
  );
}