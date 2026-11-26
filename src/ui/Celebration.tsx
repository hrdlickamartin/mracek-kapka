import { useEffect, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import type { SceneSummary } from '../progression/progress';
import { BubbleButton } from './BubbleButton';
import { HintHand } from './HintHand';
import { MiniAnimal, MiniFamily, MiniPlant } from './Mini';
import { SIZES } from './theme';
import { WardrobeIcon } from './WardrobeIcon';

const native = Platform.OS !== 'web';

function Pop({ delay, children, reducedMotion, rays = false }: { delay: number; children: React.ReactNode; reducedMotion: boolean; rays?: boolean }) {
  const v = useState(() => new Animated.Value(0))[0];
  const wiggle = useState(() => new Animated.Value(0))[0];
  const spin = useState(() => new Animated.Value(0))[0];
  useEffect(() => {
    Animated.sequence([Animated.delay(delay), Animated.spring(v, { toValue: 1, friction: 4, tension: 70, useNativeDriver: native })]).start();
    if (reducedMotion) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(wiggle, { toValue: 1, duration: 520, easing: Easing.inOut(Easing.sin), useNativeDriver: native }),
        Animated.timing(wiggle, { toValue: 0, duration: 520, easing: Easing.inOut(Easing.sin), useNativeDriver: native }),
      ]),
    );
    const turn = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 9000, easing: Easing.linear, useNativeDriver: native }));
    const start = setTimeout(() => {
      loop.start();
      turn.start();
    }, delay + 500);
    return () => {
      clearTimeout(start);
      loop.stop();
      turn.stop();
    };
  }, [v, wiggle, spin, delay, reducedMotion]);
  const rotate = wiggle.interpolate({ inputRange: [0, 1], outputRange: ['-7deg', '7deg'] });
  const lift = wiggle.interpolate({ inputRange: [0, 0.5, 1], outputRange: [0, -10, 0] });
  const turnDeg = spin.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });
  return (
    <Animated.View style={{ transform: [{ scale: v }, { translateY: lift }, { rotate }], opacity: v, alignItems: 'center', justifyContent: 'center' }}>
      {rays && (
        <Animated.View pointerEvents="none" style={[styles.rays, { transform: [{ rotate: turnDeg }] }]}>
          <Svg width={260} height={260} viewBox="-130 -130 260 260">
            {Array.from({ length: 12 }, (_, i) => (
              <Path key={i} d="M-14 0 L0 -128 L14 0 Z" fill={i % 2 ? '#FFE37A' : '#FFFFFF'} opacity={0.85} transform={`rotate(${i * 30})`} />
            ))}
          </Svg>
        </Animated.View>
      )}
      {children}
    </Animated.View>
  );
}

export function Celebration({ summary, animal, onContinue, reducedMotion }: { summary: SceneSummary; animal: SceneSummary['newAnimals'][number] | null; onContinue: () => void; reducedMotion: boolean }) {
  const { width, height } = useWindowDimensions();
  const box = Math.min(110, height * 0.26, width / 8);
  const k = box / 110;
  const rewards: React.ReactNode[] = [];
  const shown = summary.newAnimals.length ? summary.newAnimals : animal ? [animal] : [];
  shown.forEach((a) =>
    rewards.push(
      <View key={`a-${a}`} style={[styles.sticker, { minWidth: box, minHeight: box }]} accessibilityLabel="Nová samolepka">
        <MiniAnimal size={96 * k} kind={a} />
      </View>,
    ),
  );
  summary.newSeeds.forEach((p) =>
    rewards.push(
      <View key={`s-${p}`} style={[styles.sticker, { minWidth: box, minHeight: box }]} accessibilityLabel="Nové semínko do zahrádky">
        <MiniPlant size={70 * k} kind={p} />
      </View>,
    ),
  );
  summary.newItems.forEach((id) =>
    rewards.push(
      <View key={`w-${id}`} style={[styles.sticker, { minWidth: box, minHeight: box }]} accessibilityLabel="Nový doplněk pro Kapku">
        <WardrobeIcon id={id} size={80 * k} />
      </View>,
    ),
  );
  if (summary.family)
    rewards.push(
      <View key="f" style={[styles.sticker, { minWidth: box, minHeight: box }]} accessibilityLabel="Nalezený člen rodiny">
        <MiniFamily size={110 * k} id={summary.family} />
      </View>,
    );
  if (summary.stripe)
    rewards.push(
      <View key="d" style={[styles.sticker, { minWidth: box, minHeight: box }]} accessibilityLabel="Nový pruh duhy">
        <View style={styles.stripes}>
          {['#ED3E1D', '#F9BA0A', '#A8C729', '#3BAEFD', '#BD8EFA'].map((c) => (
            <View key={c} style={[styles.stripe, { backgroundColor: c }]} />
          ))}
        </View>
      </View>,
    );
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="box-none">
      <View style={styles.row} pointerEvents="none">
        {rewards.slice(0, 6).map((r, i) => (
          <Pop key={i} delay={reducedMotion ? 0 : 400 + 250 * i} reducedMotion={reducedMotion} rays={i === 0}>
            {r}
          </Pop>
        ))}
      </View>
      <View style={styles.go} pointerEvents="box-none">
        <BubbleButton label="Pokračovat" icon="hrat" size={SIZES.main} variant="go" onPress={onContinue} pulse reducedMotion={reducedMotion} />
        <HintHand x={(SIZES.main + 20) * 0.62} y={(SIZES.main + 20) * 0.6} size={60} delay={2500} reducedMotion={reducedMotion} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { position: 'absolute', top: '12%', left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 16, flexWrap: 'wrap' },
  sticker: { backgroundColor: '#FFFFFF', borderRadius: 28, padding: 10, borderWidth: 6, borderColor: '#FFFFFF', shadowColor: '#23395B', shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4, alignItems: 'center', justifyContent: 'center', minWidth: 110, minHeight: 110 },
  stripes: { width: 90, height: 60, justifyContent: 'center', gap: 3 },
  stripe: { height: 9, borderRadius: 5 },
  go: { position: 'absolute', bottom: '6%', right: '10%' },
  rays: { position: 'absolute', width: 260, height: 260 },
});
