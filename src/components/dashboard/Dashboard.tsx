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
      <div className="glass-panel rounded-3xl p-8 sm:p-12 text-center border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
          <BarChart3 className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Person 3 — Dashboard & UI Module
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          Productivity Dashboard & Analytics
        </h2>

        <p className="text-slate-400 text-sm max-w-md mx-auto mb-8">
          This module is assigned to <strong className="text-slate-200">Person 3</strong> on branch{' '}
          <code className="text-purple-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">feature/dashboard-ui</code>.
        </p>

        {/* Live Data Contract Preview (showing that Person 1's tasks are immediately available!) */}
        <div className="bg-slate-900/60 rounded-2xl p-5 border border-slate-800 max-w-lg mx-auto mb-6">
          <span className="text-xs uppercase tracking-wider text-slate-400 font-bold block mb-3">
            Live Shared Data Contract Available:
          </span>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-lg font-bold text-slate-200">{totalTasks}</span>
              <span className="block text-[10px] text-slate-400">Total Tasks</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-lg font-bold text-emerald-400">{completedTasks}</span>
              <span className="block text-[10px] text-slate-400">Completed</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
              <span className="text-lg font-bold text-purple-400">{completionRate}%</span>
              <span className="block text-[10px] text-slate-400">Completion Rate</span>
            </div>
          </div>
          <div className="mt-3 text-[11px] text-slate-400">
            Recorded Focus Sessions: <span className="text-slate-200 font-semibold">{totalSessions}</span>
          </div>
        </div>

        {/* Feature Spec Preview Box */}
        <div className="text-left bg-slate-900/80 rounded-2xl p-5 border border-slate-800/80 max-w-lg mx-auto space-y-2.5 text-xs text-slate-300">
          <div className="flex items-center gap-2 font-semibold text-slate-200 text-sm mb-1">
            <Layers className="w-4 h-4 text-purple-400" />
            <span>Person 3 Deliverables:</span>
          </div>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            Build reusable StatCard components
          </p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            Calculate completionRate, pendingTasks, and focusSessions
          </p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            Visual progress chart & motivational status quotes
          </p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            Polished application shell and responsive navigation
          </p>
        </div>

        <div className="mt-8 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-purple-400" />
          <span>Integration props: <code>tasks: Task[]</code> & <code>sessions: FocusSession[]</code></span>
        </div>
      </div>
    </div>
  );
};
