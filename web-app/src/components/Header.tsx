import { useTheme } from './ThemeContext';
import ThemeSwitcher from './ThemeSwitcher';

export function Header() {
  const { theme } = useTheme();

  return (
    <div
      className={`${theme === 'light' ? 'bg-amber-100 text-slate-700' : 'bg-slate-800 text-white'} sticky top-0 z-10 flex w-full items-center justify-evenly p-4 shadow-lg sm:p-7`}
    >
      <div className="flex flex-col">
        <h1 className="text-center text-5xl font-thin sm:text-7xl">PokeBattle</h1>
        <ThemeSwitcher />
      </div>
    </div>
  );
}
