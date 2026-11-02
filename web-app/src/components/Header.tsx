import clsx from 'clsx';

import { ThemeSwitcher } from './ThemeSwitcher';

type LensProps = {
  className?: string;
};

/**
 * The big blue lens of the Pokédex
 */
export function Lens({ className }: LensProps) {
  return (
    <span
      aria-hidden
      className={clsx(
        'relative block shrink-0 rounded-full border-[3px] border-white bg-lens shadow-[inset_-3px_-4px_0_rgb(0_0_0/0.25)]',
        className,
      )}
    >
      <span className="absolute top-[18%] left-[18%] size-[28%] rounded-full bg-white/75" />
    </span>
  );
}

export function Header() {
  return (
    <header className="w-full border-b-4 border-dex-deep bg-dex text-white">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Lens className="size-11 sm:size-12" />
        <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl">PokeBattle</h1>
        <div className="ml-auto">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
