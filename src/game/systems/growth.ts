import { PLANTS } from '../catalog';
import { GROUND_Y, GROW_TIME } from '../constants';
import type { GameState, Plant } from '../types';
import { burst, haptic, setMood, sfx } from './effects';

export function grow(state: GameState, plant: Plant, dt: number) {
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
