export interface User {
  _id: string;
  name: string;
  email: string;
  profileImage?: string;
  bio?: string;
  createdAt: string;
}

export interface Task {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  category?: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Pending' | 'In Progress' | 'Completed';
  dueDate?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  inProgress: number;
  highPriority: number;
}

export interface WeeklyData {
  day: string;
  created: number;
  completed: number;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  user: User;
  message?: string;
}

export interface TasksResponse {
  success: boolean;
  tasks: Task[];
  total: number;
  stats: TaskStats;
}

export interface TaskFilters {
  status?: string;
  priority?: string;
  search?: string;
  sort?: string;
}

export type ThemeMode = 'light' | 'dark';
