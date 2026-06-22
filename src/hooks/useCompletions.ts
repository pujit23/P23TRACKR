import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { toKey, getTodayStr } from '../utils/dates';

export function useCompletions() {
  const { state, dispatch } = useAppContext();

  const toggleCompletion = useCallback((habitId: string, customDate?: string) => {
    const dateStr = customDate || getTodayStr();
    const key = toKey(habitId, dateStr);
    const exists = !!state.completions[key];

    const habit = state.habits.find((h) => h.id === habitId);
    if (!habit) return;

    const streakMultiplier = Math.min(1 + (state.streak / 20), 2.5);
    const xpGained = Math.round(habit.baseXP * streakMultiplier);

    dispatch({
      type: 'TOGGLE_COMPLETION',
      payload: { key, xpGained, isIncrement: !exists },
    });
  }, [state.habits, state.streak, state.completions, dispatch]);

  return { completions: state.completions, toggleCompletion };
}
