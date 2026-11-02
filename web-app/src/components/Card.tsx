import clsx from 'clsx';
import { IoMdCheckmark } from 'react-icons/io';
import type { Pokemon, StatBlock } from 'shared';

import { typeStyle } from '../typeColors';
import { TypeBadge } from './TypeBadge';

/** Highest base stat of all pokemons, the stat bars are scaled to it */
const MAX_STAT = 255;

const STATS: { key: keyof StatBlock; label: string }[] = [
  { key: 'HP', label: 'HP' },
  { key: 'attack', label: 'Atk' },
  { key: 'defense', label: 'Def' },
  { key: 'speed', label: 'Spd' },
];

/** Background tinted with the pokemon's type color */
const TINTED = 'bg-[color-mix(in_oklab,var(--type)_32%,var(--surface))]';

type PortraitProps = {
  pokemon: Pokemon;
  className?: string;
};

/**
 * The pokemon's artwork in a circle tinted with its type color
 */
export function Portrait({ pokemon, className }: PortraitProps) {
  return (
    <span
      style={typeStyle(pokemon.apiTypes[0]?.name ?? '')}
      className={clsx('block shrink-0 overflow-hidden rounded-full', TINTED, className)}
    >
      <img src={pokemon.image} alt="" className="size-full object-contain p-[8%]" />
    </span>
  );
}

type CardProps = {
  pokemon: Pokemon;
  selected: boolean;
  disabled: boolean;
  onToggle: (pokemon: Pokemon) => void;
};

export function Card({ pokemon, selected, disabled, onToggle }: CardProps) {
  return (
    <button
      type="button"
      aria-label={pokemon.name}
      aria-pressed={selected}
      aria-disabled={disabled}
      title={disabled ? 'Your team is full' : undefined}
      onClick={() => onToggle(pokemon)}
      style={typeStyle(pokemon.apiTypes[0]?.name ?? '')}
      className="group flex flex-col overflow-hidden rounded-2xl border border-line bg-surface text-left transition-[translate,box-shadow,opacity] not-aria-disabled:hover:-translate-y-0.5 not-aria-disabled:hover:shadow-lg aria-disabled:cursor-not-allowed aria-disabled:opacity-45 aria-pressed:border-dex aria-pressed:ring-3 aria-pressed:ring-dex motion-reduce:transition-none"
    >
      <div className={clsx('relative', TINTED)}>
        <span className="absolute top-2.5 left-3 font-display text-sm font-semibold text-ink/60">
          #{String(pokemon.id).padStart(3, '0')}
        </span>
        <span
          aria-hidden
          className="absolute top-2 right-2 hidden size-7 items-center justify-center rounded-full bg-dex text-lg text-white group-aria-pressed:flex"
        >
          <IoMdCheckmark />
        </span>
        <img
          className="aspect-square w-full object-contain p-5"
          src={pokemon.image}
          alt=""
          width={475}
          height={475}
          loading="lazy"
        />
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex flex-col gap-1.5">
          <h2 className="font-display text-lg leading-tight font-bold capitalize">{pokemon.name}</h2>
          <div className="flex flex-wrap gap-1">
            {pokemon.apiTypes.map((type) => (
              <TypeBadge key={type.name} type={type.name} />
            ))}
          </div>
        </div>

        <dl className="grid grid-cols-[auto_1fr_2rem] items-center gap-x-2.5 gap-y-1 text-xs">
          {STATS.map(({ key, label }) => (
            <div key={key} className="contents">
              <dt className="font-medium text-muted">{label}</dt>
              <dd className="h-1.5 overflow-hidden rounded-full bg-track" aria-hidden>
                <div
                  className="h-full rounded-full bg-type"
                  style={{ width: `${(pokemon.stats[key] / MAX_STAT) * 100}%` }}
                />
              </dd>
              <dd className="text-right font-semibold tabular-nums">{pokemon.stats[key]}</dd>
            </div>
          ))}
        </dl>
      </div>
    </button>
  );
}
