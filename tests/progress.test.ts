import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createGame, step } from '../src/game/engine';
import { KAPKA_FINGER_OFFSET } from '../src/game/constants';
import type { GameState, SceneResult } from '../src/game/types';
import { EXPANSION_WORLDS, MAIN_WORLDS, scenesOf } from '../src/game/worlds';
import {
  applyScene,
  campaignDone,
  familyFound,
  guestOfDay,
  nextScene,
  rainbowStripes,
  sceneUnlocked,
  toggleWear,
  worldUnlocked,
} from '../src/progression/progress';
import { DEFAULT_SAVE, migrateSave, type SaveData } from '../src/progression/saveData';
import { WARDROBE } from '../src/progression/wardrobe';
import { FAMILY_ORDER } from '../src/game/catalog';

function playScene(state: GameState): SceneResult {
  for (let t = 0; t < 300; t += 1 / 30) {
    const k = state.kapka;
    for (const h of state.hideouts) if (!h.found) step(state, { pointer: null, tap: { x: h.x, y: h.y } }, 1 / 30);
    const thirsty = state.plants.filter((p) => p.stage < 3);
    const need = k.water < 0.05 || (k.sipping && k.water < 1);
    const x = need || !thirsty.length ? state.source.x : thirsty[0].x;
    const events = step(state, { pointer: { x, y: 320 + KAPKA_FINGER_OFFSET }, tap: null }, 1 / 30);
    const done = events.find((e) => e.type === 'complete');
    if (done && done.type === 'complete') return done.result;
  }
  throw new Error(`${state.scene.id} nedohráno`);
}

function playCampaign() {
  let save: SaveData = DEFAULT_SAVE;
  const summaries = [];
  for (const world of MAIN_WORLDS) {
    for (const scene of scenesOf(world)) {
      assert.ok(sceneUnlocked(save, scene), `${scene.id} je zamčená`);
      const applied = applyScene(save, playScene(createGame(scene, { tutorial: !save.tutorialDone })));
      save = applied.save;
      summaries.push(applied.summary);
    }
  }
  return { save, summaries };
}

test('na začátku je otevřená jen první scéna louky', () => {
  const louka = scenesOf(MAIN_WORLDS[0]);
  assert.ok(sceneUnlocked(DEFAULT_SAVE, louka[0]));
  assert.ok(!sceneUnlocked(DEFAULT_SAVE, louka[1]));
  assert.ok(!worldUnlocked(DEFAULT_SAVE, MAIN_WORLDS[1]));
  assert.deepEqual(nextScene(DEFAULT_SAVE), { world: 'louka', index: 0 });
});

test('celá kampaň jde dohrát a odemkne rodinu, duhu, šatník a rozšíření', () => {
  const { save, summaries } = playCampaign();
  assert.ok(campaignDone(save));
  assert.ok(save.ending);
  assert.deepEqual(familyFound(save), FAMILY_ORDER);
  assert.equal(rainbowStripes(save).length, 5);
  assert.equal(save.owned.length, WARDROBE.length);
  assert.ok(save.rainbow);
  for (const world of MAIN_WORLDS) for (const animal of world.animals) assert.ok(save.album.includes(animal), `${animal} chybí v albu`);
  assert.equal(summaries.filter((s) => s.stripe).length, 5);
  assert.equal(summaries.filter((s) => s.ending).length, 1);
  assert.deepEqual(summaries.filter((s) => s.family).map((s) => s.family), ['babicka-perinka', 'mlhulka', 'duhacek', 'deda-vlocka']);
  for (const world of EXPANSION_WORLDS) assert.ok(worldUnlocked(save, world));
  assert.ok(save.garden.length > 3);
  assert.ok(save.garden.length <= 7);
});

test('opakované dohrání scény nic nezdvojí', () => {
  const scene = scenesOf(MAIN_WORLDS[0])[0];
  const result = playScene(createGame(scene));
  const once = applyScene(DEFAULT_SAVE, result).save;
  const twice = applyScene(once, result);
  assert.equal(twice.save.scenes.length, 1);
  assert.equal(twice.summary.newAnimals.length, 0);
  assert.equal(twice.save.album.length, once.album.length);
});

test('doplněk jde nasadit jen vlastněný a druhé ťuknutí ho sundá', () => {
  const owned = { ...DEFAULT_SAVE, owned: ['cepice-modra' as const] };
  const worn = toggleWear(owned, 'cepice-modra');
  assert.equal(worn.worn.hlava, 'cepice-modra');
  assert.equal(toggleWear(worn, 'cepice-modra').worn.hlava, undefined);
  assert.deepEqual(toggleWear(owned, 'korunka').worn, {});
});

test('návštěva dne vybírá jen z alba', () => {
  assert.equal(guestOfDay(DEFAULT_SAVE, 0.5), null);
  assert.equal(guestOfDay({ ...DEFAULT_SAVE, album: ['jezek', 'motyl'] }, 0.9), 'motyl');
});

test('poškozený save se nahradí výchozím', () => {
  assert.deepEqual(migrateSave(null), DEFAULT_SAVE);
  assert.deepEqual(migrateSave({ scenes: ['louka-1'], settings: { voice: 2, music: 1 } }).settings, { ...DEFAULT_SAVE.settings, music: 1 });
});
