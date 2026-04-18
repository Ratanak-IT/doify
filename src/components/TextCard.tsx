interface TextCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export function TextCard({ title, description, children, action }: TextCardProps) {
  return (
    <div className="bg-white dark:bg-[#1a1c2e] dark:border-[#2a2d45] border border-[#E8E8EF] rounded-xl p-5 flex flex-col gap-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-950 dark:text-white">{title}</h3>
          {description && <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}