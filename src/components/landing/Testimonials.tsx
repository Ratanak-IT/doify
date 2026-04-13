const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "Product Manager · Shopify",
    initials: "SC",
    color: "#6C5CE7",
    text: "Doify transformed how our team ships features. We went from chaos to clarity in two weeks flat. Now every sprint is predictable.",
  },
  {
    name: "Marcus Reid",
    role: "CTO · Vercel",
    initials: "MR",
    color: "#216e4e",
    text: "The Kanban view alone is worth switching for. Every engineer uses it daily. It replaced three other tools overnight.",
  },
  {
    name: "Priya Nair",
    role: "Design Lead · Figma",
    initials: "PN",
    color: "#5e4db2",
    text: "Finally, a project tool designers actually enjoy. Flexible enough for creative work, structured enough for stakeholders.",
  },
];

export default function Testimonials() {
  return (
    <section className="lp-section bg-white text-gray-900 dark:bg-[#0B1120] dark:text-white transition-colors duration-300">
      <div className="lp-container">

        {/* Header */}
        <div className="lp-section-header text-center">
          <h2 className="lp-section-title text-2xl md:text-3xl font-bold dark:text-gray-300">
            Loved by 50,000+ teams
          </h2>

          <p className="lp-section-sub text-gray-500 dark:text-gray-300">
            Don&apos;t take our word for it.
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 mt-8 sm:mt-10">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="lp-testi-card rounded-xl p-6 shadow-md
              bg-white dark:bg-[#111827]
              border border-gray-100 dark:border-gray-700
              transition-all duration-300 hover:shadow-lg"
            >

              {/* Stars */}
              <div className="lp-stars flex gap-1 mb-3">
                {Array(5).fill(0).map((_, s) => (
                  <svg
                    key={s}
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="#f59e0b"
                  >
                    <path d="M7 1l1.545 3.09L12 4.635l-2.5 2.43.59 3.435L7 8.91l-3.09 1.59L4.5 7.065 2 4.635l3.455-.545z" />
                  </svg>
                ))}
              </div>

              {/* Text */}
              <p className="lp-testi-text text-gray-700 dark:text-white mb-5">
                “{t.text}”
              </p>

              {/* Author */}
              <div className="lp-testi-author flex items-center gap-3">
                <div
                  className="lp-testi-av w-10 h-10 flex items-center justify-center rounded-full text-white font-bold"
                  style={{ background: t.color }}
                >
                  {t.initials}
                </div>

                <div>
                  <p className="lp-testi-name font-semibold text-gray-900 dark:text-white">
                    {t.name}
                  </p>
                  <p className="lp-testi-role text-sm text-gray-500 dark:text-white/70">
                    {t.role}
                  </p>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}