import { memo } from 'react';
import { Circle, Ellipse, G, Image } from 'react-native-svg';
import { ANIMALS, animalMove } from '../game/catalog';
import type { AnimalKind } from '../game/types';
import { ANIMAL_SPRITES } from './animalSprites';
import { tr } from './svg';

const HEIGHT: Partial<Record<AnimalKind, number>> = {
  beruska: 78,
  cvrcek: 88,
  zizala: 92,
  snek: 92,
  vcelka: 96,
  svetluska: 92,
  motyl: 104,
  mura: 100,
  vazka: 90,
  krab: 86,
  rybka: 92,
  jesterka: 90,
  zelvicka: 92,
  'morska-zelvicka': 90,
  kachnicka: 104,
};

export const ANIMAL_HEIGHT = 124;

export function animalHeight(kind: AnimalKind) {
  return HEIGHT[kind] ?? ANIMAL_HEIGHT;
}

export interface AnimalProps {
  kind: AnimalKind;
  x: number;
  y: number;
  react: number;
  time: number;
  flip?: boolean;
  flying?: boolean;
  scale?: number;
  glow?: boolean;
  dance?: number;
  arrive?: number;
}

export const AnimalFigure = memo(function AnimalFigure({ kind, x, y, react, time, flip = false, flying = false, scale = 1, glow = false, dance = 0, arrive = 1 }: AnimalProps) {
  const move = animalMove(ANIMALS[kind]);
  const coming = arrive < 1 ? 1 : 0;
  const leap = move === 'skace' ? Math.abs(Math.sin(arrive * Math.PI * 4)) * 55 * coming : 0;
  const rise = move === 'vyleze' && coming ? 0.35 + 0.65 * arrive : 1;
  const wobble = (move === 'plave' || move === 'leze') && coming ? Math.sin(time * (move === 'plave' ? 9 : 5)) * 7 : 0;
  const a = ANIMALS[kind];
  const sprite = ANIMAL_SPRITES[kind];
  const h = animalHeight(kind);
  const w = h * sprite.aspect;
  const beat = Math.abs(Math.sin(time * 4.2));
  const hop = (react > 0 ? Math.sin(react * Math.PI) * 34 : 0) + beat * 46 * dance + leap;
  const squash = 1 + (1 - beat) * 0.14 * dance + (react > 0 ? Math.sin(react * Math.PI * 2) * 0.08 : 0);
  const sway = Math.sin(time * 4.2) * 10 * dance + wobble;
  const hover = a.flies ? Math.sin(time * 3 + x) * 8 + (flying ? 0 : 14) : 0;
  const flap = a.flies && (flying || dance > 0) ? 1 + Math.sin(time * 26) * 0.05 : 1;
  const breathe = 1 + Math.sin(time * 2.4 + x * 0.01) * 0.025;
  const s = scale;
  return (
    <G transform={tr(x, y - hop - hover, sway, (flip ? -s : s) * squash * flap, (s / squash) * breathe * rise)}>
      <Ellipse cy={2 + hop + hover} rx={w * 0.32} ry={8} fill="#2A3A20" opacity={flying ? 0.06 : 0.16} />
      {glow && <Circle cy={-h / 2} r={h * 0.6} fill="#FFFFFF" opacity={0.3} />}
      {a.glow && <Circle cx={-w * 0.25} cy={-h * 0.4} r={h * 0.35} fill="#E9FF8A" opacity={0.25 + 0.2 * Math.sin(time * 3)} />}
      <Image href={sprite.src} x={-w / 2} y={-h} width={w} height={h} preserveAspectRatio="xMidYMid meet" />
    </G>
  );
});
