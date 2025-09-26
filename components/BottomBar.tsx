import React from 'react';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';

interface BottomBarProps {
  theme: 'light' | 'dark';
  language: 'vi' | 'en';
  onThemeToggle: () => void;
  onLanguageToggle: () => void;
}

const BottomBar: React.FC<BottomBarProps> = ({ theme, language, onThemeToggle, onLanguageToggle }) => {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm px-4 sm:px-6 lg:px-8 py-3 border-t border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 z-50">
      <div className="w-full flex justify-between items-center">
        <p className="text-xs sm:text-sm">
          WOMEN STUDIO (VIP Ver 1.0) - {language === 'vi' ? 'Tạo bởi Johnny Hoàng' : 'Created by Johnny Hoàng'}
        </p>
        <div className="flex items-center gap-4">
          <button
            onClick={onLanguageToggle}
            className="text-xs sm:text-sm font-semibold p-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle language"
          >
            {language === 'vi' ? 'EN' : 'VI'}
          </button>
          <button 
            onClick={onThemeToggle}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </footer>
  );
};

export default BottomBar;