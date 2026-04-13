"use client";

interface Props {
  completedTasks: number;
  totalTasks: number;
}

export function CompletionGauge({ completedTasks, totalTasks }: Props) {
  const pct = totalTasks ? Math.min(100, Math.round((completedTasks / totalTasks) * 100)) : 0;

  const CX = 100, CY = 90, R = 72;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  function arcPt(deg: number) {
    return {
      x: CX + R * Math.cos(toRad(deg)),
      y: CY + R * Math.sin(toRad(deg)),
    };
  }

  const startDeg = 180;
  const endDeg = 180 + (pct / 100) * 180;
  const s = arcPt(startDeg);
  const e = arcPt(endDeg);
  const large = pct > 50 ? 1 : 0;

  const bgS = arcPt(180);
  const bgE = arcPt(0);

  const color = pct >= 75 ? "#22c55e" : pct >= 40 ? "#6C5CE7" : "#ef4444";
  const label = pct >= 75 ? "On track" : pct >= 40 ? "In progress" : "Needs focus";

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl border border-[#E8E8EF] dark:border-slate-700 p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-950 dark:text-white mb-4">Completion rate</p>

      <div className="flex flex-col items-center">
        <svg width={200} height={115} viewBox="0 0 200 115">
          <path
            d={`M ${bgS.x} ${bgS.y} A ${R} ${R} 0 1 1 ${bgE.x} ${bgE.y}`}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth={14}
            strokeLinecap="round"
            className="dark:stroke-slate-800"
          />

          {/* value arc */}
          {pct > 0 && (
            <path
              d={`M ${s.x} ${s.y} A ${R} ${R} 0 ${large} 1 ${e.x} ${e.y}`}
              fill="none"
              stroke={color}
              strokeWidth={14}
              strokeLinecap="round"
            />
          )}

          {/* centre text */}
          <text x={CX} y={CY + 2} textAnchor="middle" fontSize={28} fontWeight={700} className="fill-slate-950 dark:fill-white">
            {pct}%
          </text>
          <text x={CX} y={CY + 20} textAnchor="middle" fontSize={12} fill={color} fontWeight={600}>
            {label}
          </text>
        </svg>

        {/* tick labels */}
        <div className="flex w-[180px] justify-between mt-[-8px]">
          <span className="text-[11px] text-slate-400">0%</span>
          <span className="text-[11px] text-slate-400">50%</span>
          <span className="text-[11px] text-slate-400">100%</span>
        </div>

        {/* detail row */}
        <div className="mt-4 grid grid-cols-2 gap-3 w-full">
          <div className="text-center bg-slate-50 dark:bg-slate-800 rounded-lg py-2">
            <p className="text-lg font-bold text-slate-950 dark:text-white">{completedTasks}</p>
            <p className="text-[11px] text-slate-400">Completed</p>
          </div>
          <div className="text-center bg-slate-50 dark:bg-slate-800 rounded-lg py-2">
            <p className="text-lg font-bold text-slate-950 dark:text-white">{totalTasks - completedTasks}</p>
            <p className="text-[11px] text-slate-400">Remaining</p>
          </div>
        </div>
      </div>
    </div>
  );
}