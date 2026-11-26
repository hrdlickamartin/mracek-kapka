import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { audio } from './audio/audio';
import { feedback } from './audio/feedback';
import { PLANTS, TONE_COUNT } from './game/catalog';
import { createGame, gardenSnapshot, step } from './game/engine';
import type { AnimalKind, GameEvent, GameState, Input, WorldId } from './game/types';
import { buildScene, GARDEN_SCENE, worldById } from './game/worlds';
import { Live, nextFrame } from './hooks/useFrame';
import { useGameLoop } from './hooks/useGameLoop';
import { keyDirection, useKeyboard } from './hooks/useKeyboard';
import { familyFound, guestOfDay, nextScene, rainbowStripes, toggleWear, type SceneSummary } from './progression/progress';
import type { SaveData, Settings } from './progression/saveData';
import { useProgress } from './progression/useProgress';
import { SceneView } from './render/SceneView';
import { SIZES } from './ui/theme';
import { Stage, useViewport } from './render/Stage';
import { Album } from './ui/Album';
import { BubbleButton } from './ui/BubbleButton';
import { Celebration } from './ui/Celebration';
import { HintHand } from './ui/HintHand';
import { HomeButton, ParentButton } from './ui/Hud';
import { Menu } from './ui/Menu';
import { ParentGate, ParentZone } from './ui/Parents';
import { Ending, Intro, RotateNotice, SleepScreen, Transition } from './ui/Screens';
import { TouchSurface } from './ui/TouchSurface';
import { Wardrobe } from './ui/Wardrobe';
import { WorldMap } from './ui/WorldMap';

type Screen = 'uvod' | 'menu' | 'zahradka' | 'mapa' | 'scena' | 'album' | 'satnik' | 'rodic' | 'spanek' | 'konec';

const PLAYING: Screen[] = ['zahradka', 'scena'];
const MUSIC: Screen[] = ['menu', 'zahradka', 'scena', 'mapa', 'album', 'satnik', 'konec', 'uvod'];

function gardenGame(save: SaveData, guest: AnimalKind | null) {
  return createGame(GARDEN_SCENE, { mode: 'zahradka', garden: save.garden, guest });
}

export function GameScreen() {
  const { save, loaded, update, finishScene, reset } = useProgress();
  const [chosen, setScreen] = useState<Screen | null>(null);
  const [gate, setGate] = useState(false);
  const [summary, setSummary] = useState<SceneSummary | null>(null);
  const [transition, setTransition] = useState(0);
  const gameRef = useRef<GameState | null>(null);
  const inputRef = useRef<Input>({ pointer: null, tap: null });
  const returnTo = useRef<Screen>('zahradka');
  const sessionStart = useRef(0);
  const guest = useRef<ReturnType<typeof guestOfDay> | undefined>(undefined);
  const saveRef = useRef(save);
  saveRef.current = save;
  const viewport = useViewport();
  const { keys, taps } = useKeyboard();
  const settings = save.settings;
  const screen: Screen | null = chosen ?? (loaded ? (save.introSeen ? 'menu' : 'uvod') : null);
  if (screen === 'zahradka' && !gameRef.current) gameRef.current = gardenGame(save, null);

  const enterGarden = useCallback(() => {
    if (guest.current === undefined) guest.current = guestOfDay(saveRef.current, Math.random());
    gameRef.current = gardenGame(saveRef.current, guest.current);
  }, []);

  const leaveGarden = useCallback(() => {
    const g = gameRef.current;
    if (g?.mode === 'zahradka') {
      const garden = gardenSnapshot(g);
      update((s) => ({ ...s, garden }));
    }
  }, [update]);

  const go = useCallback(
    (next: Screen) => {
      if (screen === 'zahradka' && next !== 'zahradka') leaveGarden();
      if (next === 'zahradka') enterGarden();
      inputRef.current = { pointer: null, tap: null };
      setTransition((n) => n + 1);
      audio.play('vzum', 0.6);
      setScreen(next);
    },
    [screen, enterGarden, leaveGarden],
  );

  useEffect(() => {
    audio.init();
    sessionStart.current = Date.now();
  }, []);

  useEffect(() => {
    if (!loaded || guest.current !== undefined) return;
    guest.current = guestOfDay(saveRef.current, Math.random());
    if (gameRef.current?.mode === 'zahradka' && guest.current) gameRef.current = gardenGame(saveRef.current, guest.current);
  }, [loaded]);

  useEffect(() => {
    audio.setLevels(settings.music / 4, settings.sfx / 4);
    feedback.setHaptics(settings.haptics);
  }, [settings.music, settings.sfx, settings.haptics]);

  useEffect(() => {
    audio.setMusic(!!screen && MUSIC.includes(screen));
    if (screen !== 'scena') audio.setBloom(screen === 'zahradka' || screen === 'konec' ? 1 : 0.4);
  }, [screen]);

  useEffect(() => {
    const id = setInterval(() => {
      const minutes = saveRef.current.settings.sleepMinutes;
      if (!minutes || !screen || ['spanek', 'rodic', 'uvod'].includes(screen) || gate) return;
      if (screen === 'scena' && gameRef.current && gameRef.current.phase === 'slavnost') return;
      if (Date.now() - sessionStart.current < minutes * 60000) return;
      audio.play('zivani');
      go('spanek');
    }, 3000);
    return () => clearInterval(id);
  }, [screen, gate, go]);

  const handleEvents = useCallback(
    (events: GameEvent[]) => {
      for (const e of events) {
        switch (e.type) {
          case 'sfx':
            audio.play(e.name, e.name === 'hlt' ? 0.6 : 1);
            break;
          case 'tone': {
            audio.tone(Math.min(TONE_COUNT - 1, PLANTS[e.plant].tone + e.stage - 1));
            const g = gameRef.current;
            if (g?.mode === 'zahradka') {
              const garden = gardenSnapshot(g);
              update((s) => ({ ...s, garden }));
            }
            break;
          }
          case 'haptic':
            feedback.haptic(e.strength);
            break;
          case 'complete':
            setSummary(finishScene(e.result));
            break;
          default:
            break;
        }
      }
    },
    [finishScene, update],
  );

  const running = !!screen && PLAYING.includes(screen) && !gate;
  useGameLoop((dt) => {
    const state = gameRef.current;
    if (!state) return;
    const input: Input = { pointer: inputRef.current.pointer, tap: inputRef.current.tap };
    const dir = keyDirection(keys.current);
    if (dir) input.pointer = { x: state.kapka.x + dir.x * 260, y: state.kapka.y + 110 + dir.y * 260 };
    if (taps.current > 0) {
      taps.current = 0;
      input.tap = { x: state.kapka.x, y: state.kapka.y };
    }
    inputRef.current.tap = null;
    handleEvents(step(state, input, dt));
    if (state.mode === 'scena') audio.setBloom(state.bloom);
    nextFrame();
  }, running);

  const openParent = useCallback(() => setGate(true), []);
  const passGate = useCallback(() => {
    setGate(false);
    returnTo.current = screen ?? 'zahradka';
    if (screen === 'zahradka') leaveGarden();
    setScreen('rodic');
  }, [screen, leaveGarden]);

  const closeParent = useCallback(() => {
    const back = returnTo.current;
    if (back === 'spanek' || back === 'rodic' || back === 'menu') {
      sessionStart.current = Date.now();
      go('menu');
    } else if (back === 'zahradka') {
      go('zahradka');
    } else {
      setScreen(back);
    }
  }, [go]);

  const playScene = useCallback(
    (world: WorldId, index: number) => {
      gameRef.current = createGame(buildScene(worldById(world), index), { tutorial: !saveRef.current.tutorialDone });
      setSummary(null);
      go('scena');
    },
    [go],
  );

  const playNext = useCallback(() => {
    const next = nextScene(saveRef.current);
    if (next) playScene(next.world, next.index);
    else go('mapa');
  }, [playScene, go]);

  const onContinue = useCallback(() => {
    const s = summary;
    setSummary(null);
    go(s?.ending ? 'konec' : 'mapa');
  }, [summary, go]);

  const changeSettings = useCallback((change: Partial<Settings>) => update((s) => ({ ...s, settings: { ...s.settings, ...change } })), [update]);

  const stripes = useMemo(() => rainbowStripes(save).length, [save]);
  const family = useMemo(() => familyFound(save), [save]);

  if (!loaded || !screen) return <View style={styles.root} />;

  const game = gameRef.current;
  const world = game ? (game.mode === 'zahradka' ? worldById('louka') : worldById(game.scene.world)) : null;

  return (
    <View style={styles.root} onTouchStart={() => audio.unlock()}>
      {PLAYING.includes(screen) && game && world && (
        <>
          <Stage viewport={viewport}>
            <Live>
              {() => (
                <SceneView
                  state={game}
                  world={world}
                  view={viewport.view}
                  worn={save.worn}
                  reducedMotion={settings.reducedMotion}
                  highContrast={settings.highContrast}
                  stripes={game.mode === 'zahradka' ? stripes : 0}
                  family={game.mode === 'zahradka' ? family : []}
                />
              )}
            </Live>
          </Stage>
          <TouchSurface viewport={viewport} input={inputRef} onTouch={() => audio.unlock()} />
        </>
      )}
      {screen === 'scena' && game && (
        <>
          <HomeButton onHome={() => go('menu')} hold reducedMotion={settings.reducedMotion} />
          <Live>{() => (game.phase === 'hotovo' && summary ? <Celebration summary={summary} animal={game.scene.visitor} onContinue={onContinue} reducedMotion={settings.reducedMotion} /> : null)}</Live>
        </>
      )}
      {screen === 'zahradka' && game && (
        <>
          <HomeButton onHome={() => go('menu')} hold reducedMotion={settings.reducedMotion} />
          <Live>
            {() =>
              game.phase === 'hotovo' ? (
                <View style={styles.gardenGo} pointerEvents="box-none">
                  <BubbleButton label="Hrát další obrázek" icon="hrat" size={SIZES.main} variant="go" onPress={playNext} pulse reducedMotion={settings.reducedMotion} />
                  <HintHand x={(SIZES.main + 20) * 0.62} y={(SIZES.main + 20) * 0.6} size={60} delay={1200} reducedMotion={settings.reducedMotion} />
                </View>
              ) : null
            }
          </Live>
        </>
      )}
      {screen === 'uvod' && (
        <Intro
          reducedMotion={settings.reducedMotion}
          onStart={() => {
            audio.unlock();
            update((s) => ({ ...s, introSeen: true }));
            go('menu');
          }}
        />
      )}
      {screen === 'menu' && (
        <Menu
          save={save}
          onPlay={playNext}
          onGarden={() => go('zahradka')}
          onMap={() => go('mapa')}
          onAlbum={() => go('album')}
          onWardrobe={() => go('satnik')}
          reducedMotion={settings.reducedMotion}
        />
      )}
      {screen === 'mapa' && <WorldMap save={save} onPlay={playScene} onHome={() => go('menu')} onEnding={() => go('konec')} onMist={() => audio.play('napoveda')} reducedMotion={settings.reducedMotion} />}
      {screen === 'album' && <Album save={save} onHome={() => go('menu')} reducedMotion={settings.reducedMotion} />}
      {screen === 'satnik' && <Wardrobe save={save} onToggle={(id) => update((s) => toggleWear(s, id))} onHome={() => go('menu')} reducedMotion={settings.reducedMotion} />}
      {screen === 'konec' && <Ending album={save.album} worn={save.worn} onDone={() => go('menu')} reducedMotion={settings.reducedMotion} />}
      {screen === 'spanek' && <SleepScreen worn={save.worn} />}
      {screen === 'rodic' && <ParentZone save={save} onSettings={changeSettings} onReset={() => { reset(); guest.current = null; }} onClose={closeParent} />}
      {screen !== 'rodic' && screen !== 'uvod' && <ParentButton onOpen={openParent} />}
      {gate && <ParentGate onPass={passGate} onClose={() => setGate(false)} />}
      <Transition token={transition} reducedMotion={settings.reducedMotion} />
      <RotateNotice />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: '#D2F0FD', overflow: 'hidden' },
  gardenGo: { position: 'absolute', bottom: '6%', right: '10%' },
});
