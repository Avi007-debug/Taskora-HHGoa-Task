import type { FC } from 'react';
import type { FocusSession } from '../../types/session';
import { History, CheckCircle2, Trash2, Flame, Clock } from 'lucide-react';

interface SessionHistoryProps {
  sessions: FocusSession[];
  onClearHistory?: () => void;
}

export const SessionHistory: FC<SessionHistoryProps> = ({ sessions, onClearHistory }) => {
  // Compute today's focus stats
  const todayStr = new Date().toDateString();
  const todaySessions = sessions.filter(
    (s) => new Date(s.completedAt).toDateString() === todayStr
  );
  const todayMinutes = todaySessions.reduce((acc, s) => acc + (s.duration || 25), 0);
  const totalMinutes = sessions.reduce((acc, s) => acc + (s.duration || 25), 0);

  if (sessions.length === 0) {
    return (
      <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400">
        <Clock className="w-8 h-8 mx-auto mb-2 text-slate-400 dark:text-slate-600 opacity-60" />
        <p className="text-sm">No focus sessions completed yet.</p>
        <p className="text-xs text-slate-400 mt-1">Start your first 25-minute sprint above!</p>
      </div>
    );
  }

  return (
    <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 text-left">
      {/* Header with Stats & Clear Action */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-[#34A853]" />
          <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Session History</h3>
          <span className="bg-emerald-50 dark:bg-emerald-950/60 text-[#1e8e3e] dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-full text-[11px] font-semibold">
            {sessions.length} Total
          </span>
        </div>

        <div className="flex items-center gap-2">
          {onClearHistory && (
            <button
              type="button"
              onClick={onClearHistory}
              className="text-xs text-slate-400 hover:text-[#EA4335] hover:bg-red-50 dark:hover:bg-red-950/30 px-2 py-1 rounded-md transition-colors flex items-center gap-1"
              title="Clear all completed session history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Today's Focus Quick Stat Card */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#1e8e3e] dark:text-[#34A853]">
            <Flame className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-900 dark:text-slate-100">
              {todayMinutes} mins
            </span>
            <span className="text-[10px] text-slate-500 uppercase font-medium">
              Today ({todaySessions.length} sessions)
            </span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center gap-2.5">
          <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#1a73e8]">
            <Clock className="w-4 h-4" />
          </div>
          <div>
            <span className="block text-xs font-bold text-slate-900 dark:text-slate-100">
              {totalMinutes} mins
            </span>
            <span className="text-[10px] text-slate-500 uppercase font-medium">
              All Time
            </span>
          </div>
        </div>
      </div>

      {/* Recent Sessions List */}
      <ul className="space-y-2 max-h-56 overflow-y-auto pr-1">
        {sessions.map((session) => {
          const date = new Date(session.completedAt);
          const formattedDate = date.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
          });
          const formattedTime = date.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
          });

          return (
            <li
              key={session.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50/70 dark:bg-slate-800/30 border border-slate-200/60 dark:border-slate-800 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#34A853] shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200">
                    Deep Focus Sprint
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {formattedDate} at {formattedTime}
                  </p>
                </div>
              </div>
              <span className="text-xs font-bold text-[#1a73e8] bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-md border border-blue-200/60 dark:border-blue-900">
                {session.duration} min
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
