import { DEFAULT_SETTINGS, type Lang } from '../progression/saveData';

const ORDINALS_CS = ['první', 'druhou', 'třetí', 'čtvrtou', 'pátou'];
const ORDINALS_EN = ['first', 'second', 'third', 'fourth', 'fifth'];

const cs = {
  parents: 'Pro rodiče',
  gateTask: (i: number) => `Ťukněte na ${ORDINALS_CS[i]} kytičku zleva.`,
  backToGame: 'Zpět do hry',
  sound: 'Zvuk',
  music: 'Hlasitost hudby',
  sfx: 'Hlasitost efektů',
  haptics: 'Vibrace',
  play: 'Hraní',
  sleep: 'Připomínka spánku',
  reducedMotion: 'Méně pohybu',
  highContrast: 'Vyšší kontrast',
  language: 'Jazyk',
  on: 'zap.',
  off: 'vyp.',
  minutes: (m: number) => `${m} min`,
  about: 'O hře',
  aboutText: 'Mráček Kapáček je hra pro děti od 3 do 5 let. Nemá reklamy ani nákupy a nesbírá žádná data. Hra se ukládá sama a postup se nikdy neztratí, ani když dítě aplikaci zavře. Nedá se prohrát, nemá skóre ani časové limity.',
  aboutOffline: 'Hra funguje bez internetu.',
  aboutWeb: 'V prohlížeči se hra při prvním spuštění stáhne celá a pak funguje i bez internetu. Na telefonu nebo tabletu ji můžete přidat na plochu: v Safari Sdílet → Přidat na plochu, v Chrome nabídka → Přidat na plochu (Nainstalovat aplikaci).',
  aboutVoice: 'Hra nemluví. Co má dítě udělat, ukazují obrázky, pohyb, hudba a zvuky.',
  privacy: 'Zásady ochrany soukromí',
  startOver: 'Začít znovu',
  erase: 'Vymazat postup',
  eraseConfirm: 'Opravdu smazat celý postup? Album, zahrádka a šatník začnou od začátku.',
  eraseYes: 'Ano, smazat',
  eraseNo: 'Ne, nechat',
  rotateTitle: 'Otočte telefon na šířku',
  rotateButton: 'Hrát na celou obrazovku',
  rotateHint: 'Když se obraz neotočí, zapněte v telefonu automatické otáčení obrazovky, nebo použijte tlačítko.',
};

const en: typeof cs = {
  parents: 'For parents',
  gateTask: (i: number) => `Tap the ${ORDINALS_EN[i]} flower from the left.`,
  backToGame: 'Back to the game',
  sound: 'Sound',
  music: 'Music volume',
  sfx: 'Sound effects volume',
  haptics: 'Vibration',
  play: 'Play',
  sleep: 'Bedtime reminder',
  reducedMotion: 'Reduce motion',
  highContrast: 'Higher contrast',
  language: 'Language',
  on: 'on',
  off: 'off',
  minutes: (m: number) => `${m} min`,
  about: 'About the game',
  aboutText: 'Mráček Kapáček is a game for children aged 3 to 5. It has no ads or purchases and collects no data. The game saves by itself and progress is never lost, even when the child closes the app. There is no losing, no score and no time limits.',
  aboutOffline: 'The game works without internet.',
  aboutWeb: 'In a browser, the whole game is downloaded on the first launch and then works offline too. On a phone or tablet you can add it to the home screen: in Safari Share → Add to Home Screen, in Chrome menu → Add to Home screen (Install app).',
  aboutVoice: 'The game does not speak. Pictures, movement, music and sounds show the child what to do.',
  privacy: 'Privacy policy',
  startOver: 'Start over',
  erase: 'Erase progress',
  eraseConfirm: 'Really erase all progress? The album, garden and wardrobe will start from the beginning.',
  eraseYes: 'Yes, erase',
  eraseNo: 'No, keep it',
  rotateTitle: 'Turn the phone sideways',
  rotateButton: 'Play full screen',
  rotateHint: 'If the picture does not rotate, turn on auto-rotate on your phone, or use the button.',
};

export type Texts = typeof cs;

export const LANGS: { id: Lang; name: string }[] = [
  { id: 'cs', name: 'Čeština' },
  { id: 'en', name: 'English' },
];

export function texts(lang: Lang = DEFAULT_SETTINGS.lang): Texts {
  return lang === 'en' ? en : cs;
}
