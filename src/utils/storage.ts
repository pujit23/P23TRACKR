import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from '../context/types';

const STORAGE_KEY = 'P23TRACKR_STATE_V2';

export async function loadState(): Promise<AppState | null> {
  try {
    const rawData = await AsyncStorage.getItem(STORAGE_KEY);
    return rawData ? JSON.parse(rawData) : null;
  } catch {
    return null;
  }
}

export async function saveState(state: AppState): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Fail silently in compliance with single-user offline runtime rules
  }
}

export async function clearStorage(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {}
}
