import { type AudioPlayer, createAudioPlayer, setAudioModeAsync } from 'expo-audio';
import type { SfxName } from '../game/types';

const SFX: Record<SfxName, number> = {
  blup: require('../../assets/audio/blup.wav'),
  hlt: require('../../assets/audio/hlt.wav'),
  dest: require('../../assets/audio/dest.wav'),
  pop: require('../../assets/audio/pop.wav'),
  kvet: require('../../assets/audio/kvet.wav'),
  jiskra: require('../../assets/audio/jiskra.wav'),
  vzum: require('../../assets/audio/vzum.wav'),
  sustnuti: require('../../assets/audio/sustnuti.wav'),
  vitr: require('../../assets/audio/vitr.wav'),
  zivani: require('../../assets/audio/zivani.wav'),
  hihi: require('../../assets/audio/hihi.wav'),
  zvire: require('../../assets/audio/zvire.wav'),
  cak: require('../../assets/audio/cak.wav'),
  juuu: require('../../assets/audio/juuu.wav'),
  slavnost: require('../../assets/audio/slavnost.wav'),
};

const TONES: number[] = [
  require('../../assets/audio/tone_0.wav'),
  require('../../assets/audio/tone_1.wav'),
  require('../../assets/audio/tone_2.wav'),
  require('../../assets/audio/tone_3.wav'),
  require('../../assets/audio/tone_4.wav'),
  require('../../assets/audio/tone_5.wav'),
  require('../../assets/audio/tone_6.wav'),
  require('../../assets/audio/tone_7.wav'),
  require('../../assets/audio/tone_8.wav'),
];

const LAYERS: number[] = [require('../../assets/audio/music_pad.wav'), require('../../assets/audio/music_pluck.wav'), require('../../assets/audio/music_bells.wav')];

const MUSIC_MAX = 0.45;
const DUCK = 0.5;

class AudioManager {
  private sfx = new Map<SfxName, AudioPlayer>();
  private tones = new Map<number, AudioPlayer>();
  private layers: AudioPlayer[] = [];
  private unlocked = false;
  private playing = false;
  private musicLevel = 0.75;
  private sfxLevel = 0.75;
  private bloom = 0;
  private ducked = false;
  private wantMusic = false;

  async init() {
    try {
      await setAudioModeAsync({ playsInSilentMode: true, interruptionMode: 'mixWithOthers' });
    } catch {}
  }

  unlock() {
    if (this.unlocked) return;
    this.unlocked = true;
    if (this.wantMusic) this.setMusic(true);
  }

  setLevels(music: number, sfx: number) {
    this.musicLevel = music;
    this.sfxLevel = sfx;
    this.applyMusic();
  }

  play(name: SfxName, volume = 1) {
    if (!this.unlocked || this.sfxLevel <= 0) return;
    try {
      let player = this.sfx.get(name);
      if (!player) {
        player = createAudioPlayer(SFX[name]);
        this.sfx.set(name, player);
      }
      player.volume = volume * this.sfxLevel;
      player.seekTo(0);
      player.play();
    } catch {}
  }

  tone(index: number) {
    if (!this.unlocked || this.sfxLevel <= 0) return;
    const i = ((index % TONES.length) + TONES.length) % TONES.length;
    try {
      let player = this.tones.get(i);
      if (!player) {
        player = createAudioPlayer(TONES[i]);
        this.tones.set(i, player);
      }
      player.volume = 0.8 * this.sfxLevel;
      player.seekTo(0);
      player.play();
    } catch {}
  }

  setMusic(on: boolean) {
    this.wantMusic = on;
    if (!this.unlocked) return;
    try {
      if (!this.layers.length) {
        this.layers = LAYERS.map((src) => {
          const p = createAudioPlayer(src);
          p.loop = true;
          p.volume = 0;
          return p;
        });
      }
      if (on && !this.playing) {
        this.layers.forEach((p) => {
          p.seekTo(0);
          p.play();
        });
        this.playing = true;
      } else if (!on && this.playing) {
        this.layers.forEach((p) => p.pause());
        this.playing = false;
      }
      this.applyMusic();
    } catch {}
  }

  setBloom(bloom: number) {
    if (Math.abs(bloom - this.bloom) < 0.01) return;
    this.bloom = bloom;
    this.applyMusic();
  }

  duck(on: boolean) {
    this.ducked = on;
    this.applyMusic();
  }

  pauseAll() {
    this.layers.forEach((p) => p.pause());
    this.playing = false;
  }

  private applyMusic() {
    if (!this.layers.length) return;
    const base = MUSIC_MAX * this.musicLevel * (this.ducked ? DUCK : 1);
    const mix = [1, this.bloom >= 0.33 ? 0.8 : 0, this.bloom >= 0.66 ? 0.7 : 0];
    try {
      this.layers.forEach((p, i) => {
        p.volume = base * mix[i];
      });
    } catch {}
  }
}

export const audio = new AudioManager();
