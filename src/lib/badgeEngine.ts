import { storage, KEYS, BadgeState, Goal, DailyLogEntry } from './storage';
import { BADGE_DEFS } from './xp';
import { useTrackrStore } from '../store/trackrStore';

export async function checkBadgeUnlocks(): Promise<BadgeState[]> {
  const state = useTrackrStore.getState();
  const { user, goals, dailyLogs, badges } = state;
  if (!user) return [];

  const newlyUnlocked: BadgeState[] = [];
  const updatedBadges = [...badges];

  // Engine rules
  // Ignition: 7-day streak
  const ignition = updatedBadges.find(b => b.id === 'Ignition');
  if (ignition && !ignition.unlocked) {
    ignition.progress = user.streakDays;
    if (user.streakDays >= 7) {
      ignition.unlocked = true;
      newlyUnlocked.push(ignition);
    }
  }

  // Stellar Run: 21-day streak
  const stellar = updatedBadges.find(b => b.id === 'StellarRun');
  if (stellar && !stellar.unlocked) {
    stellar.progress = user.streakDays;
    if (user.streakDays >= 21) {
      stellar.unlocked = true;
      newlyUnlocked.push(stellar);
    }
  }

  // Apex: 10,000 XP
  const apex = updatedBadges.find(b => b.id === 'Apex');
  if (apex && !apex.unlocked) {
    apex.progress = user.totalXP;
    if (user.totalXP >= 10000) {
      apex.unlocked = true;
      newlyUnlocked.push(apex);
    }
  }

  // Zenith Mind: Mood log 14 days
  const zenith = updatedBadges.find(b => b.id === 'ZenithMind');
  if (zenith && !zenith.unlocked) {
    const totalLogs = Object.keys(dailyLogs).length;
    zenith.progress = totalLogs;
    if (totalLogs >= 14) {
      zenith.unlocked = true;
      newlyUnlocked.push(zenith);
    }
  }

  // TODO: Implement the rest when data structures allow (Dead-Eye, Vital Protocol, Iron Ritual, Voltage)

  // Save new badges state
  await storage.set(KEYS.BADGES, updatedBadges);
  useTrackrStore.setState({ badges: updatedBadges });

  // Grant XP for new badges
  for (const b of newlyUnlocked) {
    const def = BADGE_DEFS.find(d => d.id === b.id);
    if (def) {
      await state.addXP(def.xp);
    }
  }

  return newlyUnlocked;
}
