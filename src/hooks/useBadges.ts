import { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';

export function useBadges() {
  const { state, dispatch } = useAppContext();

  useEffect(() => {
    const totalCompletions = Object.values(state.completions).filter(Boolean).length;
    
    if (totalCompletions >= 1 && !state.badges.find(b => b.id === 'b1')?.unlocked) {
      dispatch({ type: 'UNLOCK_BADGE', payload: 'b1' });
    }
    if (state.streak >= 7 && !state.badges.find(b => b.id === 'b2')?.unlocked) {
      dispatch({ type: 'UNLOCK_BADGE', payload: 'b2' });
    }
    if (state.streak >= 30 && !state.badges.find(b => b.id === 'b3')?.unlocked) {
      dispatch({ type: 'UNLOCK_BADGE', payload: 'b3' });
    }
    if (totalCompletions >= 100 && !state.badges.find(b => b.id === 'b4')?.unlocked) {
      dispatch({ type: 'UNLOCK_BADGE', payload: 'b4' });
    }
  }, [state.completions, state.streak, state.badges, dispatch]);

  return { badges: state.badges };
}
