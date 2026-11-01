import React from 'react';
import type { Pokemon } from 'shared';

import Card from './Card';
import { useTheme } from './ThemeContext';

interface PokemonListProps {
  pokemons: Pokemon[];
}

const PokemonList: React.FC<PokemonListProps> = ({ pokemons }) => {
  const { theme } = useTheme();

  if (pokemons.length === 0) {
    return (
      <div className="flex items-center">
        <div className="w-full text-center text-lg">No Pokemon found</div>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-4 place-items-center gap-10 p-4 ${theme === 'light' ? '' : 'bg-slate-800'}`}
    >
      {pokemons.map((pokemon) => (
        <Card key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
};

export default PokemonList;
