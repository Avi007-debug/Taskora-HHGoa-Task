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
      {/* Top Banner / Hero Overview */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/20 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Wispr Flow Voice-Driven Productivity
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Task Manager
            </h1>
            <p className="text-slate-400 text-sm max-w-xl">
              Organize your workflow with high-velocity voice inputs. Create, prioritize, and check off objectives effortlessly.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 shrink-0 bg-slate-900/80 p-3 sm:p-4 rounded-2xl border border-slate-800">
            <div className="text-center px-2">
              <span className="block text-xl sm:text-2xl font-bold text-slate-100">{totalTasks}</span>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Total</span>
            </div>
            <div className="text-center px-2 border-x border-slate-800">
              <span className="block text-xl sm:text-2xl font-bold text-amber-400">{pendingTasks}</span>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Pending</span>
            </div>
            <div className="text-center px-2">
              <span className="block text-xl sm:text-2xl font-bold text-emerald-400">{completedTasks}</span>
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">Done</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-medium text-slate-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
              Progress Tracker
            </span>
            <span className="text-slate-200 font-semibold">{completionPercentage}% Completed</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 transition-all duration-500 rounded-full"
              style={{ width: `${completionPercentage}%` }}
            />
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
          <ListTodo className="w-5 h-5 text-indigo-400" />
          <h2 className="text-lg font-bold text-slate-200">
            {statusFilter === 'all'
              ? 'All Tasks'
              : statusFilter === 'active'
              ? 'Active Tasks'
              : 'Completed Tasks'}
          </h2>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700">
            {filteredTasks.length}
          </span>
        </div>

        {completedTasks > 0 && onClearCompleted && (
          <button
            type="button"
            onClick={onClearCompleted}
            className="text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5"
            title="Remove all completed tasks"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Clear Completed
          </button>
        )}
      </div>

      {/* Task List or Empty State */}
      {filteredTasks.length > 0 ? (
        <div className="grid grid-cols-1 gap-3.5">
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
        <div className="glass-panel rounded-2xl p-10 text-center border border-slate-800/80 shadow-inner">
          <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
            {tasks.length === 0 ? <Inbox className="w-7 h-7" /> : <RotateCcw className="w-7 h-7" />}
          </div>

          <h3 className="text-lg font-bold text-slate-100 mb-1">
            {tasks.length === 0
              ? 'No tasks created yet'
              : 'No matching tasks found'}
          </h3>

          <p className="text-sm text-slate-400 max-w-md mx-auto mb-5">
            {tasks.length === 0
              ? 'Get started by creating your first task above. Use Wispr Flow to speak naturally and add tasks hands-free!'
              : 'Try clearing your search query or switching your status filter to see other tasks.'}
          </p>

          {tasks.length > 0 && (
            <button
              onClick={handleClearFilters}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors shadow-sm"
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
