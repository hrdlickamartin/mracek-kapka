import { ANIMALS, animalMove } from '../catalog';
import { GROUND_Y, KAPKA_RADIUS, SCENE_W, WIND_GUST_TIME } from '../constants';
import type { AnimalKind, GameState, Hideout, Input, Point } from '../types';
import { joyShower, kapkaScale } from './kapka';
import { burst, haptic, setMood, sfx, spawn } from './effects';
import { tapSlot } from './garden';
import { addVisitor } from './visitors';

const HIDEOUT_REACH = 105;
const VISITOR_REACH = 90;
const ARRIVE_TIME = 1.3;

function arriveTime(animal: AnimalKind) {
  return animalMove(ANIMALS[animal]) === 'leze' ? ARRIVE_TIME * 1.8 : ARRIVE_TIME;
}

function nearestThirsty(state: GameState, x: number) {
  const thirsty = state.plants.filter((p) => p.stage < 3);
  if (!thirsty.length) return null;
  return thirsty.reduce((a, b) => (Math.abs(a.x - x) < Math.abs(b.x - x) ? a : b));
}

function reveal(state: GameState, hideout: Hideout) {
  if (hideout.found) return;
  hideout.found = true;
  hideout.open = 1;
  setMood(state, 'uzas', 1);
  sfx(state, 'sustnuti');
  sfx(state, 'objev');
  haptic(state, 'lehka');
  state.events.push({ type: 'found', reward: hideout.reward });
  const reward = hideout.reward;
  if (reward.type === 'animal') {
    state.found.animals.push(reward.animal);
    const v = addVisitor(state, reward.animal, { x: hideout.x + 60, y: hideout.y + 40 }, false, { x: hideout.x, y: hideout.y });
    v.wish = nearestThirsty(state, hideout.x)?.id ?? null;
  } else if (reward.type === 'seed') {
    state.found.seeds.push(reward.plant);
    burst(state, 'jiskra', hideout.x, hideout.y - 20, 8, 160, 9);
  } else {
    for (let i = 0; i < 6; i++) spawn(state, 'motyl', hideout.x, hideout.y - 20, (Math.random() - 0.5) * 220, -80 - Math.random() * 90, 3.5, 22, i);
  }
}

export function handleTap(state: GameState, tap: Point) {
  const k = state.kapka;
  for (const v of state.visitors) {
    if (v.arrive < 1) continue;
    if (Math.hypot(v.x - tap.x, v.y - 40 - tap.y) < VISITOR_REACH) {
      v.react = 1;
      sfx(state, 'zvire');
      haptic(state, 'lehka');
      return;
    }
  }
  if (Math.hypot(k.x - tap.x, k.y - tap.y) < KAPKA_RADIUS * kapkaScale(k.water)) {
    joyShower(state);
    const hideout = state.hideouts.find((h) => !h.found && Math.abs(h.x - k.x) < HIDEOUT_REACH);
    if (hideout && k.water > 0.05) reveal(state, hideout);
    return;
  }
  for (const h of state.hideouts) {
    if (!h.found && Math.hypot(h.x - tap.x, h.y - tap.y) < HIDEOUT_REACH) {
      reveal(state, h);
      return;
    }
  }
}

export function updateHideouts(state: GameState, dt: number) {
  const k = state.kapka;
  for (const h of state.hideouts) {
    h.open = Math.max(0, h.open - dt * 0.7);
    if (!h.found && k.showering > 0 && k.water > 0.01 && Math.abs(h.x - k.x) < HIDEOUT_REACH) reveal(state, h);
  }
}

export function updateVisitors(state: GameState, dt: number) {
  for (const v of state.visitors) {
    if (v.wish !== null && v.arrive >= 1) {
      const plant = state.plants.find((p) => p.id === v.wish);
      if (!plant) v.wish = null;
      else if (plant.stage >= 3) {
        v.wish = null;
        v.fromX = v.x;
        v.fromY = v.y;
        v.tx = plant.x + (plant.x < SCENE_W / 2 ? 70 : -70);
        v.ty = GROUND_Y + 25;
        v.arrive = 0;
        v.happy = 3;
        v.react = 1;
        sfx(state, 'zvire');
      }
    }
    v.happy = Math.max(0, v.happy - dt);
    if (v.arrive < 1) {
      v.arrive = Math.min(1, v.arrive + dt / arriveTime(v.animal));
      v.x += (v.tx - v.x) * Math.min(1, dt * 4.5);
      v.y += (v.ty - v.y) * Math.min(1, dt * 4.5);
      if (v.arrive >= 1) {
        v.x = v.tx;
        v.y = v.ty;
      }
    }
    v.react = Math.max(0, v.react - dt * 1.6);
  }
}

export function updateWeather(state: GameState, dt: number) {
  if (!state.mechanics.includes('vitr')) return;
  const w = state.wind;
  if (w.gust > 0) {
    w.gust = Math.max(0, w.gust - dt);
    if (Math.random() < dt * 14) spawn(state, 'vitr', w.dir > 0 ? 0 : SCENE_W, 150 + Math.random() * 450, w.dir * 900, 0, 1.6, 40);
    if (Math.random() < dt * 4) spawn(state, 'list', w.dir > 0 ? 60 : SCENE_W - 60, 300 + Math.random() * 300, w.dir * 500, -40, 2.6, 12);
    return;
  }
  if (state.kapka.asleep) return;
  w.next -= dt;
  if (w.next <= 0) {
    w.gust = WIND_GUST_TIME;
    w.dir = state.kapka.x > SCENE_W / 2 ? -1 : 1;
    w.next = 6 + Math.random() * 3;
    sfx(state, 'vitr');
  }
}

export function updatePlants(state: GameState, dt: number) {
  for (const p of state.plants) {
    p.pop = Math.max(0, p.pop - dt * 1.8);
    p.watered = Math.max(0, p.watered - dt);
    p.wave = Math.max(0, p.wave - dt);
  }
  state.source.ripple = Math.max(0, state.source.ripple - dt * 1.5);
  const total = state.plants.length * 3;
  const grown = state.plants.reduce((sum, p) => sum + p.stage, 0);
  state.bloom = total ? grown / total : 1;
  if (state.rainbowFound) state.rainbow = Math.min(state.rainbow + dt, 8);
}

export function updateParticles(state: GameState, dt: number) {
  const list = state.particles;
  for (let i = list.length - 1; i >= 0; i--) {
    const p = list[i];
    p.life -= dt;
    if (p.kind === 'kapka' || p.kind === 'vlocka') {
      if (p.y >= GROUND_Y - 20) {
        p.life = 0;
        if (p.kind === 'kapka' && Math.random() < 0.3) spawn(state, 'rozprsk', p.x, GROUND_Y - 20, (Math.random() - 0.5) * 120, -90, 0.35, 6);
      }
      if (p.kind === 'vlocka') p.vx += Math.sin((state.time + p.x) * 3) * 40 * dt;
    } else if (p.kind === 'rozprsk' || p.kind === 'list' || p.kind === 'jiskra') {
      p.vy += (p.kind === 'list' ? 160 : 420) * dt;
    } else if (p.kind === 'pyl') {
      p.vy -= 20 * dt;
    } else if (p.kind === 'motyl') {
      p.vx += Math.sin(state.time * 4 + p.hue) * 200 * dt;
    } else if (p.kind === 'vlnka') {
      p.vx *= 1 - dt * 2;
    } else if (p.kind === 'hlina') {
      p.vy += 520 * dt;
    } else if (p.kind === 'svetluska') {
      const k = state.kapka;
      const a = state.time * 1.3 + p.hue * 0.9;
      const tx = k.x + Math.cos(a) * (120 + (p.hue % 3) * 40);
      const ty = k.y + Math.sin(a * 1.4) * 80;
      p.vx += ((tx - p.x) * 3 - p.vx * 1.6) * dt;
      p.vy += ((ty - p.y) * 3 - p.vy * 1.6) * dt;
    }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    if (p.life <= 0) list.splice(i, 1);
  }
}

export function handleInput(state: GameState, input: Input) {
  if (!input.tap) return;
  if (tapSlot(state, input.tap)) return;
  handleTap(state, input.tap);
}
