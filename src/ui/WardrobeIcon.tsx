import Svg, { Circle, G, Path, Rect } from 'react-native-svg';
import { wardrobeItem, type WardrobeId } from '../progression/wardrobe';

export function WardrobeIcon({ id, size }: { id: WardrobeId; size: number }) {
  const item = wardrobeItem(id);
  return (
    <Svg width={size} height={size} viewBox="-50 -50 100 100" pointerEvents="none">
      {item.slot === 'hlava' && id !== 'korunka' && (
        <G>
          <Path d="M-36 14 Q-36 -28 0 -28 Q36 -28 36 14 Z" fill={item.color} />
          <Rect x={-40} y={8} width={80} height={16} rx={8} fill="#EEF3FA" stroke="#C9D6EA" strokeWidth={2} />
          <Circle cy={-36} r={10} fill="#EEF3FA" stroke="#C9D6EA" strokeWidth={2} />
        </G>
      )}
      {id === 'korunka' &&
        ['#ED3E1D', '#F9BA0A', '#EC8FBB', '#BD8EFA', '#3BAEFD'].map((c, i) => (
          <G key={c} transform={`translate(${-32 + i * 16} ${Math.abs(-32 + i * 16) * 0.3})`}>
            {[0, 72, 144, 216, 288].map((a) => (
              <Circle key={a} cx={Math.cos((a * Math.PI) / 180) * 6} cy={Math.sin((a * Math.PI) / 180) * 6} r={5} fill={c} />
            ))}
            <Circle r={3.5} fill="#FBCC03" />
          </G>
        ))}
      {item.slot === 'oci' && (
        <G>
          <Circle cx={-18} r={14} fill={id === 'slunecni-bryle' ? '#3A2B5E' : '#FFFFFF'} stroke={item.color} strokeWidth={5} />
          <Circle cx={18} r={14} fill={id === 'slunecni-bryle' ? '#3A2B5E' : '#FFFFFF'} stroke={item.color} strokeWidth={5} />
          <Path d="M-4 -2 Q0 -6 4 -2" stroke={item.color} strokeWidth={4} fill="none" />
        </G>
      )}
      {id === 'sala' && (
        <G>
          <Path d="M-40 -10 Q0 10 40 -10 L40 6 Q0 26 -40 6 Z" fill={item.color} />
          <Rect x={14} y={2} width={16} height={34} rx={6} fill={item.color} />
        </G>
      )}
      {id === 'masle' && (
        <G>
          <Path d="M0 0 L-30 -18 L-30 18 Z" fill={item.color} />
          <Path d="M0 0 L30 -18 L30 18 Z" fill={item.color} />
          <Circle r={9} fill="#F7B8D0" />
        </G>
      )}
      {id === 'duhove-tvaricky' && (
        <G>
          {[-22, 22].map((x) => (
            <G key={x}>
              <Circle cx={x} r={18} fill="#ED3E1D" opacity={0.6} />
              <Circle cx={x} r={12} fill="#F9BA0A" opacity={0.7} />
              <Circle cx={x} r={6} fill="#3BAEFD" opacity={0.7} />
            </G>
          ))}
        </G>
      )}
    </Svg>
  );
}
