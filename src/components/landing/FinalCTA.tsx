import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 text-center bg-white text-gray-900 dark:bg-[#0B1120] dark:text-white transition-colors duration-300">
      <div className="max-w-2xl mx-auto">

        {/* Icon */}
        <div className="mx-auto mb-5 sm:mb-6 w-14 h-14 flex items-center justify-center rounded-xl bg-purple-600 dark:bg-purple-500">
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <rect x="3" y="3" width="8" height="20" rx="2.5" fill="white" />
            <rect x="14" y="3" width="9" height="13" rx="2.5" fill="white" opacity=".75" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">
          Get your team on the same page
        </h2>

        {/* Subtitle */}
        <p className="mb-7 sm:mb-8 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Join 50,000+ teams who plan, track, and ship faster with Doify.
        </p>

        {/* Buttons — stack on mobile */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-stretch sm:items-center">
          <Link
            href="/register"
            className="flex items-center justify-center min-h-[48px] px-6 py-3 rounded-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 text-white font-semibold text-[15px] transition-colors shadow-lg shadow-purple-500/25"
          >
            Start for free
          </Link>
          <Link
            href="/login"
            className="flex items-center justify-center min-h-[48px] px-6 py-3 rounded-full font-semibold text-[15px] border border-gray-300 text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-white/10 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}