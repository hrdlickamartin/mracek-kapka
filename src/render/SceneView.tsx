import { G } from 'react-native-svg';
import { GROUND_Y, RAINBOW_TIME, SCENE_W } from '../game/constants';
import { kapkaScale } from '../game/systems/kapka';
import { GARDEN_SLOTS } from '../game/worlds';
import type { FamilyId, GameState } from '../game/types';
import type { WorldDef } from '../game/worlds';
import type { WardrobeId, WardrobeSlot } from '../progression/wardrobe';
import { AnimalFigure } from './Animal';
import { FamilyCloud, Fuk, Hand, Sun, Zofka } from './Characters';
import { KapkaFigure } from './Kapka';
import { PlantFigure } from './Plant';
import { Bubble, FlowerIcon, GoalMarker, Wish } from './Guide';
import { Decor, Garland, Lantern, NightShade, SeasonLayer, SeedCarry, SeedSlots } from './Ambience';
import { WonderFigure, WonderSparkle } from './Wonder';
import { PLANTS } from '../game/catalog';
import { HideoutFigure, Particles, Rainbow, WaterSource } from './Props';
import { Confetti, Joy, Rays, Stars } from './Party';
import { Backdrop, Dryness, type View } from './Scenery';

const HORIZON_RAINBOW = 560;
const SOURCE_LIFT: Partial<Record<GameState['source']['kind'], number>> = { studna: 120, vodopad: 140, sud: 20 };

export interface SceneViewProps {
  state: GameState;
  world: WorldDef;
  view: View;
  worn: Partial<Record<WardrobeSlot, WardrobeId>>;
  reducedMotion: boolean;
  highContrast: boolean;
  stripes?: number;
  family?: FamilyId[];
  flags?: string[];
}

export function SceneView({ state, world, view, worn, reducedMotion, highContrast, stripes = 0, family = [], flags = [] }: SceneViewProps) {
  const t = state.time;
  const k = state.kapka;
  const cues = Object.values(state.cooldown).filter((v): v is number => v !== undefined);
  const lastCue = cues.length ? Math.max(...cues) : -10;
  const hop = t - lastCue < 0.7 ? (t - lastCue) / 0.7 : 0;
  const centered = Math.abs(state.source.x - SCENE_W / 2) < 1;
  const zofkaX = centered ? state.source.x - state.source.base / 2 - 30 : state.source.x + (state.source.x < SCENE_W / 2 ? 175 : -175);
  const night = state.mechanics.includes('noc');
  const variant = state.scene.backdrop;
  const avoid = [...state.scene.plants.map((p) => p.x), state.source.x, ...state.scene.hideouts.map((h) => h.x), ...(state.wonder ? [state.wonder.x] : []), ...(state.mode === 'zahradka' ? GARDEN_SLOTS : [])].join(',');
  const lights = night
    ? [
        { x: k.x, y: k.y + 40, r: 320 },
        { x: state.source.x, y: GROUND_Y - 30, r: 170 },
        ...state.plants.filter((p) => p.stage >= 3).map((p) => ({ x: p.x + 30, y: GROUND_Y - 110, r: 210 })),
        ...(state.goal ? [{ x: state.goal.x, y: state.goal.y, r: 150 }] : []),
        ...(state.wonder && state.wonder.done > 0 ? [{ x: state.wonder.x, y: GROUND_Y - 100, r: 200 }] : []),
      ]
    : [];
  const sunny = world.scenery === 'poust';
  const showFamily = state.scene.family && state.phase !== 'hraje' ? state.scene.family : null;
  const familyIn = Math.min(1, state.phaseTime / 1.4);
  const rainbowOpacity = state.rainbowFound ? Math.min(1, (state.rainbow - RAINBOW_TIME) / 1.2) : 0;
  const gust = state.wind.gust;
  const thirsty = (stage: number) => stage < 3;
  const party = state.phase !== 'hraje';
  const partyTime = party ? state.phaseTime : 0;
  const motion = reducedMotion ? 0 : 1;
  const celebrant = party ? state.visitors.find((v) => v.celebrant) : undefined;
  const rays = celebrant ? Math.min(1, partyTime / 0.8) * motion : 0;
  const kapkaDance = party ? motion : 0;
  return (
    <G>
      <Backdrop world={world} v={view} variant={variant} />
      {sunny && <Sun x={1340} y={140} time={reducedMotion ? 0 : t} face strength={state.sun} />}
      {stripes > 0 && <Rainbow x={SCENE_W / 2} y={HORIZON_RAINBOW} r={520} opacity={0.9} stripes={stripes} />}
      {rainbowOpacity > 0 && <Rainbow x={SCENE_W / 2} y={HORIZON_RAINBOW} r={560} opacity={rainbowOpacity} />}
      <Dryness world={world} v={view} bloom={state.mode === 'zahradka' ? 1 : state.bloom} plants={state.plants} variant={variant} />
      {flags.length > 0 && <Garland colors={flags} v={view} time={reducedMotion ? 0 : t} />}
      <Decor scenery={world.scenery} index={state.scene.index} color={world.palette.mid} avoid={avoid} />
      <SeasonLayer season={state.season} time={t} v={view} reduced={reducedMotion} />
      <WaterSource kind={state.source.kind} x={state.source.x} w={state.source.w} ripple={state.source.ripple} time={t} glow={highContrast} />
      {state.hideouts.map((h) => (
        <HideoutFigure key={h.id} h={h} time={t} glow={highContrast} />
      ))}
      {state.wonder && <WonderFigure wonder={state.wonder} time={reducedMotion ? 0 : t} glow={highContrast} />}
      {state.slots.length > 0 && state.pouch.length > 0 && <SeedSlots slots={state.slots} time={t} planting={state.planting} reduced={reducedMotion} />}
      {state.plants.map((p) => (
        <PlantFigure
          key={p.id}
          kind={p.kind}
          x={p.x}
          y={p.y}
          stage={p.stage}
          pop={p.pop}
          thirsty={thirsty(p.stage) && p.watered <= 0}
          wave={p.wave}
          bubble={thirsty(p.stage)}
          glow={highContrast && thirsty(p.stage)}
          time={reducedMotion ? 0 : t}
          dance={party ? motion : 0}
        />
      ))}
      {night && state.plants.filter((p) => p.stage >= 3).map((p) => <Lantern key={`l${p.id}`} x={p.x} time={t} />)}
      <Zofka x={zofkaX} y={GROUND_Y + 30} hop={hop} time={t} scale={0.9} />
      <NightShade dark={state.dark} v={view} lights={lights} />
      {state.goal && <GoalMarker goal={state.goal} time={t} reduced={reducedMotion} lift={state.goal.kind === 'voda' ? SOURCE_LIFT[state.source.kind] ?? 0 : 0} />}
      {state.wonder && <WonderSparkle wonder={state.wonder} time={t} reduced={reducedMotion} />}
      {family.map((id, i) => (
        <FamilyCloud key={id} id={id} x={200 + i * 240} y={470 - (i % 2) * 30} time={t} size={0.42} />
      ))}
      {celebrant && <Rays x={celebrant.x} y={celebrant.y - 90} time={t} strength={rays} />}
      {state.visitors.map((v) => (
        <AnimalFigure
          key={v.id}
          kind={v.animal}
          x={v.x}
          y={v.y}
          react={v.react}
          time={t}
          flip={v.x > SCENE_W / 2 && !v.celebrant}
          flying={v.arrive < 1}
          glow={highContrast}
          scale={v.celebrant ? 1.5 + Math.min(1, partyTime / 0.6) * 0.5 : 1}
          dance={v.celebrant && v.arrive >= 1 ? motion : 0}
          arrive={v.arrive}
        />
      ))}
      {state.visitors.map((v) => {
        const plant = v.wish !== null && v.arrive >= 1 ? state.plants.find((p) => p.id === v.wish) : undefined;
        return plant ? (
          <Bubble key={`w${v.id}`} x={v.x + (v.x > SCENE_W / 2 ? -70 : 70)} y={v.y - 190} color={PLANTS[plant.kind].color} flip={v.x > SCENE_W / 2}>
            <FlowerIcon color={PLANTS[plant.kind].color} />
          </Bubble>
        ) : null;
      })}
      {state.visitors.filter((v) => v.happy > 0 && v.arrive >= 1 && motion > 0).map((v) => <Joy key={`j${v.id}`} x={v.x} y={v.y - 120} time={t} />)}
      {celebrant && celebrant.arrive >= 1 && motion > 0 && <Joy x={celebrant.x} y={celebrant.y - 150} time={t} />}
      {celebrant && celebrant.arrive >= 1 && <Stars x={celebrant.x} y={celebrant.y - 80} time={t} />}
      {showFamily && <FamilyCloud id={showFamily} x={k.x + (k.x < SCENE_W / 2 ? 300 : -300)} y={-200 + familyIn * 460} time={t} />}
      <KapkaFigure
        x={k.x}
        y={k.y - Math.abs(Math.sin(t * 5)) * 26 * kapkaDance}
        scale={kapkaScale(k.water) * 1.2}
        tilt={reducedMotion ? 0 : k.tilt + Math.sin(t * 5) * 12 * kapkaDance}
        stretch={reducedMotion ? 0 : k.stretch}
        mood={k.mood}
        water={k.water}
        blink={k.blink < 0}
        wink={k.wink > 0}
        worn={worn}
        glow={highContrast}
      />
      {state.mode === 'zahradka' && state.pouch.length > 0 && <SeedCarry at={{ x: k.x, y: k.y }} time={t} reduced={reducedMotion} />}
      {state.goal && !state.goal.busy && <Wish x={k.x} y={k.y} scale={kapkaScale(k.water) * 1.2} kind={state.goal.kind} />}
      <Particles list={state.particles} reduced={reducedMotion} />
      {gust > 0 && <Fuk x={state.wind.dir > 0 ? 200 + (1 - gust) * 900 : 1400 - (1 - gust) * 900} y={200} time={t} opacity={Math.min(1, gust * 3)} />}
      {state.hintTarget && <Hand from={{ x: k.x, y: k.y }} to={state.hintTarget} time={t} />}
      {party && motion > 0 && <Confetti time={t} start={t - partyTime} viewTop={view.y} />}
    </G>
  );
}

