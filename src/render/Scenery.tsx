import { memo } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Defs, Ellipse, FeColorMatrix, Filter, G, Image, LinearGradient, Mask, RadialGradient, Rect, Stop } from 'react-native-svg';
import { GROUND_Y, HORIZON_Y } from '../game/constants';
import type { WorldDef } from '../game/worlds';

export interface View {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const SCENE_IMAGES: Record<WorldDef['scenery'], ImageSourcePropType> = {
  louka: require('../../assets/scenes/louka.jpg'),
  zahradka: require('../../assets/scenes/zahradka.jpg'),
  les: require('../../assets/scenes/les.jpg'),
  poust: require('../../assets/scenes/poust.jpg'),
  hory: require('../../assets/scenes/hory.jpg'),
  rybnicek: require('../../assets/scenes/rybnicek.jpg'),
  more: require('../../assets/scenes/more.jpg'),
  noc: require('../../assets/scenes/noc.jpg'),
};

const DRY_MATRIX = '0.62 0.32 0.06 0 0.07  0.42 0.48 0.06 0 0.05  0.30 0.28 0.18 0 0.02  0 0 0 1 0';

function Picture({ world, v, filter }: { world: WorldDef; v: View; filter?: string }) {
  return (
    <Image
      href={SCENE_IMAGES[world.scenery]}
      x={v.x}
      y={v.y}
      width={v.w}
      height={v.h}
      preserveAspectRatio="xMidYMid slice"
      filter={filter}
    />
  );
}

export const Backdrop = memo(function Backdrop({ world, v }: { world: WorldDef; v: View }) {
  const p = world.palette;
  return (
    <G>
      <Defs>
        <LinearGradient id="nebe" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={p.skyTop} />
          <Stop offset="1" stopColor={p.groundLush} />
        </LinearGradient>
      </Defs>
      <Rect x={v.x - 50} y={v.y - 50} width={v.w + 100} height={v.h + 100} fill="url(#nebe)" />
      <Picture world={world} v={v} />
    </G>
  );
});

export function Dryness({ world, v, bloom, plants }: { world: WorldDef; v: View; bloom: number; plants: { x: number; stage: number }[] }) {
  const opacity = Math.max(0, 0.92 * (1 - bloom));
  if (opacity < 0.02) return null;
  const top = HORIZON_Y - 40;
  return (
    <G>
      <Defs>
        <Filter id="sucho" x="0" y="0" width="1" height="1">
          <FeColorMatrix type="matrix" values={DRY_MATRIX} />
        </Filter>
        <LinearGradient id="sucho-prechod" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity={0} />
          <Stop offset="0.12" stopColor="#FFFFFF" stopOpacity={1} />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity={1} />
        </LinearGradient>
        <RadialGradient id="zivot" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#000000" stopOpacity={1} />
          <Stop offset="0.65" stopColor="#000000" stopOpacity={0.9} />
          <Stop offset="1" stopColor="#000000" stopOpacity={0} />
        </RadialGradient>
        <Mask id="sucho-maska" x={v.x} y={v.y} width={v.w} height={v.h} maskUnits="userSpaceOnUse">
          <Rect x={v.x} y={top} width={v.w} height={v.y + v.h - top} fill="url(#sucho-prechod)" />
          {plants.map((p, i) =>
            p.stage > 0 ? <Ellipse key={i} cx={p.x} cy={GROUND_Y - 30} rx={90 + p.stage * 70} ry={60 + p.stage * 38} fill="url(#zivot)" opacity={p.stage / 3} /> : null,
          )}
        </Mask>
      </Defs>
      <G mask="url(#sucho-maska)" opacity={opacity}>
        <Picture world={world} v={v} filter="url(#sucho)" />
      </G>
    </G>
  );
}
