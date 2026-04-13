const step = [
  {
    num: "01",
    title: "Create your board",
    desc: "Set up a project in seconds. Add columns to match exactly how your team works — no rigid templates.",
  },
  {
    num: "02",
    title: "Add cards for every task",
    desc: "Each card holds everything: description, checklist, due date, files, and team conversations.",
  },
  {
    num: "03",
    title: "Move work forward",
    desc: "Drag cards across columns as work progresses. Everyone sees the same source of truth, in real time.",
  },
];

const status = [
  {
    label: "To Do",
    color: "#94a3b8",
    items: ["Research pricing", "Define OKRs", "Write tests"],
  },
  {
    label: "In Progress",
    color: "#6C5CE7",
    items: ["Redesign onboarding", "API refactor"],
  },
  {
    label: "Done",
    color: "#22c55e",
    items: ["v2.4 release", "Nav bug fix"],
  },
];

export default function HowItWorks() {
  return (
    <section
      id="templates"
      className="
        lp-section lp-section--gray
        bg-gray-50 text-gray-900
        dark:bg-[#0B1120] dark:text-white
        transition-colors duration-300
      "
    >
      <div className="lp-container px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="lp-hiw-content">
            <span
              className="lp-eyebrow 
              text-blue-600 dark:text-gray-200"
            >
              How it works
            </span>

            <h2
              className="lp-section-title
              text-gray-900 dark:text-white"
            >
              From backlog to shipped
              <br />
              in minutes
            </h2>

            <div className="lp-steps">
              {step.map((s) => (
                <div key={s.num} className="lp-step">
                  <div
                    className="lp-step-num
                    bg-gray-200 text-gray-800
                    dark:bg-gray-700 dark:text-gray-200"
                  >
                    {s.num}
                  </div>

                  <div>
                    <h3
                      className="lp-step-title
                      text-gray-900 dark:text-white"
                    >
                      {s.title}
                    </h3>

                    <p
                      className="lp-step-desc
                      text-gray-600 dark:text-gray-300"
                    >
                      {s.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <a
              href="/register"
              className="bg-blue-600 text-white font-bold rounded-md lp-btn-md"
              style={{ marginTop: 28, display: "inline-block" }}
            >
              Try it now →
            </a>
          </div>

          <div
            className="lp-hiw-preview
            bg-white dark:bg-[#111827]
            border border-gray-200 dark:border-gray-700
            rounded-xl"
          >
            <div className="lp-preview-header">
              <div className="lp-preview-dots">
                <span />
                <span />
                <span />
              </div>
              <span
                className="lp-preview-title
                text-gray-700 dark:text-gray-300"
              >
                Sprint 12
              </span>
            </div>

            <div className="lp-preview-board dark:bg-gray-400">
              {status.map((col, ci) => (
                <div key={ci} className="lp-preview-col dark:bg-gray-300">
                  <div className="lp-preview-col-head">
                    <span
                      className="lp-preview-dot"
                      style={{ background: col.color }}
                    />
                    <span
                      className="lp-preview-col-label
                      text-gray-800 dark:text-gray-500 "
                    >
                      {col.label}
                    </span>
                    <span
                      className="lp-preview-col-count
                      text-gray-500 dark:text-gray-400"
                    >
                      {col.items.length}
                    </span>
                  </div>

                  {col.items.map((item, ii) => (
                    <div
                      key={ii}
                      className="lp-preview-card
                        bg-gray-100 text-gray-800
                        dark:bg-gray-500 dark:text-gray-200 text-[15px]"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
