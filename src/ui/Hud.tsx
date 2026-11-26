import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BubbleButton } from './BubbleButton';
import { SIZES } from './theme';

export function ParentButton({ onOpen }: { onOpen: () => void }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.parent, { top: insets.top - 4, right: insets.right - 4 }]} pointerEvents="box-none">
      <BubbleButton label="Rodičovská zóna, podržte tři sekundy" icon="rodic" size={44} variant="cloud" hold={3} onPress={onOpen} reducedMotion silent iconColor="#6B7B8C" style={{ opacity: 0.75 }} />
    </View>
  );
}

export function HomeButton({ onHome, hold, reducedMotion }: { onHome: () => void; hold: boolean; reducedMotion: boolean }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.home, { top: insets.top - 4, left: insets.left - 4 }]} pointerEvents="box-none">
      <BubbleButton label={hold ? 'Domů, podržte' : 'Domů'} icon="domek" size={SIZES.corner} variant="cloud" hold={hold ? 1 : 0} onPress={onHome} reducedMotion={reducedMotion} />
    </View>
  );
}

const styles = StyleSheet.create({
  parent: { position: 'absolute' },
  home: { position: 'absolute' },
});
