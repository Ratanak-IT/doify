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
    { value: "50K+",  label: "Teams using TaskFlow" },
    { value: "120+",  label: "Countries reached" },
    { value: "99.9%", label: "Uptime SLA" },
    { value: "4.9★",  label: "Average rating" },
  ];

  return (
    <div className="font-sans bg-[#eef2f7] text-[#1a1a2e]">
      <Navbar />

      {/* ── HERO ── */}
      <motion.section
        className="text-center pt-[72px] pb-[60px] px-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-full px-4 py-1.5 text-[0.8rem] font-medium text-[#6b7280] mb-7">
          <div className="w-[7px] h-[7px] rounded-full bg-[#6c47ff]" />
          Trusted by 50,000+ teams worldwide
        </div>

        <h1 className="text-[clamp(2.2rem,5vw,3.4rem)] font-extrabold tracking-[-1.5px] leading-[1.15] text-[#1a1a2e] mb-2">
          Built to keep your <span className="text-[#6c47ff]">team on track,</span>
        </h1>
        <p className="text-[clamp(1.2rem,3vw,1.8rem)] font-semibold text-[#6b7280] mb-4">
          Every task. Every deadline. Every sprint.
        </p>
        <p className="text-base text-[#6b7280] max-w-[500px] mx-auto mb-7 leading-7">
          TaskFlow is a modern task management platform designed to help teams
          plan smarter, collaborate in real time, and ship work without the chaos.
          From daily to-dos to full project pipelines — we&apos;ve got it covered.
        </p>

        <button className="inline-flex items-center gap-2 px-7 py-3 rounded-full border-0 bg-[#6c47ff] text-white text-[0.95rem] font-semibold cursor-pointer transition-all duration-150 hover:bg-[#5535e0] hover:-translate-y-px">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M20 7H4M16 3l4 4-4 4M4 17h16M8 13l-4 4 4 4" />
          </svg>
          We&apos;re Hiring Now
        </button>

        <div className="mt-12 mx-auto max-w-[960px] rounded-2xl overflow-hidden border border-[#e2e8f0] shadow-[0_20px_60px_rgba(108,71,255,0.1),0_4px_16px_rgba(0,0,0,0.06)]">
          <img
            src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1200&q=80"
            alt="TaskFlow team at work"
            className="w-full h-[380px] object-cover block"
          />
        </div>
      </motion.section>

      {/* ── STATS STRIP ── */}
      <div className="bg-white border-t border-b border-[#e2e8f0] py-9 px-6">
        <div className="max-w-[860px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
            >
              <div className="text-[1.9rem] font-extrabold text-[#6c47ff] tracking-[-1px]">{s.value}</div>
              <div className="text-[0.8rem] text-[#6b7280] mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── ADVISORS ── */}
      <section className="py-20 px-6 bg-[#eef2f7]">
        <div className="text-center mb-14">
          <span className="inline-block text-[0.72rem] font-semibold tracking-[0.08em] uppercase text-[#6c47ff] bg-[#ede9ff] px-3 py-1 rounded-full mb-3.5">
            Our Advisors
          </span>
          <h2 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-extrabold tracking-[-0.8px] text-[#1a1a2e] mb-2 leading-tight">
            Guided by <span className="text-[#6c47ff]">Industry Experts</span>
          </h2>
          <p className="text-[0.95rem] text-[#6b7280] max-w-[480px] mx-auto leading-[1.7]">
            Our advisors bring deep expertise in productivity tools, software engineering,
            and agile project management — shaping TaskFlow into a world-class platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[960px] mx-auto">
          {teachers.map((t, i) => (
            <motion.div
              key={i}
              className="bg-white border border-[#e2e8f0] rounded-xl p-8 text-center transition-all duration-200 hover:shadow-[0_8px_32px_rgba(108,71,255,0.12)] hover:-translate-y-1"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <img
                src={t.img}
                alt={t.name}
                className="w-24 h-24 rounded-full object-cover mx-auto mb-4 block border-[3px] border-[#ede9ff]"
              />
              <h4 className="font-bold text-base mb-1">{t.name}</h4>
              <p className="text-[0.82rem] text-[#6c47ff] font-medium">{t.subject}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-20 px-6 bg-white">
        <div className="text-center mb-14">
          <span className="inline-block text-[0.72rem] font-semibold tracking-[0.08em] uppercase text-[#6c47ff] bg-[#ede9ff] px-3 py-1 rounded-full mb-3.5">
            Our Team
          </span>
          <h2 className="text-[clamp(1.6rem,3.5vw,2.4rem)] font-extrabold tracking-[-0.8px] text-[#1a1a2e] mb-2 leading-tight">
            The people <span className="text-[#6c47ff]">behind TaskFlow</span>
          </h2>
          <p className="text-[0.95rem] text-[#6b7280] max-w-[480px] mx-auto leading-[1.7]">
            We&apos;re a small, passionate team obsessed with making task management
            feel effortless. We believe great software should get out of your way
            and let you focus on what actually matters — doing the work.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[960px] mx-auto">
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
                className="w-[100px] h-[100px] rounded-full object-cover mx-auto mb-4 block shadow-[0_4px_20px_rgba(0,0,0,0.1)]"
              />
              <h4 className="font-bold text-base mb-1">{m.name}</h4>
              <p className="text-[0.82rem] text-[#6b7280] mb-3.5">{m.role}</p>
              <div className="flex justify-center gap-2">
                {/* Twitter */}
                <button
                  className="w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-[#eef2f7] flex items-center justify-center cursor-pointer transition-all text-[#6b7280] hover:bg-[#ede9ff] hover:border-[#6c47ff] hover:text-[#6c47ff]"
                  aria-label="Twitter"
                >
                  <svg className="w-[13px] h-[13px] fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </button>
                {/* LinkedIn */}
                <button
                  className="w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-[#eef2f7] flex items-center justify-center cursor-pointer transition-all text-[#6b7280] hover:bg-[#ede9ff] hover:border-[#6c47ff] hover:text-[#6c47ff]"
                  aria-label="LinkedIn"
                >
                  <svg className="w-[13px] h-[13px] fill-current" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </button>
                {/* Instagram */}
                <button
                  className="w-[30px] h-[30px] rounded-[7px] border border-[#e2e8f0] bg-[#eef2f7] flex items-center justify-center cursor-pointer transition-all text-[#6b7280] hover:bg-[#ede9ff] hover:border-[#6c47ff] hover:text-[#6c47ff]"
                  aria-label="Instagram"
                >
                  <svg className="w-[13px] h-[13px] fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                  </svg>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-white border-t border-[#e2e8f0] text-[#6b7280] pt-14 pb-8 px-8">
        <div className="max-w-[1100px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-3.5">
              <div className="w-8 h-8 rounded-lg bg-[#6c47ff] flex items-center justify-center flex-shrink-0">
                <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
                  <path d="M3 5h14M3 10h10M3 15h7" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="font-bold text-base text-[#1a1a2e]">TaskFlow</span>
            </div>
            <p className="text-[0.82rem] leading-[1.65] text-[#6b7280] max-w-[240px]">
              Simplifying teamwork and productivity for everyone, everywhere.
            </p>
            <div className="flex gap-2.5 mt-5">
              {/* Twitter */}
              <button className="w-[34px] h-[34px] rounded-lg bg-[#eef2f7] border border-[#e2e8f0] flex items-center justify-center cursor-pointer text-[#6b7280] transition-all hover:bg-[#ede9ff] hover:text-[#6c47ff] hover:border-[#6c47ff]" aria-label="Twitter">
                <svg className="w-[15px] h-[15px] fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
              {/* LinkedIn */}
              <button className="w-[34px] h-[34px] rounded-lg bg-[#eef2f7] border border-[#e2e8f0] flex items-center justify-center cursor-pointer text-[#6b7280] transition-all hover:bg-[#ede9ff] hover:text-[#6c47ff] hover:border-[#6c47ff]" aria-label="LinkedIn">
                <svg className="w-[15px] h-[15px] fill-current" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </button>
              {/* Globe */}
              <button className="w-[34px] h-[34px] rounded-lg bg-[#eef2f7] border border-[#e2e8f0] flex items-center justify-center cursor-pointer text-[#6b7280] transition-all hover:bg-[#ede9ff] hover:text-[#6c47ff] hover:border-[#6c47ff]" aria-label="Globe">
                <svg className="w-[15px] h-[15px]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M2 12h20M12 2a15.3 15.3 0 010 20M12 2a15.3 15.3 0 000 20" />
                </svg>
              </button>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-[0.75rem] font-semibold text-[#1a1a2e] uppercase tracking-[0.07em] mb-4">Company</h4>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
              <li><Link href="/about" className="text-[0.83rem] text-[#6b7280] no-underline transition-colors hover:text-[#6c47ff]">About Us</Link></li>
              <li><Link href="/contact" className="text-[0.83rem] text-[#6b7280] no-underline transition-colors hover:text-[#6c47ff]">Contact</Link></li>
              <li><Link href="#" className="text-[0.83rem] text-[#6b7280] no-underline transition-colors hover:text-[#6c47ff]">Careers</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-[0.75rem] font-semibold text-[#1a1a2e] uppercase tracking-[0.07em] mb-4">Resources</h4>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
              <li><Link href="#" className="text-[0.83rem] text-[#6b7280] no-underline transition-colors hover:text-[#6c47ff]">Blog</Link></li>
              <li><Link href="#" className="text-[0.83rem] text-[#6b7280] no-underline transition-colors hover:text-[#6c47ff]">Help Center</Link></li>
              <li><Link href="#" className="text-[0.83rem] text-[#6b7280] no-underline transition-colors hover:text-[#6c47ff]">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-[0.75rem] font-semibold text-[#1a1a2e] uppercase tracking-[0.07em] mb-4">Product</h4>
            <ul className="flex flex-col gap-2.5 list-none p-0 m-0">
              <li><Link href="#" className="text-[0.83rem] text-[#6b7280] no-underline transition-colors hover:text-[#6c47ff]">Features</Link></li>
              <li><Link href="#" className="text-[0.83rem] text-[#6b7280] no-underline transition-colors hover:text-[#6c47ff]">Pricing</Link></li>
              <li><Link href="#" className="text-[0.83rem] text-[#6b7280] no-underline transition-colors hover:text-[#6c47ff]">Changelog</Link></li>
            </ul>
          </div>
        </div>

        <hr className="border-none border-t border-[#e2e8f0] max-w-[1100px] mx-auto mb-6" />

        <div className="max-w-[1100px] mx-auto flex items-center justify-between flex-wrap gap-2">
          <span className="text-[0.75rem] text-[#94a3b8]">© 2026 TaskFlow. All rights reserved.</span>
          <span className="text-[0.75rem] text-[#94a3b8]">Made with ♥ in Phnom Penh</span>
        </div>
      </footer>
    </div>
  );
}