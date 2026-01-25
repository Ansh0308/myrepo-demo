export interface Habit {
  _id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  category: Category;
  frequency: {
    type: 'daily' | 'weekly' | 'custom';
    customDays?: number[];
    targetPerWeek?: number;
  };
  reminderEnabled: boolean;
  reminderTime: string;
  createdAt: string;
  userId: string;
}

export type Category = 'Health' | 'Fitness' | 'Learning' | 'Productivity' | 'Mindfulness' | 'Social' | 'Creative' | 'Finance' | 'Other';

export interface HabitLog {
  _id: string;
  habitId: string | Habit;
  date: string;
  completed: boolean;
  note: string;
  createdAt: string;
  userId: string;
}

export interface StreakData {
  currentStreak: number;
  bestStreak: number;
  totalCompletions: number;
}

export interface CompletionRate {
  completionRate: number;
  completedDays: number;
  totalDays: number;
}

export interface OverviewStats {
  totalHabits: number;
  totalCompletions: number;
  categoryBreakdown: CategoryStat[];
}

export interface CategoryStat {
  category: string;
  completions: number;
  habits: number;
}

export interface DailyProgress {
  date: string;
  completions: number;
}

export interface UserPreferences {
  _id?: string;
  userId: string;
  darkMode: boolean;
  notificationsEnabled: boolean;
  weekStartsOn: number;
  defaultView: 'grid' | 'list' | 'calendar';
  updatedAt?: string;
}

export interface HabitFormData {
  name: string;
  description: string;
  color: string;
  icon: string;
  category: Category;
  frequency: {
    type: 'daily' | 'weekly' | 'custom';
    customDays?: number[];
    targetPerWeek?: number;
  };
  reminderEnabled: boolean;
  reminderTime: string;
}
