"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/NavBar";

export default function AboutPage() {
  const teachers = [
    { name: "Mr. John Smith",  subject: "Computer Science",   img: "https://randomuser.me/api/portraits/men/11.jpg" },
    { name: "Ms. Sarah Lee",   subject: "UI/UX Design",       img: "https://randomuser.me/api/portraits/women/44.jpg" },
    { name: "Mr. David Kim",   subject: "Project Management", img: "https://randomuser.me/api/portraits/men/52.jpg" },
  ];

  const team = [
    { name: "Simon Monroe", role: "Founder & CEO",     img: "https://randomuser.me/api/portraits/men/32.jpg" },
    { name: "Robert Todd",  role: "Software Engineer", img: "https://randomuser.me/api/portraits/men/45.jpg" },
    { name: "Ted Norton",   role: "Sales Manager",     img: "https://randomuser.me/api/portraits/men/65.jpg" },
  ];

  const stats = [
    { value: "50K+",  label: "Teams using Doify" },
    { value: "120+",  label: "Countries reached" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "4.9★",  label: "Average rating" },
  ];

  return (
    <div className="font-sans bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white">
      {/* ── HERO ── */}
      <motion.section
        className="text-center pt-24 sm:pt-28 pb-10 sm:pb-16 px-4 sm:px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-1.5 text-[0.8rem] font-medium text-slate-500 dark:text-slate-400 mb-6 sm:mb-7">
          <div className="w-[7px] h-[7px] rounded-full bg-[#6c47ff]" />
          Trusted by 50,000+ teams worldwide
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-slate-950 dark:text-white mb-2">
          Built to keep your <span className="text-[#6c47ff]">team on track,</span>
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl font-semibold text-slate-500 dark:text-slate-400 mb-4">
          Every task. Every deadline. Every sprint.
        </p>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 max-w-md sm:max-w-lg mx-auto mb-7 leading-7">
          Doify is a modern task management platform designed to help teams
          plan smarter, collaborate in real time, and ship work without the chaos.
          From daily to-dos to full project pipelines — we&apos;ve got it covered.
        </p>

        <button className="inline-flex items-center gap-2 px-6 sm:px-7 py-3 rounded-full border-0 bg-[#6c47ff] text-white text-[0.95rem] font-semibold cursor-pointer transition-all duration-150 hover:bg-[#5535e0] hover:-translate-y-px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M20 7H4M16 3l4 4-4 4M4 17h16M8 13l-4 4 4 4" />
          </svg>
          We&apos;re Hiring Now
        </button>

        <div className="mt-8 sm:mt-12 mx-auto max-w-3xl rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 shadow-[0_20px_60px_rgba(108,71,255,0.1),0_4px_16px_rgba(0,0,0,0.06)]">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80"
            alt="Doify team at work"
            className="w-full h-48 sm:h-64 md:h-80 lg:h-[380px] object-cover block"
          />
        </div>
      </motion.section>

      {/* ── STATS STRIP ── */}
      <div className="bg-white dark:bg-slate-900 border-t border-b border-slate-200 dark:border-slate-700 py-7 sm:py-9 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <div className="text-2xl sm:text-[1.9rem] font-extrabold text-[#6c47ff] tracking-tight">{s.value}</div>
              <div className="text-xs sm:text-[0.8rem] text-slate-500 dark:text-slate-400 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── ADVISORS ── */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-slate-50 dark:bg-slate-950">
        <div className="text-center mb-8 sm:mb-12 md:mb-14">
          <span className="inline-block text-[0.72rem] font-semibold tracking-[0.08em] uppercase text-[#6c47ff] bg-violet-100 dark:bg-violet-900/30 px-3 py-1 rounded-full mb-3.5">
            Our Advisors
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white mb-2 leading-tight">
            Guided by <span className="text-[#6c47ff]">Industry Experts</span>
          </h2>
          <p className="text-sm sm:text-[0.95rem] text-slate-500 dark:text-slate-400 max-w-xs sm:max-w-md mx-auto leading-relaxed">
            Our advisors bring deep expertise in productivity tools, software engineering,
            and agile project management — shaping Doify into a world-class platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5 max-w-3xl mx-auto">
          {teachers.map((t, i) => (
            <motion.div
              key={i}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl p-6 sm:p-8 text-center transition-all duration-200 hover:shadow-[0_8px_32px_rgba(108,71,255,0.12)] hover:-translate-y-1"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <img
                src={t.img}
                alt={t.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover mx-auto mb-4 block border-[3px] border-violet-100 dark:border-violet-900"
              />
              <h4 className="font-bold text-sm sm:text-base mb-1">{t.name}</h4>
              <p className="text-xs sm:text-[0.82rem] text-[#6c47ff] font-medium">{t.subject}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white dark:bg-slate-900">
        <div className="text-center mb-8 sm:mb-12 md:mb-14">
          <span className="inline-block text-[0.72rem] font-semibold tracking-[0.08em] uppercase text-[#6c47ff] bg-violet-100 dark:bg-violet-900/30 px-3 py-1 rounded-full mb-3.5">
            Our Team
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-slate-950 dark:text-white mb-2 leading-tight">
            The people <span className="text-[#6c47ff]">behind Doify</span>
          </h2>
          <p className="text-sm sm:text-[0.95rem] text-slate-500 dark:text-slate-400 max-w-xs sm:max-w-md mx-auto leading-relaxed">
            We&apos;re a small, passionate team obsessed with making task management
            feel effortless. We believe great software should get out of your way
            and let you focus on what actually matters — doing the work.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 max-w-3xl mx-auto">
          {team.map((m, i) => (
            <motion.div
              key={i}
              className="text-center"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <img
                src={m.img}
                alt={m.name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 block shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
              />
              <h4 className="font-bold text-sm sm:text-base mb-1">{m.name}</h4>
              <p className="text-xs sm:text-[0.82rem] text-slate-500 dark:text-slate-400 mb-3.5">{m.role}</p>
              <div className="flex justify-center gap-2">
                <button className="w-[30px] h-[30px] rounded-[7px] border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer transition-all text-slate-500 dark:text-slate-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:border-[#6c47ff] hover:text-[#6c47ff]">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </button>
                <button className="w-[30px] h-[30px] rounded-[7px] border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center cursor-pointer transition-all text-slate-500 dark:text-slate-400 hover:bg-violet-100 dark:hover:bg-violet-900/30 hover:border-[#6c47ff] hover:text-[#6c47ff]">
                  <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
    </div>
  );
}