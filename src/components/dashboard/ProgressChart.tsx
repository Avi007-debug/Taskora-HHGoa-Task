import type { FC } from 'react';
import type { Task } from '../../types/task';
import type { FocusSession } from '../../types/session';
import { TrendingUp, Award, Calendar } from 'lucide-react';

interface ProgressChartProps {
  tasks: Task[];
  sessions: FocusSession[];
}

export const ProgressChart: FC<ProgressChartProps> = ({ tasks, sessions }) => {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Priority Breakdown
  const highTasks = tasks.filter((t) => t.priority === 'high');
  const highCompleted = highTasks.filter((t) => t.completed).length;

  const medTasks = tasks.filter((t) => t.priority === 'medium');
  const medCompleted = medTasks.filter((t) => t.completed).length;

  const lowTasks = tasks.filter((t) => t.priority === 'low');
  const lowCompleted = lowTasks.filter((t) => t.completed).length;

  // Last 7 days session minutes calculation
  const now = new Date();
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(now.getDate() - (6 - i));
    return d;
  });

  const dailyFocusMinutes = last7Days.map((day) => {
    const dayStr = day.toDateString();
    const daySessions = sessions.filter(
      (s) => new Date(s.completedAt).toDateString() === dayStr
    );
    const mins = daySessions.reduce((acc, s) => acc + (s.duration || 25), 0);
    return {
      dayName: day.toLocaleDateString(undefined, { weekday: 'short' }),
      dateFormatted: day.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' }),
      minutes: mins,
      sessionCount: daySessions.length,
    };
  });

  const maxMinutes = Math.max(...dailyFocusMinutes.map((d) => d.minutes), 50); // minimum scale of 50 min

  // Circular gauge calculations (radius 42, circumference ~263.89)
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Chart 1: Circular Progress Gauge & Completion Stats (5 cols) */}
      <div className="lg:col-span-5 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-[#1a73e8]">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                Completion Rate
              </h3>
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 text-[#1a73e8] border border-blue-200 dark:border-blue-900">
              {completedTasks} / {totalTasks} Tasks
            </span>
          </div>

          {/* SVG Gauge */}
          <div className="relative w-44 h-44 mx-auto my-3 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
              {/* Background track */}
              <circle
                className="text-slate-100 dark:text-slate-800 stroke-current"
                strokeWidth="8"
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
              />
              {/* Animated Progress Arc */}
              <circle
                className="text-[#1a73e8] stroke-current transition-all duration-700 ease-out"
                strokeWidth="8"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                cx="50"
                cy="50"
                r={radius}
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {completionRate}%
              </span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Overall Rate
              </span>
            </div>
          </div>
        </div>

        {/* Priority Micro Bars */}
        <div className="space-y-2.5 pt-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* High Priority */}
          <div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1 text-[11px]">
              <span className="flex items-center gap-1 font-semibold text-[#EA4335]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EA4335]" />
                High Priority
              </span>
              <span>{highCompleted}/{highTasks.length} Done</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#EA4335] rounded-full transition-all duration-500"
                style={{
                  width: `${highTasks.length > 0 ? (highCompleted / highTasks.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          {/* Medium Priority */}
          <div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1 text-[11px]">
              <span className="flex items-center gap-1 font-semibold text-[#B06000] dark:text-[#FBBC04]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#FBBC04]" />
                Medium Priority
              </span>
              <span>{medCompleted}/{medTasks.length} Done</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#FBBC04] rounded-full transition-all duration-500"
                style={{
                  width: `${medTasks.length > 0 ? (medCompleted / medTasks.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>

          {/* Low Priority */}
          <div>
            <div className="flex justify-between text-slate-600 dark:text-slate-400 mb-1 text-[11px]">
              <span className="flex items-center gap-1 font-semibold text-[#1e8e3e] dark:text-[#34A853]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34A853]" />
                Low Priority
              </span>
              <span>{lowCompleted}/{lowTasks.length} Done</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#34A853] rounded-full transition-all duration-500"
                style={{
                  width: `${lowTasks.length > 0 ? (lowCompleted / lowTasks.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Chart 2: 7-Day Focus Time Activity Bar Chart (7 cols) */}
      <div className="lg:col-span-7 bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between transition-colors">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-[#1e8e3e] dark:text-[#34A853]">
                <Calendar className="w-4 h-4" />
              </div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                7-Day Focus Sprints Activity
              </h3>
            </div>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-[#FBBC04]" />
              {sessions.length} Total Sessions
            </span>
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
            Daily breakdown of focus time tracked via the Pomodoro module.
          </p>

          {/* Bar Chart Container */}
          <div className="h-44 flex items-end justify-between gap-2 sm:gap-3 px-2 pt-6">
            {dailyFocusMinutes.map((item, idx) => {
              const heightPercent = maxMinutes > 0 ? Math.round((item.minutes / maxMinutes) * 100) : 0;
              const isToday = idx === 6;

              return (
                <div key={item.dayName + idx} className="flex-1 flex flex-col items-center h-full justify-end group">
                  {/* Tooltip on hover */}
                  <div className="text-[10px] font-bold text-slate-700 dark:text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity mb-1 whitespace-nowrap">
                    {item.minutes}m
                  </div>

                  {/* Vertical Bar */}
                  <div className="w-full max-w-[32px] h-32 bg-slate-100 dark:bg-slate-800/80 rounded-t-lg relative flex items-end overflow-hidden">
                    <div
                      className={`w-full rounded-t-lg transition-all duration-500 ${
                        isToday
                          ? 'bg-[#1a73e8]'
                          : item.minutes > 0
                          ? 'bg-[#34A853]'
                          : 'bg-transparent'
                      }`}
                      style={{ height: `${Math.max(heightPercent, item.minutes > 0 ? 8 : 0)}%` }}
                    />
                  </div>

                  {/* Day Label */}
                  <span
                    className={`mt-2 text-[10px] font-semibold ${
                      isToday
                        ? 'text-[#1a73e8] font-bold'
                        : 'text-slate-500 dark:text-slate-400'
                    }`}
                  >
                    {item.dayName}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#1a73e8]" />
              Today
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-[#34A853]" />
              Past Days
            </span>
          </div>
          <span>Scale: up to {maxMinutes}m</span>
        </div>
      </div>
    </div>
  );
};
