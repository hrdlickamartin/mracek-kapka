import { PressDown } from './PressDown';
import { Component, type ReactNode, useEffect, useState } from 'react';
import { Animated, Easing, Platform, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { FAMILY_ORDER } from '../game/catalog';
import type { AnimalKind } from '../game/types';
import type { WardrobeId, WardrobeSlot } from '../progression/wardrobe';
import { Moon } from '../render/Characters';
import { BubbleButton } from './BubbleButton';
import { Icon } from './Icons';
import { MiniAnimal, MiniFamily, MiniKapka } from './Mini';
import { COLORS, FONTS, SIZES } from './theme';

const native = Platform.OS !== 'web';
const RAINBOW = ['#ED3E1D', '#F9BA0A', '#FBE15A', '#A8C729', '#3BAEFD', '#BD8EFA'];

function useTicker(on: boolean) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => setT((v) => v + 0.05), 50);
    return () => clearInterval(id);
  }, [on]);
  return t;
}

export function Intro({ onStart, reducedMotion }: { onStart: () => void; reducedMotion: boolean }) {
  const { width, height } = useWindowDimensions();
  const [awake, setAwake] = useState(false);
  const t = useTicker(!reducedMotion);
  const wake = () => {
    if (awake) return;
    setAwake(true);
    setTimeout(onStart, 700);
  };
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#BFE6FD' }]}>
      <Svg style={StyleSheet.absoluteFill} width={width} height={height}>
        <Circle cx={width * 0.15} cy={height * 1.05} r={height * 0.45} fill="#A8C729" />
        <Circle cx={width * 0.85} cy={height * 1.1} r={height * 0.5} fill="#8CC152" />
        <Circle cx={width * 0.5} cy={height * 1.25} r={height * 0.5} fill="#A8C729" />
      </Svg>
      <PressDown label="Probudit Kapku" onDown={wake} style={[styles.introKapka, { top: height * 0.08 }]}>
        <MiniKapka size={Math.min(width * 0.42, height * 0.6)} mood={awake ? 'mrk' : 'spanek'} time={t} />
      </PressDown>
      <Text style={[styles.logo, { top: height * 0.62, fontSize: Math.min(56, height * 0.1) }]} accessibilityRole="header">
        Mráček Kapka
      </Text>
      <View style={[styles.introGo, { bottom: height * 0.04 }]}>
        <BubbleButton label="Hrát" icon="hrat" size={Math.min(SIZES.main, height * 0.24)} variant="go" onPress={wake} pulse reducedMotion={reducedMotion} />
      </View>
    </View>
  );
}

export function SleepScreen({ worn }: { worn: Partial<Record<WardrobeSlot, WardrobeId>> }) {
  const { width, height } = useWindowDimensions();
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#2B3F73' }]} accessibilityLabel="Kapka spí">
      <Svg style={StyleSheet.absoluteFill} width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        {Array.from({ length: 40 }, (_, i) => (
          <Circle key={i} cx={(i * 137.5) % width} cy={(i * 71.3) % (height * 0.8)} r={1.5 + (i % 3)} fill="#FFF6C9" opacity={0.6} />
        ))}
        <Moon x={width * 0.82} y={height * 0.2} />
      </Svg>
      <View style={{ position: 'absolute', left: width * 0.28, top: height * 0.25 }}>
        <MiniKapka size={Math.min(width * 0.44, height * 0.65)} mood="spanek" worn={worn} />
      </View>
    </View>
  );
}

export function Ending({ album, worn, onDone, reducedMotion }: { album: AnimalKind[]; worn: Partial<Record<WardrobeSlot, WardrobeId>>; onDone: () => void; reducedMotion: boolean }) {
  const { width, height } = useWindowDimensions();
  const t = useTicker(!reducedMotion);
  const r = Math.min(width * 0.42, height * 0.75);
  const parade = album.slice(0, 10);
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#D2F0FD' }]} accessibilityLabel="Duhová slavnost">
      <Svg style={StyleSheet.absoluteFill} width={width} height={height}>
        {RAINBOW.map((c, i) => (
          <Path key={c} d={`M${width / 2 - (r - i * 18)} ${height * 0.82} A${r - i * 18} ${r - i * 18} 0 0 1 ${width / 2 + (r - i * 18)} ${height * 0.82}`} stroke={c} strokeWidth={18} fill="none" opacity={0.8} />
        ))}
        <Circle cx={width * 0.5} cy={height * 1.3} r={height * 0.6} fill="#A8C729" />
      </Svg>
      <View style={[styles.familyRow, { top: height * 0.06 }]}>
        {FAMILY_ORDER.map((id, i) => (
          <View key={id} style={{ transform: [{ translateY: Math.sin(t * 2 + i) * 6 }] }}>
            <MiniFamily size={Math.min(130, width / 8)} id={id} time={t} />
          </View>
        ))}
      </View>
      <View style={{ position: 'absolute', left: width / 2 - height * 0.2, top: height * 0.34 }}>
        <MiniKapka size={height * 0.4} mood="radost" worn={worn} time={t} />
      </View>
      <View style={[styles.parade, { bottom: height * 0.04 }]}>
        {parade.map((a, i) => (
          <View key={a} style={{ transform: [{ translateY: -Math.abs(Math.sin(t * 4 + i)) * 12 }] }}>
            <MiniAnimal size={Math.min(90, width / 12)} kind={a} time={t} />
          </View>
        ))}
      </View>
      <View style={styles.endGo}>
        <BubbleButton label="Domů do zahrádky" icon="domek" size={SIZES.menu} variant="go" onPress={onDone} pulse reducedMotion={reducedMotion} />
      </View>
    </View>
  );
}

export function RotateNotice() {
  const { width, height } = useWindowDimensions();
  const spin = useState(() => new Animated.Value(0))[0];
  useEffect(() => {
    const loop = Animated.loop(Animated.timing(spin, { toValue: 1, duration: 1800, easing: Easing.inOut(Easing.ease), useNativeDriver: native }));
    loop.start();
    return () => loop.stop();
  }, [spin]);
  if (width >= height) return null;
  const rotate = spin.interpolate({ inputRange: [0, 0.5, 1], outputRange: ['0deg', '-90deg', '-90deg'] });
  return (
    <View style={[StyleSheet.absoluteFill, styles.rotate]} accessibilityLabel="Otočte zařízení na šířku">
      <Animated.View style={{ transform: [{ rotate }] }}>
        <Icon name="otocit" size={Math.min(width, height) * 0.5} color={COLORS.primary} />
      </Animated.View>
    </View>
  );
}

export function Transition({ token, reducedMotion }: { token: number; reducedMotion: boolean }) {
  const { width } = useWindowDimensions();
  const v = useState(() => new Animated.Value(1))[0];
  useEffect(() => {
    if (!token) return;
    v.setValue(0);
    Animated.timing(v, { toValue: 1, duration: 800, easing: Easing.inOut(Easing.ease), useNativeDriver: native }).start();
  }, [token, v]);
  if (reducedMotion) {
    const opacity = v.interpolate({ inputRange: [0, 0.3, 1], outputRange: [0, 0.9, 0] });
    return <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: '#FFFFFF', opacity }]} />;
  }
  const translateX = v.interpolate({ inputRange: [0, 1], outputRange: [-width * 1.6, width * 1.2] });
  return (
    <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}>
      <View style={[styles.wipe, { width: width * 1.3 }]}>
        {[0.15, 0.35, 0.55, 0.75, 0.95].map((y, i) => (
          <View key={y} style={[styles.puff, { top: `${y * 100 - 18}%`, left: i % 2 ? '8%' : '20%', width: width * 0.9, height: '42%' }]} />
        ))}
        <View style={{ position: 'absolute', right: 0, top: '30%' }}>
          <MiniKapka size={Math.min(260, width * 0.3)} mood="let" />
        </View>
      </View>
    </Animated.View>
  );
}

export class ErrorBoundary extends Component<{ children: ReactNode; onReset: () => void }, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <View style={[StyleSheet.absoluteFill, { backgroundColor: COLORS.sky, alignItems: 'center', justifyContent: 'center', gap: 16 }]} accessibilityLabel="Něco se pokazilo">
        <MiniKapka size={220} mood="spanek" />
        <BubbleButton
          label="Zpět do zahrádky"
          icon="domek"
          size={SIZES.menu}
          variant="go"
          onPress={() => {
            this.props.onReset();
            this.setState({ failed: false });
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  introKapka: { position: 'absolute', alignSelf: 'center' },
  logo: { position: 'absolute', alignSelf: 'center', fontFamily: FONTS.black, color: '#1C7FCB', textShadowColor: '#FFFFFF', textShadowRadius: 8, textShadowOffset: { width: 0, height: 2 } },
  introGo: { position: 'absolute', alignSelf: 'center' },
  familyRow: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  parade: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  endGo: { position: 'absolute', right: '8%', bottom: '8%' },
  rotate: { backgroundColor: COLORS.sky, alignItems: 'center', justifyContent: 'center' },
  wipe: { flex: 1 },
  puff: { position: 'absolute', backgroundColor: '#FFFFFF', borderRadius: 999 },
});
