import { Menu, Bell, User } from 'lucide-react';
import { useState } from 'react';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header = ({ sidebarOpen, setSidebarOpen }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-dark-400 shadow-sm h-16 flex items-center px-4 z-10">
      <div className="flex items-center justify-between w-full">
        <button
          className="p-2 rounded-md lg:hidden text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-300 focus:outline-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={24} />
        </button>
        
        <div className="flex items-center gap-2 ml-auto">
          <ThemeToggle />
          
          <button className="p-2 rounded-full text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-300 focus:outline-none relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
          </button>
          
          <div className="relative">
            <button
              className="flex items-center gap-2 p-2 rounded-full text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-300 focus:outline-none"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white">
                <User size={16} />
              </div>
            </button>
            
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-dark-300 rounded-md shadow-lg py-1 z-50 border border-slate-200 dark:border-dark-100">
                <div className="px-4 py-2 border-b border-slate-200 dark:border-dark-100">
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200">{user?.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{user?.email}</p>
                </div>
                
                <Link 
                  to="/profile" 
                  className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-200"
                  onClick={() => setUserMenuOpen(false)}
                >
                  プロフィール
                </Link>
                
                {user?.isAdmin && (
                  <Link 
                    to="/admin" 
                    className="block px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-200"
                    onClick={() => setUserMenuOpen(false)}
                  >
                    管理者ダッシュボード
                  </Link>
                )}
                
                <button 
                  className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-200"
                  onClick={() => {
                    logout();
                    setUserMenuOpen(false);
                  }}
                >
                  ログアウト
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;