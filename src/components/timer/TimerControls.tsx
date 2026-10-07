import type { FC } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface TimerControlsProps {
  isRunning: boolean;
  onStart: () => void;
  onPause: () => void;
  onReset: () => void;
}

export const TimerControls: FC<TimerControlsProps> = ({
  isRunning,
  onStart,
  onPause,
  onReset,
}) => {
  return (
    <div className="flex items-center justify-center gap-3.5 mt-6">
      {!isRunning ? (
        <button
          type="button"
          onClick={onStart}
          className="flex items-center gap-2 px-7 py-3 rounded-xl bg-[#1a73e8] hover:bg-blue-600 text-white font-semibold transition-all shadow-sm hover:shadow active:scale-95"
          title="Start focus timer"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>Start Focus</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={onPause}
          className="flex items-center gap-2 px-7 py-3 rounded-xl bg-[#FBBC04] hover:bg-amber-400 text-slate-900 font-bold transition-all shadow-sm hover:shadow active:scale-95"
          title="Pause timer"
        >
          <Pause className="w-4 h-4 fill-current" />
          <span>Pause</span>
        </button>
      )}

      <button
        type="button"
        onClick={onReset}
        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700 active:scale-95"
        title="Reset timer to initial duration"
      >
        <RotateCcw className="w-4 h-4" />
        <span>Reset</span>
      </button>
    </div>
  );
};
