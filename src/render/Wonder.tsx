import type { ReactNode } from 'react';
import { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';
import { GROUND_Y } from '../game/constants';
import type { Wonder } from '../game/types';
import { tr } from './svg';

function Mill({ stage, time, done }: { stage: number; time: number; done: boolean }) {
  const spin = done ? time * 120 : stage * 30;
  const water = stage / 3;
  return (
    <G>
      <Rect x={-70} y={-190} width={22} height={190} rx={6} fill="#8A5A3A" />
      <Rect x={48} y={-190} width={22} height={190} rx={6} fill="#8A5A3A" />
      <Path d="M-90 -196 L0 -250 L90 -196 Z" fill="#B5502A" />
      <Path d={`M-110 -150 L-40 -150`} stroke="#6CC6F7" strokeWidth={14} opacity={0.3 + water * 0.7} strokeLinecap="round" />
      <G transform={tr(0, -110, spin)}>
        <Circle r={82} fill="none" stroke="#6E4420" strokeWidth={10} />
        <Circle r={18} fill="#6E4420" />
        {Array.from({ length: 8 }, (_, i) => (
          <G key={i} transform={tr(0, 0, i * 45)}>
            <Rect x={-4} y={-80} width={8} height={80} fill="#8A5A3A" />
            <Rect x={-16} y={-96} width={32} height={22} rx={4} fill="#A0744A" />
          </G>
        ))}
      </G>
      {done && [0, 1, 2].map((i) => <Path key={i} d={`M${-20 + i * 20} ${-20 + ((time * 120 + i * 30) % 40)} l0 16`} stroke="#BDE9FF" strokeWidth={6} strokeLinecap="round" />)}
      <Ellipse cy={-4} rx={110} ry={16} fill="#4FB8E6" opacity={0.25 + water * 0.55} />
    </G>
  );
}

function Castle({ stage, time, done }: { stage: number; time: number; done: boolean }) {
  const sand = '#F2D78C';
  const dark = '#D9B865';
  return (
    <G>
      <Path d="M-110 0 Q-90 -40 0 -46 Q90 -40 110 0 Z" fill={sand} />
      {stage >= 1 && <Rect x={-36} y={-120} width={72} height={80} fill={sand} />}
      {stage >= 1 && [-30, -10, 10].map((x) => <Rect key={x} x={x} y={-134} width={14} height={16} fill={sand} />)}
      {stage >= 2 && [-90, 50].map((x) => (
        <G key={x}>
          <Rect x={x} y={-90} width={40} height={50} fill={dark} />
          <Rect x={x} y={-102} width={12} height={14} fill={dark} />
          <Rect x={x + 28} y={-102} width={12} height={14} fill={dark} />
        </G>
      ))}
      {stage >= 3 && (
        <G>
          <Rect x={-12} y={-80} width={24} height={40} rx={12} fill="#B08458" />
          <Path d="M0 -134 L0 -190" stroke="#8A5A3A" strokeWidth={4} />
          <Path d={`M0 -190 L${36 + Math.sin(time * 6) * 4} -178 L0 -166 Z`} fill="#ED3E1D" />
          {[-70, 70, -20].map((x, i) => <Ellipse key={x} cx={x} cy={-18 - i * 4} rx={9} ry={7} fill={['#F7A6C8', '#FFFFFF', '#FBE15A'][i]} />)}
        </G>
      )}
      {done && <Circle cy={-90} r={120} fill="#FFF6C9" opacity={0.15} />}
    </G>
  );
}

function Mushrooms({ stage, done, time }: { stage: number; done: boolean; time: number }) {
  const caps: [number, number, number][] = [
    [-58, -10, 16],
    [56, -8, 18],
    [-24, -14, 24],
    [24, -12, 22],
    [-80, -6, 14],
    [82, -6, 14],
  ];
  const shown = [0, 2, 4, 6][stage];
  return (
    <G>
      <Path d="M-50 0 L-44 -78 Q0 -90 44 -78 L50 0 Z" fill="#8A5A3A" />
      <Ellipse cy={-80} rx={44} ry={13} fill="#D8B48A" />
      <Ellipse cy={-80} rx={24} ry={7} fill="none" stroke="#A0744A" strokeWidth={3} />
      {caps.slice(0, shown).map(([x, y, r], i) => {
        const grow = done ? 1 + Math.sin(time * 3 + i) * 0.03 : 1;
        return (
          <G key={i} transform={tr(x, y, 0, grow, grow)}>
            <Rect x={-r * 0.35} y={-r * 1.3} width={r * 0.7} height={r * 1.3} rx={r * 0.3} fill="#FFF4E0" />
            <Path d={`M${-r} ${-r * 1.2} Q${-r} ${-r * 2.3} 0 ${-r * 2.3} Q${r} ${-r * 2.3} ${r} ${-r * 1.2} Z`} fill={stage >= 3 ? '#E5322A' : '#C8814E'} />
            <Circle cx={-r * 0.35} cy={-r * 1.7} r={r * 0.15} fill="#FFFFFF" />
            <Circle cx={r * 0.35} cy={-r * 1.85} r={r * 0.12} fill="#FFFFFF" />
          </G>
        );
      })}
    </G>
  );
}

function Snowman({ stage, time }: { stage: number; time: number }) {
  return (
    <G>
      <Ellipse cy={-6} rx={90} ry={20} fill="#FFFFFF" />
      {stage >= 1 && <Circle cy={-60} r={58} fill="#FFFFFF" stroke="#DCE8F3" strokeWidth={4} />}
      {stage >= 2 && <Circle cy={-150} r={42} fill="#FFFFFF" stroke="#DCE8F3" strokeWidth={4} />}
      {stage >= 2 && [-150, -125].map((y) => <Circle key={y} cy={y + 10} r={5} fill="#3A3A48" />)}
      {stage >= 3 && (
        <G>
          <Circle cy={-218} r={32} fill="#FFFFFF" stroke="#DCE8F3" strokeWidth={4} />
          <Circle cx={-11} cy={-226} r={4.5} fill="#3A3A48" />
          <Circle cx={11} cy={-226} r={4.5} fill="#3A3A48" />
          <Path d="M0 -216 L30 -210 L0 -206 Z" fill="#F39B05" />
          <Path d="M-14 -202 Q0 -194 14 -202" stroke="#3A3A48" strokeWidth={3} fill="none" strokeLinecap="round" />
          <Rect x={-38} y={-194} width={76} height={14} rx={7} fill="#ED3E1D" />
          <Path d={`M22 -184 L${30 + Math.sin(time * 4) * 3} -150 L16 -150 Z`} fill="#ED3E1D" />
          <Path d="M-40 -150 L-90 -180 M40 -150 L88 -184" stroke="#8A5A3A" strokeWidth={6} strokeLinecap="round" />
        </G>
      )}
    </G>
  );
}

function GiantFlower({ stage, time, done }: { stage: number; time: number; done: boolean }) {
  const open = [0, 0.25, 0.6, 1][stage];
  const breathe = done ? 1 + Math.sin(time * 2) * 0.03 : 1;
  return (
    <G>
      {[-150, -30, -120, -60].map((a, i) => (
        <Path key={a} d="M0 0 Q40 -40 120 -16 Q50 10 0 0 Z" fill={i % 2 ? '#2E7A45' : '#4E9B35'} transform={tr(0, -10, a)} />
      ))}
      <Path d="M0 0 L0 -90" stroke="#4E9B35" strokeWidth={14} strokeLinecap="round" />
      <G transform={tr(0, -120, 0, breathe, breathe)}>
        {open < 0.2 ? (
          <Ellipse rx={30} ry={44} fill="#7DB84A" />
        ) : (
          <G>
            {Array.from({ length: 6 }, (_, i) => (
              <Ellipse key={i} cy={-34 * open - 10} rx={26 * open + 8} ry={44 * open + 10} fill={i % 2 ? '#F2622E' : '#EC8FBB'} transform={`rotate(${i * 60})`} />
            ))}
            <Circle r={22 * open + 6} fill="#FBE15A" />
            {stage >= 3 && [0, 72, 144, 216, 288].map((a) => <Circle key={a} cx={Math.cos((a * Math.PI) / 180) * 12} cy={Math.sin((a * Math.PI) / 180) * 12} r={4} fill="#F39B05" />)}
          </G>
        )}
      </G>
    </G>
  );
}

function AppleTree({ stage, wonder }: { stage: number; wonder: Wonder }) {
  const apples: [number, number][] = [
    [-50, -200],
    [40, -230],
    [10, -170],
    [-20, -250],
    [62, -180],
  ];
  const fall = wonder.done > 0 ? Math.min(1, wonder.done / 1.2) : 0;
  return (
    <G>
      <Path d="M0 0 Q8 -80 0 -150" stroke="#8A5A3A" strokeWidth={26} fill="none" strokeLinecap="round" />
      <Circle cy={-210} r={92} fill="#4F9112" />
      <Circle cx={-50} cy={-240} r={52} fill="#86B412" opacity={0.7} />
      <Circle cx={56} cy={-190} r={48} fill="#5E9B2E" />
      <Path d="M60 -2 L70 -40 L140 -40 L150 -2 Z" fill="#B08458" />
      <Path d="M66 -40 Q105 -80 144 -40" stroke="#8A5A3A" strokeWidth={5} fill="none" />
      {apples.slice(0, stage >= 1 ? 5 : 0).map(([x, y], i) => {
        const fallen = i < 3 && fall > 0;
        const tx = fallen ? x + (90 + i * 14 - x) * fall : x;
        const ty = fallen ? y + (-50 - y) * fall * fall : y;
        const color = stage >= 3 ? '#E5322A' : stage === 2 ? '#F39B05' : '#A8C729';
        return <Circle key={i} cx={tx} cy={ty} r={stage >= 2 ? 14 : 9} fill={color} />;
      })}
    </G>
  );
}

function Igloo({ stage }: { stage: number }) {
  const h = [0, 50, 100, 140][stage];
  return (
    <G>
      <Ellipse cy={-4} rx={120} ry={18} fill="#FFFFFF" />
      {stage >= 1 && (
        <G>
          <Path d={`M-110 0 L-110 ${-Math.min(h, 60)} Q-110 ${-h - 10} 0 ${-h - 10} Q110 ${-h - 10} 110 ${-Math.min(h, 60)} L110 0 Z`} fill="#F4F8FF" stroke="#CFDDEA" strokeWidth={4} />
          {Array.from({ length: Math.min(3, stage + 1) }, (_, r) => (
            <Path key={r} d={`M${-108 + r * 10} ${-30 - r * 34} L${108 - r * 10} ${-30 - r * 34}`} stroke="#CFDDEA" strokeWidth={3} />
          ))}
        </G>
      )}
      {stage >= 3 && <Path d="M-36 0 L-36 -46 Q0 -80 36 -46 L36 0 Z" fill="#5A6FA8" />}
    </G>
  );
}

function Puddle({ stage, time, done }: { stage: number; time: number; done: boolean }) {
  const r = [30, 70, 100, 120][stage];
  return (
    <G>
      <Ellipse cy={-6} rx={130} ry={24} fill="#B9A48A" opacity={0.6} />
      {stage >= 1 && <Ellipse cy={-6} rx={r} ry={r * 0.18} fill="#6CC6F7" />}
      {stage >= 2 && <Ellipse cx={-r * 0.3} cy={-10} rx={r * 0.3} ry={4} fill="#FFFFFF" opacity={0.7} />}
      {done && [0, 1, 2].map((i) => {
        const p = (time * 0.8 + i / 3) % 1;
        return <Ellipse key={i} cy={-6} rx={20 + p * 90} ry={4 + p * 14} fill="none" stroke="#FFFFFF" strokeWidth={3} opacity={1 - p} />;
      })}
    </G>
  );
}

export function WonderFigure({ wonder, time, glow }: { wonder: Wonder; time: number; glow?: boolean }) {
  const { stage, kind } = wonder;
  const done = wonder.done > 0;
  const pop = 1 + wonder.pop * 0.12;
  let body: ReactNode;
  switch (kind) {
    case 'mlyn':
      body = <Mill stage={stage} time={time} done={done} />;
      break;
    case 'hrad':
      body = <Castle stage={stage} time={time} done={done} />;
      break;
    case 'houby':
      body = <Mushrooms stage={stage} done={done} time={time} />;
      break;
    case 'snehulak':
      body = <Snowman stage={stage} time={time} />;
      break;
    case 'obri-kvet':
      body = <GiantFlower stage={stage} time={time} done={done} />;
      break;
    case 'jablon':
      body = <AppleTree stage={stage} wonder={wonder} />;
      break;
    case 'iglu':
      body = <Igloo stage={stage} />;
      break;
    default:
      body = <Puddle stage={stage} time={time} done={done} />;
  }
  return (
    <G transform={tr(wonder.x, GROUND_Y + 10, 0, 1 - wonder.pop * 0.06, pop)}>
      <Ellipse cy={4} rx={110} ry={14} fill="#2A3A20" opacity={0.14} />
      {glow && !done && <Circle cy={-90} r={130} fill="#FFFFFF" opacity={0.25} />}
      {body}
    </G>
  );
}

export function WonderSparkle({ wonder, time, reduced }: { wonder: Wonder; time: number; reduced: boolean }) {
  if (wonder.stage >= 3 || wonder.wet > 0) return null;
  const top = { mlyn: -290, hrad: -110, houby: -150, snehulak: -60, 'obri-kvet': -210, jablon: -330, iglu: -70, kaluz: -70 }[wonder.kind];
  const pulse = reduced ? 0.5 : (Math.sin(time * 3) + 1) / 2;
  return (
    <G transform={tr(wonder.x, GROUND_Y + top - 30)} opacity={0.75 + pulse * 0.25}>
      <Circle r={30 + pulse * 4} fill="#FFFFFF" opacity={0.9} />
      <Path d="M0 -17 Q12 0 12 6 a12 12 0 0 1 -24 0 Q-12 0 0 -17 Z" fill="#3BAEFD" />
      {[0, 90, 180, 270].map((a) => (
        <Path key={a} d="M0 -40 L4 -32 L0 -26 L-4 -32 Z" fill="#FBCC03" transform={`rotate(${a + (reduced ? 0 : time * 40)})`} />
      ))}
    </G>
  );
}
