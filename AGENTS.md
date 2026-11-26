# Mráček Kapka

2D hra pro děti 3–5 let (Expo SDK 58, React Native 0.88, React 19, TypeScript) pro iOS, Android a web. Malý mráček Kapka nabírá vodu, zalévá rostlinky a ty rostou ve čtyřech fázích. Za rozkvetlou scénu přiletí zvířátko a dítě dostane odměnu. Kolem toho je 5 světů kampaně, 3 světy rozšíření, album, Moje zahrádka, šatník, Oblačná rodina a Duhová slavnost.

Závazný návrh je v `docs/`: `game-art-bible.pdf` (výtvarný kánon, postavy, světy, assety) a `ui-style-guide.pdf` (rozhraní, dotyky, obrazovky, zvuk). `mracek-kapka.pdf` je první koncept a v detailech je zastaralý; když se rozchází s bible nebo guidem, platí bible a guide.

## Pravidla

- Texty ve hře, testy, commity i odpovědi uživateli jsou česky.
- Kód bez komentářů.
- **Identita hry:** jeden prst, žádné prohrávání, skóre, časovače, měna, zámky, reklamy ani nákupy. Dítě nevidí text ani číslice, výjimkou je jen logo a rodičovská zóna. Postup ukazuje obraz (rozkvetlá krajina, samolepky, duha, mlha místo zámku). Čísla v `accessibilityLabel` jsou v pořádku.
- Herní tlačítka reagují na položení prstu přes `PressDown` (`src/ui/PressDown.tsx`). `Pressable` s `onPressIn` na webu spolkne ťuknutí kratší než 50 ms.
- Před dokončením spusť `npm run check` (typy, lint, testy, české glyfy fontů). Totéž hlídá pre-commit hook.
- Commituj a pushuj jen na výslovný pokyn.

## Mapa kódu

- `src/game/` – čistý TypeScript engine: `createGame`, `step` → `GameEvent[]`, systémy v `systems/`, data světů v `worlds.ts`, katalog rostlin, zvířat a rodiny v `catalog.ts`. Engine nesahá na React, audio ani haptiku.
- `src/render/` – vykreslení `GameState` do jednoho SVG (`react-native-svg`) v souřadnicích plátna 1600 × 900. `Stage.tsx` přepočítává obrazovku na plátno.
- `src/ui/` – obrazovky a ovládání, tokeny v `theme.ts`.
- `src/progression/` – save (`AsyncStorage`, klíč `mracek-kapka-save-v1`), čistá `applyScene`, šatník.
- `src/audio/` – `audio.ts` (efekty, tóny rostlinek, tři vrstvy hudby podle rozkvetu), `voice.ts` (hlas Žofky přes `expo-speech`, bez českého hlasu mlčí), `lines.ts` (věty do 5 slov).
- `src/GameScreen.tsx` – orchestrátor obrazovek `uvod | zahradka | mapa | scena | album | satnik | rodic | spanek | konec`.
- `tests/` – testy enginu a progrese; bot musí dohrát každou scénu každého světa.
- `tools/docs/` – zdroje PDF (HTML, styly, výřezy z `StyleGuide.png`); `npm run docs:build` přegeneruje `docs/*.pdf` přes Chrome. Sestavení potřebuje síť kvůli fontu Nunito.
- `tools/audio/generate.py` – syntéza všech zvuků do `assets/audio/` (`npm run audio:build`).

## Architektura

```
useGameLoop (rAF) → step(state, input, dt) → GameEvent[] → GameScreen.handleEvents
                       │ mutuje GameState v gameRef            (zvuk, tóny, hlas, haptika, konec scény)
                       ▼
           nextFrame() → <Live> překreslí SceneView
```

- `GameState` je mutabilní objekt v `gameRef`, ne React state. Vstup je `{ pointer, tap }` ve scénových souřadnicích; `TouchSurface` ho plní z prvního prstu a ignoruje doteky začínající v okrajích 8 % šířky.
- Konec scény = event `complete` → `useProgress().finishScene` → `applyScene` vrátí nový save a `SceneSummary` → `Celebration` čeká na ťuknutí na Pokračovat. Nic se samo neposouvá.
- Moje zahrádka běží na stejném enginu v režimu `zahradka` (bez slavnosti); stav rostlinek se při odchodu ukládá do `save.garden`.

## Grafika

- Pozadí kol (`assets/scenes/<scenery>.jpg`, 16:9) jsou vygenerovaná přes fal `nano-banana-2/edit` s obrázkem světa a `StyleGuide.png` jako stylovou předlohou; prompty a reference jsou v `tools/assets/scenes.json`. Nové pozadí musí mít horizont kolem 60 % výšky a volný spodní pás, protože rostlinky, voda a schovávačky se kreslí přes něj. Suchou krajinu dělá `Dryness` filtrem barev s maskou, která se kolem rozkvetlých rostlinek otevírá, takže stačí jedna verze obrázku.
- Postavy, zvířátka, rostliny a rekvizity jsou vektorové, kreslené v kódu (`src/render/`). Při náhradě rastrovými sprity zachovej props komponent.
- Slavnost: `Party.tsx` (paprsky, konfety, srdíčka a noty, hvězdičky) a `dance` u zvířátka, rostlin a Kapky; časuje se z `state.phaseTime`.

## Ověření v prohlížeči

`npx expo start --web --port 8082` (bez `CI=1`: v CI režimu Metro nesleduje změny souborů a prohlížeč běží se starým kódem). Velikosti: tablet 1180 × 820, telefon 800 × 360, kompaktní 740 × 320; na výšku se má ukázat obrázek „otoč zařízení“. Na webu jde Kapka ovládat i šipkami a mezerník je ťuknutí na Kapku. Stav hry najdeš přes React fiber: ref, jehož `current` má `kapka` a `plants`. Save jde podvrhnout přes `localStorage`.

## Expo

Před kódem sahajícím na Expo/RN API ověř dokumentaci pro SDK 58 (`https://docs.expo.dev/versions/v58.0.0/`). Balíčky přidávej přes `npx expo install`. Na `G` v `react-native-svg` používej `transform` (helper `tr` v `src/render/svg.ts`), props `x/y/rotation/scale` jsou zastaralé.
