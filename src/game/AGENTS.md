# src/game – engine

Čistý TypeScript spustitelný v Node testech. Neimportuj nic, co táhne React, React Native nebo Expo; typy z jiných vrstev jen přes `import type`.

## Soubory

| Soubor | Obsah |
|---|---|
| `engine.ts` | `createGame(scene, options)` postaví `GameState` (režim `scena` nebo `zahradka`), `step(state, input, dt)` posune simulaci, `gardenSnapshot` pro uložení zahrádky |
| `types.ts` | `GameState`, `GameEvent`, `Input`, `Goal`, výčty rostlin, zvířat, světů, nálad Kapky |
| `constants.ts` | rozměry plátna a všechna ladicí čísla (rychlost nasávání, spotřeba vody, růst, vítr, nápověda) |
| `worlds.ts` | `WORLDS` (data světů), `buildScene` (deterministické rozmístění), `GARDEN_SCENE`, `GARDEN_SLOTS` |
| `catalog.ts` | `PLANTS` (jméno, tón, barva), `ANIMALS` (jméno, `flies`, `glow`), `FAMILY` (vzhled členů rodiny) |
| `systems/kapka.ts` | pohyb za prstem, nasávání, déšť, růst, slunce, duha, přeháňka pro radost, výběr nálady |
| `systems/world.ts` | ťuknutí, schovávačky, zvířátka, vítr, rostliny, částice |
| `systems/guide.ts` | cíl (`state.goal`), nápověda při nečinnosti, spánek, výuka, slavnost |
| `systems/effects.ts` | `sfx`, `say`, `haptic`, `spawn`, `burst`, `setMood` – jediné cesty ven a k částicím |

## Smyčka

`step` drží pořadí: `handleInput` → `updateHints` (cíl, nápověda, probuzení) → `moveKapka` → `updateWeather` → `updateWater` → `updateHideouts` → `updatePlants` → `updateVisitors` → `updateCelebration` → `updateParticles` → `resolveMood`. Nový systém napiš jako `updateX(state, dt)` v `systems/` a zařaď ho do tohoto pořadí.

Ven engine mluví jen přes `state.events`. `say` hlídá odstup 20 s na větu, `force` ho obchází (výuka, objevy). Nový druh eventu přidej do unie `GameEvent` a obsluž ho v `GameScreen.handleEvents`.

## Pravidla hry v kódu

- Plátno 1600 × 900, `y` roste dolů, zem `GROUND_Y = 800`, horizont `HORIZON_Y = 560`. Kapka létá v pásu `KAPKA_MIN_Y`–`KAPKA_MAX_Y` a cíl má o `KAPKA_FINGER_OFFSET` nad prstem, aby ji prst nezakrýval.
- Nad zdrojem vody (`source.w / 2 + SOURCE_REACH`) se Kapka nasává, nad žíznivou rostlinkou (`PLANT_ZONE`) prší sama. Plná nádrž zhruba stačí na jednu rostlinku (`RAIN_USE`, `GROW_TIME`); když to měníš, zkontroluj délku scén v testech.
- Rostlinka má fáze 0–3 (semínko, klíček, mladá, květ); každá fáze pošle `tone`, fáze 3 navíc `bloom`.
- Slunce Kapku vysušuje, ale voda nikdy neklesne pod nulu. Poryv větru ji posune nejvýš o 10 % šířky.
- **Cíl:** `state.goal` je voda, když má Kapka málo vody nebo se právě nasává, jinak nejbližší žíznivá rostlinka; `busy` znamená, že ho Kapka právě plní. Mimo fázi `hraje` je `null`.
- Nečinnost (`HINT_TIMES`): 4 s mávne rostlinka, 8 s nápověda hlasem, 12 s ručička (`hintTarget`), 30 s Kapka usne. Výuka (`tutorial`) běží jen v `louka-1`, dokud není `tutorialDone`.
- **Slavnost:** když rozkvetou všechny rostlinky, fáze `slavnost`, zvířátko (`celebrant`) přiletí do popředí a hned se pošle `complete` (postup se uloží okamžitě). Po `CELEBRATION_TIME` fáze `hotovo` a hra čeká.
- **Zahrádka** (`mode: 'zahradka'`) má stejnou slavnost bez `complete`: tančí host zahrádky (nebo `GARDEN_SCENE.visitor`) a UI ukáže tlačítko na další obrázek. `createGame` vrátí úplně rozkvetlou zahrádku na semínka, aby bylo pořád co zalévat.

## Data místo kódu

- Nový svět = nový řádek ve `WORLDS`: rostliny, zvířátka, zdroj vody, mechaniky (`slunce`, `vitr`, `snih`, `noc`), člen rodiny, schovávačky, paleta a `scenery`. Ke `scenery` patří pozadí `assets/scenes/<scenery>.jpg` (viz `tools/AGENTS.md`) a záznam v `SCENE_IMAGES` v `src/render/Scenery.tsx`.
- Schovávačky volíš podle prostředí: v poušti ani na pláži není dutý strom ani keř.
- `buildScene` rozmisťuje deterministicky z indexu: 3–5 rostlinek s rozestupem aspoň 200, zdroj střídavě vlevo a vpravo, nic v okrajích 8 % šířky. Rozmístění neměň ručně v datech, uprav pravidla, testy je hlídají.
- Nová rostlina: `PlantKind` v `types.ts`, záznam v `PLANTS`, kreslení ve `src/render/Plant.tsx`.
- Nové zvířátko: `AnimalKind`, záznam v `ANIMALS`, sprite přes `tools/assets/animals.py` (viz `tools/AGENTS.md`).
- Po každé změně dat spusť testy: bot musí dohrát všechny scény všech světů.
