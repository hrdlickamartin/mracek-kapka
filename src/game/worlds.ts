import { SCENE_W } from './constants';
import type { AnimalKind, FamilyId, HideoutKind, Mechanic, PlantKind, Reward, SceneDef, SourceKind, WonderKind, WorldId } from './types';

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
  scenery: Scenery;
  wonder: { kind: WonderKind; animal: AnimalKind } | null;
  music: MusicFlavor;
}

export type Scenery = 'louka' | 'zahradka' | 'les' | 'poust' | 'hory' | 'rybnicek' | 'more' | 'noc' | 'dzungle' | 'sad' | 'arktida' | 'balkon';

export type MusicFlavor = 'zvonky' | 'drevo' | 'kalimba' | 'celesta' | 'harfa' | 'skrinka' | 'ukulele';

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
    wonder: null,
    music: 'zvonky',
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
    wonder: null,
    music: 'zvonky',
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
    wonder: { kind: 'houby', animal: 'jezek' },
    music: 'drevo',
  },
  {
    id: 'poust',
    name: 'Poušť',
    plants: ['kaktus', 'palma', 'kaktus', 'palma'],
    animals: ['jesterka', 'velbloudik', 'zelvicka'],
    source: 'oaza',
    mechanics: ['slunce'],
    family: 'duhacek',
    hideouts: ['kamen', 'krtina', 'kamen'],
    palette: { skyTop: '#47B3FC', skyBottom: '#FCEFD2', far: '#E7A86A', mid: '#E7862E', groundDry: '#FFE2A3', groundLush: '#FECD6D', accent: '#EC8FBB' },
    expansion: false,
    scenery: 'poust',
    wonder: null,
    music: 'kalimba',
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
    wonder: { kind: 'snehulak', animal: 'svist' },
    music: 'celesta',
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
    wonder: { kind: 'mlyn', animal: 'kachnicka' },
    music: 'harfa',
  },
  {
    id: 'morsky-breh',
    name: 'Mořský břeh',
    plants: ['pobrezni-ruze', 'morska-levandule', 'pobrezni-ruze', 'morska-levandule'],
    animals: ['krab', 'racek', 'morska-zelvicka'],
    source: 'more',
    mechanics: ['priliv'],
    family: null,
    hideouts: ['muslicka', 'kamen', 'krtina'],
    palette: { skyTop: '#38ACFA', skyBottom: '#DFF6FD', far: '#6FC3E8', mid: '#E3C98A', groundDry: '#F6E2B0', groundLush: '#F2D78C', accent: '#F06C9B' },
    expansion: true,
    scenery: 'more',
    wonder: { kind: 'hrad', animal: 'krab' },
    music: 'harfa',
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
    wonder: null,
    music: 'skrinka',
  },
  {
    id: 'dzungle',
    name: 'Džungle',
    plants: ['orchidej', 'heliconie', 'kapradi', 'orchidej', 'heliconie'],
    animals: ['papousek', 'opicka', 'tukan', 'lenochod'],
    source: 'vodopad',
    mechanics: [],
    family: null,
    hideouts: ['ker', 'dutina', 'kamen'],
    palette: { skyTop: '#3FB6E8', skyBottom: '#DDF5E4', far: '#3E8C5A', mid: '#2E7A45', groundDry: '#B5A36A', groundLush: '#4E9B35', accent: '#F2622E' },
    expansion: true,
    scenery: 'dzungle',
    wonder: { kind: 'obri-kvet', animal: 'papousek' },
    music: 'drevo',
  },
  {
    id: 'sad',
    name: 'Sad',
    plants: ['jablicko', 'tykev', 'jahoda', 'mrkev', 'jablicko'],
    animals: ['kos', 'krtek', 'ovecka', 'jezek'],
    source: 'studna',
    mechanics: [],
    family: null,
    hideouts: ['ker', 'parez', 'krtina'],
    palette: { skyTop: '#45B0F5', skyBottom: '#E6F5DA', far: '#8CBF6A', mid: '#6BA23E', groundDry: '#C9B47A', groundLush: '#7DB84A', accent: '#E5322A' },
    expansion: true,
    scenery: 'sad',
    wonder: { kind: 'jablon', animal: 'krtek' },
    music: 'drevo',
  },
  {
    id: 'arktida',
    name: 'Arktida',
    plants: ['polarni-mak', 'lomikamen', 'mech', 'polarni-mak', 'lomikamen'],
    animals: ['tucnak', 'tulen', 'medvidek', 'liska'],
    source: 'led',
    mechanics: ['snih'],
    family: null,
    hideouts: ['zavej', 'kamen', 'zavej'],
    palette: { skyTop: '#5FB4EE', skyBottom: '#EAF4FC', far: '#BFD6EC', mid: '#DCE8F3', groundDry: '#C9D3DC', groundLush: '#EAF2F8', accent: '#3BAEFD' },
    expansion: true,
    scenery: 'arktida',
    wonder: { kind: 'iglu', animal: 'tucnak' },
    music: 'celesta',
  },
  {
    id: 'balkon',
    name: 'Balkon ve městě',
    plants: ['muskat', 'rajce', 'tulipan', 'muskat', 'rajce'],
    animals: ['holub', 'kocicka', 'vrabec', 'beruska'],
    source: 'sud',
    mechanics: [],
    family: null,
    hideouts: ['kvetinac', 'okno', 'kvetinac'],
    palette: { skyTop: '#4DAAF0', skyBottom: '#E2F1FB', far: '#C9D3E0', mid: '#B9A48A', groundDry: '#C8B6A0', groundLush: '#D9C4A8', accent: '#ED3E1D' },
    expansion: true,
    scenery: 'balkon',
    wonder: { kind: 'kaluz', animal: 'holub' },
    music: 'ukulele',
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

const SOURCE_W: Record<SourceKind, number> = { jezirko: 210, potok: 200, sud: 120, oaza: 220, vodopad: 180, rybnik: 240, more: 240, rosa: 150, studna: 140, led: 220 };

export interface SceneLayout {
  source: 'vlevo' | 'vpravo' | 'uprostred';
  plants: number;
  wonder: boolean;
}

export const SCENE_LAYOUTS: SceneLayout[] = [
  { source: 'vlevo', plants: 3, wonder: false },
  { source: 'vpravo', plants: 3, wonder: true },
  { source: 'uprostred', plants: 4, wonder: false },
  { source: 'vlevo', plants: 4, wonder: true },
  { source: 'vpravo', plants: 5, wonder: false },
];

export const BACKDROPS = 3;

function spread(count: number, from: number, to: number) {
  if (count === 1) return [(from + to) / 2];
  const gap = (to - from) / (count - 1);
  return Array.from({ length: count }, (_, i) => Math.round(from + gap * i));
}

function fill(count: number, from: number, to: number) {
  const width = to - from;
  const used = count <= 3 ? width * 0.75 : count === 4 ? width * 0.9 : width;
  const start = from + (width - used) / 2;
  return spread(count, start, start + used);
}

function slotsFor(layout: SceneLayout, slots: number) {
  if (layout.source === 'uprostred') {
    const left = Math.ceil(slots / 2);
    return { sourceX: SCENE_W / 2, xs: [...spread(left, 210, 510), ...spread(slots - left, 1090, 1390)] };
  }
  const sourceX = layout.source === 'vlevo' ? 250 : SCENE_W - 250;
  return { sourceX, xs: layout.source === 'vlevo' ? fill(slots, 560, 1390) : fill(slots, 210, 1040) };
}

export function buildScene(world: WorldDef, index: number): SceneDef {
  const layout = SCENE_LAYOUTS[index % SCENE_LAYOUTS.length];
  const hasWonder = layout.wonder && !!world.wonder;
  const count = layout.plants;
  const { sourceX, xs } = slotsFor(layout, count + (hasWonder ? 1 : 0));
  const sourceW = SOURCE_W[world.source];
  const wonderSlot = hasWonder ? Math.floor(xs.length / 2) : -1;
  const plantXs = xs.filter((_, i) => i !== wonderSlot);
  const plants = plantXs.map((x, i) => ({ kind: world.plants[(index + i) % world.plants.length], x }));
  const visitor = world.animals[index % world.animals.length];
  const extraAnimal = world.animals[(index + 1) % world.animals.length];
  const seed = world.plants[(index + 2) % world.plants.length];
  const rewards: Reward[] = [{ type: 'seed', plant: seed }, { type: 'animal', animal: extraAnimal }, { type: 'motyli' }];
  const hideoutCount = index < 2 ? 2 : 3;
  const clear = sourceW / 2 + 120;
  const mids = xs.slice(1).map((x, i) => Math.round((x + xs[i]) / 2)).filter((x) => Math.abs(x - sourceX) > clear);
  const ends = [xs[0] - 140, xs[xs.length - 1] + 140].filter((x) => x >= 220 && x <= SCENE_W - 220 && Math.abs(x - sourceX) > clear);
  const wonderX = hasWonder ? xs[wonderSlot] : null;
  const spots = [...mids, ...ends].filter((x) => wonderX === null || Math.abs(x - wonderX) > 180);
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
    backdrop: index % BACKDROPS,
    wonder: hasWonder && world.wonder ? { kind: world.wonder.kind, x: xs[wonderSlot], animal: world.wonder.animal } : null,
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
  backdrop: 0,
  wonder: null,
};

export const GARDEN_SLOTS = [500, 650, 800, 950, 1100, 1250, 1400];
