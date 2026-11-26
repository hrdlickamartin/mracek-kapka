import { memo, type ReactNode } from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { ANIMALS, type AnimalInfo } from '../game/catalog';
import type { AnimalKind } from '../game/types';
import { tr } from './svg';

function Eyes({ x, y, size = 1, gap = 14 }: { x: number; y: number; size?: number; gap?: number }) {
  return (
    <G transform={tr(x, y, 0, size)}>
      {[-gap / 2, gap / 2].map((ex) => (
        <G key={ex} transform={tr(ex, 0)}>
          <Ellipse rx={5.5} ry={6.5} fill="#23395B" />
          <Circle cx={-1.8} cy={-2.4} r={2.2} fill="#FFFFFF" />
          <Circle cx={2} cy={2.4} r={1} fill="#FFFFFF" />
        </G>
      ))}
      <Ellipse cx={-gap / 2 - 7} cy={8} rx={5} ry={3} fill="#FCA19E" opacity={0.8} />
      <Ellipse cx={gap / 2 + 7} cy={8} rx={5} ry={3} fill="#FCA19E" opacity={0.8} />
    </G>
  );
}

function Smile({ x, y, w = 6 }: { x: number; y: number; w?: number }) {
  return <Path d={`M${x - w} ${y} Q${x} ${y + w} ${x + w} ${y}`} stroke="#23395B" strokeWidth={2.4} fill="none" strokeLinecap="round" />;
}

function Wing({ x, y, rot, color, accent, flap }: { x: number; y: number; rot: number; color: string; accent: string; flap: number }) {
  return (
    <G transform={tr(x, y, rot, 1, 0.55 + 0.45 * Math.abs(Math.cos(flap)))}>
      <Ellipse cx={0} cy={-18} rx={17} ry={22} fill={color} />
      <Circle cx={0} cy={-22} r={7} fill={accent} opacity={0.85} />
    </G>
  );
}

function Butterfly({ a, flap }: { a: AnimalInfo; flap: number }) {
  return (
    <G transform={tr(0, -50)}>
      <Wing x={-6} y={0} rot={-50} color={a.accent} accent={a.body} flap={flap} />
      <Wing x={6} y={0} rot={50} color={a.accent} accent={a.body} flap={flap} />
      <Wing x={-6} y={8} rot={-130} color={a.accent} accent="#FFFFFF" flap={flap} />
      <Wing x={6} y={8} rot={130} color={a.accent} accent="#FFFFFF" flap={flap} />
      <Ellipse rx={6} ry={22} fill={a.body} />
      <Circle cy={-24} r={11} fill={a.body} />
      <Path d="M-4 -32 Q-12 -48 -16 -50 M4 -32 Q12 -48 16 -50" stroke={a.body} strokeWidth={2.5} fill="none" />
      <Eyes x={0} y={-25} size={0.7} gap={9} />
    </G>
  );
}

function Bee({ a, flap }: { a: AnimalInfo; flap: number }) {
  return (
    <G transform={tr(0, -40)}>
      {a.glow && <Circle cx={-20} cy={6} r={34} fill="#E9FF8A" opacity={0.35 + 0.25 * Math.sin(flap * 0.5)} />}
      <Ellipse cx={-6} cy={-24} rx={12} ry={18} fill="#DDF3FD" opacity={0.85} transform={`rotate(${-20 + Math.sin(flap) * 20})`} />
      <Ellipse cx={10} cy={-24} rx={12} ry={18} fill="#DDF3FD" opacity={0.85} transform={`rotate(${20 - Math.sin(flap) * 20})`} />
      <Ellipse rx={30} ry={24} fill={a.body} />
      <Rect x={-8} y={-23} width={8} height={46} fill={a.accent} opacity={0.85} />
      <Rect x={8} y={-22} width={8} height={44} fill={a.accent} opacity={0.85} />
      {a.glow && <Ellipse cx={-26} cy={6} rx={10} ry={12} fill="#F4FFB0" />}
      <Eyes x={16} y={-2} size={0.8} gap={11} />
      <Smile x={18} y={9} w={4} />
    </G>
  );
}

function Ladybird({ a }: { a: AnimalInfo }) {
  return (
    <G transform={tr(0, -26)}>
      <Circle cx={28} cy={4} r={16} fill={a.accent} />
      <Path d="M-34 14 Q-34 -30 0 -30 Q34 -30 34 14 Z" fill={a.body} />
      <Path d="M0 -30 L0 14" stroke={a.accent} strokeWidth={3} />
      {[[-18, -10], [-12, 4], [16, -12], [18, 4]].map(([x, y], i) => <Circle key={i} cx={x} cy={y} r={6} fill={a.accent} />)}
      <Circle cx={-6} cy={-22} r={5} fill="#FFFFFF" opacity={0.45} />
      <Eyes x={32} y={2} size={0.75} gap={10} />
    </G>
  );
}

function Cricket({ a }: { a: AnimalInfo }) {
  return (
    <G transform={tr(0, -30)}>
      <Path d="M-20 10 L-40 -20 L-46 18 M10 10 L30 -14 L36 20" stroke={a.accent} strokeWidth={4} fill="none" strokeLinejoin="round" />
      <Ellipse rx={34} ry={16} fill={a.body} />
      <Ellipse cx={-6} cy={-6} rx={22} ry={8} fill={a.accent} opacity={0.6} />
      <Circle cx={30} cy={-8} r={15} fill={a.body} />
      <Path d="M36 -20 Q46 -50 60 -54 M30 -22 Q34 -52 44 -60" stroke={a.accent} strokeWidth={2.5} fill="none" />
      <Eyes x={33} y={-8} size={0.7} gap={9} />
    </G>
  );
}

function Bird({ a, flap, kind }: { a: AnimalInfo; flap: number; kind: AnimalKind }) {
  const owl = kind === 'sova';
  const duck = kind === 'kachnicka';
  return (
    <G transform={tr(0, -44)}>
      <Path d="M-30 6 L-50 -4 L-46 14 Z" fill={a.body} />
      <Ellipse rx={32} ry={30} fill={a.body} />
      <Ellipse cx={6} cy={8} rx={20} ry={18} fill={a.accent} />
      <G transform={tr(-10, -2, -20 + Math.sin(flap) * 25)}>
        <Ellipse cx={-6} cy={0} rx={20} ry={12} fill={a.body} />
      </G>
      <Circle cx={18} cy={-26} r={20} fill={owl ? a.body : a.body} />
      {kind === 'sykorka' && <Path d="M2 -40 Q18 -52 34 -40 L32 -30 Q18 -38 4 -30 Z" fill={a.accent} />}
      {owl && <Path d="M4 -42 L0 -56 L12 -44 M32 -44 L36 -56 L24 -42" fill={a.body} stroke={a.body} strokeWidth={4} strokeLinejoin="round" />}
      {owl && <Ellipse cx={18} cy={-26} rx={16} ry={13} fill={a.accent} />}
      <Path d={duck ? 'M34 -24 Q52 -24 50 -16 Q42 -12 34 -16 Z' : 'M34 -28 L46 -22 L34 -18 Z'} fill="#F39B05" />
      <Eyes x={20} y={-28} size={0.75} gap={11} />
      <Path d="M-6 30 L-6 44 M8 30 L8 44" stroke="#F39B05" strokeWidth={4} strokeLinecap="round" />
    </G>
  );
}

function Mammal({ a, kind }: { a: AnimalInfo; kind: AnimalKind }): ReactNode {
  const ears = a.ears;
  const hedgehog = ears === 'bodliny';
  const camel = kind === 'velbloudik';
  return (
    <G transform={tr(0, -40)}>
      {a.tail === 'chlupaty' && <Path d="M-30 10 Q-74 4 -66 -42 Q-50 -64 -38 -40 Q-50 -16 -26 -6 Z" fill={a.body} />}
      {a.tail === 'kratky' && <Circle cx={-32} cy={0} r={9} fill={a.accent} />}
      {hedgehog && (
        <G>
          {Array.from({ length: 9 }, (_, i) => {
            const ang = Math.PI * (0.95 + (i / 8) * 1.1);
            return <Path key={i} d={`M${Math.cos(ang) * 18} ${Math.sin(ang) * 14} L${Math.cos(ang) * 46} ${Math.sin(ang) * 38} L${Math.cos(ang + 0.25) * 22} ${Math.sin(ang + 0.25) * 18} Z`} fill={a.accent} />;
          })}
        </G>
      )}
      <Ellipse cx={-4} cy={8} rx={30} ry={24} fill={hedgehog ? a.accent : a.body} />
      {camel && <Ellipse cx={-6} cy={-14} rx={16} ry={14} fill={a.body} />}
      <Ellipse cx={-4} cy={14} rx={18} ry={14} fill={a.accent} opacity={hedgehog ? 0 : 0.8} />
      <Path d="M-20 26 L-20 38 M10 26 L10 38" stroke={hedgehog ? '#84401A' : a.body} strokeWidth={8} strokeLinecap="round" />
      <G transform={tr(24, -18)}>
        {ears === 'dlouhe' && (
          <G>
            <Ellipse cx={-10} cy={-38} rx={8} ry={24} fill={a.body} transform="rotate(-10)" />
            <Ellipse cx={-10} cy={-38} rx={4} ry={16} fill="#F7B8B0" transform="rotate(-10)" />
            <Ellipse cx={10} cy={-38} rx={8} ry={24} fill={a.body} transform="rotate(12)" />
            <Ellipse cx={10} cy={-38} rx={4} ry={16} fill="#F7B8B0" transform="rotate(12)" />
          </G>
        )}
        {(ears === 'kulate' || ears === 'chomacky') && (
          <G>
            <Circle cx={-14} cy={-20} r={9} fill={a.body} />
            <Circle cx={14} cy={-20} r={9} fill={a.body} />
            {ears === 'chomacky' && <Path d="M-18 -28 L-20 -40 L-10 -28 M18 -28 L20 -40 L10 -28" stroke={a.body} strokeWidth={5} strokeLinejoin="round" />}
          </G>
        )}
        {ears === 'spicate' && (
          <G>
            <Path d="M-18 -10 L-26 -36 L-6 -18 Z" fill={a.body} />
            <Path d="M18 -10 L26 -36 L6 -18 Z" fill={a.body} />
          </G>
        )}
        {ears === 'rohy' && <Path d="M-10 -18 Q-14 -40 -2 -40 M10 -18 Q8 -40 20 -38" stroke="#3A2A1A" strokeWidth={5} fill="none" strokeLinecap="round" />}
        <Circle r={22} fill={a.body} />
        <Ellipse cx={8} cy={8} rx={12} ry={9} fill={a.accent} />
        <Circle cx={16} cy={4} r={4} fill="#23395B" />
        <Eyes x={0} y={-4} size={0.8} gap={13} />
        <Smile x={10} y={12} w={4} />
      </G>
    </G>
  );
}

function Snail({ a }: { a: AnimalInfo }) {
  return (
    <G transform={tr(0, -24)}>
      <Path d="M-40 20 Q-40 6 -20 6 L36 6 Q50 6 50 -12 L44 -12 Q40 20 -40 20 Z" fill={a.body} />
      <Circle cx={-8} cy={-14} r={26} fill={a.accent} />
      <Path d="M-8 -14 m-16 0 a16 16 0 1 1 16 16 a10 10 0 1 1 -10 -10 a5 5 0 1 1 5 5" stroke="#8A4B1E" strokeWidth={3} fill="none" />
      <Path d="M44 -10 L40 -34 M50 -10 L54 -32" stroke={a.body} strokeWidth={4} strokeLinecap="round" />
      <Circle cx={40} cy={-36} r={4} fill="#23395B" />
      <Circle cx={54} cy={-34} r={4} fill="#23395B" />
      <Smile x={46} y={-2} w={4} />
    </G>
  );
}

function Worm({ a, t }: { a: AnimalInfo; t: number }) {
  const w = Math.sin(t * 3) * 6;
  return (
    <G transform={tr(0, -14)}>
      {[-36, -22, -8, 6, 20].map((x, i) => <Circle key={x} cx={x} cy={Math.sin(i + t * 3) * 4 + w * 0.2} r={10} fill={i % 2 ? a.body : a.accent} />)}
      <Circle cx={32} cy={-10} r={13} fill={a.body} />
      <Eyes x={33} y={-12} size={0.65} gap={9} />
    </G>
  );
}

function Lizard({ a }: { a: AnimalInfo }) {
  return (
    <G transform={tr(0, -18)}>
      <Path d="M-20 4 Q-60 10 -70 -10 Q-56 2 -20 -6 Z" fill={a.body} />
      <Ellipse rx={28} ry={12} fill={a.body} />
      {[-14, 0, 14].map((x) => <Circle key={x} cx={x} cy={-4} r={3} fill={a.accent} />)}
      <Ellipse cx={34} cy={-4} rx={16} ry={12} fill={a.body} />
      <Path d="M-14 10 L-20 20 M14 10 L20 20" stroke={a.body} strokeWidth={6} strokeLinecap="round" />
      <Eyes x={36} y={-8} size={0.65} gap={9} />
    </G>
  );
}

function Turtle({ a }: { a: AnimalInfo }) {
  return (
    <G transform={tr(0, -24)}>
      <Circle cx={36} cy={-2} r={14} fill={a.body} />
      <Path d="M-14 18 L-14 26 M16 18 L16 26" stroke={a.body} strokeWidth={9} strokeLinecap="round" />
      <Path d="M-38 18 Q-38 -28 0 -28 Q38 -28 38 18 Z" fill={a.accent} />
      <Path d="M-20 -6 L0 -18 L20 -6 L12 12 L-12 12 Z" fill={a.body} opacity={0.5} />
      <Eyes x={38} y={-6} size={0.65} gap={9} />
    </G>
  );
}

function Crab({ a, t }: { a: AnimalInfo; t: number }) {
  const c = Math.sin(t * 4) * 6;
  return (
    <G transform={tr(0, -22)}>
      <Path d="M-26 10 L-40 22 M-18 14 L-28 26 M26 10 L40 22 M18 14 L28 26" stroke={a.body} strokeWidth={5} strokeLinecap="round" />
      <Circle cx={-38} cy={-14 - c} r={11} fill={a.body} />
      <Circle cx={38} cy={-14 + c} r={11} fill={a.body} />
      <Ellipse rx={30} ry={20} fill={a.body} />
      <Path d="M-8 -16 L-8 -30 M8 -16 L8 -30" stroke={a.body} strokeWidth={4} />
      <Circle cx={-8} cy={-32} r={6} fill="#FFFFFF" />
      <Circle cx={8} cy={-32} r={6} fill="#FFFFFF" />
      <Circle cx={-8} cy={-32} r={3.5} fill="#23395B" />
      <Circle cx={8} cy={-32} r={3.5} fill="#23395B" />
      <Smile x={0} y={4} w={6} />
    </G>
  );
}

function Fish({ a, t }: { a: AnimalInfo; t: number }) {
  return (
    <G transform={tr(0, -30 - Math.abs(Math.sin(t * 2)) * 20, Math.sin(t * 2) * 15)}>
      <Path d="M-30 0 L-50 -16 L-50 16 Z" fill={a.body} />
      <Ellipse rx={32} ry={20} fill={a.body} />
      <Ellipse cx={4} cy={6} rx={18} ry={9} fill={a.accent} />
      <Eyes x={16} y={-4} size={0.7} gap={10} />
    </G>
  );
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
}

export const AnimalFigure = memo(function AnimalFigure({ kind, x, y, react, time, flip = false, flying = false, scale = 1, glow = false, dance = 0 }: AnimalProps) {
  const a = ANIMALS[kind];
  const beat = Math.abs(Math.sin(time * 4.2));
  const hop = (react > 0 ? Math.sin(react * Math.PI) * 34 : 0) + beat * 46 * dance;
  const squash = 1 + (1 - beat) * 0.14 * dance;
  const sway = Math.sin(time * 4.2) * 10 * dance;
  const bob = flying || a.flies ? Math.sin(time * 3 + x) * 6 : 0;
  const flap = time * (flying ? 22 : 8);
  const s = scale * (1 + Math.sin(react * Math.PI) * 0.08);
  let body: ReactNode;
  switch (a.shape) {
    case 'motyl':
      body = <Butterfly a={a} flap={flap} />;
      break;
    case 'vcela':
      body = <Bee a={a} flap={flap} />;
      break;
    case 'brouk':
      body = <Ladybird a={a} />;
      break;
    case 'cvrcek':
      body = <Cricket a={a} />;
      break;
    case 'ptak':
      body = <Bird a={a} flap={flying ? flap : Math.sin(time) * 0.4} kind={kind} />;
      break;
    case 'savec':
      body = <Mammal a={a} kind={kind} />;
      break;
    case 'snek':
      body = <Snail a={a} />;
      break;
    case 'zizala':
      body = <Worm a={a} t={time} />;
      break;
    case 'jesterka':
      body = <Lizard a={a} />;
      break;
    case 'zelva':
      body = <Turtle a={a} />;
      break;
    case 'krab':
      body = <Crab a={a} t={time} />;
      break;
    case 'rybka':
      body = <Fish a={a} t={time} />;
      break;
  }
  return (
    <G transform={tr(x, y - hop - bob, sway, (flip ? -s : s) * squash, s / squash)}>
      <Ellipse cy={2 + hop + bob} rx={30} ry={7} fill="#2A3A20" opacity={flying ? 0.08 : 0.16} />
      {glow && <Circle cy={-40} r={64} fill="#FFFFFF" opacity={0.3} />}
      {body}
    </G>
  );
});
