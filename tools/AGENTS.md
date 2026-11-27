# tools – dokumentace, assety, zvuk, nasazení

| Složka | Příkaz | Co dělá |
|---|---|---|
| `docs/` | `npm run docs:build` | HTML zdroje PDF → `docs/*.pdf` přes headless Chrome |
| `assets/` | `python3 tools/assets/animals.py …`, `npm run assets:animals` | zadání a import spritů zvířátek; zadání pozadí v `scenes.json` |
| `audio/` | `npm run audio:build` | syntéza všech zvuků do `assets/audio/` |
| `checks/` | `npm run check:fonts` | fonty z `App.tsx` musí umět českou diakritiku |
| `deploy/` | `npm run deploy:web` | build a nasazení na GitHub Pages, service worker |
| `assets/icons.py` | `python3 tools/assets/icons.py` | ikony aplikace, adaptivní ikona, splash a ikony webu z vektorového Kapáčka |

## Dokumentace (`docs/`)

- `game-art-bible.html`, `ui-style-guide.html`, `rozsireni.html`, `vydani.html` a společný `styl.css` jsou zdroje PDF (nový dokument přidej do smyčky v `build.sh`); `img/` jsou výřezy z `StyleGuide.png` (referenční obrázek celé hry).
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

**Ikony a splash** (`assets/icon.png` 1024 bez průhlednosti, `assets/adaptive-icon.png` s Kapáčkem uvnitř bezpečného kruhu, `assets/splash-icon.png`, `public/icons/*.png`) kreslí `icons.py` z SVG Kapáčka (stejné tvary jako `MiniKapka`) přes headless Chrome. Po změně vzhledu Kapáčka je přegeneruj a prohlédni.

## Zvuk (`audio/generate.py`)

Čistý Python bez závislostí, deterministický (`random.seed(7)`). Tóny jsou pentatonika C dur, hudba tři 8s smyčky (pad, pluck, zvonky) se stejnými akordy (`CHORDS`, `LOOP`), aby šly vrstvit. Příchutě světů jsou náhrady pluck vrstvy (`music_<příchuť>.wav`) ve `flavors()`, která běží úplně poslední a globální `random` nepoužívá (ukulele má vlastní `random.Random(seed)`); nová příchuť patří na její konec a musí držet `CHORDS` a `LOOP`. Nové efekty přidávej do `cues()`, která běží až po `music()`: přidáním doprostřed by se posunula náhoda a změnily by se i hotové soubory. Po `npm run audio:build` zkontroluj v `git status`, že se žádný hotový WAV nezměnil. Nový zvuk viz `src/audio/AGENTS.md`.

## Nasazení (`deploy/pages.sh`)

Nasazuje commitnutý stav `main` na https://hrdlickamartin.github.io/mracek-kapka/. Skript odmítne špinavý pracovní strom, dočasně nastaví `expo.experiments.baseUrl = "/mracek-kapka"` (v repu nezůstává, lokální vývoj by běžel pod podcestou), exportuje web, nahraje ho do větve `gh-pages` s `.nojekyll` (bez něj Jekyll zahodí `_expo`) a čeká, až Pages servírují nový `index-<hash>.js`. Po nasazení otevři web na telefonu i desktopu a zkontroluj konzoli.

**Service worker:** šablona `deploy/sw.js` (zdroj, nekopíruje se z `public/`), `deploy/precache.mjs <dist>` do ní vloží seznam všech souborů exportu (kromě `sw.js`, `metadata.json`, `.nojekyll`; `index.html` jako `./`) a verzi `<hash bundlu>-<hash obsahu>` a zapíše `<dist>/sw.js`. Instalace stáhne celý seznam (hashované soubory převezme ze staré cache), aktivace smaže staré cache `mracek-kapka-*`. HTML network-first (`cache: no-cache`), `_expo/static` a `assets/` cache-first, požadavky s `Range` (audio) se skládají z cache. Do `public/assets/` nic nedávej, cestu si rezervuje Metro.

## Vydání do obchodů

`eas.json` má profily `development` (dev client), `preview` (Android APK) a `production` (Android AAB, `autoIncrement`, `appVersionSource: remote`). Identita, oprávnění a ikony jsou v `app.json`; texty pro obchody, věk, soukromí, snímky a kroky pro vlastníka účtů v `docs/vydani.pdf` (zdroj `tools/docs/vydani.html`). Zásady soukromí jsou `public/soukromi.html` (nasazují se s webem). Po změně `app.json` ověř `npx expo config --type public`.
