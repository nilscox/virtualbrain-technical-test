import { Fragment } from 'react';
import type { Pokemon } from 'shared';

import { MiniCard } from './Card';

type PokemonSelectionProps = {
  selection: Pokemon[];
  onUnselect: (pokemon: Pokemon) => void;
  onFight: () => void;
};

export function PokemonSelection({ selection, onUnselect, onFight }: PokemonSelectionProps) {
  if (selection.length === 0) {
    return null;
  }

  return (
    <div className="sticky bottom-0 z-10 flex w-full flex-wrap items-center justify-center gap-4 bg-amber-100 p-4 shadow-[0_-4px_12px_rgb(0_0_0/0.15)] dark:bg-slate-800">
      {selection.map((pokemon, index) => (
        <Fragment key={pokemon.id}>
          {index > 0 && <div className="font-bold">VS</div>}
          <button type="button" title={`Unselect ${pokemon.name}`} onClick={() => onUnselect(pokemon)}>
            <MiniCard pokemon={pokemon} />
          </button>
        </Fragment>
      ))}
      <button
        type="button"
        disabled={selection.length < 2}
        title={selection.length < 2 ? 'Select another pokemon to fight' : undefined}
        onClick={onFight}
        className="rounded-2xl bg-orange-400 px-4 py-2 font-bold text-black shadow-md outline-orange-600 hover:bg-orange-500 focus-visible:outline-dashed disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-orange-400"
      >
        Fight!
      </button>
    </div>
  );
}
