import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, DEFAULT_STATE, Goal, DailyLog } from '../types';
import { todayKey } from '../utils/dates';
import { calcLogXP } from '../utils/xp';
import { checkBadges } from '../utils/badges';
import { calculateStreak } from '../utils/streak';

const STORAGE_KEY = 'p23track-state-v1';

type Action =
  | { type: 'HYDRATE'; payload: AppState }
  | { type: 'SET'; payload: Partial<AppState> }
  | { type: 'SAVE_LOG'; payload: { log: DailyLog; xpGained: number; newBadges: string[] } }
  | { type: 'ADD_GOAL'; payload: Goal }
  | { type: 'UPDATE_GOAL'; payload: { id: string; updates: Partial<Goal> } }
  | { type: 'DELETE_GOAL'; payload: string }
  | { type: 'REORDER_GOALS'; payload: Goal[] }
  | { type: 'USE_FREEZE'; payload: string }
  | { type: 'RESET' };

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload;

    case 'SET':
      return { ...state, ...action.payload };

    case 'SAVE_LOG': {
      const { log, xpGained, newBadges } = action.payload;
      const idx = state.logs.findIndex(l => l.date === log.date);
      const logs = idx >= 0
        ? state.logs.map((l, i) => i === idx ? log : l)
        : [...state.logs, log];
      const newState = { ...state, logs };
      const newStreak = calculateStreak(newState);
      return {
        ...newState,
        xp: state.xp + xpGained,
        badges: [...new Set([...state.badges, ...newBadges])],
        bestStreak: Math.max(state.bestStreak, newStreak),
      };
    }

    case 'ADD_GOAL':
      return { ...state, goals: [...state.goals, action.payload] };

    case 'UPDATE_GOAL':
      return {
        ...state,
        goals: state.goals.map(g =>
          g.id === action.payload.id ? { ...g, ...action.payload.updates } : g
        ),
      };

    case 'DELETE_GOAL': {
      const idx = state.goals.findIndex(g => g.id === action.payload);
      if (idx === -1) return state;
      const goals = state.goals.filter(g => g.id !== action.payload);
      const logs = state.logs.map(l => ({
        ...l,
        checks: l.checks.filter((_, i) => i !== idx),
        goalNotes: l.goalNotes.filter((_, i) => i !== idx),
      }));
      return { ...state, goals, logs };
    }

    case 'REORDER_GOALS':
      return { ...state, goals: action.payload };

    case 'USE_FREEZE':
      return {
        ...state,
        streakFreezes: Math.max(0, state.streakFreezes - 1),
        streakFreezeUsedDates: [...state.streakFreezeUsedDates, action.payload],
      };

    case 'RESET':
      return { ...DEFAULT_STATE };

    default:
      return state;
  }
}

interface Ctx {
  state: AppState;
  dispatch: React.Dispatch<Action>;
  saveLog: (log: Omit<DailyLog, 'loggedAt'>) => { xpGained: number; newBadges: string[] };
}

const AppCtx = createContext<Ctx | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);

  // Load from storage
  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(raw => {
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as AppState;
          dispatch({ type: 'HYDRATE', payload: { ...DEFAULT_STATE, ...parsed } });
        } catch {}
      }
    });
  }, []);

  // Auto-save with debounce
  useEffect(() => {
    const t = setTimeout(() => {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
    }, 300);
    return () => clearTimeout(t);
  }, [state]);

  const saveLog = useCallback((log: Omit<DailyLog, 'loggedAt'>) => {
    const fullLog: DailyLog = { ...log, loggedAt: new Date().toISOString() };
    const activeGoals = state.goals.filter(g => !g.archived);
    const xpGained = calcLogXP(fullLog, activeGoals);
    const newBadges = checkBadges({ ...state, logs: [...state.logs, fullLog] });
    dispatch({ type: 'SAVE_LOG', payload: { log: fullLog, xpGained, newBadges } });
    return { xpGained, newBadges };
  }, [state]);

  return <AppCtx.Provider value={{ state, dispatch, saveLog }}>{children}</AppCtx.Provider>;
};

export const useApp = () => {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
};
