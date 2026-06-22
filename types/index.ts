export type Category   = 'career' | 'fitness' | 'life';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type Frequency  = 'daily' | 'weekdays' | 'custom';
export type Theme      = 'dark' | 'amoled';
export type Mood       = 1 | 2 | 3 | 4 | 5;
export type Energy     = 1 | 2 | 3 | 4 | 5;

export interface Goal {
  id: string;
  name: string;
  cat: Category;
  difficulty: Difficulty;
  frequency: Frequency;
  customDays: number[];   // 0=Sun, 1=Mon … 6=Sat
  archived: boolean;
  createdAt: string;      // ISO string
  order: number;
}

export interface DailyLog {
  date: string;           // 'YYYY-M-D' e.g. '2025-6-9'
  checks: boolean[];      // matches active goals array by index
  goalNotes: string[];    // per-goal notes, same index
  note: string;           // global day note
  mood: Mood;
  energy: Energy;
  loggedAt: string;       // ISO timestamp
}

export interface AppState {
  // Identity
  name: string;
  age: string;
  avatar: string;         // emoji avatar e.g. '🚀'
  focus: Category | 'all';

  // Notifications
  reminderEnabled: boolean;
  reminderTime: string;   // 'HH:MM'

  // Preferences
  theme: Theme;
  hapticsEnabled: boolean;

  // Core data
  goals: Goal[];
  logs: DailyLog[];

  // Gamification
  xp: number;
  bestStreak: number;
  streakFreezes: number;
  streakFreezeUsedDates: string[];
  badges: string[];

  // Meta
  setup: boolean;
  version: number;        // schema version — start at 1
}

export const DEFAULT_STATE: AppState = {
  name: '', age: '', avatar: '🚀', focus: 'all',
  reminderEnabled: true, reminderTime: '21:00',
  theme: 'dark', hapticsEnabled: true,
  goals: [], logs: [],
  xp: 0, bestStreak: 0, streakFreezes: 0,
  streakFreezeUsedDates: [], badges: [],
  setup: false, version: 1,
};
