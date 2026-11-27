import { GROUND_Y, SEED_DROP_TIME, SLOT_REACH } from '../constants';
import type { GameState, Point } from '../types';
import { burst, haptic, setMood, sfx } from './effects';
import { overSource } from './kapka';

export function slotUnder(state: GameState, x: number) {
  if (!state.pouch.length) return null;
  let best: number | null = null;
  for (const slot of state.slots) if (Math.abs(slot - x) < SLOT_REACH && (best === null || Math.abs(slot - x) < Math.abs(best - x))) best = slot;
  return best;
}

export function plantSeed(state: GameState, slot: number) {
  const kind = state.pouch.shift();
  if (!kind) return;
  state.slots = state.slots.filter((s) => s !== slot);
  const id = state.plants.reduce((m, p) => Math.max(m, p.id), 0) + 1;
  state.plants.push({ id, kind, x: slot, y: GROUND_Y, stage: 0, growth: 0, pop: 1, watered: 0, wave: 0 });
  state.planting = 0;
  state.events.push({ type: 'planted', kind, x: slot });
  sfx(state, 'pop');
  haptic(state, 'lehka');
  setMood(state, 'radost', 0.8);
  burst(state, 'hlina', slot, GROUND_Y - 10, 9, 150, 10);
  burst(state, 'jiskra', slot, GROUND_Y - 60, 6, 120, 8);
}

export function tapSlot(state: GameState, tap: Point) {
  if (state.mode !== 'zahradka' || Math.abs(tap.y - GROUND_Y) > 120) return false;
  const slot = slotUnder(state, tap.x);
  if (slot === null) return false;
  plantSeed(state, slot);
  return true;
}

export function updateGarden(state: GameState, dt: number) {
  if (state.mode !== 'zahradka' || !state.pouch.length || state.kapka.asleep) {
    state.planting = 0;
    return;
  }
  const slot = overSource(state) || state.idle > 0.3 ? null : slotUnder(state, state.kapka.x);
  if (slot === null) {
    state.planting = 0;
    return;
  }
  state.planting += dt;
  if (state.planting >= SEED_DROP_TIME) plantSeed(state, slot);
}
