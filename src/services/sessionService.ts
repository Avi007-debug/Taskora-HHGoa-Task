import { supabase } from '../lib/supabaseClient';
import type { FocusSession } from '../types/session';
import { loadFocusSessions, saveFocusSessions } from '../utils/sessionStorage';

interface SupabaseSessionRow {
  id: string;
  duration: number;
  completed_at: string;
  user_id?: string | null;
}

const mapRowToSession = (row: SupabaseSessionRow): FocusSession => ({
  id: row.id,
  duration: row.duration,
  completedAt: row.completed_at,
});

/**
 * Fetches focus sessions from Supabase with fallback to localStorage.
 */
export const fetchSessionsFromSupabase = async (userId?: string): Promise<{ sessions: FocusSession[]; fromCloud: boolean }> => {
  try {
    let query = supabase.from('focus_sessions').select('*').order('completed_at', { ascending: false });

    if (userId) {
      query = query.or(`user_id.eq.${userId},user_id.is.null`);
    }

    const { data, error } = await query;

    if (error) {
      console.warn('Supabase session fetch failed, falling back to localStorage:', error.message);
      return { sessions: loadFocusSessions(), fromCloud: false };
    }

    if (data && data.length > 0) {
      const mapped = (data as SupabaseSessionRow[]).map(mapRowToSession);
      saveFocusSessions(mapped);
      return { sessions: mapped, fromCloud: true };
    }

    return { sessions: loadFocusSessions(), fromCloud: true };
  } catch (err) {
    console.warn('Network error reaching Supabase sessions, using localStorage:', err);
    return { sessions: loadFocusSessions(), fromCloud: false };
  }
};

/**
 * Creates a focus session record in Supabase.
 */
export const createSessionInSupabase = async (session: FocusSession, userId?: string): Promise<boolean> => {
  try {
    const { error } = await supabase.from('focus_sessions').insert([
      {
        id: session.id,
        duration: session.duration,
        completed_at: session.completedAt,
        user_id: userId || null,
      },
    ]);

    if (error) {
      console.error('Error recording session in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to create session in Supabase:', err);
    return false;
  }
};

/**
 * Clears all focus sessions in Supabase.
 */
export const clearSessionsInSupabase = async (userId?: string): Promise<boolean> => {
  try {
    let query = supabase.from('focus_sessions').delete().neq('id', '');
    if (userId) {
      query = query.or(`user_id.eq.${userId},user_id.is.null`);
    }
    const { error } = await query;
    if (error) {
      console.error('Error clearing sessions in Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.error('Failed to clear sessions in Supabase:', err);
    return false;
  }
};
