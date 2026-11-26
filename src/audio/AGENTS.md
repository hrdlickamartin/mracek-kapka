# src/audio – zvuk, hudba a hlas

## Soubory

| Soubor | Obsah |
|---|---|
| `audio.ts` | `audio`: efekty (`play`), tóny rostlinek (`tone`), tři smyčky hudby (`setMusic`, `setBloom`), ztlumení při řeči (`duck`), úrovně (`setLevels`) |
| `voice.ts` | `voice.say(line, subject)`: hlas Žofky přes `expo-speech`, česky |
| `lines.ts` | věty Žofky podle `LineId`, varianty, `{name}` pro jméno zvířátka nebo člena rodiny |
| `feedback.ts` | zvuk a haptika stisku tlačítka (`feedback.press`), `feedback.haptic` |

## Pravidla

- Na webu se zvuk smí spustit až po prvním dotyku: `audio.unlock()` volá `feedback.press` a kořenový `onTouchStart`. Před odemčením se všechno tiše zahazuje.
- Hudba má tři vrstvy (`music_pad`, `music_pluck`, `music_bells`); druhá zazní od třetiny rozkvetu, třetí od dvou třetin. Hlasitost = úroveň z nastavení / 4.
- Tóny rostlinek jsou pentatonika C dur (`tone_0`–`tone_8`), index je `PLANTS[kind].tone + fáze − 1`. Nikdy disonance.
- Hlas: věty nejvýš 5 slov, přítomný čas, popisují dění, nehodnotí výkon. Každá věta má víc variant. Bez českého hlasu v zařízení `voice` mlčí a hra zůstane hratelná díky obrázkovým nápovědám.
- **Nový efekt:** přidej jméno do `SfxName` (`src/game/types.ts`), syntézu do `tools/audio/generate.py`, spusť `npm run audio:build` a zaregistruj soubor v `SFX` v `audio.ts`. Engine efekt spouští přes `sfx(state, name)`.
- **Nová věta:** `LineId` v `types.ts`, varianty v `LINES`, spuštění přes `say(state, line)`.
- Zvuky jsou krátké (UI do 300 ms), měkké, bez pípání; formát WAV 22,05 kHz mono.
