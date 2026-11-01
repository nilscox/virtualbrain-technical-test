import { useMemo, useState } from 'react';
import type { Pokemon, PokemonType } from 'shared';

export function usePokemonFilters(pokemons: Pokemon[]) {
  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  const types = useMemo(() => {
    const types = new Map<string, PokemonType>();

    for (const pokemon of pokemons) {
      for (const type of pokemon.apiTypes) {
        types.set(type.name, type);
      }
    }

    return Array.from(types.values()).sort((a, b) => a.name.localeCompare(b.name));
  }, [pokemons]);

  const filteredPokemons = useMemo(() => {
    const query = search.trim().toLowerCase();

    return pokemons.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(query) &&
        (selectedTypes.length === 0 || pokemon.apiTypes.some((type) => selectedTypes.includes(type.name))),
    );
  }, [pokemons, search, selectedTypes]);

  const toggleType = (type: string) => {
    setSelectedTypes((selected) =>
      selected.includes(type) ? selected.filter((name) => name !== type) : [...selected, type],
    );
  };

  return { types, search, setSearch, selectedTypes, toggleType, filteredPokemons };
}
