"use client";

import { useRouter } from "next/navigation";
import { useGetTeamByIdQuery } from "@/lib/features/team/teamApi";
import TeamDetailView from "@/components/team/TeamDetailView";

export default function TeamDetailPage({ params }: { params: { teamId: string } }) {
  const router = useRouter();
  const { teamId } = params;
  const { data: team, isLoading, isError } = useGetTeamByIdQuery(teamId);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center p-6 bg-[#F8F9FC] dark:bg-[#1E1B2E]">
        <div className="rounded-3xl border border-slate-200 dark:border-[#2a2d45] bg-white dark:bg-[#1a1c2e] p-8 text-slate-600 dark:text-slate-400 shadow-sm">
          Loading team…
        </div>
      </div>
    );
  }

  if (isError || !team) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-6 text-center bg-[#F8F9FC] dark:bg-[#1E1B2E]">
        <p className="text-lg font-semibold text-slate-900 dark:text-white">Team not found</p>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Unable to locate that team. Try returning to the team list.</p>
        <button
          onClick={() => router.push("/dashboard/team")}
          className="mt-4 rounded-full bg-slate-950 dark:bg-[#6C5CE7] px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 dark:hover:bg-[#5B4BD5] transition-colors"
        >
          Back to teams
        </button>
      </div>
    );
  }

  return <TeamDetailView team={team} idx={0} onBack={() => router.push("/dashboard/team")} />;
}