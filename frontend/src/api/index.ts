import { Habit, HabitLog, HabitFormData, UserPreferences, StreakData, CompletionRate, OverviewStats, DailyProgress } from '../types';

const API_BASE = '/api';
const USER_ID = 'default-user';

export const habitsApi = {
  getAll: async (): Promise<Habit[]> => {
    const response = await fetch(`${API_BASE}/habits?userId=${USER_ID}`);
    if (!response.ok) throw new Error('Failed to fetch habits');
    return response.json();
  },

  getById: async (id: string): Promise<Habit> => {
    const response = await fetch(`${API_BASE}/habits/${id}`);
    if (!response.ok) throw new Error('Failed to fetch habit');
    return response.json();
  },

  create: async (data: HabitFormData): Promise<Habit> => {
    const response = await fetch(`${API_BASE}/habits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, userId: USER_ID }),
    });
    if (!response.ok) throw new Error('Failed to create habit');
    return response.json();
  },

  update: async (id: string, data: Partial<HabitFormData>): Promise<Habit> => {
    const response = await fetch(`${API_BASE}/habits/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update habit');
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/habits/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete habit');
  },
};

export const logsApi = {
  getAll: async (params?: { habitId?: string; startDate?: string; endDate?: string }): Promise<HabitLog[]> => {
    const queryParams = new URLSearchParams({ userId: USER_ID, ...params as any });
    const response = await fetch(`${API_BASE}/logs?${queryParams}`);
    if (!response.ok) throw new Error('Failed to fetch logs');
    return response.json();
  },

  create: async (data: { habitId: string; date: string; completed?: boolean; note?: string }): Promise<HabitLog> => {
    const response = await fetch(`${API_BASE}/logs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, userId: USER_ID }),
    });
    if (!response.ok) throw new Error('Failed to create log');
    return response.json();
  },

  delete: async (id: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/logs/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete log');
  },

  deleteByHabitAndDate: async (habitId: string, date: string): Promise<void> => {
    const response = await fetch(`${API_BASE}/logs/habit/${habitId}/date/${date}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete log');
  },
};

export const analyticsApi = {
  getStreaks: async (habitId: string): Promise<StreakData> => {
    const response = await fetch(`${API_BASE}/analytics/streaks/${habitId}?userId=${USER_ID}`);
    if (!response.ok) throw new Error('Failed to fetch streaks');
    return response.json();
  },

  getCompletionRate: async (habitId: string, period: 'week' | 'month' = 'month'): Promise<CompletionRate> => {
    const response = await fetch(`${API_BASE}/analytics/completion-rate/${habitId}?userId=${USER_ID}&period=${period}`);
    if (!response.ok) throw new Error('Failed to fetch completion rate');
    return response.json();
  },

  getOverview: async (period: 'week' | 'month' = 'month'): Promise<OverviewStats> => {
    const response = await fetch(`${API_BASE}/analytics/overview?userId=${USER_ID}&period=${period}`);
    if (!response.ok) throw new Error('Failed to fetch overview');
    return response.json();
  },

  getDailyProgress: async (days: number = 30): Promise<DailyProgress[]> => {
    const response = await fetch(`${API_BASE}/analytics/daily-progress?userId=${USER_ID}&days=${days}`);
    if (!response.ok) throw new Error('Failed to fetch daily progress');
    return response.json();
  },
};

export const preferencesApi = {
  get: async (): Promise<UserPreferences> => {
    const response = await fetch(`${API_BASE}/preferences?userId=${USER_ID}`);
    if (!response.ok) throw new Error('Failed to fetch preferences');
    return response.json();
  },

  update: async (data: Partial<UserPreferences>): Promise<UserPreferences> => {
    const response = await fetch(`${API_BASE}/preferences`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, userId: USER_ID }),
    });
    if (!response.ok) throw new Error('Failed to update preferences');
    return response.json();
  },
};

export const exportApi = {
  exportData: async (): Promise<any> => {
    const response = await fetch(`${API_BASE}/export/data?userId=${USER_ID}`);
    if (!response.ok) throw new Error('Failed to export data');
    return response.json();
  },

  importData: async (data: any): Promise<{ message: string; importedCount: number }> => {
    const response = await fetch(`${API_BASE}/export/import`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, userId: USER_ID }),
    });
    if (!response.ok) throw new Error('Failed to import data');
    return response.json();
  },
};
