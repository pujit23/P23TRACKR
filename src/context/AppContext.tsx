import React, { createContext, useContext, useReducer, useEffect, useMemo } from 'react';
import { AppState, Action, Badge } from './types';
import { loadState, saveState } from '../utils/storage';
import { Colors } from '../constants/theme';

const INITIAL_BADGES: Badge[] = [
  { id: 'b1', name: 'First Step', symbol: 'figure.walk', color: Colors.purple, unlocked: false },
  { id: 'b2', name: 'Week Warrior', symbol: 'flame.fill', color: Colors.amber, unlocked: false },
  { id: 'b3', name: 'Month Master', symbol: 'calendar', color: Colors.green, unlocked: false },
  { id: 'b4', name: 'Century Club', symbol: 'trophy.fill', color: Colors.blue, unlocked: false },
  { id: 'b5', name: 'Perfectionist', symbol: 'checkmark.circle.fill', color: Colors.green, unlocked: false },
  { id: 'b6', name: 'Early Bird', symbol: 'bolt.fill', color: Colors.amber, unlocked: false },
  { id: 'b7', name: 'Dedicated', symbol: 'star.fill', color: Colors.purple, unlocked: false },
];

const initialState: AppState = {
  habits: [],
  completions: {},
  goals: [],
  xp: 0,
  streak: 0,
  longestStreak: 0,
  badges: INITIAL_BADGES,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

function appReducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...action.payload };
    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.payload] };
    case 'EDIT_HABIT':
      return {
        ...state,
        habits: state.habits.map((h) => (h.id === action.payload.id ? action.payload : h)),
      };
    case 'DELETE_HABIT':
      return {
        ...state,
        habits: state.habits.filter((h) => h.id !== action.payload),
        completions: Object.keys(state.completions).reduce((acc, key) => {
          if (!key.startsWith(`${action.payload}_`)) {
            acc[key] = state.completions[key];
          }
          return acc;
        }, {} as Record<string, boolean>),
      };
    case 'TOGGLE_COMPLETION': {
      const { key, xpGained, isIncrement } = action.payload;
      const updatedCompletions = { ...state.completions, [key]: !state.completions[key] };
      return {
        ...state,
        completions: updatedCompletions,
        xp: Math.max(0, state.xp + (isIncrement ? xpGained : -xpGained)),
      };
    }
    case 'UPDATE_STREAKS':
      return {
        ...state,
        streak: action.payload.streak,
        longestStreak: action.payload.longestStreak,
      };
    case 'UNLOCK_BADGE':
      return {
        ...state,
        badges: state.badges.map((b) => (b.id === action.payload ? { ...b, unlocked: true } : b)),
      };
    case 'RESET_STATE':
      return { ...initialState };
    default:
      return state;
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    async function init() {
      const persisted = await loadState();
      if (persisted) dispatch({ type: 'LOAD_STATE', payload: persisted });
    }
    init();
  }, []);

  useEffect(() => {
    if (state !== initialState) {
      saveState(state);
    }
  }, [state]);

  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used inside AppProvider');
  return context;
}
