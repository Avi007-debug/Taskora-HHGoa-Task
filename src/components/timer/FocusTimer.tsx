import { useState, useEffect, useCallback, useRef } from 'react';
import type { FC } from 'react';
import { Timer, CheckCircle, X, Coffee, Brain, Sunset } from 'lucide-react';
import type { FocusSession } from '../../types/session';
import { generateSessionId, saveFocusSessions } from '../../utils/sessionStorage';
import { TimerControls } from './TimerControls';
import { SessionHistory } from './SessionHistory';

interface FocusTimerProps {
  sessions?: FocusSession[];
  onAddSession?: (session: FocusSession) => void;
  onClearSessions?: () => void;
}

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const TIMER_MODES: Record<TimerMode, { label: string; duration: number; icon: typeof Brain }> = {
  focus: { label: 'Focus Sprint', duration: 25 * 60, icon: Brain },
  shortBreak: { label: 'Short Break', duration: 5 * 60, icon: Coffee },
  longBreak: { label: 'Long Break', duration: 15 * 60, icon: Sunset },
};

export const FocusTimer: FC<FocusTimerProps> = ({
  sessions = [],
  onAddSession,
  onClearSessions,
}) => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [timeLeft, setTimeLeft] = useState(TIMER_MODES.focus.duration);
  const [isRunning, setIsRunning] = useState(false);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);

  // Interval reference to ensure no duplicate intervals
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Offline-safe Web Audio synthesizer chime
  const playChime = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        const now = ctx.currentTime;
        
        // Tone 1: 587.33 Hz (D5)
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(587.33, now);
        gain1.gain.setValueAtTime(0.3, now);
        gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.8);

        // Tone 2: 880 Hz (A5)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(880, now + 0.2);
        gain2.gain.setValueAtTime(0.4, now + 0.2);
        gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.2);
        osc2.stop(now + 1.2);
        return;
      }
    } catch {
      // Fallback
    }

    // Secondary fallback to external audio
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3');
      audio.play().catch(() => {});
    } catch {
      // Ignore
    }
  }, []);

  // Timer countdown effect
  useEffect(() => {
    if (isRunning) {
      if (intervalRef.current) clearInterval(intervalRef.current);

      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  // Session completion effect
  useEffect(() => {
    if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      playChime();

      const durationMinutes = Math.round(TIMER_MODES[mode].duration / 60);

      // Only record focus sessions (not breaks) in history
      if (mode === 'focus') {
        const newSession: FocusSession = {
          id: generateSessionId(),
          duration: durationMinutes,
          completedAt: new Date().toISOString(),
        };

        if (onAddSession) {
          onAddSession(newSession);
        }

        saveFocusSessions([newSession, ...sessions]);
        setCompletionMessage(`🎉 Great work! Completed a ${durationMinutes}-minute Focus Sprint.`);
      } else {
        setCompletionMessage(`☕ Break finished! Ready for your next Focus Sprint?`);
      }

      // Reset timer to mode default
      setTimeLeft(TIMER_MODES[mode].duration);
    }
  }, [isRunning, timeLeft, mode, onAddSession, sessions, playChime]);

  const handleStart = () => {
    setCompletionMessage(null);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(TIMER_MODES[mode].duration);
  };

  const handleModeChange = (newMode: TimerMode) => {
    if (isRunning) {
      const confirmSwitch = window.confirm('Timer is running. Switch mode and reset?');
      if (!confirmSwitch) return;
    }
    setIsRunning(false);
    setMode(newMode);
    setTimeLeft(TIMER_MODES[newMode].duration);
    setCompletionMessage(null);
  };

  const handleClearHistory = () => {
    if (window.confirm('Are you sure you want to clear your focus session history?')) {
      if (onClearSessions) {
        onClearSessions();
      } else {
        saveFocusSessions([]);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentTotal = TIMER_MODES[mode].duration;
  const progress = ((currentTotal - timeLeft) / currentTotal) * 100;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 sm:p-10 text-center border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        {/* Header Icon & Title */}
        <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-[#1a73e8]">
          <Timer className="w-6 h-6" />
        </div>

        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-1">
          Focus Timer
        </h2>
        <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mb-6">
          Maintain deep work intervals with audio cues and automated session tracking.
        </p>

        {/* Mode Selector Tabs */}
        <div className="inline-flex bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/80 mb-7">
          {(['focus', 'shortBreak', 'longBreak'] as TimerMode[]).map((m) => {
            const Icon = TIMER_MODES[m].icon;
            const isActive = mode === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => handleModeChange(m)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1a73e8] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{TIMER_MODES[m].label}</span>
              </button>
            );
          })}
        </div>

        {/* Completion Message Banner */}
        {completionMessage && (
          <div className="mb-6 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-xs font-medium flex items-center justify-between gap-2 max-w-md mx-auto shadow-sm animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#34A853] shrink-0" />
              <span>{completionMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setCompletionMessage(null)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              title="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Timer Display Ring */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto mb-6 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-inner">
          <svg className="absolute inset-0 w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
            <circle
              className="text-slate-200 dark:text-slate-800 stroke-current"
              strokeWidth="4"
              cx="50"
              cy="50"
              r="46"
              fill="transparent"
            />
            <circle
              className="text-[#1a73e8] stroke-current transition-all duration-300 ease-linear"
              strokeWidth="4"
              strokeDasharray={289.02}
              strokeDashoffset={289.02 - (progress / 100) * 289.02}
              strokeLinecap="round"
              cx="50"
              cy="50"
              r="46"
              fill="transparent"
            />
          </svg>
          <div className="z-10 flex flex-col items-center">
            <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight font-mono">
              {formatTime(timeLeft)}
            </span>
            <span
              className={`flex items-center gap-1.5 mt-2 text-xs font-semibold px-2 py-0.5 rounded-full ${
                isRunning
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#1e8e3e] dark:text-[#34A853] border border-emerald-200 dark:border-emerald-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {isRunning && <span className="w-1.5 h-1.5 rounded-full bg-[#34A853] animate-pulse" />}
              {isRunning ? 'In Progress' : 'Paused / Ready'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <TimerControls
          isRunning={isRunning}
          onStart={handleStart}
          onPause={handlePause}
          onReset={handleReset}
        />

        {/* Session History */}
        <SessionHistory
          sessions={sessions}
          onClearHistory={sessions.length > 0 ? handleClearHistory : undefined}
        />
      </div>
    </div>
  );
};
