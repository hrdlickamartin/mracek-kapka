import type { LineId } from '../game/types';

export const LINES: Record<LineId, string[]> = {
  pozdrav: ['Ahoj! Pojď si hrát.', 'Ahoj, Kapko!'],
  'let-k-vode': ['Leť k vodě!', 'Poletíme pro vodu?'],
  zizen: ['Kytička má žízeň!', 'Zalijeme kytičku?'],
  hura: ['Hurá, kvete!', 'Juchú!', 'Podívej, vyrostla!'],
  prazdno: ['Kapka má prázdno.', 'Leť pro vodu!'],
  slavnost: ['Hurá, všechno kvete!', 'Podívej, kdo přiletěl!'],
  objev: ['Jéé, překvapení!', 'Ťuk! Co tu je?', 'Jéé, {name}!'],
  slunicko: ['Sluníčko moc hřeje!', 'Leť zase k vodě!'],
  vitr: ['Fuk! To je vítr!', 'Větřík si hraje!'],
  snih: ['Padá sníh!'],
  'dobrou-noc': ['Dobrou noc, Kapko.', 'Kapka jde spát.'],
  rodina: ['Hurá, {name}!', 'Našli jsme {name}!'],
  zvire: ['{name}!', 'Ahoj, {name}!'],
  'kudy-dal': ['Nejdřív tamhle!', 'Poletíme tudy!'],
};

export function lineText(line: LineId, subject?: string) {
  const variants = LINES[line].filter((v) => subject || !v.includes('{name}'));
  const text = variants[Math.floor(Math.random() * variants.length)] ?? LINES[line][0];
  return subject ? text.replace('{name}', subject) : text;
}
