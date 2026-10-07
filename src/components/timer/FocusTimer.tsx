import type { FC } from 'react';
import { Timer, Clock, UserCheck, Sparkles } from 'lucide-react';
import type { FocusSession } from '../../types/session';

interface FocusTimerProps {
  sessions?: FocusSession[];
  onAddSession?: (session: FocusSession) => void;
}

/**
 * Placeholder component for Person 2 module.
 * Teammate 2 will implement the 25-minute Pomodoro timer, start/pause/reset controls,
 * and session history on branch `feature/focus-timer`.
 */
export const FocusTimer: FC<FocusTimerProps> = () => {
  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 sm:p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="w-14 h-14 mx-auto mb-4 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-[#1a73e8]">
          <Timer className="w-7 h-7" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-[#1a73e8] dark:text-blue-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Person 2 — Focus Timer Module
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Pomodoro Focus Timer
        </h2>

        <p className="text-slate-600 dark:text-slate-400 text-sm max-w-md mx-auto mb-6">
          This module is assigned to <strong className="text-slate-800 dark:text-slate-200">Person 2</strong> on branch{' '}
          <code className="text-[#1a73e8] dark:text-blue-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">feature/focus-timer</code>.
        </p>

        {/* Feature Spec Preview Box */}
        <div className="text-left bg-slate-50 dark:bg-slate-950 rounded-xl p-5 border border-slate-200 dark:border-slate-800 max-w-lg mx-auto space-y-2 text-xs text-slate-600 dark:text-slate-300">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 text-sm mb-1">
            <Clock className="w-4 h-4 text-[#1a73e8]" />
            <span>Person 2 Deliverables:</span>
          </div>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1a73e8]" />
            25-minute countdown timer with remaining seconds state
          </p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
            Start, Pause, and Reset controls with interval safety
          </p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC04]" />
            Auto-record completed session into localStorage
          </p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
            Session history list and completion chime/notification
          </p>
        </div>

        <div className="mt-6 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-[#1a73e8]" />
          <span>Data Contract ready at: <code>src/types/session.ts</code> & <code>src/utils/sessionStorage.ts</code></span>
        </div>
      </div>
    </div>
  );
};
