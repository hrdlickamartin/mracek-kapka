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
};

export interface AnimalInfo {
  name: string;
  flies?: boolean;
  glow?: boolean;
}

export const ANIMALS: Record<AnimalKind, AnimalInfo> = {
  motyl: { name: 'motýl', flies: true },
  beruska: { name: 'beruška' },
  vcelka: { name: 'včelka', flies: true },
  cvrcek: { name: 'cvrček' },
  sykorka: { name: 'sýkorka', flies: true },
  zajicek: { name: 'zajíček' },
  vrabec: { name: 'vrabec', flies: true },
  snek: { name: 'šnek' },
  zizala: { name: 'žížala' },
  jezek: { name: 'ježek' },
  veverka: { name: 'veverka' },
  sova: { name: 'sova', flies: true },
  srnka: { name: 'srnka' },
  jesterka: { name: 'ještěrka' },
  velbloudik: { name: 'velbloudík' },
  zelvicka: { name: 'želvička' },
  kamzik: { name: 'kamzík' },
  svist: { name: 'svišť' },
  orlik: { name: 'orlík', flies: true },
  kachnicka: { name: 'kachnička' },
  vazka: { name: 'vážka', flies: true },
  rybka: { name: 'rybka' },
  krab: { name: 'krab' },
  racek: { name: 'racek', flies: true },
  'morska-zelvicka': { name: 'mořská želvička' },
  svetluska: { name: 'světluška', flies: true, glow: true },
  mura: { name: 'můra', flies: true },
  plch: { name: 'plch' },
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
