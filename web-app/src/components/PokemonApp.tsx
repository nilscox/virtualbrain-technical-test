import React, { useEffect, useState } from 'react';
import type { Pokemon } from 'shared';

import { fetchPokemons } from '../api';
import { usePokemonFilters } from '../hooks/usePokemonFilters';
import { usePokemonSelection } from '../hooks/usePokemonSelection';
import { Header } from './Header';
import PokemonFilters from './PokemonFilters';
import PokemonList from './PokemonList';
import PokemonSelection from './PokemonSelection';

const PokemonApp: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const filters = usePokemonFilters(pokemons);
  const { selection, isSelected, isFull, toggle } = usePokemonSelection();

  useEffect(() => {
    fetchPokemons().then(setPokemons);
  }, []);

  if (!pokemons.length) {
    return (
      <div className="flex h-screen items-center">
        <div className="w-full text-center text-lg">Loading Pokemons...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-amber-50 dark:bg-slate-800">
      <Header />
      <PokemonFilters {...filters} />
      <PokemonList
        pokemons={filters.filteredPokemons}
        isSelected={isSelected}
        isFull={isFull}
        onToggle={toggle}
      />
      <PokemonSelection selection={selection} onUnselect={toggle} />
    </div>
  );
};

export default PokemonApp;
