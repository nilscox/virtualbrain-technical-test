import type { Pokemon } from 'shared';

import { useBattle } from '../hooks/useBattle';
import { BattleDialog } from './BattleDialog';
import { PokemonSelection } from './PokemonSelection';

type ArenaProps = {
  selection: Pokemon[];
  onUnselect: (pokemon: Pokemon) => void;
};

export function Arena({ selection, onUnselect }: ArenaProps) {
  const { battle, start, stop } = useBattle();

  return (
    <>
      <PokemonSelection selection={selection} onUnselect={onUnselect} onFight={() => start(selection)} />
      {battle && <BattleDialog battle={battle} onClose={stop} />}
    </>
  );
}
