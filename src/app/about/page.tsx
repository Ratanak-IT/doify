"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AboutPage() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen">
      {/* NEW HEADER — exactly like the TaskFlow homepage */}
      <nav className={`lp-nav${scrolled ? " lp-nav--scrolled" : ""}`}>
        <div className="lp-nav-inner">
          {/* TaskFlow Logo — clickable to go home */}
          <Link href="/" className="lp-logo-wrap">
            <div className="lp-logo-mark">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
                <rect x="2" y="2" width="5" height="12" rx="1.5" fill="white" />
                <rect x="9" y="2" width="5" height="8" rx="1.5" fill="white" opacity=".8" />
              </svg>
            </div>
            <span className="lp-logo-text">TaskFlow</span>
          </Link>

          {/* Same nav links as homepage (About Us stays on this page) */}
          <div className="lp-nav-links">
            <Link href="/#features" className="lp-nav-link">
              Features
            </Link>
            <Link href="/#templates" className="lp-nav-link">
              Templates
            </Link>
            <Link href="/about" className="lp-nav-link lp-nav-link--active">
              About Us
            </Link>
            <Link href="/#enterprise" className="lp-nav-link">
              Enterprise
            </Link>
          </div>

          <div className="lp-nav-actions">
            <Link href="/login" className="lp-btn-ghost">
              Log in
            </Link>
            <Link href="/register" className="lp-btn-primary lp-btn-sm">
              Get started free
            </Link>
          </div>
        </div>
      </nav>

      {/* Rest of your About page stays exactly the same */}
      <div className="max-w-7xl mx-auto px-6 pt-12 grid md:grid-cols-2 gap-16">
        {/* LEFT COLUMN - OUR GOAL + TEAM + HIRING + NEWSLETTER */}
        <div className="space-y-16">
          {/* OUR GOAL */}
          <section>
            <div className="flex items-center gap-x-4 mb-6">
              <h1 className="text-4xl font-semibold tracking-tight">Our Goal</h1>
              <div className="h-px flex-1 bg-gradient-to-r from-purple-200 to-transparent" />
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Illustration */}
              <div className="lg:col-span-5 bg-white rounded-3xl p-8 shadow-sm flex justify-center">
                <div className="relative w-64 h-64">
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-purple-100 rounded-3xl rotate-12 flex items-center justify-center">
                    <span className="text-7xl">📋</span>
                  </div>
                  <motion.div
                    animate={{ y: [0, -12, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                    className="absolute left-8 top-8 bg-white rounded-2xl shadow-xl p-4 w-52"
                  >
                    <div className="flex items-center gap-x-3 mb-4">
                      <div className="w-8 h-8 bg-purple-600 text-white rounded-xl flex items-center justify-center text-xl">👔</div>
                      <div className="flex-1 space-y-2">
                        <div className="h-2 bg-gray-200 rounded-full w-3/4" />
                        <div className="h-2 bg-gray-200 rounded-full w-1/2" />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <div className="bg-emerald-400 text-white text-xs px-4 py-1 rounded-3xl flex items-center gap-x-1">
                        <span>+</span>
                        <span className="font-medium">Task</span>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Text */}
              <div className="lg:col-span-7">
                <p className="text-lg leading-relaxed text-gray-600">
                  Pushing the limits without sacrificing a bit on work after work? 
                  Growly teams up with you to make remarkable adjustments and streamlined 
                  workflows to help your team be more productive and easier to communicate.
                </p>
                
                <ul className="mt-8 space-y-4">
                  <li className="flex gap-x-3">
                    <span className="text-purple-600 text-xl">✔</span>
                    <span className="text-gray-700">Collaborate across teams and keep everyone on the same page</span>
                  </li>
                  <li className="flex gap-x-3">
                    <span className="text-purple-600 text-xl">✔</span>
                    <span className="text-gray-700">Public and private channels to communicate with anyone</span>
                  </li>
                  <li className="flex gap-x-3">
                    <span className="text-purple-600 text-xl">✔</span>
                    <span className="text-gray-700">Customizable reports so you can track what matters</span>
                  </li>
                </ul>

                <a href="#" className="inline-flex items-center gap-x-2 text-purple-600 font-medium mt-8 group">
                  Contact Us 
                  <span className="text-xl transition-transform group-hover:translate-x-1">→</span>
                </a>
              </div>
            </div>
          </section>

          {/* OUR MEMBER */}
          <section>
            <h2 className="text-3xl font-semibold tracking-tight mb-8">Our Member</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {/* Member 1 */}
              <motion.div whileHover={{ y: -4 }} className="bg-white rounded-3xl p-6 text-center shadow-sm">
                <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border-4 border-white shadow-inner bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-4xl mb-4">🧔‍♂️</div>
                <h4 className="font-semibold">John Smith</h4>
                <p className="text-purple-600 text-sm">CEO &amp; Founder</p>
                <div className="flex justify-center gap-x-4 mt-6">
                  <div className="w-8 h-8 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xs">in</div>
                  <div className="w-8 h-8 bg-sky-400 rounded-2xl flex items-center justify-center text-white text-xs">𝕏</div>
                </div>
              </motion.div>

              {/* Member 2 */}
              <motion.div whileHover={{ y: -4 }} className="bg-white rounded-3xl p-6 text-center shadow-sm">
                <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border-4 border-white shadow-inner bg-gradient-to-br from-pink-400 to-rose-500 flex items-center justify-center text-4xl mb-4">👩🏻</div>
                <h4 className="font-semibold">Mary Jane</h4>
                <p className="text-purple-600 text-sm">CTO &amp; Co-Founder</p>
                <div className="flex justify-center gap-x-4 mt-6">
                  <div className="w-8 h-8 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xs">in</div>
                  <div className="w-8 h-8 bg-sky-400 rounded-2xl flex items-center justify-center text-white text-xs">𝕏</div>
                </div>
              </motion.div>

              {/* Member 3 */}
              <motion.div whileHover={{ y: -4 }} className="bg-white rounded-3xl p-6 text-center shadow-sm">
                <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border-4 border-white shadow-inner bg-gradient-to-br from-blue-400 to-cyan-500 flex items-center justify-center text-4xl mb-4">👨🏻‍💼</div>
                <h4 className="font-semibold">Archer Ares</h4>
                <p className="text-purple-600 text-sm">Head of Product</p>
                <div className="flex justify-center gap-x-4 mt-6">
                  <div className="w-8 h-8 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xs">in</div>
                  <div className="w-8 h-8 bg-sky-400 rounded-2xl flex items-center justify-center text-white text-xs">𝕏</div>
                </div>
              </motion.div>

              {/* Member 4 */}
              <motion.div whileHover={{ y: -4 }} className="bg-white rounded-3xl p-6 text-center shadow-sm">
                <div className="w-20 h-20 mx-auto rounded-2xl overflow-hidden border-4 border-white shadow-inner bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-4xl mb-4">👩🏻‍🎨</div>
                <h4 className="font-semibold">Xing Yan</h4>
                <p className="text-purple-600 text-sm">Head of Design</p>
                <div className="flex justify-center gap-x-4 mt-6">
                  <div className="w-8 h-8 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-xs">in</div>
                  <div className="w-8 h-8 bg-sky-400 rounded-2xl flex items-center justify-center text-white text-xs">𝕏</div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* WE'RE HIRING */}
          <section className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <div className="inline-flex items-center gap-x-2 bg-emerald-100 text-emerald-700 text-sm font-medium px-4 h-9 rounded-3xl mb-4">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  WE&apos;RE HIRING!
                </div>
                <h3 className="text-2xl font-semibold mb-2">Interested in working with our team?</h3>
                <p className="text-gray-500">Help us build the future of team productivity.</p>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-purple-600 text-white px-10 py-6 rounded-3xl font-semibold text-lg flex items-center gap-x-3 whitespace-nowrap"
              >
                Apply Now
                <span className="text-3xl leading-none">→</span>
              </motion.button>
            </div>
          </section>

          {/* NEWSLETTER */}
          <section className="bg-white rounded-3xl p-8 shadow-sm">
            <h3 className="font-semibold text-xl mb-2">Subscribe For Newsletter</h3>
            <p className="text-gray-500 text-sm mb-6">Stay up to date with the latest updates from Growly.</p>
            
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email address" 
                className="flex-1 bg-gray-100 border border-transparent focus:border-purple-300 rounded-l-3xl px-6 py-5 outline-none text-sm"
              />
              <button className="bg-purple-600 hover:bg-purple-700 text-white px-10 rounded-r-3xl font-medium">
                Sign Up
              </button>
            </div>
          </section>
        </div>

        {/* RIGHT COLUMN - ABOUT US + WORKFLOW SPEED + STATS + GOAL REPEAT */}
        <div className="space-y-16">
          {/* ABOUT US HERO */}
          <section>
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-3xl overflow-hidden">
              <div className="px-8 pt-8 pb-6">
                <h2 className="text-4xl font-semibold tracking-tighter">About Us</h2>
                <p className="text-purple-300 mt-2">Building the simplest way for teams to get things done.</p>
              </div>
              
              {/* Office placeholder image */}
              <div className="h-80 bg-[radial-gradient(#ffffff15_1px,#00000000_1px)] bg-[length:20px_20px] relative">
                <div className="absolute inset-0 flex items-end justify-center pb-8">
                  <div className="text-center">
                    <div className="mx-auto w-11 h-11 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-3xl mb-3">🏢</div>
                    <p className="text-white/70 text-sm tracking-widest">OUR HQ • PHNOM PENH</p>
                  </div>
                </div>
                
                {/* Fake laptop screens */}
                <div className="absolute bottom-12 left-12 bg-white rounded-2xl shadow-2xl p-3 w-40 rotate-[-8deg]">
                  <div className="h-6 bg-gray-200 rounded-xl mb-3" />
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-16 bg-purple-100 rounded-xl" />
                    <div className="h-16 bg-purple-100 rounded-xl" />
                    <div className="h-16 bg-purple-100 rounded-xl" />
                  </div>
                </div>
                
                <div className="absolute bottom-12 right-12 bg-white rounded-2xl shadow-2xl p-3 w-40 rotate-[8deg]">
                  <div className="h-6 bg-gray-200 rounded-xl mb-3" />
                  <div className="flex gap-1">
                    <div className="flex-1 h-20 bg-emerald-100 rounded-2xl" />
                    <div className="flex-1 h-20 bg-amber-100 rounded-2xl" />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* GROW YOUR WORKFLOW SPEED */}
          <section className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="flex items-center gap-x-4 mb-8">
              <div className="flex-1 h-px bg-gray-200" />
              <h2 className="text-3xl font-semibold tracking-tighter whitespace-nowrap">Grow Up Your Workflow Speed.</h2>
              <div className="flex-1 h-px bg-gray-200" />
            </div>

            {/* Workflow hero image placeholder */}
            <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-purple-50 to-indigo-50 p-6 mb-8">
              <div className="bg-white rounded-3xl shadow-xl p-6 flex items-center gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-x-3 mb-6">
                    <div className="w-9 h-9 bg-green-400 text-white rounded-2xl flex items-center justify-center text-2xl">🧢</div>
                    <div>
                      <p className="font-medium">Alex Rivera</p>
                      <p className="text-xs text-gray-400">Product Designer • Working on Q3 Roadmap</p>
                    </div>
                  </div>
                  
                  <div className="space-y-5">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Design system overhaul</span>
                      <span className="text-emerald-600">Today</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-3xl overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-3xl" />
                    </div>
                  </div>
                </div>
                
                <div className="w-px h-28 bg-gray-100" />
                
                <div className="text-center">
                  <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-indigo-600">3×</div>
                  <p className="text-xs uppercase tracking-widest font-medium text-gray-400 mt-1">Faster delivery</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-4xl font-bold text-purple-600">27,882</div>
                <p className="text-sm text-gray-500 mt-1">Customers</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600">90%</div>
                <p className="text-sm text-gray-500 mt-1">On-time delivery</p>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-600">70,592</div>
                <p className="text-sm text-gray-500 mt-1">Tasks completed</p>
              </div>
            </div>
          </section>

          {/* REPEATED OUR GOAL */}
          <section className="bg-white rounded-3xl p-8 shadow-sm">
            <div className="flex justify-end mb-6">
              <div className="inline-flex items-center gap-x-2 bg-purple-100 text-purple-700 px-5 h-8 text-sm font-medium rounded-3xl">
                Our Goal
              </div>
            </div>
            
            <div className="grid grid-cols-12 gap-8 items-center">
              <div className="col-span-7 text-sm leading-relaxed text-gray-600">
                Pushing the limits without sacrificing a bit on work after work? Growly team up with you to make remarkable adjustments and streamlined workflow to help your team to be more productive and easier to communicate.
              </div>
              
              {/* Small illustration repeat */}
              <div className="col-span-5 flex justify-end">
                <div className="w-28 h-28 bg-purple-100 rounded-3xl flex items-center justify-center text-5xl rotate-12 shadow-inner">📋➕</div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* FOOTER (unchanged) */}
      <footer className="bg-white border-t mt-24">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-12">
          <div className="flex flex-col md:flex-row justify-between gap-y-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-x-3 mb-6">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl leading-none pt-0.5">
                  G
                </div>
                <span className="font-semibold text-3xl tracking-tighter text-gray-900">Growly</span>
              </div>
              <p className="text-xs text-gray-400 max-w-52">
                The modern task manager that helps teams move faster — together.
              </p>
              
              <div className="flex gap-x-5 mt-8 text-gray-400">
                <span className="cursor-pointer hover:text-gray-600">𝕏</span>
                <span className="cursor-pointer hover:text-gray-600">in</span>
                <span className="cursor-pointer hover:text-gray-600">📘</span>
              </div>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-16 gap-y-8 text-sm">
              <div>
                <p className="font-semibold mb-4 text-gray-400">Company</p>
                <ul className="space-y-3">
                  <li className="hover:text-purple-600 cursor-pointer">About Us</li>
                  <li className="hover:text-purple-600 cursor-pointer">Careers</li>
                  <li className="hover:text-purple-600 cursor-pointer">Blog</li>
                  <li className="hover:text-purple-600 cursor-pointer">Contact</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-4 text-gray-400">Product</p>
                <ul className="space-y-3">
                  <li className="hover:text-purple-600 cursor-pointer">Features</li>
                  <li className="hover:text-purple-600 cursor-pointer">Templates</li>
                  <li className="hover:text-purple-600 cursor-pointer">Integrations</li>
                  <li className="hover:text-purple-600 cursor-pointer">Pricing</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-4 text-gray-400">Resources</p>
                <ul className="space-y-3">
                  <li className="hover:text-purple-600 cursor-pointer">Help Center</li>
                  <li className="hover:text-purple-600 cursor-pointer">Community</li>
                  <li className="hover:text-purple-600 cursor-pointer">What&apos;s New</li>
                  <li className="hover:text-purple-600 cursor-pointer">Roadmap</li>
                </ul>
              </div>
              <div>
                <p className="font-semibold mb-4 text-gray-400">Legal</p>
                <ul className="space-y-3">
                  <li className="hover:text-purple-600 cursor-pointer">Privacy Policy</li>
                  <li className="hover:text-purple-600 cursor-pointer">Terms of Service</li>
                  <li className="hover:text-purple-600 cursor-pointer">Trust &amp; Safety</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-400 mt-16 pt-8 border-t">
            © 2026 Growly, Inc. All rights reserved. Made with ❤️ for teams everywhere.
          </div>
        </div>
      </footer>
    </div>
  );
}