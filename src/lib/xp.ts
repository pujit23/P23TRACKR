export const BADGE_DEFS = [
  { id: 'Ignition', title: 'Ignition', icon: 'Flame', req: '7-day streak', rarity: 'Common', xp: 200, total: 7 },
  { id: 'DeadEye', title: 'Dead-Eye', icon: 'Target', req: '100% goals 5 days', rarity: 'Rare', xp: 500, total: 5 },
  { id: 'ZenithMind', title: 'Zenith Mind', icon: 'Brain', req: 'Mood log 14 days', rarity: 'Rare', xp: 350, total: 14 },
  { id: 'StellarRun', title: 'Stellar Run', icon: 'Star', req: '21-day streak', rarity: 'Epic', xp: 750, total: 21 },
  { id: 'VitalProtocol', title: 'Vital Protocol', icon: 'Heart', req: 'All health 10 days', rarity: 'Rare', xp: 400, total: 10 },
  { id: 'IronRitual', title: 'Iron Ritual', icon: 'Shield', req: '30-day perfect', rarity: 'Legendary', xp: 2000, total: 30 },
  { id: 'Voltage', title: 'Voltage', icon: 'Zap', req: 'Max energy 7 days', rarity: 'Common', xp: 300, total: 7 },
  { id: 'Apex', title: 'Apex', icon: 'Trophy', req: '10,000 XP', rarity: 'Legendary', xp: 1000, total: 10000 },
];

export function getLevel(xp: number): number {
  return Math.floor(xp / 500) + 1;
}

export function getXPProgress(xp: number): number {
  return (xp % 500) / 500 * 100;
}
