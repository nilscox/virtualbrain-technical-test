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
        <div className="text-lg text-center w-full">No Pokemon found</div>
      </div>
    );
  }

  return (
    <div
      className={`p-4 grid grid-cols-4 gap-10 place-items-center ${theme === 'light' ? '' : 'bg-slate-800'}`}
    >
      {pokemons.map((pokemon) => (
        <Card key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
};

export default PokemonList;
