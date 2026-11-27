import { memo } from 'react';
import type { ImageSourcePropType } from 'react-native';
import { Defs, Ellipse, FeColorMatrix, Filter, G, Image, LinearGradient, Mask, RadialGradient, Rect, Stop } from 'react-native-svg';
import { GROUND_Y, HORIZON_Y } from '../game/constants';
import type { Scenery, WorldDef } from '../game/worlds';

export interface View {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const SCENE_IMAGES: Record<Scenery, ImageSourcePropType[]> = {
  louka: [require('../../assets/scenes/louka.jpg'), require('../../assets/scenes/louka-2.jpg'), require('../../assets/scenes/louka-3.jpg')],
  zahradka: [require('../../assets/scenes/zahradka.jpg'), require('../../assets/scenes/zahradka-2.jpg'), require('../../assets/scenes/zahradka-3.jpg')],
  les: [require('../../assets/scenes/les.jpg'), require('../../assets/scenes/les-2.jpg'), require('../../assets/scenes/les-3.jpg')],
  poust: [require('../../assets/scenes/poust.jpg'), require('../../assets/scenes/poust-2.jpg'), require('../../assets/scenes/poust-3.jpg')],
  hory: [require('../../assets/scenes/hory.jpg'), require('../../assets/scenes/hory-2.jpg'), require('../../assets/scenes/hory-3.jpg')],
  rybnicek: [require('../../assets/scenes/rybnicek.jpg'), require('../../assets/scenes/rybnicek-2.jpg'), require('../../assets/scenes/rybnicek-3.jpg')],
  more: [require('../../assets/scenes/more.jpg'), require('../../assets/scenes/more-2.jpg'), require('../../assets/scenes/more-3.jpg')],
  noc: [require('../../assets/scenes/noc.jpg'), require('../../assets/scenes/noc-2.jpg'), require('../../assets/scenes/noc-3.jpg')],
  dzungle: [require('../../assets/scenes/dzungle.jpg'), require('../../assets/scenes/dzungle-2.jpg'), require('../../assets/scenes/dzungle-3.jpg')],
  sad: [require('../../assets/scenes/sad.jpg'), require('../../assets/scenes/sad-2.jpg'), require('../../assets/scenes/sad-3.jpg')],
  arktida: [require('../../assets/scenes/arktida.jpg'), require('../../assets/scenes/arktida-2.jpg'), require('../../assets/scenes/arktida-3.jpg')],
  balkon: [require('../../assets/scenes/balkon.jpg'), require('../../assets/scenes/balkon-2.jpg'), require('../../assets/scenes/balkon-3.jpg')],
};

export function sceneImage(world: WorldDef, variant = 0) {
  const list = SCENE_IMAGES[world.scenery];
  return list[variant % list.length];
}

const DRY_MATRIX = '0.62 0.32 0.06 0 0.07  0.42 0.48 0.06 0 0.05  0.30 0.28 0.18 0 0.02  0 0 0 1 0';

function Picture({ world, v, filter, variant }: { world: WorldDef; v: View; filter?: string; variant: number }) {
  return (
    <Image
      href={sceneImage(world, variant)}
      x={v.x}
      y={v.y}
      width={v.w}
      height={v.h}
      preserveAspectRatio="xMidYMid slice"
      filter={filter}
    />
  );
}

export const Backdrop = memo(function Backdrop({ world, v, variant = 0 }: { world: WorldDef; v: View; variant?: number }) {
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
      <Picture world={world} v={v} variant={variant} />
    </G>
  );
});

export function Dryness({ world, v, bloom, plants, variant = 0 }: { world: WorldDef; v: View; bloom: number; plants: { x: number; stage: number }[]; variant?: number }) {
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
        <Picture world={world} v={v} filter="url(#sucho)" variant={variant} />
      </G>
    </G>
  );
}
