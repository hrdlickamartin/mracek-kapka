import { useEffect, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

const native = Platform.OS !== 'web';

export function HintHand({ x, y, size = 64, delay = 1500, reducedMotion = false }: { x: number; y: number; size?: number; delay?: number; reducedMotion?: boolean }) {
  const v = useState(() => new Animated.Value(0))[0];
  const show = useState(() => new Animated.Value(0))[0];
  useEffect(() => {
    const appear = Animated.sequence([Animated.delay(delay), Animated.timing(show, { toValue: 1, duration: 300, useNativeDriver: native })]);
    appear.start();
    if (reducedMotion) return () => appear.stop();
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(v, { toValue: 1, duration: 520, easing: Easing.inOut(Easing.quad), useNativeDriver: native }),
        Animated.timing(v, { toValue: 0, duration: 520, easing: Easing.inOut(Easing.quad), useNativeDriver: native }),
        Animated.delay(260),
      ]),
    );
    loop.start();
    return () => {
      appear.stop();
      loop.stop();
    };
  }, [v, show, delay, reducedMotion]);
  const translate = v.interpolate({ inputRange: [0, 1], outputRange: [size * 0.45, 0] });
  const ripple = v.interpolate({ inputRange: [0, 0.7, 1], outputRange: [0.2, 0.6, 1.25] });
  const rippleOpacity = v.interpolate({ inputRange: [0, 0.6, 1], outputRange: [0, 0.2, 0.7] });
  return (
    <Animated.View pointerEvents="none" style={[styles.wrap, { left: x - size / 2, top: y - size * 0.15, width: size * 1.4, height: size * 1.8, opacity: show }]}>
      <Animated.View style={[styles.ripple, { width: size, height: size, borderRadius: size / 2, left: -size * 0.05, top: -size * 0.35, opacity: rippleOpacity, transform: [{ scale: ripple }] }]} />
      <Animated.View style={{ transform: [{ translateX: translate }, { translateY: translate }, { rotate: '-20deg' }] }}>
        <View>
          <Svg width={size} height={size * 1.4} viewBox="-30 -10 70 100">
            <Rect x={-6} y={-6} width={22} height={58} rx={11} fill="#FFE3CF" stroke="#E8B89A" strokeWidth={3} />
            <Rect x={-22} y={22} width={58} height={56} rx={24} fill="#FFE3CF" stroke="#E8B89A" strokeWidth={3} />
            <Rect x={14} y={28} width={18} height={30} rx={9} fill="#FFE3CF" stroke="#E8B89A" strokeWidth={2} />
          </Svg>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute' },
  ripple: { position: 'absolute', borderWidth: 5, borderColor: '#F9BA0A', backgroundColor: 'rgba(249,186,10,0.15)' },
});
