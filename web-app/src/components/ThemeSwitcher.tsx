import { IoIosMoon, IoIosSunny } from 'react-icons/io';

function toggleTheme() {
  const dark = document.documentElement.classList.toggle('dark');

  try {
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  } catch {}
}

export function ThemeSwitcher() {
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="flex size-10 items-center justify-center rounded-full text-xl text-white transition-colors hover:bg-white/15 focus-visible:outline-white"
    >
      <IoIosMoon aria-hidden className="dark:hidden" />
      <IoIosSunny aria-hidden className="hidden dark:block" />
      <span className="sr-only dark:hidden">Switch to the dark theme</span>
      <span className="sr-only hidden dark:inline">Switch to the light theme</span>
    </button>
  );
}
