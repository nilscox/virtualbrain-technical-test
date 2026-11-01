import React from 'react';
import type { Pokemon } from 'shared';

import Card from './Card';

interface PokemonListProps {
  pokemons: Pokemon[];
}

const PokemonList: React.FC<PokemonListProps> = ({ pokemons }) => {
  if (pokemons.length === 0) {
    return (
      <div className="flex items-center">
        <div className="w-full text-center text-lg">No Pokemon found</div>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-[repeat(auto-fill,250px)] justify-center gap-6 p-4 sm:gap-10 dark:bg-slate-800">
      {pokemons.map((pokemon) => (
        <Card key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  );
};

export default PokemonList;
