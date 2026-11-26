# src/game – engine

Čistý TypeScript spustitelný v Node testech. Z okolí neimportuj nic, co táhne React, React Native nebo Expo.

## Smyčka

`step(state, input, dt)` drží pořadí: vstup (`handleInput`) → nápověda a probuzení (`updateHints`) → pohyb Kapky → vítr → voda a déšť → schovávačky → rostliny → zvířátka → slavnost → částice → výraz Kapky (`resolveMood`). Nový systém napiš jako `updateX(state, dt)` v `systems/` a zařaď ho sem.

Ven engine mluví jen přes `state.events` (`GameEvent` v `types.ts`) pomocí `sfx`, `say`, `haptic` ze `systems/effects.ts`. `say` hlídá odstup 20 s na větu. Nový event přidej do unie a obsluž ho v `GameScreen.handleEvents`.

## Pravidla hry v kódu

- Souřadnice plátna 1600 × 900, `y` roste dolů, zem `GROUND_Y = 800`. Kapka létá v pásu `KAPKA_MIN_Y`–`KAPKA_MAX_Y` a cíl má o `KAPKA_FINGER_OFFSET` nad prstem, aby ji prst nezakrýval.
- Nad zdrojem vody se Kapka nasává, nad žíznivou rostlinkou (`PLANT_ZONE`) prší sama. Jedna plná nádrž zhruba stačí na jednu rostlinku (`RAIN_USE`, `GROW_TIME`).
- Slunce Kapku vysušuje, ale voda nikdy neklesne pod nulu a Kapka nezmizí. Poryv větru ji posune nejvýš o 10 % šířky. Testy to hlídají.
- Po `CELEBRATION_TIME` přejde scéna do fáze `hotovo`, pošle `complete` a dál čeká. Nic se automaticky neposouvá.
- Nečinnost: 6 s mávne rostlinka, 12 s nápověda hlasem, 20 s ručička (`hintTarget`), 30 s Kapka usne. Výuka (`tutorial`) běží jen v `louka-1` před prvním dohráním.

## Data místo kódu

Nový svět je nový řádek ve `WORLDS` (`worlds.ts`): rostliny, zvířátka, zdroj, mechaniky (`slunce`, `vitr`, `snih`, `noc`), člen rodiny, paleta a `scenery` pro krajinu. Rozmístění scén počítá `buildScene` deterministicky z indexu. Nový druh rostliny nebo zvířete přidej do `types.ts`, `catalog.ts` a do kreslení v `src/render/Plant.tsx` nebo `Animal.tsx`. Pak spusť testy: bot musí dohrát všechny scény.
