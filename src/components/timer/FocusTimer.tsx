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
      <div className="glass-panel rounded-3xl p-8 sm:p-12 text-center border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <Timer className="w-8 h-8" />
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          Person 2 — Focus Timer Module
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">
          Pomodoro Focus Timer
        </h2>

        <p className="text-slate-400 text-sm max-w-md mx-auto mb-8">
          This module is assigned to <strong className="text-slate-200">Person 2</strong> on branch{' '}
          <code className="text-indigo-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">feature/focus-timer</code>.
        </p>

        {/* Feature Spec Preview Box */}
        <div className="text-left bg-slate-900/80 rounded-2xl p-5 border border-slate-800/80 max-w-lg mx-auto space-y-2.5 text-xs text-slate-300">
          <div className="flex items-center gap-2 font-semibold text-slate-200 text-sm mb-1">
            <Clock className="w-4 h-4 text-indigo-400" />
            <span>Person 2 Deliverables:</span>
          </div>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            25-minute countdown timer with remaining seconds state
          </p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            Start, Pause, and Reset controls with debounce
          </p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            Auto-record completed session into localStorage
          </p>
          <p className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
            Session history list and completion chime/notification
          </p>
        </div>

        <div className="mt-8 text-[11px] text-slate-400 flex items-center justify-center gap-1.5">
          <UserCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span>Data Contract ready at: <code>src/types/session.ts</code> & <code>src/utils/sessionStorage.ts</code></span>
        </div>
      </div>
    </div>
  );
};
