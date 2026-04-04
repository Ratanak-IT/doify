import { Plus, Users } from "lucide-react";

type Props = {
  onCreate?: () => void;
};

export default function TeamEmptyState({ onCreate }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div className="w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-900/30 flex items-center justify-center">
        <Users size={26} className="text-violet-600 dark:text-violet-400" />
      </div>

      <div className="text-center">
        <p className="text-base font-semibold text-slate-700 dark:text-slate-200">
          No teams yet
        </p>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">
          Create a team to start collaborating
        </p>
      </div>

      {onCreate && (
        <button
          onClick={onCreate}
          className="flex items-center gap-2 h-9 px-4 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
        >
          <Plus size={14} />
          Create First Team
        </button>
      )}
    </div>
  );
}