# src/game – engine

Čistý TypeScript spustitelný v Node testech. Neimportuj nic, co táhne React, React Native nebo Expo; typy z jiných vrstev jen přes `import type`.

## Soubory

| Soubor | Obsah |
|---|---|
| `engine.ts` | `createGame(scene, options)` postaví `GameState` (režim `scena` nebo `zahradka`; volby `guest`, `season`, `pouch`), `step(state, input, dt)` posune simulaci, `gardenSnapshot` pro uložení zahrádky |
| `types.ts` | `GameState`, `GameEvent`, `Input`, `Goal`, výčty rostlin, zvířat, světů, nálad Kapáčka |
| `constants.ts` | rozměry plátna a všechna ladicí čísla (rychlost nasávání, spotřeba vody, růst, vítr, nápověda) |
| `worlds.ts` | `WORLDS` (data světů, `wonder`, `music`), `SCENE_LAYOUTS` (5 vzorů rozložení), `buildScene` (deterministické rozmístění, varianta pozadí, kouzelná věc), `GARDEN_SCENE`, `GARDEN_SLOTS` |
| `catalog.ts` | `PLANTS` (jméno, tón, barva), `ANIMALS` (jméno, `flies`, `glow`, `move`; `animalMove` vrací způsob příchodu), `FAMILY` (vzhled členů rodiny) |
| `systems/kapka.ts` | pohyb za prstem, nasávání, déšť, růst, slunce, duha, přeháňka pro radost, výběr nálady |
| `systems/growth.ts` | `grow` – růst rostlinky o fázi (tón, `bloom`, efekty) |
| `systems/visitors.ts` | `addVisitor` – zvířátko přichází podle `move` (odkud a jak); samostatný modul, aby se systémy navzájem nezacyklily |
| `systems/world.ts` | ťuknutí, schovávačky, přání kytičky a radost zvířátek, vítr, rostliny, částice |
| `systems/wonders.ts` | kouzelné věci: déšť nad věcí ji ve 3 krocích dokončí, na konci přijde zvířátko (do alba), mlýn navíc zalije nejbližší rostlinku |
| `systems/nature.ts` | `updateNight` (šero `state.dark`, světlušky), `updateTide` (příliv mění `source.w` o ±20 %, při nasávání stojí) |
| `systems/garden.ts` | sázení semínek z pytlíčku (`pouch`) na volná místa (`slots`) nad nimi nebo ťuknutím |
| `systems/guide.ts` | cíl (`state.goal`), nápověda při nečinnosti, spánek, výuka, slavnost |
| `systems/effects.ts` | `sfx`, `cue`, `haptic`, `spawn`, `burst`, `setMood` – jediné cesty ven a k částicím |

## Smyčka

`step` drží pořadí: `handleInput` → `updateHints` (cíl, nápověda, probuzení) → `moveKapka` → `updateWeather` → `updateTide` → `updateWater` → `updateGarden` → `updateWonder` → `updateHideouts` → `updatePlants` → `updateVisitors` → `updateNight` → `updateCelebration` → `updateParticles` → `resolveMood`. Nový systém napiš jako `updateX(state, dt)` v `systems/` a zařaď ho do tohoto pořadí.

Ven engine mluví jen přes `state.events`. `cue` je zvukový signál s odstupem 20 s (`CUE_COOLDOWN`), `force` ho obchází (výuka, nápověda při nečinnosti); čas posledního signálu v `state.cooldown` rozhoupe Žofku. Nový druh eventu přidej do unie `GameEvent` a obsluž ho v `GameScreen.handleEvents`.

## Pravidla hry v kódu

- Plátno 1600 × 900, `y` roste dolů, zem `GROUND_Y = 800`, horizont `HORIZON_Y = 560`. Kapáček létá v pásu `KAPKA_MIN_Y`–`KAPKA_MAX_Y` a cíl má o `KAPKA_FINGER_OFFSET` nad prstem, aby ho prst nezakrýval.
- Nad zdrojem vody (`source.w / 2 + SOURCE_REACH`) se Kapáček nasává, nad žíznivou rostlinkou (`PLANT_ZONE`) prší sám. Plná nádrž zhruba stačí na jednu rostlinku (`RAIN_USE`, `GROW_TIME`); když to měníš, zkontroluj délku scén v testech.
- Rostlinka má fáze 0–3 (semínko, klíček, mladá, květ); každá fáze pošle `tone`, fáze 3 navíc `bloom`.
- Slunce Kapáčka vysušuje, ale voda nikdy neklesne pod nulu. Poryv větru ho posune nejvýš o 10 % šířky.
- **Cíl:** `state.goal` je v zahrádce nejdřív volné místo pro semínko (`seminko`), dokud je co sázet; jinak voda, když má Kapáček málo vody nebo se právě nasává, jinak nejbližší žíznivá rostlinka; `busy` znamená, že ho Kapáček právě plní. Mimo fázi `hraje` je `null`.
- **Kouzelné věci jsou bonus.** Nikdy neblokují rozkvět a cíl na ně neukazuje; dítě je objeví samo (třpytivá bublina s kapkou). Déšť nad věcí bere jen 70 % vody. Nová věc: `WonderKind` v `types.ts`, `wonder` ve světě, sedátko zvířátka ve `wonderSeat`, kresba v `src/render/Wonder.tsx`.
- **Noc:** `state.dark` je nejvýš `NIGHT_DARK` a s rozkvětem slábne; render nad šerem vždy kreslí cíl, přání a Kapáčka, kolem Kapáčka, vody, cíle a rozkvetlých rostlin je světlo.
- **Příliv:** moře se mění jen o `TIDE_AMP` (20 %), rozložení počítá s maximem; při nasávání příliv stojí, aby voda neutekla.
- **Zvířátka:** `move` určuje příchod (`leti` z nebe, `vyleze` ze země, `plave` z vody, `skace`/`chodi`/`leze` ze strany). Zvířátko ze schovávačky si přeje nejbližší žíznivou kytičku (`wish`) a po jejím rozkvětu k ní přiběhne (`happy`).
- Nečinnost (`HINT_TIMES`): 4 s mávne rostlinka, 8 s zvonková nápověda (`napoveda`), Kapáček zamává, 12 s ručička (`hintTarget`), 30 s Kapáček usne. Výuka (`tutorial`) běží jen v `louka-1`, dokud není `tutorialDone`.
- **Slavnost:** když rozkvetou všechny rostlinky, fáze `slavnost`, zvířátko (`celebrant`) přiletí do popředí a hned se pošle `complete` (postup se uloží okamžitě). Po `CELEBRATION_TIME` fáze `hotovo` a hra čeká.
- **Zahrádka** (`mode: 'zahradka'`) má stejnou slavnost bez `complete`: tančí host zahrádky (nebo `GARDEN_SCENE.visitor`) a UI ukáže tlačítko na další obrázek. Slavnost počká, dokud jsou v pytlíčku semínka. `createGame` vrátí úplně rozkvetlou zahrádku na semínka, aby bylo pořád co zalévat. Host si sedne na své místo (`guestSpot`: letec na květ, žížala do hlíny, plavec k vodě). Roční období (`season`) je jen ozdoba; v zimě Kapáček sněží. Kapáček zasadí semínko, když nad volným místem chvíli zůstane (`SEED_DROP_TIME`), nebo dítě na místo ťukne; engine pošle `planted`.

## Data místo kódu

- Nový svět = nový řádek ve `WORLDS`: rostliny, zvířátka, zdroj vody, mechaniky (`slunce`, `vitr`, `snih`, `noc`, `priliv`), člen rodiny (jen kampaň), schovávačky, paleta, `scenery`, kouzelná věc (`wonder`: druh a zvířátko ze seznamu zvířátek světa, nebo `null`) a hudební příchuť (`music`). Ke `scenery` patří 3 pozadí `assets/scenes/<scenery>.jpg`, `-2.jpg`, `-3.jpg` (viz `tools/AGENTS.md`), záznam v `SCENE_IMAGES` (`src/render/Scenery.tsx`) a v `DECOR` (`src/render/Ambience.tsx`), ke světu ostrůvek `assets/svety/svet_<id>.png` v `IMAGES` (`src/ui/WorldMap.tsx`). Nové světy patří do rozšíření (`expansion: true`), kampaň zůstává 25 obrázků.
- Schovávačky volíš podle prostředí: v poušti ani na pláži není dutý strom ani keř. Schovávačka nikdy nestojí blíž než 180 ke kouzelné věci.
- Kouzelná věc se dokončit dá jen ve fázi `hraje`, aby její zvířátko stihlo do `complete` (alba).
- `buildScene` rozmisťuje deterministicky podle `SCENE_LAYOUTS[index]`: voda vlevo, vpravo nebo uprostřed, 3–5 rostlinek s rozestupem aspoň 200, místo pro kouzelnou věc (obrázky 2 a 4 světů s `wonder`), nic v okrajích 8 % šířky, varianta pozadí `index % 3`. Rozmístění neměň ručně v datech, uprav vzory nebo pravidla, testy je hlídají.
- Nová rostlina: `PlantKind` v `types.ts`, záznam v `PLANTS`, kreslení ve `src/render/Plant.tsx`.
- Nové zvířátko: `AnimalKind`, záznam v `ANIMALS`, sprite přes `tools/assets/animals.py` (viz `tools/AGENTS.md`).
- Po každé změně dat spusť testy: bot musí dohrát všechny scény všech světů.
