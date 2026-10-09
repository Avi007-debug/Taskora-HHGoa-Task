import type { FC } from 'react';
import type { Task } from '../../types/task';
import type { FocusSession } from '../../types/session';
import { StatCard } from './StatCard';
import { ProgressChart } from './ProgressChart';
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
  CalendarCheck
} from 'lucide-react';

interface DashboardProps {
  tasks?: Task[];
  sessions?: FocusSession[];
}

export const Dashboard: FC<DashboardProps> = ({ tasks = [], sessions = [] }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const totalSessions = sessions.length;
  const totalFocusMinutes = sessions.reduce((acc, s) => acc + (s.duration || 25), 0);
  const totalFocusHours = (totalFocusMinutes / 60).toFixed(1);

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

      {/* 2. Key Metrics Stat Cards */}
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

      {/* 3. Progress Visualization & Charts (Person 3 Core) */}
      <ProgressChart tasks={tasks} sessions={sessions} />

      {/* 4. Actionable Insights: High Priority Focus & Recent Activity Grid */}
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

      {/* 5. Wispr Flow Voice Productivity Guide Banner */}
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
              Speak tasks and descriptions with natural phrasing using Wispr Flow to accelerate backlog grooming and daily standup reviews.
            </p>
          </div>
        </div>

        <a
          href="https://ref.wisprflow.ai/hhg"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#1a73e8] text-white hover:bg-blue-600 transition-colors shadow-sm shrink-0"
        >
          <Mic className="w-3.5 h-3.5" />
          <span>Wispr Flow Referral</span>
        </a>
      </div>
    </div>
  );
};
