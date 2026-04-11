import { Plus, RefreshCw } from "lucide-react";

type Props = {
  count: number;
  onRefresh: () => void;
  onCreate: () => void;
};

export default function TeamHeader({ count, onRefresh, onCreate }: Props) {
  return (
    <header className="h-14 sm:h-16 bg-white dark:bg-slate-900 border-b border-[#E8E8EF] dark:border-slate-800 flex items-center justify-between px-3 sm:px-5 gap-2 shrink-0 sticky top-0 z-30">
      <a href="/" className="flex items-center gap-2 shrink-0 group">
        <div className="w-8 h-8 rounded-lg bg-[#6C5CE7] flex items-center justify-center shadow-md shadow-[#6C5CE7]/30 group-hover:shadow-[#6C5CE7]/50 transition-shadow">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="4" height="12" rx="1" fill="white"/>
            <rect x="7" y="1" width="6" height="8" rx="1" fill="white" opacity=".8"/>
          </svg>
        </div>
        <span className="font-bold text-[15px] text-[#1E293B] dark:text-white tracking-tight hidden sm:block">Doify</span>
      </a>

      <div className="flex items-center gap-2">
        <button
          onClick={onRefresh}
          className="w-9 h-12 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
        >
          <RefreshCw size={14} />
        </button>

        <button
          onClick={onCreate}
          className="flex items-center gap-1.5 h-9 px-3 sm:px-4 rounded-lg bg-[#6C5CE7] hover:bg-[#5B4BD5] active:bg-[#4a3cc7] text-white text-sm font-bold transition-colors shadow-sm shadow-[#6C5CE7]/30"
        >
          <Plus size={15} strokeWidth={2.5} />
          <span className="hidden xs:inline sm:inline">Create</span>
        </button>
      </div>
    </header>
  );
}