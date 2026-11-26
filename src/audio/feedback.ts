import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';
import { audio } from './audio';

let haptics = true;

export const feedback = {
  setHaptics(on: boolean) {
    haptics = on;
  },
  press() {
    audio.unlock();
    audio.play('blup');
    feedback.haptic('lehka');
  },
  haptic(strength: 'lehka' | 'stredni') {
    if (!haptics || Platform.OS === 'web') return;
    Haptics.impactAsync(strength === 'lehka' ? Haptics.ImpactFeedbackStyle.Light : Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  },
};
