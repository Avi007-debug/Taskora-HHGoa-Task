import { useState, useRef, type FC, type FormEvent } from 'react';
import type { Task, Priority } from '../../types/task';
import type { FocusSession } from '../../types/session';
import { StatCard } from './StatCard';
import { ProgressChart } from './ProgressChart';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { generateTaskId } from '../../utils/taskStorage';
import { 
  CheckCircle2, 
  Clock, 
  Flame, 
  Layers, 
  Sparkles, 
  Timer, 
  CheckSquare, 
  AlertCircle,
  Lightbulb,
  Mic,
  MicOff,
  Send,
  Volume2,
  CalendarCheck
} from 'lucide-react';

interface DashboardProps {
  tasks?: Task[];
  sessions?: FocusSession[];
  onAddTask?: (task: Task) => void;
  onNavigateToTasks?: () => void;
}

export const Dashboard: FC<DashboardProps> = ({ 
  tasks = [], 
  sessions = [],
  onAddTask,
  onNavigateToTasks,
}) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalSessions = sessions.length;
  const totalFocusMinutes = sessions.reduce((acc, s) => acc + (s.duration || 25), 0);
  const totalFocusHours = (totalFocusMinutes / 60).toFixed(1);

  // Voice Input State on Dashboard
  const [voiceTaskTitle, setVoiceTaskTitle] = useState('');
  const [voicePriority, setVoicePriority] = useState<Priority>('medium');
  const [voiceSuccessFeedback, setVoiceSuccessFeedback] = useState<string | null>(null);
  const voiceInputRef = useRef<HTMLInputElement>(null);

  const {
    isListening,
    toggleListening,
    error: voiceError,
  } = useVoiceInput({
    onResult: (spokenText) => {
      setVoiceTaskTitle(spokenText);
      if (voiceSuccessFeedback) setVoiceSuccessFeedback(null);
    },
  });

  const handleVoiceTaskSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = voiceTaskTitle.trim();
    if (!trimmed) return;

    if (onAddTask) {
      const newTask: Task = {
        id: generateTaskId(),
        title: trimmed,
        description: 'Captured via Dashboard Voice Input',
        priority: voicePriority,
        completed: false,
        createdAt: new Date().toISOString(),
      };
      onAddTask(newTask);
      setVoiceSuccessFeedback(`Added "${trimmed}" to Task Board!`);
      setVoiceTaskTitle('');
      setTimeout(() => {
        setVoiceSuccessFeedback(null);
      }, 5000);
    }
  };

  // Motivational message based on completion milestone
  const getMotivationalInsight = () => {
    if (totalTasks === 0) {
      return {
        badge: 'Ready to Launch',
        title: 'Begin Your Productivity Journey',
        quote: 'Add your first task with Wispr Flow voice dictation to kick off your streak!',
        color: 'text-[#1a73e8]',
      };
    }
    if (completionRate === 100) {
      return {
        badge: 'Peak Mastery 🚀',
        title: 'Outstanding! All Objectives Crushed',
        quote: 'Every single goal completed today. Celebrate the win or recharge for tomorrow!',
        color: 'text-[#1e8e3e] dark:text-[#34A853]',
      };
    }
    if (completionRate >= 75) {
      return {
        badge: 'Final Stretch 🔥',
        title: 'Almost at the Finish Line',
        quote: "You're in peak flow. Finish the remaining items and close out a stellar day.",
        color: 'text-[#EA4335]',
      };
    }
    if (completionRate >= 50) {
      return {
        badge: 'Steady Flow ⚡',
        title: 'Halfway Mark Conquered',
        quote: 'Superb momentum! Take a short 5-minute break, then dive into your next focus block.',
        color: 'text-[#B06000] dark:text-[#FBBC04]',
      };
    }
    return {
      badge: 'Building Momentum 🌱',
      title: 'Building Today’s Flow',
      quote: 'Momentum builds one completed objective at a time. Pick a high-priority task and start!',
      color: 'text-[#1a73e8]',
    };
  };

  const insight = getMotivationalInsight();

  // Recent completed tasks (last 4)
  const recentCompletedTasks = tasks
    .filter((t) => t.completed)
    .slice(0, 4);

  // High priority pending tasks (last 3)
  const highPriorityPending = tasks
    .filter((t) => !t.completed && t.priority === 'high')
    .slice(0, 3);

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* 1. Motivational Hero Banner with GDG Accent Strip */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        {/* GDG Accent line */}
        <div className="h-1 w-full flex">
          <div className="h-full flex-1 bg-[#4285F4]" />
          <div className="h-full flex-1 bg-[#EA4335]" />
          <div className="h-full flex-1 bg-[#FBBC04]" />
          <div className="h-full flex-1 bg-[#34A853]" />
        </div>

        <div className="p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 text-[#1a73e8] dark:text-blue-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{insight.badge}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {insight.title}
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl italic">
              "{insight.quote}"
            </p>
          </div>

          <div className="shrink-0 bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-center sm:text-right min-w-[140px]">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Efficiency Score
            </span>
            <span className="text-3xl font-black text-[#1a73e8] tracking-tight">
              {completionRate}%
            </span>
            <span className="block text-[11px] text-slate-400 mt-0.5">
              {completedTasks} of {totalTasks} finished
            </span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Dashboard Voice Quick-Capture Widget */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`p-2 rounded-xl transition-all ${
                isListening
                  ? 'bg-red-100 dark:bg-red-950/60 text-[#EA4335] ring-2 ring-red-400/50'
                  : 'bg-blue-50 dark:bg-blue-950/60 text-[#1a73e8]'
              }`}
            >
              <Mic className={`w-4 h-4 ${isListening ? 'animate-bounce' : ''}`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900 dark:text-white">
                  Dashboard Voice Quick-Capture
                </h2>
                {isListening && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-950/80 text-[#EA4335] border border-red-200 dark:border-red-900 animate-pulse">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
                    Listening
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Click microphone to dictate a task directly into your active backlog.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleListening}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
                isListening
                  ? 'bg-[#EA4335] text-white hover:bg-red-600 ring-2 ring-red-400/50'
                  : 'bg-[#1a73e8] text-white hover:bg-blue-600'
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-3.5 h-3.5" />
                  <span>Stop Dictating</span>
                </>
              ) : (
                <>
                  <Mic className="w-3.5 h-3.5" />
                  <span>Voice Dictate Task</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Voice Input Field */}
        <form onSubmit={handleVoiceTaskSubmit} className="space-y-2.5">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                ref={voiceInputRef}
                type="text"
                value={voiceTaskTitle}
                onChange={(e) => {
                  setVoiceTaskTitle(e.target.value);
                  if (voiceSuccessFeedback) setVoiceSuccessFeedback(null);
                }}
                placeholder={
                  isListening
                    ? 'Listening... speak your task title now...'
                    : 'Speak or type a new task here...'
                }
                className={`w-full py-2.5 pl-3.5 pr-10 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800/80 border rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1a73e8] transition-all ${
                  isListening
                    ? 'border-red-400 dark:border-red-500/60 ring-2 ring-red-400/20'
                    : 'border-slate-300 dark:border-slate-700'
                }`}
              />
              <button
                type="button"
                onClick={toggleListening}
                className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-colors ${
                  isListening
                    ? 'text-[#EA4335] hover:text-red-700 bg-red-50 dark:bg-red-950/50'
                    : 'text-slate-400 hover:text-[#1a73e8]'
                }`}
                title={isListening ? 'Stop listening' : 'Start voice input'}
              >
                <Mic className={`w-4 h-4 ${isListening ? 'animate-bounce' : ''}`} />
              </button>
            </div>

            {/* Quick Priority Select */}
            <select
              value={voicePriority}
              onChange={(e) => setVoicePriority(e.target.value as Priority)}
              className="hidden sm:block py-2.5 px-3 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1a73e8]"
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <button
              type="submit"
              disabled={!voiceTaskTitle.trim()}
              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-200 text-white dark:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1.5 shrink-0 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Task</span>
            </button>
          </div>

          {/* Active Audio Waveform Indicator */}
          {isListening && (
            <div className="flex items-center gap-2 p-2 rounded-lg bg-red-50/80 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-xs text-red-700 dark:text-red-300 animate-fade-in">
              <Volume2 className="w-4 h-4 shrink-0 animate-pulse text-[#EA4335]" />
              <span className="text-[11px] font-medium flex-1">
                Microphone stream active — speak naturally (e.g., "Prepare Goa hackathon pitch")
              </span>
              <div className="flex items-center gap-1">
                <span className="w-1 bg-[#EA4335] rounded-full animate-pulse h-3" />
                <span className="w-1 bg-[#EA4335] rounded-full animate-pulse h-5" style={{ animationDelay: '0.1s' }} />
                <span className="w-1 bg-[#EA4335] rounded-full animate-pulse h-4" style={{ animationDelay: '0.2s' }} />
                <span className="w-1 bg-[#EA4335] rounded-full animate-pulse h-2" style={{ animationDelay: '0.3s' }} />
              </div>
            </div>
          )}

          {/* Success Notification */}
          {voiceSuccessFeedback && (
            <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 animate-fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#34A853] shrink-0" />
                <span>{voiceSuccessFeedback}</span>
              </div>
              {onNavigateToTasks && (
                <button
                  type="button"
                  onClick={onNavigateToTasks}
                  className="text-[11px] font-semibold text-[#1a73e8] dark:text-blue-400 hover:underline"
                >
                  View in Tasks →
                </button>
              )}
            </div>
          )}

          {/* Voice Error notice */}
          {voiceError && (
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-xs text-amber-800 dark:text-amber-300 flex items-center justify-between">
              <span>{voiceError}</span>
              <a
                href="https://ref.wisprflow.ai/hhg"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] font-semibold underline text-[#1a73e8]"
              >
                Use Wispr Flow
              </a>
            </div>
          )}
        </form>
      </div>

      {/* 3. Key Metrics Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Objectives"
          value={totalTasks}
          subtitle={`${pendingTasks} pending attention`}
          icon={<Layers className="w-5 h-5 text-[#1a73e8]" />}
          color="blue"
        />
        <StatCard
          title="Completed Tasks"
          value={completedTasks}
          subtitle={`${completionRate}% completion rate`}
          icon={<CheckSquare className="w-5 h-5 text-[#1e8e3e] dark:text-[#34A853]" />}
          color="green"
        />
        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
          subtitle={`${highPriorityPending.length} high priority`}
          icon={<Clock className="w-5 h-5 text-[#B06000] dark:text-[#FBBC04]" />}
          color="yellow"
        />
        <StatCard
          title="Focus Sessions"
          value={totalSessions}
          subtitle={`${totalFocusHours} hrs deep work`}
          icon={<Timer className="w-5 h-5 text-[#EA4335]" />}
          color="red"
        />
      </div>

      {/* 4. Progress Visualization & Charts (Person 3 Core) */}
      <ProgressChart tasks={tasks} sessions={sessions} />

      {/* 5. Actionable Insights: High Priority Focus & Recent Activity Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* High Priority Objectives Pending */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-red-50 dark:bg-red-950/60 text-[#EA4335]">
                <AlertCircle className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                High Priority Focus
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-[#EA4335] bg-red-50 dark:bg-red-950/60 border border-red-200 dark:border-red-900 px-2 py-0.5 rounded-md">
              {highPriorityPending.length} Urgent
            </span>
          </div>

          {highPriorityPending.length > 0 ? (
            <ul className="space-y-2.5">
              {highPriorityPending.map((task) => (
                <li
                  key={task.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5"
                >
                  <span className="w-2 h-2 rounded-full bg-[#EA4335] mt-1.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                      {task.title}
                    </p>
                    {task.description && (
                      <p className="text-[11px] text-slate-500 truncate mt-0.5">
                        {task.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              <CheckCircle2 className="w-6 h-6 mx-auto mb-1 text-[#34A853]" />
              <p>No urgent high-priority tasks pending!</p>
            </div>
          )}
        </div>

        {/* Recent Wins / Completed Feed */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#1e8e3e] dark:text-[#34A853]">
                <CalendarCheck className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                Recent Completed Wins
              </h3>
            </div>
            <span className="text-[11px] font-semibold text-[#1e8e3e] dark:text-[#34A853] bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 px-2 py-0.5 rounded-md">
              {recentCompletedTasks.length} Recent
            </span>
          </div>

          {recentCompletedTasks.length > 0 ? (
            <ul className="space-y-2.5">
              {recentCompletedTasks.map((task) => (
                <li
                  key={task.id}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-start gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#34A853] mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 line-through truncate">
                      {task.title}
                    </p>
                    <p className="text-[10px] text-slate-400 mt-0.5">
                      Completed {new Date(task.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="py-8 text-center text-slate-400 text-xs">
              <Flame className="w-6 h-6 mx-auto mb-1 text-slate-400 opacity-50" />
              <p>Complete your first task to see your wins log here!</p>
            </div>
          )}
        </div>
      </div>

      {/* 6. Wispr Flow Voice Productivity Guide Banner */}
      <div className="bg-slate-50 dark:bg-slate-900/60 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs transition-colors">
        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
          <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-[#1a73e8] shrink-0">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <strong className="text-slate-900 dark:text-white block font-semibold">
              Voice-Driven Development Workflow
            </strong>
            <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
              Speak tasks and descriptions with natural phrasing using in-app mic or Wispr Flow to accelerate backlog grooming and daily standup reviews.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => {
              if (voiceInputRef.current) {
                voiceInputRef.current.focus();
              }
              toggleListening();
            }}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all shadow-sm ${
              isListening
                ? 'bg-[#EA4335] text-white hover:bg-red-600'
                : 'bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700'
            }`}
          >
            <Mic className={`w-3.5 h-3.5 ${isListening ? 'animate-pulse text-white' : 'text-[#1a73e8]'}`} />
            <span>{isListening ? 'Listening...' : 'Voice Dictate'}</span>
          </button>

          <a
            href="https://ref.wisprflow.ai/hhg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1a73e8] text-white hover:bg-blue-600 transition-colors shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Wispr Flow Referral</span>
          </a>
        </div>
      </div>
    </div>
  );
};
