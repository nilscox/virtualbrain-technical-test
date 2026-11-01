import React, { Fragment, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';

import type { Battle } from '../hooks/useBattle';
import { MiniCard } from './Card';

type BattleDialogProps = {
  battle: Battle;
  onClose: () => void;
};

const BattleDialog: React.FC<BattleDialogProps> = ({ battle, onClose }) => {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (!dialog.current?.open) {
      dialog.current?.showModal();
    }
  }, []);

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      onClick={(event) => event.target === dialog.current && onClose()}
      aria-labelledby="battle-title"
      className="m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl flex-col rounded-2xl bg-amber-50 text-slate-700 shadow-xl backdrop:bg-black/60 open:flex dark:bg-slate-800 dark:text-white"
    >
      <div className="flex flex-wrap items-center justify-center gap-4 bg-amber-100 p-4 dark:bg-slate-700">
        <h2 id="battle-title" className="sr-only">
          Battle
        </h2>
        {battle.pokemons.map((pokemon, index) => (
          <Fragment key={pokemon.id}>
            {index > 0 && <div className="font-bold">VS</div>}
            <MiniCard pokemon={pokemon} />
          </Fragment>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {battle.text === '' && battle.status === 'fighting' && (
          <p className="animate-pulse text-center">The pokemons are entering the arena...</p>
        )}

        <div className="prose max-w-none dark:prose-invert">
          <Markdown>{battle.text}</Markdown>
        </div>

        {battle.status === 'error' && (
          <p className="mt-4 text-center text-red-600 dark:text-red-400">
            The battle was interrupted, please try again.
          </p>
        )}
      </div>

      <div className="flex justify-end p-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-2xl bg-amber-300 px-4 py-2 font-bold text-black shadow-md outline-orange-400 hover:bg-amber-400 focus-visible:outline-dashed"
        >
          {battle.status === 'fighting' ? 'Stop the battle' : 'Close'}
        </button>
      </div>
    </dialog>
  );
};

export default BattleDialog;
