'use client';

import { Sun, Moon, Laptop } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from './ThemeProvider';

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return <Sun size={20} />;
      case 'dark':
        return <Moon size={20} />;
      case 'system':
        return <Laptop size={20} />;
      default:
        return <Moon size={20} />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-gray-700 focus:outline-none"
        aria-label="テーマを切り替え"
      >
        {getThemeIcon()}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-slate-200 dark:border-gray-700">
          <button
            className={`flex items-center w-full px-4 py-2 text-sm ${
              theme === 'light'
                ? 'text-primary-600 bg-slate-100 dark:bg-gray-700'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => {
              setTheme('light');
              setIsOpen(false);
            }}
          >
            <Sun size={16} className="mr-2" />
            ライトモード
          </button>
          <button
            className={`flex items-center w-full px-4 py-2 text-sm ${
              theme === 'dark'
                ? 'text-primary-600 bg-slate-100 dark:bg-gray-700'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => {
              setTheme('dark');
              setIsOpen(false);
            }}
          >
            <Moon size={16} className="mr-2" />
            ダークモード
          </button>
          <button
            className={`flex items-center w-full px-4 py-2 text-sm ${
              theme === 'system'
                ? 'text-primary-600 bg-slate-100 dark:bg-gray-700'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-gray-700'
            }`}
            onClick={() => {
              setTheme('system');
              setIsOpen(false);
            }}
          >
            <Laptop size={16} className="mr-2" />
            システム設定
          </button>
        </div>
      )}
    </div>
  );
};
