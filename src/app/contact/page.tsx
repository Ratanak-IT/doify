"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  MessageSquare,
  Send,
  ExternalLink,
  HelpCircle,
  MapPin,
  Mail,
  Clock,
  AlertTriangle,
  Twitter,
  Linkedin,
  Instagram,
} from "lucide-react";

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    if (form.name && form.email && form.message) setSubmitted(true);
  };

  const canSubmit = form.name && form.email && form.message;

  const faqs = [
    {
      q: "How do I submit a proposal?",
      a: 'Open the job details page and click "Submit Proposal".',
    },
    {
      q: "Why is my account restricted?",
      a: "Check your email or contact support for verification issues.",
    },
    {
      q: "How do I report a scam job?",
      a: 'Click "Report Job" on the job detail page.',
    },
  ];

  const contactInfo = [
    {
      icon: <Mail size={14} />,
      dot: "bg-blue-500",
      label: "Email",
      value: "support@doify.com",
    },
    {
      icon: <Clock size={14} />,
      dot: "bg-emerald-500",
      label: "Response time",
      value: "24–48 hours",
    },
    {
      icon: <MapPin size={14} />,
      dot: "bg-violet-500",
      label: "Location",
      value: "Phnom Penh, Cambodia",
    },
  ];

  const fieldInput =
    "w-full h-11 px-3.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-950 dark:text-white outline-none transition-all focus:border-[#6c47ff] focus:ring-2 focus:ring-[#6c47ff]/15 placeholder:text-slate-400 dark:placeholder:text-slate-500";

  // Google Maps embed — Science and Technology Advanced (ISTAD), Phnom Penh
  const mapEmbedSrc =
    "https://maps.google.com/maps?q=11.585256,104.901402&hl=en&z=16&output=embed";
  const mapsLink =
    "https://www.google.com/maps/place/Science+and+Technology+Advanced+Development+Co.,+Ltd./@11.585256,104.901402,15z/data=!4m6!3m5!1s0x310951e96d257a6f:0x6b66703c5fc0c7cc!8m2!3d11.585256!4d104.9014024";

  return (
    <div className="font-sans bg-slate-50 dark:bg-slate-950 text-slate-950 dark:text-white min-h-screen">
      {/* ── HERO ── */}
      <motion.section
        className="text-center pt-24 sm:pt-28 pb-8 sm:pb-10 px-4 sm:px-6"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="inline-flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-full px-4 py-1.5 text-[0.8rem] font-medium text-slate-500 dark:text-slate-400 mb-5">
          <div className="w-[7px] h-[7px] rounded-full bg-[#6c47ff] animate-pulse" />
          We typically respond within 24 hours
        </div>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight text-slate-950 dark:text-white mb-3">
          Get in <span className="text-blue-600 dark:text-gray-100">touch</span>{" "}
          with us
        </h1>
        <p className="text-xl sm:text-base text-slate-500 dark:text-slate-400 max-w-sm sm:max-w-md mx-auto leading-7">
          Have a question, feedback, or just want to say hello? We&apos;d love
          to hear from you.
        </p>
      </motion.section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-14 sm:pb-20 grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-start">
        {/* ── LEFT: Message Form ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-7 lg:sticky lg:top-24"
        >
          {submitted ? (
            <div className="text-center py-14 px-6">
              <div className="w-14 h-14 rounded-full bg-violet-100 dark:bg-violet-900/30 mx-auto mb-4 flex items-center justify-center">
                <Send size={24} className="text-[#6c47ff]" />
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-950 dark:text-white">
                Message sent!
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Thanks for reaching out. We&apos;ll reply within 24–48 hours.
              </p>
            </div>
          ) : (
            <>
              {/* Header */}
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shrink-0">
                  <MessageSquare size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-950 dark:text-white">
                    Send us a Message
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    We&apos;ll get back to you soon
                  </p>
                </div>
              </div>

              {/* Name + Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-slate-950 dark:text-white">
                    Name
                  </label>
                  <input
                    className={fieldInput}
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Smith"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-1.5 text-slate-950 dark:text-white">
                    Email
                  </label>
                  <input
                    className={fieldInput}
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="johnsmith@gmail.com"
                  />
                </div>
              </div>

              {/* Company */}
              <div className="mb-4">
                <label className="block text-sm font-semibold mb-1.5 text-slate-950 dark:text-white">
                  Company{" "}
                  <span className="font-normal text-slate-400 dark:text-slate-500">
                    (optional)
                  </span>
                </label>
                <input
                  className={fieldInput}
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Your company name"
                />
              </div>

              {/* Message */}
              <div className="mb-5">
                <label className="block text-sm font-semibold mb-1.5 text-slate-950 dark:text-white">
                  Message
                </label>
                <textarea
                  className={`${fieldInput} h-28 py-2.5 resize-none`}
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Write your message…"
                />
              </div>

              <div className="flex justify-center">
                <button
                  onClick={handleSubmit}
                  disabled={!canSubmit}
                  className={`w-fit px-4 h-12 flex items-center justify-center gap-2 rounded-xl text-sm font-semibold transition-all ${
                    canSubmit
                      ? "bg-[#6c47ff] hover:bg-[#5535e0] text-white shadow-lg shadow-violet-500/25 hover:-translate-y-px"
                      : "bg-[#a3b3ff] dark:bg-[#4a3fb0] text-white cursor-not-allowed"
                  }`}
                >
                  {canSubmit ? <Send size={15} /> : <AlertTriangle size={15} />}
                  Send Message
                </button>
              </div>

              <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-3">
                We&apos;ll reply to your email as soon as possible.
              </p>
            </>
          )}
        </motion.div>

        {/* ── RIGHT: Map + FAQ + Contact Info ── */}
        <div className="flex flex-col gap-5 sm:gap-6">
          {/* Map card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.4 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl overflow-hidden relative"
          >
           
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute top-3 left-3 z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm text-xs font-semibold dark:text-white text-blue-600 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Open in Maps <ExternalLink size={12} />
            </a>

            <iframe
              src={mapEmbedSrc}
              width="100%"
              height="280"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              className="block w-full h-[240px] sm:h-[280px]"
              title="Our location"
            />
          </motion.div>

          {/* Quick Answer (FAQ) card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-7"
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center shrink-0">
                <HelpCircle size={18} className="text-white" />
              </div>
              <h3 className="text-base font-bold text-slate-950 dark:text-white">
                Quick Answer
              </h3>
            </div>

            <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-800">
              {faqs.map((f, i) => (
                <div key={i} className={i > 0 ? "pt-4" : ""}>
                  <h4 className="text-lg font-bold text-slate-950 dark:text-white mb-1">
                    {f.q}
                  </h4>
                  <p className="text-md text-slate-500 dark:text-slate-400 leading-relaxed">
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Contact info card */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.4 }}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl p-6 sm:p-7"
          >
            <h3 className="text-base font-bold text-slate-950 dark:text-white mb-4">
              Contact
            </h3>

            <ul className="space-y-3">
              {contactInfo.map((c) => (
                <li key={c.label} className="flex items-center gap-3 text-sm">
                  <span className={`w-2 h-2 rounded-full shrink-0 ${c.dot}`} />
                  <span className="text-slate-500 text-lg dark:text-slate-400">
                    {c.label}:
                  </span>
                  <span className="text-slate-950 text-md dark:text-white font-medium break-all">
                    {c.value}
                  </span>
                </li>
              ))}
            </ul>

            {/* Social */}
            <div className="mt-5 pt-5 border-t border-slate-100 dark:border-slate-800">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide mb-3">
                Follow us
              </p>
              <div className="flex gap-2">
                {[
                  { icon: <Twitter size={14} />, label: "Twitter" },
                  { icon: <Linkedin size={14} />, label: "LinkedIn" },
                  { icon: <Instagram size={14} />, label: "Instagram" },
                ].map((s) => (
                  <a
                    key={s.label}
                    href="#"
                    aria-label={s.label}
                    className="w-9 h-9 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:bg-[#6c47ff] hover:text-white hover:border-[#6c47ff] transition-all"
                  >
                    {s.icon}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
