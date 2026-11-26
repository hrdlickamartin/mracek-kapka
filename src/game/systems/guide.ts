import { FAMILY } from '../catalog';
import { CELEBRATION_TIME, GROUND_Y, HINT_TIMES, SCENE_W } from '../constants';
import type { GameState, Point } from '../types';
import { burst, haptic, say, setMood, sfx } from './effects';
import { addVisitor } from './world';

function hintGoal(state: GameState): { point: Point; kind: 'voda' | 'rostlina' } | null {
  const thirsty = state.plants.filter((p) => p.stage < 3);
  if (state.kapka.water < 0.2 || (state.kapka.sipping && state.kapka.water < 1)) return { point: { x: state.source.x, y: GROUND_Y - 40 }, kind: 'voda' };
  if (!thirsty.length) return null;
  const nearest = thirsty.reduce((a, b) => (Math.abs(a.x - state.kapka.x) < Math.abs(b.x - state.kapka.x) ? a : b));
  return { point: { x: nearest.x, y: GROUND_Y - 60 }, kind: 'rostlina' };
}

export function wake(state: GameState) {
  if (!state.kapka.asleep) return;
  state.kapka.asleep = false;
  setMood(state, 'mrk', 0.6);
  state.events.push({ type: 'wake' });
  sfx(state, 'juuu');
}

export function updateHints(state: GameState, active: boolean, dt: number) {
  if (active) {
    state.idle = 0;
    state.hint = 0;
    wake(state);
  } else {
    state.idle += dt;
  }
  const goal = hintGoal(state);
  const k = state.kapka;
  state.goal =
    goal && state.phase === 'hraje' && !k.asleep
      ? { kind: goal.kind, x: goal.point.x, y: goal.point.y, busy: goal.kind === 'voda' ? k.sipping : k.raining }
      : null;
  if (state.tutorial !== null && state.phase !== 'hraje') state.tutorial = null;
  if (state.tutorial !== null) {
    updateTutorial(state, goal);
    return;
  }
  let level = 0;
  for (const t of HINT_TIMES) if (state.idle >= t) level++;
  if (state.phase !== 'hraje' && level < 4) level = 0;
  if (level > state.hint) {
    state.hint = level;
    if (level === 1 && goal?.kind === 'rostlina') {
      const plant = state.plants.find((p) => p.stage < 3 && Math.abs(p.x - goal.point.x) < 1);
      if (plant) plant.wave = 1.2;
    }
    if (level === 2 && goal) say(state, goal.kind === 'voda' ? 'let-k-vode' : 'zizen');
    if (level === 4) {
      state.kapka.asleep = true;
      sfx(state, 'zivani');
      state.events.push({ type: 'sleep' });
    }
  }
  state.hintTarget = state.hint === 3 && goal ? goal.point : null;
}

function updateTutorial(state: GameState, goal: ReturnType<typeof hintGoal>) {
  const step = state.tutorial ?? 0;
  if (step === 0) {
    if (state.time > 0.6) {
      say(state, 'pozdrav', undefined, true);
      setMood(state, 'mavani', 1.4);
      state.tutorial = 1;
    }
    state.hintTarget = null;
    return;
  }
  if (step === 1) {
    if (state.time > 3 && !state.said['let-k-vode']) say(state, 'let-k-vode', undefined, true);
    state.hintTarget = state.time > 3 ? { x: state.source.x, y: GROUND_Y - 40 } : null;
    if (state.kapka.water >= 0.9) {
      state.tutorial = 2;
      say(state, 'zizen', undefined, true);
    }
    return;
  }
  const first = state.plants.find((p) => p.stage < 3);
  state.hintTarget = goal && first ? (state.kapka.water < 0.2 ? goal.point : { x: first.x, y: GROUND_Y - 60 }) : null;
  if (state.plants.some((p) => p.stage >= 1)) {
    state.tutorial = null;
    state.hintTarget = null;
  }
}

function gardenParty(state: GameState) {
  state.phase = 'slavnost';
  state.phaseTime = 0;
  state.hintTarget = null;
  const spot = { x: SCENE_W / 2 + 120, y: GROUND_Y + 70 };
  const guest = state.visitors[0];
  if (guest) {
    guest.celebrant = true;
    guest.tx = spot.x;
    guest.ty = spot.y;
    guest.arrive = 0;
  } else {
    addVisitor(state, state.scene.visitor, spot, true);
  }
  state.events.push({ type: 'celebrate', animal: guest ? guest.animal : state.scene.visitor, family: null });
  sfx(state, 'slavnost');
  haptic(state, 'stredni');
  setMood(state, 'radost', CELEBRATION_TIME);
  for (const p of state.plants) burst(state, 'jiskra', p.x, GROUND_Y - 160, 8, 240, 10);
  say(state, 'slavnost', undefined, true);
}

export function updateCelebration(state: GameState, dt: number) {
  state.phaseTime += dt;
  if (state.phase === 'hraje') {
    if (!state.plants.length || state.plants.some((p) => p.stage < 3)) return;
    if (state.mode === 'zahradka') {
      gardenParty(state);
      return;
    }
    state.phase = 'slavnost';
    state.phaseTime = 0;
    state.hintTarget = null;
    const spot = { x: SCENE_W / 2 + (state.source.x < SCENE_W / 2 ? 120 : -120), y: GROUND_Y + 70 };
    addVisitor(state, state.scene.visitor, spot, true);
    state.events.push({ type: 'celebrate', animal: state.scene.visitor, family: state.scene.family });
    sfx(state, 'slavnost');
    haptic(state, 'stredni');
    setMood(state, 'radost', CELEBRATION_TIME);
    for (const p of state.plants) burst(state, 'jiskra', p.x, GROUND_Y - 160, 8, 240, 10);
    say(state, state.scene.family ? 'rodina' : 'slavnost', state.scene.family ? FAMILY[state.scene.family].name : undefined, true);
    const animals = [state.scene.visitor, ...state.found.animals].filter((a, i, all) => all.indexOf(a) === i);
    state.events.push({
      type: 'complete',
      result: { sceneId: state.scene.id, world: state.scene.world, animals, seeds: [...state.found.seeds], rainbow: state.rainbowFound },
    });
    return;
  }
  if (state.phase === 'slavnost' && state.phaseTime >= CELEBRATION_TIME) state.phase = 'hotovo';
}
