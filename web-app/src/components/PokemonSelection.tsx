import React, { Fragment } from 'react';
import type { Pokemon } from 'shared';

import { MiniCard } from './Card';

interface PokemonSelectionProps {
  selection: Pokemon[];
  onUnselect: (pokemon: Pokemon) => void;
}

const PokemonSelection: React.FC<PokemonSelectionProps> = ({ selection, onUnselect }) => {
  if (selection.length === 0) {
    return null;
  }

  return (
    <div className="sticky bottom-0 z-10 flex w-full items-center justify-center gap-4 bg-amber-100 p-4 shadow-[0_-4px_12px_rgb(0_0_0/0.15)] dark:bg-slate-800">
      {selection.map((pokemon, index) => (
        <Fragment key={pokemon.id}>
          {index > 0 && <div className="font-bold">VS</div>}
          <button type="button" title={`Unselect ${pokemon.name}`} onClick={() => onUnselect(pokemon)}>
            <MiniCard pokemon={pokemon} />
          </button>
        </Fragment>
      ))}
    </div>
  );
};

export default PokemonSelection;
