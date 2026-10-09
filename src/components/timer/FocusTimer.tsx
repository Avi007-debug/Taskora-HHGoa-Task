import { useState, useEffect, useCallback, useRef } from 'react';
import type { FC, FormEvent } from 'react';
import { Timer, CheckCircle, X, Coffee, Brain, Sunset, Sliders, Edit3, Plus, Minus, Check } from 'lucide-react';
import type { FocusSession } from '../../types/session';
import { generateSessionId, saveFocusSessions } from '../../utils/sessionStorage';
import { TimerControls } from './TimerControls';
import { SessionHistory } from './SessionHistory';

interface FocusTimerProps {
  sessions?: FocusSession[];
  onAddSession?: (session: FocusSession) => void;
  onClearSessions?: () => void;
}

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak' | 'custom';

const TIMER_MODES: Record<TimerMode, { label: string; defaultDuration: number; icon: typeof Brain }> = {
  focus: { label: 'Focus Sprint', defaultDuration: 25 * 60, icon: Brain },
  shortBreak: { label: 'Short Break', defaultDuration: 5 * 60, icon: Coffee },
  longBreak: { label: 'Long Break', defaultDuration: 15 * 60, icon: Sunset },
  custom: { label: 'Custom', defaultDuration: 30 * 60, icon: Sliders },
};

const PRESET_MINUTES = [10, 15, 25, 30, 45, 60, 90];

export const FocusTimer: FC<FocusTimerProps> = ({
  sessions = [],
  onAddSession,
  onClearSessions,
}) => {
  const [mode, setMode] = useState<TimerMode>('focus');
  const [customMinutes, setCustomMinutes] = useState<number>(() => {
    const saved = localStorage.getItem('taskora_custom_timer_mins');
    return saved ? parseInt(saved, 10) || 30 : 30;
  });
  const [timeLeft, setTimeLeft] = useState(TIMER_MODES.focus.defaultDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [completionMessage, setCompletionMessage] = useState<string | null>(null);

  // Manual entry modal / popover state
  const [showManualEditor, setShowManualEditor] = useState(false);
  const [tempMinutesInput, setTempMinutesInput] = useState<string>(String(customMinutes));
  const [manualError, setManualError] = useState<string | null>(null);

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

    // Secondary fallback
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

      const isDeepWork = mode === 'focus' || mode === 'custom';
      const durationMinutes = mode === 'custom' 
        ? customMinutes 
        : Math.round(TIMER_MODES[mode].defaultDuration / 60);

      // Only record deep work focus sessions (not breaks) in history
      if (isDeepWork) {
        const newSession: FocusSession = {
          id: generateSessionId(),
          duration: durationMinutes,
          completedAt: new Date().toISOString(),
        };

        if (onAddSession) {
          onAddSession(newSession);
        }

        saveFocusSessions([newSession, ...sessions]);
        setCompletionMessage(`🎉 Great work! Completed a ${durationMinutes}-minute ${mode === 'custom' ? 'Custom Session' : 'Focus Sprint'}.`);
      } else {
        setCompletionMessage(`☕ Break finished! Ready for your next Focus Sprint?`);
      }

      // Reset timer to current mode default/custom
      const resetDuration = mode === 'custom' ? customMinutes * 60 : TIMER_MODES[mode].defaultDuration;
      setTimeLeft(resetDuration);
    }
  }, [isRunning, timeLeft, mode, customMinutes, onAddSession, sessions, playChime]);

  const handleStart = () => {
    setCompletionMessage(null);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    const targetDuration = mode === 'custom' ? customMinutes * 60 : TIMER_MODES[mode].defaultDuration;
    setTimeLeft(targetDuration);
  };

  const handleModeChange = (newMode: TimerMode) => {
    if (isRunning) {
      const confirmSwitch = window.confirm('Timer is running. Switch mode and reset?');
      if (!confirmSwitch) return;
    }
    setIsRunning(false);
    setMode(newMode);
    const targetDuration = newMode === 'custom' ? customMinutes * 60 : TIMER_MODES[newMode].defaultDuration;
    setTimeLeft(targetDuration);
    setCompletionMessage(null);
    if (newMode === 'custom') {
      setShowManualEditor(true);
      setTempMinutesInput(String(customMinutes));
    }
  };

  // Manual duration submission
  const handleApplyManualMinutes = (e?: FormEvent) => {
    if (e) e.preventDefault();
    const parsed = parseInt(tempMinutesInput, 10);
    if (isNaN(parsed) || parsed < 1 || parsed > 180) {
      setManualError('Please enter a duration between 1 and 180 minutes.');
      return;
    }

    setCustomMinutes(parsed);
    localStorage.setItem('taskora_custom_timer_mins', String(parsed));
    setMode('custom');
    setIsRunning(false);
    setTimeLeft(parsed * 60);
    setManualError(null);
    setShowManualEditor(false);
    setCompletionMessage(null);
  };

  const handleAdjustTempMinutes = (delta: number) => {
    const current = parseInt(tempMinutesInput, 10) || 30;
    const next = Math.max(1, Math.min(180, current + delta));
    setTempMinutesInput(String(next));
    setManualError(null);
  };

  const handleSelectPreset = (mins: number) => {
    setTempMinutesInput(String(mins));
    setCustomMinutes(mins);
    localStorage.setItem('taskora_custom_timer_mins', String(mins));
    setMode('custom');
    setIsRunning(false);
    setTimeLeft(mins * 60);
    setShowManualEditor(false);
    setManualError(null);
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

  const currentTotal = mode === 'custom' ? customMinutes * 60 : TIMER_MODES[mode].defaultDuration;
  const progress = currentTotal > 0 ? ((currentTotal - timeLeft) / currentTotal) * 100 : 0;

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
          Maintain deep work intervals with audio cues, presets, and manual custom durations.
        </p>

        {/* Mode Selector Tabs */}
        <div className="inline-flex flex-wrap items-center justify-center gap-1 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700/80 mb-5">
          {(['focus', 'shortBreak', 'longBreak', 'custom'] as TimerMode[]).map((m) => {
            const Icon = TIMER_MODES[m].icon;
            const isActive = mode === m;
            return (
              <button
                key={m}
                type="button"
                onClick={() => handleModeChange(m)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-[#1a73e8] text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>
                  {m === 'custom' ? `Custom (${customMinutes}m)` : TIMER_MODES[m].label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Manual Entry Toggle & Indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => {
              setTempMinutesInput(String(mode === 'custom' ? customMinutes : Math.round(timeLeft / 60)));
              setShowManualEditor(!showManualEditor);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/70 transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5 text-[#1a73e8]" />
            <span>{showManualEditor ? 'Hide Manual Entry' : 'Manual Duration Entry'}</span>
          </button>
        </div>

        {/* Manual Duration Entry Form / Panel */}
        {showManualEditor && (
          <div className="mb-7 p-4 sm:p-5 rounded-2xl bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 max-w-md mx-auto text-left animate-fade-in">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <Sliders className="w-3.5 h-3.5 text-[#1a73e8]" />
                Set Custom Duration (1 – 180 Minutes)
              </span>
              <button
                type="button"
                onClick={() => setShowManualEditor(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Direct Number Input + Stepper */}
            <form onSubmit={handleApplyManualMinutes} className="space-y-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleAdjustTempMinutes(-5)}
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold transition-colors"
                  title="Subtract 5 minutes"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <div className="relative flex-1">
                  <input
                    type="number"
                    min={1}
                    max={180}
                    value={tempMinutesInput}
                    onChange={(e) => {
                      setTempMinutesInput(e.target.value);
                      if (manualError) setManualError(null);
                    }}
                    placeholder="Enter minutes"
                    className="w-full text-center py-2 px-3 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-base font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                    mins
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => handleAdjustTempMinutes(5)}
                  className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 font-bold transition-colors"
                  title="Add 5 minutes"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <button
                  type="submit"
                  className="py-2 px-4 rounded-xl bg-[#1a73e8] hover:bg-blue-600 text-white font-semibold text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Set Time</span>
                </button>
              </div>

              {manualError && (
                <p className="text-[11px] text-[#EA4335] font-medium">{manualError}</p>
              )}

              {/* Quick Preset Buttons */}
              <div className="pt-2 border-t border-slate-200/60 dark:border-slate-800/80">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block mb-1.5 font-medium">
                  Quick Presets:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {PRESET_MINUTES.map((mins) => (
                    <button
                      key={mins}
                      type="button"
                      onClick={() => handleSelectPreset(mins)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        parseInt(tempMinutesInput, 10) === mins
                          ? 'bg-[#1a73e8] text-white'
                          : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60'
                      }`}
                    >
                      {mins}m
                    </button>
                  ))}
                </div>
              </div>
            </form>
          </div>
        )}

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
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 mx-auto mb-6 flex items-center justify-center rounded-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 shadow-inner group">
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
            <button
              type="button"
              onClick={() => {
                if (!isRunning) {
                  setTempMinutesInput(String(Math.round(timeLeft / 60)));
                  setShowManualEditor(true);
                }
              }}
              title={isRunning ? 'Timer running' : 'Click to manually set duration'}
              className="group-hover:scale-105 transition-transform cursor-pointer"
            >
              <span className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight font-mono">
                {formatTime(timeLeft)}
              </span>
            </button>
            <span
              className={`flex items-center gap-1.5 mt-2 text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                isRunning
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-[#1e8e3e] dark:text-[#34A853] border border-emerald-200 dark:border-emerald-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
              }`}
            >
              {isRunning && <span className="w-1.5 h-1.5 rounded-full bg-[#34A853] animate-pulse" />}
              {isRunning ? 'In Progress' : mode === 'custom' ? `Custom: ${customMinutes}m` : 'Paused / Ready'}
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
