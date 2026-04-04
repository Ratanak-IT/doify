"use client";

import { useState } from "react";
import type { Team } from "@/lib/features/types/task-type";
import {
  useDeleteTeamMutation,
  useGetTeamsQuery,
} from "@/lib/features/team/teamApi";

import TeamHeader from "./TeamHeader";
import TeamGrid from "./TeamGrid";
import TeamDetailView from "./TeamDetailView";
import CreateTeamModal from "./modals/CreateTeamModal";
import EditTeamModal from "./modals/EditTeamModal";

export default function TeamPageClient() {
  const [showCreate, setShowCreate] = useState(false);
  const [editTeam, setEditTeam] = useState<Team | null>(null);
  const [activeTeam, setActiveTeam] = useState<{ team: Team; idx: number } | null>(null);

  const { data: teamsPage, isLoading, refetch } = useGetTeamsQuery({});
  const [deleteTeam] = useDeleteTeamMutation();

  const teams = teamsPage?.content ?? [];

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
      <TeamHeader
        count={teams.length}
        onRefresh={refetch}
        onCreate={() => setShowCreate(true)}
      />

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