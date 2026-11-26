import { GARDEN_SLOTS } from '../game/worlds';
import type { AnimalKind, Plant, PlantKind } from '../game/types';
import type { WardrobeId, WardrobeSlot } from './wardrobe';

export type SleepMinutes = 0 | 10 | 20 | 30;

export interface Settings {
  music: number;
  sfx: number;
  haptics: boolean;
  sleepMinutes: SleepMinutes;
  reducedMotion: boolean;
  highContrast: boolean;
}

export interface GardenPlant {
  kind: PlantKind;
  x: number;
  stage: Plant['stage'];
}

export interface SaveData {
  version: 1;
  introSeen: boolean;
  tutorialDone: boolean;
  scenes: string[];
  album: AnimalKind[];
  rainbow: boolean;
  seeds: PlantKind[];
  garden: GardenPlant[];
  owned: WardrobeId[];
  worn: Partial<Record<WardrobeSlot, WardrobeId>>;
  ending: boolean;
  settings: Settings;
}

export const DEFAULT_SETTINGS: Settings = {
  music: 3,
  sfx: 3,
  haptics: true,
  sleepMinutes: 0,
  reducedMotion: false,
  highContrast: false,
};

export const DEFAULT_SAVE: SaveData = {
  version: 1,
  introSeen: false,
  tutorialDone: false,
  scenes: [],
  album: [],
  rainbow: false,
  seeds: [],
  garden: [
    { kind: 'kopretina', x: GARDEN_SLOTS[1], stage: 0 },
    { kind: 'mak', x: GARDEN_SLOTS[3], stage: 0 },
    { kind: 'pampeliska', x: GARDEN_SLOTS[5], stage: 0 },
  ],
  owned: [],
  worn: {},
  ending: false,
  settings: DEFAULT_SETTINGS,
};

function settingsOf(raw: Partial<Settings> | undefined): Settings {
  const merged = { ...DEFAULT_SETTINGS, ...(raw ?? {}) };
  return {
    music: merged.music,
    sfx: merged.sfx,
    haptics: merged.haptics,
    sleepMinutes: merged.sleepMinutes,
    reducedMotion: merged.reducedMotion,
    highContrast: merged.highContrast,
  };
}

export function migrateSave(raw: unknown): SaveData {
  if (!raw || typeof raw !== 'object') return DEFAULT_SAVE;
  const data = raw as Partial<SaveData>;
  return {
    ...DEFAULT_SAVE,
    ...data,
    version: 1,
    settings: settingsOf(data.settings),
    garden: Array.isArray(data.garden) ? data.garden : DEFAULT_SAVE.garden,
    worn: data.worn ?? {},
  };
}
