import { create } from 'zustand';
import { storage, KEYS, UserProfile, Goal, DailyLogEntry, BadgeState } from '../lib/storage';
import { BADGE_DEFS } from '../lib/xp';

function recalculateStreak(goals: Goal[]): number {
  if (!goals.length) return 0;
  
  const today = new Date().toISOString().split('T')[0];
  let streak = 0;
  const d = new Date();

  for (let i = 0; i < 365; i++) {
    const dateStr = d.toISOString().split('T')[0];
    const anyDone = goals.some(g => g.completedDates.includes(dateStr));
    if (anyDone) {
      streak++;
      d.setDate(d.getDate() - 1);
    } else if (i === 0) {
      // Today not done yet — start checking from yesterday
      d.setDate(d.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

function recalculateWeeklyAvg(goals: Goal[]): number {
  if (!goals.length) return 0;
  const today = new Date();
  const last7: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    last7.push(d.toISOString().split('T')[0]);
  }
  const dailyRates = last7.map(date => {
    const done = goals.filter(g => g.completedDates.includes(date)).length;
    return done / goals.length;
  });
  const avg = dailyRates.reduce((a, b) => a + b, 0) / 7;
  return Math.round(avg * 100);
}

interface TrackrState {
  user: UserProfile | null;
  goals: Goal[];
  dailyLogs: Record<string, DailyLogEntry>;
  badges: BadgeState[];
  isLoaded: boolean;
  loadData: () => Promise<void>;
  setUser: (user: UserProfile) => Promise<void>;
  addGoals: (goals: Goal[]) => Promise<void>;
  removeGoal: (id: string) => Promise<void>;
  updateGoals: (goals: Goal[]) => Promise<void>;
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

    const recalcStreak = recalculateStreak(goals || []);
    const recalcAvg = recalculateWeeklyAvg(goals || []);
    
    const updatedUser = user ? { ...user, streakDays: recalcStreak, weeklyAvg: recalcAvg } : null;
    if (updatedUser && (updatedUser.streakDays !== user?.streakDays || updatedUser.weeklyAvg !== user?.weeklyAvg)) {
      await storage.set(KEYS.USER, updatedUser);
    }

    set({
      user: updatedUser,
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

  removeGoal: async (id) => {
    const goals = get().goals.filter(g => g.id !== id);
    await storage.set(KEYS.GOALS, goals);
    set({ goals });
  },

  updateGoals: async (goals) => {
    await storage.set(KEYS.GOALS, goals);
    set({ goals });
  },

  completeGoal: async (id, dateStr) => {
    let earnedXP = 0;
    let justCompleted = false;

    const goals = get().goals.map(g => {
      if (g.id !== id) return g;
      
      const alreadyDone = g.completedDates.includes(dateStr);
      if (!alreadyDone) {
        earnedXP = g.xpReward;
        justCompleted = true;
        return {
          ...g,
          progress: 100,
          completedDates: [...g.completedDates, dateStr],
        };
      } else {
        // Toggle off — undo completion
        return {
          ...g,
          progress: 0,
          completedDates: g.completedDates.filter(d => d !== dateStr),
        };
      }
    });

    await storage.set(KEYS.GOALS, goals);
    set({ goals });
    
    if (earnedXP > 0) {
      await get().addXP(earnedXP);
    }

    // Recalculate streak after completion
    const newStreak = recalculateStreak(goals);
    const newAvg = recalculateWeeklyAvg(goals);
    const currentUser = get().user;
    if (currentUser && (currentUser.streakDays !== newStreak || currentUser.weeklyAvg !== newAvg)) {
      const updatedUser = { ...currentUser, streakDays: newStreak, weeklyAvg: newAvg };
      await storage.set(KEYS.USER, updatedUser);
      set({ user: updatedUser });
    }
    
    return justCompleted;
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
