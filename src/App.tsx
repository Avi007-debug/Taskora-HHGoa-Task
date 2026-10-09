import { useState, useEffect } from 'react';
import type { Task } from './types/task';
import type { FocusSession } from './types/session';
import { loadTasks, saveTasks } from './utils/taskStorage';
import { loadFocusSessions, saveFocusSessions } from './utils/sessionStorage';
import { supabase } from './lib/supabaseClient';
import {
  fetchTasksFromSupabase,
  createTaskInSupabase,
  updateTaskInSupabase,
  deleteTaskFromSupabase,
  clearCompletedTasksInSupabase,
} from './services/taskService';
import {
  fetchSessionsFromSupabase,
  createSessionInSupabase,
  clearSessionsInSupabase,
} from './services/sessionService';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { TaskBoard } from './components/tasks/TaskBoard';
import { FocusTimer } from './components/timer/FocusTimer';
import { Dashboard } from './components/dashboard/Dashboard';
import { AuthModal } from './components/auth/AuthModal';
import { Mic, ExternalLink } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState<'tasks' | 'timer' | 'dashboard'>('tasks');
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [sessions, setSessions] = useState<FocusSession[]>(() => loadFocusSessions());
  const [isCloudSynced, setIsCloudSynced] = useState(false);

  // Authentication State
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Theme state: defaults to 'light' with GDG colors, saved in localStorage
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('taskora_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  // Sync document root class for Tailwind dark variant and HTML color-scheme
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('taskora_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Listen to Supabase Auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserEmail(session.user.email || null);
        setUserId(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUserEmail(session.user.email || null);
        setUserId(session.user.id);
      } else {
        setUserEmail(null);
        setUserId(undefined);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Fetch live tasks & sessions from Supabase on mount and whenever user changes
  useEffect(() => {
    let isMounted = true;

    const loadCloudData = async () => {
      const [tasksRes, sessionsRes] = await Promise.all([
        fetchTasksFromSupabase(userId),
        fetchSessionsFromSupabase(userId),
      ]);

      if (isMounted) {
        setTasks(tasksRes.tasks);
        setSessions(sessionsRes.sessions);
        setIsCloudSynced(tasksRes.fromCloud && sessionsRes.fromCloud);
      }
    };

    loadCloudData();

    return () => {
      isMounted = false;
    };
  }, [userId]);

  // Synchronize tasks to localStorage cache
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  // Synchronize sessions to localStorage cache
  useEffect(() => {
    saveFocusSessions(sessions);
  }, [sessions]);

  // Person 1 Task Manager Handlers (Optimistic UI + Supabase Cloud Sync)
  const handleAddTask = (newTask: Task) => {
    setTasks((prev) => [newTask, ...prev]);
    createTaskInSupabase(newTask, userId).then((success) => {
      if (success) setIsCloudSynced(true);
    });
  };

  const handleUpdateTask = (id: string, updates: Partial<Omit<Task, 'id' | 'createdAt'>>) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    updateTaskInSupabase(id, updates);
  };

  const handleDeleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    deleteTaskFromSupabase(id);
  };

  const handleToggleComplete = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const nextCompleted = !task.completed;

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: nextCompleted } : t))
    );
    updateTaskInSupabase(id, { completed: nextCompleted });
  };

  const handleClearCompleted = () => {
    setTasks((prev) => prev.filter((t) => !t.completed));
    clearCompletedTasksInSupabase(userId);
  };

  // Person 2 Focus Timer Handlers (Optimistic UI + Supabase Cloud Sync)
  const handleAddSession = (newSession: FocusSession) => {
    setSessions((prev) => [newSession, ...prev]);
    createSessionInSupabase(newSession, userId).then((success) => {
      if (success) setIsCloudSynced(true);
    });
  };

  const handleClearSessions = () => {
    setSessions([]);
    clearSessionsInSupabase(userId);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUserEmail(null);
    setUserId(undefined);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] dark:bg-[#0f172a] text-slate-900 dark:text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white transition-colors duration-150">
      {/* Top Application Header with GDG Bar, Auth & Theme Toggle */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        theme={theme}
        onToggleTheme={toggleTheme}
        userEmail={userEmail}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
        isCloudSynced={isCloudSynced}
      />

      {/* Mobile Navigation bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        taskCount={tasks.length}
        sessionCount={sessions.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Wispr Flow Referral Banner Notice */}
        <div className="mb-6 p-3.5 sm:p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs transition-colors">
          <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300">
            <span className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/50 text-[#1a73e8] dark:text-blue-400">
              <Mic className="w-4 h-4" />
            </span>
            <span>
              <strong className="text-slate-900 dark:text-white font-semibold">Wispr Flow Shortlisting Task:</strong> Voice-driven development for high-velocity productivity.
            </span>
          </div>
          <a
            href="https://ref.wisprflow.ai/hhg"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-semibold text-[#1a73e8] dark:text-blue-400 hover:underline shrink-0"
          >
            <span>Wispr Flow Referral: ref.wisprflow.ai/hhg</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Tab Views - Kept in DOM so Focus Timer continues ticking when switching tabs */}
        <section
          id="task-manager"
          aria-label="Task Manager Module"
          className={activeTab === 'tasks' ? 'block' : 'hidden'}
        >
          <TaskBoard
            tasks={tasks}
            onAddTask={handleAddTask}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onToggleComplete={handleToggleComplete}
            onClearCompleted={handleClearCompleted}
          />
        </section>

        <section
          id="focus-timer"
          aria-label="Focus Timer Module"
          className={activeTab === 'timer' ? 'block' : 'hidden'}
        >
          <FocusTimer
            sessions={sessions}
            onAddSession={handleAddSession}
            onClearSessions={handleClearSessions}
          />
        </section>

        <section
          id="productivity-dashboard"
          aria-label="Productivity Dashboard Module"
          className={activeTab === 'dashboard' ? 'block' : 'hidden'}
        >
          <Dashboard tasks={tasks} sessions={sessions} />
        </section>
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={(email) => {
          setUserEmail(email);
        }}
      />

      {/* Footer with GDG Style */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-6 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900 dark:text-slate-200">Taskora</span>
            <span>•</span>
            <span>GDG-Themed VoiceBoard</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-[#1e8e3e] dark:text-[#34A853] font-semibold">Person 1: Tasks ✓</span>
            <span className="text-[#1e8e3e] dark:text-[#34A853] font-semibold">Person 2: Timer ✓</span>
            <span className="text-[#1e8e3e] dark:text-[#34A853] font-semibold">Person 3: Dashboard ✓</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
