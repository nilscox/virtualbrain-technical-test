import axios from 'axios';
import React, { useEffect, useState } from 'react';
import type { Pokemon } from 'shared';

import { usePokemonFilters } from '../hooks/usePokemonFilters';
import { Header } from './Header';
import PokemonFilters from './PokemonFilters';
import PokemonList from './PokemonList';

const API_URL = '/api';

const PokemonApp: React.FC = () => {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const filters = usePokemonFilters(pokemons);

  useEffect(() => {
    const getPokemon = async () => {
      const response = await axios.get<{ pokemons: Pokemon[] }>(`${API_URL}/pokemons`);
      setPokemons(response.data.pokemons);
    };

    getPokemon();
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
      <PokemonList pokemons={filters.filteredPokemons} />
    </div>
  );
};

export default PokemonApp;
