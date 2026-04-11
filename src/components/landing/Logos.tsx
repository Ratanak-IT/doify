
export default function Logos() {
  return (
    <section className="px-4 sm:px-6 py-8 sm:py-10 bg-white dark:bg-[#0B1120] border-t border-b border-gray-100 dark:border-gray-800 mt-12 sm:mt-16">
      <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-5 sm:mb-6">
        Used by teams at the world&apos;s best companies
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 md:gap-9 opacity-30">
        {["Shopify", "Vercel", "Stripe", "Figma", "Notion", "Linear", "GitHub", "Atlassian"].map((n) => (
          <span key={n} className="text-xs sm:text-sm font-bold text-gray-900 dark:text-white tracking-tight">{n}</span>
        ))}
      </div>
    </section>
  );
}