import { create } from 'zustand';
import { storage, KEYS, UserProfile, Goal, DailyLogEntry, BadgeState } from '../lib/storage';
import { BADGE_DEFS } from '../lib/xp';

interface TrackrState {
  user: UserProfile | null;
  goals: Goal[];
  dailyLogs: Record<string, DailyLogEntry>;
  badges: BadgeState[];
  isLoaded: boolean;
  loadData: () => Promise<void>;
  setUser: (user: UserProfile) => Promise<void>;
  addGoals: (goals: Goal[]) => Promise<void>;
  completeGoal: (id: string, dateStr: string) => Promise<boolean>; // Returns true if just completed
  saveDailyLog: (log: DailyLogEntry) => Promise<void>;
  resetData: () => Promise<void>;
  addXP: (amount: number) => Promise<void>;
}

export const useTrackrStore = create<TrackrState>()((set, get) => ({
  user: null,
  goals: [],
  dailyLogs: {},
  badges: [],
  isLoaded: false,

  loadData: async () => {
    const [user, goals, logs, badges] = await Promise.all([
      storage.get<UserProfile>(KEYS.USER),
      storage.get<Goal[]>(KEYS.GOALS),
      storage.get<Record<string, DailyLogEntry>>(KEYS.DAILY_LOG),
      storage.get<BadgeState[]>(KEYS.BADGES),
    ]);

    const initialBadges = badges || BADGE_DEFS.map(b => ({
      id: b.id,
      unlocked: false,
      progress: 0,
      total: b.total
    }));

    set({
      user,
      goals: goals || [],
      dailyLogs: logs || {},
      badges: initialBadges,
      isLoaded: true
    });
  },

  setUser: async (user) => {
    await storage.set(KEYS.USER, user);
    set({ user });
  },

  addGoals: async (newGoals) => {
    const goals = [...get().goals, ...newGoals];
    await storage.set(KEYS.GOALS, goals);
    set({ goals });
  },

  completeGoal: async (id, dateStr) => {
    let earnedXP = 0;
    let completed = false;
    
    const goals = get().goals.map(g => {
      if (g.id === id) {
        const isDone = g.progress >= 100;
        if (!isDone) {
          earnedXP = g.xpReward;
          completed = true;
          const newDates = [...g.completedDates, dateStr];
          return { ...g, progress: 100, completedDates: Array.from(new Set(newDates)) };
        } else {
          // Undo completion
          return { ...g, progress: 0, completedDates: g.completedDates.filter(d => d !== dateStr) };
        }
      }
      return g;
    });

    await storage.set(KEYS.GOALS, goals);
    set({ goals });
    
    if (earnedXP > 0) {
      await get().addXP(earnedXP);
    }
    return completed;
  },

  saveDailyLog: async (log) => {
    const logs = { ...get().dailyLogs, [log.date]: log };
    await storage.set(KEYS.DAILY_LOG, logs);
    set({ dailyLogs: logs });
    if (log.xpEarned > 0) {
      await get().addXP(log.xpEarned);
    }
  },

  addXP: async (amount) => {
    const { user } = get();
    if (!user) return;
    
    const newXP = user.totalXP + amount;
    const newLevel = Math.floor(newXP / 500) + 1;
    
    const newUser = { ...user, totalXP: newXP, level: newLevel };
    await storage.set(KEYS.USER, newUser);
    set({ user: newUser });
  },

  resetData: async () => {
    await storage.clearAll();
    set({
      user: null,
      goals: [],
      dailyLogs: {},
      badges: BADGE_DEFS.map(b => ({
        id: b.id,
        unlocked: false,
        progress: 0,
        total: b.total
      })),
      isLoaded: true
    });
  }
}));
