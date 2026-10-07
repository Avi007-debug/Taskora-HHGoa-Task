import { useState, type FC, type FormEvent, type KeyboardEvent } from 'react';
import type { Priority, Task } from '../../types/task';
import { generateTaskId } from '../../utils/taskStorage';
import { PlusCircle, Mic, AlertCircle, X, Sparkles } from 'lucide-react';

interface AddTaskProps {
  onAddTask: (task: Task) => void;
}

export const AddTask: FC<AddTaskProps> = ({ onAddTask }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [error, setError] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Please provide a task title.');
      return;
    }

    const newTask: Task = {
      id: generateTaskId(),
      title: trimmedTitle,
      description: description.trim(),
      priority,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    onAddTask(newTask);
    setTitle('');
    setDescription('');
    setPriority('medium');
    setError('');
    setIsOpen(false);
  };

  const handleQuickAddKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !isOpen) {
      e.preventDefault();
      const trimmedTitle = title.trim();
      if (!trimmedTitle) {
        setError('Please provide a task title.');
        return;
      }
      const newTask: Task = {
        id: generateTaskId(),
        title: trimmedTitle,
        description: '',
        priority: 'medium',
        completed: false,
        createdAt: new Date().toISOString(),
      };
      onAddTask(newTask);
      setTitle('');
      setError('');
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 mb-6 border border-slate-800 shadow-xl relative overflow-hidden">
      {/* Background glow accent */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {!isOpen ? (
        /* Collapsed / Quick Add State */
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">
                Quick Task Creation
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Detailed Mode
            </button>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError('');
                }}
                onKeyDown={handleQuickAddKeyDown}
                placeholder="What do you want to accomplish? Speak with Wispr Flow or type..."
                className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700/80 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all pr-10"
              />
              <span 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                title="Wispr Flow voice typing enabled"
              >
                <Mic className="w-4 h-4 text-indigo-400 animate-pulse" />
              </span>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="px-4 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-semibold shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Add Task</span>
            </button>
          </div>

          {error && (
            <p className="text-xs text-rose-400 flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </p>
          )}

          {/* Voice Prompt Tip Banner */}
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/50 rounded-lg px-3 py-2 border border-slate-800/80">
            <Mic className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
            <span>
              <strong className="text-slate-300 font-medium">Wispr Flow Voice Tip:</strong> Press your Wispr Flow hotkey and dictate your task title and details hands-free.
            </span>
          </div>
        </div>
      ) : (
        /* Expanded Form State */
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-indigo-400" />
              <h3 className="font-semibold text-slate-100 text-base">New Task</h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setError('');
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Task Title <span className="text-rose-400">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. Design Wispr Flow voice navigation scheme"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 pr-10"
                autoFocus
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-400" title="Speak with Wispr Flow">
                <Mic className="w-4 h-4" />
              </span>
            </div>
            {error && (
              <p className="text-xs text-rose-400 flex items-center gap-1 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Dictate extra context, subtasks, or deadlines..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-200 placeholder-slate-400 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none"
            />
          </div>

          {/* Priority selection */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-1.5">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(
                [
                  { value: 'low', label: 'Low', color: 'border-emerald-500 bg-emerald-500/10 text-emerald-400' },
                  { value: 'medium', label: 'Medium', color: 'border-amber-500 bg-amber-500/10 text-amber-400' },
                  { value: 'high', label: 'High', color: 'border-rose-500 bg-rose-500/10 text-rose-400' },
                ] as const
              ).map((item) => (
                <button
                  type="button"
                  key={item.value}
                  onClick={() => setPriority(item.value)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                    priority === item.value
                      ? `${item.color} shadow-md`
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setError('');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              Create Task
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
