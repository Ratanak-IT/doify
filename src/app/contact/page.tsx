"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/NavBar";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (form.name && form.email && form.message) setSubmitted(true);
  };

  /* Reusable classes */
  const socialBtn =
    "w-8 h-8 rounded-[7px] border border-[#e2e8f0] bg-[#eef2f7] flex items-center justify-center cursor-pointer transition-all text-[#6b7280] hover:bg-[#ede9ff] hover:border-[#6c47ff] hover:text-[#6c47ff]";

  const footerSocialBtn =
    "w-[34px] h-[34px] rounded-lg bg-[#eef2f7] border border-[#e2e8f0] flex items-center justify-center cursor-pointer text-[#6b7280] transition-all hover:bg-[#ede9ff] hover:text-[#6c47ff] hover:border-[#6c47ff]";

  const fieldInput =
    "px-3.5 py-2.5 border-[1.5px] border-[#e2e8f0] rounded-lg bg-[#eef2f7] text-[0.88rem] text-[#1a1a2e] outline-none transition-all focus:border-[#6c47ff] focus:bg-white placeholder:text-[#adb5bd]";

  return (
    <div className="font-sans bg-[#eef2f7] text-[#1a1a2e]">
      <Navbar />

      {/* ── HERO ── */}
      <motion.section
        className="text-center pt-[72px] pb-[52px] px-6"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 bg-white border border-[#e2e8f0] rounded-full px-4 py-1.5 text-[0.8rem] font-medium text-[#6b7280] mb-7">
          <div className="w-[7px] h-[7px] rounded-full bg-[#6c47ff]" />
          We typically respond within 24 hours
        </div>
        <h1 className="text-[clamp(2.2rem,5vw,3.4rem)] font-extrabold tracking-[-1.5px] leading-[1.15] text-[#1a1a2e] mb-4">
          Get in <span className="text-[#6c47ff]">touch</span> with us
        </h1>
        <p className="text-base text-[#6b7280] max-w-[500px] mx-auto leading-7">
          Have a question, feedback, or just want to say hello? We&apos;d love to hear from you — our team is ready to help.
        </p>
      </motion.section>

      {/* ── CONTACT GRID ── */}
      <div className="max-w-[1060px] mx-auto px-6 pb-24 grid grid-cols-1 md:grid-cols-[1fr_1.7fr] gap-6 items-start">

        {/* ── Info Cards ── */}
        <div className="flex flex-col gap-4">

          {/* Email */}
          <motion.div
            className="bg-white border border-[#e2e8f0] rounded-xl p-[22px]"
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}
          >
            <div className="w-[38px] h-[38px] rounded-[9px] bg-[#ede9ff] flex items-center justify-center mb-3">
              <svg className="w-[19px] h-[19px] text-[#6c47ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 7 10-7"/>
              </svg>
            </div>
            <h3 className="text-[0.88rem] font-semibold mb-1.5">Email us</h3>
            <p className="text-[0.82rem] text-[#6b7280] leading-[1.6]">Send us an email and we&apos;ll get back to you as soon as possible.</p>
            <a href="mailto:support@taskflow.com" className="inline-block mt-1.5 text-[0.82rem] font-medium text-[#6c47ff] no-underline hover:underline">
              support@taskflow.com
            </a>
          </motion.div>

          {/* Office */}
          <motion.div
            className="bg-white border border-[#e2e8f0] rounded-xl p-[22px]"
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.17, duration: 0.4 }}
          >
            <div className="w-[38px] h-[38px] rounded-[9px] bg-[#ede9ff] flex items-center justify-center mb-3">
              <svg className="w-[19px] h-[19px] text-[#6c47ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
            </div>
            <h3 className="text-[0.88rem] font-semibold mb-1.5">Our office</h3>
            <p className="text-[0.82rem] text-[#6b7280] leading-[1.6]">
              Phnom Penh, Cambodia<br/>Mon – Fri, 9:00 AM – 6:00 PM (ICT)
            </p>
          </motion.div>

          {/* Social */}
          <motion.div
            className="bg-white border border-[#e2e8f0] rounded-xl p-[22px]"
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24, duration: 0.4 }}
          >
            <div className="w-[38px] h-[38px] rounded-[9px] bg-[#ede9ff] flex items-center justify-center mb-3">
              <svg className="w-[19px] h-[19px] text-[#6c47ff]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
              </svg>
            </div>
            <h3 className="text-[0.88rem] font-semibold mb-1.5">Follow us</h3>
            <p className="text-[0.82rem] text-[#6b7280] leading-[1.6]">Stay up to date with product updates and news.</p>
            <div className="flex gap-2 mt-2.5">
              <button className={socialBtn} aria-label="Twitter">
                <svg className="w-[14px] h-[14px] fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </button>
              <button className={socialBtn} aria-label="LinkedIn">
                <svg className="w-[14px] h-[14px] fill-current" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </button>
              <button className={socialBtn} aria-label="Instagram">
                <svg className="w-[14px] h-[14px] fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </button>
            </div>
          </motion.div>
        </div>

        {/* ── Form Card ── */}
        <motion.div
          className="bg-white border border-[#e2e8f0] rounded-xl p-9 md:p-[36px]"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.14, duration: 0.5 }}
        >
          {submitted ? (
            <div className="text-center py-14 px-6">
              <div className="w-[54px] h-[54px] rounded-full bg-[#ede9ff] mx-auto mb-4 flex items-center justify-center">
                <svg className="w-[26px] h-[26px]" viewBox="0 0 24 24" fill="none" stroke="#6c47ff" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M20 6L9 17l-5-5"/>
                </svg>
              </div>
              <h3 className="text-[1.2rem] font-bold mb-2">Message sent!</h3>
              <p className="text-[0.88rem] text-[#6b7280]">Thanks for reaching out. We&apos;ll get back to you within 24 hours.</p>
            </div>
          ) : (
            <>
              <h2 className="text-[1.3rem] font-bold tracking-[-0.4px] mb-1.5">Send us a message</h2>
              <p className="text-[0.84rem] text-[#6b7280] mb-7">Fill out the form below and we&apos;ll be in touch soon.</p>

              {/* Name + Email row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.78rem] font-semibold text-[#1a1a2e]">Your name</label>
                  <input className={fieldInput} type="text" name="name" value={form.name} onChange={handleChange} placeholder="John Doe" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-[0.78rem] font-semibold text-[#1a1a2e]">Email address</label>
                  <input className={fieldInput} type="email" name="email" value={form.email} onChange={handleChange} placeholder="john@example.com" />
                </div>
              </div>

              {/* Subject */}
              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-[0.78rem] font-semibold text-[#1a1a2e]">Subject</label>
                <input className={fieldInput} type="text" name="subject" value={form.subject} onChange={handleChange} placeholder="What's this about?" />
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-[0.78rem] font-semibold text-[#1a1a2e]">Message</label>
                <textarea className={`${fieldInput} resize-none`} name="message" value={form.message} onChange={handleChange} rows={6} placeholder="Tell us how we can help…" />
              </div>

              {/* Submit row */}
              <div className="mt-2 flex items-center justify-between gap-3 flex-wrap">
                <span className="text-[0.75rem] text-[#6b7280]">We&apos;ll never share your info with anyone.</span>
                <button
                  className="flex items-center gap-2 px-[26px] py-[11px] rounded-lg bg-[#6c47ff] text-white text-[0.9rem] font-semibold cursor-pointer transition-all hover:bg-[#5535e0] hover:-translate-y-px"
                  onClick={handleSubmit}
                >
                  Send message
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6"/>
                  </svg>
                </button>
              </div>
            </>
          )}
        </motion.div>
      </div>

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
              <button className={footerSocialBtn} aria-label="Twitter">
                <svg className="w-[15px] h-[15px] fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </button>
              <button className={footerSocialBtn} aria-label="LinkedIn">
                <svg className="w-[15px] h-[15px] fill-current" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </button>
              <button className={footerSocialBtn} aria-label="Globe">
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