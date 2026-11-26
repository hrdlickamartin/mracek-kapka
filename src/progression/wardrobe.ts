export type WardrobeSlot = 'hlava' | 'oci' | 'krk' | 'tvare';

export type WardrobeId =
  | 'cepice-modra'
  | 'cepice-zluta'
  | 'cepice-ruzova'
  | 'cepice-zelena'
  | 'cepice-fialova'
  | 'cepice-oranzova'
  | 'bryle'
  | 'slunecni-bryle'
  | 'sala'
  | 'masle'
  | 'duhove-tvaricky'
  | 'korunka';

export interface WardrobeItem {
  id: WardrobeId;
  name: string;
  slot: WardrobeSlot;
  color: string;
  afterScenes: number;
}

export const WARDROBE: WardrobeItem[] = [
  { id: 'cepice-modra', name: 'modrá čepička', slot: 'hlava', color: '#3BAEFD', afterScenes: 1 },
  { id: 'masle', name: 'mašle', slot: 'krk', color: '#EC8FBB', afterScenes: 3 },
  { id: 'cepice-zluta', name: 'žlutá čepička', slot: 'hlava', color: '#F9BA0A', afterScenes: 5 },
  { id: 'bryle', name: 'brýle', slot: 'oci', color: '#23395B', afterScenes: 7 },
  { id: 'cepice-ruzova', name: 'růžová čepička', slot: 'hlava', color: '#EC8FBB', afterScenes: 9 },
  { id: 'sala', name: 'šála', slot: 'krk', color: '#ED3E1D', afterScenes: 11 },
  { id: 'cepice-zelena', name: 'zelená čepička', slot: 'hlava', color: '#A8C729', afterScenes: 13 },
  { id: 'slunecni-bryle', name: 'sluneční brýle', slot: 'oci', color: '#5A3A8A', afterScenes: 15 },
  { id: 'cepice-fialova', name: 'fialová čepička', slot: 'hlava', color: '#BD8EFA', afterScenes: 17 },
  { id: 'duhove-tvaricky', name: 'duhové tvářičky', slot: 'tvare', color: '#FCA19E', afterScenes: 19 },
  { id: 'cepice-oranzova', name: 'oranžová čepička', slot: 'hlava', color: '#F39B05', afterScenes: 21 },
  { id: 'korunka', name: 'korunka z kytiček', slot: 'hlava', color: '#FBCC03', afterScenes: 23 },
];

export function wardrobeItem(id: WardrobeId) {
  const item = WARDROBE.find((w) => w.id === id);
  if (!item) throw new Error(`Neznámý doplněk ${id}`);
  return item;
}
