import AsyncStorage from '@react-native-async-storage/async-storage';
import { DEFAULT_SAVE, migrateSave, type SaveData } from './saveData';

export const SAVE_KEY = 'mracek-kapka-save-v1';

export async function loadSave(): Promise<SaveData> {
  try {
    const raw = await AsyncStorage.getItem(SAVE_KEY);
    return raw ? migrateSave(JSON.parse(raw)) : DEFAULT_SAVE;
  } catch {
    return DEFAULT_SAVE;
  }
}

export async function writeSave(data: SaveData): Promise<void> {
  try {
    await AsyncStorage.setItem(SAVE_KEY, JSON.stringify(data));
  } catch {}
}
