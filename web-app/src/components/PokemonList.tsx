import type { Pokemon } from 'shared';

import { Card } from './Card';

type PokemonListProps = {
  pokemons: Pokemon[];
  isSelected: (pokemon: Pokemon) => boolean;
  isFull: boolean;
  onToggle: (pokemon: Pokemon) => void;
};

export function PokemonList({ pokemons, isSelected, isFull, onToggle }: PokemonListProps) {
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
        <Card
          key={pokemon.id}
          pokemon={pokemon}
          selected={isSelected(pokemon)}
          disabled={isFull && !isSelected(pokemon)}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
