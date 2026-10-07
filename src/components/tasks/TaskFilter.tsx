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
    <div className="glass-card rounded-2xl p-4 sm:p-5 mb-6 border border-slate-800 shadow-xl transition-all">
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search tasks by title or keyword..."
            value={searchQuery}
            onChange={(e) => onSearchQueryChange(e.target.value)}
            className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchQueryChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors"
              title="Clear search"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Status Segmented Buttons */}
          <div className="flex bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => onStatusFilterChange('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                statusFilter === 'all'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              All
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${statusFilter === 'all' ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {counts.all}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onStatusFilterChange('active')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                statusFilter === 'active'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Active
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${statusFilter === 'active' ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {counts.active}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onStatusFilterChange('completed')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                statusFilter === 'completed'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              Completed
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${statusFilter === 'completed' ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-400'}`}>
                {counts.completed}
              </span>
            </button>
          </div>

          {/* Priority Filter Select */}
          <div className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded-xl">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={priorityFilter}
              onChange={(e) => onPriorityFilterChange(e.target.value as TaskPriorityFilter)}
              className="bg-transparent text-xs text-slate-200 focus:outline-none cursor-pointer pr-1"
            >
              <option value="all" className="bg-slate-900 text-slate-200">All Priorities</option>
              <option value="high" className="bg-slate-900 text-rose-400">High Priority</option>
              <option value="medium" className="bg-slate-900 text-amber-400">Medium Priority</option>
              <option value="low" className="bg-slate-900 text-emerald-400">Low Priority</option>
            </select>
          </div>

          {/* Reset button if filter is active */}
          {isFiltered && (
            <button
              onClick={onClearFilters}
              className="px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors flex items-center gap-1"
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
