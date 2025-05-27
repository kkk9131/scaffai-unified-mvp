import { Sun, Moon, Laptop } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export interface ThemeToggleProps {
  currentTheme: 'light' | 'dark' | 'system';
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void;
}

export const ThemeToggle = ({ currentTheme, onThemeChange }: ThemeToggleProps) => {
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

  const handleThemeSelect = (theme: 'light' | 'dark' | 'system') => {
    onThemeChange(theme);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-md text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
        aria-label="テーマを切り替え"
      >
        {getThemeIcon()}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-600">
          <button
            className={`flex items-center w-full px-4 py-2 text-sm ${
              currentTheme === 'light'
                ? 'text-blue-600 bg-gray-100 dark:bg-gray-600'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
            onClick={() => handleThemeSelect('light')}
          >
            <Sun size={16} className="mr-2" />
            ライトモード
          </button>
          <button
            className={`flex items-center w-full px-4 py-2 text-sm ${
              currentTheme === 'dark'
                ? 'text-blue-600 bg-gray-100 dark:bg-gray-600'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
            onClick={() => handleThemeSelect('dark')}
          >
            <Moon size={16} className="mr-2" />
            ダークモード
          </button>
          <button
            className={`flex items-center w-full px-4 py-2 text-sm ${
              currentTheme === 'system'
                ? 'text-blue-600 bg-gray-100 dark:bg-gray-600'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600'
            }`}
            onClick={() => handleThemeSelect('system')}
          >
            <Laptop size={16} className="mr-2" />
            システム設定
          </button>
        </div>
      )}
    </div>
  );
};
