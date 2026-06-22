import { HabitCategory } from '../components/shared/HabitIcon';

export interface Habit {
  id: string;
  name: string;
  symbol: string;
  category: HabitCategory;
  targetType: 'boolean' | 'numeric';
  targetValue?: number;
  targetUnit?: string;
  baseXP: number;
  reminderEnabled: boolean;
  reminderTime?: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  title: string;
  targetCount: number;
  currentCount: number;
}

export interface Badge {
  id: string;
  name: string;
  symbol: string;
  color: string;
  unlocked: boolean;
}

export interface AppState {
  habits: Habit[];
  completions: Record<string, boolean>;
  goals: Goal[];
  xp: number;
  streak: number;
  longestStreak: number;
  badges: Badge[];
}

export type Action =
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'EDIT_HABIT'; payload: Habit }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'TOGGLE_COMPLETION'; payload: { key: string; xpGained: number; isIncrement: boolean } }
  | { type: 'UPDATE_STREAKS'; payload: { streak: number; longestStreak: number } }
  | { type: 'UNLOCK_BADGE'; payload: string }
  | { type: 'RESET_STATE' };
