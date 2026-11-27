# src/progression – postup a odměny

Čisté funkce nad `SaveData` a jeden hook, který je ukládá. Nic tu nekreslí ani nehraje zvuk.

## Soubory

| Soubor | Obsah |
|---|---|
| `saveData.ts` | `SaveData`, `Settings`, `DEFAULT_SAVE`, `migrateSave` |
| `save.ts` | `loadSave` / `writeSave` přes AsyncStorage, klíč `mracek-kapka-save-v1` |
| `progress.ts` | odemykání (`worldUnlocked`, `sceneUnlocked`, `nextScene`), odvozené odměny (`familyFound`, `rainbowStripes`, `campaignDone`, `worldsDone` pro praporky zahrádky), `applyScene`, `toggleWear`, `guestOfDay`, pytlíček semínek (`seedPlanted`, `plantPouch`, `freeSlots`), `seasonFor(měsíc)` |
| `wardrobe.ts` | `WARDROBE`: 12 doplňků, každý se slotem (`hlava`, `oci`, `krk`, `tvare`) a prahem `afterScenes` |
| `useProgress.ts` | drží save v React state, `update` hned zapisuje, `finishScene`, `reset` (zachová nastavení) |

## Pravidla

- Ukládá se jen to, co nejde odvodit: dohrané scény, album, semínka, zahrádka, vlastněné a nošené doplňky, `rainbow`, `ending`, nastavení. Rodina, pruhy duhy a odemčené světy se **odvozují** ze `scenes`; neukládej je zvlášť, rozejdou se.
- `applyScene` je čistá a idempotentní: opakované dohrání scény nic nezdvojí. Vrací `SceneSummary` pro slavnost (nová zvířátka, semínka, doplňky, člen rodiny, pruh duhy, konec kampaně).
- Odemykání: první svět vždy, další po dohrání předchozího, světy rozšíření po `ending`; scéna po dohrání předchozí ve stejném světě. Neobjevené se v UI ukazuje mlhou, ne zámkem.
- Zahrádka má 7 míst (`GARDEN_SLOTS`). Nová semínka jdou do pytlíčku (`pouch`, nejvýš tolik, kolik je volných míst) a dítě je v zahrádce zasadí samo (event `planted` → `seedPlanted`). Když z zahrádky odejde dřív, `plantPouch` je při odchodu zasadí na první volná místa, takže se nikdy neztratí. Stav rostlinek zahrádky se ukládá při každém růstu (event `tone` v `GameScreen`).
- Praporky nad zahrádkou (za každý dokončený svět jeden v barvě `palette.accent`) se odvozují ze `scenes`, neukládají se.
- **Nové pole v save:** přidej ho do `SaveData`, výchozí hodnotu do `DEFAULT_SAVE` a v `migrateSave` zajisti, že starý save bez pole dostane výchozí hodnotu. Klíč `mracek-kapka-save-v1` neměň, ztratil by se postup dětí.
- Nastavení jsou úrovně 0–4 (`music`, `sfx`); `migrateSave` zahazuje neznámá nastavení (staré `voice`), `sleepMinutes` 0/10/20/30, přepínače `haptics`, `reducedMotion`, `highContrast`, jazyk rodičovské zóny `lang` (`cs | en`; výchozí `langOf` z jazyka zařízení, jinak `cs`; neznámá hodnota se vrátí na výchozí).

## Testy

`tests/progress.test.ts` hraje celou kampaň botem přes skutečný engine a kontroluje odemčení rodiny, duhy, šatníku, alba a rozšíření. Novou odměnu nebo pravidlo odemykání do toho testu přidej.
