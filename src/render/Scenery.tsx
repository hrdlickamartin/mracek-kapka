import { memo, type ReactNode } from 'react';
import { Circle, Defs, Ellipse, G, LinearGradient, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { HORIZON_Y, SCENE_H, SCENE_W } from '../game/constants';
import type { WorldDef } from '../game/worlds';
import { tr } from './svg';

export interface View {
  x: number;
  y: number;
  w: number;
  h: number;
}

function Tree({ x, y, s = 1, color = '#4F9112' }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <G transform={tr(x, y, 0, s)}>
      <Rect x={-10} y={-70} width={20} height={70} rx={8} fill="#8A5A3A" />
      <Circle cx={0} cy={-100} r={52} fill={color} />
      <Circle cx={-36} cy={-76} r={34} fill={color} />
      <Circle cx={36} cy={-78} r={36} fill={color} />
      <Circle cx={-14} cy={-118} r={22} fill="#FFFFFF" opacity={0.12} />
    </G>
  );
}

function Pine({ x, y, s = 1, color = '#2F7350' }: { x: number; y: number; s?: number; color?: string }) {
  return (
    <G transform={tr(x, y, 0, s)}>
      <Rect x={-8} y={-30} width={16} height={30} rx={6} fill="#7A5233" />
      <Path d="M0 -150 Q30 -100 46 -70 Q50 -60 36 -60 L-36 -60 Q-50 -60 -46 -70 Q-30 -100 0 -150 Z" fill={color} />
      <Path d="M0 -110 Q38 -60 56 -36 Q60 -26 44 -26 L-44 -26 Q-60 -26 -56 -36 Q-38 -60 0 -110 Z" fill={color} />
    </G>
  );
}

function House({ x, y, s = 1 }: { x: number; y: number; s?: number }) {
  return (
    <G transform={tr(x, y, 0, s)}>
      <Rect x={-80} y={-120} width={160} height={120} rx={12} fill="#F6E3B8" />
      <Path d="M-104 -112 Q-100 -124 -88 -132 L-8 -196 Q0 -202 8 -196 L88 -132 Q100 -124 104 -112 Z" fill="#E5322A" />
      <Rect x={44} y={-190} width={24} height={46} rx={6} fill="#B5543A" />
      <Rect x={-22} y={-66} width={44} height={66} rx={18} fill="#A0642E" />
      <Rect x={-66} y={-96} width={34} height={32} rx={8} fill="#8DD9FA" stroke="#FFFFFF" strokeWidth={5} />
      <Rect x={34} y={-96} width={34} height={32} rx={8} fill="#8DD9FA" stroke="#FFFFFF" strokeWidth={5} />
    </G>
  );
}

function Fence({ from, to, y }: { from: number; to: number; y: number }) {
  const posts: ReactNode[] = [];
  for (let x = from; x <= to; x += 46) posts.push(<Rect key={x} x={x - 7} y={y - 52} width={14} height={56} rx={6} fill="#C9935E" />);
  return (
    <G>
      <Rect x={from} y={y - 40} width={to - from} height={8} rx={4} fill="#B98250" />
      <Rect x={from} y={y - 20} width={to - from} height={8} rx={4} fill="#B98250" />
      {posts}
    </G>
  );
}

function Hills({ v, y, color, amp, freq, phase = 0 }: { v: View; y: number; color: string; amp: number; freq: number; phase?: number }) {
  const left = v.x - 50;
  const right = v.x + v.w + 50;
  let d = `M${left} ${v.y + v.h} L${left} ${y}`;
  for (let x = left; x <= right; x += 40) d += ` L${x} ${y - Math.sin(x * freq + phase) * amp - Math.sin(x * freq * 2.3 + phase) * amp * 0.3}`;
  d += ` L${right} ${v.y + v.h} Z`;
  return <Path d={d} fill={color} />;
}

function Mountains({ v, y, color, snow }: { v: View; y: number; color: string; snow: boolean }) {
  const peaks: ReactNode[] = [];
  let i = 0;
  for (let x = v.x - 200; x < v.x + v.w + 200; x += 260) {
    const h = 200 + ((i * 97) % 3) * 60;
    peaks.push(
      <G key={x}>
        <Path d={`M${x - 190} ${y} Q${x - 30} ${y - h} ${x} ${y - h} Q${x + 30} ${y - h} ${x + 190} ${y} Z`} fill={color} />
        {snow && <Path d={`M${x - 52} ${y - h + 62} Q${x - 22} ${y - h} ${x} ${y - h} Q${x + 22} ${y - h} ${x + 52} ${y - h + 62} Q${x + 24} ${y - h + 48} ${x} ${y - h + 66} Q${x - 24} ${y - h + 48} ${x - 52} ${y - h + 62} Z`} fill="#FFFFFF" />}
      </G>,
    );
    i++;
  }
  return <G>{peaks}</G>;
}

function SkyCloud({ x, y, s }: { x: number; y: number; s: number }) {
  return (
    <G transform={tr(x, y, 0, s)} opacity={0.85}>
      <Circle cx={-40} cy={6} r={30} fill="#FFFFFF" />
      <Circle cx={0} cy={-8} r={40} fill="#FFFFFF" />
      <Circle cx={44} cy={6} r={28} fill="#FFFFFF" />
      <Rect x={-70} y={6} width={140} height={28} rx={14} fill="#FFFFFF" />
    </G>
  );
}

function Stars({ v }: { v: View }) {
  const stars: ReactNode[] = [];
  for (let i = 0; i < 60; i++) {
    const x = v.x + ((i * 137.5) % v.w);
    const y = v.y + ((i * 61.7) % (HORIZON_Y - v.y - 80));
    stars.push(<Circle key={i} cx={x} cy={y} r={2 + (i % 3)} fill="#FFF6C9" opacity={0.5 + (i % 4) * 0.12} />);
  }
  return <G>{stars}</G>;
}

function Layers({ world, v }: { world: WorldDef; v: View }): ReactNode {
  const p = world.palette;
  switch (world.scenery) {
    case 'louka':
      return (
        <G>
          <Mountains v={v} y={HORIZON_Y - 40} color={p.far} snow />
          <Hills v={v} y={HORIZON_Y - 20} color="#8CC152" amp={40} freq={0.006} />
          <Tree x={150} y={HORIZON_Y + 10} s={1.1} />
          <Tree x={1480} y={HORIZON_Y + 20} s={1.3} color="#5E9B2E" />
          <House x={1180} y={HORIZON_Y - 6} s={0.5} />
          <Tree x={960} y={HORIZON_Y} s={0.7} color="#6FA83E" />
        </G>
      );
    case 'zahradka':
      return (
        <G>
          <Hills v={v} y={HORIZON_Y - 60} color={p.far} amp={50} freq={0.004} />
          <Hills v={v} y={HORIZON_Y - 10} color="#8CC152" amp={24} freq={0.008} />
          <House x={1240} y={HORIZON_Y + 50} s={1.05} />
          <Tree x={140} y={HORIZON_Y + 30} s={1.2} />
          <Fence from={360} to={1080} y={HORIZON_Y + 50} />
          <Circle cx={1080} cy={HORIZON_Y - 60} r={34} fill="#F9BA0A" />
          <Circle cx={1080} cy={HORIZON_Y - 60} r={14} fill="#6B3A12" />
          <Rect x={1076} y={HORIZON_Y - 30} width={8} height={80} fill="#5E9B2E" />
        </G>
      );
    case 'les':
      return (
        <G>
          <Hills v={v} y={HORIZON_Y - 80} color={p.far} amp={60} freq={0.005} />
          {[-80, 120, 340, 560, 1040, 1260, 1480, 1680].map((x, i) => (
            <Pine key={x} x={x} y={HORIZON_Y + 20 + (i % 2) * 20} s={1.6 + (i % 3) * 0.3} color={i % 2 ? '#2F7350' : '#1F5A40'} />
          ))}
          <Path d={`M700 ${v.y} L620 ${HORIZON_Y + 60} L760 ${HORIZON_Y + 60} L860 ${v.y} Z`} fill="#FFF7C2" opacity={0.18} />
          <Path d={`M980 ${v.y} L900 ${HORIZON_Y + 60} L1000 ${HORIZON_Y + 60} L1080 ${v.y} Z`} fill="#FFF7C2" opacity={0.14} />
        </G>
      );
    case 'poust':
      return (
        <G>
          <Path d={`M120 ${HORIZON_Y} L150 ${HORIZON_Y - 150} Q200 ${HORIZON_Y - 170} 260 ${HORIZON_Y - 150} L300 ${HORIZON_Y} Z`} fill="#D98A4E" />
          <Path d={`M1260 ${HORIZON_Y} L1300 ${HORIZON_Y - 120} Q1360 ${HORIZON_Y - 136} 1420 ${HORIZON_Y - 120} L1460 ${HORIZON_Y} Z`} fill="#D98A4E" />
          <Hills v={v} y={HORIZON_Y - 10} color={p.far} amp={30} freq={0.005} />
          <Hills v={v} y={HORIZON_Y + 20} color="#F2B46B" amp={20} freq={0.007} phase={2} />
          {[420, 1120].map((x) => (
            <G key={x} transform={tr(x, HORIZON_Y + 24, 0, 0.8)}>
              <Rect x={-14} y={-90} width={28} height={90} rx={14} fill="#5FA845" />
              <Rect x={10} y={-64} width={30} height={12} rx={6} fill="#5FA845" />
              <Rect x={28} y={-84} width={12} height={30} rx={6} fill="#5FA845" />
            </G>
          ))}
        </G>
      );
    case 'hory':
      return (
        <G>
          <Mountains v={v} y={HORIZON_Y + 10} color={p.far} snow />
          <Hills v={v} y={HORIZON_Y + 10} color="#7FA86A" amp={30} freq={0.006} />
          {[60, 220, 1380, 1540].map((x, i) => (
            <Pine key={x} x={x} y={HORIZON_Y + 40} s={1.2 + (i % 2) * 0.3} />
          ))}
        </G>
      );
    case 'rybnicek':
      return (
        <G>
          <Hills v={v} y={HORIZON_Y - 40} color={p.far} amp={40} freq={0.005} />
          <G transform={tr(1300, HORIZON_Y + 40)}>
            <Rect x={-90} y={-150} width={180} height={150} rx={14} fill="#E9D4A8" />
            <Path d="M-110 -140 L0 -220 L110 -140 Z" fill="#8A5A3A" />
            <Circle cx={-110} cy={-60} r={70} fill="none" stroke="#8A5A3A" strokeWidth={14} />
            <Path d="M-110 -130 L-110 10 M-180 -60 L-40 -60 M-160 -110 L-60 -10 M-160 -10 L-60 -110" stroke="#8A5A3A" strokeWidth={8} />
          </G>
          <Tree x={160} y={HORIZON_Y + 30} s={1.2} color="#5E9F55" />
        </G>
      );
    case 'more':
      return (
        <G>
          <Rect x={v.x - 50} y={HORIZON_Y - 120} width={v.w + 100} height={140} fill="#3FA3D6" />
          <Rect x={v.x - 50} y={HORIZON_Y - 120} width={v.w + 100} height={20} fill="#8FD3FF" opacity={0.6} />
          {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
            <Path key={i} d={`M${v.x + i * 220} ${HORIZON_Y - 40} q30 -18 60 0 t60 0`} stroke="#FFFFFF" strokeWidth={6} fill="none" opacity={0.7} strokeLinecap="round" />
          ))}
          <Hills v={v} y={HORIZON_Y + 20} color="#F6E2B0" amp={14} freq={0.006} />
          <G transform={tr(1420, HORIZON_Y + 40)}>
            <Path d="M0 0 Q20 -140 10 -200" stroke="#A0642E" strokeWidth={14} fill="none" strokeLinecap="round" />
            {[-160, -120, -60, -20].map((a) => (
              <Path key={a} d="M0 0 Q40 -30 90 -6 Q40 14 0 0 Z" fill="#4F9112" transform={`translate(10 -200) rotate(${a})`} />
            ))}
          </G>
        </G>
      );
    case 'noc':
      return (
        <G>
          <Stars v={v} />
          <Hills v={v} y={HORIZON_Y - 30} color={p.far} amp={40} freq={0.005} />
          {[140, 1460].map((x) => (
            <Tree key={x} x={x} y={HORIZON_Y + 30} s={1.3} color="#24504A" />
          ))}
          <House x={1180} y={HORIZON_Y + 10} s={0.55} />
          <Rect x={1180 - 36} y={HORIZON_Y - 43} width={18} height={17} rx={4} fill="#FFE27A" />
        </G>
      );
  }
}

export const Backdrop = memo(function Backdrop({ world, v }: { world: WorldDef; v: View }) {
  const p = world.palette;
  const night = world.scenery === 'noc';
  return (
    <G>
      <Defs>
        <LinearGradient id="nebe" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={p.skyTop} />
          <Stop offset="1" stopColor={p.skyBottom} />
        </LinearGradient>
        <LinearGradient id="zem" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={p.groundLush} />
          <Stop offset="1" stopColor={p.mid} />
        </LinearGradient>
        <LinearGradient id="sucho" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={p.groundDry} />
          <Stop offset="1" stopColor={p.groundDry} />
        </LinearGradient>
        <RadialGradient id="zelen" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={p.groundLush} stopOpacity={1} />
          <Stop offset="0.7" stopColor={p.groundLush} stopOpacity={0.85} />
          <Stop offset="1" stopColor={p.groundLush} stopOpacity={0} />
        </RadialGradient>
      </Defs>
      <Rect x={v.x - 50} y={v.y - 50} width={v.w + 100} height={HORIZON_Y - v.y + 100} fill="url(#nebe)" />
      {!night && (
        <G>
          <SkyCloud x={260} y={150} s={1} />
          <SkyCloud x={760} y={90} s={0.7} />
          <SkyCloud x={1300} y={170} s={0.9} />
        </G>
      )}
      <Layers world={world} v={v} />
      <Rect x={v.x - 50} y={HORIZON_Y + 30} width={v.w + 100} height={v.y + v.h - HORIZON_Y + 30} fill="url(#zem)" />
    </G>
  );
});

export function Dryness({ world, v, bloom, plants }: { world: WorldDef; v: View; bloom: number; plants: { x: number; stage: number }[] }) {
  const opacity = Math.max(0, 0.85 * (1 - bloom));
  return (
    <G>
      <Rect x={v.x - 50} y={HORIZON_Y + 30} width={v.w + 100} height={v.y + v.h - HORIZON_Y + 30} fill={world.palette.groundDry} opacity={opacity} />
      {plants.map((p, i) =>
        p.stage > 0 ? <Ellipse key={i} cx={p.x} cy={SCENE_H - 120} rx={70 + p.stage * 60} ry={50 + p.stage * 30} fill="url(#zelen)" opacity={opacity * (p.stage / 3)} /> : null,
      )}
    </G>
  );
}

export const Foreground = memo(function Foreground({ world, v }: { world: WorldDef; v: View }) {
  const tufts: ReactNode[] = [];
  const color = world.scenery === 'poust' ? '#E7A24E' : world.scenery === 'more' ? '#D9C27A' : world.scenery === 'noc' ? '#2F5A4A' : '#75A023';
  for (let x = v.x - 40, i = 0; x < v.x + v.w + 40; x += 70, i++) {
    const h = 30 + (i % 4) * 10;
    tufts.push(<Path key={x} d={`M${x - 20} ${SCENE_H + 4} Q${x - 10} ${SCENE_H - h} ${x - 4} ${SCENE_H - h - 8} Q${x} ${SCENE_H - h} ${x + 4} ${SCENE_H - h - 14} Q${x + 10} ${SCENE_H - h + 4} ${x + 20} ${SCENE_H + 4} Z`} fill={color} />);
  }
  return (
    <G>
      <Rect x={v.x - 50} y={SCENE_H} width={v.w + 100} height={Math.max(0, v.y + v.h - SCENE_H) + 50} fill={world.palette.mid} />
      {tufts}
    </G>
  );
});

export const SCENE_BOUNDS = { w: SCENE_W, h: SCENE_H };
