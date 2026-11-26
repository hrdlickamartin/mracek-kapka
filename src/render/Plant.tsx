import { memo, type ReactNode } from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import type { PlantKind } from '../game/types';

const LEAF = '#4F9112';
const LEAF_LIGHT = '#86B412';
const STEM = '#5E9B2E';

function Leaf({ x, y, angle, size = 1, color = LEAF }: { x: number; y: number; angle: number; size?: number; color?: string }) {
  return (
    <G transform={`translate(${x} ${y}) rotate(${angle}) scale(${size})`}>
      <Path d="M0 0 Q18 -16 40 -4 Q20 12 0 0 Z" fill={color} />
      <Path d="M2 0 Q20 -4 36 -4" stroke={LEAF_LIGHT} strokeWidth={2} fill="none" opacity={0.7} />
    </G>
  );
}

function Stem({ height, bend = 0 }: { height: number; bend?: number }) {
  return <Path d={`M0 0 Q${bend} ${-height / 2} ${bend * 0.4} ${-height}`} stroke={STEM} strokeWidth={7} fill="none" strokeLinecap="round" />;
}

function Petals({ count, length, width, color, center, centerSize, y }: { count: number; length: number; width: number; color: string; center: string; centerSize: number; y: number }) {
  return (
    <G transform={`translate(${0} ${y})`}>
      {Array.from({ length: count }, (_, i) => (
        <Ellipse key={i} cx={0} cy={-length / 2} rx={width} ry={length / 2} fill={color} transform={`rotate(${(360 / count) * i})`}/>
      ))}
      <Circle r={centerSize} fill={center} />
      <Circle cx={-centerSize * 0.3} cy={-centerSize * 0.3} r={centerSize * 0.35} fill="#FFFFFF" opacity={0.35} />
    </G>
  );
}

function Flower({ kind }: { kind: PlantKind }): ReactNode {
  switch (kind) {
    case 'kopretina':
      return <Petals count={14} length={46} width={9} color="#FEFCFC" center="#FBCC03" centerSize={14} y={-120} />;
    case 'pampeliska':
      return <Petals count={22} length={40} width={5} color="#FBCC03" center="#F39B05" centerSize={10} y={-115} />;
    case 'mak':
      return <Petals count={5} length={44} width={22} color="#ED3E1D" center="#2C2026" centerSize={11} y={-118} />;
    case 'slunecnice':
      return <Petals count={18} length={52} width={10} color="#F9BA0A" center="#6B3A12" centerSize={22} y={-160} />;
    case 'horska-kvetinka':
      return <Petals count={9} length={30} width={7} color="#F4F6F1" center="#E7D27A" centerSize={7} y={-80} />;
    case 'mesicnice':
      return (
        <G>
          <Circle cy={-115} r={46} fill="#FFF6C9" opacity={0.25} />
          <Petals count={8} length={40} width={14} color="#FFF6C9" center="#FFE27A" centerSize={10} y={-115} />
        </G>
      );
    case 'nocni-fialka':
      return <Petals count={5} length={36} width={16} color="#9C7BEA" center="#FFE27A" centerSize={7} y={-105} />;
    case 'pobrezni-ruze':
      return (
        <G transform={`translate(${0} ${-110})`}>
          <Circle r={28} fill="#F06C9B" />
          <Circle r={19} fill="#F590B5" />
          <Circle r={10} fill="#FBB5CE" />
        </G>
      );
    case 'morska-levandule':
      return (
        <G>
          {Array.from({ length: 9 }, (_, i) => (
            <Circle key={i} cx={(i % 2 ? 6 : -6)} cy={-80 - i * 9} r={7} fill="#A98BF0" />
          ))}
        </G>
      );
    case 'tulipan':
      return (
        <G transform={`translate(${0} ${-118})`}>
          <Path d="M-24 -6 Q-28 -42 -8 -46 L0 -26 L8 -46 Q28 -42 24 -6 Q20 18 0 18 Q-20 18 -24 -6 Z" fill="#EC8FBB" />
          <Path d="M-6 -10 Q0 -40 6 -10" fill="#F7B8D0" />
        </G>
      );
    case 'zvonek':
      return (
        <G>
          <Path d="M0 -120 Q30 -126 34 -96" stroke={STEM} strokeWidth={5} fill="none" />
          <G transform={`translate(${34} ${-96})`}>
            <Path d="M-20 26 Q-22 -4 0 -6 Q22 -4 20 26 Q10 20 0 26 Q-10 20 -20 26 Z" fill="#BD8EFA" />
            <Circle cy={28} r={4} fill="#FBCC03" />
          </G>
        </G>
      );
    default:
      return null;
  }
}

function Special({ kind, stage }: { kind: PlantKind; stage: number }): ReactNode {
  const s = stage;
  switch (kind) {
    case 'mrkev':
      return (
        <G>
          {s >= 3 && <Path d="M-16 -42 Q0 34 0 34 Q0 34 16 -42 Z" fill="#F39B05" />}
          {s >= 2 && s < 3 && <Ellipse cy={-4} rx={16} ry={9} fill="#F39B05" />}
          {[-30, -10, 10, 30].slice(0, s + 1).map((a) => (
            <Leaf key={a} x={0} y={s >= 3 ? -36 : -2} angle={-90 + a} size={0.6 + s * 0.25} />
          ))}
        </G>
      );
    case 'jahoda':
      return (
        <G>
          {[-28, 28, 0].slice(0, Math.max(1, s)).map((x) => (
            <Leaf key={x} x={x * 0.4} y={-10} angle={x < 0 ? -160 : x > 0 ? -20 : -90} size={0.9 + s * 0.15} />
          ))}
          {s === 2 && [-22, 18].map((x) => <Circle key={x} cx={x} cy={-48} r={9} fill="#FFFFFF" />)}
          {s >= 3 &&
            [-26, 0, 24].map((x, i) => (
              <G key={x} transform={`translate(${x} ${-44 - (i % 2) * 14})`}>
                <Path d="M-11 -4 Q0 -10 11 -4 Q10 14 0 18 Q-10 14 -11 -4 Z" fill="#E5322A" />
                <Circle cx={-3} cy={2} r={1.5} fill="#FBCC03" />
                <Circle cx={4} cy={7} r={1.5} fill="#FBCC03" />
              </G>
            ))}
        </G>
      );
    case 'houba': {
      const r = [10, 22, 34, 46][s];
      return (
        <G>
          <Rect x={-r * 0.35} y={-r * 1.4} width={r * 0.7} height={r * 1.4} rx={r * 0.3} fill="#FFF4E0" />
          <Path d={`M${-r} ${-r * 1.3} Q${-r} ${-r * 2.4} 0 ${-r * 2.4} Q${r} ${-r * 2.4} ${r} ${-r * 1.3} Z`} fill={s >= 3 ? '#E5322A' : '#C8814E'} />
          {s >= 2 && [[-0.45, -1.8], [0.3, -2], [0.6, -1.55]].map(([a, b], i) => <Circle key={i} cx={r * a} cy={r * b} r={r * 0.14} fill="#FFFFFF" />)}
        </G>
      );
    }
    case 'kapradi':
      return (
        <G>
          {[-50, -25, 0, 25, 50].slice(0, s + 2).map((a) => (
            <G key={a} transform={`rotate(${a})`}>
              <Path d={`M0 0 Q6 ${-40 - s * 18} 0 ${-60 - s * 26}`} stroke={LEAF} strokeWidth={5} fill="none" />
              {Array.from({ length: 2 + s * 2 }, (_, i) => (
                <G key={i}>
                  <Ellipse cx={-9} cy={-14 - i * 12} rx={10} ry={4} fill={i % 2 ? LEAF : LEAF_LIGHT} />
                  <Ellipse cx={9} cy={-14 - i * 12} rx={10} ry={4} fill={i % 2 ? LEAF_LIGHT : LEAF} />
                </G>
              ))}
            </G>
          ))}
        </G>
      );
    case 'boruvky':
      return (
        <G>
          <Ellipse cy={-24 - s * 8} rx={24 + s * 14} ry={18 + s * 10} fill={LEAF} />
          <Ellipse cx={-10} cy={-32 - s * 9} rx={14 + s * 6} ry={10 + s * 5} fill={LEAF_LIGHT} opacity={0.7} />
          {s >= 3 && [[-26, -30], [-8, -48], [14, -36], [28, -54], [2, -22], [-20, -58]].map(([x, y], i) => <Circle key={i} cx={x} cy={y} r={7} fill="#4F5FB8" />)}
        </G>
      );
    case 'kaktus': {
      const h = [16, 50, 80, 100][s];
      return (
        <G>
          <Rect x={-16} y={-h} width={32} height={h} rx={16} fill="#5FA845" />
          {s >= 2 && <Rect x={14} y={-h * 0.7} width={24} height={14} rx={7} fill="#5FA845" />}
          {s >= 2 && <Rect x={26} y={-h * 0.92} width={14} height={30} rx={7} fill="#5FA845" />}
          {s >= 3 && <Rect x={-40} y={-h * 0.55} width={26} height={14} rx={7} fill="#5FA845" />}
          {s >= 3 && <Rect x={-40} y={-h * 0.78} width={14} height={30} rx={7} fill="#5FA845" />}
          <Path d={`M-6 ${-h + 8} L-6 -4 M6 ${-h + 8} L6 -4`} stroke="#82C468" strokeWidth={3} />
          {s >= 3 && <Petals count={6} length={22} width={8} color="#EC8FBB" center="#FBCC03" centerSize={5} y={-h - 6} />}
        </G>
      );
    }
    case 'palma': {
      const h = [14, 50, 90, 130][s];
      return (
        <G>
          <Path d={`M0 0 Q10 ${-h / 2} 4 ${-h}`} stroke="#A0642E" strokeWidth={12} fill="none" strokeLinecap="round" />
          {s >= 1 &&
            [-150, -110, -70, -30].map((a) => <Leaf key={a} x={4} y={-h} angle={a} size={0.8 + s * 0.35} color="#4F9112" />)}
          {s >= 3 && [[-8, 6], [8, 8]].map(([x, y], i) => <Circle key={i} cx={4 + x} cy={-h + y} r={8} fill="#8A4B1E" />)}
        </G>
      );
    }
    case 'mech':
      return (
        <G>
          <Ellipse cy={-8} rx={20 + s * 14} ry={10 + s * 6} fill="#7FB547" />
          <Ellipse cx={-6} cy={-12} rx={12 + s * 8} ry={6 + s * 3} fill="#A8C729" />
          {s >= 3 && [[-26, -18], [-4, -26], [20, -20], [32, -10]].map(([x, y], i) => <Circle key={i} cx={x} cy={y} r={5} fill={i % 2 ? '#EC8FBB' : '#FEFCFC'} />)}
        </G>
      );
    case 'leknin':
      return (
        <G>
          <Ellipse cy={-6} rx={28 + s * 10} ry={10 + s * 3} fill="#5E9F55" />
          <Path d={`M0 -6 L${18 + s * 6} -12`} stroke="#2F7350" strokeWidth={3} />
          {s >= 3 && <Petals count={8} length={30} width={9} color="#F7A6C8" center="#FBCC03" centerSize={7} y={-24} />}
          {s === 2 && <Ellipse cy={-20} rx={9} ry={13} fill="#F7A6C8" />}
        </G>
      );
    case 'orobinec':
      return (
        <G>
          {[-14, 0, 14].slice(0, Math.max(1, s)).map((x) => (
            <G key={x} transform={`translate(${x} ${0})`}>
              <Path d={`M0 0 L0 ${-50 - s * 30}`} stroke={STEM} strokeWidth={5} />
              {s >= 3 && <Rect x={-7} y={-50 - s * 30 + 6} width={14} height={34} rx={7} fill="#8A4B1E" />}
            </G>
          ))}
          <Leaf x={0} y={-6} angle={-120} size={1 + s * 0.2} />
          <Leaf x={0} y={-6} angle={-60} size={1 + s * 0.2} />
        </G>
      );
    default:
      return null;
  }
}

const SPECIAL: PlantKind[] = ['mrkev', 'jahoda', 'houba', 'kapradi', 'boruvky', 'kaktus', 'palma', 'mech', 'leknin', 'orobinec'];

function Generic({ kind, stage, droop }: { kind: PlantKind; stage: number; droop: boolean }) {
  const tall = kind === 'slunecnice' ? 160 : kind === 'horska-kvetinka' ? 80 : kind === 'morska-levandule' ? 80 : 118;
  const d = droop ? 25 : 0;
  if (stage === 1) {
    return (
      <G>
        <Stem height={28} />
        <Leaf x={0} y={-26} angle={-150 + d} size={0.7} />
        <Leaf x={0} y={-26} angle={-30 - d} size={0.7} />
      </G>
    );
  }
  if (stage === 2) {
    return (
      <G>
        <Stem height={tall * 0.65} bend={droop ? 14 : 4} />
        <Leaf x={0} y={-18} angle={-160 + d} />
        <Leaf x={0} y={-30} angle={-20 - d} />
        <Leaf x={0} y={-48} angle={-150 + d} size={0.8} />
        <Leaf x={0} y={-58} angle={-30 - d} size={0.8} />
        <Ellipse cx={droop ? 6 : 2} cy={-tall * 0.65 - 8} rx={9} ry={13} fill="#7DB84A" />
      </G>
    );
  }
  return (
    <G>
      <Stem height={tall} bend={4} />
      <Leaf x={0} y={-22} angle={-165} />
      <Leaf x={0} y={-36} angle={-15} />
      <Leaf x={0} y={-56} angle={-150} size={0.85} />
      <Flower kind={kind} />
    </G>
  );
}

function Seed({ thirsty }: { thirsty: boolean }) {
  return (
    <G>
      <Ellipse cy={-4} rx={30} ry={12} fill={thirsty ? '#CB7035' : '#853B0F'} />
      <Ellipse cx={0} cy={-12} rx={10} ry={8} fill="#A0642E" />
      <Ellipse cx={-3} cy={-14} rx={3} ry={2} fill="#FFFFFF" opacity={0.5} />
    </G>
  );
}

export function ThirstBubble({ y, pulse }: { y: number; pulse: number }) {
  const s = 1 + pulse * 0.25;
  return (
    <G transform={`translate(${0} ${y}) scale(${s})`}>
      <Circle cx={-14} cy={30} r={5} fill="#FFFFFF" opacity={0.9} />
      <Circle cx={-6} cy={16} r={8} fill="#FFFFFF" opacity={0.9} />
      <Circle r={26} fill="#FFFFFF" />
      <Path d="M0 -15 Q12 0 12 6 a12 12 0 0 1 -24 0 Q-12 0 0 -15 Z" fill="#3BAEFD" />
      <Ellipse cx={-4} cy={4} rx={3} ry={5} fill="#FFFFFF" opacity={0.7} />
    </G>
  );
}

export interface PlantProps {
  kind: PlantKind;
  x: number;
  y: number;
  stage: number;
  pop: number;
  thirsty: boolean;
  wave: number;
  bubble: boolean;
  glow?: boolean;
  time: number;
}

export const PlantFigure = memo(function PlantFigure({ kind, x, y, stage, pop, thirsty, wave, bubble, glow, time }: PlantProps) {
  const sy = 1 + pop * 0.22;
  const sx = 1 - pop * 0.1;
  const sway = stage >= 3 ? Math.sin(time * 1.6 + x) * 3 : wave > 0 ? Math.sin(time * 14) * 8 : 0;
  const special = SPECIAL.includes(kind);
  return (
    <G transform={`translate(${x} ${y})`}>
      <Ellipse cy={2} rx={44} ry={10} fill="#3A4A20" opacity={0.18} />
      {glow && <Circle cy={-60} r={80} fill="#FFFFFF" opacity={0.3} />}
      <G transform={`rotate(${sway}) scale(${sx} ${sy})`}>
        {stage === 0 && !special && <Seed thirsty={thirsty} />}
        {stage === 0 && special && kind !== 'houba' && <Seed thirsty={thirsty} />}
        {special && (stage > 0 || kind === 'houba') && <Special kind={kind} stage={stage} />}
        {!special && stage > 0 && <Generic kind={kind} stage={stage} droop={thirsty && stage < 3} />}
        {stage > 0 && stage < 3 && <Ellipse cy={-2} rx={26} ry={8} fill={thirsty ? '#CB7035' : '#853B0F'} opacity={0.8} />}
      </G>
      {bubble && <ThirstBubble y={-130 - stage * 30} pulse={wave > 0 ? Math.abs(Math.sin(time * 6)) : 0} />}
    </G>
  );
});
