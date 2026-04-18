import Link from "next/link";

export default function FooterWrapper() {
  return (
    <footer className="bg-white dark:bg-[#1a1c2e] border-t border-slate-200 dark:border-[#2a2d45] text-slate-500 dark:text-slate-400 pt-10 sm:pt-14 pb-6 sm:pb-8 px-4 sm:px-8 transition-colors">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr_1fr] gap-10 mb-10">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-3.5">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center shadow-md shadow-violet-500/30">
              <svg viewBox="0 0 20 20" fill="none" width="16" height="16">
                <path d="M3 5h14M3 10h10M3 15h7" stroke="white" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
            </div>
            <span className="font-bold text-base text-slate-900 dark:text-white">Doify</span>
          </div>
          <p className="text-xs leading-relaxed text-slate-500 dark:text-slate-400 max-w-[220px]">
            Simplifying teamwork and productivity for everyone, everywhere.
          </p>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-widest mb-4">Company</h4>
          <ul className="flex flex-col gap-2.5">
            <li><Link href="/about"   className="text-xs text-slate-500 dark:text-slate-400 hover:text-violet-600 transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="text-xs text-slate-500 dark:text-slate-400 hover:text-violet-600 transition-colors">Contact</Link></li>
            <li><Link href="#"        className="text-xs text-slate-500 dark:text-slate-400 hover:text-violet-600 transition-colors">Careers</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-widest mb-4">Resources</h4>
          <ul className="flex flex-col gap-2.5">
            <li><Link href="#" className="text-xs text-slate-500 dark:text-slate-400 hover:text-violet-600 transition-colors">Blog</Link></li>
            <li><Link href="#" className="text-xs text-slate-500 dark:text-slate-400 hover:text-violet-600 transition-colors">Help Center</Link></li>
            <li><Link href="#" className="text-xs text-slate-500 dark:text-slate-400 hover:text-violet-600 transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>

        {/* Product */}
        <div>
          <h4 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-widest mb-4">Product</h4>
          <ul className="flex flex-col gap-2.5">
            <li><Link href="#" className="text-xs text-slate-500 dark:text-slate-400 hover:text-violet-600 transition-colors">Features</Link></li>
            <li><Link href="#" className="text-xs text-slate-500 dark:text-slate-400 hover:text-violet-600 transition-colors">Pricing</Link></li>
            <li><Link href="#" className="text-xs text-slate-500 dark:text-slate-400 hover:text-violet-600 transition-colors">Changelog</Link></li>
          </ul>
        </div>
      </div>

      <hr className="border-slate-200 dark:border-[#2a2d45] max-w-5xl mx-auto mb-6" />

      <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs text-slate-400 dark:text-slate-600">© 2026 Doify. All rights reserved.</span>
        <span className="text-xs text-slate-400 dark:text-slate-600">Made by student from ISTAD</span>
      </div>
    </footer>
  );
}