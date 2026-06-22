import { useMemo, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { calculateStreak } from '../utils/streak';
import { getWeekDates, getTodayStr } from '../utils/dates';

export function useStreak() {
  const { state, dispatch } = useAppContext();

  const currentStreak = useMemo(() => {
    return calculateStreak(state.completions, state.habits.length);
  }, [state.completions, state.habits.length]);

  useEffect(() => {
    if (currentStreak !== state.streak) {
      const nextLongest = Math.max(currentStreak, state.longestStreak);
      dispatch({
        type: 'UPDATE_STREAKS',
        payload: { streak: currentStreak, longestStreak: nextLongest },
      });
    }
  }, [currentStreak, state.streak, state.longestStreak, dispatch]);

  const weekDots = useMemo(() => {
    const dates = getWeekDates();
    const today = getTodayStr();

    return dates.map((d) => {
      const activeOnDay = state.habits.filter((h) => h.createdAt.split('T')[0] <= d);
      if (activeOnDay.length === 0) return 'future';

      const completedCount = activeOnDay.filter((h) => state.completions[`${h.id}_${d}`]).length;

      if (completedCount > 0) return 'done';
      if (d === today) return 'today';
      if (d > today) return 'future';
      return 'missed';
    });
  }, [state.completions, state.habits]);

  return { streak: state.streak, longestStreak: state.longestStreak, weekDots };
}
