
'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-zinc-50 px-6 text-center dark:bg-zinc-950 transition-colors duration-400">

      {/* Animated dot grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30 dark:opacity-20 animate-[gridpan_20s_linear_infinite]"
        style={{
          backgroundImage: 'radial-gradient(circle, #c4b5fd 1.2px, transparent 1.2px)',
          backgroundSize: '30px 30px',
        }}
      />

      {/* Top shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-violet-500 to-violet-700 animate-pulse" />

      {/* Floating blobs */}
      <div className="pointer-events-none absolute -top-10 -left-14 h-44 w-44 rounded-full bg-violet-500/5 animate-[float_8s_ease-in-out_infinite]" />
      <div className="pointer-events-none absolute -bottom-5 -right-8 h-28 w-28 rounded-full bg-emerald-500/5 animate-[float_8s_ease-in-out_3s_infinite]" />
      <div className="pointer-events-none absolute top-1/3 left-[5%] h-20 w-20 rounded-full bg-red-500/5 animate-[float_8s_ease-in-out_5s_infinite]" />

      {/* Content — staggered fade-up */}
      <div className="relative z-10 flex flex-col items-center animate-[fadeup_0.7s_cubic-bezier(.22,1,.36,1)_both]">

        {/* Badge */}
        <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-violet-300/40 bg-violet-50 px-4 py-1.5 font-mono text-[11px] font-medium tracking-widest uppercase text-violet-700 dark:border-violet-500/30 dark:bg-violet-500/10 dark:text-violet-300 animate-[fadeup_0.7s_0.1s_cubic-bezier(.22,1,.36,1)_both]">
          <span className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse dark:bg-violet-400" />
          error · page not found
        </span>

        {/* Glitch 404 */}
        <h1 className="glitch relative select-none text-[clamp(7.5rem,22vw,12rem)] font-black leading-none tracking-[-6px] text-zinc-900 dark:text-zinc-50 animate-[fadeup_0.6s_0.05s_cubic-bezier(.22,1,.36,1)_both,flicker_6s_2s_ease-in-out_infinite]">
          404
        </h1>

        {/* Divider */}
        <div className="my-5 flex items-center gap-3 animate-[fadeup_0.7s_0.2s_cubic-bezier(.22,1,.36,1)_both]">
          <div className="h-px w-14 bg-gradient-to-r from-transparent to-zinc-400 dark:to-zinc-600" />
          <span className="font-mono text-[10px] tracking-[0.16em] uppercase text-zinc-400 dark:text-zinc-600">not found</span>
          <div className="h-px w-14 bg-gradient-to-l from-transparent to-zinc-400 dark:to-zinc-600" />
        </div>

        {/* Headline */}
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 animate-[fadeup_0.7s_0.25s_cubic-bezier(.22,1,.36,1)_both]">
          You&apos;ve drifted off the map
        </h2>

        {/* Subtext */}
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 animate-[fadeup_0.7s_0.3s_cubic-bezier(.22,1,.36,1)_both]">
          The page you&apos;re looking for doesn&apos;t exist, was removed,
          or never existed in the first place.
        </p>

        {/* Buttons */}
        <div className="mt-9 flex flex-col sm:flex-row flex-wrap justify-center gap-3 w-full px-2 sm:px-0 animate-[fadeup_0.7s_0.38s_cubic-bezier(.22,1,.36,1)_both]">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-6 py-2.5 text-sm font-bold text-white transition hover:bg-violet-700 active:scale-95 dark:bg-violet-600 dark:hover:bg-violet-500"
          >
            ← Go home
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-6 py-2.5 text-sm font-bold text-violet-800 transition hover:opacity-75 active:scale-95 dark:border-zinc-700 dark:bg-zinc-800/60 dark:text-zinc-300 dark:hover:border-zinc-500"
          >
            Report issue
          </Link>
        </div>

        {/* Mono hint */}
        <p className="mt-12 font-mono text-[11px] text-zinc-300 dark:text-zinc-700 animate-[fadeup_0.7s_0.5s_cubic-bezier(.22,1,.36,1)_both]">
          error_code: <span className="text-zinc-400 dark:text-zinc-500">PAGE_NOT_FOUND</span>
        </p>
      </div>

      <style>{`
        @keyframes fadeup {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes gridpan {
          0%   { background-position: 0 0; }
          100% { background-position: 30px 30px; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50%       { transform: translateY(-18px) scale(1.05); }
        }
        @keyframes flicker {
          0%, 89%, 100% { opacity: 1; transform: skewX(0); }
          90%  { opacity: 0.85; transform: skewX(-1deg) translateX(-2px); }
          91%  { opacity: 1;    transform: skewX(0); }
          93%  { opacity: 0.9;  transform: skewX(1deg) translateX(2px); }
          95%  { opacity: 1;    transform: skewX(0); }
        }
        .glitch::before {
          content: '404';
          position: absolute; top: 0; left: 0; right: 0;
          color: #e24b4a;
          clip-path: polygon(0 0, 100% 0, 100% 38%, 0 38%);
          animation: gt 6s 2s linear infinite;
          pointer-events: none;
        }
        .glitch::after {
          content: '404';
          position: absolute; top: 0; left: 0; right: 0;
          color: #1d9e75;
          clip-path: polygon(0 62%, 100% 62%, 100% 100%, 0 100%);
          animation: gb 6s 2s linear infinite;
          pointer-events: none;
        }
        @keyframes gt {
          0%,88%,100% { transform: translateX(0); opacity: 0; }
          89% { transform: translateX(-5px); opacity: 1; }
          91% { transform: translateX(4px); }
          93% { transform: translateX(-2px); }
          95% { transform: translateX(0); opacity: 0; }
        }
        @keyframes gb {
          0%,86%,100% { transform: translateX(0); opacity: 0; }
          87% { transform: translateX(5px); opacity: 1; }
          89% { transform: translateX(-4px); }
          91% { transform: translateX(2px); }
          93% { transform: translateX(0); opacity: 0; }
        }
      `}</style>
    </main>
  )
}