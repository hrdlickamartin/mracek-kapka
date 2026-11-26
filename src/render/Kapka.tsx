import { memo } from 'react';
import { Circle, Defs, Ellipse, G, Path, RadialGradient, Rect, Stop } from 'react-native-svg';
import type { Mood } from '../game/types';
import type { WardrobeId, WardrobeSlot } from '../progression/wardrobe';
import { wardrobeItem } from '../progression/wardrobe';

export const PUFFS: [number, number, number][] = [
  [-92, 28, 40],
  [-62, -4, 54],
  [-22, -38, 62],
  [32, -40, 58],
  [78, -6, 52],
  [100, 30, 38],
  [-40, 34, 56],
  [30, 34, 58],
];

export function CloudDefs({ id, tint = '#FEFCFC' }: { id: string; tint?: string }) {
  return (
    <Defs>
      <RadialGradient id={`${id}-telo`} cx="45%" cy="35%" r="70%">
        <Stop offset="0" stopColor="#FFFFFF" />
        <Stop offset="0.55" stopColor={tint} />
        <Stop offset="1" stopColor="#D9E2F1" />
      </RadialGradient>
    </Defs>
  );
}

export function CloudBody({ id, opacity = 1, water = 0, aspect = 1 }: { id: string; opacity?: number; water?: number; aspect?: number }) {
  return (
    <G opacity={opacity} transform={`scale(${aspect} ${1})`}>
      <Ellipse cx={4} cy={62} rx={120} ry={16} fill="#B9C7DF" opacity={0.35} />
      {PUFFS.map(([x, y, r], i) => (
        <Circle key={`s${i}`} cx={x + 3} cy={y + 6} r={r} fill="#C9D6EA" />
      ))}
      {PUFFS.map(([x, y, r], i) => (
        <Circle key={`b${i}`} cx={x} cy={y} r={r} fill={`url(#${id}-telo)`} />
      ))}
      {water > 0.02 && PUFFS.map(([x, y, r], i) => <Circle key={`w${i}`} cx={x} cy={y + 4} r={r * 0.92} fill="#8DD9FA" opacity={water * 0.22} />)}
      <Circle cx={-36} cy={-58} r={18} fill="#FFFFFF" opacity={0.85} />
      <Circle cx={-60} cy={-24} r={9} fill="#FFFFFF" opacity={0.7} />
    </G>
  );
}

function OpenEye({ x, look = 0, big = false }: { x: number; look?: number; big?: boolean }) {
  const s = big ? 1.2 : 1;
  return (
    <G transform={`translate(${x} ${6})`}>
      <Ellipse rx={13 * s} ry={16 * s} fill="#23395B" />
      <Circle cx={1 + look * 3} cy={3 + Math.abs(look) * 2} r={8.5 * s} fill="#2A8FE0" />
      <Circle cx={1 + look * 3} cy={4 + Math.abs(look) * 2} r={4.5 * s} fill="#0E2547" />
      <Circle cx={-4} cy={-6} r={4.6 * s} fill="#FFFFFF" />
      <Circle cx={5} cy={6} r={2.2 * s} fill="#FFFFFF" />
    </G>
  );
}

function HappyEye({ x }: { x: number }) {
  return <Path d={`M${x - 12} 9 Q${x} -6 ${x + 12} 9`} stroke="#23395B" strokeWidth={5} fill="none" strokeLinecap="round" />;
}

function SleepEye({ x }: { x: number }) {
  return <Path d={`M${x - 12} 4 Q${x} 14 ${x + 12} 4`} stroke="#23395B" strokeWidth={4.5} fill="none" strokeLinecap="round" />;
}

function Mouth({ mood }: { mood: Mood }) {
  if (mood === 'uzas') return <Ellipse cx={0} cy={36} rx={9} ry={11} fill="#B8322D" />;
  if (mood === 'nasavani') return <Ellipse cx={0} cy={36} rx={5} ry={5} fill="#B8322D" />;
  if (mood === 'spanek') return <Path d="M-8 34 Q-4 38 0 34 Q4 38 8 34" stroke="#23395B" strokeWidth={3} fill="none" strokeLinecap="round" />;
  if (mood === 'radost' || mood === 'dest' || mood === 'snezeni' || mood === 'let' || mood === 'plny' || mood === 'mavani') {
    return (
      <G>
        <Path d="M-16 29 Q0 31 16 29 Q14 50 0 50 Q-14 50 -16 29 Z" fill="#B8322D" />
        <Ellipse cx={0} cy={44} rx={8} ry={4.5} fill="#F2827C" />
        <Rect x={-9} y={29} width={7} height={5} rx={1.5} fill="#FFFFFF" />
      </G>
    );
  }
  if (mood === 'prazdna') return <Path d="M-10 36 Q0 40 10 36" stroke="#23395B" strokeWidth={3.5} fill="none" strokeLinecap="round" />;
  return <Path d="M-13 32 Q0 44 13 32" stroke="#23395B" strokeWidth={4} fill="none" strokeLinecap="round" />;
}

function Eyes({ mood, blink, wink }: { mood: Mood; blink: boolean; wink: boolean }) {
  if (mood === 'spanek') return (<G><SleepEye x={-32} /><SleepEye x={32} /></G>);
  if (mood === 'radost' || mood === 'dest' || mood === 'snezeni' || mood === 'nasavani') return (<G><HappyEye x={-32} /><HappyEye x={32} /></G>);
  if (wink || mood === 'mrk') return (<G><OpenEye x={-32} /><HappyEye x={32} /></G>);
  if (blink) return (<G><SleepEye x={-32} /><SleepEye x={32} /></G>);
  const look = mood === 'prazdna' ? 0 : 0;
  return (<G><OpenEye x={-32} look={look} big={mood === 'uzas'} /><OpenEye x={32} look={look} big={mood === 'uzas'} /></G>);
}

function Cheeks({ rainbow, puffed }: { rainbow: boolean; puffed: boolean }) {
  const r = puffed ? 1.5 : 1;
  if (rainbow) {
    return (
      <G>
        {[-54, 54].map((x) => (
          <G key={x}>
            <Ellipse cx={x} cy={28} rx={17} ry={10} fill="#ED3E1D" opacity={0.55} />
            <Ellipse cx={x} cy={28} rx={12} ry={7} fill="#F9BA0A" opacity={0.6} />
            <Ellipse cx={x} cy={28} rx={7} ry={4} fill="#3BAEFD" opacity={0.6} />
          </G>
        ))}
      </G>
    );
  }
  return (
    <G>
      <Ellipse cx={-54} cy={28} rx={16 * r} ry={9 * r} fill="#FCA19E" opacity={0.75} />
      <Ellipse cx={54} cy={28} rx={16 * r} ry={9 * r} fill="#FCA19E" opacity={0.75} />
    </G>
  );
}

function Arms({ mood }: { mood: Mood }) {
  if (mood === 'plny') {
    return (
      <G>
        <Path d="M0 50 Q22 78 0 104 Q-22 78 0 50 Z" fill="#8DD9FA" />
        <Ellipse cx={-6} cy={84} rx={4} ry={8} fill="#FFFFFF" opacity={0.7} />
        <Circle cx={-24} cy={80} r={14} fill="#FEFCFC" />
        <Circle cx={24} cy={80} r={14} fill="#FEFCFC" />
      </G>
    );
  }
  if (mood === 'mavani') return <Circle cx={118} cy={-40} r={16} fill="#FEFCFC" />;
  if (mood === 'vysusena') {
    return (
      <G>
        <Circle cx={-112} cy={0} r={15} fill="#FEFCFC" />
        <Path d="M78 -48 Q86 -34 78 -26 Q70 -34 78 -48 Z" fill="#8DD9FA" />
      </G>
    );
  }
  return null;
}

function Wardrobe({ worn }: { worn: Partial<Record<WardrobeSlot, WardrobeId>> }) {
  const hat = worn.hlava ? wardrobeItem(worn.hlava) : null;
  const eyes = worn.oci ? wardrobeItem(worn.oci) : null;
  const neck = worn.krk ? wardrobeItem(worn.krk) : null;
  return (
    <G>
      {neck?.id === 'sala' && (
        <G>
          <Path d="M-70 52 Q0 76 70 52 L70 68 Q0 92 -70 68 Z" fill={neck.color} />
          <Rect x={30} y={60} width={22} height={44} rx={8} fill={neck.color} />
        </G>
      )}
      {neck?.id === 'masle' && (
        <G transform={`translate(${70} ${-60})`}>
          <Path d="M0 0 L-26 -16 L-26 16 Z" fill={neck.color} />
          <Path d="M0 0 L26 -16 L26 16 Z" fill={neck.color} />
          <Circle r={8} fill="#F7B8D0" />
        </G>
      )}
      {hat && hat.id !== 'korunka' && (
        <G transform={`translate(${0} ${-88})`}>
          <Path d="M-58 14 Q-58 -46 0 -46 Q58 -46 58 14 Z" fill={hat.color} />
          <Rect x={-64} y={4} width={128} height={20} rx={10} fill="#FFFFFF" opacity={0.9} />
          <Circle cx={0} cy={-50} r={14} fill="#FFFFFF" />
        </G>
      )}
      {hat?.id === 'korunka' && (
        <G transform={`translate(${0} ${-92})`}>
          {[-60, -36, -12, 12, 36, 60].map((x, i) => (
            <G key={x} transform={`translate(${x} ${Math.abs(x) * 0.25})`}>
              {[0, 72, 144, 216, 288].map((a) => (
                <Circle key={a} cx={Math.cos((a * Math.PI) / 180) * 7} cy={Math.sin((a * Math.PI) / 180) * 7} r={6} fill={['#ED3E1D', '#F9BA0A', '#EC8FBB', '#BD8EFA', '#FEFCFC', '#3BAEFD'][i]} />
              ))}
              <Circle r={4} fill="#FBCC03" />
            </G>
          ))}
        </G>
      )}
      {eyes && (
        <G transform={`translate(${0} ${6})`}>
          <Circle cx={-32} r={21} fill={eyes.id === 'slunecni-bryle' ? '#3A2B5E' : 'none'} opacity={eyes.id === 'slunecni-bryle' ? 0.85 : 1} stroke={eyes.color} strokeWidth={5} />
          <Circle cx={32} r={21} fill={eyes.id === 'slunecni-bryle' ? '#3A2B5E' : 'none'} opacity={eyes.id === 'slunecni-bryle' ? 0.85 : 1} stroke={eyes.color} strokeWidth={5} />
          <Path d="M-12 -2 Q0 -8 12 -2" stroke={eyes.color} strokeWidth={5} fill="none" />
        </G>
      )}
    </G>
  );
}

export interface KapkaProps {
  x: number;
  y: number;
  scale: number;
  tilt?: number;
  stretch?: number;
  mood: Mood;
  water?: number;
  blink?: boolean;
  wink?: boolean;
  worn?: Partial<Record<WardrobeSlot, WardrobeId>>;
  glow?: boolean;
}

export const KapkaFigure = memo(function KapkaFigure({ x, y, scale, tilt = 0, stretch = 0, mood, water = 0, blink = false, wink = false, worn = {}, glow = false }: KapkaProps) {
  const empty = mood === 'prazdna' || mood === 'vysusena';
  const sx = scale * (1 + stretch);
  const sy = scale * (1 - stretch);
  return (
    <G transform={`translate(${x} ${y}) rotate(${tilt}) scale(${sx} ${sy})`}>
      <CloudDefs id="kapka" />
      {glow && <Circle r={150} fill="#FFFFFF" opacity={0.35} />}
      {mood === 'let' && (
        <G opacity={0.7}>
          <Path d="M-150 -10 L-210 -10" stroke="#FFFFFF" strokeWidth={8} strokeLinecap="round" />
          <Path d="M-140 20 L-220 20" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" />
        </G>
      )}
      <CloudBody id="kapka" opacity={empty ? 0.82 : 1} water={water} />
      <Cheeks rainbow={worn.tvare === 'duhove-tvaricky'} puffed={mood === 'nasavani'} />
      <Eyes mood={mood} blink={blink} wink={wink} />
      <Mouth mood={mood} />
      <Arms mood={mood} />
      <Wardrobe worn={worn} />
      {mood === 'spanek' && (
        <G transform={`translate(${100} ${-80})`}>
          <Path d="M0 0 L18 0 L0 18 L18 18" stroke="#3BAEFD" strokeWidth={5} fill="none" strokeLinejoin="round" strokeLinecap="round" />
          <Path d="M26 -28 L38 -28 L26 -16 L38 -16" stroke="#3BAEFD" strokeWidth={4} fill="none" strokeLinejoin="round" strokeLinecap="round" />
        </G>
      )}
    </G>
  );
});
