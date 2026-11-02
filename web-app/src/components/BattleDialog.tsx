import clsx from 'clsx';
import { Fragment, useEffect, useRef } from 'react';
import Markdown from 'react-markdown';

import type { Battle } from '../hooks/useBattle';
import { Portrait } from './Card';

type BattleDialogProps = {
  battle: Battle;
  onClose: () => void;
};

const STATUS_LABELS: Record<Battle['status'], string> = {
  fighting: 'Battle in progress',
  done: 'Battle over',
  error: 'Battle interrupted',
};

export function BattleDialog({ battle, onClose }: BattleDialogProps) {
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
      className="m-auto max-h-[90vh] w-[calc(100%-2rem)] max-w-2xl flex-col overflow-hidden rounded-3xl bg-surface text-ink shadow-2xl backdrop:bg-black/60 backdrop:backdrop-blur-sm open:flex"
    >
      <div className="border-b-4 border-dex-deep bg-dex px-4 pt-5 pb-4 text-white">
        <h2 id="battle-title" className="sr-only">
          Battle
        </h2>
        <ul className="flex flex-wrap items-start justify-center gap-x-2 gap-y-3">
          {battle.pokemons.map((pokemon, index) => (
            <Fragment key={pokemon.id}>
              {index > 0 && (
                <li aria-hidden className="self-center pb-5 font-display text-sm font-bold text-white/70">
                  vs
                </li>
              )}
              <li className="flex w-16 flex-col items-center gap-1 sm:w-20">
                <Portrait pokemon={pokemon} className="size-14 ring-3 ring-white sm:size-16" />
                <span className="w-full truncate text-center text-xs font-semibold capitalize">
                  {pokemon.name}
                </span>
              </li>
            </Fragment>
          ))}
        </ul>
      </div>

      <p
        className="flex items-center justify-center gap-2 border-b border-line py-2 text-sm font-medium text-muted"
        aria-live="polite"
      >
        <span
          aria-hidden
          className={clsx('size-2 rounded-full', {
            'bg-dex motion-safe:animate-pulse': battle.status === 'fighting',
            'bg-[#5fc46c]': battle.status === 'done',
            'bg-muted': battle.status === 'error',
          })}
        />
        {STATUS_LABELS[battle.status]}
      </p>

      <div className="flex-1 overflow-y-auto px-6 py-5">
        {battle.text === '' && battle.status === 'fighting' && (
          <p className="text-center text-muted motion-safe:animate-pulse">
            The Pokémon are entering the arena…
          </p>
        )}

        <div className="prose max-w-none prose-neutral dark:prose-invert prose-headings:font-display">
          <Markdown>{battle.text}</Markdown>
        </div>

        {battle.status === 'error' && (
          <p className="mt-4 rounded-xl bg-dex/10 px-4 py-3 text-center text-dex dark:text-[#ff8a98]">
            The battle stopped before the end. Close it and start it again.
          </p>
        )}
      </div>

      <div className="flex justify-end border-t border-line px-6 py-4">
        <button
          type="button"
          onClick={onClose}
          className="rounded-full border border-line px-5 py-2 font-semibold transition-colors hover:bg-track"
        >
          {battle.status === 'fighting' ? 'Stop the battle' : 'Close'}
        </button>
      </div>
    </dialog>
  );
}
