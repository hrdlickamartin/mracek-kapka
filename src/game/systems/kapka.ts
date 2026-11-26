import { PLANTS } from '../catalog';
import {
  GROUND_Y,
  GROW_TIME,
  JOY_SHOWER_TIME,
  JOY_SHOWER_USE,
  KAPKA_DAMPING,
  KAPKA_FINGER_OFFSET,
  KAPKA_MAX_X,
  KAPKA_MAX_Y,
  KAPKA_MIN_X,
  KAPKA_MIN_Y,
  KAPKA_SPRING,
  PLANT_ZONE,
  RAIN_USE,
  RAINBOW_TIME,
  SIP_RATE,
  SOURCE_REACH,
  SUN_DRY_RATE,
  WIND_GUST_SPEED,
} from '../constants';
import type { GameState, Input, Plant } from '../types';
import { burst, cue, haptic, setMood, sfx, spawn } from './effects';

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));

export function kapkaScale(water: number) {
  return 0.85 + 0.25 * water;
}

export function overSource(state: GameState) {
  const { source, kapka } = state;
  return Math.abs(kapka.x - source.x) < source.w / 2 + SOURCE_REACH;
}

export function plantUnder(state: GameState): Plant | null {
  let best: Plant | null = null;
  let bestDist = PLANT_ZONE;
  for (const plant of state.plants) {
    if (plant.stage >= 3) continue;
    const d = Math.abs(plant.x - state.kapka.x);
    if (d < bestDist) {
      best = plant;
      bestDist = d;
    }
  }
  return best;
}

export function moveKapka(state: GameState, input: Input, dt: number) {
  const k = state.kapka;
  if (input.pointer) {
    const tx = clamp(input.pointer.x, KAPKA_MIN_X, KAPKA_MAX_X);
    const ty = clamp(input.pointer.y - KAPKA_FINGER_OFFSET, KAPKA_MIN_Y, KAPKA_MAX_Y);
    k.vx += (KAPKA_SPRING * (tx - k.x) - KAPKA_DAMPING * k.vx) * dt;
    k.vy += (KAPKA_SPRING * (ty - k.y) - KAPKA_DAMPING * k.vy) * dt;
  } else {
    k.vx -= KAPKA_DAMPING * k.vx * dt;
    k.vy -= KAPKA_DAMPING * k.vy * dt;
  }
  if (state.wind.gust > 0) k.x += state.wind.dir * WIND_GUST_SPEED * dt;
  k.x += k.vx * dt;
  k.y += k.vy * dt;
  if (k.x < KAPKA_MIN_X || k.x > KAPKA_MAX_X) {
    k.x = clamp(k.x, KAPKA_MIN_X, KAPKA_MAX_X);
    if (Math.abs(k.vx) > 260) {
      sfx(state, 'hihi');
      setMood(state, 'radost', 0.5);
    }
    k.vx *= -0.35;
  }
  if (k.y < KAPKA_MIN_Y || k.y > KAPKA_MAX_Y) {
    k.y = clamp(k.y, KAPKA_MIN_Y, KAPKA_MAX_Y);
    k.vy *= -0.35;
  }
  const speed = Math.hypot(k.vx, k.vy);
  k.tilt = clamp(k.vx / 600, -1, 1) * 12;
  k.stretch = clamp(speed / 1500, 0, 0.08);
  k.blink -= dt;
  if (k.blink < -0.15) k.blink = 3 + Math.random() * 2;
  k.wink = Math.max(0, k.wink - dt);
  k.moodHold = Math.max(0, k.moodHold - dt);
}

function rainParticles(state: GameState, dt: number, width: number) {
  const k = state.kapka;
  const snow = state.mechanics.includes('snih');
  const rate = snow ? 18 : 28;
  const count = Math.floor(rate * dt + Math.random());
  const scale = kapkaScale(k.water);
  for (let i = 0; i < count; i++) {
    const x = k.x + (Math.random() - 0.5) * width * scale;
    const y = k.y + 50 * scale;
    if (snow) spawn(state, 'vlocka', x, y, (Math.random() - 0.5) * 30, 160 + Math.random() * 60, 3.2, 9 + Math.random() * 5);
    else spawn(state, 'kapka', x, y, 0, 520 + Math.random() * 120, 1.6, 10 + Math.random() * 6);
  }
}

function grow(state: GameState, plant: Plant, dt: number) {
  plant.watered = 0.4;
  plant.growth += dt / GROW_TIME;
  if (plant.growth < 1) return;
  plant.growth = 0;
  plant.stage = Math.min(3, plant.stage + 1) as Plant['stage'];
  plant.pop = 1;
  state.events.push({ type: 'tone', plant: plant.kind, stage: plant.stage });
  burst(state, 'list', plant.x, GROUND_Y - 40 - plant.stage * 25, 5, 160, 12);
  haptic(state, plant.stage === 3 ? 'stredni' : 'lehka');
  if (plant.stage === 3) {
    state.events.push({ type: 'bloom', plant: plant.id });
    sfx(state, 'kvet');
    burst(state, 'jiskra', plant.x, GROUND_Y - 150, 10, 220, 10);
    burst(state, 'pyl', plant.x, GROUND_Y - 150, 6, 90, 7, PLANTS[plant.kind].tone);
    setMood(state, 'radost', 0.9);
  } else {
    sfx(state, 'pop');
  }
}

export function updateWater(state: GameState, dt: number) {
  const k = state.kapka;
  k.sipping = false;
  k.raining = false;
  if (k.asleep) return;
  const sun = state.mechanics.includes('slunce');
  if (overSource(state)) {
    if (k.water < 1) {
      k.sipping = true;
      k.water = Math.min(1, k.water + SIP_RATE * dt);
      k.dryness = Math.max(0, k.dryness - dt * 1.5);
      state.source.ripple = 1;
      if (Math.random() < dt * 6) spawn(state, 'vlnka', state.source.x + (Math.random() - 0.5) * state.source.w * 0.6, GROUND_Y - 30, (k.x - state.source.x) * 0.6, -520, 0.7, 10);
      if (Math.random() < dt * 2.5) sfx(state, 'hlt');
      if (k.water >= 1) {
        setMood(state, 'plny', 0.6);
        sfx(state, 'juuu');
      }
    }
  } else {
    const plant = plantUnder(state);
    if (plant && k.water > 0.02) {
      k.raining = true;
      k.water = Math.max(0, k.water - RAIN_USE * dt);
      rainParticles(state, dt, 150);
      grow(state, plant, dt);
      if (sun) {
        state.rainbow += dt;
        if (state.rainbow >= RAINBOW_TIME && !state.rainbowFound) {
          state.rainbowFound = true;
          state.events.push({ type: 'rainbow' });
          sfx(state, 'jiskra');
          setMood(state, 'uzas', 1.2);
        }
      }
      if (k.water <= 0.02) cue(state, 'prazdno');
    }
    if (sun && k.water > 0) {
      k.water = Math.max(0, k.water - SUN_DRY_RATE * dt);
      k.dryness = Math.min(1, k.dryness + dt * 0.25);
    }
  }
  if (k.showering > 0) {
    k.showering = Math.max(0, k.showering - dt);
    if (k.water > 0.01) {
      k.water = Math.max(0, k.water - (JOY_SHOWER_USE / JOY_SHOWER_TIME) * dt);
      rainParticles(state, dt, 130);
    }
  }
}

export function joyShower(state: GameState) {
  const k = state.kapka;
  k.wink = 0.6;
  setMood(state, 'mrk', 0.6);
  sfx(state, 'hihi');
  if (k.water > 0.05) {
    k.showering = JOY_SHOWER_TIME;
    sfx(state, 'cak');
    burst(state, 'rozprsk', k.x, GROUND_Y - 10, 8, 140, 9);
  } else {
    burst(state, 'jiskra', k.x, k.y, 6, 120, 8);
  }
}

export function resolveMood(state: GameState) {
  const k = state.kapka;
  if (k.asleep) {
    k.mood = 'spanek';
    return;
  }
  if (k.moodHold > 0) return;
  const snow = state.mechanics.includes('snih');
  if (state.wind.gust > 0) k.mood = 'let';
  else if (k.raining || k.showering > 0) k.mood = snow ? 'snezeni' : 'dest';
  else if (k.sipping) k.mood = 'nasavani';
  else if (k.dryness > 0.5 && k.water < 0.3) k.mood = 'vysusena';
  else if (k.water < 0.08) k.mood = 'prazdna';
  else if (k.water >= 0.95) k.mood = 'plny';
  else if (Math.hypot(k.vx, k.vy) > 700) k.mood = 'let';
  else k.mood = 'zakladni';
}
