import { useCallback, useState } from 'react';
import { MAX_BATTLE_POKEMONS, type Pokemon } from 'shared';

export function usePokemonSelection() {
  const [selection, setSelection] = useState<Pokemon[]>([]);

  const isSelected = (pokemon: Pokemon) => selection.some(({ id }) => id === pokemon.id);
  const isFull = selection.length >= MAX_BATTLE_POKEMONS;

  const toggle = useCallback((pokemon: Pokemon) => {
    setSelection((selection) => {
      if (selection.some(({ id }) => id === pokemon.id)) {
        return selection.filter(({ id }) => id !== pokemon.id);
      }

      return selection.length < MAX_BATTLE_POKEMONS ? [...selection, pokemon] : selection;
    });
  }, []);

  return { selection, isSelected, isFull, toggle };
}
