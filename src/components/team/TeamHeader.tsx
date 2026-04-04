import { Plus, RefreshCw } from "lucide-react";

type Props = {
  count: number;
  onRefresh: () => void;
  onCreate: () => void;
};

export default function TeamHeader({ count, onRefresh, onCreate }: Props) {
  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 shrink-0">
      <div>
        <h1 className="text-lg font-bold text-slate-900 dark:text-white">
          Teams
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 -mt-0.5">
          {count} team{count !== 1 ? "s" : ""} in your workspace
        </p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          className="w-9 h-9 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <RefreshCw size={14} />
        </button>

        <button
          onClick={onCreate}
          className="flex items-center gap-2 h-9 px-4 rounded-xl bg-violet-600 text-white text-sm font-semibold hover:bg-violet-700 transition-colors"
        >
          <Plus size={14} />
          New Team
        </button>
      </div>
    </header>
  );
}