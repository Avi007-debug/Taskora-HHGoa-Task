import type { FC, ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: string;
  color?: 'blue' | 'red' | 'yellow' | 'green';
}

export const StatCard: FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'blue',
}) => {
  const colorMap = {
    blue: 'text-[#1a73e8] bg-blue-50 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900',
    red: 'text-[#EA4335] bg-red-50 dark:bg-red-950/60 border-red-200 dark:border-red-900',
    yellow: 'text-[#B06000] dark:text-[#FBBC04] bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900',
    green: 'text-[#1e8e3e] dark:text-[#34A853] bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900',
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2 rounded-lg border ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          {value}
        </span>
        {subtitle && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
            {subtitle}
          </p>
        )}
        {trend && (
          <span className="inline-block mt-2 text-[11px] font-semibold text-[#1a73e8] bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200 dark:border-blue-900">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
