import assert from 'node:assert/strict';
import { test } from 'node:test';
import { KAPKA_FINGER_OFFSET, SCENE_W } from '../src/game/constants';
import { createGame, step } from '../src/game/engine';
import { addVisitor } from '../src/game/systems/visitors';
import { GARDEN_SCENE, sceneById, scenesOf, WORLDS } from '../src/game/worlds';
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

test('slunce Kapáčka vysuší, ale nikdy nezmizí', () => {
  const state = createGame(sceneById('poust-1'));
  state.kapka.water = 1;
  play(state, 60, () => ({ pointer: { x: 800, y: 200 }, tap: null }));
  assert.ok(state.kapka.water >= 0);
  assert.ok(state.kapka.water < 0.5);
  assert.equal(state.kapka.mood === 'vysusena' || state.kapka.mood === 'prazdna', true);
});

test('poryv větru posune Kapáčka nejvýš o 10 % šířky', () => {
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

test('nápověda přichází postupně a po 30 s Kapáček usne a dotek ho probudí', () => {
  const state = createGame(sceneById('louka-2'));
  const events = play(state, 31, idle);
  assert.ok(events.some((e) => e.type === 'sfx' && e.name === 'napoveda'));
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

test('cíl vždy ukazuje, co má Kapáček právě udělat', () => {
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

test('při nasávání cíl zůstane u vody, dokud není Kapáček plný', () => {
  const state = createGame(sceneById('louka-2'));
  for (let t = 0; t < 1.2; t += DT) step(state, { pointer: { x: state.source.x, y: 430 }, tap: null }, DT);
  assert.ok(state.kapka.sipping || state.kapka.water >= 1);
  if (state.kapka.water < 1) assert.equal(state.goal?.kind, 'voda');
});

test('v zahrádce po rozkvetu všech kytiček přijde slavnost, ale postup se neukládá', () => {
  const garden = [
    { kind: 'kopretina' as const, x: 650, stage: 0 as const },
    { kind: 'mak' as const, x: 950, stage: 2 as const },
  ];
  const state = createGame(GARDEN_SCENE, { mode: 'zahradka', garden, guest: 'jezek' });
  const events = play(state, 240, (s) => (s.phase === 'hraje' ? botInput(s) : idle()));
  play(state, 6, idle);
  assert.ok(events.some((e) => e.type === 'celebrate'));
  assert.ok(!events.some((e) => e.type === 'complete'));
  assert.equal(state.phase, 'hotovo');
  assert.ok(state.visitors.some((v) => v.celebrant && v.animal === 'jezek'));
});

test('úplně rozkvetlá zahrádka začne při dalším příchodu znovu od semínek', () => {
  const garden = [
    { kind: 'kopretina' as const, x: 650, stage: 3 as const },
    { kind: 'mak' as const, x: 950, stage: 3 as const },
  ];
  const state = createGame(GARDEN_SCENE, { mode: 'zahradka', garden });
  assert.ok(state.plants.every((p) => p.stage === 0));
  const partial = createGame(GARDEN_SCENE, { mode: 'zahradka', garden: [{ ...garden[0] }, { ...garden[1], stage: 1 as const }] });
  assert.deepEqual(partial.plants.map((p) => p.stage), [3, 1]);
});

function hover(x: number): (s: GameState) => Input {
  return () => ({ pointer: { x, y: 320 + KAPKA_FINGER_OFFSET }, tap: null });
}

test('každý svět má scénu s vodou uprostřed a kouzelná věc stojí stranou od rostlin i vody', () => {
  for (const world of WORLDS) {
    const scenes = scenesOf(world);
    assert.ok(scenes.some((s) => s.source.x === SCENE_W / 2), `${world.id} nemá vodu uprostřed`);
    assert.equal(new Set(scenes.map((s) => s.backdrop)).size, 3, `${world.id} nestřídá pozadí`);
    for (const scene of scenes) {
      if (!scene.wonder) continue;
      for (const p of scene.plants) assert.ok(Math.abs(p.x - scene.wonder.x) >= 200, `${scene.id} kouzelná věc u rostliny`);
      assert.ok(Math.abs(scene.wonder.x - scene.source.x) > scene.source.w / 2 + 50 + 95, `${scene.id} kouzelná věc u vody`);
      for (const h of scene.hideouts) assert.ok(Math.abs(h.x - scene.wonder.x) > 180, `${scene.id} schovávačka u kouzelné věci`);
    }
    if (world.wonder) assert.ok(scenes.filter((s) => s.wonder).length >= 2, `${world.id} má málo kouzelných věcí`);
  }
});

test('déšť nad mlýnem ho roztočí, přivolá kachničku a potok zalije rostlinku', () => {
  const scene = scenesOf(WORLDS.find((w) => w.id === 'rybnicek')!).find((s) => s.wonder)!;
  const state = createGame(scene);
  state.kapka.water = 1;
  state.kapka.x = scene.wonder!.x;
  const events = play(state, 5, hover(scene.wonder!.x));
  assert.equal(state.wonder!.stage, 3);
  assert.ok(state.found.animals.includes('kachnicka'));
  assert.ok(state.visitors.some((v) => v.animal === 'kachnicka'));
  assert.ok(state.plants.some((p) => p.stage >= 1), 'potok zalil rostlinku');
  assert.ok(events.some((e) => e.type === 'sfx' && e.name === 'objev'));
});

test('kouzelná věc je bonus: cíl dál vede jen k vodě a rostlinkám', () => {
  const scene = scenesOf(WORLDS.find((w) => w.id === 'morsky-breh')!).find((s) => s.wonder)!;
  const state = createGame(scene);
  for (let i = 0; i < 300; i++) {
    step(state, botInput(state), DT);
    if (state.goal) assert.ok(state.goal.kind === 'voda' || state.goal.kind === 'rostlina');
  }
});

test('v noci je šero, které s rozkvětem slábne, a za Kapáčkem letí světlušky', () => {
  const state = createGame(scenesOf(WORLDS.find((w) => w.id === 'nocni-zahrada')!)[0]);
  step(state, idle(), DT);
  const start = state.dark;
  assert.ok(start > 0.3);
  assert.ok(state.particles.some((p) => p.kind === 'svetluska'));
  for (const p of state.plants) p.stage = 2;
  step(state, idle(), DT);
  assert.ok(state.dark < start);
});

test('příliv mění šířku moře jen do 20 % a při nasávání se zastaví', () => {
  const scene = scenesOf(WORLDS.find((w) => w.id === 'morsky-breh')!)[0];
  const state = createGame(scene);
  const widths: number[] = [];
  for (let i = 0; i < 600; i++) {
    step(state, idle(), DT);
    widths.push(state.source.w);
  }
  assert.ok(Math.max(...widths) <= scene.source.w * 1.2 + 0.01 && Math.min(...widths) >= scene.source.w * 0.8 - 0.01);
  assert.ok(Math.max(...widths) - Math.min(...widths) > scene.source.w * 0.3);
  state.kapka.x = scene.source.x;
  play(state, 0.2, hover(scene.source.x));
  const held = state.source.w;
  play(state, 0.5, hover(scene.source.x));
  assert.ok(state.kapka.sipping || state.kapka.water >= 1);
  if (state.kapka.sipping) assert.equal(state.source.w, held);
});

test('zvířátko ze schovávačky si přeje kytičku a po jejím rozkvětu k ní přiběhne', () => {
  const scene = sceneById('louka-3');
  const state = createGame(scene);
  const hideout = state.hideouts.find((h) => h.reward.type === 'animal')!;
  step(state, { pointer: null, tap: { x: hideout.x, y: hideout.y } }, DT);
  const v = state.visitors[0];
  assert.ok(v.wish !== null);
  play(state, 3, idle);
  const plant = state.plants.find((p) => p.id === v.wish)!;
  plant.stage = 3;
  step(state, idle(), DT);
  assert.equal(v.wish, null);
  assert.ok(v.happy > 0);
  assert.ok(Math.abs(v.tx - plant.x) < 100);
});

test('zvířátka přicházejí podle druhu: žížala ze země, rybka z vody', () => {
  const state = createGame(sceneById('louka-1'));
  const worm = addVisitor(state, 'zizala', { x: 900, y: 820 }, false);
  assert.equal(worm.fromX, 900);
  assert.ok(worm.fromY > 820);
  const fish = addVisitor(state, 'rybka', { x: 900, y: 820 }, false);
  assert.equal(fish.fromX, state.source.x);
});

test('v zahrádce Kapáček zasadí semínko z pytlíčku na volné místo a cíl ho tam vede', () => {
  const state = createGame(GARDEN_SCENE, { mode: 'zahradka', garden: [{ kind: 'mak', x: 500, stage: 3 }], pouch: ['jahoda'] });
  step(state, idle(), DT);
  assert.equal(state.goal?.kind, 'seminko');
  const slot = state.goal!.x;
  state.kapka.x = slot;
  const events = play(state, 2, hover(slot));
  assert.ok(events.some((e) => e.type === 'planted' && e.kind === 'jahoda' && e.x === slot));
  assert.equal(state.pouch.length, 0);
  assert.ok(state.plants.some((p) => p.kind === 'jahoda' && p.x === slot));
  assert.notEqual(state.goal?.kind, 'seminko');
});

test('ťuknutí na volné místo v zahrádce zasadí semínko a slavnost počká, dokud se nezasadí', () => {
  const state = createGame(GARDEN_SCENE, { mode: 'zahradka', garden: [{ kind: 'mak', x: 500, stage: 3 }], pouch: ['jahoda'] });
  play(state, 1, idle);
  assert.equal(state.phase, 'hraje');
  assert.equal(state.pouch.length, 1, 'bez doteku se nic nezasadí');
  state.kapka.x = state.slots[0];
  play(state, 2, idle);
  assert.equal(state.pouch.length, 1, 'ani když Kapáček stojí nad hlínou');
  const slot = state.slots[0];
  step(state, { pointer: null, tap: { x: slot, y: 800 } }, DT);
  assert.equal(state.pouch.length, 0);
});

test('v zimě v zahrádce Kapáček sněží a host si sedne na své místo', () => {
  const state = createGame(GARDEN_SCENE, { mode: 'zahradka', garden: [{ kind: 'mak', x: 650, stage: 3 }, { kind: 'jahoda', x: 950, stage: 0 }], season: 'zima', guest: 'motyl' });
  assert.ok(state.mechanics.includes('snih'));
  assert.equal(state.season, 'zima');
  const guest = state.visitors[0];
  assert.equal(guest.x, 650);
  assert.ok(guest.y < 700, 'motýl sedí na květu');
  const scene = createGame(sceneById('louka-1'), { season: 'zima' });
  assert.equal(scene.season, null);
});
