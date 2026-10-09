import { useState, useMemo, type FC } from 'react';
import type { Task, TaskPriorityFilter, TaskStatusFilter } from '../../types/task';
import { TaskCard } from './TaskCard';
import { AddTask } from './AddTask';
import { TaskFilter } from './TaskFilter';
import { 
  ListTodo, 
  RotateCcw, 
  Sparkles, 
  CheckCheck,
  TrendingUp,
  Inbox
} from 'lucide-react';

interface TaskBoardProps {
  tasks: Task[];
  onAddTask: (task: Task) => void;
  onUpdateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
  onDeleteTask: (id: string) => void;
  onToggleComplete: (id: string) => void;
  onClearCompleted?: () => void;
}

export const TaskBoard: FC<TaskBoardProps> = ({
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleComplete,
  onClearCompleted,
}) => {
  const [statusFilter, setStatusFilter] = useState<TaskStatusFilter>('all');
  const [priorityFilter, setPriorityFilter] = useState<TaskPriorityFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Metrics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      // Status filter
      if (statusFilter === 'active' && task.completed) return false;
      if (statusFilter === 'completed' && !task.completed) return false;

      // Priority filter
      if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

      // Search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = task.title.toLowerCase().includes(query);
        const matchesDesc = task.description.toLowerCase().includes(query);
        if (!matchesTitle && !matchesDesc) return false;
      }

      return true;
    });
  }, [tasks, statusFilter, priorityFilter, searchQuery]);

  const handleClearFilters = () => {
    setStatusFilter('all');
    setPriorityFilter('all');
    setSearchQuery('');
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* Clean Overview Header */}
      <div className="relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        {/* 4-color accent top strip */}
        <div className="h-1 w-full flex">
          <div className="h-full flex-1 bg-[#4285F4]" />
          <div className="h-full flex-1 bg-[#EA4335]" />
          <div className="h-full flex-1 bg-[#FBBC04]" />
          <div className="h-full flex-1 bg-[#34A853]" />
        </div>

        <div className="p-6 sm:p-7 space-y-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-[#1a73e8] dark:text-blue-400 text-xs font-semibold border border-blue-200 dark:border-blue-900">
                <Sparkles className="w-3.5 h-3.5 text-[#1a73e8]" />
                Voice-Driven Development • Wispr Flow
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                Task Manager
              </h1>
              <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl">
                Organize your workflow with high-velocity voice dictation. Create, prioritize, and check off objectives effortlessly.
              </p>
            </div>

            {/* Quick Metrics Bar with Team Smashers Colors */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3 shrink-0 bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
              <div className="text-center px-3 py-1">
                <span className="block text-xl sm:text-2xl font-extrabold text-[#1a73e8]">{totalTasks}</span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Total</span>
              </div>
              <div className="text-center px-3 py-1 border-x border-slate-200 dark:border-slate-800">
                <span className="block text-xl sm:text-2xl font-extrabold text-[#B06000] dark:text-[#FBBC04]">{pendingTasks}</span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Pending</span>
              </div>
              <div className="text-center px-3 py-1">
                <span className="block text-xl sm:text-2xl font-extrabold text-[#1e8e3e] dark:text-[#34A853]">{completedTasks}</span>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Done</span>
              </div>
            </div>
          </div>

          {/* Progress Bar with Google Blue */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5">
              <span className="flex items-center gap-1.5 font-semibold text-slate-700 dark:text-slate-300">
                <TrendingUp className="w-3.5 h-3.5 text-[#1a73e8]" />
                Completion Progress
              </span>
              <span className="text-slate-900 dark:text-slate-100 font-bold">{completionPercentage}% Completed</span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-[#1a73e8] transition-all duration-300 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Add Task Component */}
      <AddTask onAddTask={onAddTask} />

      {/* Filter and Search Bar */}
      <TaskFilter
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityFilterChange={setPriorityFilter}
        searchQuery={searchQuery}
        onSearchQueryChange={setSearchQuery}
        counts={{
          all: totalTasks,
          active: pendingTasks,
          completed: completedTasks,
        }}
        onClearFilters={handleClearFilters}
      />

      {/* Task List Header with Bulk Actions */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-[#1a73e8]" />
          <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
            {statusFilter === 'all'
              ? 'All Tasks'
              : statusFilter === 'active'
              ? 'Active Tasks'
              : 'Completed Tasks'}
          </h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
            {filteredTasks.length}
          </span>
        </div>

        {completedTasks > 0 && onClearCompleted && (
          <button
            type="button"
            onClick={onClearCompleted}
            className="text-xs font-semibold text-slate-500 hover:text-[#EA4335] hover:bg-red-50 dark:hover:bg-red-950/30 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            title="Remove all completed tasks"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Clear Completed
          </button>
        )}
      </div>

      {/* Task List or Empty State */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 gap-3">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDeleteTask={onDeleteTask}
              onUpdateTask={onUpdateTask}
            />
          ))}
        </div>
      ) : (
        /* Empty State UI */
        <div className="bg-white dark:bg-slate-900 rounded-2xl p-10 text-center border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900 flex items-center justify-center text-[#1a73e8]">
            {tasks.length === 0 ? <Inbox className="w-6 h-6" /> : <RotateCcw className="w-6 h-6" />}
          </div>

          <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-1">
            {tasks.length === 0
              ? 'No tasks created yet'
              : 'No matching tasks found'}
          </h3>

          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto mb-5">
            {tasks.length === 0
              ? 'Get started by creating your first task above. Speak naturally with Wispr Flow to add tasks hands-free!'
              : 'Try clearing your search query or switching your status filter to view other tasks.'}
          </p>

          {tasks.length > 0 && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-colors shadow-sm"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset All Filters
            </button>
          )}
        </div>
      )}
    </div>
  );
};
