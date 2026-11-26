import { useRef } from 'react';
import { type GestureResponderEvent, StyleSheet, View } from 'react-native';
import { EDGE_FRACTION } from '../game/constants';
import type { Input } from '../game/types';
import type { Viewport } from '../render/Stage';

interface Touch {
  identifier?: string | number;
  pageX: number;
  pageY: number;
}

export function TouchSurface({ viewport, input, onTouch }: { viewport: Viewport; input: React.RefObject<Input>; onTouch: () => void }) {
  const active = useRef<string | number | null>(null);
  const ignored = useRef(false);

  const point = (t: Touch) => viewport.toScene(t.pageX, t.pageY);

  const pick = (e: GestureResponderEvent): Touch | null => {
    const n = e.nativeEvent as unknown as Touch & { touches?: Touch[] };
    if (n.touches && n.touches.length) {
      const found = n.touches.find((t) => t.identifier === active.current);
      return found ?? null;
    }
    return n;
  };

  return (
    <View
      style={StyleSheet.absoluteFill}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onResponderGrant={(e) => {
        const n = e.nativeEvent as unknown as Touch;
        onTouch();
        const edge = viewport.width * EDGE_FRACTION;
        if (n.pageX < edge || n.pageX > viewport.width - edge) {
          ignored.current = true;
          return;
        }
        ignored.current = false;
        active.current = n.identifier ?? null;
        const p = point(n);
        input.current.pointer = p;
        input.current.tap = p;
      }}
      onResponderMove={(e) => {
        if (ignored.current) return;
        const t = pick(e);
        if (t) input.current.pointer = point(t);
      }}
      onResponderRelease={() => {
        ignored.current = false;
        active.current = null;
        input.current.pointer = null;
      }}
      onResponderTerminate={() => {
        ignored.current = false;
        active.current = null;
        input.current.pointer = null;
      }}
    />
  );
}
