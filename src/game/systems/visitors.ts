import { ANIMALS, animalMove } from '../catalog';
import { GROUND_Y, SCENE_W } from '../constants';
import type { AnimalKind, GameState, Point, Visitor } from '../types';
import { burst } from './effects';

function startFor(state: GameState, animal: AnimalKind, at: Point): Point {
  const left = at.x < SCENE_W / 2;
  switch (animalMove(ANIMALS[animal])) {
    case 'leti':
      return { x: at.x + (left ? -500 : 500), y: -80 };
    case 'vyleze':
      return { x: at.x, y: at.y + 70 };
    case 'plave':
      return { x: state.source.x, y: GROUND_Y - 10 };
    case 'leze':
      return { x: at.x + (left ? -260 : 260), y: at.y };
    default:
      return { x: left ? -120 : SCENE_W + 120, y: at.y };
  }
}

export function addVisitor(state: GameState, animal: AnimalKind, at: Point, celebrant: boolean, from?: Point) {
  const start = from ?? startFor(state, animal, at);
  if (animalMove(ANIMALS[animal]) === 'vyleze') burst(state, 'hlina', at.x, GROUND_Y - 5, 8, 140, 10);
  const v: Visitor = { id: state.nextId++, animal, x: start.x, y: start.y, tx: at.x, ty: at.y, arrive: 0, react: 0, celebrant, fromX: start.x, fromY: start.y, wish: null, happy: 0 };
  state.visitors.push(v);
  return v;
}
