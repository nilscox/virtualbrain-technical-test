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
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-16 text-center sm:px-6">
        <p className="font-display text-xl font-semibold">No Pokémon match these filters</p>
        <p className="mt-1 text-muted">Try another name, or clear the type filters.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto grid w-full max-w-7xl flex-1 grid-cols-[repeat(auto-fill,minmax(9.5rem,1fr))] content-start gap-3 px-4 pt-4 pb-8 sm:grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] sm:gap-5 sm:px-6">
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
