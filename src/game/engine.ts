import { GROUND_Y, MAX_DT } from './constants';
import { moveKapka, resolveMood, updateWater } from './systems/kapka';
import { updateCelebration, updateHints } from './systems/guide';
import { addVisitor, handleInput, updateHideouts, updateParticles, updatePlants, updateVisitors, updateWeather } from './systems/world';
import type { AnimalKind, GameEvent, GameState, Input, Mode, Plant, PlantKind, SceneDef } from './types';

export interface GameOptions {
  mode?: Mode;
  tutorial?: boolean;
  garden?: { kind: PlantKind; x: number; stage: Plant['stage'] }[];
  guest?: AnimalKind | null;
}

export function createGame(scene: SceneDef, options: GameOptions = {}): GameState {
  const mode = options.mode ?? 'scena';
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
    source: { ...scene.source, ripple: 0 },
    hideouts: scene.hideouts.map((h, i) => ({ id: 100 + i, ...h, found: false, open: 0 })),
    visitors: [],
    particles: [],
    mechanics: scene.mechanics,
    sun: scene.mechanics.includes('slunce') ? 1 : 0,
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
    said: {},
    found: { animals: [], seeds: [] },
    bloom: 0,
    events: [],
    nextId: 1000,
  };
  if (options.guest) addVisitor(state, options.guest, { x: 1180, y: GROUND_Y - 10 }, false, { x: 1180, y: GROUND_Y - 10 });
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
  updateWater(state, d);
  updateHideouts(state, d);
  updatePlants(state, d);
  updateVisitors(state, d);
  updateCelebration(state, d);
  updateParticles(state, d);
  resolveMood(state);
  return state.events;
}

export function gardenSnapshot(state: GameState) {
  return state.plants.map((p) => ({ kind: p.kind, x: p.x, stage: p.stage }));
}
