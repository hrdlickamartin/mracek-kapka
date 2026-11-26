import { SCENE_W } from './constants';
import type { AnimalKind, FamilyId, HideoutKind, Mechanic, PlantKind, Reward, SceneDef, SourceKind, WorldId } from './types';

export interface WorldPalette {
  skyTop: string;
  skyBottom: string;
  far: string;
  mid: string;
  groundDry: string;
  groundLush: string;
  accent: string;
}

export interface WorldDef {
  id: WorldId;
  name: string;
  plants: PlantKind[];
  animals: AnimalKind[];
  source: SourceKind;
  mechanics: Mechanic[];
  family: FamilyId | null;
  hideouts: HideoutKind[];
  palette: WorldPalette;
  expansion: boolean;
  scenery: 'louka' | 'zahradka' | 'les' | 'poust' | 'hory' | 'rybnicek' | 'more' | 'noc';
}

export const SCENES_PER_WORLD = 5;

export const WORLDS: WorldDef[] = [
  {
    id: 'louka',
    name: 'Louka',
    plants: ['kopretina', 'mak', 'pampeliska', 'zvonek', 'tulipan'],
    animals: ['motyl', 'beruska', 'vcelka', 'cvrcek', 'sykorka'],
    source: 'jezirko',
    mechanics: [],
    family: null,
    hideouts: ['ker', 'kamen', 'krtina'],
    palette: { skyTop: '#3BAEFD', skyBottom: '#D2F0FD', far: '#9FC9E8', mid: '#7FB547', groundDry: '#D8C27A', groundLush: '#A8C729', accent: '#ED3E1D' },
    expansion: false,
    scenery: 'louka',
  },
  {
    id: 'zahradka',
    name: 'Zahrádka u domku',
    plants: ['mrkev', 'slunecnice', 'jahoda', 'tulipan'],
    animals: ['zajicek', 'vrabec', 'snek', 'zizala'],
    source: 'sud',
    mechanics: [],
    family: 'babicka-perinka',
    hideouts: ['okno', 'ker', 'krtina'],
    palette: { skyTop: '#46B2FB', skyBottom: '#DDF3FD', far: '#A7CDE6', mid: '#6FA83E', groundDry: '#CB7035', groundLush: '#853B0F', accent: '#F9BA0A' },
    expansion: false,
    scenery: 'zahradka',
  },
  {
    id: 'les',
    name: 'Les',
    plants: ['houba', 'kapradi', 'boruvky', 'zvonek'],
    animals: ['jezek', 'veverka', 'sova', 'srnka'],
    source: 'potok',
    mechanics: [],
    family: 'mlhulka',
    hideouts: ['parez', 'dutina', 'ker'],
    palette: { skyTop: '#5DB6E8', skyBottom: '#DCEFD9', far: '#4E8C6A', mid: '#2F7350', groundDry: '#9C9A62', groundLush: '#5E9B2E', accent: '#BD8EFA' },
    expansion: false,
    scenery: 'les',
  },
  {
    id: 'poust',
    name: 'Poušť',
    plants: ['kaktus', 'palma', 'kaktus', 'palma'],
    animals: ['jesterka', 'velbloudik', 'zelvicka'],
    source: 'oaza',
    mechanics: ['slunce'],
    family: 'duhacek',
    hideouts: ['kamen', 'dutina', 'krtina'],
    palette: { skyTop: '#47B3FC', skyBottom: '#FCEFD2', far: '#E7A86A', mid: '#E7862E', groundDry: '#FFE2A3', groundLush: '#FECD6D', accent: '#EC8FBB' },
    expansion: false,
    scenery: 'poust',
  },
  {
    id: 'hory',
    name: 'Hory',
    plants: ['horska-kvetinka', 'mech', 'horska-kvetinka', 'mech'],
    animals: ['kamzik', 'svist', 'orlik'],
    source: 'vodopad',
    mechanics: ['vitr', 'snih'],
    family: 'deda-vlocka',
    hideouts: ['kamen', 'dutina', 'ker'],
    palette: { skyTop: '#4AA9F0', skyBottom: '#E5EFFC', far: '#B8CCE6', mid: '#6E9D5A', groundDry: '#A9A9A0', groundLush: '#7FB547', accent: '#8DD9FA' },
    expansion: false,
    scenery: 'hory',
  },
  {
    id: 'rybnicek',
    name: 'Rybníček u mlýna',
    plants: ['leknin', 'orobinec', 'leknin', 'orobinec'],
    animals: ['kachnicka', 'vazka', 'rybka'],
    source: 'rybnik',
    mechanics: [],
    family: null,
    hideouts: ['leknin-list', 'ker', 'kamen'],
    palette: { skyTop: '#3EAEF7', skyBottom: '#D9F2FB', far: '#9DC8D9', mid: '#5E9F55', groundDry: '#C9C27D', groundLush: '#7DB84A', accent: '#F7A6C8' },
    expansion: true,
    scenery: 'rybnicek',
  },
  {
    id: 'morsky-breh',
    name: 'Mořský břeh',
    plants: ['pobrezni-ruze', 'morska-levandule', 'pobrezni-ruze', 'morska-levandule'],
    animals: ['krab', 'racek', 'morska-zelvicka'],
    source: 'more',
    mechanics: [],
    family: null,
    hideouts: ['muslicka', 'kamen', 'krtina'],
    palette: { skyTop: '#38ACFA', skyBottom: '#DFF6FD', far: '#6FC3E8', mid: '#E3C98A', groundDry: '#F6E2B0', groundLush: '#F2D78C', accent: '#F06C9B' },
    expansion: true,
    scenery: 'more',
  },
  {
    id: 'nocni-zahrada',
    name: 'Noční zahrada',
    plants: ['mesicnice', 'nocni-fialka', 'mesicnice', 'nocni-fialka'],
    animals: ['svetluska', 'mura', 'plch'],
    source: 'rosa',
    mechanics: ['noc'],
    family: null,
    hideouts: ['ker', 'parez', 'okno'],
    palette: { skyTop: '#2B3F73', skyBottom: '#5A6FA8', far: '#3C4F86', mid: '#2F5A5A', groundDry: '#4C5D6E', groundLush: '#3F7A5A', accent: '#FFF6C9' },
    expansion: true,
    scenery: 'noc',
  },
];

export const MAIN_WORLDS = WORLDS.filter((w) => !w.expansion);
export const EXPANSION_WORLDS = WORLDS.filter((w) => w.expansion);

export function worldById(id: WorldId): WorldDef {
  const world = WORLDS.find((w) => w.id === id);
  if (!world) throw new Error(`Neznámý svět ${id}`);
  return world;
}

export function sceneId(world: WorldId, index: number) {
  return `${world}-${index + 1}`;
}

const PLANT_COUNTS = [3, 3, 4, 4, 5];
const SOURCE_W: Record<SourceKind, number> = { jezirko: 210, potok: 200, sud: 120, oaza: 220, vodopad: 180, rybnik: 240, more: 240, rosa: 150 };

function spread(count: number, from: number, to: number) {
  if (count === 1) return [(from + to) / 2];
  const gap = (to - from) / (count - 1);
  return Array.from({ length: count }, (_, i) => Math.round(from + gap * i));
}

export function buildScene(world: WorldDef, index: number): SceneDef {
  const count = PLANT_COUNTS[index % PLANT_COUNTS.length];
  const sourceLeft = index % 2 === 0;
  const sourceW = SOURCE_W[world.source];
  const sourceX = sourceLeft ? 250 : SCENE_W - 250;
  const span = sourceLeft ? [530, SCENE_W - 210] : [210, SCENE_W - 530];
  const width = span[1] - span[0];
  const used = count <= 3 ? width * 0.75 : count === 4 ? width * 0.9 : width;
  const start = span[0] + (width - used) / 2;
  const xs = spread(count, start, start + used);
  const plants = xs.map((x, i) => ({ kind: world.plants[(index + i) % world.plants.length], x }));
  const visitor = world.animals[index % world.animals.length];
  const extraAnimal = world.animals[(index + 1) % world.animals.length];
  const seed = world.plants[(index + 2) % world.plants.length];
  const rewards: Reward[] = [{ type: 'seed', plant: seed }, { type: 'animal', animal: extraAnimal }, { type: 'motyli' }];
  const hideoutCount = index < 2 ? 2 : 3;
  const mids = xs.slice(1).map((x, i) => Math.round((x + xs[i]) / 2));
  const spots = mids.length >= hideoutCount ? mids : [...mids, sourceLeft ? Math.min(xs[xs.length - 1] + 140, SCENE_W - 220) : Math.max(xs[0] - 140, 220)];
  const hideouts = spots.slice(0, hideoutCount).map((x, i) => ({
    kind: world.hideouts[(index + i) % world.hideouts.length],
    x,
    y: 700,
    reward: rewards[i % rewards.length],
  }));
  return {
    id: sceneId(world.id, index),
    world: world.id,
    index,
    plants,
    source: { kind: world.source, x: sourceX, w: sourceW },
    hideouts,
    visitor,
    mechanics: world.mechanics,
    family: index === SCENES_PER_WORLD - 1 ? world.family : null,
    tutorial: world.id === 'louka' && index === 0,
  };
}

export function scenesOf(world: WorldDef): SceneDef[] {
  return Array.from({ length: SCENES_PER_WORLD }, (_, i) => buildScene(world, i));
}

export function sceneById(id: string): SceneDef {
  for (const world of WORLDS) for (const scene of scenesOf(world)) if (scene.id === id) return scene;
  throw new Error(`Neznámá scéna ${id}`);
}

export const GARDEN_SCENE: SceneDef = {
  id: 'zahradka-domov',
  world: 'louka',
  index: 0,
  plants: [],
  source: { kind: 'jezirko', x: 250, w: 210 },
  hideouts: [],
  visitor: 'motyl',
  mechanics: [],
  family: null,
  tutorial: false,
};

export const GARDEN_SLOTS = [500, 650, 800, 950, 1100, 1250, 1400];
