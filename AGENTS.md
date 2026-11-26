# Mráček Kapáček

Hra pro děti 3–5 let (Expo SDK 58, React Native 0.88, React 19, TypeScript) pro iOS, Android a web. Hlavní postava, mráček Kapáček, nabírá vodu, zalévá rostlinky a ty rostou ve čtyřech fázích. Za rozkvetlý obrázek přiletí zvířátko a dítě dostane odměnu. Kolem toho je 5 světů kampaně, 3 světy rozšíření, album, Moje zahrádka, šatník, Oblačná rodina a Duhová slavnost.

Web: https://hrdlickamartin.github.io/mracek-kapka/ · repo `hrdlickamartin/mracek-kapka` (`main` = zdroj, `gh-pages` = statický build).

## Závazný návrh

`docs/` obsahuje jen PDF a ta jsou zdrojem pravdy o tom, jak se hra chová a vypadá:

- `game-art-bible.pdf` – styl, paleta, postavy, světy, efekty, animace, specifikace assetů;
- `ui-style-guide.pdf` – principy rozhraní, dotyky, obrazovky, navádění, zvuk, rodičovská zóna, kontrolní seznam;
- `mracek-kapka.pdf` – první koncept, v detailech zastaralý. Když se rozchází s bible nebo guidem, platí bible a guide.

Když změníš chování nebo vzhled, který PDF popisuje, uprav HTML v `tools/docs/` a přegeneruj PDF (postup v [`tools/AGENTS.md`](tools/AGENTS.md)). Kód a PDF se nesmí rozejít.

## Pravidla

- Texty ve hře, testy, commity i odpovědi uživateli jsou česky. Kód bez komentářů.
- **Identita hry:** jeden prst; žádné prohrávání, skóre, časovače, měna, zámky, reklamy ani nákupy. Dítě nevidí text ani číslice; text smí jen logo, rodičovská zóna a obrazovka „otočte telefon“ (je pro rodiče). Postup ukazuje obraz: rozkvetlá krajina, samolepky, duha, mlha místo zámku. Čísla v `accessibilityLabel` jsou v pořádku.
- **Navádění:** dítě musí v každé chvíli vidět, co má udělat. Ve scéně to dělá cíl z enginu (šipka a přání Kapáčka), v nabídkách animovaná ručička `HintHand`. Nová obrazovka bez navádění není hotová.
- Placené generování obrázků (fal, OpenAI) nad zhruba 1 $ nejdřív odsouhlas s uživatelem a řekni odhad ceny.
- Před dokončením spusť `npm run check` (typy kódu i testů, lint, testy, české glyfy fontů). Totéž hlídá pre-commit hook.
- Commituj, pushuj a nasazuj jen na výslovný pokyn.

## Mapa kódu

Než upravíš kód v adresáři, přečti jeho `AGENTS.md`:

- `src/game/` – čistý engine: stav, simulace, data světů → [`src/game/AGENTS.md`](src/game/AGENTS.md)
- `src/render/` – vykreslení scény do SVG, sprity, efekty → [`src/render/AGENTS.md`](src/render/AGENTS.md)
- `src/ui/` – obrazovky, tlačítka, dotyky, navádění → [`src/ui/AGENTS.md`](src/ui/AGENTS.md)
- `src/progression/` – save, odemykání, odměny → [`src/progression/AGENTS.md`](src/progression/AGENTS.md)
- `src/audio/` – zvuk a hudba (hra nemluví) → [`src/audio/AGENTS.md`](src/audio/AGENTS.md)
- `tests/` – testy enginu a progrese → [`tests/AGENTS.md`](tests/AGENTS.md)
- `tools/` – PDF, generování assetů, zvuky, nasazení → [`tools/AGENTS.md`](tools/AGENTS.md)

Ostatní: `src/GameScreen.tsx` (orchestrátor obrazovek a herní smyčky), `src/hooks/` (`useGameLoop` přes rAF, `Live`/`nextFrame` pro překreslení bez React state, `useKeyboard` pro web), `App.tsx` (fonty Nunito, `ErrorBoundary`).

## Architektura

```
useGameLoop (rAF) → step(state, input, dt) → GameEvent[] → GameScreen.handleEvents
                       │ mutuje GameState v gameRef            (zvuk, tóny, haptika, uložení)
                       ▼
           nextFrame() → <Live> překreslí SceneView (jedno SVG)
```

- `GameState` je mutabilní objekt v `gameRef`, ne React state. Vstup je `{ pointer, tap }` ve scénových souřadnicích.
- Obrazovky (`screen` v `GameScreen`): `uvod → menu` (domov) `→ zahradka | mapa | scena | album | satnik`, dál `rodic` (za bránou), `spanek` (připomínka spánku), `konec` (Duhová slavnost). Tlačítko Domů vede vždy do menu.
- Konec obrázku: engine pošle `complete` hned na začátku slavnosti → `useProgress().finishScene` → čistá `applyScene` uloží postup a vrátí `SceneSummary` → po slavnosti `Celebration` čeká na ťuknutí na Pokračovat. Nic se samo neposouvá.

## Ověření v prohlížeči

1. `npx expo start --web --port 8082`, **bez `CI=1`** (v CI režimu Metro nesleduje změny a prohlížeč běží se starým kódem).
2. Velikosti: tablet 1180 × 820, Samsung S21 FE na šířku 851 × 340 (Chrome s lištou), kompaktní 740 × 320, na výšku 412 × 780 (musí se ukázat obrazovka „otočte telefon“ s tlačítkem na celou obrazovku).
3. Telefon emuluj se zapnutým dotykem (`isMobile`, `hasTouch`), myš neodhalí chyby dotyků.
4. Stav hry: v React fiberu najdi ref, jehož `current` má `kapka` a `plants` (lze nastavit `plants[i].stage = 3` a vyvolat slavnost). Save je v `localStorage` pod `mracek-kapka-save-v1`; dohraná kampaň = všech 25 scén v `scenes` a `ending: true`.
5. Na webu jde Kapáček ovládat šipkami, mezerník je ťuknutí na Kapáčka.
6. V konzoli nesmí být chyby.

## Nasazení webu

`npm run deploy:web` (skript `tools/deploy/pages.sh`): ověří čistý pracovní strom, dočasně přidá `baseUrl: "/mracek-kapka"` do `app.json`, udělá `expo export`, vrátí `app.json`, nahraje build do `gh-pages` s `.nojekyll` a počká, až Pages servírují nový `index-<hash>.js` (cache až 10 minut). Pak web otevři a zkontroluj konzoli.

## Expo

Před kódem sahajícím na Expo/RN API ověř dokumentaci pro SDK 58 (`https://docs.expo.dev/versions/v58.0.0/`). Balíčky přidávej přes `npx expo install`. Složky `ios/` a `android/` se generují (CNG), nativní nastavení patří do `app.json` (orientace je zamčená na šířku, `ios.requireFullScreen: true`).
