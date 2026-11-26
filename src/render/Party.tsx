import { Circle, G, Path, Rect } from 'react-native-svg';
import { SCENE_W } from '../game/constants';
import { tr } from './svg';

const CONFETTI = ['#ED3E1D', '#F9BA0A', '#FBE15A', '#A8C729', '#3BAEFD', '#BD8EFA', '#EC8FBB'];

export function Rays({ x, y, time, strength }: { x: number; y: number; time: number; strength: number }) {
  if (strength <= 0) return null;
  return (
    <G transform={tr(x, y, time * 18, 0.35 + strength * 0.3)} opacity={0.38 * strength}>
      {Array.from({ length: 16 }, (_, i) => (
        <Path key={i} d="M-34 0 Q0 -320 0 -320 Q0 -320 34 0 Z" fill={i % 2 ? '#FFF3B0' : '#FFFFFF'} transform={`rotate(${i * 22.5})`} />
      ))}
      <Circle r={150} fill="#FFF8D6" opacity={0.7} />
    </G>
  );
}

export function Confetti({ time, start, viewTop, count = 46 }: { time: number; start: number; viewTop: number; count?: number }) {
  const age = time - start;
  if (age < 0 || age > 6) return null;
  const fade = age > 4.5 ? (6 - age) / 1.5 : 1;
  return (
    <G opacity={fade}>
      {Array.from({ length: count }, (_, i) => {
        const x = ((i * 137.5) % SCENE_W) + Math.sin(age * 2 + i) * 40;
        const y = viewTop - 40 + ((age * (220 + (i % 5) * 45) + i * 37) % 1000);
        const spin = age * (180 + (i % 7) * 60) + i * 40;
        const c = CONFETTI[i % CONFETTI.length];
        return i % 3 === 0 ? (
          <Circle key={i} cx={x} cy={y} r={7} fill={c} />
        ) : (
          <Rect key={i} x={-9} y={-5} width={18} height={10} rx={3} fill={c} transform={tr(x, y, spin, 1, Math.abs(Math.cos(spin / 40)) + 0.2)} />
        );
      })}
    </G>
  );
}

function Heart({ size, color }: { size: number; color: string }) {
  const s = size;
  return <Path d={`M0 ${s * 0.35} C${-s} ${-s * 0.3} ${-s * 0.45} ${-s} 0 ${-s * 0.45} C${s * 0.45} ${-s} ${s} ${-s * 0.3} 0 ${s * 0.35} Z`} fill={color} />;
}

function Note({ color }: { color: string }) {
  return (
    <G>
      <Circle cx={0} cy={0} r={9} fill={color} />
      <Rect x={6} y={-34} width={5} height={34} rx={2} fill={color} />
      <Path d="M11 -34 Q26 -28 22 -14" stroke={color} strokeWidth={5} fill="none" strokeLinecap="round" />
    </G>
  );
}

export function Joy({ x, y, time }: { x: number; y: number; time: number }) {
  return (
    <G>
      {Array.from({ length: 6 }, (_, i) => {
        const phase = (time * 0.55 + i / 6) % 1;
        const px = x + Math.sin(phase * 6 + i * 2) * 50 + (i - 2.5) * 22;
        const py = y - 60 - phase * 220;
        const o = phase < 0.15 ? phase / 0.15 : phase > 0.75 ? (1 - phase) / 0.25 : 1;
        return (
          <G key={i} transform={tr(px, py, Math.sin(time * 3 + i) * 15, 0.8 + phase * 0.5)} opacity={o}>
            {i % 2 ? <Heart size={16} color={i % 4 === 1 ? '#FF6F91' : '#ED3E1D'} /> : <Note color={i % 4 === 0 ? '#3BAEFD' : '#BD8EFA'} />}
          </G>
        );
      })}
    </G>
  );
}

export function Stars({ x, y, time }: { x: number; y: number; time: number }) {
  return (
    <G>
      {Array.from({ length: 5 }, (_, i) => {
        const a = time * 1.4 + (i * Math.PI * 2) / 5;
        const s = 0.6 + Math.abs(Math.sin(time * 4 + i)) * 0.6;
        return (
          <G key={i} transform={tr(x + Math.cos(a) * 130, y - 70 + Math.sin(a) * 60, time * 90, s)}>
            <Path d="M0 -16 Q3 -3 16 0 Q3 3 0 16 Q-3 3 -16 0 Q-3 -3 0 -16 Z" fill="#FBCC03" />
          </G>
        );
      })}
    </G>
  );
}
