import type { Team } from "@/lib/features/types/task-type";
import TeamCard from "./TeamCard";
import TeamEmptyState from "./TeamEmptyState";
import CardSkeleton from "./skeletons/CardSkeleton";

type Props = {
  teams: Team[];
  isLoading: boolean;
  onSelect: (team: Team, idx: number) => void;
  onEdit: (team: Team) => void;
  onDelete: (id: string) => void;
};

export default function TeamGrid({
  teams,
  isLoading,
  onSelect,
  onEdit,
  onDelete,
}: Props) {
  return (
    <main className="flex-1 overflow-auto p-4 sm:p-6 bg-[#F8F9FC] dark:bg-[#1E1B2E]">
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : teams.length === 0 ? (
        <TeamEmptyState />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {teams.map((team, idx) => (
            <TeamCard
              key={team.id}
              team={team}
              idx={idx}
              onSelect={() => onSelect(team, idx)}
              onEdit={() => onEdit(team)}
              onDelete={() => onDelete(team.id)}
            />
          ))}
        </div>
      )}
    </main>
  );
}