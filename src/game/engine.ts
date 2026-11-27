import { ANIMALS, animalMove } from './catalog';
import { GROUND_Y, MAX_DT, SCENE_W } from './constants';
import { moveKapka, resolveMood, updateWater } from './systems/kapka';
import { updateGarden } from './systems/garden';
import { updateCelebration, updateHints } from './systems/guide';
import { updateNight, updateTide } from './systems/nature';
import { updateWonder } from './systems/wonders';
import { addVisitor } from './systems/visitors';
import { handleInput, updateHideouts, updateParticles, updatePlants, updateVisitors, updateWeather } from './systems/world';
import { GARDEN_SLOTS } from './worlds';
import type { AnimalKind, GameEvent, GameState, Input, Mechanic, Mode, Plant, PlantKind, Point, SceneDef, Season } from './types';

export interface GameOptions {
  mode?: Mode;
  tutorial?: boolean;
  garden?: { kind: PlantKind; x: number; stage: Plant['stage'] }[];
  guest?: AnimalKind | null;
  season?: Season | null;
  pouch?: PlantKind[];
}

function guestSpot(state: GameState, animal: AnimalKind): Point {
  const plants = [...state.plants].sort((a, b) => b.stage - a.stage || b.x - a.x);
  const host = plants[0];
  const move = animalMove(ANIMALS[animal]);
  if (move === 'plave') return { x: state.source.x + state.source.w / 2 + 40, y: GROUND_Y + 20 };
  if (!host) return { x: 1180, y: GROUND_Y - 10 };
  const side = host.x > SCENE_W - 300 ? -1 : 1;
  if (move === 'leti') return { x: host.x, y: host.stage >= 3 ? GROUND_Y - 175 : GROUND_Y - 40 - host.stage * 30 };
  if (move === 'vyleze') return { x: host.x + side * 45, y: GROUND_Y + 45 };
  return { x: host.x + side * 50, y: GROUND_Y + 50 };
}

export function createGame(scene: SceneDef, options: GameOptions = {}): GameState {
  const mode = options.mode ?? 'scena';
  const season = mode === 'zahradka' ? options.season ?? null : null;
  const mechanics: Mechanic[] = season === 'zima' ? [...scene.mechanics, 'snih'] : scene.mechanics;
  const garden = options.garden ?? [];
  const rested = garden.length > 0 && garden.every((p) => p.stage >= 3) ? garden.map((p) => ({ ...p, stage: 0 as const })) : garden;
  const plantDefs = mode === 'zahradka' ? rested : scene.plants.map((p) => ({ ...p, stage: 0 as const }));
  const state: GameState = {
    mode,
    scene,
    time: 0,
    kapka: {
      x: scene.source.x < 800 ? 560 : 1040,
      y: 360,
      vx: 0,
      vy: 0,
      water: 0,
      dryness: 0,
      mood: 'zakladni',
      moodHold: 0,
      raining: false,
      sipping: false,
      showering: 0,
      tilt: 0,
      stretch: 0,
      asleep: false,
      blink: 2,
      wink: 0,
    },
    plants: plantDefs.map((p, i) => ({ id: i + 1, kind: p.kind, x: p.x, y: GROUND_Y, stage: p.stage, growth: 0, pop: 0, watered: 0, wave: 0 })),
    source: { ...scene.source, base: scene.source.w, ripple: 0 },
    wonder: scene.wonder ? { kind: scene.wonder.kind, animal: scene.wonder.animal, x: scene.wonder.x, y: GROUND_Y, stage: 0, growth: 0, pop: 0, wet: 0, done: 0 } : null,
    dark: 0,
    tide: 0,
    season,
    pouch: mode === 'zahradka' ? [...(options.pouch ?? [])] : [],
    slots: [],
    planting: 0,
    hideouts: scene.hideouts.map((h, i) => ({ id: 100 + i, ...h, found: false, open: 0 })),
    visitors: [],
    particles: [],
    mechanics,
    sun: mechanics.includes('slunce') ? 1 : 0,
    wind: { next: 4, gust: 0, dir: 1 },
    rainbow: 0,
    rainbowFound: false,
    phase: 'hraje',
    phaseTime: 0,
    idle: 0,
    hint: 0,
    hintTarget: null,
    goal: null,
    tutorial: options.tutorial && scene.tutorial ? 0 : null,
    cooldown: {},
    found: { animals: [], seeds: [] },
    bloom: 0,
    events: [],
    nextId: 1000,
  };
  if (mode === 'zahradka') {
    state.slots = GARDEN_SLOTS.filter((x) => !state.plants.some((p) => Math.abs(p.x - x) < 1));
    state.pouch = state.pouch.slice(0, state.slots.length);
  }
  if (options.guest) {
    const spot = guestSpot(state, options.guest);
    addVisitor(state, options.guest, spot, false, spot);
  }
  return state;
}

export function step(state: GameState, input: Input, dt: number): GameEvent[] {
  const d = Math.min(dt, MAX_DT);
  state.events = [];
  state.time += d;
  handleInput(state, input);
  updateHints(state, !!input.pointer || !!input.tap, d);
  if (!state.kapka.asleep) moveKapka(state, input, d);
  updateWeather(state, d);
  updateTide(state, d);
  updateWater(state, d);
  updateGarden(state, d);
  updateWonder(state, d);
  updateHideouts(state, d);
  updatePlants(state, d);
  updateVisitors(state, d);
  updateNight(state);
  updateCelebration(state, d);
  updateParticles(state, d);
  resolveMood(state);
  return state.events;
}

export function gardenSnapshot(state: GameState) {
  return state.plants.map((p) => ({ kind: p.kind, x: p.x, stage: p.stage }));
}
