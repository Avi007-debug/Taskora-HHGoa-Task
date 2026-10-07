export interface FocusSession {
  id: string;
  duration: number; // Duration in minutes or seconds (standard Pomodoro: 25 minutes)
  completedAt: string; // ISO date timestamp string
}
