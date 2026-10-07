import type { FC } from 'react';
import type { TaskPriorityFilter, TaskStatusFilter } from '../../types/task';
import { Search, SlidersHorizontal, X } from 'lucide-react';

interface TaskFilterProps {
  statusFilter: TaskStatusFilter;
  onStatusFilterChange: (status: TaskStatusFilter) => void;
  priorityFilter: TaskPriorityFilter;
  onPriorityFilterChange: (priority: TaskPriorityFilter) => void;
  searchQuery: string;
  onSearchQueryChange: (query: string) => void;
  counts: {
    all: number;
    active: number;
    completed: number;
  };
  onClearFilters: () => void;
}

export const TaskFilter: FC<TaskFilterProps> = ({
  statusFilter,
  onStatusFilterChange,
  priorityFilter,
  onPriorityFilterChange,
  searchQuery,
  onSearchQueryChange,
  counts,
  onClearFilters,
}) => {
  const isFiltered = statusFilter !== 'all' || priorityFilter !== 'all' || searchQuery.trim() !== '';

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 mb-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks by title or keyword..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchQueryChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Segmented Buttons with Google Blue active highlight */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              type="button"
              onClick={() => onStatusFilterChange('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                statusFilter === 'all'
                  ? 'bg-[#1a73e8] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-700/50'
              }`}
            >
              All
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${statusFilter === 'all' ? 'bg-blue-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                {counts.all}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onStatusFilterChange('active')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                statusFilter === 'active'
                  ? 'bg-[#1a73e8] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-700/50'
              }`}
            >
              Active
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${statusFilter === 'active' ? 'bg-blue-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                {counts.active}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onStatusFilterChange('completed')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                statusFilter === 'completed'
                  ? 'bg-[#34A853] text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-white/60 dark:hover:bg-slate-700/50'
              }`}
            >
              Completed
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${statusFilter === 'completed' ? 'bg-emerald-700 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'}`}>
                {counts.completed}
              </span>
            </button>
          </div>

          {/* Priority Filter Select */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-3 py-1.5 rounded-xl">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={priorityFilter}
              onChange={(e) => onPriorityFilterChange(e.target.value as TaskPriorityFilter)}
              className="bg-transparent text-xs text-slate-800 dark:text-slate-200 font-medium focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-200">All Priorities</option>
              <option value="high" className="bg-white dark:bg-slate-900 text-[#EA4335]">High Priority</option>
              <option value="medium" className="bg-white dark:bg-slate-900 text-[#B06000] dark:text-[#FBBC04]">Medium Priority</option>
              <option value="low" className="bg-white dark:bg-slate-900 text-[#1e8e3e] dark:text-[#34A853]">Low Priority</option>
            </select>
          </div>

          {/* Reset button if filter is active */}
          {isFiltered && (
            <button
              onClick={onClearFilters}
              className="px-2.5 py-1.5 rounded-lg text-xs text-slate-500 dark:text-slate-400 hover:text-[#EA4335] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-1 font-medium"
              title="Reset all filters"
            >
              <X className="w-3.5 h-3.5" />
              Reset
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
