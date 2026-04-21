import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-12 sm:py-20 px-4 sm:px-6 text-center bg-white text-gray-900 dark:bg-[#0B1120] dark:text-white transition-colors duration-300">
      <div className="max-w-2xl mx-auto">

        <h2 className="text-2xl sm:text-3xl font-bold mb-3 leading-tight">
          Get your team on the same page
        </h2>

        <p className="mb-7 sm:mb-8 text-sm sm:text-base text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          Join 50,000+ teams who plan, track, and ship faster with Doify.
        </p>

        <div className="flex flex-col sm:flex-row w-fit mx-auto gap-3 sm:gap-4 justify-center items-stretch sm:items-center p-3">
          <Link
            href="/register"
            className="flex items-center justify-center min-h-[48px] px-6 py-3 rounded-md bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-[15px] transition-colors shadow-lg shadow-blue-500/25"
          >
            Start for free
          </Link>

          <Link
            href="/login"
            className="flex items-center justify-center min-h-[48px] px-6 py-3 rounded-[15px] font-semibold text-[15px] border border-gray-300 text-gray-700 hover:bg-gray-100 active:bg-gray-200 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-white/10 transition-colors"
          >
            Sign in
          </Link>
        </div>
      </div>
    </section>
  );
}
