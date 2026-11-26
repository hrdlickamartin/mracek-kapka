# tools – dokumentace, assety, zvuk, nasazení

| Složka | Příkaz | Co dělá |
|---|---|---|
| `docs/` | `npm run docs:build` | HTML zdroje PDF → `docs/*.pdf` přes headless Chrome |
| `assets/` | `python3 tools/assets/animals.py …`, `npm run assets:animals` | zadání a import spritů zvířátek; zadání pozadí v `scenes.json` |
| `audio/` | `npm run audio:build` | syntéza všech zvuků do `assets/audio/` |
| `checks/` | `npm run check:fonts` | fonty z `App.tsx` musí umět českou diakritiku |
| `deploy/` | `npm run deploy:web` | build a nasazení na GitHub Pages |

## Dokumentace (`docs/`)

- `game-art-bible.html`, `ui-style-guide.html` a společný `styl.css` jsou zdroje PDF; `img/` jsou výřezy z `StyleGuide.png` (referenční obrázek celé hry).
- Postup úpravy: uprav HTML → `npm run docs:build` → zkontroluj počet stran (`pdfinfo docs/<soubor>.pdf`) → vyrenderuj upravené stránky (`pdftoppm -r 50 -png -f N -l N`) a prohlédni je: useknuté obrázky, osamocené nadpisy, rozdělené tabulky.
- Sestavení potřebuje síť (font Nunito z Google Fonts) a Chrome v `/Applications/Google Chrome.app`.
- Rámečky `class="navrh"` označují obsah, který je návrhem, ne odsouhlaseným kánonem.

## Assety (`assets/`)

**Pozadí kol** (`assets/scenes/<scenery>.jpg`): `scenes.json` drží model (fal `nano-banana-2/edit`, 16:9, 1K), reference (obrázek světa z `assets/svety/` + `tools/docs/StyleGuide.png`) a prompt každého pozadí. Nové pozadí generuj skillem `generate-media` se stejnou šablonou promptu:

- horizont kolem 60 % výšky, spodních 40 % volných (rostlinky, voda a schovávačky se kreslí přes obrázek);
- bez postav, zvířat, textu a bez vody v popředí;
- v poušti bez slunce (hra kreslí vlastní sluníčko Hřejíka).

Výsledek ulož jako JPG (kvalita ~84), přidej záznam do `scenes.json` a `SCENE_IMAGES`, prohlédni ho ve hře na 16:9 i 4:3. Cena ~0,08 $ za obrázek.

**Zvířátka** (`assets/animals/<kind>.png`): `animals.json` drží model (OpenAI `gpt-image-1.5`, průhledné pozadí, kvalita medium), referenci stylu (`tools/docs/img/zviratka.png`), šablonu promptu a popis každého zvířátka.

```bash
python3 tools/assets/animals.py generate <kind>          # vygeneruje, ořeže, zmenší na 360 px, zkvantuje, přegeneruje TS
python3 tools/assets/animals.py import <kind> <soubor>   # importuje hotový PNG
npm run assets:animals                                   # jen přegeneruje src/render/animalSprites.ts
```

Nové zvířátko: popis do `animals.json`, `AnimalKind` + `ANIMALS` v enginu, pak `generate`. Každý výsledek si prohlédni (průhlednost, nic useknutého, styl jako ostatní). Cena ~0,05 $ za zvířátko; dávku nad ~1 $ nejdřív odsouhlas s uživatelem.

**Ostrovy mapy** (`assets/svety/`) jsou výřezy z `StyleGuide.png`.

## Zvuk (`audio/generate.py`)

Čistý Python bez závislostí, deterministický (`random.seed(7)`). Tóny jsou pentatonika C dur, hudba tři 8s smyčky (pad, pluck, zvonky) se stejnými akordy, aby šly vrstvit. Nové zvuky přidávej do `cues()`, která běží až po `music()`: přidáním doprostřed by se posunula náhoda a změnily by se i hotové soubory. Nový zvuk viz `src/audio/AGENTS.md`.

## Nasazení (`deploy/pages.sh`)

Nasazuje commitnutý stav `main` na https://hrdlickamartin.github.io/mracek-kapka/. Skript odmítne špinavý pracovní strom, dočasně nastaví `expo.experiments.baseUrl = "/mracek-kapka"` (v repu nezůstává, lokální vývoj by běžel pod podcestou), exportuje web, nahraje ho do větve `gh-pages` s `.nojekyll` (bez něj Jekyll zahodí `_expo`) a čeká, až Pages servírují nový `index-<hash>.js`. Po nasazení otevři web na telefonu i desktopu a zkontroluj konzoli.
