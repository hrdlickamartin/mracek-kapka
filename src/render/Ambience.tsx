import { memo } from 'react';
import { Circle, Defs, Ellipse, G, Mask, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import { GROUND_Y, SCENE_W } from '../game/constants';
import type { Point, Season } from '../game/types';
import type { Scenery } from '../game/worlds';
import { SeedIcon } from './Guide';
import type { View } from './Scenery';
import { tr } from './svg';

export function NightShade({ dark, v, lights }: { dark: number; v: View; lights: { x: number; y: number; r: number }[] }) {
  if (dark < 0.02) return null;
  return (
    <G>
      <Defs>
        <RadialGradient id="noc-svetlo" cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor="#000000" stopOpacity={1} />
          <Stop offset="0.55" stopColor="#000000" stopOpacity={0.85} />
          <Stop offset="1" stopColor="#000000" stopOpacity={0} />
        </RadialGradient>
        <Mask id="noc-maska" x={v.x} y={v.y} width={v.w} height={v.h} maskUnits="userSpaceOnUse">
          <Rect x={v.x} y={v.y} width={v.w} height={v.h} fill="#FFFFFF" />
          {lights.map((l, i) => (
            <Circle key={i} cx={l.x} cy={l.y} r={l.r} fill="url(#noc-svetlo)" />
          ))}
        </Mask>
      </Defs>
      <Rect x={v.x} y={v.y} width={v.w} height={v.h} fill="#0B1838" opacity={dark} mask="url(#noc-maska)" />
    </G>
  );
}

export function Lantern({ x, time }: { x: number; time: number }) {
  const flicker = 0.85 + Math.sin(time * 7 + x) * 0.1;
  return (
    <G transform={tr(x + 62, GROUND_Y + 4)}>
      <Path d="M0 0 L0 -120 Q0 -134 14 -134" stroke="#5A4A3A" strokeWidth={5} fill="none" strokeLinecap="round" />
      <Circle cx={14} cy={-110} r={46} fill="#FFE27A" opacity={0.22 * flicker} />
      <Rect x={2} y={-126} width={24} height={30} rx={8} fill="#FFE27A" opacity={flicker} />
      <Rect x={0} y={-130} width={28} height={6} rx={3} fill="#5A4A3A" />
    </G>
  );
}

function loop(seed: number, time: number, speed: number, span: number) {
  return (((seed * 7919) % span) + time * speed) % span;
}

export const SeasonLayer = function SeasonLayer({ season, time, v, reduced }: { season: Season | null; time: number; v: View; reduced: boolean }) {
  if (!season) return null;
  const t = reduced ? 0 : time;
  const tint = { jaro: null, leto: '#FFE9A8', podzim: '#F2A65A', zima: '#DCEBFA' }[season];
  const tintOpacity = { jaro: 0, leto: 0.08, podzim: 0.1, zima: 0.2 }[season];
  const count = reduced ? 0 : season === 'zima' ? 26 : season === 'leto' ? 6 : 14;
  return (
    <G>
      {tint && <Rect x={v.x} y={v.y} width={v.w} height={v.h} fill={tint} opacity={tintOpacity} />}
      {season === 'zima' && <Rect x={v.x} y={GROUND_Y - 40} width={v.w} height={v.y + v.h - GROUND_Y + 40} fill="#FFFFFF" opacity={0.55} />}
      {season === 'zima' &&
        Array.from({ length: 9 }, (_, i) => (
          <Ellipse key={`s${i}`} cx={v.x + (i + 0.5) * (v.w / 9)} cy={GROUND_Y + 70 + (i % 2) * 18} rx={v.w / 12} ry={22} fill="#FFFFFF" opacity={0.9} />
        ))}
      {Array.from({ length: count }, (_, i) => {
        const x = v.x + loop(i + 3, t + Math.sin(t * 0.7 + i) * 0.6, season === 'zima' ? 6 : 14, v.w);
        const y = v.y + loop(i * 5 + 11, t, season === 'zima' ? 46 : 38, v.h);
        if (season === 'zima') return <Circle key={i} cx={x} cy={y} r={5 + (i % 3) * 2} fill="#FFFFFF" opacity={0.9} />;
        if (season === 'jaro') return <Ellipse key={i} cx={x} cy={y} rx={8} ry={5} fill={i % 2 ? '#F7B8D0' : '#FFFFFF'} transform={`rotate(${t * 60 + i * 40} ${x} ${y})`} />;
        if (season === 'podzim') return <Ellipse key={i} cx={x} cy={y} rx={12} ry={6} fill={['#E07B2E', '#C8452A', '#F2B33A'][i % 3]} transform={`rotate(${t * 80 + i * 50} ${x} ${y})`} />;
        const by = v.y + v.h * 0.35 + Math.sin(t * 1.3 + i) * 60;
        const bx = v.x + loop(i * 13 + 7, t, 30, v.w);
        return (
          <G key={i} transform={tr(bx, by)}>
            <Ellipse cx={-7} rx={8} ry={10 * Math.abs(Math.sin(t * 9 + i))} fill={['#F9BA0A', '#EC8FBB', '#3BAEFD'][i % 3]} />
            <Ellipse cx={7} rx={8} ry={10 * Math.abs(Math.sin(t * 9 + i))} fill={['#F9BA0A', '#EC8FBB', '#3BAEFD'][i % 3]} />
          </G>
        );
      })}
    </G>
  );
};

export function Garland({ colors, v, time }: { colors: string[]; v: View; time: number }) {
  if (!colors.length) return null;
  const left = Math.max(v.x + 120, 160);
  const right = Math.min(v.x + v.w - 120, SCENE_W - 160);
  const top = Math.max(v.y + 70, 40);
  const sag = 70;
  const at = (p: number) => ({ x: left + (right - left) * p, y: top + Math.sin(p * Math.PI) * sag });
  const step = 1 / (colors.length + 1);
  return (
    <G>
      <Path d={`M${left} ${top} Q${(left + right) / 2} ${top + sag * 2} ${right} ${top}`} stroke="#8A5A3A" strokeWidth={4} fill="none" />
      {colors.map((c, i) => {
        const p = at(step * (i + 1));
        const swing = Math.sin(time * 2 + i) * 6;
        return <Path key={i} d="M-22 0 L22 0 L0 46 Z" fill={c} stroke="#FFFFFF" strokeWidth={3} strokeLinejoin="round" transform={tr(p.x, p.y, swing)} />;
      })}
    </G>
  );
}

type DecorKind = 'trava' | 'kvitek' | 'kamen' | 'musle' | 'snih' | 'kvetinac';

const DECOR: Record<Scenery, DecorKind[]> = {
  louka: ['trava', 'kvitek', 'trava'],
  zahradka: ['kvitek', 'trava', 'kamen'],
  les: ['trava', 'kamen', 'trava'],
  poust: ['kamen', 'kamen', 'trava'],
  hory: ['kamen', 'trava', 'kvitek'],
  rybnicek: ['trava', 'kvitek', 'kamen'],
  more: ['musle', 'kamen', 'musle'],
  noc: ['trava', 'kvitek', 'kamen'],
  dzungle: ['trava', 'kvitek', 'trava'],
  sad: ['trava', 'kvitek', 'kamen'],
  arktida: ['snih', 'kamen', 'snih'],
  balkon: ['kvetinac', 'kvitek', 'kvetinac'],
};

function DecorItem({ kind, color, flip }: { kind: DecorKind; color: string; flip: boolean }) {
  switch (kind) {
    case 'trava':
      return (
        <G>
          {[-14, -4, 6, 16].map((x, i) => (
            <Path key={x} d={`M${x} 0 Q${x + (flip ? -6 : 6)} ${-20 - (i % 2) * 10} ${x + (flip ? -10 : 10)} ${-34 - (i % 2) * 8}`} stroke={color} strokeWidth={5} fill="none" strokeLinecap="round" />
          ))}
        </G>
      );
    case 'kvitek':
      return (
        <G>
          <Path d="M0 0 L0 -26" stroke="#5E9B2E" strokeWidth={4} />
          {[0, 72, 144, 216, 288].map((a) => (
            <Circle key={a} cx={Math.cos((a * Math.PI) / 180) * 7} cy={-30 + Math.sin((a * Math.PI) / 180) * 7} r={6} fill={flip ? '#FFFFFF' : '#F7B8D0'} />
          ))}
          <Circle cy={-30} r={4} fill="#FBCC03" />
        </G>
      );
    case 'kamen':
      return <Path d="M-26 0 Q-28 -22 -4 -26 Q24 -26 28 -4 Q28 0 22 0 Z" fill="#B7B2A4" />;
    case 'musle':
      return <Path d="M-16 0 Q-18 -24 0 -26 Q18 -24 16 0 Z" fill={flip ? '#F7A6C8' : '#FFF4E0'} stroke="#E3C98A" strokeWidth={2} />;
    case 'snih':
      return <Ellipse cy={-8} rx={40} ry={16} fill="#FFFFFF" stroke="#CFDDEA" strokeWidth={3} />;
    default:
      return (
        <G>
          <Path d="M-18 -30 L18 -30 L13 0 L-13 0 Z" fill="#C8693A" />
          <Circle cx={-8} cy={-38} r={10} fill="#5E9B2E" />
          <Circle cx={8} cy={-40} r={11} fill="#4F9112" />
          <Circle cy={-48} r={5} fill="#ED3E1D" />
        </G>
      );
  }
}

export const Decor = memo(function Decor({ scenery, index, color, avoid: avoidKey }: { scenery: Scenery; index: number; color: string; avoid: string }) {
  const kinds = DECOR[scenery];
  const avoid = avoidKey.split(',').map(Number);
  const items = Array.from({ length: 7 }, (_, i) => {
    const x = 180 + ((i * 211 + index * 97) % 1240);
    return { x, y: GROUND_Y + 62 + ((i * 37 + index * 13) % 30), kind: kinds[(i + index) % kinds.length], flip: (i + index) % 2 === 0 };
  }).filter((it) => avoid.every((a) => Math.abs(a - it.x) > 70));
  return (
    <G>
      {items.map((it, i) => (
        <G key={i} transform={tr(it.x, it.y, 0, it.flip ? -1 : 1, 1)}>
          <DecorItem kind={it.kind} color={color} flip={it.flip} />
        </G>
      ))}
    </G>
  );
});

export function SeedSlots({ slots, time, planting, reduced }: { slots: number[]; time: number; planting: number; reduced: boolean }) {
  return (
    <G>
      {slots.map((x) => {
        const pulse = reduced ? 0.5 : (Math.sin(time * 3 + x) + 1) / 2;
        return (
          <G key={x} transform={tr(x, GROUND_Y)}>
            <Ellipse cy={-4} rx={40} ry={13} fill="#853B0F" opacity={0.85} />
            <Ellipse cy={-8} rx={26} ry={6} fill="#A0642E" />
            <Circle cy={-10} r={44 + pulse * 8} fill="none" stroke="#A8C729" strokeWidth={4} strokeDasharray="8 10" opacity={0.6 + planting} />
          </G>
        );
      })}
    </G>
  );
}

export function SeedCarry({ at, time, reduced }: { at: Point; time: number; reduced: boolean }) {
  const swing = reduced ? 0 : Math.sin(time * 4) * 8;
  return (
    <G transform={tr(at.x, at.y + 120, swing)}>
      <Path d="M0 -40 L0 -10" stroke="#8A5A3A" strokeWidth={3} />
      <Path d="M-22 -10 L22 -10 L18 26 Q0 34 -18 26 Z" fill="#E9D3A8" stroke="#B08458" strokeWidth={3} />
      <G transform={tr(0, 10, 0, 0.7, 0.7)}>
        <SeedIcon />
      </G>
    </G>
  );
}
