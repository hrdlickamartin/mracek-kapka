import * as Speech from 'expo-speech';
import type { LineId } from '../game/types';
import { audio } from './audio';
import { lineText } from './lines';

class Voice {
  private voiceId: string | undefined;
  private available = true;
  private level = 1;
  private ready: Promise<void> | null = null;

  setLevel(level: number) {
    this.level = level;
  }

  private prepare() {
    if (!this.ready) {
      this.ready = Speech.getAvailableVoicesAsync()
        .then((voices) => {
          const czech = voices.find((v) => v.language?.toLowerCase().startsWith('cs'));
          this.voiceId = czech?.identifier;
          this.available = !!czech || voices.length === 0;
        })
        .catch(() => {
          this.available = true;
        });
    }
    return this.ready;
  }

  async say(line: LineId, subject?: string) {
    if (this.level <= 0) return;
    await this.prepare();
    if (!this.available) return;
    try {
      await Speech.stop();
      Speech.speak(lineText(line, subject), {
        language: 'cs-CZ',
        voice: this.voiceId,
        pitch: 1.3,
        rate: 0.95,
        volume: this.level,
        onStart: () => audio.duck(true),
        onDone: () => audio.duck(false),
        onStopped: () => audio.duck(false),
      });
    } catch {}
  }

  stop() {
    Speech.stop().catch(() => {});
    audio.duck(false);
  }
}

export const voice = new Voice();
