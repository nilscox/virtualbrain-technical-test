import React from 'react';
import { IoIosMoon, IoIosSunny } from 'react-icons/io';

const ThemeSwitcher: React.FC = () => {
  return (
    <button
      onClick={() => document.documentElement.classList.toggle('dark')}
      className="absolute top-0 right-0 m-4"
    >
      <div className="flex items-center gap-2 dark:hidden">
        Dark <IoIosMoon />
      </div>
      <div className="hidden items-center gap-2 dark:flex">
        Light <IoIosSunny />
      </div>
    </button>
  );
};

export default ThemeSwitcher;
