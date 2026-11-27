# tests – testy enginu a progrese

`npm run test` (Node test runner přes `tsx`), typy testů hlídá `npm run typecheck` přes `tests/tsconfig.json`. Testy importují jen `src/game` a `src/progression`, nic z Reactu.

## Co testy drží

- `engine.test.ts`:
  - **bot dohraje každou scénu každého světa** do 150 s simulace (`botInput`: leť k vodě, když je potřeba, jinak k nejbližší žíznivé rostlince);
  - rozmístění scén: 3–5 rostlinek, rozestup aspoň 200, nic u vody ani v okrajích;
  - 4 fáze růstu a tón za každou fázi; po slavnosti hra čeká; `complete` přijde hned na začátku slavnosti;
  - slunce nesníží vodu pod nulu, vítr posune nejvýš o 10 % šířky;
  - schovávačka se odhalí ťuknutím, nápověda přichází postupně, po 30 s Kapáček usne a dotek ho probudí;
  - výuka vede k vodě a pak k rostlince; v poušti vznikne duha; cíl (`state.goal`) ukazuje správný další krok;
  - vzory rozložení (voda uprostřed, 3 varianty pozadí, kouzelná věc stranou), mlýn dokončený deštěm, kouzelná věc jako bonus (cíl na ni neukazuje), šero noci a světlušky, příliv v mezích a při nasávání stojí, přání zvířátka, příchod podle druhu, sázení semínek přeletem i ťuknutím, zima a místo hosta v zahrádce.
- `progress.test.ts`: odemykání od začátku, **celá kampaň botem** (rodina, 5 pruhů duhy, celý šatník, album, rozšíření, semínka v pytlíčku a po zasazení zahrádka max. 7), idempotence `applyScene`, šatník, návštěva dne, migrace poškozeného save.

## Psaní testů

- Simuluj s `DT = 1 / 30` a helperem `play(state, seconds, input)`; vstup je `{ pointer, tap }` ve scénových souřadnicích, `pointer.y` počítej s `KAPKA_FINGER_OFFSET`.
- Náhoda v enginu (`Math.random`) ovlivňuje jen částice a varianty, ne výsledek; test na konkrétní hodnotu částic nepiš.
- Každá nová mechanika nebo svět potřebuje test chování a musí projít bot přes všechny scény. Když bot scénu nedohraje, je chyba v datech nebo ladění, ne v testu.
- Názvy testů česky, popisují chování („slunce Kapáčka vysuší, ale nikdy nezmizí“).
