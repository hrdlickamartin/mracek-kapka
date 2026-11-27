import { ANIMALS, animalMove } from '../catalog';
import { GROUND_Y, GROW_TIME, SCENE_W, WONDER_GROW, WONDER_ZONE } from '../constants';
import type { GameState, Wonder } from '../types';
import { burst, haptic, setMood, sfx, spawn } from './effects';
import { grow } from './growth';
import { addVisitor } from './visitors';

export function wonderUnder(state: GameState): Wonder | null {
  const w = state.wonder;
  if (!w || w.stage >= 3 || state.phase !== 'hraje') return null;
  return Math.abs(w.x - state.kapka.x) < WONDER_ZONE ? w : null;
}

function finish(state: GameState, w: Wonder) {
  w.done = 0.001;
  sfx(state, 'objev');
  haptic(state, 'stredni');
  setMood(state, 'uzas', 1.2);
  burst(state, 'jiskra', w.x, GROUND_Y - 170, 12, 240, 11);
  if (!state.found.animals.includes(w.animal)) state.found.animals.push(w.animal);
  const side = w.x < SCENE_W / 2 ? 1 : -1;
  const spot = wonderSeat(w);
  const move = animalMove(ANIMALS[w.animal]);
  const from = move === 'leti' ? undefined : move === 'vyleze' ? { x: spot.x, y: spot.y + 70 } : { x: w.x, y: GROUND_Y - 10 };
  addVisitor(state, w.animal, { x: spot.x + (w.kind === 'mlyn' ? side * 20 : 0), y: spot.y }, false, from);
  if (w.kind === 'mlyn') {
    const thirsty = state.plants.filter((p) => p.stage < 3);
    if (thirsty.length) {
      const plant = thirsty.reduce((a, b) => (Math.abs(a.x - w.x) < Math.abs(b.x - w.x) ? a : b));
      grow(state, plant, GROW_TIME);
      const dir = Math.sign(plant.x - w.x) || 1;
      for (let i = 0; i < 10; i++) spawn(state, 'vlnka', w.x + dir * i * 18, GROUND_Y - 20, dir * 380, -160 - i * 12, 0.9, 11);
    }
  }
}

export function wonderSeat(w: Wonder) {
  switch (w.kind) {
    case 'hrad':
      return { x: w.x, y: GROUND_Y - 150 };
    case 'iglu':
      return { x: w.x + 10, y: GROUND_Y + 20 };
    case 'kaluz':
      return { x: w.x + 20, y: GROUND_Y + 15 };
    case 'obri-kvet':
      return { x: w.x + 60, y: GROUND_Y - 200 };
    case 'jablon':
      return { x: w.x + 85, y: GROUND_Y + 15 };
    default:
      return { x: w.x + 80, y: GROUND_Y + 10 };
  }
}

export function rainOnWonder(state: GameState, dt: number) {
  const w = wonderUnder(state);
  if (!w) return;
  w.wet = 0.4;
  w.growth += dt / WONDER_GROW;
  if (w.growth < 1) return;
  w.growth = 0;
  w.stage = Math.min(3, w.stage + 1) as Wonder['stage'];
  w.pop = 1;
  burst(state, 'jiskra', w.x, GROUND_Y - 60 - w.stage * 40, 6, 160, 9);
  if (w.stage === 3) finish(state, w);
  else {
    sfx(state, 'pop');
    haptic(state, 'lehka');
  }
}

export function updateWonder(state: GameState, dt: number) {
  const w = state.wonder;
  if (!w) return;
  w.pop = Math.max(0, w.pop - dt * 1.8);
  w.wet = Math.max(0, w.wet - dt);
  if (w.done > 0) w.done += dt;
}
