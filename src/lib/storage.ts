import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Goal {
  id: string;
  title: string;
  category: string;
  target: string;
  xpReward: number;
  icon?: string;
  completedDates: string[]; // ISO date strings
  streak: number;
  progress: number; // today's 0-100
}

export interface DailyLogEntry {
  date: string; // "YYYY-MM-DD"
  mood: 1 | 2 | 3 | 4 | 5;
  energy: 1 | 2 | 3 | 4 | 5;
  sleep: string;
  hydration: string;
  sunlight: string;
  notes: string;
  xpEarned: number;
  savedAt: string;
}

export interface BadgeState {
  id: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress: number;
  total: number;
}

export interface UserProfile {
  name: string;
  totalXP: number;
  streakDays: number;
  level: number; // Math.floor(totalXP / 500) + 1
  weeklyAvg: number;
}

export const KEYS = {
  USER: 'TRACKR_USER',
  GOALS: 'TRACKR_GOALS',
  DAILY_LOG: 'TRACKR_DAILY_LOG',
  BADGES: 'TRACKR_BADGES',
};

export const storage = {
  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await AsyncStorage.getItem(key);
      return data ? JSON.parse(data) : null;
    } catch (e) {
      console.error('Storage get error', e);
      return null;
    }
  },
  async set<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage set error', e);
    }
  },
  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (e) {
      console.error('Storage remove error', e);
    }
  },
  async clearAll(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (e) {
      console.error('Storage clear error', e);
    }
  }
};
