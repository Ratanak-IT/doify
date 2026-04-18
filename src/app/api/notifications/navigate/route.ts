/**
 * GET /api/notifications/navigate
 *
 * Resolves a notification referenceId into a full navigation target.
 * Auth token is read from the Authorization header OR the "token" cookie
 * (browser fetches from client don't automatically send the header).
 */
import { NextRequest, NextResponse } from "next/server";

const BASE = process.env.NEXT_PUBLIC_API;

async function backendFetch(path: string, token: string) {
  const res = await fetch(`${BASE}/api/v1${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) return null;
  const text = await res.text();
  if (!text) return null;
  try {
    const json = JSON.parse(text);
    return json?.data !== undefined ? json.data : json;
  } catch { return null; }
}

function getToken(req: NextRequest): string | null {
  // 1. Authorization header (when explicitly passed by client)
  const header = req.headers.get("authorization");
  if (header) return header.replace(/^Bearer\s+/i, "");
  // 2. Cookie fallback (browser requests don't add Authorization header)
  const cookie = req.cookies.get("token");
  if (cookie?.value) return decodeURIComponent(cookie.value);
  return null;
}

async function findTeamForProject(projectId: string, token: string): Promise<string | null> {
  // Try single-project endpoint first
  const proj = await backendFetch(`/projects/${projectId}`, token);
  if (proj?.teamId) return proj.teamId as string;

  // Fall back: scan all user teams in parallel
  const teamsData = await backendFetch("/teams?size=100", token);
  const teams: any[] = teamsData?.content ?? (Array.isArray(teamsData) ? teamsData : []);
  if (!teams.length) return null;

  const results = await Promise.all(
    teams.map(async (team: any) => {
      const tp = await backendFetch(`/projects/team/${team.id}?size=100`, token);
      const projs: any[] = tp?.content ?? (Array.isArray(tp) ? tp : []);
      return projs.some((p: any) => p.id === projectId) ? String(team.id) : null;
    })
  );
  return results.find((id): id is string => id !== null) ?? null;
}

async function resolveTask(taskId: string, token: string) {
  const task = await backendFetch(`/tasks/${taskId}`, token);
  if (!task?.id) return null;
  if (!task.projectId) return { taskId, isPersonal: true };
  const teamId = await findTeamForProject(task.projectId, token);
  return { taskId, projectId: String(task.projectId), teamId: teamId ?? undefined };
}

export async function GET(req: NextRequest) {
  const token = getToken(req);
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const type          = searchParams.get("type") ?? "";
  const referenceId   = searchParams.get("referenceId") ?? "";
  const referenceType = (searchParams.get("referenceType") ?? "").toUpperCase();

  try {
    // Task notifications
    if (["TASK_ASSIGNED","TASK_CREATED","DUE_DATE_REMINDER","OVERDUE_TASK"].includes(type) || referenceType === "TASK") {
      return NextResponse.json(await resolveTask(referenceId, token) ?? {});
    }

    // Comment notifications — referenceId may be taskId OR commentId
    if (["COMMENT_ADDED","MENTIONED_IN_COMMENT"].includes(type) || referenceType === "COMMENT") {
      // Try as taskId
      const r1 = await resolveTask(referenceId, token);
      if (r1?.taskId) return NextResponse.json({ ...r1, openComments: true });
      // Try as commentId — GET /comments/{id}
      const comment = await backendFetch(`/comments/${referenceId}`, token);
      if (comment?.taskId) {
        const r2 = await resolveTask(comment.taskId, token);
        if (r2) return NextResponse.json({ ...r2, commentId: referenceId, openComments: true });
      }
      return NextResponse.json({ openComments: true });
    }

    // Project notifications
    if (["PROJECT_UPDATED","PROJECT_CREATED"].includes(type) || referenceType === "PROJECT") {
      const proj = await backendFetch(`/projects/${referenceId}`, token);
      const teamId = proj?.teamId ?? await findTeamForProject(referenceId, token);
      return NextResponse.json({ projectId: referenceId, teamId: teamId ?? undefined });
    }

    // Team / invitation
    if (["INVITATION_ACCEPTED","TEAM_MEMBER_JOINED"].includes(type) || referenceType === "TEAM") {
      return NextResponse.json({ teamId: referenceId });
    }
    if (type === "TEAM_INVITATION") return NextResponse.json({ isTeamInvitation: true });

    // Generic fallback
    if (referenceType === "TASK")    return NextResponse.json(await resolveTask(referenceId, token) ?? {});
    if (referenceType === "PROJECT") {
      const teamId = await findTeamForProject(referenceId, token);
      return NextResponse.json({ projectId: referenceId, teamId: teamId ?? undefined });
    }
    if (referenceType === "TEAM") return NextResponse.json({ teamId: referenceId });

    return NextResponse.json({});
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 500 });
  }
}
