import { PressDown } from './PressDown';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';
import { feedback } from '../audio/feedback';
import { Icon, type IconName } from './Icons';
import { COLORS } from './theme';

export type BubbleVariant = 'primary' | 'go' | 'cloud' | 'paper';

const FILL: Record<BubbleVariant, [string, string, string, string]> = {
  primary: ['#8FD3FF', COLORS.primary, '#1C7FCB', COLORS.primaryEdge],
  go: ['#D6EE7A', COLORS.go, '#75A023', COLORS.goEdge],
  cloud: ['#FFFFFF', COLORS.cloud, '#DFE7F5', COLORS.cloudEdge],
  paper: ['#FFFFFF', COLORS.paper, '#F2E8D2', COLORS.paperEdge],
};

const native = Platform.OS !== 'web';

export interface BubbleButtonProps {
  label: string;
  icon?: IconName;
  size: number;
  variant?: BubbleVariant;
  onPress: () => void;
  hold?: number;
  pulse?: boolean;
  mist?: boolean;
  reducedMotion?: boolean;
  iconColor?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  silent?: boolean;
}

let gradientId = 0;

export function BubbleButton({ label, icon, size, variant = 'cloud', onPress, hold = 0, pulse = false, mist = false, reducedMotion = false, iconColor, children, style, silent = false }: BubbleButtonProps) {
  const [pressed, setPressed] = useState(false);
  const [progress, setProgress] = useState(0);
  const breathe = useState(() => new Animated.Value(0))[0];
  const glow = useState(() => new Animated.Value(0))[0];
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const id = useRef(`bb${gradientId++}`).current;
  const [c0, c1, c2, edge] = FILL[variant];
  const edgeH = Math.round(size * 0.07);

  useEffect(() => {
    if (reducedMotion) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(breathe, { toValue: 1, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: native }),
        Animated.timing(breathe, { toValue: 0, duration: 1500, easing: Easing.inOut(Easing.sin), useNativeDriver: native }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [breathe, reducedMotion]);

  useEffect(() => {
    if (!pulse) {
      glow.setValue(0);
      return;
    }
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glow, { toValue: 1, duration: 600, useNativeDriver: native }),
        Animated.timing(glow, { toValue: 0, duration: 600, useNativeDriver: native }),
      ]),
      { iterations: 3 },
    );
    loop.start();
    return () => loop.stop();
  }, [glow, pulse]);

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  const start = () => {
    setPressed(true);
    if (!silent) feedback.press();
    if (!hold) {
      onPress();
      return;
    }
    const began = Date.now();
    timer.current = setInterval(() => {
      const p = Math.min(1, (Date.now() - began) / (hold * 1000));
      setProgress(p);
      if (p >= 1) {
        if (timer.current) clearInterval(timer.current);
        timer.current = null;
        setProgress(0);
        setPressed(false);
        onPress();
      }
    }, 40);
  };

  const end = () => {
    setPressed(false);
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
    setProgress(0);
  };

  const scale = breathe.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1.02] });
  const ring = size / 2 + 8;
  const circ = 2 * Math.PI * (ring - 4);

  return (
    <PressDown
     
      label={label}
      onDown={start}
      onUp={end}
      style={[{ width: size + 20, height: size + 20, alignItems: 'center', justifyContent: 'center' }, style]}
    >
      <Animated.View style={[styles.glow, { width: size + 28, height: size + 28, borderRadius: (size + 28) / 2, opacity: glow }]} />
      <Animated.View style={{ transform: [{ scale: pressed ? 0.95 : scale }, { translateY: pressed ? edgeH - 1 : 0 }], opacity: mist ? 0.55 : 1 }}>
        <View style={{ width: size, height: size + edgeH }}>
          <Svg width={size} height={size + edgeH}>
            <Defs>
              <RadialGradient id={id} cx="35%" cy="30%" r="75%">
                <Stop offset="0" stopColor={c0} />
                <Stop offset="0.5" stopColor={c1} />
                <Stop offset="1" stopColor={c2} />
              </RadialGradient>
            </Defs>
            {!pressed && <Circle cx={size / 2} cy={size / 2 + edgeH} r={size / 2} fill={edge} />}
            <Circle cx={size / 2} cy={size / 2} r={size / 2} fill={`url(#${id})`} />
            <Circle cx={size * 0.34} cy={size * 0.28} r={size * 0.1} fill="#FFFFFF" opacity={0.55} />
          </Svg>
          <View style={[StyleSheet.absoluteFill, { height: size, alignItems: 'center', justifyContent: 'center' }]}>
            {icon && <Icon name={icon} size={size * 0.5} color={iconColor ?? (variant === 'cloud' || variant === 'paper' ? '#1C7FCB' : '#FFFFFF')} />}
            {children}
          </View>
        </View>
      </Animated.View>
      {hold > 0 && progress > 0 && (
        <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]} pointerEvents="none">
          <Svg width={ring * 2} height={ring * 2}>
            <Circle cx={ring} cy={ring} r={ring - 4} stroke="#FFFFFF" strokeWidth={8} fill="none" opacity={0.6} />
            <Circle
              cx={ring}
              cy={ring}
              r={ring - 4}
              stroke={COLORS.primary}
              strokeWidth={8}
              fill="none"
              strokeDasharray={`${circ * progress} ${circ}`}
              strokeLinecap="round"
              transform={`rotate(-90 ${ring} ${ring})`}
            />
          </Svg>
        </View>
      )}
    </PressDown>
  );
}

const styles = StyleSheet.create({
  glow: { position: 'absolute', backgroundColor: 'rgba(249,186,10,0.55)' },
});
