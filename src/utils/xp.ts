export function getLevel(xp: number) {
  const thresholds = [0, 100, 300, 600, 1000, 1600, 2500];
  let level = 1;
  
  for (let i = 0; i < thresholds.length; i++) {
    if (xp >= thresholds[i]) {
      level = i + 1;
    } else {
      break;
    }
  }

  const currentThreshold = thresholds[level - 1] || 0;
  const nextThreshold = thresholds[level] || 99999;
  const xpInLevel = xp - currentThreshold;
  const xpForNext = nextThreshold - currentThreshold;

  let label = 'Tracker';
  if (level === 2) label = 'Adept';
  if (level === 3) label = 'Disciplined';
  if (level === 4) label = 'Master';
  if (level === 5) label = 'Elite';
  if (level >= 6) label = 'Ascended';

  return { level, label, xpInLevel, xpForNext };
}
