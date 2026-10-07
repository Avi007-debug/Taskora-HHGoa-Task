import type { FC } from 'react';
import type { FocusSession } from '../../types/session';
import { History, CheckCircle2 } from 'lucide-react';

interface SessionHistoryProps {
  sessions: FocusSession[];
}

export const SessionHistory: FC<SessionHistoryProps> = ({ sessions }) => {
  if (sessions.length === 0) {
    return (
      <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500 dark:text-slate-400">
        <p>No focus sessions completed yet. Start your first session!</p>
      </div>
    );
  }

  return (
    <div className="mt-8 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-200 mb-4">
        <History className="w-5 h-5 text-[#34A853]" />
        <h3>Session History</h3>
        <span className="ml-auto bg-[#34A853]/10 text-[#34A853] px-2 py-0.5 rounded-full text-xs">
          {sessions.length} Completed
        </span>
      </div>

      <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
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
              className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-[#34A853]" />
                <div className="text-sm">
                  <p className="font-semibold text-slate-700 dark:text-slate-300">
                    Focus Session
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {formattedDate} at {formattedTime}
                  </p>
                </div>
              </div>
              <div className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {session.duration} min
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
