import type { ReactNode } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import Svg from 'react-native-svg';
import { SCENE_H, SCENE_W } from '../game/constants';
import type { Point } from '../game/types';
import type { View } from './Scenery';

export interface Viewport {
  width: number;
  height: number;
  scale: number;
  view: View;
  toScene: (x: number, y: number) => Point;
  toScreen: (x: number, y: number) => Point;
}

export function viewportFor(width: number, height: number): Viewport {
  const wide = width / height >= SCENE_W / SCENE_H;
  const scale = wide ? height / SCENE_H : width / SCENE_W;
  const w = width / scale;
  const h = height / scale;
  const x = (SCENE_W - w) / 2;
  const y = wide ? 0 : -(h - SCENE_H) * 0.7;
  return {
    width,
    height,
    scale,
    view: { x, y, w, h },
    toScene: (px, py) => ({ x: x + px / scale, y: y + py / scale }),
    toScreen: (sx, sy) => ({ x: (sx - x) * scale, y: (sy - y) * scale }),
  };
}

export function useViewport() {
  const { width, height } = useWindowDimensions();
  return viewportFor(Math.max(1, width), Math.max(1, height));
}

export function Stage({ viewport, children }: { viewport: Viewport; children: ReactNode }) {
  const { view } = viewport;
  return (
    <Svg style={StyleSheet.absoluteFill} width={viewport.width} height={viewport.height} viewBox={`${view.x} ${view.y} ${view.w} ${view.h}`} preserveAspectRatio="none" pointerEvents="none">
      {children}
    </Svg>
  );
}
