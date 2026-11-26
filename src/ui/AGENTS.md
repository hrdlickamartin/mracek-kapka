# src/ui – obrazovky a ovládání

Prezentační komponenty. Data a callbacky dostávají z `src/GameScreen.tsx`, save samy nemění (výjimkou je volání předaných akcí).

## Obrazovky

| Obrazovka | Soubor | Poznámka |
|---|---|---|
| úvod | `Screens.tsx` `Intro` | jen poprvé, ťuknutí probudí Kapku |
| menu (domov) | `Menu.tsx` | velké Hrát = další neodehraný obrázek (`nextScene`), čtyři menší tlačítka, ručička na Hrát |
| scéna a zahrádka | `GameScreen` + `TouchSurface` + `Hud.tsx` | Domů se drží 1 s |
| slavnost | `Celebration.tsx` | samolepky vyskočí a kývají se, Pokračovat čeká |
| mapa a výběr obrázku | `WorldMap.tsx` | ostrovy z `assets/svety/`, mlha místo zámků, ručička na další krok |
| album, šatník | `Album.tsx`, `Wardrobe.tsx` | samolepky a doplňky reagují na ťuknutí |
| rodiče | `Parents.tsx` | brána (podržet 3 s + úloha), nastavení; jediné místo s textem |
| spánek, konec, otočte telefon | `Screens.tsx` | `RotateNotice` má tlačítko na celou obrazovku |

## Dotyky

- Vše, čeho se dotýká dítě, reaguje na **položení prstu**: `BubbleButton` nebo `PressDown`. `Pressable` s `onPressIn` na webu spolkne ťuknutí kratší než 50 ms (react-native-web čeká na `delayPressIn`). `Pressable` s `onPress` patří jen do rodičovské zóny.
- `BubbleButton`: `variant` (`primary | go | cloud | paper`), `hold` v sekundách (kroužek postupu, předčasné puštění nic neudělá), `pulse` (žlutá záře, 3 opakování), `mist` (ještě neobjevené). Každé tlačítko potřebuje `label` pro čtečky.
- `TouchSurface` bere jen první prst a ignoruje doteky začínající v krajních 8 % šířky. Překryvné vrstvy nad scénou mají `pointerEvents="box-none"`.
- Velikosti ber z `SIZES` v `theme.ts` (hlavní 120, trvalé 80, nejmenší trvalé 72). Na telefonu 740 × 320 se tlačítka nezmenšují pod tato minima.

## Navádění

Každá obrazovka, na které má dítě něco udělat, ukazuje další krok: `HintHand` (animovaná ručička s vlnou) na hlavní akci, `pulse` na tlačítku. Ve scéně navádí engine (`state.goal`), UI k tomu nic nepřidává.

## Text a písmo

Dítě text nevidí. Text smí: logo v úvodu, `Parents.tsx` a `RotateNotice` (čte rodič). Písmo je Nunito (`FONTS` v `theme.ts`), načtené v `App.tsx`; `npm run check:fonts` ověřuje českou diakritiku.

## Orientace a web

Aplikace je jen na šířku (`app.json`). Na webu na výšku ukáže `RotateNotice` animovaný telefon a tlačítko „Hrát na celou obrazovku“ (`requestFullscreen` + `screen.orientation.lock("landscape")`; Chrome na Androidu zámek podporuje jen v režimu celé obrazovky, iOS Safari ho nepodporuje vůbec). Kontroluj emulací telefonu s dotykem a pak na skutečném telefonu.

## Lint a hooky

- `Animated.Value` vytvářej přes `useState(() => new Animated.Value(0))[0]`, ne `useRef(...).current` (pravidlo `react-hooks/refs`).
- `Math.random()` a `Date.now()` nevolej při renderu; použij inicializátor `useState` nebo efekt (pravidlo `react-hooks/purity`, hláška „Cannot call impure function during render“).
- Animace s `useNativeDriver: Platform.OS !== 'web'`.
