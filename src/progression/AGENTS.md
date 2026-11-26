# src/progression – postup a odměny

Čisté funkce nad `SaveData` a jeden hook, který je ukládá. Nic tu nekreslí ani nehraje zvuk.

## Soubory

| Soubor | Obsah |
|---|---|
| `saveData.ts` | `SaveData`, `Settings`, `DEFAULT_SAVE`, `migrateSave` |
| `save.ts` | `loadSave` / `writeSave` přes AsyncStorage, klíč `mracek-kapka-save-v1` |
| `progress.ts` | odemykání (`worldUnlocked`, `sceneUnlocked`, `nextScene`), odvozené odměny (`familyFound`, `rainbowStripes`, `campaignDone`), `applyScene`, `toggleWear`, `guestOfDay` |
| `wardrobe.ts` | `WARDROBE`: 12 doplňků, každý se slotem (`hlava`, `oci`, `krk`, `tvare`) a prahem `afterScenes` |
| `useProgress.ts` | drží save v React state, `update` hned zapisuje, `finishScene`, `reset` (zachová nastavení) |

## Pravidla

- Ukládá se jen to, co nejde odvodit: dohrané scény, album, semínka, zahrádka, vlastněné a nošené doplňky, `rainbow`, `ending`, nastavení. Rodina, pruhy duhy a odemčené světy se **odvozují** ze `scenes`; neukládej je zvlášť, rozejdou se.
- `applyScene` je čistá a idempotentní: opakované dohrání scény nic nezdvojí. Vrací `SceneSummary` pro slavnost (nová zvířátka, semínka, doplňky, člen rodiny, pruh duhy, konec kampaně).
- Odemykání: první svět vždy, další po dohrání předchozího, světy rozšíření po `ending`; scéna po dohrání předchozí ve stejném světě. Neobjevené se v UI ukazuje mlhou, ne zámkem.
- Zahrádka má 7 míst (`GARDEN_SLOTS`); semínka navíc se neukážou. Stav rostlinek zahrádky se ukládá při každém růstu (event `tone` v `GameScreen`).
- **Nové pole v save:** přidej ho do `SaveData`, výchozí hodnotu do `DEFAULT_SAVE` a v `migrateSave` zajisti, že starý save bez pole dostane výchozí hodnotu. Klíč `mracek-kapka-save-v1` neměň, ztratil by se postup dětí.
- Nastavení jsou úrovně 0–4 (`music`, `voice`, `sfx`), `sleepMinutes` 0/10/20/30, přepínače `haptics`, `reducedMotion`, `highContrast`.

## Testy

`tests/progress.test.ts` hraje celou kampaň botem přes skutečný engine a kontroluje odemčení rodiny, duhy, šatníku, alba a rozšíření. Novou odměnu nebo pravidlo odemykání do toho testu přidej.
