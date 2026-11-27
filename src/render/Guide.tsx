import type React from 'react';
import { Circle, Ellipse, G, Path } from 'react-native-svg';
import { GROUND_Y } from '../game/constants';
import type { Goal } from '../game/types';
import { tr } from './svg';

const COLOR: Record<Goal['kind'], string> = { voda: '#3BAEFD', rostlina: '#F9BA0A', seminko: '#A8C729' };

export function SeedIcon({ size = 1 }: { size?: number }) {
  return (
    <G transform={tr(0, 0, 0, size, size)}>
      <Ellipse cy={8} rx={13} ry={17} fill="#A0642E" />
      <Ellipse cx={-4} cy={2} rx={4} ry={7} fill="#D9A066" opacity={0.8} />
      <Path d="M0 -8 Q0 -22 -12 -26 Q-2 -14 0 -8 Z M0 -8 Q2 -24 16 -24 Q6 -12 0 -8 Z" fill="#75A023" />
    </G>
  );
}

export function FlowerIcon({ color, size = 1 }: { color: string; size?: number }) {
  return (
    <G transform={tr(0, 0, 0, size, size)}>
      {[0, 72, 144, 216, 288].map((a) => (
        <Circle key={a} cx={Math.cos((a * Math.PI) / 180) * 12} cy={Math.sin((a * Math.PI) / 180) * 12 - 4} r={10} fill={color} />
      ))}
      <Circle cy={-4} r={8} fill="#FBCC03" />
      <Path d="M0 8 L0 26" stroke="#4F9112" strokeWidth={5} strokeLinecap="round" />
    </G>
  );
}

export function Bubble({ x, y, color, flip = false, children }: { x: number; y: number; color: string; flip?: boolean; children: React.ReactNode }) {
  const d = flip ? -1 : 1;
  return (
    <G transform={tr(x, y)}>
      <Circle cx={-44 * d} cy={56} r={7} fill="#FFFFFF" opacity={0.95} />
      <Circle cx={-28 * d} cy={38} r={11} fill="#FFFFFF" opacity={0.95} />
      <Circle r={38} fill="#FFFFFF" />
      <Circle r={38} fill="none" stroke={color} strokeWidth={4} opacity={0.6} />
      {children}
    </G>
  );
}

export function GoalMarker({ goal, time, reduced, lift = 0 }: { goal: Goal; time: number; reduced: boolean; lift?: number }) {
  if (goal.busy) return null;
  const color = COLOR[goal.kind];
  const bounce = reduced ? 0 : Math.abs(Math.sin(time * 3.2)) * 26;
  const pulse = reduced ? 0.5 : (time * 0.9) % 1;
  const top = (goal.kind === 'rostlina' ? GROUND_Y - 260 : GROUND_Y - 150) - lift;
  return (
    <G>
      <Ellipse cx={goal.x} cy={GROUND_Y - 6} rx={70 + pulse * 50} ry={18 + pulse * 12} fill="none" stroke={color} strokeWidth={6} opacity={0.8 * (1 - pulse)} />
      <Ellipse cx={goal.x} cy={GROUND_Y - 6} rx={64} ry={16} fill={color} opacity={0.18} />
      <G transform={tr(goal.x, top - bounce)}>
        <Path d="M-26 -30 L26 -30 L26 4 L44 4 L0 46 L-44 4 L-26 4 Z" fill="#FFFFFF" stroke={color} strokeWidth={8} strokeLinejoin="round" />
        <Circle cx={-10} cy={-16} r={5} fill={color} opacity={0.45} />
      </G>
    </G>
  );
}

export function Wish({ x, y, scale, kind }: { x: number; y: number; scale: number; kind: Goal['kind'] }) {
  return (
    <Bubble x={x + 125 * scale} y={y - 120 * scale} color={COLOR[kind]}>
      {kind === 'voda' ? (
        <G>
          <Path d="M0 -22 Q17 0 17 9 a17 17 0 0 1 -34 0 Q-17 0 0 -22 Z" fill="#3BAEFD" />
          <Ellipse cx={-6} cy={6} rx={4} ry={7} fill="#FFFFFF" opacity={0.7} />
        </G>
      ) : kind === 'seminko' ? (
        <SeedIcon />
      ) : (
        <FlowerIcon color="#ED3E1D" />
      )}
    </Bubble>
  );
}
