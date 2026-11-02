import { useEffect, useState } from 'react';
import type { Pokemon } from 'shared';

import { fetchPokemons } from './api';
import { Arena } from './components/Arena';
import { Header, Lens } from './components/Header';
import { PokemonFilters } from './components/PokemonFilters';
import { PokemonList } from './components/PokemonList';
import { usePokemonFilters } from './hooks/usePokemonFilters';
import { usePokemonSelection } from './hooks/usePokemonSelection';

export function App() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [error, setError] = useState<unknown>();
  const filters = usePokemonFilters(pokemons);
  const { selection, isSelected, isFull, toggle } = usePokemonSelection();

  useEffect(() => {
    fetchPokemons().then(setPokemons).catch(setError);
  }, []);

  if (error) {
    // Show the error boundary
    throw error;
  }

  if (!pokemons.length) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4">
        <Lens className="size-14 motion-safe:animate-pulse" />
        <p className="text-lg text-muted">Loading the Pokédex…</p>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex flex-1 flex-col">
        <PokemonFilters {...filters} total={pokemons.length} />
        <PokemonList
          pokemons={filters.filteredPokemons}
          isSelected={isSelected}
          isFull={isFull}
          onToggle={toggle}
        />
      </main>
      <Arena selection={selection} onUnselect={toggle} />
    </div>
  );
}
