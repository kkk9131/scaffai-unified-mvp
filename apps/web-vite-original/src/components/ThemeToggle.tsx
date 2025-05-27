import { Sun, Moon, Laptop } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useTheme } from '../hooks/useTheme';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { currentTheme, setTheme } = useTheme();
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
    switch (currentTheme) {
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
        className="p-2 rounded-md text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-300 focus:outline-none"
        aria-label="テーマを切り替え"
      >
        {getThemeIcon()}
      </button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute right-0 mt-2 w-40 bg-white dark:bg-dark-300 rounded-md shadow-lg py-1 z-50 border border-slate-200 dark:border-dark-100"
        >
          <button
            className={`flex items-center w-full px-4 py-2 text-sm ${
              currentTheme === 'light'
                ? 'text-primary-600 bg-slate-100 dark:bg-dark-200'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-200'
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
              currentTheme === 'dark'
                ? 'text-primary-600 bg-slate-100 dark:bg-dark-200'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-200'
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
              currentTheme === 'system'
                ? 'text-primary-600 bg-slate-100 dark:bg-dark-200'
                : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-200'
            }`}
            onClick={() => {
              setTheme('system');
              setIsOpen(false);
            }}
          >
            <Laptop size={16} className="mr-2" />
            システム設定
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ThemeToggle;