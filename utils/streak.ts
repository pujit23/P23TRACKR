import { AppState } from '../types';
import { todayKey, previousDay } from './dates';

export const calculateStreak = (state: AppState): number => {
  const { logs, goals, streakFreezeUsedDates } = state;
  const activeGoals = goals.filter(g => !g.archived);
  if (activeGoals.length === 0) return 0;

  const today = todayKey();
  const todayLog = logs.find(l => l.date === today);
  const todayDone = todayLog?.checks.some(Boolean) ?? false;

  let streak = 0;
  let d = todayDone ? today : previousDay(today);

  for (let i = 0; i < 365; i++) {
    const log = logs.find(l => l.date === d);
    if (log && log.checks.some(Boolean)) {
      streak++;
      d = previousDay(d);
    } else if (streakFreezeUsedDates.includes(d)) {
      d = previousDay(d); // frozen day — skip, don't break
    } else {
      break;
    }
  }
  return streak;
};

export const getTodayCompletion = (state: AppState): number => {
  const activeGoals = state.goals.filter(g => !g.archived);
  if (activeGoals.length === 0) return 0;
  const log = state.logs.find(l => l.date === todayKey());
  const checked = log?.checks.filter(Boolean).length ?? 0;
  return Math.round((checked / activeGoals.length) * 100);
};
