import AsyncStorage from '@react-native-async-storage/async-storage';
import { KEYS, BadgeState, UserProfile, Goal, DailyLogEntry } from './storage';
import { BADGE_DEFS } from './xp';
import { useTrackrStore } from '../store/trackrStore';

// Pure function — takes current state snapshot, returns newly unlocked badge IDs
export function computeNewlyUnlocked(
  badges: BadgeState[],
  user: UserProfile,
  goals: Goal[],
  dailyLogs: Record<string, DailyLogEntry>
): { updatedBadges: BadgeState[]; newlyUnlockedIds: string[] } {
  const updated = badges.map(b => ({ ...b })); // clone
  const newlyUnlockedIds: string[] = [];

  const logDates = Object.keys(dailyLogs).sort();
  const totalLogs = logDates.length;

  // Helper: consecutive date streak from a sorted date array
  const maxConsecutive = (dates: string[]): number => {
    if (!dates.length) return 0;
    let max = 1, cur = 1;
    for (let i = 1; i < dates.length; i++) {
      const prev = new Date(dates[i - 1]);
      const curr = new Date(dates[i]);
      const diff = (curr.getTime() - prev.getTime()) / 86400000;
      cur = diff === 1 ? cur + 1 : 1;
      max = Math.max(max, cur);
    }
    return max;
  };

  const unlock = (id: string, progress: number) => {
    const b = updated.find(x => x.id === id);
    if (!b || b.unlocked) return;
    b.progress = progress;
    b.unlocked = true;
    b.unlockedDate = new Date().toISOString();
    newlyUnlockedIds.push(id);
  };

  const setProgress = (id: string, progress: number) => {
    const b = updated.find(x => x.id === id);
    if (b && !b.unlocked) b.progress = progress;
  };

  // Ignition — 7-day streak
  setProgress('Ignition', user.streakDays);
  if (user.streakDays >= 7) unlock('Ignition', user.streakDays);

  // StellarRun — 21-day streak
  setProgress('StellarRun', user.streakDays);
  if (user.streakDays >= 21) unlock('StellarRun', user.streakDays);

  // Apex — 10,000 XP
  setProgress('Apex', user.totalXP);
  if (user.totalXP >= 10000) unlock('Apex', user.totalXP);

  // ZenithMind — mood log saved 14 days
  setProgress('ZenithMind', totalLogs);
  if (totalLogs >= 14) unlock('ZenithMind', totalLogs);

  // DeadEye — 100% goals completed 5 days in a row
  const today = new Date().toISOString().split('T')[0];
  const consecutivePerfect = (() => {
    let count = 0;
    const sortedDates = [...logDates].sort().reverse();
    for (const date of sortedDates) {
      const completedToday = goals.filter(g => g.completedDates.includes(date)).length;
      if (completedToday === goals.length && goals.length > 0) count++;
      else break;
    }
    return count;
  })();
  setProgress('DeadEye', consecutivePerfect);
  if (consecutivePerfect >= 5) unlock('DeadEye', consecutivePerfect);

  // VitalProtocol — all 3 habit checks filled for 10 days
  const vitalDays = logDates.filter(d => {
    const log = dailyLogs[d];
    return log && log.sleep && log.hydration && log.sunlight;
  }).length;
  setProgress('VitalProtocol', vitalDays);
  if (vitalDays >= 10) unlock('VitalProtocol', vitalDays);

  // IronRitual — 30 consecutive days 100% goals
  const ironDates = logDates.filter(d => {
    const completedCount = goals.filter(g => g.completedDates.includes(d)).length;
    return completedCount === goals.length && goals.length > 0;
  }).sort();
  const ironStreak = maxConsecutive(ironDates);
  setProgress('IronRitual', ironStreak);
  if (ironStreak >= 30) unlock('IronRitual', ironStreak);

  // Voltage — energy level 5 for 7 consecutive days
  const energyDates = logDates
    .filter(d => dailyLogs[d]?.energy === 5)
    .sort();
  const voltageStreak = maxConsecutive(energyDates);
  setProgress('Voltage', voltageStreak);
  if (voltageStreak >= 7) unlock('Voltage', voltageStreak);

  return { updatedBadges: updated, newlyUnlockedIds };
}

// Call this after any state mutation that could trigger a badge
export async function checkBadgeUnlocks(): Promise<string[]> {
  const state = useTrackrStore.getState();
  const { user, goals, dailyLogs, badges } = state;
  if (!user) return [];

  const { updatedBadges, newlyUnlockedIds } = computeNewlyUnlocked(
    badges, user, goals, dailyLogs
  );

  if (newlyUnlockedIds.length > 0 || updatedBadges.some((b, i) => b.progress !== badges[i]?.progress)) {
    await AsyncStorage.setItem(KEYS.BADGES, JSON.stringify(updatedBadges));
    useTrackrStore.setState({ badges: updatedBadges });

    // Grant XP for newly unlocked badges — use store's addXP to keep it atomic
    for (const id of newlyUnlockedIds) {
      const def = BADGE_DEFS.find(d => d.id === id);
      if (def) await state.addXP(def.xp);
    }
  }

  return newlyUnlockedIds;
}
