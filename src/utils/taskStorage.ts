import type { Task } from '../types/task';

const STORAGE_KEY = 'taskora_tasks';

const INITIAL_DEFAULT_TASKS: Task[] = [
  {
    id: 'task-1',
    title: 'Install and set up Wispr Flow with referral code',
    description: 'Create account via https://ref.wisprflow.ai/hhg and test voice input in the browser.',
    priority: 'high',
    completed: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString(),
  },
  {
    id: 'task-2',
    title: 'Build Person 1 Task Manager Module',
    description: 'Implement TaskBoard, TaskCard, AddTask, TaskFilter with localStorage persistence.',
    priority: 'high',
    completed: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
  },
  {
    id: 'task-3',
    title: 'Record Wispr Flow voice workflow demonstration',
    description: 'Show natural voice dictation when adding and editing tasks in Taskora.',
    priority: 'medium',
    completed: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'task-4',
    title: 'Connect Taskora stats with Person 3 Dashboard',
    description: 'Ensure completionRate, totalTasks, and pendingTasks update dynamically.',
    priority: 'low',
    completed: false,
    createdAt: new Date().toISOString(),
  },
];

/**
 * Loads tasks from localStorage or provides starter tasks on first launch.
 */
export const loadTasks = (): Task[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First time loading - persist and return starter defaults
      saveTasks(INITIAL_DEFAULT_TASKS);
      return INITIAL_DEFAULT_TASKS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_DEFAULT_TASKS;
  } catch (error) {
    console.error('Failed to load tasks from localStorage:', error);
    return INITIAL_DEFAULT_TASKS;
  }
};

/**
 * Saves tasks to localStorage.
 */
export const saveTasks = (tasks: Task[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Failed to save tasks to localStorage:', error);
  }
};

/**
 * Utility to generate a unique task ID.
 */
export const generateTaskId = (): string => {
  return 'task_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
};
