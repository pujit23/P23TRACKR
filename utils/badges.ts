import { AppState } from '../types';
import { todayKey } from './dates';
import { calculateStreak } from './streak';

export const BADGE_DEFS: Record<string, { icon: string; name: string; desc: string }> = {
  first_log:    { icon: '📅', name: 'First Step',   desc: 'Logged your first day' },
  streak_3:     { icon: '✨', name: 'Consistent',   desc: '3-day streak' },
  streak_7:     { icon: '🔥', name: 'On Fire',      desc: '7-day streak' },
  streak_30:    { icon: '🏆', name: 'Relentless',   desc: '30-day streak' },
  streak_100:   { icon: '👑', name: 'Legend',       desc: '100-day streak' },
  perfect_week: { icon: '💯', name: 'Perfect Week', desc: '100% all 7 days' },
  night_owl:    { icon: '🦉', name: 'Night Owl',    desc: 'Logged after 10 PM' },
  early_bird:   { icon: '🌅', name: 'Early Bird',   desc: 'Logged before 7 AM' },
  goal_master:  { icon: '🎯', name: 'Goal Master',  desc: 'Added 6 goals' },
  comeback:     { icon: '🔙', name: 'Comeback',     desc: 'Returned after 3+ day gap' },
  century:      { icon: '💎', name: 'Century',      desc: '100 total logs' },
};

export const checkBadges = (state: AppState): string[] => {
  const newBadges: string[] = [];
  const add = (id: string) => {
    if (!state.badges.includes(id)) newBadges.push(id);
  };

  const streak = calculateStreak(state);
  const totalLogs = state.logs.filter(l => l.checks.some(Boolean)).length;
  const hour = new Date().getHours();

  if (totalLogs >= 1) add('first_log');
  if (streak >= 3) add('streak_3');
  if (streak >= 7) add('streak_7');
  if (streak >= 30) add('streak_30');
  if (streak >= 100) add('streak_100');
  if (totalLogs >= 100) add('century');
  if (state.goals.length >= 6) add('goal_master');
  if (hour >= 22) add('night_owl');
  if (hour < 7) add('early_bird');

  return newBadges;
};
