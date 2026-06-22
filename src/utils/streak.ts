export function calculateStreak(completions: Record<string, boolean>, habitsCount: number): number {
  if (habitsCount === 0) return 0;
  
  let currentStreak = 0;
  const checkDate = new Date();
  
  while (true) {
    const dateStr = `${checkDate.getFullYear()}-${String(checkDate.getMonth() + 1).padStart(2, '0')}-${String(checkDate.getDate()).padStart(2, '0')}`;
    const completedKeys = Object.keys(completions).filter(k => k.endsWith(`_${dateStr}`) && completions[k]);
    
    if (completedKeys.length >= 1) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      if (dateStr === `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${String(new Date().getDate()).padStart(2, '0')}`) {
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      }
      break;
    }
  }
  return currentStreak;
}
