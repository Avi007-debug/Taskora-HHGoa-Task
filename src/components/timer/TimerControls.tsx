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
    <div className="flex items-center justify-center gap-4 mt-8">
      {!isRunning ? (
        <button
          onClick={onStart}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1a73e8] text-white font-semibold hover:bg-blue-600 transition-colors shadow-sm"
        >
          <Play className="w-5 h-5 fill-current" />
          Start Focus
        </button>
      ) : (
        <button
          onClick={onPause}
          className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FBBC04] text-white font-semibold hover:bg-yellow-500 transition-colors shadow-sm"
        >
          <Pause className="w-5 h-5 fill-current" />
          Pause
        </button>
      )}

      <button
        onClick={onReset}
        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shadow-sm border border-slate-200 dark:border-slate-700"
      >
        <RotateCcw className="w-5 h-5" />
        Reset
      </button>
    </div>
  );
};
