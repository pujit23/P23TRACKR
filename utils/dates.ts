export const todayKey = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

export const dateKey = (date: Date): string =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

export const previousDay = (key: string): string => {
  const [y, m, d] = key.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() - 1);
  return dateKey(date);
};

export const formatDisplay = (key: string): string => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d).toLocaleDateString('en-US', {
    weekday: 'short', month: 'short', day: 'numeric',
  });
};

export const isWeekday = (key: string): boolean => {
  const [y, m, d] = key.split('-').map(Number);
  const day = new Date(y, m - 1, d).getDay();
  return day !== 0 && day !== 6;
};

export const getWeekDays = (): string[] => {
  const days: string[] = [];
  const today = new Date();
  const dayOfWeek = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    days.push(dateKey(d));
  }
  return days;
};

export const getLast30Days = (): string[] => {
  const days: string[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(dateKey(d));
  }
  return days;
};
