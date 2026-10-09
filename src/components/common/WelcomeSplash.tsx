import { useState, useEffect, type FC } from 'react';
import { Mic, Sparkles, ArrowRight, CheckCircle2, Zap } from 'lucide-react';

interface WelcomeSplashProps {
  onDismiss?: () => void;
  autoDismissMs?: number;
}

export const WelcomeSplash: FC<WelcomeSplashProps> = ({
  onDismiss,
  autoDismissMs = 2400,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Progress bar animation
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const pct = Math.min(100, Math.round((elapsed / autoDismissMs) * 100));
      setProgress(pct);

      if (elapsed >= autoDismissMs) {
        clearInterval(interval);
        handleDismiss();
      }
    }, 25);

    return () => clearInterval(interval);
  }, [autoDismissMs]);

  const handleDismiss = () => {
    setIsFadingOut(true);
    setTimeout(() => {
      setIsVisible(false);
      onDismiss?.();
    }, 500); // 500ms fade transition
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-500 backdrop-blur-xl ${
        isFadingOut
          ? 'opacity-0 scale-105 pointer-events-none bg-slate-950/0'
          : 'opacity-100 scale-100 bg-white/95 dark:bg-[#0b1120]/95'
      }`}
    >
      {/* Background Subtle Gradient Accents */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 dark:bg-blue-600/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 dark:bg-emerald-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-amber-500/10 dark:bg-amber-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-lg w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 sm:p-10 shadow-2xl text-center flex flex-col items-center">
        {/* GDG Top Color Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-3xl flex overflow-hidden">
          <div className="h-full flex-1 bg-[#4285F4]" />
          <div className="h-full flex-1 bg-[#EA4335]" />
          <div className="h-full flex-1 bg-[#FBBC04]" />
          <div className="h-full flex-1 bg-[#34A853]" />
        </div>

        {/* Animated Brand Icon with Orbital GDG Rings */}
        <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
          {/* Orbital pulsating ring */}
          <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-blue-400/40 dark:border-blue-500/40 animate-spin" style={{ animationDuration: '12s' }} />
          
          {/* 4 Colored Orbit Dots */}
          <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#4285F4] shadow-sm shadow-blue-500/50" />
          <span className="absolute top-1/2 -right-1 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#EA4335] shadow-sm shadow-red-500/50" />
          <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2.5 h-2.5 rounded-full bg-[#FBBC04] shadow-sm shadow-yellow-500/50" />
          <span className="absolute top-1/2 -left-1 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-[#34A853] shadow-sm shadow-green-500/50" />

          {/* Central Logo Box */}
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Mic className="w-8 h-8 animate-pulse text-white" />
          </div>
        </div>

        {/* Subtitle Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-[#1a73e8] dark:text-blue-400 text-xs font-semibold mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Google Developer Groups • Goa Challenge</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
          TASKORA
        </h1>

        {/* Slogan */}
        <p className="text-sm sm:text-base font-medium text-slate-600 dark:text-slate-300 max-w-sm mb-4">
          Voice-Driven Productivity & Deep-Work Analytics Hub
        </p>

        {/* Animated Equalizer Wave Bars (Voice Active Simulation) */}
        <div className="flex items-center justify-center gap-1.5 h-6 mb-6">
          <span className="w-1 bg-[#4285F4] rounded-full animate-pulse h-4" style={{ animationDelay: '0.1s' }} />
          <span className="w-1 bg-[#EA4335] rounded-full animate-pulse h-6" style={{ animationDelay: '0.2s' }} />
          <span className="w-1 bg-[#FBBC04] rounded-full animate-pulse h-3" style={{ animationDelay: '0.3s' }} />
          <span className="w-1 bg-[#34A853] rounded-full animate-pulse h-5" style={{ animationDelay: '0.15s' }} />
          <span className="w-1 bg-[#4285F4] rounded-full animate-pulse h-4" style={{ animationDelay: '0.25s' }} />
        </div>

        {/* Feature Pills */}
        <div className="grid grid-cols-2 gap-2 w-full text-left text-xs mb-6 text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#34A853]" />
            <span>Voice Input + Wispr</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <Zap className="w-3.5 h-3.5 text-[#FBBC04]" />
            <span>Custom Focus Timer</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1a73e8]" />
            <span>Productivity Dashboard</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#EA4335]" />
            <span>Live Cloud Sync</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-yellow-400 to-green-500 transition-all duration-75"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="w-full py-2.5 px-4 rounded-xl font-semibold text-xs sm:text-sm bg-[#1a73e8] hover:bg-blue-600 text-white flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-blue-500/20 active:scale-[0.98]"
        >
          <span>Enter Workspace</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
