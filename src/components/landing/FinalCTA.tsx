import Link from "next/link";

export default function FinalCTA() {
  return (
    <section
      className="
        py-20 px-6 text-center
        bg-white text-gray-900
        dark:bg-[#0B1120] dark:text-white
        transition-colors duration-300
      "
    >
      <div className="max-w-3xl mx-auto">

        {/* Icon */}
        <div
          className="
            mx-auto mb-6 w-14 h-14 flex items-center justify-center
            rounded-xl
            bg-purple-600
            dark:bg-purple-500
          "
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <rect x="3" y="3" width="8" height="20" rx="2.5" fill="white" />
            <rect x="14" y="3" width="9" height="13" rx="2.5" fill="white" opacity=".75" />
          </svg>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold mb-3">
          Get your team on the same page
        </h2>

        {/* Subtitle */}
        <p className="mb-8 text-gray-600 dark:text-gray-400">
          Join 50,000+ teams who plan, track, and ship faster with TaskFlow.
        </p>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">

          <Link
            href="/register"
            className="
              px-6 py-3 rounded-full
              bg-purple-600 hover:bg-purple-700
              text-white font-medium
              transition
            "
          >
            Start for free
          </Link>

          <Link
            href="/login"
            className="
              px-6 py-3 rounded-full font-medium
              border
              border-gray-300 text-gray-700
              hover:bg-gray-100
              dark:border-gray-600 dark:text-gray-300
              dark:hover:bg-[#111827]
              transition
            "
          >
            Sign in
          </Link>

        </div>
      </div>
    </section>
  );
}