
import React from 'react';
import { SunIcon, MoonIcon } from '../constants';

type Theme = 'light' | 'dark';

interface ThemeToggleProps {
  theme: Theme;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      className="relative inline-flex items-center justify-center w-10 h-10 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-900 focus:ring-indigo-500 transition-colors"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      <div className="relative w-6 h-6 flex items-center justify-center overflow-hidden">
        <SunIcon
          className={`absolute text-amber-500 transition-all duration-300 transform ${
            theme === 'light' ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
          }`}
        />
        <MoonIcon
          className={`absolute text-indigo-400 transition-all duration-300 transform ${
            theme === 'dark' ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0'
          }`}
        />
      </div>
    </button>
  );
};

export default React.memo(ThemeToggle);