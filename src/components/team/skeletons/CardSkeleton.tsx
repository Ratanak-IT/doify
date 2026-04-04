export default function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5 space-y-3">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-slate-700" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
          <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2" />
        </div>
      </div>
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-4/5" />
      <div className="flex gap-2 pt-1">
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-16" />
        <div className="h-6 bg-slate-200 dark:bg-slate-700 rounded-full w-20" />
      </div>
    </div>
  );
}