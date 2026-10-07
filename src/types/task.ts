export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  completed: boolean;
  createdAt: string;
}

export type TaskStatusFilter = 'all' | 'active' | 'completed';
export type TaskPriorityFilter = 'all' | Priority;
