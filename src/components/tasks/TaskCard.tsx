import { useState, type FC, type FormEvent } from 'react';
import type { Task, Priority } from '../../types/task';
import { 
  Check, 
  Trash2, 
  Edit3, 
  Calendar, 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  X, 
  Save 
} from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onUpdateTask: (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => void;
}

export const TaskCard: FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onDeleteTask,
  onUpdateTask,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editPriority, setEditPriority] = useState<Priority>(task.priority);
  const [error, setError] = useState('');

  const handleStartEdit = () => {
    setEditTitle(task.title);
    setEditDescription(task.description);
    setEditPriority(task.priority);
    setError('');
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError('');
  };

  const handleSaveEdit = (e: FormEvent) => {
    e.preventDefault();
    if (!editTitle.trim()) {
      setError('Task title cannot be empty.');
      return;
    }

    onUpdateTask(task.id, {
      title: editTitle.trim(),
      description: editDescription.trim(),
      priority: editPriority,
    });
    setIsEditing(false);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return 'Recently';
    }
  };

  // Authentic GDG Color Badges: Red (High), Yellow/Amber (Medium), Green (Low)
  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return {
          label: 'High Priority',
          bg: 'bg-red-50 text-[#EA4335] border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900',
          dot: 'bg-[#EA4335]',
          icon: <AlertCircle className="w-3 h-3" />,
        };
      case 'medium':
        return {
          label: 'Medium',
          bg: 'bg-amber-50 text-[#B06000] border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900',
          dot: 'bg-[#FBBC04]',
          icon: <Clock className="w-3 h-3" />,
        };
      case 'low':
      default:
        return {
          label: 'Low',
          bg: 'bg-emerald-50 text-[#1e8e3e] border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900',
          dot: 'bg-[#34A853]',
          icon: <CheckCircle2 className="w-3 h-3" />,
        };
    }
  };

  const priorityStyle = getPriorityBadge(task.priority);

  return (
    <div
      className={`group relative rounded-xl border transition-all duration-150 ${
        task.completed
          ? 'bg-slate-50/70 dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 opacity-80'
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700'
      } p-4 sm:p-5`}
    >
      {isEditing ? (
        /* Edit Mode */
        <form 
          onSubmit={handleSaveEdit} 
          onKeyDown={(e) => {
            if (e.key === 'Escape') handleCancelEdit();
          }}
          className="space-y-3"
        >
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Title <span className="text-[#EA4335]">*</span>
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => {
                setEditTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Design wireframes using Wispr Flow"
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8]"
              autoFocus
            />
            {error && <p className="text-xs text-[#EA4335] mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Additional details or voice notes..."
              className="w-full px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-200 text-sm focus:outline-none focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] resize-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Priority:</span>
              {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setEditPriority(p)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold capitalize border transition-all ${
                    editPriority === p
                      ? p === 'high'
                        ? 'bg-[#EA4335] text-white border-[#EA4335]'
                        : p === 'medium'
                        ? 'bg-[#FBBC04] text-slate-900 border-[#FBBC04]'
                        : 'bg-[#34A853] text-white border-[#34A853]'
                      : 'bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCancelEdit}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-[#1a73e8] hover:bg-blue-600 text-white shadow-sm transition-all flex items-center gap-1"
              >
                <Save className="w-3.5 h-3.5" />
                Save Changes
              </button>
            </div>
          </div>
        </form>
      ) : (
        /* Normal Display Mode */
        <div className="flex items-start gap-3.5">
          {/* Custom Checkbox */}
          <button
            type="button"
            onClick={() => onToggleComplete(task.id)}
            role="checkbox"
            aria-checked={task.completed}
            className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-150 ${
              task.completed
                ? 'bg-[#34A853] border-[#34A853] text-white shadow-sm'
                : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 hover:border-[#1a73e8]'
            }`}
            title={task.completed ? 'Mark as active' : 'Mark as completed'}
          >
            {task.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              {/* Priority Chip with GDG colors */}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${priorityStyle.bg}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`} />
                {priorityStyle.label}
              </span>

              {/* Action buttons */}
              <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="p-1.5 rounded-md text-slate-500 hover:text-[#1a73e8] hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  title="Edit task"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteTask(task.id)}
                  className="p-1.5 rounded-md text-slate-500 hover:text-[#EA4335] hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Task Title */}
            <h4
              className={`text-sm sm:text-base font-semibold leading-snug break-words transition-all ${
                task.completed
                  ? 'text-slate-400 dark:text-slate-500 line-through'
                  : 'text-slate-900 dark:text-slate-100'
              }`}
            >
              {task.title}
            </h4>

            {/* Task Description */}
            {task.description && (
              <p
                className={`text-xs sm:text-sm mt-1 leading-relaxed break-words whitespace-pre-wrap ${
                  task.completed
                    ? 'text-slate-400 dark:text-slate-500 line-through'
                    : 'text-slate-600 dark:text-slate-300'
                }`}
              >
                {task.description}
              </p>
            )}

            {/* Footer / Meta info */}
            <div className="flex items-center gap-4 mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-400" />
                {formatDate(task.createdAt)}
              </span>
              {task.completed && (
                <span className="text-[#34A853] font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Completed
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
