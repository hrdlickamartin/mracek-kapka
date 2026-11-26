# src/render – vykreslení scény

Vstupem je `GameState`, výstupem jeden strom `react-native-svg`. Render stav jen čte, nikdy ho nemění; všechno, co se má hýbat podle simulace, počítá engine. Čistě dekorativní pohyb (houpání, tanec, konfety) se počítá z `state.time` a `state.phaseTime`.

## Plátno a viewport

- Vše se kreslí v souřadnicích plátna 1600 × 900. `Stage.tsx` (`viewportFor`) ho vždy zobrazí celé: na širších displejích škáluje podle výšky a přidá krajinu po stranách, na užších (4:3) podle šířky a přidá oblohu nahoře (70 % přesahu) a trávu dole. `view` popisuje viditelný obdélník, `toScene` převádí dotyky.
- Pozadí a efekty přes celou obrazovku kresli přes `view` (ne přes 0–1600), jinak na jiném poměru stran zůstane prázdný pruh.

## Vrstvy v `SceneView.tsx`

Pořadí potomků určuje překrytí:

1. `Backdrop` – malované pozadí světa (`SCENE_IMAGES`, `preserveAspectRatio="xMidYMid slice"` přes `view`);
2. sluníčko Hřejík (jen poušť), duha nad zahrádkou, duha z pouště;
3. `Dryness` – vybledlá kopie pozadí s filtrem barev a maskou, která se kolem rostlinek s fází > 0 otevírá; průhlednost podle `state.bloom`;
4. zdroj vody, schovávačky, rostlinky, cíl (`GoalMarker`), Žofka, rodina;
5. paprsky slavnosti, zvířátka, srdíčka a noty, hvězdičky;
6. Kapáček a jeho přání (`Wish`), částice, Fuk při větru, ručička nápovědy, konfety.

Nový prvek zařaď podle toho, co má překrývat; interaktivní věci patří nad `Dryness`.

## Komponenty

| Soubor | Obsah |
|---|---|
| `Kapka.tsx` | `KapkaFigure`: tělo z kruhů, oči, pusa a ručičky podle `Mood`, doplňky ze šatníku; `CloudBody`/`CloudDefs` sdílí rodina |
| `Plant.tsx` | `PlantFigure`: 4 fáze, svěšené listy při žízni, bublina s kapičkou, `pop` při růstu, `dance` ve slavnosti |
| `Animal.tsx` | `AnimalFigure`: sprite z `animalSprites.ts` + poskok (`react`), tanec (`dance`), vznášení létajících, dýchání; `animalHeight` určuje velikost |
| `Characters.tsx` | Žofka, Oblačná rodina, Fuk, sluníčko, měsíc, ručička nápovědy |
| `Props.tsx` | zdroje vody, schovávačky, částice, duha |
| `Guide.tsx` | `GoalMarker` (poskakující šipka a vlna u cíle), `Wish` (myšlenková bublina Kapáčka) |
| `Party.tsx` | slavnost: `Rays`, `Confetti`, `Joy` (srdíčka a noty), `Stars` |
| `Scenery.tsx` | `SCENE_IMAGES`, `Backdrop`, `Dryness` |
| `animalSprites.ts` | **generovaný** skriptem `tools/assets/animals.py`, ručně neupravuj |
| `svg.ts` | `tr(x, y, rotate, sx, sy)` – skládání `transform` |

## Pravidla a úskalí

- Na `G` a tvarech používej `transform={tr(...)}`. Props `x`, `y`, `rotation`, `scale`, `origin` na `G` jsou v react-native-svg 15 zastaralé.
- `Image` v SVG potřebuje `width` a `height`; zdroj je `require(...)` (funguje na webu i nativně).
- Celé SVG se překresluje každým snímkem přes `<Live>`. Statické části obal do `memo` a nepředávej jim `time`. Částic je nejvýš 140 (`spawn`).
- Každá animace musí respektovat `reducedMotion` (předává se jako `0`/`1` násobek nebo `time = 0`).
- Postupy, které dítě neuvidí jako číslo: počet rostlin, voda i postup se ukazují tvarem, velikostí a barvou, nikdy textem.
- `id` u `Defs` (gradienty, filtry, masky) musí být v rámci SVG jedinečné; pro opakované postavy skládej `id` z jejich jména (`rod-${id}`).
