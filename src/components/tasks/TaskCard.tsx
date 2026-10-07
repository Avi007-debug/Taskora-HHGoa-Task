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

  const getPriorityBadge = (priority: Priority) => {
    switch (priority) {
      case 'high':
        return {
          label: 'High Priority',
          bg: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
          dot: 'bg-rose-500',
          icon: <AlertCircle className="w-3 h-3" />,
        };
      case 'medium':
        return {
          label: 'Medium',
          bg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
          dot: 'bg-amber-500',
          icon: <Clock className="w-3 h-3" />,
        };
      case 'low':
      default:
        return {
          label: 'Low',
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
          dot: 'bg-emerald-500',
          icon: <CheckCircle2 className="w-3 h-3" />,
        };
    }
  };

  const priorityStyle = getPriorityBadge(task.priority);

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-200 ${
        task.completed
          ? 'bg-slate-900/40 border-slate-800/80 opacity-75 hover:opacity-95'
          : 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/40 hover:shadow-lg hover:shadow-indigo-500/5'
      } p-4 sm:p-5`}
    >
      {isEditing ? (
        /* Edit Mode */
        <form onSubmit={handleSaveEdit} className="space-y-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={editTitle}
              onChange={(e) => {
                setEditTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Design wireframes using Wispr Flow"
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              autoFocus
            />
            {error && <p className="text-xs text-rose-400 mt-1">{error}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              placeholder="Additional details or voice notes..."
              className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-slate-200 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Priority:</span>
              {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                <button
                  type="button"
                  key={p}
                  onClick={() => setEditPriority(p)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium capitalize border transition-all ${
                    editPriority === p
                      ? p === 'high'
                        ? 'bg-rose-500 text-white border-rose-500'
                        : p === 'medium'
                        ? 'bg-amber-500 text-slate-950 font-semibold border-amber-500'
                        : 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
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
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1"
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
            className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-200 ${
              task.completed
                ? 'bg-emerald-500 border-emerald-500 text-white shadow-sm shadow-emerald-500/20'
                : 'border-slate-700 bg-slate-950 hover:border-indigo-400'
            }`}
            title={task.completed ? 'Mark as active' : 'Mark as completed'}
          >
            {task.completed && <Check className="w-4 h-4 stroke-[2.5]" />}
          </button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
              {/* Priority Chip */}
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${priorityStyle.bg}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot}`} />
                {priorityStyle.label}
              </span>

              {/* Action buttons */}
              <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  onClick={handleStartEdit}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-800 transition-colors"
                  title="Edit task"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDeleteTask(task.id)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  title="Delete task"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Task Title */}
            <h4
              className={`text-base font-semibold leading-snug break-words transition-all ${
                task.completed
                  ? 'text-slate-400 line-through'
                  : 'text-slate-100'
              }`}
            >
              {task.title}
            </h4>

            {/* Task Description */}
            {task.description && (
              <p
                className={`text-sm mt-1.5 leading-relaxed break-words whitespace-pre-wrap ${
                  task.completed ? 'text-slate-400/90 line-through' : 'text-slate-300'
                }`}
              >
                {task.description}
              </p>
            )}

            {/* Footer / Meta info */}
            <div className="flex items-center gap-4 mt-3 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {formatDate(task.createdAt)}
              </span>
              {task.completed && (
                <span className="text-emerald-400 font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
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
