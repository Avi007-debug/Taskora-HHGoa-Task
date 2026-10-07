import { useState, useEffect } from 'react';
import type { Task } from './types/task';
import type { FocusSession } from './types/session';
import { loadTasks, saveTasks } from './utils/taskStorage';
import { loadFocusSessions } from './utils/sessionStorage';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { TaskBoard } from './components/tasks/TaskBoard';
import { FocusTimer } from './components/timer/FocusTimer';
import { Dashboard } from './components/dashboard/Dashboard';
import { Mic, ExternalLink } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'timer' | 'dashboard'>('tasks');
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [sessions, setSessions] = useState<FocusSession[]>(() => loadFocusSessions());

  // Automatically persist tasks to localStorage on changes
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Person 1 Task Manager Handlers
  const handleAddTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleUpdateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleToggleComplete = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleClearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
  };

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Top Application Header */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Mobile Navigation bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        taskCount={tasks.length}
        sessionCount={sessions.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Wispr Flow Referral Banner Notice */}
        <div className="mb-6 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2.5 text-slate-300">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Mic className="w-4 h-4" />
            </span>
            <span>
              <strong className="text-white font-semibold">Wispr Flow Shortlisting Task:</strong> Voice-driven development for high-velocity productivity.
            </span>
          </div>
          <a
            href="https://ref.wisprflow.ai/hhg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-indigo-400 hover:text-indigo-300 hover:underline shrink-0"
          >
            <span>Wispr Flow Referral: ref.wisprflow.ai/hhg</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Tab Views */}
        {activeTab === 'tasks' && (
          <section id="task-manager" aria-label="Task Manager Module">
            <TaskBoard
              tasks={tasks}
              onAddTask={handleAddTask}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
              onClearCompleted={handleClearCompleted}
            />
          </section>
        )}

        {activeTab === 'timer' && (
          <section id="focus-timer" aria-label="Focus Timer Module">
            <FocusTimer
              sessions={sessions}
              onAddSession={(newSession) => setSessions((prev) => [newSession, ...prev])}
            />
          </section>
        )}

        {activeTab === 'dashboard' && (
          <section id="productivity-dashboard" aria-label="Productivity Dashboard Module">
            <Dashboard tasks={tasks} sessions={sessions} />
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-200">Taskora</span>
            <span>—</span>
            <span>Wispr Flow VoiceBoard Project</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span className="text-emerald-400 font-medium">Person 1: Task Manager ✓</span>
            <span>Person 2: Focus Timer (Pending)</span>
            <span>Person 3: Dashboard (Pending)</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
