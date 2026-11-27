import { PressDown } from './PressDown';
import { Component, type ReactNode, useEffect, useState } from 'react';
import { Animated, Easing, Image, Platform, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import { FAMILY_ORDER } from '../game/catalog';
import type { AnimalKind } from '../game/types';
import type { Lang } from '../progression/saveData';
import type { WardrobeId, WardrobeSlot } from '../progression/wardrobe';
import { Moon } from '../render/Characters';
import { SCENE_IMAGES } from '../render/Scenery';
import { BubbleButton } from './BubbleButton';
import { texts } from './i18n';
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
      <View style={styles.introColumn}>
        <PressDown label="Probudit Kapáčka" onDown={wake}>
          <MiniKapka size={Math.min(width * 0.42, height * 0.5)} mood={awake ? 'mrk' : 'spanek'} time={t} />
        </PressDown>
        <Text style={[styles.logo, { fontSize: Math.min(56, height * 0.1) }]} accessibilityRole="header">
          Mráček Kapáček
        </Text>
        <BubbleButton label="Hrát" icon="hrat" size={Math.min(SIZES.main, height * 0.22)} variant="go" onPress={wake} pulse reducedMotion={reducedMotion} />
      </View>
    </View>
  );
}

export function SleepScreen({ worn }: { worn: Partial<Record<WardrobeSlot, WardrobeId>> }) {
  const { width, height } = useWindowDimensions();
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#2B3F73' }]} accessibilityLabel="Kapáček spí">
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

async function playLandscape() {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  try {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen?.({ navigationUI: 'hide' });
  } catch {}
  try {
    const orientation = screen.orientation as ScreenOrientation & { lock?: (o: string) => Promise<void> };
    await orientation.lock?.('landscape');
  } catch {}
}

export function RotateNotice({ lang }: { lang?: Lang } = {}) {
  const t = texts(lang);
  const { width, height } = useWindowDimensions();
  const turn = useState(() => new Animated.Value(0))[0];
  const portrait = width < height;
  useEffect(() => {
    if (!portrait) return;
    const loop = Animated.loop(
      Animated.sequence([
        Animated.delay(500),
        Animated.timing(turn, { toValue: 1, duration: 900, easing: Easing.inOut(Easing.cubic), useNativeDriver: native }),
        Animated.delay(1100),
        Animated.timing(turn, { toValue: 0, duration: 400, easing: Easing.inOut(Easing.cubic), useNativeDriver: native }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [turn, portrait]);
  if (!portrait) return null;
  const phoneW = Math.min(width * 0.32, 150);
  const phoneH = phoneW * 1.9;
  const rotate = turn.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '-90deg'] });
  const counter = turn.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '90deg'] });
  return (
    <View style={[StyleSheet.absoluteFill, styles.rotate]}>
      <Image source={SCENE_IMAGES.louka[0]} style={{ position: 'absolute', left: 0, top: 0, width, height }} resizeMode="cover" blurRadius={4} />
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(210,240,253,0.55)' }]} />
      <View style={{ height: phoneH + 40, alignItems: 'center', justifyContent: 'center' }} accessibilityLabel="Otočte telefon na šířku">
        <Animated.View style={[styles.phone, { width: phoneW, height: phoneH, borderRadius: phoneW * 0.18, transform: [{ rotate }] }]}>
          <View style={[styles.screen, { borderRadius: phoneW * 0.1 }]}>
            <Animated.View style={{ transform: [{ rotate: counter }] }}>
              <MiniKapka size={phoneW * 0.85} mood="mavani" />
            </Animated.View>
          </View>
        </Animated.View>
      </View>
      <Text style={styles.rotateTitle}>{t.rotateTitle}</Text>
      {Platform.OS === 'web' && (
        <>
          <Pressable accessibilityRole="button" onPress={playLandscape} style={styles.rotateButton}>
            <Icon name="hrat" size={26} color="#FFFFFF" />
            <Text style={styles.rotateButtonText}>{t.rotateButton}</Text>
          </Pressable>
          <Text style={styles.rotateHint}>{t.rotateHint}</Text>
        </>
      )}
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
  introColumn: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'space-evenly', paddingVertical: 8 },
  logo: { fontFamily: FONTS.black, color: '#1C7FCB', textShadowColor: '#FFFFFF', textShadowRadius: 8, textShadowOffset: { width: 0, height: 2 } },
  familyRow: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  parade: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 6 },
  endGo: { position: 'absolute', right: '8%', bottom: '8%' },
  rotate: { backgroundColor: COLORS.sky, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 14 },
  phone: { backgroundColor: '#23395B', padding: 8, shadowColor: '#23395B', shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: { width: 0, height: 6 }, elevation: 6 },
  screen: { flex: 1, backgroundColor: '#BFE6FD', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  rotateTitle: { fontFamily: FONTS.extra, fontSize: 22, color: COLORS.ink, textAlign: 'center' },
  rotateButton: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: COLORS.go, borderRadius: 18, paddingHorizontal: 22, minHeight: 56, borderBottomWidth: 5, borderColor: COLORS.goEdge },
  rotateButtonText: { fontFamily: FONTS.extra, fontSize: 17, color: '#FFFFFF' },
  rotateHint: { fontFamily: FONTS.regular, fontSize: 13, lineHeight: 19, color: COLORS.ink, textAlign: 'center', maxWidth: 320 },
  wipe: { flex: 1 },
  puff: { position: 'absolute', backgroundColor: '#FFFFFF', borderRadius: 999 },
});
