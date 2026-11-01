import { useCallback, useState } from 'react';
import type { Pokemon } from 'shared';

const MAX_SELECTION = 2;

export function usePokemonSelection() {
  const [selection, setSelection] = useState<Pokemon[]>([]);

  const isSelected = (pokemon: Pokemon) => selection.some(({ id }) => id === pokemon.id);
  const isFull = selection.length >= MAX_SELECTION;

  const toggle = useCallback((pokemon: Pokemon) => {
    setSelection((selection) => {
      if (selection.some(({ id }) => id === pokemon.id)) {
        return selection.filter(({ id }) => id !== pokemon.id);
      }

      return selection.length < MAX_SELECTION ? [...selection, pokemon] : selection;
    });
  }, []);

  return { selection, isSelected, isFull, toggle };
}
