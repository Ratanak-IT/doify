"use client";

import { motion } from "framer-motion";
import {
  Target, Zap, Heart, Leaf,
  Sparkles, Users, Calendar,
  Rocket, Lightbulb, Code2,
} from "lucide-react";

const GitHubIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);
const FacebookIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);
const TelegramIcon = () => (
  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
  </svg>
);

interface Socials {
  github: string;
  facebook: string;
  telegram: string;
}

const SocialLinks = ({ socials, size = "sm" }: { socials: Socials; size?: "sm" | "md" }) => {
  const base = size === "md" ? "w-9 h-9" : "w-8 h-8";
  const btnClass = `${base} rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 flex items-center justify-center transition-colors duration-200`;
  return (
    <div className="flex gap-2">
      <a href={socials.github}   target="_blank" rel="noopener noreferrer" aria-label="GitHub"   className={`${btnClass} hover:bg-slate-900 hover:text-white`}><GitHubIcon /></a>
      <a href={socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={`${btnClass} hover:bg-blue-600 hover:text-white`}><FacebookIcon /></a>
      <a href={socials.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className={`${btnClass} hover:bg-sky-500 hover:text-white`}><TelegramIcon /></a>
    </div>
  );
};

const advisors = [
  {
    name: "MOM REKSMEY",
    subject: "Frontend",
    img: "/momreaksmey.jpg",
    bio: "Guided and reviewed the project.",
    skills: ["Scrum", "Leadership", "Strategy"],
    socials: {
      github:   "https://github.com/Reksmeys",
      facebook: "https://www.facebook.com/mom.reksmey.12",
      telegram: "https://reksmey_mom",
    },
  },
  {
    name: "CHAN CHHAYA",
    subject: "Backend",
    img: "https://careerpatch.vercel.app/assets/mentor1-CK3orkdg.png",
    bio: "Guided and reviewed the project.",
    skills: ["Spring Microservices"],
    socials: {
      github:   "https://github.com/it-chhaya",
      facebook: "https://www.facebook.com/chhayadevkh",
      telegram: "https://t.me/chhayadevkh",
    },
  },
  {
    name: "KIT TARA",
    subject: "Database",
    img: "https://careerpatch.vercel.app/assets/mentor2-BrhnLDLN.jpg",
    bio: "Guided and reviewed the project.",
    skills: ["Ai Agent"],
    socials: {
      github:   "https://github.com/tarakit",
      facebook: "https://www.facebook.com/drksearcherz",
      telegram: "https://t.me/tarakit",
    },
  },
];

const team = [
  {
    name: "Thai Ratanak",
    role: "Backend and Database",
    img: "/ratanak.jpg",
    bio: "Loves clean code and bad coffee ☕",
    teamRole: "Leader",
    socials: {
      github:   "https://github.com/thairatanak",
      facebook: "https://facebook.com/thairatanak",
      telegram: "https://t.me/thairatanak",
    },
  },
  {
    name: "Chhom Titsela",
    role: "Frontend",
    img: "/sela.png",
    bio: "Turns coffee into scalable backends.",
    teamRole: "Member",
    socials: {
      github:   "https://github.com/chhomtitsela",
      facebook: "https://facebook.com/chhomtitsela",
      telegram: "https://t.me/chhomtitsela",
    },
  },
  {
    name: "Chanthol Vireakratanak",
    role: "Frontend and Reporter",
    img: "/ratanakchanthol.png",
    bio: "Obsessed with making customers successful.",
    teamRole: "Member",
    socials: {
      github:   "https://github.com/chantholvireak",
      facebook: "https://facebook.com/chantholvireak",
      telegram: "https://t.me/chantholvireak",
    },
  },
];

const values = [
  { icon: <Target size={22} />, title: "Clarity over features",  desc: "We say no a lot. Every feature has to earn its place.",                      color: "violet"  },
  { icon: <Zap    size={22} />, title: "Fast by default",        desc: "Every interaction under 100ms. Loading states are a last resort.",            color: "amber"   },
  { icon: <Heart  size={22} />, title: "Built in the open",      desc: "No dark patterns, no hidden fees. Just honest software.",                    color: "rose"    },
  { icon: <Leaf   size={22} />, title: "Sustainable pace",       desc: "We ship what we can maintain. Quality over quantity, always.",                color: "emerald" },
];

const timeline = [
  { date: "Jan 2026", icon: <Lightbulb size={16} />, title: "The idea",         desc: "Frustrated with tools that got in the way, we sketched a simpler alternative on napkins at ISTAD." },
  { date: "Feb 2026", icon: <Code2     size={16} />, title: "First prototype",  desc: "Late nights, bad coffee, and our first working kanban board. It was ugly but it worked." },
  { date: "Mar 2026", icon: <Rocket    size={16} />, title: "MVP launch",       desc: "Pushed to production with real-time collaboration, projects, and dark mode. Shipped > Perfect." },
  { date: "Apr 2026", icon: <Sparkles  size={16} />, title: "You're here 👋",   desc: "Every new user shapes where we go next. Welcome aboard — the story's just beginning." },
];

const credibilityBadges = [
  { icon: <Calendar size={14} />, label: "Founded 2026"      },
  { icon: <Users    size={14} />, label: "Built at ISTAD"    },
  { icon: <Heart    size={14} />, label: "Made in Cambodia"  },
  { icon: <Code2    size={14} />, label: "Open Source"       },
];

const colorMap: Record<string, string> = {
  violet:  "bg-violet-100  text-violet-600  dark:bg-violet-900/30  dark:text-violet-400",
  amber:   "bg-amber-100   text-amber-600   dark:bg-amber-900/30   dark:text-amber-400",
  rose:    "bg-rose-100    text-rose-600    dark:bg-rose-900/30    dark:text-rose-400",
  emerald: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400",
};

// ── Page ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div className="font-sans bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white">

      <motion.section
        className="relative text-center pt-24 sm:pt-28 pb-10 sm:pb-16 px-4 sm:px-6 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div aria-hidden className="absolute top-10 left-1/4 w-72 h-72 rounded-full bg-violet-300/20 dark:bg-violet-600/10 blur-3xl -z-10" />
        <div aria-hidden className="absolute top-32 right-1/4 w-96 h-96 rounded-full bg-pink-300/15 dark:bg-pink-600/10 blur-3xl -z-10" />

        <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-1.5 text-[0.8rem] font-medium text-slate-500 dark:text-slate-400 mb-6 sm:mb-7">
          <div className="w-[7px] h-[7px] rounded-full bg-[#6c47ff] animate-pulse" />
          Building the future of team productivity
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-slate-950 dark:text-white mb-2">
          Built to keep your{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6c47ff] to-pink-500">
            team on track
          </span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-500 dark:text-slate-400 mb-4">
          Every task. Every deadline. Every sprint.
        </p>
        <p className="text-lg sm:text-base text-slate-500 dark:text-slate-400 max-w-md sm:max-w-lg mx-auto mb-7 leading-7">
          Doify is a modern task management platform designed to help teams plan smarter,
          collaborate in real time, and ship work without the chaos. From daily to-dos to
          full project pipelines — we&apos;ve got it covered.
        </p>

        <div className="mt-8 sm:mt-12 mx-auto max-w-3xl rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
          <img
            src="/team.jpg"
            alt="Doify team at work"
            className="w-full h-48 sm:h-64 md:h-80 lg:h-[380px] object-cover block"
          />
        </div>
      </motion.section>

      {/* ── CREDIBILITY STRIP ── */}
      <div className="bg-white dark:bg-slate-900 border-t border-b border-slate-200 dark:border-slate-700 py-6 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          {credibilityBadges.map((b, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-300"
            >
              <span className="text-[#6c47ff]">{b.icon}</span>
              {b.label}
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── VALUES ── */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block text-[0.72rem] font-semibold tracking-[0.08em] uppercase text-[#6c47ff] bg-violet-100 dark:bg-violet-900/30 px-3 py-1 rounded-full mb-3.5">
              What we believe
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white mb-3 leading-tight">
              Principles that <span className="text-[#6c47ff]">guide every pixel</span>
            </h2>
            <p className="text-sm sm:text-[0.95rem] text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              We say these out loud so you can hold us to them.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${colorMap[v.color]}`}>
                  {v.icon}
                </div>
                <h3 className="font-bold text-base mb-1.5 text-slate-950 dark:text-white">{v.title}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TIMELINE ── */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-white dark:bg-slate-900 border-y border-slate-200 dark:border-slate-700">
        <div className="relative max-w-2xl mx-auto">
          <div
            aria-hidden
            className="absolute left-[22px] top-3 bottom-3 w-px bg-gradient-to-b from-[#6c47ff]/50 via-[#6c47ff]/30 to-transparent"
          />
          <div className="space-y-10">
            {timeline.map((t, i) => (
              <motion.div
                key={t.date}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="relative flex items-start gap-5"
              >
                <div className="relative shrink-0 w-11 h-11 rounded-full bg-[#6c47ff] text-white flex items-center justify-center ring-4 ring-white dark:ring-slate-900 z-10">
                  {t.icon}
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className="text-xs font-semibold tracking-wider uppercase text-[#6c47ff] mb-1">{t.date}</p>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-950 dark:text-white mb-1.5">{t.title}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{t.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ADVISORS ── */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block text-[0.72rem] font-semibold tracking-[0.08em] uppercase text-[#6c47ff] bg-violet-100 dark:bg-violet-900/30 px-3 py-1 rounded-full mb-3.5">
              Our advisors
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white mb-3 leading-tight">
              Guided by <span className="text-[#6c47ff]">industry experts</span>
            </h2>
            <p className="text-sm sm:text-[0.95rem] text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              Advisors with deep expertise in productivity, engineering, and agile —
              shaping Doify into a world-class platform.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 max-w-5xl mx-auto">
            {advisors.map((a, i) => {
              const entrance =
                i === 0
                  ? { initial: { opacity: 0, x: -120 }, whileInView: { opacity: 1, x: 0 } }
                  : i === 1
                  ? { initial: { opacity: 0, x: 120  }, whileInView: { opacity: 1, x: 0 } }
                  : { initial: { opacity: 0, y: 60   }, whileInView: { opacity: 1, y: 0 } };

              const centerClass =
                i === 2
                  ? "lg:col-span-2 lg:max-w-[calc(50%-10px)] lg:justify-self-center w-full"
                  : "";

              return (
                <motion.div
                  key={a.name}
                  initial={entrance.initial}
                  whileInView={entrance.whileInView}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.15, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className={`bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-7 overflow-hidden ${centerClass}`}
                >
                  <div className="flex items-center gap-5 mb-5">
                    <div className="shrink-0">
                      <img
                        src={a.img}
                        alt={a.name}
                        className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-[3px] border-white dark:border-slate-800"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xl sm:text-2xl text-slate-950 dark:text-white mb-1.5 leading-tight">{a.name}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                        Lecturer · <span className="text-slate-700 dark:text-slate-300 font-medium">{a.subject}</span>
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-500 dark:text-slate-400 mb-3">
                        <span>Specializations</span>
                        <span className="text-slate-950 dark:text-white font-semibold">{a.skills[0]}</span>
                      </div>
                      <SocialLinks socials={a.socials} size="sm" />
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-800 mb-4" />

                  <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#6c47ff] shrink-0" />
                    <p className="text-sm text-slate-600 dark:text-slate-300 italic">{a.bio}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <span className="inline-block text-[0.72rem] font-semibold tracking-[0.08em] uppercase text-[#6c47ff] bg-violet-100 dark:bg-violet-900/30 px-3 py-1 rounded-full mb-3.5">
              Our team
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white mb-3 leading-tight">
              The people <span className="text-[#6c47ff]">behind Doify</span>
            </h2>
            <p className="text-sm sm:text-[0.95rem] text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
              A small, passionate team obsessed with making task management feel effortless.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {team.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-8 text-center overflow-hidden"
              >
                <div className="inline-block mb-5">
                  <img
                    src={m.img}
                    alt={m.name}
                    className="w-36 h-36 sm:w-40 sm:h-40 rounded-full object-cover border-4 border-white dark:border-slate-800"
                  />
                </div>

                <h4 className="font-bold text-lg text-slate-950 dark:text-white mb-1">{m.name}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">{m.role}</p>

                <div className="flex justify-center gap-2 mb-5">
                  <SocialLinks socials={m.socials} size="md" />
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-4" />

                <div className="flex items-center justify-center gap-1.5 text-sm mt-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#6c47ff]" />
                  <span className="font-medium text-slate-600 dark:text-slate-300">{m.teamRole ?? "Member"}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}