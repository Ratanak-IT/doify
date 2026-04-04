export default function TaskSkeleton() {
  return (
    <div className="animate-pulse flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/50">
      <div className="w-4 h-4 rounded bg-slate-200 dark:bg-slate-700 shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
      </div>
      <div className="h-5 w-14 bg-slate-200 dark:bg-slate-700 rounded-full" />
    </div>
  );
}