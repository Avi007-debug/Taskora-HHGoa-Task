import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * Universal Supabase Client for Taskora
 * Initialized with client credentials from .env (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
