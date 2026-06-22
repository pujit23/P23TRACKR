import { useCallback } from 'react';
import { useAppContext } from '../context/AppContext';
import { Habit } from '../context/types';

export function useHabits() {
  const { state, dispatch } = useAppContext();

  const addHabit = useCallback((habit: Habit) => {
    dispatch({ type: 'ADD_HABIT', payload: habit });
  }, [dispatch]);

  const editHabit = useCallback((habit: Habit) => {
    dispatch({ type: 'EDIT_HABIT', payload: habit });
  }, [dispatch]);

  const deleteHabit = useCallback((id: string) => {
    dispatch({ type: 'DELETE_HABIT', payload: id });
  }, [dispatch]);

  return { habits: state.habits, addHabit, editHabit, deleteHabit };
}
