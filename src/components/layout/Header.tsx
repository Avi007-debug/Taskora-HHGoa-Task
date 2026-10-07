import type { FC } from 'react';
import { Mic, ExternalLink, CheckCircle } from 'lucide-react';

interface HeaderProps {
  activeTab: 'tasks' | 'timer' | 'dashboard';
  onTabChange: (tab: 'tasks' | 'timer' | 'dashboard') => void;
}

export const Header: FC<HeaderProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-slate-800/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 p-0.5 shadow-lg shadow-indigo-500/25 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950/40 rounded-[10px] flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
                Taskora
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                VoiceBoard
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Voice-Driven Productivity Hub
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800">
          <button
            type="button"
            onClick={() => onTabChange('tasks')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'tasks'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Tasks
          </button>
          <button
            type="button"
            onClick={() => onTabChange('timer')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'timer'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Focus Timer
          </button>
          <button
            type="button"
            onClick={() => onTabChange('dashboard')}
            className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === 'dashboard'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            Dashboard
          </button>
        </nav>

        {/* Wispr Flow Referral Link & Badge */}
        <div className="flex items-center gap-2">
          <a
            href="https://ref.wisprflow.ai/hhg"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-gradient-to-r from-purple-500/10 to-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:border-indigo-500/60 hover:text-white transition-all shadow-sm"
            title="Wispr Flow mandatory referral link"
          >
            <Mic className="w-3.5 h-3.5 text-indigo-400" />
            <span>Wispr Flow</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </div>
    </header>
  );
};
