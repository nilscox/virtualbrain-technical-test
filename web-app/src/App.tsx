import { useEffect, useState } from 'react';
import type { Pokemon } from 'shared';

import { fetchPokemons } from './api';
import { BattleDialog } from './components/BattleDialog';
import { Header } from './components/Header';
import { PokemonFilters } from './components/PokemonFilters';
import { PokemonList } from './components/PokemonList';
import { PokemonSelection } from './components/PokemonSelection';
import { useBattle } from './hooks/useBattle';
import { usePokemonFilters } from './hooks/usePokemonFilters';
import { usePokemonSelection } from './hooks/usePokemonSelection';

export function App() {
  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const filters = usePokemonFilters(pokemons);
  const { selection, isSelected, isFull, toggle } = usePokemonSelection();
  const { battle, start: startBattle, stop: stopBattle } = useBattle();

  useEffect(() => {
    fetchPokemons().then(setPokemons);
  }, []);

  if (!pokemons.length) {
    return (
      <div className="flex h-screen items-center">
        <div className="w-full text-center text-lg">Loading Pokemons...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center bg-amber-50 dark:bg-slate-800">
      <Header />
      <PokemonFilters {...filters} />
      <PokemonList
        pokemons={filters.filteredPokemons}
        isSelected={isSelected}
        isFull={isFull}
        onToggle={toggle}
      />
      <PokemonSelection selection={selection} onUnselect={toggle} onFight={() => startBattle(selection)} />
      {battle && <BattleDialog battle={battle} onClose={stopBattle} />}
    </div>
  );
}
