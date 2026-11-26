import { useEffect, useRef } from 'react';
import { Platform } from 'react-native';

export function useKeyboard() {
  const keys = useRef(new Set<string>());
  const taps = useRef(0);
  useEffect(() => {
    if (Platform.OS !== 'web' || typeof window === 'undefined') return;
    const down = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === ' ') {
        taps.current++;
        e.preventDefault();
      }
      keys.current.add(e.key);
    };
    const up = (e: KeyboardEvent) => keys.current.delete(e.key);
    window.addEventListener('keydown', down);
    window.addEventListener('keyup', up);
    return () => {
      window.removeEventListener('keydown', down);
      window.removeEventListener('keyup', up);
    };
  }, []);
  return { keys, taps };
}

export function keyDirection(keys: Set<string>) {
  let x = 0;
  let y = 0;
  if (keys.has('ArrowLeft') || keys.has('a')) x -= 1;
  if (keys.has('ArrowRight') || keys.has('d')) x += 1;
  if (keys.has('ArrowUp') || keys.has('w')) y -= 1;
  if (keys.has('ArrowDown') || keys.has('s')) y += 1;
  return x || y ? { x, y } : null;
}
