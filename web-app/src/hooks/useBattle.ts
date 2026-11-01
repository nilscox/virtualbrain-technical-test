import { useCallback, useEffect, useRef, useState } from 'react';
import type { Pokemon } from 'shared';

import { fetchBattle } from '../api';
import { readStream } from '../utils';

export interface Battle {
  pokemons: Pokemon[];
  text: string;
  status: 'fighting' | 'done' | 'error';
}

export function useBattle() {
  const [battle, setBattle] = useState<Battle>();
  const abortController = useRef<AbortController>(null);

  const stop = useCallback(() => {
    abortController.current?.abort();
    abortController.current = null;
    setBattle(undefined);
  }, []);

  const start = useCallback(async (pokemons: Pokemon[]) => {
    abortController.current?.abort();

    const controller = new AbortController();
    abortController.current = controller;

    const update = (changes: Partial<Battle>) => {
      if (!controller.signal.aborted) {
        setBattle((battle) => battle && { ...battle, ...changes });
      }
    };

    setBattle({ pokemons, text: '', status: 'fighting' });

    try {
      let text = '';

      await readStream(await fetchBattle(pokemons, controller.signal), (chunk) => {
        text += chunk;
        update({ text });
      });

      update({ status: 'done' });
    } catch (error) {
      if (!controller.signal.aborted) {
        console.error(error);
        update({ status: 'error' });
      }
    }
  }, []);

  useEffect(() => () => abortController.current?.abort(), []);

  return { battle, start, stop };
}
