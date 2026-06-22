export function toKey(habitId: string, dateStr: string): string {
  return `${habitId}_${dateStr}`;
}

export function getTodayStr(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function getWeekDates(): string[] {
  const current = new Date();
  const week: string[] = [];
  current.setDate(current.getDate() - current.getDay() + (current.getDay() === 0 ? -6 : 1)); // Mon
  for (let i = 0; i < 7; i++) {
    const temp = new Date(current);
    temp.setDate(current.getDate() + i);
    week.push(`${temp.getFullYear()}-${String(temp.getMonth() + 1).padStart(2, '0')}-${String(temp.getDate()).padStart(2, '0')}`);
  }
  return week;
}
