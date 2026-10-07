import { FC, useState, useEffect, useCallback } from 'react';
import { Timer, Bell } from 'lucide-react';
import type { FocusSession } from '../../types/session';
import { generateSessionId, saveFocusSessions } from '../../utils/sessionStorage';
import { TimerControls } from './TimerControls';
import { SessionHistory } from './SessionHistory';

interface FocusTimerProps {
  sessions?: FocusSession[];
  onAddSession?: (session: FocusSession) => void;
}

const DEFAULT_TIME = 25 * 60; // 25 minutes in seconds

export const FocusTimer: FC<FocusTimerProps> = ({
  sessions = [],
  onAddSession,
}) => {
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME);
  const [isRunning, setIsRunning] = useState(false);

  const playChime = useCallback(() => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => {
        // Fallback or ignore if autoplay is blocked
      });
    } catch (err) {
      console.error('Failed to play chime', err);
    }
  }, []);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      playChime();
      
      const newSession: FocusSession = {
        id: generateSessionId(),
        duration: 25,
        completedAt: new Date().toISOString(),
      };
      
      if (onAddSession) {
        onAddSession(newSession);
      }
      
      // Persist to local storage
      saveFocusSessions([newSession, ...sessions]);
      
      // Reset timer
      setTimeLeft(DEFAULT_TIME);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning, timeLeft, onAddSession, sessions, playChime]);

  const handleStart = () => setIsRunning(true);
  const handlePause = () => setIsRunning(false);
  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(DEFAULT_TIME);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((DEFAULT_TIME - timeLeft) / DEFAULT_TIME) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 text-center border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-[#1a73e8]">
          <Timer className="w-8 h-8" />
        </div>

        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          Focus Timer
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm mb-8">
          Stay productive with 25-minute Pomodoro sessions.
        </p>

        {/* Timer Display */}
        <div className="relative w-64 h-64 mx-auto mb-8 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-800/50 border-4 border-slate-100 dark:border-slate-700 shadow-inner">
          <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              className="text-slate-200 dark:text-slate-700 stroke-current"
              strokeWidth="4"
              cx="50"
              cy="50"
              r="48"
              fill="transparent"
            />
            <circle
              className="text-[#1a73e8] stroke-current transition-all duration-1000 ease-linear"
              strokeWidth="4"
              strokeDasharray={301.59}
              strokeDashoffset={301.59 - (progress / 100) * 301.59}
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="48"
              fill="transparent"
            />
          </svg>
          <div className="z-10 flex flex-col items-center">
            <span className="text-5xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight font-mono">
              {formatTime(timeLeft)}
            </span>
            {isRunning && (
              <span className="flex items-center gap-1.5 mt-2 text-sm font-medium text-[#34A853]">
                <span className="w-2 h-2 rounded-full bg-[#34A853] animate-pulse" />
                Focusing...
              </span>
            )}
          </div>
        </div>

        <TimerControls
          isRunning={isRunning}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
        />

        <SessionHistory sessions={sessions} />
      </div>
    </div>
  );
};
