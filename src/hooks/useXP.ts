import { useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { getLevel } from '../utils/xp';

export function useXP() {
  const { state } = useAppContext();
  const xpMetrics = useMemo(() => getLevel(state.xp), [state.xp]);
  return { xp: state.xp, ...xpMetrics };
}
