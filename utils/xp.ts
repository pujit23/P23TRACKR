import { Goal, DailyLog } from '../types';

const XP_PER_GOAL: Record<string, number> = {
  easy: 10, medium: 20, hard: 35,
};
const XP_PERFECT_DAY = 50;

export const calcLogXP = (log: DailyLog, activeGoals: Goal[]): number => {
  let xp = 0;
  activeGoals.forEach((g, i) => {
    if (log.checks[i]) xp += XP_PER_GOAL[g.difficulty];
  });
  if (activeGoals.length > 0 && log.checks.slice(0, activeGoals.length).every(Boolean)) {
    xp += XP_PERFECT_DAY;
  }
  return xp;
};

export const getRank = (xp: number): { rank: string; next: string; nextXP: number; progress: number } => {
  const levels = [
    { rank: 'Beginner',   next: 'Consistent',  min: 0,    max: 199   },
    { rank: 'Consistent', next: 'Dedicated',   min: 200,  max: 599   },
    { rank: 'Dedicated',  next: 'Relentless',  min: 600,  max: 1499  },
    { rank: 'Relentless', next: 'Elite',       min: 1500, max: 3499  },
    { rank: 'Elite',      next: 'Legend',      min: 3500, max: 7499  },
    { rank: 'Legend',     next: 'Legend',      min: 7500, max: 99999 },
  ];
  const level = levels.find(l => xp >= l.min && xp <= l.max) ?? levels[levels.length - 1];
  const progress = level.rank === 'Legend' ? 1
    : (xp - level.min) / (level.max - level.min + 1);
  return {
    rank: level.rank,
    next: level.next,
    nextXP: level.max + 1,
    progress: Math.min(progress, 1),
  };
};
