import { NIGHT_DARK, TIDE_AMP, TIDE_PERIOD } from '../constants';
import type { GameState } from '../types';
import { spawn } from './effects';

const FIREFLIES = 7;

export function updateNight(state: GameState) {
  if (!state.mechanics.includes('noc')) {
    state.dark = 0;
    return;
  }
  state.dark = NIGHT_DARK * (1 - 0.6 * state.bloom);
  const k = state.kapka;
  let count = 0;
  for (const p of state.particles) if (p.kind === 'svetluska') count++;
  for (let i = count; i < FIREFLIES; i++) {
    const a = state.time * 1.7 + i * 0.9;
    spawn(state, 'svetluska', k.x + Math.cos(a) * 160, k.y + Math.sin(a) * 90, 0, 0, 5 + (i % 3), 7 + (i % 3) * 2, i);
  }
}

export function updateTide(state: GameState, dt: number) {
  if (!state.mechanics.includes('priliv')) return;
  if (!state.kapka.sipping) state.tide += dt;
  const wave = Math.sin((state.tide / TIDE_PERIOD) * Math.PI * 2);
  state.source.w = state.source.base * (1 + TIDE_AMP * wave);
}
