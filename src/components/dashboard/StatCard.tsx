import type { FC, ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: ReactNode;
  trend?: string;
  color?: 'indigo' | 'emerald' | 'amber' | 'purple';
}

export const StatCard: FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  color = 'indigo',
}) => {
  const colorMap = {
    indigo: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    amber: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    purple: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  };

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 shadow-lg relative overflow-hidden transition-all hover:scale-[1.01]">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
          {title}
        </span>
        <div className={`p-2 rounded-xl border ${colorMap[color]}`}>
          {icon}
        </div>
      </div>
      <div className="mt-3">
        <span className="text-3xl font-extrabold text-slate-100 tracking-tight">
          {value}
        </span>
        {subtitle && (
          <p className="text-xs text-slate-400 mt-1 font-medium">
            {subtitle}
          </p>
        )}
        {trend && (
          <span className="inline-block mt-2 text-[11px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
            {trend}
          </span>
        )}
      </div>
    </div>
  );
};
