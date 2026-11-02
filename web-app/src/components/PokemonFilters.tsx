import { IoIosSearch } from 'react-icons/io';

import { usePokemonFilters } from '../hooks/usePokemonFilters';
import { typeStyle } from '../typeColors';

type PokemonFiltersProps = ReturnType<typeof usePokemonFilters> & {
  total: number;
};

export function PokemonFilters({
  types,
  search,
  setSearch,
  selectedTypes,
  toggleType,
  clearTypes,
  filteredPokemons,
  total,
}: PokemonFiltersProps) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-4 px-4 pt-6 sm:px-6">
      <label className="relative w-full max-w-md">
        <IoIosSearch aria-hidden className="absolute top-1/2 left-3.5 -translate-y-1/2 text-xl text-muted" />
        <input
          type="search"
          placeholder="Search by name"
          aria-label="Search a pokemon by name"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="w-full rounded-full border border-line bg-surface py-2.5 pr-4 pl-11 placeholder:text-muted focus-visible:outline-lens"
        />
      </label>

      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter by type">
        {types.map((type) => (
          <button
            key={type.name}
            type="button"
            style={typeStyle(type.name)}
            aria-pressed={selectedTypes.includes(type.name)}
            onClick={() => toggleType(type.name)}
            className="flex items-center gap-1.5 rounded-full border border-line bg-surface py-1 pr-3 pl-2 text-sm font-medium capitalize transition-colors hover:border-type aria-pressed:border-type aria-pressed:bg-type aria-pressed:text-type-ink"
          >
            <span aria-hidden className="size-2.5 rounded-full bg-type ring-1 ring-black/15" />
            {type.name}
          </button>
        ))}
      </div>

      <p className="flex gap-3 text-sm text-muted" aria-live="polite">
        {filteredPokemons.length === total
          ? `${total} Pokémon`
          : `${filteredPokemons.length} of ${total} Pokémon`}

        {filteredPokemons.length < total && (
          <button
            type="button"
            onClick={() => {
              clearTypes();
              setSearch('');
            }}
            className="font-medium text-muted underline underline-offset-2"
          >
            Clear the filters
          </button>
        )}
      </p>
    </div>
  );
}
