export type Point = { x: number; y: number };

export type Mood =
  | 'zakladni'
  | 'radost'
  | 'mrk'
  | 'uzas'
  | 'let'
  | 'plny'
  | 'dest'
  | 'spanek'
  | 'prazdna'
  | 'vysusena'
  | 'nasavani'
  | 'mavani'
  | 'snezeni';

export type PlantKind =
  | 'kopretina'
  | 'mak'
  | 'pampeliska'
  | 'zvonek'
  | 'tulipan'
  | 'mrkev'
  | 'slunecnice'
  | 'jahoda'
  | 'houba'
  | 'kapradi'
  | 'boruvky'
  | 'kaktus'
  | 'palma'
  | 'horska-kvetinka'
  | 'mech'
  | 'leknin'
  | 'orobinec'
  | 'pobrezni-ruze'
  | 'morska-levandule'
  | 'mesicnice'
  | 'nocni-fialka'
  | 'orchidej'
  | 'heliconie'
  | 'jablicko'
  | 'tykev'
  | 'polarni-mak'
  | 'lomikamen'
  | 'muskat'
  | 'rajce';

export type AnimalKind =
  | 'motyl'
  | 'beruska'
  | 'vcelka'
  | 'cvrcek'
  | 'sykorka'
  | 'zajicek'
  | 'vrabec'
  | 'snek'
  | 'zizala'
  | 'jezek'
  | 'veverka'
  | 'sova'
  | 'srnka'
  | 'jesterka'
  | 'velbloudik'
  | 'zelvicka'
  | 'kamzik'
  | 'svist'
  | 'orlik'
  | 'kachnicka'
  | 'vazka'
  | 'rybka'
  | 'krab'
  | 'racek'
  | 'morska-zelvicka'
  | 'svetluska'
  | 'mura'
  | 'plch'
  | 'papousek'
  | 'tukan'
  | 'opicka'
  | 'lenochod'
  | 'krtek'
  | 'kos'
  | 'ovecka'
  | 'tucnak'
  | 'medvidek'
  | 'tulen'
  | 'liska'
  | 'holub'
  | 'kocicka';

export type WorldId =
  | 'louka'
  | 'zahradka'
  | 'les'
  | 'poust'
  | 'hory'
  | 'rybnicek'
  | 'morsky-breh'
  | 'nocni-zahrada'
  | 'dzungle'
  | 'sad'
  | 'arktida'
  | 'balkon';

export type FamilyId = 'babicka-perinka' | 'mlhulka' | 'duhacek' | 'deda-vlocka' | 'mama-bublinka' | 'tata-brucik';

export type SourceKind = 'jezirko' | 'potok' | 'sud' | 'oaza' | 'vodopad' | 'rybnik' | 'more' | 'rosa' | 'studna' | 'led';

export type HideoutKind = 'ker' | 'parez' | 'kamen' | 'krtina' | 'okno' | 'dutina' | 'muslicka' | 'leknin-list' | 'zavej' | 'kvetinac';

export type Reward =
  | { type: 'animal'; animal: AnimalKind }
  | { type: 'seed'; plant: PlantKind }
  | { type: 'motyli' };

export type Mechanic = 'slunce' | 'vitr' | 'snih' | 'noc' | 'priliv';

export type WonderKind = 'mlyn' | 'hrad' | 'houby' | 'snehulak' | 'obri-kvet' | 'jablon' | 'iglu' | 'kaluz';

export type Season = 'jaro' | 'leto' | 'podzim' | 'zima';

export interface SceneDef {
  id: string;
  world: WorldId;
  index: number;
  plants: { kind: PlantKind; x: number }[];
  source: { kind: SourceKind; x: number; w: number };
  hideouts: { kind: HideoutKind; x: number; y: number; reward: Reward }[];
  visitor: AnimalKind;
  mechanics: Mechanic[];
  family: FamilyId | null;
  tutorial: boolean;
  backdrop: number;
  wonder: { kind: WonderKind; x: number; animal: AnimalKind } | null;
}

export interface Wonder {
  kind: WonderKind;
  animal: AnimalKind;
  x: number;
  y: number;
  stage: 0 | 1 | 2 | 3;
  growth: number;
  pop: number;
  wet: number;
  done: number;
}

export interface Kapka {
  x: number;
  y: number;
  vx: number;
  vy: number;
  water: number;
  dryness: number;
  mood: Mood;
  moodHold: number;
  raining: boolean;
  sipping: boolean;
  showering: number;
  tilt: number;
  stretch: number;
  asleep: boolean;
  blink: number;
  wink: number;
}

export interface Plant {
  id: number;
  kind: PlantKind;
  x: number;
  y: number;
  stage: 0 | 1 | 2 | 3;
  growth: number;
  pop: number;
  watered: number;
  wave: number;
}

export interface Hideout {
  id: number;
  kind: HideoutKind;
  x: number;
  y: number;
  reward: Reward;
  found: boolean;
  open: number;
}

export interface Visitor {
  id: number;
  animal: AnimalKind;
  x: number;
  y: number;
  tx: number;
  ty: number;
  arrive: number;
  react: number;
  celebrant: boolean;
  fromX: number;
  fromY: number;
  wish: number | null;
  happy: number;
}

export type ParticleKind = 'kapka' | 'vlocka' | 'rozprsk' | 'jiskra' | 'pyl' | 'list' | 'vlnka' | 'vitr' | 'motyl' | 'svetluska' | 'hlina';

export interface Particle {
  kind: ParticleKind;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  size: number;
  hue: number;
}

export type SfxName =
  | 'blup'
  | 'hlt'
  | 'dest'
  | 'pop'
  | 'kvet'
  | 'jiskra'
  | 'vzum'
  | 'sustnuti'
  | 'vitr'
  | 'zivani'
  | 'hihi'
  | 'zvire'
  | 'cak'
  | 'juuu'
  | 'slavnost'
  | 'napoveda'
  | 'prazdno'
  | 'objev';

export type Phase = 'hraje' | 'slavnost' | 'hotovo';

export type GameEvent =
  | { type: 'sfx'; name: SfxName }
  | { type: 'tone'; plant: PlantKind; stage: number }
  | { type: 'haptic'; strength: 'lehka' | 'stredni' }
  | { type: 'bloom'; plant: number }
  | { type: 'planted'; kind: PlantKind; x: number }
  | { type: 'found'; reward: Reward }
  | { type: 'rainbow' }
  | { type: 'celebrate'; animal: AnimalKind; family: FamilyId | null }
  | { type: 'complete'; result: SceneResult }
  | { type: 'sleep' }
  | { type: 'wake' };

export interface SceneResult {
  sceneId: string;
  world: WorldId;
  animals: AnimalKind[];
  seeds: PlantKind[];
  rainbow: boolean;
}

export type Mode = 'scena' | 'zahradka';

export interface Goal {
  kind: 'voda' | 'rostlina' | 'seminko';
  x: number;
  y: number;
  busy: boolean;
}

export interface GameState {
  mode: Mode;
  scene: SceneDef;
  time: number;
  kapka: Kapka;
  plants: Plant[];
  source: { kind: SourceKind; x: number; w: number; base: number; ripple: number };
  wonder: Wonder | null;
  dark: number;
  tide: number;
  season: Season | null;
  pouch: PlantKind[];
  slots: number[];
  planting: number;
  hideouts: Hideout[];
  visitors: Visitor[];
  particles: Particle[];
  mechanics: Mechanic[];
  sun: number;
  wind: { next: number; gust: number; dir: number };
  rainbow: number;
  rainbowFound: boolean;
  phase: Phase;
  phaseTime: number;
  idle: number;
  hint: number;
  hintTarget: Point | null;
  goal: Goal | null;
  tutorial: number | null;
  cooldown: Partial<Record<SfxName, number>>;
  found: { animals: AnimalKind[]; seeds: PlantKind[] };
  bloom: number;
  events: GameEvent[];
  nextId: number;
}

export interface Input {
  pointer: Point | null;
  tap: Point | null;
}
