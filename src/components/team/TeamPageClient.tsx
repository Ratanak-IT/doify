"use client";

import DashboardHeader from "@/components/DashboardHeader";
import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import type { Team } from "@/lib/features/types/task-type";
import { useDeleteTeamMutation, useGetTeamsQuery } from "@/lib/features/team/teamApi";
import { taskApi } from "@/lib/features/tasks/taskApi";
import { useAppDispatch } from "@/lib/hooks";
import TeamGrid from "./TeamGrid";
import TeamDetailView from "./TeamDetailView";
import CreateTeamModal from "./modals/CreateTeamModal";
import EditTeamModal from "./modals/EditTeamModal";

// ── Client-side resolution using RTK Query (auth handled automatically) ────
// Returns { teamId, projectId, taskId, openComments } or null.
async function resolveNotification(
  referenceId: string,
  notifType: string,
  teams: Team[],
  dispatch: ReturnType<typeof useAppDispatch>
): Promise<{ teamId: string; projectId?: string; taskId?: string; openComments: boolean } | null> {
  const isComment = ["COMMENT_ADDED", "MENTIONED_IN_COMMENT"].includes(notifType);
  const isProject = ["PROJECT_UPDATED", "PROJECT_CREATED"].includes(notifType);
  const isTeam    = ["INVITATION_ACCEPTED", "TEAM_MEMBER_JOINED"].includes(notifType);

  if (isTeam) return { teamId: referenceId, openComments: false };

  // ── Step 1: resolve task & projectId ──────────────────────────────────
  let taskId: string | undefined;
  let projectId: string | undefined;

  if (!isProject) {
    // referenceId should be a taskId (or commentId for comment notifications)
    try {
      const task = await dispatch(
        taskApi.endpoints.getTask.initiate(referenceId)
      ).unwrap();
      if (task?.id) {
        taskId   = task.id;
        projectId = task.projectId;
      }
    } catch {
      // referenceId might be a commentId — try to fetch as comment
      try {
        const res = await fetch(`/api/v1/comments/${referenceId}`);
        if (res.ok) {
          const c = await res.json();
          const cData = c?.data ?? c;
          if (cData?.taskId) {
            const task2 = await dispatch(
              taskApi.endpoints.getTask.initiate(cData.taskId)
            ).unwrap();
            taskId    = task2?.id;
            projectId = task2?.projectId;
          }
        }
      } catch { /* ignore */ }
    }
  } else {
    projectId = referenceId;
  }

  if (!projectId) return null;

  // ── Step 2: find teamId from projectId ────────────────────────────────
  let teamId: string | undefined;

  // Try the project endpoint first
  try {
    const proj = await dispatch(
      taskApi.endpoints.getProject.initiate(projectId)
    ).unwrap();
    teamId = proj?.teamId;
  } catch { /* ignore */ }

  // If teamId is still missing, scan all user teams to find which owns the project
  if (!teamId && teams.length > 0) {
    for (const team of teams) {
      try {
        const tProjects = await dispatch(
          taskApi.endpoints.getProjectsByTeam.initiate({ teamId: team.id })
        ).unwrap();
        const found = (tProjects?.content ?? []).some((p: any) => p.id === projectId);
        if (found) { teamId = team.id; break; }
      } catch { /* ignore */ }
    }
  }

  if (!teamId) return null;
  return { teamId, projectId, taskId, openComments: isComment };
}

export default function TeamPageClient() {
  const router       = useRouter();
  const searchParams = useSearchParams();
  const dispatch     = useAppDispatch();

  // URL params: either pre-resolved (teamId in URL) or raw notification (notifRef)
  const teamIdParam    = searchParams?.get("teamId");
  const projectIdParam = searchParams?.get("projectId");
  const taskIdParam    = searchParams?.get("taskId");
  const commentIdParam = searchParams?.get("commentId");
  const openComments   = searchParams?.get("openComments") === "1";
  const notifType      = searchParams?.get("notifType");
  // Raw notification reference (new simplified approach)
  const notifRef       = searchParams?.get("notifRef");

  const [showCreate, setShowCreate] = useState(false);
  const [editTeam,   setEditTeam]   = useState<Team | null>(null);
  const [activeTeam, setActiveTeam] = useState<{ team: Team; idx: number } | null>(null);
  const [resolving,  setResolving]  = useState(false);

  const [storedProjectId,    setStoredProjectId]    = useState<string | undefined>();
  const [storedTaskId,       setStoredTaskId]        = useState<string | undefined>();
  const [storedCommentId,    setStoredCommentId]     = useState<string | undefined>();
  const [storedOpenComments, setStoredOpenComments]  = useState(false);

  const { data: teamsPage, isLoading, refetch } = useGetTeamsQuery({});
  const [deleteTeam] = useDeleteTeamMutation();
  const teams = teamsPage?.content ?? [];

  const prevKeyRef = useRef("");

  // ── Case A: Raw notification reference (notifRef in URL) ──────────────
  // Resolve client-side using RTK Query (always authenticated).
  useEffect(() => {
    if (!notifRef || !notifType || teams.length === 0) return;
    const key = `${notifType}|${notifRef}`;
    if (key === prevKeyRef.current) return;
    prevKeyRef.current = key;

    setResolving(true);
    resolveNotification(notifRef, notifType, teams, dispatch).then(result => {
      setResolving(false);
      if (!result) return;
      setStoredProjectId(result.projectId);
      setStoredTaskId(result.taskId);
      setStoredCommentId(undefined);
      setStoredOpenComments(result.openComments);
      doNavigateToTeam(result.teamId);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifRef, notifType, teams]);

  // ── Case B: Pre-resolved params already in URL (teamId + others) ──────
  useEffect(() => {
    if (!notifType || notifRef) return; // handled by Case A
    const key = [notifType, teamIdParam, projectIdParam, taskIdParam].filter(Boolean).join("|");
    if (key === prevKeyRef.current) return;
    prevKeyRef.current = key;

    setStoredProjectId(projectIdParam ?? undefined);
    setStoredTaskId(taskIdParam ?? undefined);
    setStoredCommentId(commentIdParam ?? undefined);
    setStoredOpenComments(openComments);

    if (teamIdParam && teams.length > 0) {
      doNavigateToTeam(teamIdParam);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [notifType, teamIdParam, projectIdParam, taskIdParam, commentIdParam, openComments]);

  // ── Case C: teamId in URL, teams loaded after params arrived ──────────
  useEffect(() => {
    if (!teamIdParam || activeTeam || teams.length === 0 || notifRef) return;
    if (projectIdParam) setStoredProjectId(projectIdParam);
    if (taskIdParam)    setStoredTaskId(taskIdParam);
    if (commentIdParam) setStoredCommentId(commentIdParam);
    if (openComments)   setStoredOpenComments(true);
    doNavigateToTeam(teamIdParam);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teams, teamIdParam, activeTeam]);

  function doNavigateToTeam(teamId: string) {
    const team = teams.find(t => t.id === teamId);
    if (!team) return;
    prevKeyRef.current = teamId;
    setActiveTeam({ team, idx: teams.indexOf(team) });
    router.replace(`/dashboard/team?teamId=${teamId}`);
  }

  function selectTeam(team: Team, idx: number) {
    setStoredProjectId(undefined);
    setStoredTaskId(undefined);
    setStoredCommentId(undefined);
    setStoredOpenComments(false);
    prevKeyRef.current = team.id;
    setActiveTeam({ team, idx });
    router.replace(`/dashboard/team?teamId=${team.id}`);
  }

  function goBack() {
    setActiveTeam(null);
    setStoredProjectId(undefined);
    setStoredTaskId(undefined);
    setStoredCommentId(undefined);
    setStoredOpenComments(false);
    prevKeyRef.current = "";
    router.replace("/dashboard/team");
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
        {resolving ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">Opening…</div>
          </div>
        ) : activeTeam ? (
          <TeamDetailView
            team={activeTeam.team}
            idx={activeTeam.idx}
            onBack={goBack}
            initialProjectId={storedProjectId}
            initialTaskId={storedTaskId}
            initialCommentId={storedCommentId}
            initialOpenComments={storedOpenComments}
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
