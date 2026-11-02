import { IoMdClose } from 'react-icons/io';
import { MAX_BATTLE_POKEMONS, MIN_BATTLE_POKEMONS, type Pokemon } from 'shared';

import { Portrait } from './Card';

const min = MIN_BATTLE_POKEMONS;
const max = MAX_BATTLE_POKEMONS;

type PokemonSelectionProps = {
  selection: Pokemon[];
  onUnselect: (pokemon: Pokemon) => void;
  onFight: () => void;
};

export function PokemonSelection({ selection, onUnselect, onFight }: PokemonSelectionProps) {
  const emptySlots = max - selection.length;
  const canFight = selection.length >= min;

  return (
    <div className="sticky bottom-0 z-10 w-full border-t border-line bg-surface/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-6 gap-y-3 px-4 py-3 sm:px-6">
        <div className="flex w-full items-baseline gap-2 sm:w-auto sm:flex-col sm:gap-0">
          <h2 className="font-display font-bold">Your team</h2>
          <p className="text-sm text-muted">
            {canFight ? `${selection.length} of ${max} Pokémon` : `Pick ${min} to ${max} Pokémon`}
          </p>
        </div>

        <ul className="flex gap-2">
          {selection.map((pokemon) => (
            <li key={pokemon.id}>
              <button
                type="button"
                title={`Remove ${pokemon.name} from your team`}
                onClick={() => onUnselect(pokemon)}
                className="group relative block rounded-full"
              >
                <Portrait pokemon={pokemon} className="size-11 sm:size-12" />
                <span className="sr-only">Remove {pokemon.name} from your team</span>
                <span
                  aria-hidden
                  className="absolute -top-1 -right-1 flex size-5 items-center justify-center rounded-full bg-ink text-xs text-surface opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                >
                  <IoMdClose />
                </span>
              </button>
            </li>
          ))}
          {Array.from({ length: emptySlots }, (_, index) => (
            <li
              key={index}
              aria-hidden
              className="size-11 rounded-full border-2 border-dashed border-line sm:size-12"
            />
          ))}
        </ul>

        <button
          type="button"
          disabled={!canFight}
          onClick={onFight}
          className="w-full rounded-full bg-dex px-6 py-2.5 font-display text-lg font-bold text-white shadow-[inset_0_-3px_0_var(--dex-deep)] transition-colors hover:bg-dex-deep disabled:cursor-not-allowed disabled:bg-track disabled:text-muted disabled:shadow-none sm:ml-auto sm:w-auto"
        >
          Start the battle
        </button>
      </div>
    </div>
  );
}
