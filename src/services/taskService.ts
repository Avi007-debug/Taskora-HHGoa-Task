import { supabase } from '../lib/supabaseClient';
import type { Task } from '../types/task';
import { loadTasks, saveTasks } from '../utils/taskStorage';

/**
 * Maps Supabase database row to Taskora Task frontend model.
 */
interface SupabaseTaskRow {
  id: string;
  title: string;
  description: string | null;
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  created_at: string;
  user_id?: string | null;
}

const mapRowToTask = (row: SupabaseTaskRow): Task => ({
  id: row.id,
  title: row.title,
  description: row.description || '',
  priority: row.priority,
  completed: row.completed,
  createdAt: row.created_at,
});

/**
 * Fetches all tasks from Supabase cloud database with fallback to localStorage.
 */
export const fetchTasksFromSupabase = async (userId?: string): Promise<{ tasks: Task[]; fromCloud: boolean }> => {
  try {
    let query = supabase.from('tasks').select('*').order('created_at', { ascending: false });
    
    if (userId) {
      query = query.or(`user_id.eq.${userId},user_id.is.null`);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('Supabase fetch failed, falling back to localStorage:', error.message);
      return { tasks: loadTasks(), fromCloud: false };
    }

    if (data && data.length > 0) {
      const mappedTasks = (data as SupabaseTaskRow[]).map(mapRowToTask);
      saveTasks(mappedTasks); // cache locally
      return { tasks: mappedTasks, fromCloud: true };
    }

    // If cloud is empty, fallback to local storage
    const local = loadTasks();
    return { tasks: local, fromCloud: true };
  } catch (err) {
    console.warn('Network error reaching Supabase, using localStorage:', err);
    return { tasks: loadTasks(), fromCloud: false };
  }
};

/**
 * Creates a new task in Supabase.
 */
export const createTaskInSupabase = async (task: Task, userId?: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('tasks').insert([
      {
        id: task.id,
        title: task.title,
        description: task.description,
        priority: task.priority,
        completed: task.completed,
        created_at: task.createdAt,
        user_id: userId || null,
      },
    ]);

    if (error) {
      console.error('Error creating task in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to create task in Supabase:', err);
    return false;
  }
};

/**
 * Updates a task in Supabase.
 */
export const updateTaskInSupabase = async (
  id: string,
  updates: Partial<Omit<Task, 'id' | 'createdAt'>>
): Promise<boolean> => {
  try {
    const payload: Record<string, unknown> = {};
    if (updates.title !== undefined) payload.title = updates.title;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.priority !== undefined) payload.priority = updates.priority;
    if (updates.completed !== undefined) payload.completed = updates.completed;

    const { error } = await supabase.from('tasks').update(payload).eq('id', id);

    if (error) {
      console.error('Error updating task in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to update task in Supabase:', err);
    return false;
  }
};

/**
 * Deletes a task from Supabase.
 */
export const deleteTaskFromSupabase = async (id: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) {
      console.error('Error deleting task from Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to delete task from Supabase:', err);
    return false;
  }
};

/**
 * Clears all completed tasks in Supabase.
 */
export const clearCompletedTasksInSupabase = async (userId?: string): Promise<boolean> => {
  try {
    let query = supabase.from('tasks').delete().eq('completed', true);
    if (userId) {
      query = query.or(`user_id.eq.${userId},user_id.is.null`);
    }
    const { error } = await query;
    if (error) {
      console.error('Error clearing completed tasks in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to clear completed tasks in Supabase:', err);
    return false;
  }
};
