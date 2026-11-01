import React from 'react';

import { usePokemonFilters } from '../hooks/usePokemonFilters';
import { useTheme } from './ThemeContext';

const PokemonFilters: React.FC<ReturnType<typeof usePokemonFilters>> = ({
  types,
  search,
  setSearch,
  selectedTypes,
  toggleType,
}) => {
  const { theme } = useTheme();

  return (
    <div className="flex w-full max-w-4xl flex-col items-center gap-4 p-4">
      <input
        type="search"
        placeholder="Search a pokemon..."
        aria-label="Search a pokemon by name"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className={`${theme === 'light' ? 'bg-white text-slate-700' : 'bg-slate-700 text-white'} w-full max-w-md rounded-2xl px-4 py-2 shadow-md outline-orange-400 focus:outline-dashed`}
      />
      <div className="flex flex-wrap justify-center gap-2">
        {types.map((type) => (
          <button
            key={type.name}
            type="button"
            title={type.name}
            aria-pressed={selectedTypes.includes(type.name)}
            onClick={() => toggleType(type.name)}
            className="opacity-40 grayscale transition hover:opacity-70 aria-pressed:opacity-100 aria-pressed:grayscale-0"
          >
            <img src={type.image} alt={type.name} className="h-6" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PokemonFilters;
