import { memo, type ReactNode } from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { PLANTS } from '../game/catalog';
import { GROUND_Y } from '../game/constants';
import type { Hideout, Particle, SourceKind } from '../game/types';
import { tr } from './svg';

function Pond({ w, ripple, time, deep = '#4FB8E6', light = '#8DD9FA' }: { w: number; ripple: number; time: number; deep?: string; light?: string }) {
  const r = w / 2;
  return (
    <G>
      <Ellipse cy={6} rx={r + 16} ry={34} fill="#7A5A3A" opacity={0.35} />
      <Ellipse rx={r + 8} ry={30} fill="#B9D9A0" />
      <Ellipse rx={r} ry={24} fill={deep} />
      <Ellipse cy={-4} rx={r * 0.8} ry={16} fill={light} />
      <Ellipse cx={-r * 0.35} cy={-8} rx={r * 0.2} ry={4} fill="#FFFFFF" opacity={0.8} />
      <Ellipse rx={(r * 0.3 + Math.sin(time * 2) * 6) * (1 + ripple * 0.6)} ry={6 + ripple * 6} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={0.6} />
    </G>
  );
}

export const WaterSource = memo(function WaterSource({ kind, x, w, ripple, time, glow }: { kind: SourceKind; x: number; w: number; ripple: number; time: number; glow?: boolean }) {
  let body: ReactNode;
  switch (kind) {
    case 'sud':
      body = (
        <G>
          <Rect x={-w / 2} y={-110} width={w} height={110} rx={22} fill="#A0642E" />
          <Rect x={-w / 2} y={-86} width={w} height={10} fill="#6E4420" />
          <Rect x={-w / 2} y={-36} width={w} height={10} fill="#6E4420" />
          <Ellipse cy={-110} rx={w / 2} ry={16} fill="#4FB8E6" />
          <Ellipse cy={-112} rx={w / 2 - 12} ry={9} fill="#8DD9FA" opacity={0.8 + ripple * 0.2} />
        </G>
      );
      break;
    case 'potok':
      body = (
        <G>
          <Path d={`M${-w / 2} -200 Q${-w / 4} -100 ${-w / 2 + 10} 0 L${w / 2 - 10} 0 Q${w / 4} -100 ${w / 2} -200 Z`} fill="#4FB8E6" opacity={0.85} />
          <Pond w={w} ripple={ripple} time={time} />
        </G>
      );
      break;
    case 'vodopad':
      body = (
        <G>
          <Path d={`M${-w / 2 - 40} -10 Q${-w / 2 - 30} -230 0 -240 Q${w / 2 + 30} -230 ${w / 2 + 40} -10 Z`} fill="#8E9AA8" />
          <Rect x={-w / 4} y={-236} width={w / 2} height={230} rx={20} fill="#8DD9FA" opacity={0.9} />
          {[0, 1, 2].map((i) => (
            <Path key={i} d={`M${-w / 8 + i * (w / 8)} ${-220 + ((time * 160 + i * 50) % 200)} l0 30`} stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" opacity={0.8} />
          ))}
          <Pond w={w} ripple={ripple} time={time} />
        </G>
      );
      break;
    case 'oaza':
      body = (
        <G>
          <Pond w={w} ripple={ripple} time={time} />
          <Path d={`M${w / 2 - 10} -6 Q${w / 2 + 6} -80 ${w / 2 - 6} -130`} stroke="#A0642E" strokeWidth={10} fill="none" strokeLinecap="round" />
          {[-150, -100, -50, -10].map((a) => (
            <Path key={a} d="M0 0 Q30 -24 70 -4 Q30 10 0 0 Z" fill="#5FA845" transform={`translate(${w / 2 - 6} -130) rotate(${a})`} />
          ))}
        </G>
      );
      break;
    case 'more':
      body = (
        <G>
          <Pond w={w} ripple={ripple} time={time} deep="#3FA3D6" light="#7FD0F2" />
          <Path d={`M${-w / 2} -14 q20 -14 40 0 t40 0 t40 0 t40 0 t40 0 t40 0`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.7} />
        </G>
      );
      break;
    case 'rosa':
      body = (
        <G>
          <Circle cy={-40} r={70} fill="#BFE6FF" opacity={0.18 + ripple * 0.2} />
          <Path d={`M${-w / 2} 0 Q0 -90 ${w / 2} 0 Q0 30 ${-w / 2} 0 Z`} fill="#3F7A5A" />
          {[-40, -10, 22, 46].map((dx, i) => (
            <Circle key={dx} cx={dx} cy={-14 - (i % 2) * 14} r={9} fill="#BFE6FF" opacity={0.85 + Math.sin(time * 3 + i) * 0.15} />
          ))}
        </G>
      );
      break;
    default:
      body = <Pond w={w} ripple={ripple} time={time} />;
  }
  return (
    <G transform={tr(x, GROUND_Y - 14)}>
      {glow && <Ellipse cy={-30} rx={w / 2 + 50} ry={80} fill="#FFFFFF" opacity={0.3} />}
      {body}
    </G>
  );
});

export const HideoutFigure = memo(function HideoutFigure({ h, time, glow }: { h: Hideout; time: number; glow?: boolean }) {
  const wiggle = !h.found ? Math.sin(time * 9) * (Math.sin(time * 0.9 + h.id) > 0.85 ? 4 : 0) : 0;
  const open = h.found ? 1 : 0;
  let body: ReactNode;
  switch (h.kind) {
    case 'ker':
      body = (
        <G>
          <Circle cx={-32} cy={-30} r={34 - open * 4} fill="#5E9B2E" />
          <Circle cx={30} cy={-32} r={36 - open * 4} fill="#4F9112" />
          <Circle cx={0} cy={-52} r={38} fill="#6FAE3A" transform={tr(0, 0, 0, 1, 1 - open * 0.1)} />
          <Circle cx={-14} cy={-62} r={10} fill="#FFFFFF" opacity={0.15} />
        </G>
      );
      break;
    case 'parez':
      body = (
        <G>
          <Path d="M-46 0 L-40 -60 Q0 -70 40 -60 L46 0 Z" fill="#8A5A3A" />
          <Ellipse cy={-62} rx={40} ry={12} fill="#D8B48A" />
          <Ellipse cy={-62} rx={22} ry={6} fill="none" stroke="#A0744A" strokeWidth={3} />
          <Ellipse cx={0} cy={-26} rx={14} ry={18} fill="#3A2414" opacity={1 - open * 0.4} />
        </G>
      );
      break;
    case 'kamen':
      body = (
        <G transform={tr(open * 26, 0, open * 10)}>
          <Path d="M-50 0 Q-56 -46 -10 -56 Q44 -60 52 -12 Q54 0 40 0 Z" fill="#A9A9A0" />
          <Path d="M-30 -36 Q-10 -48 14 -44" stroke="#FFFFFF" strokeWidth={5} opacity={0.35} fill="none" strokeLinecap="round" />
        </G>
      );
      break;
    case 'krtina':
      body = (
        <G>
          <Path d="M-46 0 Q-30 -46 0 -48 Q30 -46 46 0 Z" fill="#853B0F" />
          <Circle cx={-14} cy={-26} r={5} fill="#A0642E" />
          <Circle cx={12} cy={-34} r={4} fill="#A0642E" />
        </G>
      );
      break;
    case 'okno':
      body = (
        <G>
          <Rect x={-46} y={-96} width={92} height={96} rx={10} fill="#E8D4A8" />
          <Path d="M-56 -92 L0 -132 L56 -92 Z" fill="#B5543A" />
          <Rect x={-24} y={-74} width={48} height={40} rx={6} fill="#8DD9FA" />
          <Rect x={-30 - open * 22} y={-78} width={30} height={48} rx={5} fill="#3BAEFD" />
          <Rect x={0 + open * 22} y={-78} width={30} height={48} rx={5} fill="#3BAEFD" />
        </G>
      );
      break;
    case 'dutina':
      body = (
        <G>
          <Rect x={-34} y={-150} width={68} height={150} rx={20} fill="#8A5A3A" />
          <Ellipse cy={-80} rx={18} ry={24} fill="#3A2414" />
          <Circle cx={0} cy={-170} r={50} fill="#4F9112" />
        </G>
      );
      break;
    case 'muslicka':
      body = (
        <G transform={tr(0, 0, -open * 20)}>
          <Path d="M-40 0 Q-44 -50 0 -54 Q44 -50 40 0 Z" fill="#F7C8B8" />
          {[-24, -8, 8, 24].map((x) => (
            <Path key={x} d={`M0 0 L${x} -50`} stroke="#E29A86" strokeWidth={3} />
          ))}
        </G>
      );
      break;
    case 'leknin-list':
      body = (
        <G transform={tr(0, 0, 0, 1, 1 - open * 0.3)}>
          <Ellipse cy={-8} rx={50} ry={16} fill="#5E9F55" />
          <Path d="M0 -8 L36 -18" stroke="#2F7350" strokeWidth={3} />
        </G>
      );
      break;
  }
  return (
    <G transform={tr(h.x, h.y, wiggle)}>
      <Ellipse cy={2} rx={54} ry={10} fill="#2A3A20" opacity={0.16} />
      {glow && !h.found && <Circle cy={-40} r={74} fill="#FFFFFF" opacity={0.3} />}
      {body}
      {h.open > 0 && (
        <G opacity={h.open}>
          {[0, 1, 2, 3, 4].map((i) => (
            <Circle key={i} cx={Math.cos(i * 1.3) * 50 * (1.2 - h.open)} cy={-60 - Math.sin(i * 1.3) * 40 * (1.2 - h.open)} r={6} fill="#FBCC03" />
          ))}
        </G>
      )}
    </G>
  );
});

function Star({ size, color }: { size: number; color: string }) {
  const s = size;
  return <Path d={`M0 ${-s} Q${s * 0.18} ${-s * 0.18} ${s} 0 Q${s * 0.18} ${s * 0.18} 0 ${s} Q${-s * 0.18} ${s * 0.18} ${-s} 0 Q${-s * 0.18} ${-s * 0.18} 0 ${-s} Z`} fill={color} />;
}

const POLLEN = Object.values(PLANTS).map((p) => p.color);

export function Particles({ list, reduced }: { list: Particle[]; reduced: boolean }) {
  return (
    <G>
      {list.map((p, i) => {
        const a = Math.min(1, p.life / Math.min(0.4, p.max));
        switch (p.kind) {
          case 'kapka':
            return <Path key={i} d={`M${p.x} ${p.y - p.size} Q${p.x + p.size * 0.6} ${p.y} ${p.x} ${p.y + p.size * 0.5} Q${p.x - p.size * 0.6} ${p.y} ${p.x} ${p.y - p.size} Z`} fill="#6CC6F7" opacity={0.9} />;
          case 'vlocka':
            return <Circle key={i} cx={p.x} cy={p.y} r={p.size * 0.6} fill="#FFFFFF" opacity={0.95} />;
          case 'rozprsk':
            return <Circle key={i} cx={p.x} cy={p.y} r={p.size * 0.5} fill="#8DD9FA" opacity={a} />;
          case 'vlnka':
            return <Circle key={i} cx={p.x} cy={p.y} r={p.size * 0.6} fill="#BDE9FF" opacity={a * 0.9} />;
          case 'jiskra':
            if (reduced) return null;
            return (
              <G key={i} transform={tr(p.x, p.y, p.life * 90)} opacity={a}>
                <Star size={p.size} color="#FBCC03" />
              </G>
            );
          case 'pyl':
            if (reduced) return null;
            return <Circle key={i} cx={p.x} cy={p.y} r={p.size * 0.5} fill={POLLEN[p.hue % POLLEN.length]} opacity={a} />;
          case 'list':
            return <Ellipse key={i} cx={p.x} cy={p.y} rx={p.size} ry={p.size * 0.45} fill="#6FAE3A" opacity={a} transform={`rotate(${p.life * 200} ${p.x} ${p.y})`} />;
          case 'vitr':
            return <Path key={i} d={`M${p.x - 60} ${p.y} Q${p.x} ${p.y - 18} ${p.x + 60} ${p.y}`} stroke="#FFFFFF" strokeWidth={5} fill="none" opacity={a * 0.7} strokeLinecap="round" />;
          case 'motyl':
            return (
              <G key={i} transform={tr(p.x, p.y)} opacity={a}>
                <Ellipse cx={-7} cy={0} rx={8} ry={10 * Math.abs(Math.sin(p.life * 16))} fill={['#F9BA0A', '#EC8FBB', '#BD8EFA', '#3BAEFD'][p.hue % 4]} />
                <Ellipse cx={7} cy={0} rx={8} ry={10 * Math.abs(Math.sin(p.life * 16))} fill={['#F9BA0A', '#EC8FBB', '#BD8EFA', '#3BAEFD'][p.hue % 4]} />
                <Ellipse rx={2} ry={8} fill="#5B3A1E" />
              </G>
            );
          default:
            return null;
        }
      })}
    </G>
  );
}

const RAINBOW = ['#ED3E1D', '#F9BA0A', '#FBE15A', '#A8C729', '#3BAEFD', '#BD8EFA'];

export function Rainbow({ x, y, r, opacity, stripes = RAINBOW.length }: { x: number; y: number; r: number; opacity: number; stripes?: number }) {
  return (
    <G opacity={opacity}>
      {RAINBOW.slice(0, stripes).map((c, i) => (
        <Path key={c} d={`M${x - (r - i * 22)} ${y} A${r - i * 22} ${r - i * 22} 0 0 1 ${x + (r - i * 22)} ${y}`} stroke={c} strokeWidth={22} fill="none" opacity={0.75} />
      ))}
    </G>
  );
}
