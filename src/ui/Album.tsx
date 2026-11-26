import { PressDown } from './PressDown';
import { useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { audio } from '../audio/audio';
import { ANIMALS, FAMILY_ORDER } from '../game/catalog';
import type { AnimalKind } from '../game/types';
import { WORLDS } from '../game/worlds';
import { familyFound, worldAnimals, worldUnlocked } from '../progression/progress';
import type { SaveData } from '../progression/saveData';
import { BubbleButton } from './BubbleButton';
import { HomeButton } from './Hud';
import { MiniAnimal, MiniFamily } from './Mini';

function Sticker({ kind, owned, size }: { kind: AnimalKind; owned: boolean; size: number }) {
  const [react, setReact] = useState(0);
  const [time, setTime] = useState(0);
  useEffect(() => {
    if (react <= 0) return;
    const id = setInterval(() => {
      setReact((r) => Math.max(0, r - 0.08));
      setTime((t) => t + 0.05);
    }, 40);
    return () => clearInterval(id);
  }, [react]);
  if (!owned) {
    return (
      <View style={[styles.slot, { width: size, height: size }]} accessibilityLabel="Prázdné místo">
        <View style={{ opacity: 0.18 }}>
          <MiniAnimal size={size * 0.8} kind={kind} />
        </View>
      </View>
    );
  }
  return (
    <PressDown
     
      label={ANIMALS[kind].name}
      onDown={() => {
        setReact(1);
        audio.unlock();
        audio.play('zvire');
      }}
      style={[styles.sticker, { width: size, height: size, transform: [{ rotate: `${(kind.length % 5) - 2}deg` }] }]}
    >
      <MiniAnimal size={size * 0.85} kind={kind} react={react} time={time} />
    </PressDown>
  );
}

export function Album({ save, onHome, reducedMotion }: { save: SaveData; onHome: () => void; reducedMotion: boolean }) {
  const { width, height } = useWindowDimensions();
  const worlds = WORLDS.filter((w) => worldUnlocked(save, w) || w.animals.some((a) => save.album.includes(a)));
  const pages = worlds.length + 1;
  const [page, setPage] = useState(0);
  const size = Math.min(150, (height * 0.62) / 2, (width * 0.6) / 4);
  const found = familyFound(save);
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#F3E7CF' }]}>
      <View style={[styles.book, { left: width * 0.14, right: width * 0.14, top: height * 0.1, bottom: height * 0.1 }]}>
        {page === 0 ? (
          <View style={styles.photo} accessibilityLabel="Rodinná fotka">
            <View style={styles.frame}>
              {FAMILY_ORDER.map((id) => (
                <View key={id} style={{ opacity: found.includes(id) ? 1 : 0.15 }}>
                  <MiniFamily size={size * 0.9} id={id} />
                </View>
              ))}
            </View>
            {save.rainbow && (
              <View style={styles.rainbowSticker} accessibilityLabel="Duha">
                {['#ED3E1D', '#F9BA0A', '#A8C729', '#3BAEFD', '#BD8EFA'].map((c) => (
                  <View key={c} style={{ height: 8, borderRadius: 4, backgroundColor: c, marginVertical: 2 }} />
                ))}
              </View>
            )}
          </View>
        ) : (
          <View style={styles.grid}>
            {worldAnimals(worlds[page - 1]).map((a) => (
              <Sticker key={a} kind={a} owned={save.album.includes(a)} size={size} />
            ))}
          </View>
        )}
      </View>
      {page > 0 && (
        <View style={[styles.arrow, { left: width * 0.03 }]}>
          <BubbleButton label="Předchozí stránka" icon="zpet" size={80} variant="paper" onPress={() => { audio.play('sustnuti'); setPage(page - 1); }} reducedMotion={reducedMotion} />
        </View>
      )}
      {page < pages - 1 && (
        <View style={[styles.arrow, { right: width * 0.03 }]}>
          <BubbleButton label="Další stránka" icon="dal" size={80} variant="paper" onPress={() => { audio.play('sustnuti'); setPage(page + 1); }} reducedMotion={reducedMotion} />
        </View>
      )}
      <View style={styles.dots} pointerEvents="none">
        {Array.from({ length: pages }, (_, i) => (
          <View key={i} style={[styles.dot, i === page && styles.dotOn]} />
        ))}
      </View>
      <HomeButton onHome={onHome} hold={false} reducedMotion={reducedMotion} />
    </View>
  );
}

const styles = StyleSheet.create({
  book: { position: 'absolute', backgroundColor: '#FFF9EF', borderRadius: 28, borderBottomWidth: 10, borderColor: '#E6DCC6', alignItems: 'center', justifyContent: 'center', padding: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 18 },
  slot: { borderRadius: 24, backgroundColor: '#EEF1F7', alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: '#DDE3EE', borderStyle: 'dashed' },
  sticker: { borderRadius: 24, backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderWidth: 6, borderColor: '#FFFFFF', shadowColor: '#23395B', shadowOpacity: 0.18, shadowRadius: 6, shadowOffset: { width: 0, height: 3 }, elevation: 3 },
  photo: { alignItems: 'center', justifyContent: 'center' },
  frame: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', backgroundColor: '#D2F0FD', borderRadius: 18, borderWidth: 10, borderColor: '#C9935E', padding: 8, maxWidth: 640 },
  rainbowSticker: { position: 'absolute', right: -20, top: -20, width: 80, backgroundColor: '#FFFFFF', borderRadius: 16, padding: 8, transform: [{ rotate: '8deg' }] },
  arrow: { position: 'absolute', top: '42%' },
  dots: { position: 'absolute', bottom: '3%', left: 0, right: 0, flexDirection: 'row', justifyContent: 'center', gap: 10 },
  dot: { width: 14, height: 14, borderRadius: 7, backgroundColor: '#E6DCC6' },
  dotOn: { backgroundColor: '#C9935E' },
});
