import { useEffect, useState } from 'react';
import { Image, StyleSheet, View, useWindowDimensions } from 'react-native';
import Svg from 'react-native-svg';
import type { SaveData } from '../progression/saveData';
import { Zofka } from '../render/Characters';
import { SCENE_IMAGES } from '../render/Scenery';
import { BubbleButton } from './BubbleButton';
import { HintHand } from './HintHand';
import { MiniKapka } from './Mini';

export function Menu({ save, onPlay, onGarden, onMap, onAlbum, onWardrobe, reducedMotion }: { save: SaveData; onPlay: () => void; onGarden: () => void; onMap: () => void; onAlbum: () => void; onWardrobe: () => void; reducedMotion: boolean }) {
  const { width, height } = useWindowDimensions();
  const [t, setT] = useState(0);
  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setT((v) => v + 0.05), 50);
    return () => clearInterval(id);
  }, [reducedMotion]);
  const play = Math.min(170, height * 0.34, width * 0.2);
  const tile = Math.min(104, height * 0.21, width * 0.11);
  const kapka = Math.min(width * 0.3, height * 0.5);
  const playX = width / 2;
  const playY = height * 0.7;
  return (
    <View style={StyleSheet.absoluteFill}>
      <Image source={SCENE_IMAGES.louka[0]} style={{ position: 'absolute', left: 0, top: 0, width, height }} resizeMode="cover" />
      <Svg style={StyleSheet.absoluteFill} width={width} height={height}>
        <Zofka x={width * 0.8} y={height * 0.86} hop={0} time={t} scale={height / 900} />
      </Svg>
      <View style={{ position: 'absolute', left: width / 2 - kapka / 2, top: height * 0.02, transform: [{ translateY: Math.sin(t * 2) * 6 }] }} accessibilityLabel="Kapáček">
        <MiniKapka size={kapka} mood="mavani" worn={save.worn} time={t} />
      </View>
      <View style={[styles.play, { left: playX - (play + 20) / 2, top: playY - (play + 20) / 2 }]}>
        <BubbleButton label="Hrát další obrázek" icon="hrat" size={play} variant="go" onPress={onPlay} pulse reducedMotion={reducedMotion} />
      </View>
      <View style={[styles.side, { left: width * 0.06, top: playY - tile / 2 - 10 }]}>
        <BubbleButton label="Moje zahrádka" icon="zahradka" size={tile} variant="cloud" onPress={onGarden} reducedMotion={reducedMotion} iconColor="#4F9112" />
        <BubbleButton label="Mapa údolí" icon="mapa" size={tile} variant="cloud" onPress={onMap} reducedMotion={reducedMotion} />
      </View>
      <View style={[styles.side, { right: width * 0.06, top: playY - tile / 2 - 10 }]}>
        <BubbleButton label="Album zvířátek" icon="album" size={tile} variant="cloud" onPress={onAlbum} reducedMotion={reducedMotion} />
        <BubbleButton label="Šatník Kapáčka" icon="satnik" size={tile} variant="cloud" onPress={onWardrobe} reducedMotion={reducedMotion} />
      </View>
      <HintHand x={playX + play * 0.18} y={playY + play * 0.12} size={Math.min(70, play * 0.45)} reducedMotion={reducedMotion} />
    </View>
  );
}

const styles = StyleSheet.create({
  play: { position: 'absolute' },
  side: { position: 'absolute', flexDirection: 'row', gap: 6 },
});
