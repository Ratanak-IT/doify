"use client";

interface Props {
  completedTasks: number;
  totalTasks: number;
}

export function CompletionGauge({ completedTasks, totalTasks }: Props) {
  const pct = totalTasks ? Math.min(100, Math.round((completedTasks / totalTasks) * 100)) : 0;

  const CX = 100, CY = 95, R = 72;
  const toRad = (deg: number) => (deg * Math.PI) / 180;

  function pt(deg: number): [number, number] {
    return [CX + R * Math.cos(toRad(deg)), CY + R * Math.sin(toRad(deg))];
  }

  const [sx, sy] = pt(180);
  const [ex, ey] = pt(0);

  const endDeg = 180 - (pct / 100) * 180;
  const [vex, vey] = pt(endDeg);
  const large = pct > 50 ? 1 : 0;

  const color = pct >= 75 ? "#22c55e" : pct >= 40 ? "#6C5CE7" : "#ef4444";
  const label = pct >= 75 ? "On track" : pct >= 40 ? "In progress" : "Needs focus";

  return (
    <div className="bg-white dark:bg-[#1a1c2e] rounded-xl border border-[#E8E8EF] dark:border-[#2a2d45] p-5 shadow-sm">
      <p className="text-sm font-semibold text-slate-950 dark:text-white mb-4">Completion rate</p>

      <div className="flex flex-col items-center">
        <svg width={200} height={118} viewBox="0 0 200 118">
          {/* background track */}
          <path
            d={`M ${sx} ${sy} A ${R} ${R} 0 1 0 ${ex} ${ey}`}
            fill="none"
            stroke="#F1F5F9"
            strokeWidth={13}
            strokeLinecap="round"
            className="dark:stroke-slate-800"
          />

          {/* value arc */}
          {pct > 0 && (
            <path
              d={`M ${sx} ${sy} A ${R} ${R} 0 ${large} 1 ${vex} ${vey}`}
              fill="none"
              stroke={color}
              strokeWidth={13}
              strokeLinecap="round"
            />
          )}

          {/* end-cap dot */}
          {pct > 0 && (
            <circle cx={vex} cy={vey} r={5} fill="white" stroke={color} strokeWidth={2} />
          )}

          <text x={CX} y={92} textAnchor="middle" fontSize={30} fontWeight={500} className="fill-slate-950 dark:fill-white">
            {pct}%
          </text>
          <text x={CX} y={110} textAnchor="middle" fontSize={12} fill={color} fontWeight={500}>
            {label}
          </text>
        </svg>

        <div className="flex w-[190px] justify-between mt-[-4px]">
          <span className="text-[11px] text-slate-400">0%</span>
          <span className="text-[11px] text-slate-400">50%</span>
          <span className="text-[11px] text-slate-400">100%</span>
        </div>

        {/* detail row */}
        <div className="mt-4 grid grid-cols-2 gap-3 w-full">
          <div className="text-center bg-slate-50 dark:bg-[#252840] rounded-lg py-2">
            <p className="text-lg font-bold text-slate-950 dark:text-white">{completedTasks}</p>
            <p className="text-[11px] text-slate-400">Completed</p>
          </div>
          <div className="text-center bg-slate-50 dark:bg-[#252840] rounded-lg py-2">
            <p className="text-lg font-bold text-slate-950 dark:text-white">{totalTasks - completedTasks}</p>
            <p className="text-[11px] text-slate-400">Remaining</p>
          </div>
        </div>
      </div>
    </div>
  );
}