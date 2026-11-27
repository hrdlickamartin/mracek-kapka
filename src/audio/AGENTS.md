# src/audio – zvuk a hudba

## Soubory

| Soubor | Obsah |
|---|---|
| `audio.ts` | `audio`: efekty (`play`), tóny rostlinek (`tone`), tři smyčky hudby (`setMusic`, `setBloom`, `setFlavor`), úrovně (`setLevels`) |
| `feedback.ts` | zvuk a haptika stisku tlačítka (`feedback.press`), `feedback.haptic` |

## Pravidla

- Na webu se zvuk smí spustit až po prvním dotyku: `audio.unlock()` volá `feedback.press` a kořenový `onTouchStart`. Před odemčením se všechno tiše zahazuje.
- Hudba má tři vrstvy: `music_pad`, druhá vrstva podle příchuti a `music_bells`; druhá zazní od třetiny rozkvetu, třetí od dvou třetin. Hlasitost = úroveň z nastavení / 4.
- Příchuť světa (`MusicFlavor`, pole `music` ve `worlds.ts`) mění jen druhou vrstvu: `zvonky` = `music_pluck.wav`, ostatní `music_<příchuť>.wav` (dřevo, kalimba, celesta, harfa, skříňka, ukulele). `audio.setFlavor(f)` vymění přehrávač, novou vrstvu spustí na `currentTime` padu a starou zastaví. Přehrávače příchutí vznikají líně, výchozí je `zvonky`.
- **Nová příchuť:** přidej ji do `MusicFlavor`, generátor do `flavors()` v `tools/audio/generate.py` a soubor do `FLAVORS` v `audio.ts`.
- Tóny rostlinek jsou pentatonika C dur (`tone_0`–`tone_8`), index je `PLANTS[kind].tone + fáze − 1`. Nikdy disonance.
- **Hra nemluví.** Syntéza řeči (`expo-speech`) byla odebraná: zněla nepřirozeně, špatně četla citoslovce („Jéé“) a věty neseděly k obrazu (žížala „přiletěla“). Nevracej ji; pokyn nese obraz a krátký zvuk.
- Signály místo vět: `napoveda` (dva zvonky, nápověda při nečinnosti, výuka, mlha na mapě), `objev` (třpytivé arpeggio u schovávačky), `prazdno` (měkký sestup, když dojde voda). Engine je pouští přes `cue(state, name, force)`, který hlídá odstup `CUE_COOLDOWN` (20 s) a rozhoupe Žofku.
- **Nový efekt:** přidej jméno do `SfxName` (`src/game/types.ts`), syntézu do `tools/audio/generate.py`, spusť `npm run audio:build` a zaregistruj soubor v `SFX` v `audio.ts`. Engine efekt spouští přes `sfx(state, name)`.
- Zvuky jsou krátké (UI do 300 ms), měkké, bez pípání; formát WAV 22,05 kHz mono.
