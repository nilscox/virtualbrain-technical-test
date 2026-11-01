import ThemeSwitcher from './ThemeSwitcher';

export function Header() {
  return (
    <div className="sticky top-0 z-10 flex w-full items-center justify-evenly bg-amber-100 p-4 shadow-lg sm:p-7 dark:bg-slate-800">
      <div className="flex flex-col">
        <h1 className="text-center text-5xl font-thin sm:text-7xl">PokeBattle</h1>
        <ThemeSwitcher />
      </div>
    </div>
  );
}
