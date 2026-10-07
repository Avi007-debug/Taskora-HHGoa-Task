import type { FC } from 'react';
import { BarChart3, Layers, UserCheck, Sparkles } from 'lucide-react';
import type { Task } from '../../types/task';
import type { FocusSession } from '../../types/session';

interface DashboardProps {
  tasks?: Task[];
  sessions?: FocusSession[];
}

/**
 * Placeholder component for Person 3 module.
 * Teammate 3 will implement the application shell, StatCard components,
 * progress visualizations, and motivational status on branch `feature/dashboard-ui`.
 */
export const Dashboard: FC<DashboardProps> = ({ tasks = [], sessions = [] }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalSessions = sessions.length;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 sm:p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-[#1a73e8]">
          <BarChart3 className="w-7 h-7" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-[#1a73e8] dark:text-blue-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Person 3 — Dashboard & UI Module
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Productivity Dashboard & Analytics
        </h2>

        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto mb-6">
          This module is assigned to <strong className="text-slate-800 dark:text-slate-200">Person 3</strong> on branch{' '}
          <code className="text-[#1a73e8] dark:text-blue-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">feature/dashboard-ui</code>.
        </p>

        {/* Live Data Contract Preview (showing that Person 1's tasks are immediately available!) */}
        <div className="bg-slate-50 dark:bg-slate-950 rounded-xl p-5 border border-slate-200 dark:border-slate-800 max-w-lg mx-auto mb-6">
          <span className="text-xs uppercase tracking-wider text-slate-500 font-bold block mb-3">
            Live Shared Data Contract Available:
          </span>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-lg font-bold text-[#1a73e8]">{totalTasks}</span>
              <span className="block text-[10px] text-slate-500">Total Tasks</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-lg font-bold text-[#1e8e3e] dark:text-[#34A853]">{completedTasks}</span>
              <span className="block text-[10px] text-slate-500">Completed</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-lg font-bold text-[#B06000] dark:text-[#FBBC04]">{completionRate}%</span>
              <span className="block text-[10px] text-slate-500">Completion</span>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-500">
            Recorded Focus Sessions: <span className="text-slate-800 dark:text-slate-200 font-semibold">{totalSessions}</span>
          </div>
        </div>

        {/* Feature Spec Preview Box */}
        <div className="text-left bg-slate-50 dark:bg-slate-950 rounded-xl p-5 border border-slate-200 dark:border-slate-800 max-w-lg mx-auto space-y-2 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">
            <Layers className="w-4 h-4 text-[#1a73e8]" />
            <span>Person 3 Deliverables:</span>
          </div>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1a73e8]" />
            Build reusable StatCard components with GDG colors
          </p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
            Calculate completionRate, pendingTasks, and focusSessions
          </p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC04]" />
            Visual progress chart & motivational status quotes
          </p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
            Polished application shell and responsive navigation
          </p>
        </div>

        <div className="mt-6 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-[#1a73e8]" />
          <span>Integration props: <code>tasks: Task[]</code> & <code>sessions: FocusSession[]</code></span>
        </div>
      </div>
    </div>
  );
};
