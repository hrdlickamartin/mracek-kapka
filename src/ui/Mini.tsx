import type { ReactNode } from 'react';
import Svg from 'react-native-svg';
import type { AnimalKind, FamilyId, Mood, PlantKind } from '../game/types';
import type { WardrobeId, WardrobeSlot } from '../progression/wardrobe';
import { AnimalFigure } from '../render/Animal';
import { FamilyCloud } from '../render/Characters';
import { KapkaFigure } from '../render/Kapka';
import { PlantFigure } from '../render/Plant';

export function MiniSvg({ size, box, children }: { size: number; box: [number, number, number, number]; children: ReactNode }) {
  return (
    <Svg width={size} height={size * (box[3] / box[2])} viewBox={box.join(' ')} pointerEvents="none">
      {children}
    </Svg>
  );
}

export function MiniKapka({ size, mood = 'zakladni', worn = {}, time = 0 }: { size: number; mood?: Mood; worn?: Partial<Record<WardrobeSlot, WardrobeId>>; time?: number }) {
  return (
    <MiniSvg size={size} box={[-160, -160, 320, 300]}>
      <KapkaFigure x={0} y={Math.sin(time * 2) * 4} scale={1} mood={mood} worn={worn} />
    </MiniSvg>
  );
}

export function MiniAnimal({ size, kind, react = 0, time = 0 }: { size: number; kind: AnimalKind; react?: number; time?: number }) {
  return (
    <MiniSvg size={size} box={[-105, -140, 210, 152]}>
      <AnimalFigure kind={kind} x={0} y={0} react={react} time={time} />
    </MiniSvg>
  );
}

export function MiniPlant({ size, kind }: { size: number; kind: PlantKind }) {
  return (
    <MiniSvg size={size} box={[-90, -200, 180, 210]}>
      <PlantFigure kind={kind} x={0} y={0} stage={3} pop={0} thirsty={false} wave={0} bubble={false} time={0} />
    </MiniSvg>
  );
}

export function MiniFamily({ size, id, time = 0 }: { size: number; id: FamilyId; time?: number }) {
  return (
    <MiniSvg size={size} box={[-170, -150, 340, 290]}>
      <FamilyCloud id={id} x={0} y={0} time={time} />
    </MiniSvg>
  );
}
