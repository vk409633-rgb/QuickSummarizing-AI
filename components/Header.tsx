import React from 'react';
import { BoltIcon } from '../constants';
import ThemeToggle from './ThemeToggle';

type Theme = 'light' | 'dark';

interface HeaderProps {
    theme: Theme;
    onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  return (
    <header className="bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl sticky top-0 z-40 border-b border-slate-200/80 dark:border-slate-800/80">
      <nav className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="/" className="flex items-center gap-2 text-xl font-bold text-slate-900 dark:text-white transition-transform duration-300 hover:scale-105">
              <BoltIcon className="h-7 w-7" style={{ stroke: 'url(#boltGradient)' }}/>
              <span className="text-2xl font-extrabold tracking-tight">QuickSummarize</span>
            </a>
          </div>
          <div className="flex items-center gap-4">
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
            >
              GitHub
            </a>
            <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          </div>
        </div>
      </nav>
    </header>
  );
};

export default React.memo(Header);