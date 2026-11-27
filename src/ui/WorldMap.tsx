import { PressDown } from './PressDown';
import { useState } from 'react';
import { Image, type ImageSourcePropType, ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';
import type { WorldId } from '../game/types';
import { scenesOf, WORLDS, type WorldDef } from '../game/worlds';
import { sceneDone, sceneUnlocked, worldDone, worldUnlocked } from '../progression/progress';
import type { SaveData } from '../progression/saveData';
import { BubbleButton } from './BubbleButton';
import { HintHand } from './HintHand';
import { HomeButton } from './Hud';
import { Icon } from './Icons';
import { MiniAnimal, MiniKapka, MiniPlant } from './Mini';
import { COLORS } from './theme';

const IMAGES: Record<WorldId, ImageSourcePropType> = {
  louka: require('../../assets/svety/svet_louka.png'),
  zahradka: require('../../assets/svety/svet_zahradka.png'),
  les: require('../../assets/svety/svet_les.png'),
  poust: require('../../assets/svety/svet_poust.png'),
  hory: require('../../assets/svety/svet_hory.png'),
  rybnicek: require('../../assets/svety/svet_rybnicek.png'),
  'morsky-breh': require('../../assets/svety/svet_morsky-breh.png'),
  'nocni-zahrada': require('../../assets/svety/svet_nocni-zahrada.png'),
  dzungle: require('../../assets/svety/svet_dzungle.png'),
  sad: require('../../assets/svety/svet_sad.png'),
  arktida: require('../../assets/svety/svet_arktida.png'),
  balkon: require('../../assets/svety/svet_balkon.png'),
};

const RAINBOW = ['#ED3E1D', '#F9BA0A', '#FBE15A', '#A8C729', '#3BAEFD', '#BD8EFA'];

function Mist({ size }: { size: number }) {
  return (
    <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]} pointerEvents="none">
      <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: 'rgba(230,235,246,0.92)', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="mrak" size={size * 0.5} color="#C9D3E6" />
      </View>
    </View>
  );
}

function Island({ world, size, image, open, done, next, onPress, onMist }: { world: WorldDef; size: number; image?: ImageSourcePropType; open: boolean; done: boolean; next: boolean; onPress: () => void; onMist: () => void }) {
  return (
    <PressDown allowScroll label={open ? world.name : 'Ještě v mlze'} onDown={open ? onPress : onMist} style={{ width: size, height: size + 30, alignItems: 'center' }}>
      {next && (
        <View style={{ position: 'absolute', top: -size * 0.42, zIndex: 2 }} pointerEvents="none">
          <MiniKapka size={size * 0.6} mood="mavani" />
        </View>
      )}
      <View style={[styles.island, { width: size, height: size, borderRadius: size / 2, backgroundColor: world.palette.groundLush }]}>
        {image ? <Image source={image} style={{ width: size, height: size }} resizeMode="cover" /> : <View style={{ flex: 1, alignSelf: 'stretch', backgroundColor: world.palette.skyBottom, alignItems: 'center', justifyContent: 'center' }}><MiniPlant size={size * 0.7} kind={world.plants[0]} /></View>}
      </View>
      {done && (
        <View style={styles.badge} pointerEvents="none">
          <MiniAnimal size={size * 0.42} kind={world.animals[0]} />
        </View>
      )}
      {!open && <Mist size={size} />}
    </PressDown>
  );
}

function ScenePicker({ world, save, onPlay, onBack, onMist, reducedMotion }: { world: WorldDef; save: SaveData; onPlay: (index: number) => void; onBack: () => void; onMist: () => void; reducedMotion: boolean }) {
  const { width, height } = useWindowDimensions();
  const scenes = scenesOf(world);
  const size = Math.min(150, height * 0.26, width / 7.5);
  const image = IMAGES[world.id];
  return (
    <View style={StyleSheet.absoluteFill}>
      {image ? <Image source={image} style={{ position: 'absolute', left: 0, top: 0, width, height }} resizeMode="cover" blurRadius={6} /> : <View style={[StyleSheet.absoluteFill, { backgroundColor: world.palette.skyBottom }]} />}
      <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(255,255,255,0.35)' }]} />
      <View style={styles.pickerRow}>
        {scenes.map((scene, i) => {
          const done = sceneDone(save, scene.id);
          const open = sceneUnlocked(save, scene);
          const next = open && !done;
          return (
            <View key={scene.id} style={{ marginTop: i % 2 ? size * 0.5 : 0, alignItems: 'center', zIndex: next ? 3 : 1 }}>
              {next && (
                <View style={{ position: 'absolute', top: -size * 0.5, zIndex: 2 }} pointerEvents="none">
                  <MiniKapka size={size * 0.6} mood="mavani" />
                </View>
              )}
              <BubbleButton label={open ? `Obrázek ${i + 1}` : 'Ještě v mlze'} size={size} variant={done ? 'paper' : next ? 'go' : 'cloud'} onPress={open ? () => onPlay(i) : onMist} pulse={next} mist={!open} reducedMotion={reducedMotion}>
                {done ? (
                  <View style={{ alignItems: 'center' }}>
                    <MiniAnimal size={size * 0.55} kind={scene.visitor} />
                  </View>
                ) : next ? (
                  <Icon name="hrat" size={size * 0.45} color="#FFFFFF" />
                ) : (
                  <Icon name="mrak" size={size * 0.45} color="#C9D3E6" />
                )}
              </BubbleButton>
              {next && <HintHand x={size * 0.75} y={size * 0.7} size={Math.min(60, size * 0.5)} reducedMotion={reducedMotion} />}
            </View>
          );
        })}
      </View>
      <View style={styles.back}>
        <BubbleButton label="Zpět na mapu" icon="zpet" size={80} variant="cloud" onPress={onBack} reducedMotion={reducedMotion} />
      </View>
    </View>
  );
}

export function WorldMap({ save, onPlay, onHome, onEnding, onMist, reducedMotion }: { save: SaveData; onPlay: (world: WorldId, index: number) => void; onHome: () => void; onEnding: () => void; onMist: () => void; reducedMotion: boolean }) {
  const { width, height } = useWindowDimensions();
  const [picked, setPicked] = useState<WorldDef | null>(null);
  const size = Math.min(170, height * 0.34);
  const main = WORLDS.filter((w) => !w.expansion);
  const extra = WORLDS.filter((w) => w.expansion);
  const spacing = size * 1.25;
  const content = Math.max(width, 170 + spacing * (main.length + 1 + extra.length) + size);
  const firstOpen = WORLDS.find((w) => worldUnlocked(save, w) && !worldDone(save, w.id));
  const ys = (i: number) => (i % 2 ? height * 0.52 : height * 0.2);
  const start = Math.max(size * 0.7, 170);
  const points = [...main, null, ...extra].map((_, i) => ({ x: start + i * spacing + size / 2, y: ys(i) + size / 2 }));
  let river = `M${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const a = points[i - 1];
    const b = points[i];
    river += ` C${a.x + spacing / 2} ${a.y} ${b.x - spacing / 2} ${b.y} ${b.x} ${b.y}`;
  }

  if (picked) {
    return (
      <ScenePicker
        world={picked}
        save={save}
        onPlay={(i) => onPlay(picked.id, i)}
        onBack={() => setPicked(null)}
        onMist={onMist}
        reducedMotion={reducedMotion}
      />
    );
  }

  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#DDF3D2' }]}>
      <ScrollView horizontal contentContainerStyle={{ width: content, height }} showsHorizontalScrollIndicator={false}>
        <Svg width={content} height={height} style={StyleSheet.absoluteFill}>
          <Circle cx={content * 0.2} cy={height * 0.9} r={height * 0.5} fill="#CBE9B8" />
          <Circle cx={content * 0.7} cy={height * 1.0} r={height * 0.6} fill="#CBE9B8" />
          <Path d={river} stroke="#8DD9FA" strokeWidth={26} fill="none" strokeLinecap="round" />
          <Path d={river} stroke="#FFFFFF" strokeWidth={4} fill="none" strokeDasharray="2 22" strokeLinecap="round" opacity={0.8} />
        </Svg>
        {main.map((w, i) => (
          <View key={w.id} style={{ position: 'absolute', left: points[i].x - size / 2, top: ys(i), zIndex: firstOpen?.id === w.id ? 3 : 1 }}>
            <Island world={w} size={size} image={IMAGES[w.id]} open={worldUnlocked(save, w)} done={worldDone(save, w.id)} next={firstOpen?.id === w.id} onPress={() => setPicked(w)} onMist={onMist} />
            {firstOpen?.id === w.id && <HintHand x={size * 0.7} y={size * 0.62} size={Math.min(64, size * 0.4)} reducedMotion={reducedMotion} />}
          </View>
        ))}
        <View style={{ position: 'absolute', left: points[main.length].x - size / 2, top: ys(main.length) }}>
          <PressDown allowScroll label={save.ending ? 'Duhová slavnost' : 'Ještě v mlze'} onDown={save.ending ? onEnding : onMist} style={{ width: size, height: size }}>
            <View style={[styles.island, { width: size, height: size, borderRadius: size / 2, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'flex-end' }]}>
              <Svg width={size} height={size}>
                {RAINBOW.map((c, k) => (
                  <Path key={c} d={`M${size * 0.12 + k * 7} ${size * 0.7} A${size * 0.38 - k * 7} ${size * 0.38 - k * 7} 0 0 1 ${size * 0.88 - k * 7} ${size * 0.7}`} stroke={c} strokeWidth={7} fill="none" />
                ))}
              </Svg>
            </View>
            {!save.ending && <Mist size={size} />}
          </PressDown>
        </View>
        {extra.map((w, k) => {
          const i = main.length + 1 + k;
          return (
            <View key={w.id} style={{ position: 'absolute', left: points[i].x - size / 2, top: ys(i), zIndex: firstOpen?.id === w.id ? 3 : 1 }}>
              <Island world={w} size={size} image={IMAGES[w.id]} open={worldUnlocked(save, w)} done={worldDone(save, w.id)} next={firstOpen?.id === w.id} onPress={() => setPicked(w)} onMist={onMist} />
              {firstOpen?.id === w.id && <HintHand x={size * 0.7} y={size * 0.62} size={Math.min(64, size * 0.4)} reducedMotion={reducedMotion} />}
            </View>
          );
        })}
      </ScrollView>
      <HomeButton onHome={onHome} hold={false} reducedMotion={reducedMotion} />
    </View>
  );
}

const styles = StyleSheet.create({
  island: { overflow: 'hidden', borderWidth: 6, borderColor: '#FFFFFF', shadowColor: COLORS.ink, shadowOpacity: 0.2, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 5 },
  badge: { position: 'absolute', right: -8, bottom: 14, backgroundColor: '#FFFFFF', borderRadius: 40, padding: 4 },
  pickerRow: { position: 'absolute', left: '12%', right: '10%', top: '30%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  back: { position: 'absolute', top: 12, left: '7%' },
});
