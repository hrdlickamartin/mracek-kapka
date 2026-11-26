import assert from 'node:assert/strict';
import { test } from 'node:test';
import { KAPKA_FINGER_OFFSET, SCENE_W } from '../src/game/constants';
import { createGame, step } from '../src/game/engine';
import { sceneById, scenesOf, WORLDS } from '../src/game/worlds';
import type { GameEvent, GameState, Input } from '../src/game/types';

const DT = 1 / 30;

function botInput(state: GameState): Input {
  const k = state.kapka;
  const thirsty = state.plants.filter((p) => p.stage < 3);
  const needWater = k.water < 0.05 || (k.sipping && k.water < 1);
  const target = needWater || !thirsty.length ? state.source.x : thirsty.reduce((a, b) => (Math.abs(a.x - k.x) < Math.abs(b.x - k.x) ? a : b)).x;
  return { pointer: { x: target, y: 320 + KAPKA_FINGER_OFFSET }, tap: null };
}

function play(state: GameState, seconds: number, input: (s: GameState) => Input) {
  const events: GameEvent[] = [];
  for (let t = 0; t < seconds; t += DT) {
    events.push(...step(state, input(state), DT));
    if (events.some((e) => e.type === 'complete')) break;
  }
  return events;
}

const idle = (): Input => ({ pointer: null, tap: null });

test('bot dohraje každou scénu každého světa', () => {
  for (const world of WORLDS) {
    for (const scene of scenesOf(world)) {
      const state = createGame(scene, { tutorial: true });
      const events = play(state, 240, botInput);
      const done = events.find((e) => e.type === 'complete');
      assert.ok(done, `${scene.id} nejde dohrát`);
      assert.ok(state.time < 150, `${scene.id} trvá příliš dlouho (${state.time.toFixed(0)} s)`);
    }
  }
});

test('každá scéna má 3–5 rostlinek a rostliny se nepřekrývají se zdrojem vody', () => {
  for (const world of WORLDS) {
    for (const scene of scenesOf(world)) {
      assert.ok(scene.plants.length >= 3 && scene.plants.length <= 5, scene.id);
      for (const p of scene.plants) assert.ok(Math.abs(p.x - scene.source.x) > scene.source.w / 2 + 50 + 90, `${scene.id} rostlina u vody`);
      const xs = scene.plants.map((p) => p.x).sort((a, b) => a - b);
      for (let i = 1; i < xs.length; i++) assert.ok(xs[i] - xs[i - 1] >= 200, `${scene.id} rostliny moc blízko`);
      for (const x of [...xs, scene.source.x]) assert.ok(x >= SCENE_W * 0.08 + 60 && x <= SCENE_W * 0.92 - 60, `${scene.id} objekt u okraje`);
    }
  }
});

test('rostlinka roste ve čtyřech fázích a hlásí tóny', () => {
  const state = createGame(sceneById('louka-2'));
  const events = play(state, 240, botInput);
  const tones = events.filter((e) => e.type === 'tone');
  assert.equal(tones.length, state.plants.length * 3);
  assert.ok(state.plants.every((p) => p.stage === 3));
});

test('po slavnosti hra čeká a sama nepokračuje', () => {
  const state = createGame(sceneById('louka-1'));
  const events = play(state, 240, botInput);
  assert.equal(state.phase, 'slavnost');
  assert.ok(events.some((e) => e.type === 'complete'), 'postup se uloží hned na začátku slavnosti');
  play(state, 5, idle);
  assert.equal(state.phase, 'hotovo');
  const later = play(state, 30, idle);
  assert.equal(state.phase, 'hotovo');
  assert.ok(!later.some((e) => e.type === 'complete'));
});

test('slunce Kapku vysuší, ale nikdy nezmizí', () => {
  const state = createGame(sceneById('poust-1'));
  state.kapka.water = 1;
  play(state, 60, () => ({ pointer: { x: 800, y: 200 }, tap: null }));
  assert.ok(state.kapka.water >= 0);
  assert.ok(state.kapka.water < 0.5);
  assert.equal(state.kapka.mood === 'vysusena' || state.kapka.mood === 'prazdna', true);
});

test('poryv větru posune Kapku nejvýš o 10 % šířky', () => {
  const state = createGame(sceneById('hory-1'));
  state.kapka.x = 800;
  state.wind.next = 0.01;
  const start = state.kapka.x;
  let max = 0;
  for (let t = 0; t < 1.5; t += DT) {
    step(state, idle(), DT);
    max = Math.max(max, Math.abs(state.kapka.x - start));
  }
  assert.ok(max > 50, 'vítr nepůsobí');
  assert.ok(max <= SCENE_W * 0.1 + 1, `vítr posunul o ${max}`);
});

test('ťuknutí na schovávačku odhalí odměnu', () => {
  const state = createGame(sceneById('louka-3'));
  const h = state.hideouts[0];
  const events = step(state, { pointer: { x: h.x, y: h.y }, tap: { x: h.x, y: h.y } }, DT);
  assert.ok(events.some((e) => e.type === 'found'));
  assert.ok(h.found);
});

test('nápověda přichází postupně a po 30 s Kapka usne a dotek ji probudí', () => {
  const state = createGame(sceneById('louka-2'));
  const events = play(state, 31, idle);
  assert.ok(events.some((e) => e.type === 'say'));
  assert.ok(state.kapka.asleep);
  assert.ok(events.some((e) => e.type === 'sleep'));
  const woke = step(state, { pointer: { x: 800, y: 400 }, tap: null }, DT);
  assert.ok(woke.some((e) => e.type === 'wake'));
  assert.ok(!state.kapka.asleep);
});

test('výuka na první louce vede k vodě a pak k rostlince', () => {
  const state = createGame(sceneById('louka-1'), { tutorial: true });
  play(state, 4, idle);
  assert.equal(state.tutorial, 1);
  assert.ok(state.hintTarget && Math.abs(state.hintTarget.x - state.source.x) < 1);
  play(state, 240, botInput);
  assert.equal(state.tutorial, null);
});

test('v poušti vznikne duha při dešti na slunci', () => {
  const state = createGame(sceneById('poust-2'));
  const events = play(state, 240, botInput);
  assert.ok(events.some((e) => e.type === 'rainbow'));
  const done = events.find((e) => e.type === 'complete');
  assert.ok(done && done.type === 'complete' && done.result.rainbow);
});

test('cíl vždy ukazuje, co má Kapka právě udělat', () => {
  const state = createGame(sceneById('louka-2'));
  step(state, idle(), DT);
  assert.equal(state.goal?.kind, 'voda');
  assert.equal(state.goal?.x, state.source.x);
  state.kapka.water = 1;
  step(state, idle(), DT);
  assert.equal(state.goal?.kind, 'rostlina');
  assert.ok(state.plants.some((p) => p.x === state.goal?.x && p.stage < 3));
  const events = play(state, 240, botInput);
  assert.ok(events.some((e) => e.type === 'complete'));
  step(state, idle(), DT);
  assert.equal(state.goal, null);
});

test('při nasávání cíl zůstane u vody, dokud není Kapka plná', () => {
  const state = createGame(sceneById('louka-2'));
  for (let t = 0; t < 1.2; t += DT) step(state, { pointer: { x: state.source.x, y: 430 }, tap: null }, DT);
  assert.ok(state.kapka.sipping || state.kapka.water >= 1);
  if (state.kapka.water < 1) assert.equal(state.goal?.kind, 'voda');
});
