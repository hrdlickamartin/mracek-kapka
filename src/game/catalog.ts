import type { AnimalKind, FamilyId, PlantKind } from './types';

export interface PlantInfo {
  name: string;
  tone: number;
  color: string;
}

export const PLANTS: Record<PlantKind, PlantInfo> = {
  kopretina: { name: 'kopretina', tone: 0, color: '#FEFCFC' },
  mak: { name: 'vlčí mák', tone: 2, color: '#ED3E1D' },
  pampeliska: { name: 'pampeliška', tone: 4, color: '#FBCC03' },
  zvonek: { name: 'zvonek', tone: 5, color: '#BD8EFA' },
  tulipan: { name: 'tulipán', tone: 7, color: '#EC8FBB' },
  mrkev: { name: 'mrkev', tone: 1, color: '#F39B05' },
  slunecnice: { name: 'slunečnice', tone: 3, color: '#F9BA0A' },
  jahoda: { name: 'jahoda', tone: 6, color: '#E5322A' },
  houba: { name: 'houba', tone: 0, color: '#E5322A' },
  kapradi: { name: 'kapradí', tone: 3, color: '#4F9112' },
  boruvky: { name: 'borůvky', tone: 6, color: '#4F5FB8' },
  kaktus: { name: 'kaktus', tone: 2, color: '#EC8FBB' },
  palma: { name: 'palma', tone: 5, color: '#75A023' },
  'horska-kvetinka': { name: 'horská kytička', tone: 7, color: '#FEFCFC' },
  mech: { name: 'mech', tone: 4, color: '#A8C729' },
  leknin: { name: 'leknín', tone: 1, color: '#F7A6C8' },
  orobinec: { name: 'orobinec', tone: 4, color: '#8A4B1E' },
  'pobrezni-ruze': { name: 'pobřežní růže', tone: 6, color: '#F06C9B' },
  'morska-levandule': { name: 'mořská levandule', tone: 3, color: '#A98BF0' },
  mesicnice: { name: 'měsíčnice', tone: 8, color: '#FFF6C9' },
  'nocni-fialka': { name: 'noční fialka', tone: 5, color: '#9C7BEA' },
  orchidej: { name: 'orchidej', tone: 6, color: '#D873C8' },
  heliconie: { name: 'helikónie', tone: 2, color: '#F2622E' },
  jablicko: { name: 'jabloňka', tone: 4, color: '#E5322A' },
  tykev: { name: 'dýně', tone: 1, color: '#F39B05' },
  'polarni-mak': { name: 'polární mák', tone: 5, color: '#FBE15A' },
  lomikamen: { name: 'lomikámen', tone: 7, color: '#EC8FBB' },
  muskat: { name: 'muškát', tone: 3, color: '#ED3E1D' },
  rajce: { name: 'rajčátko', tone: 6, color: '#E5322A' },
};

export type AnimalMove = 'leti' | 'skace' | 'leze' | 'vyleze' | 'plave' | 'chodi';

export interface AnimalInfo {
  name: string;
  flies?: boolean;
  glow?: boolean;
  move?: AnimalMove;
}

export function animalMove(info: AnimalInfo): AnimalMove {
  return info.move ?? (info.flies ? 'leti' : 'chodi');
}

export const ANIMALS: Record<AnimalKind, AnimalInfo> = {
  motyl: { name: 'motýl', flies: true },
  beruska: { name: 'beruška', move: 'leze' },
  vcelka: { name: 'včelka', flies: true },
  cvrcek: { name: 'cvrček', move: 'skace' },
  sykorka: { name: 'sýkorka', flies: true },
  zajicek: { name: 'zajíček', move: 'skace' },
  vrabec: { name: 'vrabec', flies: true },
  snek: { name: 'šnek', move: 'leze' },
  zizala: { name: 'žížala', move: 'vyleze' },
  jezek: { name: 'ježek', move: 'chodi' },
  veverka: { name: 'veverka', move: 'skace' },
  sova: { name: 'sova', flies: true },
  srnka: { name: 'srnka' },
  jesterka: { name: 'ještěrka', move: 'leze' },
  velbloudik: { name: 'velbloudík' },
  zelvicka: { name: 'želvička', move: 'leze' },
  kamzik: { name: 'kamzík', move: 'skace' },
  svist: { name: 'svišť', move: 'vyleze' },
  orlik: { name: 'orlík', flies: true },
  kachnicka: { name: 'kachnička', move: 'plave' },
  vazka: { name: 'vážka', flies: true },
  rybka: { name: 'rybka', move: 'plave' },
  krab: { name: 'krab', move: 'leze' },
  racek: { name: 'racek', flies: true },
  'morska-zelvicka': { name: 'mořská želvička', move: 'plave' },
  svetluska: { name: 'světluška', flies: true, glow: true },
  mura: { name: 'můra', flies: true },
  plch: { name: 'plch', move: 'skace' },
  papousek: { name: 'papoušek', flies: true },
  tukan: { name: 'tukan', flies: true },
  opicka: { name: 'opička', move: 'skace' },
  lenochod: { name: 'lenochod', move: 'leze' },
  krtek: { name: 'krtek', move: 'vyleze' },
  kos: { name: 'kos', flies: true },
  ovecka: { name: 'ovečka' },
  tucnak: { name: 'tučňák', move: 'plave' },
  medvidek: { name: 'lední medvídek' },
  tulen: { name: 'tuleň', move: 'plave' },
  liska: { name: 'polární liška', move: 'skace' },
  holub: { name: 'holub', flies: true },
  kocicka: { name: 'kočička', move: 'skace' },
};

export interface FamilyInfo {
  name: string;
  scale: number;
  aspect: number;
  tint: string;
  glasses?: boolean;
  scarf?: string;
  beard?: boolean;
  rainbow?: boolean;
  bow?: string;
  translucent?: boolean;
}

export const FAMILY: Record<FamilyId, FamilyInfo> = {
  'babicka-perinka': { name: 'babička Peřinka', scale: 1.25, aspect: 1.9, tint: '#FFFDF8', glasses: true, scarf: '#EC8FBB' },
  mlhulka: { name: 'sestřička Mlhulka', scale: 0.95, aspect: 2.1, tint: '#EEF3FA', translucent: true },
  duhacek: { name: 'bráška Duháček', scale: 0.7, aspect: 1.2, tint: '#FFFFFF', rainbow: true },
  'deda-vlocka': { name: 'děda Vločka', scale: 1.3, aspect: 1.3, tint: '#F4F8FF', beard: true },
  'mama-bublinka': { name: 'máma Bublinka', scale: 1.15, aspect: 1.5, tint: '#FFFFFF', bow: '#BD8EFA' },
  'tata-brucik': { name: 'táta Bručík', scale: 1.35, aspect: 1.6, tint: '#E9EEF7', scarf: '#3BAEFD' },
};

export const FAMILY_ORDER: FamilyId[] = ['babicka-perinka', 'mlhulka', 'duhacek', 'deda-vlocka', 'mama-bublinka', 'tata-brucik'];

export const TONE_COUNT = 9;
