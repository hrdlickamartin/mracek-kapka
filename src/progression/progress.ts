import type { AnimalKind, FamilyId, PlantKind, SceneDef, SceneResult, WorldId } from '../game/types';
import { GARDEN_SLOTS, MAIN_WORLDS, SCENES_PER_WORLD, sceneId, worldById, WORLDS, type WorldDef } from '../game/worlds';
import type { GardenPlant, SaveData } from './saveData';
import { WARDROBE, wardrobeItem, type WardrobeId } from './wardrobe';

export function sceneDone(save: SaveData, id: string) {
  return save.scenes.includes(id);
}

export function worldDone(save: SaveData, world: WorldId) {
  return Array.from({ length: SCENES_PER_WORLD }, (_, i) => sceneId(world, i)).every((id) => sceneDone(save, id));
}

export function worldUnlocked(save: SaveData, world: WorldDef) {
  if (world.expansion) return save.ending;
  const index = MAIN_WORLDS.indexOf(world);
  return index <= 0 || worldDone(save, MAIN_WORLDS[index - 1].id);
}

export function sceneUnlocked(save: SaveData, scene: SceneDef) {
  if (!worldUnlocked(save, worldById(scene.world))) return false;
  return scene.index === 0 || sceneDone(save, sceneId(scene.world, scene.index - 1));
}

export function nextScene(save: SaveData): { world: WorldId; index: number } | null {
  for (const world of WORLDS) {
    if (!worldUnlocked(save, world)) continue;
    for (let i = 0; i < SCENES_PER_WORLD; i++) if (!sceneDone(save, sceneId(world.id, i))) return { world: world.id, index: i };
  }
  return null;
}

export function familyFound(save: SaveData): FamilyId[] {
  const found: FamilyId[] = [];
  for (const world of MAIN_WORLDS) if (world.family && worldDone(save, world.id)) found.push(world.family);
  if (save.ending) found.push('mama-bublinka', 'tata-brucik');
  return found;
}

export function rainbowStripes(save: SaveData): WorldId[] {
  return MAIN_WORLDS.filter((w) => worldDone(save, w.id)).map((w) => w.id);
}

export function campaignDone(save: SaveData) {
  return MAIN_WORLDS.every((w) => worldDone(save, w.id));
}

export function unlockedWardrobe(scenesDone: number): WardrobeId[] {
  return WARDROBE.filter((w) => scenesDone >= w.afterScenes).map((w) => w.id);
}

export interface SceneSummary {
  newAnimals: AnimalKind[];
  newSeeds: PlantKind[];
  newItems: WardrobeId[];
  family: FamilyId | null;
  stripe: WorldId | null;
  ending: boolean;
  rainbow: boolean;
}

function plantSeeds(garden: GardenPlant[], seeds: PlantKind[]) {
  const next = [...garden];
  for (const kind of seeds) {
    const free = GARDEN_SLOTS.find((x) => !next.some((p) => p.x === x));
    if (free === undefined) break;
    next.push({ kind, x: free, stage: 0 });
  }
  return next;
}

export function applyScene(save: SaveData, result: SceneResult): { save: SaveData; summary: SceneSummary } {
  const first = !sceneDone(save, result.sceneId);
  const scenes = first ? [...save.scenes, result.sceneId] : save.scenes;
  const newAnimals = result.animals.filter((a, i, all) => all.indexOf(a) === i && !save.album.includes(a));
  const newSeeds = result.seeds.filter((s) => !save.seeds.includes(s));
  const owned = unlockedWardrobe(scenes.length);
  const newItems = owned.filter((id) => !save.owned.includes(id));
  const world = worldById(result.world);
  const completesWorld = first && !worldDone(save, world.id) && Array.from({ length: SCENES_PER_WORLD }, (_, i) => sceneId(world.id, i)).every((id) => scenes.includes(id));
  const next: SaveData = {
    ...save,
    tutorialDone: true,
    scenes,
    album: [...save.album, ...newAnimals],
    rainbow: save.rainbow || result.rainbow,
    seeds: [...save.seeds, ...newSeeds],
    garden: plantSeeds(save.garden, newSeeds),
    owned: [...save.owned, ...newItems],
  };
  const ending = !save.ending && campaignDone(next);
  if (ending) next.ending = true;
  return {
    save: next,
    summary: {
      newAnimals,
      newSeeds,
      newItems,
      family: completesWorld ? world.family : null,
      stripe: completesWorld && !world.expansion ? world.id : null,
      ending,
      rainbow: result.rainbow && !save.rainbow,
    },
  };
}

export function toggleWear(save: SaveData, id: WardrobeId): SaveData {
  if (!save.owned.includes(id)) return save;
  const item = wardrobeItem(id);
  const worn = { ...save.worn };
  if (worn[item.slot] === id) delete worn[item.slot];
  else worn[item.slot] = id;
  return { ...save, worn };
}

export function guestOfDay(save: SaveData, random: number): AnimalKind | null {
  if (!save.album.length) return null;
  return save.album[Math.floor(random * save.album.length) % save.album.length];
}

export function worldAnimals(world: WorldDef): AnimalKind[] {
  return world.animals.filter((a, i, all) => all.indexOf(a) === i);
}
