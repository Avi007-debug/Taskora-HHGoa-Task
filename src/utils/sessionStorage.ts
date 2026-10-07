import type { FocusSession } from '../types/session';

const SESSION_STORAGE_KEY = 'taskora_focus_sessions';

const INITIAL_DEFAULT_SESSIONS: FocusSession[] = [
  {
    id: 'session-1',
    duration: 25,
    completedAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
  },
  {
    id: 'session-2',
    duration: 25,
    completedAt: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
  },
];

/**
 * Loads focus sessions from localStorage or returns starter sessions.
 */
export const loadFocusSessions = (): FocusSession[] => {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (!raw) {
      saveFocusSessions(INITIAL_DEFAULT_SESSIONS);
      return INITIAL_DEFAULT_SESSIONS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return INITIAL_DEFAULT_SESSIONS;
  } catch (error) {
    console.error('Failed to load sessions from localStorage:', error);
    return INITIAL_DEFAULT_SESSIONS;
  }
};

/**
 * Saves focus sessions to localStorage.
 */
export const saveFocusSessions = (sessions: FocusSession[]): void => {
  try {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to save sessions to localStorage:', error);
  }
};

/**
 * Utility to generate session ID.
 */
export const generateSessionId = (): string => {
  return 'session_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 7);
};
