import type { FC } from 'react';
import { Mic, ExternalLink, CheckCircle, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  activeTab: 'tasks' | 'timer' | 'dashboard';
  onTabChange: (tab: 'tasks' | 'timer' | 'dashboard') => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  theme,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 border-b border-slate-200 dark:border-slate-800 backdrop-blur-md transition-colors">
      {/* GDG Brand Accent Bar */}
      <div className="h-1 w-full flex">
        <div className="h-full flex-1 bg-[#4285F4]" title="GDG Blue" />
        <div className="h-full flex-1 bg-[#EA4335]" title="GDG Red" />
        <div className="h-full flex-1 bg-[#FBBC04]" title="GDG Yellow" />
        <div className="h-full flex-1 bg-[#34A853]" title="GDG Green" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1a73e8] to-[#4285F4] p-0.5 shadow-sm flex items-center justify-center">
            <div className="w-full h-full bg-white dark:bg-slate-900 rounded-[10px] flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-[#1a73e8]" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                Taskora
              </span>
              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-blue-50 dark:bg-blue-950/60 text-[#1a73e8] dark:text-blue-400 border border-blue-200 dark:border-blue-800">
                GDG Edition
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-normal hidden sm:block">
              Voice-Powered Productivity Dashboard
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => onTabChange('tasks')}
            className={`px-3.5 sm:px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'tasks'
                ? 'bg-[#1a73e8] text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/50'
            }`}
          >
            Tasks
          </button>
          <button
            type="button"
            onClick={() => onTabChange('timer')}
            className={`px-3.5 sm:px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'timer'
                ? 'bg-[#1a73e8] text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/50'
            }`}
          >
            Focus Timer
          </button>
          <button
            type="button"
            onClick={() => onTabChange('dashboard')}
            className={`px-3.5 sm:px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === 'dashboard'
                ? 'bg-[#1a73e8] text-white shadow-sm font-semibold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/50'
            }`}
          >
            Dashboard
          </button>
        </nav>

        {/* Right Actions: Theme Toggle & Wispr Flow Referral Link */}
        <div className="flex items-center gap-2.5">
          {/* Light / Dark Mode Toggle Button */}
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            aria-label="Toggle color theme"
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-slate-700" />
            ) : (
              <Sun className="w-4 h-4 text-[#FBBC04]" />
            )}
          </button>

          {/* Wispr Flow Referral Button */}
          <a
            href="https://ref.wisprflow.ai/hhg"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:border-blue-400 hover:text-[#1a73e8] dark:hover:text-blue-400 transition-all shadow-sm"
            title="Wispr Flow mandatory referral link"
          >
            <Mic className="w-3.5 h-3.5 text-[#1a73e8]" />
            <span>Wispr Flow</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </header>
  );
};
