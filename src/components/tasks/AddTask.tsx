import { useState, type FC, type FormEvent, type KeyboardEvent } from 'react';
import type { Priority, Task } from '../../types/task';
import { generateTaskId } from '../../utils/taskStorage';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { PlusCircle, Mic, MicOff, AlertCircle, X, Sparkles, Volume2 } from 'lucide-react';

interface AddTaskProps {
  onAddTask: (task: Task) => void;
}

export const AddTask: FC<AddTaskProps> = ({ onAddTask }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [error, setError] = useState('');

  // Voice speech-to-text hook
  const { isListening, toggleListening, error: voiceError, isSupported } = useVoiceInput({
    onResult: (spokenText) => {
      setTitle(spokenText);
      if (error) setError('');
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      setError('Please enter a task title.');
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
        setError('Please enter a task title.');
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 mb-6 border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      {!isOpen ? (
        /* Collapsed / Quick Add State */
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-[#1a73e8]" />
              <h3 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Quick Task Creation
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="text-xs text-[#1a73e8] hover:text-blue-700 dark:hover:text-blue-400 font-medium flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#1a73e8]" />
              Detailed Form
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
                placeholder={isListening ? "Listening... Speak your task now" : "What do you want to achieve? Speak with Wispr Flow or click mic..."}
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-all pr-12 ${
                  isListening
                    ? 'border-[#EA4335] ring-2 ring-red-500/20 bg-red-50/20 dark:bg-red-950/20'
                    : 'border-slate-300 dark:border-slate-700 focus:border-[#1a73e8] focus:ring-2 focus:ring-blue-500/20'
                }`}
              />

              {/* Interactive Voice Mic Button */}
              <button
                type="button"
                onClick={toggleListening}
                className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${
                  isListening
                    ? 'bg-[#EA4335] text-white animate-pulse shadow-md'
                    : 'text-[#1a73e8] hover:bg-blue-50 dark:hover:bg-blue-950/50'
                }`}
                title={isListening ? "Stop voice listening" : "Click to speak with voice input"}
                aria-label="Voice input"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="px-4 py-2.5 bg-[#1a73e8] hover:bg-blue-600 text-white rounded-xl text-sm font-semibold shadow-sm transition-all flex items-center gap-2 shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span className="hidden sm:inline">Add Task</span>
            </button>
          </div>

          {/* Live Voice Listening Pulse Bar */}
          {isListening && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900/60 text-[#EA4335] text-xs animate-fade-in">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 animate-bounce" />
                <span className="font-semibold">Microphone active: speak now (words appear live in the input)</span>
              </div>
              <button
                type="button"
                onClick={toggleListening}
                className="px-2 py-0.5 rounded bg-[#EA4335] text-white text-[11px] font-bold"
              >
                Done
              </button>
            </div>
          )}

          {voiceError && (
            <p className="text-xs text-[#EA4335] flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {voiceError}
            </p>
          )}

          {error && (
            <p className="text-xs text-[#EA4335] flex items-center gap-1 mt-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </p>
          )}

          {/* Wispr Flow Voice Tip with Google Blue accent */}
          <div className="flex items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 rounded-xl px-3.5 py-2 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Mic className="w-3.5 h-3.5 text-[#1a73e8] shrink-0" />
              <span>
                <strong className="text-slate-800 dark:text-slate-200 font-medium">Wispr Flow & Voice Mode:</strong> Click the mic to speak in-browser, or press your Wispr Flow hotkey anywhere.
              </span>
            </div>
            {!isSupported && (
              <span className="text-[10px] text-amber-500 font-medium hidden sm:inline">Desktop Wispr Flow recommended</span>
            )}
          </div>
        </div>
      ) : (
        /* Expanded Form State */
        <form 
          onSubmit={handleSubmit} 
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setIsOpen(false);
              setError('');
            }
          }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-[#1a73e8]" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">New Task</h3>
            </div>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setError('');
              }}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Title with Voice Mic */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Task Title <span className="text-[#EA4335]">*</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (error) setError('');
                }}
                placeholder={isListening ? "Listening... Speak task title" : "e.g. Prepare presentation for GDG community meetup"}
                className={`w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none pr-12 transition-all ${
                  isListening
                    ? 'border-[#EA4335] ring-2 ring-red-500/20'
                    : 'border-slate-300 dark:border-slate-700 focus:border-[#1a73e8] focus:ring-2 focus:ring-blue-500/20'
                }`}
                autoFocus
              />
              <button
                type="button"
                onClick={toggleListening}
                className={`absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg transition-all ${
                  isListening
                    ? 'bg-[#EA4335] text-white animate-pulse'
                    : 'text-[#1a73e8] hover:bg-blue-50 dark:hover:bg-blue-950/50'
                }`}
                title={isListening ? "Stop listening" : "Speak task title"}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>
            </div>
            {error && (
              <p className="text-xs text-[#EA4335] flex items-center gap-1 mt-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                {error}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Description / Notes (Optional)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Dictate background context or key requirements with Wispr Flow..."
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 text-sm text-slate-900 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-[#1a73e8] focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
          </div>

          {/* Priority selection with GDG colors */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-300 mb-1.5">
              Priority Level
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              {(
                [
                  { value: 'low', label: 'Low', activeColor: 'bg-emerald-50 text-[#1e8e3e] border-[#34A853] dark:bg-emerald-950/50 dark:text-emerald-400' },
                  { value: 'medium', label: 'Medium', activeColor: 'bg-amber-50 text-[#B06000] border-[#FBBC04] dark:bg-amber-950/50 dark:text-amber-400' },
                  { value: 'high', label: 'High', activeColor: 'bg-red-50 text-[#EA4335] border-[#EA4335] dark:bg-red-950/50 dark:text-red-400' },
                ] as const
              ).map((item) => (
                <button
                  type="button"
                  key={item.value}
                  onClick={() => setPriority(item.value)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold border text-center transition-all ${
                    priority === item.value
                      ? `${item.activeColor} shadow-sm font-bold`
                      : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                setError('');
              }}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-[#1a73e8] hover:bg-blue-600 text-white shadow-sm transition-all flex items-center gap-1.5"
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
