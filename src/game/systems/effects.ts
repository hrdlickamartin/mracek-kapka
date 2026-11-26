import { SAY_COOLDOWN } from '../constants';
import type { GameState, LineId, ParticleKind, SfxName } from '../types';

export function sfx(state: GameState, name: SfxName) {
  state.events.push({ type: 'sfx', name });
}

export function haptic(state: GameState, strength: 'lehka' | 'stredni') {
  state.events.push({ type: 'haptic', strength });
}

export function say(state: GameState, line: LineId, subject?: string, force = false) {
  const last = state.said[line];
  if (!force && last !== undefined && state.time - last < SAY_COOLDOWN) return false;
  state.said[line] = state.time;
  state.events.push({ type: 'say', line, subject });
  return true;
}

export function spawn(
  state: GameState,
  kind: ParticleKind,
  x: number,
  y: number,
  vx: number,
  vy: number,
  life: number,
  size: number,
  hue = 0,
) {
  if (state.particles.length > 140) return;
  state.particles.push({ kind, x, y, vx, vy, life, max: life, size, hue });
}

export function burst(state: GameState, kind: ParticleKind, x: number, y: number, count: number, speed: number, size: number, hue = 0) {
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + Math.random() * 0.5;
    const v = speed * (0.6 + Math.random() * 0.6);
    spawn(state, kind, x, y, Math.cos(angle) * v, Math.sin(angle) * v - speed * 0.4, 0.7 + Math.random() * 0.5, size, hue);
  }
}

export function setMood(state: GameState, mood: GameState['kapka']['mood'], hold: number) {
  state.kapka.mood = mood;
  state.kapka.moodHold = hold;
}
