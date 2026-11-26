import { memo } from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { FAMILY } from '../game/catalog';
import type { FamilyId } from '../game/types';
import { CloudBody, CloudDefs } from './Kapka';
import { tr } from './svg';

export const Zofka = memo(function Zofka({ x, y, hop, time, scale = 1 }: { x: number; y: number; hop: number; time: number; scale?: number }) {
  const h = Math.sin(Math.min(1, hop) * Math.PI) * 40;
  const breathe = 1 + Math.sin(time * 2.2) * 0.02;
  return (
    <G transform={tr(x, y - h, 0, scale * breathe, scale / breathe)}>
      <Ellipse cy={h + 2} rx={44} ry={9} fill="#2A3A20" opacity={0.18} />
      <Ellipse cx={-30} cy={-6} rx={22} ry={12} fill="#5FA845" />
      <Ellipse cx={30} cy={-6} rx={22} ry={12} fill="#5FA845" />
      <Ellipse cy={-34} rx={46} ry={36} fill="#7CC255" />
      <Ellipse cy={-24} rx={30} ry={22} fill="#D8F0A8" />
      {[-20, 20].map((ex) => (
        <G key={ex} transform={tr(ex, -70)}>
          <Circle r={17} fill="#7CC255" />
          <Circle r={12} fill="#FFFFFF" />
          <Circle cx={2} cy={2} r={7} fill="#23395B" />
          <Circle cx={-1} cy={-1} r={2.6} fill="#FFFFFF" />
        </G>
      ))}
      <Ellipse cx={-34} cy={-46} rx={8} ry={5} fill="#FCA19E" opacity={0.8} />
      <Ellipse cx={34} cy={-46} rx={8} ry={5} fill="#FCA19E" opacity={0.8} />
      <Path d={hop > 0 ? 'M-16 -48 Q0 -30 16 -48 Q0 -40 -16 -48 Z' : 'M-16 -48 Q0 -36 16 -48'} stroke="#2F6B1E" strokeWidth={3.5} fill={hop > 0 ? '#B8322D' : 'none'} strokeLinecap="round" />
      <Path d="M-14 -2 L-24 6 M14 -2 L24 6" stroke="#5FA845" strokeWidth={8} strokeLinecap="round" />
    </G>
  );
});

export const FamilyCloud = memo(function FamilyCloud({ id, x, y, time, happy = true, size = 0.8 }: { id: FamilyId; x: number; y: number; time: number; happy?: boolean; size?: number }) {
  const f = FAMILY[id];
  const float = Math.sin(time * 1.4 + x * 0.01) * 6;
  const key = `rod-${id}`;
  return (
    <G transform={tr(x, y + float, 0, f.scale * size)}>
      <CloudDefs id={key} tint={f.tint} />
      <CloudBody id={key} opacity={f.translucent ? 0.75 : 1} aspect={f.aspect / 1.5} />
      {f.rainbow && (
        <G>
          {['#ED3E1D', '#F9BA0A', '#A8C729', '#3BAEFD', '#BD8EFA'].map((c, i) => (
            <Ellipse key={c} cx={-50 + i * 2} cy={28} rx={14 - i * 2} ry={8 - i} fill={c} opacity={0.7} />
          ))}
          {['#ED3E1D', '#F9BA0A', '#A8C729', '#3BAEFD', '#BD8EFA'].map((c, i) => (
            <Ellipse key={`r${c}`} cx={50 - i * 2} cy={28} rx={14 - i * 2} ry={8 - i} fill={c} opacity={0.7} />
          ))}
        </G>
      )}
      {!f.rainbow && (
        <G>
          <Ellipse cx={-50} cy={28} rx={15} ry={8} fill="#FCA19E" opacity={0.7} />
          <Ellipse cx={50} cy={28} rx={15} ry={8} fill="#FCA19E" opacity={0.7} />
        </G>
      )}
      {[-28, 28].map((ex) =>
        happy ? (
          <Path key={ex} d={`M${ex - 11} 8 Q${ex} -5 ${ex + 11} 8`} stroke="#23395B" strokeWidth={5} fill="none" strokeLinecap="round" />
        ) : (
          <G key={ex} transform={tr(ex, 6)}>
            <Ellipse rx={11} ry={13} fill="#23395B" />
            <Circle cx={-3} cy={-5} r={4} fill="#FFFFFF" />
          </G>
        ),
      )}
      <Path d="M-14 32 Q0 46 14 32" stroke="#23395B" strokeWidth={4} fill="none" strokeLinecap="round" />
      {f.glasses && (
        <G transform={tr(0, 6)}>
          <Circle cx={-28} r={19} fill="none" stroke="#8A4B1E" strokeWidth={4} />
          <Circle cx={28} r={19} fill="none" stroke="#8A4B1E" strokeWidth={4} />
          <Path d="M-9 0 L9 0" stroke="#8A4B1E" strokeWidth={4} />
        </G>
      )}
      {f.scarf && <Path d="M-80 54 Q0 80 80 54 L80 70 Q0 96 -80 70 Z" fill={f.scarf} />}
      {f.beard && <Path d="M-60 40 Q-50 110 0 120 Q50 110 60 40 Q30 66 0 60 Q-30 66 -60 40 Z" fill="#FFFFFF" stroke="#DCE6F5" strokeWidth={3} />}
      {f.bow && (
        <G transform={tr(70, -64)}>
          <Path d="M0 0 L-24 -14 L-24 14 Z" fill={f.bow} />
          <Path d="M0 0 L24 -14 L24 14 Z" fill={f.bow} />
          <Circle r={7} fill="#E2CCFF" />
        </G>
      )}
    </G>
  );
});

export const Fuk = memo(function Fuk({ x, y, time, opacity }: { x: number; y: number; time: number; opacity: number }) {
  const spin = time * 140;
  return (
    <G transform={tr(x, y)} opacity={opacity}>
      <G transform={`rotate(${spin})`}>
        <Path d="M0 -50 Q46 -46 44 0 Q40 34 6 34 Q-22 30 -20 6 Q-16 -12 2 -10" stroke="#FFFFFF" strokeWidth={14} fill="none" strokeLinecap="round" opacity={0.9} />
      </G>
      <Circle cx={-10} cy={-6} r={6} fill="#23395B" />
      <Circle cx={12} cy={-6} r={6} fill="#23395B" />
      <Circle cx={-12} cy={-8} r={2} fill="#FFFFFF" />
      <Circle cx={10} cy={-8} r={2} fill="#FFFFFF" />
      <Path d="M-8 8 Q2 16 12 6" stroke="#23395B" strokeWidth={3} fill="none" strokeLinecap="round" />
    </G>
  );
});

export const Sun = memo(function Sun({ x, y, time, face, strength = 0 }: { x: number; y: number; time: number; face: boolean; strength?: number }) {
  const pulse = 1 + Math.sin(time * 2) * 0.04 * (1 + strength);
  return (
    <G transform={tr(x, y, 0, pulse)}>
      <Circle r={110} fill="#FFF3B0" opacity={0.35} />
      <G transform={`rotate(${time * 8})`}>
        {Array.from({ length: 10 }, (_, i) => (
          <Path key={i} d="M-12 -78 Q0 -112 12 -78 Z" fill="#FDD54A" transform={`rotate(${i * 36})`} />
        ))}
      </G>
      <Circle r={66} fill="#FDE87C" />
      <Circle r={58} fill="#FFD23F" />
      {face && (
        <G>
          <Path d="M-30 -4 Q-20 -16 -10 -4 M10 -4 Q20 -16 30 -4" stroke="#B8640A" strokeWidth={5} fill="none" strokeLinecap="round" />
          <Ellipse cx={-34} cy={14} rx={10} ry={6} fill="#FCA19E" />
          <Ellipse cx={34} cy={14} rx={10} ry={6} fill="#FCA19E" />
          <Path d="M-18 16 Q0 34 18 16" stroke="#B8640A" strokeWidth={5} fill="none" strokeLinecap="round" />
        </G>
      )}
    </G>
  );
});

export const Moon = memo(function Moon({ x, y }: { x: number; y: number }) {
  return (
    <G transform={tr(x, y)}>
      <Circle r={90} fill="#FFF6C9" opacity={0.18} />
      <Circle r={52} fill="#FFF6C9" />
      <Circle cx={18} cy={-10} r={46} fill="#5A6FA8" opacity={0.0} />
      <Circle cx={-16} cy={-8} r={8} fill="#F2E7B0" />
      <Circle cx={14} cy={16} r={6} fill="#F2E7B0" />
      <Path d="M-20 20 Q0 32 20 20" stroke="#D8C98A" strokeWidth={4} fill="none" strokeLinecap="round" />
    </G>
  );
});

export function Hand({ from, to, time }: { from: { x: number; y: number }; to: { x: number; y: number }; time: number }) {
  const t = (time % 1.6) / 1.6;
  const ease = t < 0.75 ? Math.sin((t / 0.75) * (Math.PI / 2)) : 1;
  const x = from.x + (to.x - from.x) * ease;
  const y = from.y + 90 + (to.y - from.y - 90) * ease;
  const opacity = t > 0.85 ? (1 - t) / 0.15 : 1;
  return (
    <G transform={tr(x, y)} opacity={opacity}>
      <Circle r={30} fill="#F9BA0A" opacity={0.25} />
      <Rect x={-6} y={-6} width={22} height={58} rx={11} fill="#FFE3CF" stroke="#E8B89A" strokeWidth={3} />
      <Rect x={-22} y={22} width={58} height={56} rx={24} fill="#FFE3CF" stroke="#E8B89A" strokeWidth={3} />
    </G>
  );
}
