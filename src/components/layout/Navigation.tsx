import type { FC } from 'react';
import { CheckSquare, Timer, BarChart3 } from 'lucide-react';

interface NavigationProps {
  activeTab: 'tasks' | 'timer' | 'dashboard';
  onTabChange: (tab: 'tasks' | 'timer' | 'dashboard') => void;
  taskCount?: number;
  sessionCount?: number;
}

export const Navigation: FC<NavigationProps> = ({
  activeTab,
  onTabChange,
  taskCount = 0,
  sessionCount = 0,
}) => {
  return (
    <div className="flex items-center justify-center border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 py-2 px-4 sm:hidden">
      <div className="grid grid-cols-3 gap-1 w-full max-w-sm bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700 text-xs">
        <button
          onClick={() => onTabChange('tasks')}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'tasks'
              ? 'bg-[#1a73e8] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <CheckSquare className="w-3.5 h-3.5" />
          <span>Tasks ({taskCount})</span>
        </button>

        <button
          onClick={() => onTabChange('timer')}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'timer'
              ? 'bg-[#1a73e8] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <Timer className="w-3.5 h-3.5" />
          <span>Timer ({sessionCount})</span>
        </button>

        <button
          onClick={() => onTabChange('dashboard')}
          className={`flex items-center justify-center gap-1.5 py-2 rounded-lg font-semibold transition-all ${
            activeTab === 'dashboard'
              ? 'bg-[#1a73e8] text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analytics</span>
        </button>
      </div>
    </div>
  );
};
