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

export type AnimalShape = 'motyl' | 'brouk' | 'vcela' | 'cvrcek' | 'ptak' | 'savec' | 'snek' | 'zizala' | 'jesterka' | 'zelva' | 'krab' | 'rybka';

export interface AnimalInfo {
  name: string;
  shape: AnimalShape;
  body: string;
  accent: string;
  ears?: 'dlouhe' | 'kulate' | 'spicate' | 'rohy' | 'bodliny' | 'parozi' | 'chomacky';
  tail?: 'chlupaty' | 'kratky' | 'zadny';
  flies?: boolean;
  glow?: boolean;
}

export const ANIMALS: Record<AnimalKind, AnimalInfo> = {
  motyl: { name: 'motýl', shape: 'motyl', body: '#5B3A1E', accent: '#F9BA0A', flies: true },
  beruska: { name: 'beruška', shape: 'brouk', body: '#E5322A', accent: '#23395B' },
  vcelka: { name: 'včelka', shape: 'vcela', body: '#FBCC03', accent: '#3A2A1A', flies: true },
  cvrcek: { name: 'cvrček', shape: 'cvrcek', body: '#6B8E23', accent: '#3E5A12' },
  sykorka: { name: 'sýkorka', shape: 'ptak', body: '#F9D648', accent: '#3B7FD0', flies: true },
  zajicek: { name: 'zajíček', shape: 'savec', body: '#D88E66', accent: '#FBECDB', ears: 'dlouhe', tail: 'kratky' },
  vrabec: { name: 'vrabec', shape: 'ptak', body: '#A9744A', accent: '#E8D4B8', flies: true },
  snek: { name: 'šnek', shape: 'snek', body: '#E9C89A', accent: '#C07A3A' },
  zizala: { name: 'žížala', shape: 'zizala', body: '#E79A8E', accent: '#D27B6E' },
  jezek: { name: 'ježek', shape: 'savec', body: '#FAC995', accent: '#84401A', ears: 'bodliny', tail: 'zadny' },
  veverka: { name: 'veverka', shape: 'savec', body: '#D2691E', accent: '#F8E3C8', ears: 'chomacky', tail: 'chlupaty' },
  sova: { name: 'sova', shape: 'ptak', body: '#9C7A55', accent: '#F3E2C4', ears: 'chomacky', flies: true },
  srnka: { name: 'srnka', shape: 'savec', body: '#C68A52', accent: '#F6E2C8', ears: 'spicate', tail: 'kratky' },
  jesterka: { name: 'ještěrka', shape: 'jesterka', body: '#8BC34A', accent: '#F9BA0A' },
  velbloudik: { name: 'velbloudík', shape: 'savec', body: '#E2B77A', accent: '#F6E2C8', ears: 'kulate', tail: 'kratky' },
  zelvicka: { name: 'želvička', shape: 'zelva', body: '#9CCB5A', accent: '#A0642E' },
  kamzik: { name: 'kamzík', shape: 'savec', body: '#8A5A3A', accent: '#F3E2C4', ears: 'rohy', tail: 'kratky' },
  svist: { name: 'svišť', shape: 'savec', body: '#B08458', accent: '#EAD3B2', ears: 'kulate', tail: 'kratky' },
  orlik: { name: 'orlík', shape: 'ptak', body: '#7A5233', accent: '#FFF4E0', flies: true },
  kachnicka: { name: 'kachnička', shape: 'ptak', body: '#FDE26B', accent: '#F39B05' },
  vazka: { name: 'vážka', shape: 'motyl', body: '#3BAEFD', accent: '#BDE9FF', flies: true },
  rybka: { name: 'rybka', shape: 'rybka', body: '#F39B05', accent: '#FFE1A8' },
  krab: { name: 'krab', shape: 'krab', body: '#F0603A', accent: '#FFD2B8' },
  racek: { name: 'racek', shape: 'ptak', body: '#F4F6FA', accent: '#F9BA0A', flies: true },
  'morska-zelvicka': { name: 'mořská želvička', shape: 'zelva', body: '#5FC3B0', accent: '#2E7D6E' },
  svetluska: { name: 'světluška', shape: 'vcela', body: '#C8E86A', accent: '#3A3A2A', flies: true, glow: true },
  mura: { name: 'můra', shape: 'motyl', body: '#B9A3D9', accent: '#EDE2FF', flies: true },
  plch: { name: 'plch', shape: 'savec', body: '#A7A3A0', accent: '#EFEAE4', ears: 'kulate', tail: 'chlupaty' },
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
