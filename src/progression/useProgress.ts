import { useCallback, useEffect, useRef, useState } from 'react';
import type { SceneResult } from '../game/types';
import { applyScene, type SceneSummary } from './progress';
import { loadSave, writeSave } from './save';
import { DEFAULT_SAVE, type SaveData } from './saveData';

export function useProgress() {
  const [save, setSave] = useState<SaveData>(DEFAULT_SAVE);
  const [loaded, setLoaded] = useState(false);
  const current = useRef(save);

  useEffect(() => {
    loadSave().then((data) => {
      current.current = data;
      setSave(data);
      setLoaded(true);
    });
  }, []);

  const update = useCallback((change: (save: SaveData) => SaveData) => {
    const next = change(current.current);
    current.current = next;
    setSave(next);
    writeSave(next);
    return next;
  }, []);

  const finishScene = useCallback(
    (result: SceneResult): SceneSummary => {
      const applied = applyScene(current.current, result);
      update(() => applied.save);
      return applied.summary;
    },
    [update],
  );

  const reset = useCallback(() => {
    update(() => ({ ...DEFAULT_SAVE, introSeen: true, settings: current.current.settings }));
  }, [update]);

  return { save, loaded, update, finishScene, reset };
}
