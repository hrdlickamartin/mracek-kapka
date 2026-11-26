import { PressDown } from './PressDown';
import { useEffect, useState } from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { audio } from '../audio/audio';
import type { Mood } from '../game/types';
import type { SaveData } from '../progression/saveData';
import { WARDROBE, type WardrobeId } from '../progression/wardrobe';
import { HomeButton } from './Hud';
import { Icon } from './Icons';
import { MiniKapka } from './Mini';
import { WardrobeIcon } from './WardrobeIcon';

export function Wardrobe({ save, onToggle, onHome, reducedMotion }: { save: SaveData; onToggle: (id: WardrobeId) => void; onHome: () => void; reducedMotion: boolean }) {
  const { width, height } = useWindowDimensions();
  const [mood, setMood] = useState<Mood>('zakladni');
  const [time, setTime] = useState(0);
  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => setTime((t) => t + 0.05), 50);
    return () => clearInterval(id);
  }, [reducedMotion]);
  useEffect(() => {
    if (mood === 'zakladni') return;
    const id = setTimeout(() => setMood('zakladni'), 900);
    return () => clearTimeout(id);
  }, [mood]);
  const cell = Math.min(110, (height * 0.7) / 3 - 12, (width * 0.5) / 4 - 12);
  return (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: '#E4F4FD' }]}>
      <View style={[styles.kapka, { left: width * 0.08, top: height * 0.18 }]} accessibilityLabel="Kapáček">
        <MiniKapka size={Math.min(width * 0.38, height * 0.75)} mood={mood} worn={save.worn} time={time} />
      </View>
      <View style={[styles.grid, { left: width * 0.5, right: width * 0.08, top: height * 0.14, bottom: height * 0.1 }]}>
        {WARDROBE.map((item) => {
          const owned = save.owned.includes(item.id);
          const worn = save.worn[item.slot] === item.id;
          return (
            <PressDown
              key={item.id}
             
              label={owned ? item.name : 'Ještě v mlze'}
              onDown={() => {
                audio.unlock();
                if (!owned) {
                  audio.play('vzum', 0.5);
                  return;
                }
                audio.play('hihi');
                setMood('radost');
                onToggle(item.id);
              }}
              style={[styles.cell, { width: cell, height: cell, borderRadius: cell / 2 }, worn && styles.worn, !owned && styles.mist]}
            >
              {owned ? <WardrobeIcon id={item.id} size={cell * 0.7} /> : <Icon name="mrak" size={cell * 0.5} color="#C9D3E6" />}
            </PressDown>
          );
        })}
      </View>
      <HomeButton onHome={onHome} hold={false} reducedMotion={reducedMotion} />
    </View>
  );
}

const styles = StyleSheet.create({
  kapka: { position: 'absolute' },
  grid: { position: 'absolute', flexDirection: 'row', flexWrap: 'wrap', gap: 14, alignContent: 'center', justifyContent: 'center' },
  cell: { backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', borderBottomWidth: 6, borderColor: '#B9C7DF' },
  worn: { backgroundColor: '#FFF3C4', borderColor: '#F9BA0A' },
  mist: { backgroundColor: '#EEF1F7', opacity: 0.7 },
});
