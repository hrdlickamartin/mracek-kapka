import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

export type IconName = 'domek' | 'mapa' | 'album' | 'satnik' | 'zahradka' | 'hrat' | 'zpet' | 'dal' | 'rodic' | 'kapka' | 'mrak' | 'otocit';

export function Icon({ name, size, color }: { name: IconName; size: number; color: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 48 48">
      {name === 'domek' && (
        <G>
          <Path d="M8 22 L24 8 L40 22 V38 a4 4 0 0 1 -4 4 H12 a4 4 0 0 1 -4 -4 Z" fill={color} />
          <Rect x={19} y={28} width={10} height={14} rx={4} fill="#FFFFFF" opacity={0.85} />
        </G>
      )}
      {name === 'mapa' && (
        <G>
          <Circle cx={12} cy={34} r={6} fill={color} />
          <Circle cx={24} cy={18} r={6} fill={color} />
          <Circle cx={37} cy={30} r={6} fill={color} />
          <Path d="M12 34 Q16 22 24 18 Q32 18 37 30" stroke={color} strokeWidth={4} fill="none" strokeLinecap="round" strokeDasharray="1 7" />
        </G>
      )}
      {name === 'album' && (
        <G>
          <Rect x={8} y={7} width={32} height={36} rx={6} fill={color} />
          <Circle cx={24} cy={22} r={8} fill="#FFFFFF" opacity={0.9} />
          <Circle cx={21} cy={21} r={1.8} fill={color} />
          <Circle cx={27} cy={21} r={1.8} fill={color} />
        </G>
      )}
      {name === 'satnik' && (
        <G>
          <Path d="M10 30 a14 14 0 0 1 28 0 Z" fill={color} />
          <Rect x={7} y={29} width={34} height={7} rx={3.5} fill={color} />
          <Circle cx={24} cy={12} r={4} fill={color} />
        </G>
      )}
      {name === 'zahradka' && (
        <G>
          <Path d="M24 42 V24" stroke={color} strokeWidth={4} strokeLinecap="round" />
          <Path d="M24 30 Q14 30 12 22 Q22 20 24 30Z M24 28 Q34 26 36 18 Q26 17 24 28Z" fill={color} />
          <Circle cx={24} cy={14} r={7} fill={color} />
        </G>
      )}
      {name === 'hrat' && <Path d="M17 10 Q14 10 14 14 V34 Q14 38 17 38 Q19 38 21 37 L37 27 Q40 24 37 21 L21 11 Q19 10 17 10Z" fill={color} />}
      {name === 'zpet' && <Path d="M30 10 L14 24 L30 38" stroke={color} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
      {name === 'dal' && <Path d="M18 10 L34 24 L18 38" stroke={color} strokeWidth={7} fill="none" strokeLinecap="round" strokeLinejoin="round" />}
      {name === 'rodic' && (
        <G>
          <Circle cx={24} cy={24} r={8} fill="none" stroke={color} strokeWidth={5} />
          <G stroke={color} strokeWidth={5} strokeLinecap="round">
            <Path d="M24 6v5M24 37v5M6 24h5M37 24h5M11 11l3.5 3.5M33.5 33.5L37 37M11 37l3.5-3.5M33.5 14.5L37 11" />
          </G>
        </G>
      )}
      {name === 'kapka' && (
        <G>
          <Path d="M24 6 Q36 22 36 30 a12 12 0 0 1 -24 0 Q12 22 24 6Z" fill={color} />
          <Ellipse cx={19} cy={28} rx={3} ry={5} fill="#FFFFFF" opacity={0.7} />
        </G>
      )}
      {name === 'mrak' && <Path d="M14 36 a8 8 0 0 1 0 -16 a10 10 0 0 1 19 -3 a8 8 0 0 1 2 19 Z" fill={color} />}
      {name === 'otocit' && (
        <G>
          <Rect x={16} y={6} width={16} height={28} rx={4} fill="none" stroke={color} strokeWidth={3} />
          <Rect x={8} y={26} width={32} height={16} rx={4} fill={color} opacity={0.85} />
          <Path d="M38 10 Q44 16 40 22 M40 22 L35 20 M40 22 L42 17" stroke={color} strokeWidth={3} fill="none" strokeLinecap="round" />
        </G>
      )}
    </Svg>
  );
}
