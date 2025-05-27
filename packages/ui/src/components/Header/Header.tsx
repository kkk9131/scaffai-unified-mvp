import { Menu, Bell, User } from 'lucide-react';
import { useState } from 'react';
import { ThemeToggle } from '../ThemeToggle/ThemeToggle';

export interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  user?: {
    name?: string;
    email?: string;
    isAdmin?: boolean;
  };
  onLogout?: () => void;
  onProfileClick?: () => void;
  onAdminClick?: () => void;
}

export const Header = ({ 
  sidebarOpen, 
  setSidebarOpen, 
  user, 
  onLogout,
  onProfileClick,
  onAdminClick 
}: HeaderProps) => {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm h-16 flex items-center px-4 z-10">
      <div className="flex items-center justify-between w-full">
        <button
          className="p-2 rounded-md lg:hidden text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <Menu size={24} />
        </button>
        
        <div className="flex items-center gap-2 ml-auto">
          <ThemeToggle />
          
          <button className="p-2 rounded-full text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none relative">
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
          </button>
          
          <div className="relative">
            <button
              className="flex items-center gap-2 p-2 rounded-full text-gray-600 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none"
              onClick={() => setUserMenuOpen(!userMenuOpen)}
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                <User size={16} />
              </div>
            </button>
            
            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-700 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-600">
                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-600">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{user?.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email}</p>
                </div>
                
                <button 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => {
                    onProfileClick?.();
                    setUserMenuOpen(false);
                  }}
                >
                  プロフィール
                </button>
                
                {user?.isAdmin && (
                  <button 
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                    onClick={() => {
                      onAdminClick?.();
                      setUserMenuOpen(false);
                    }}
                  >
                    管理者ダッシュボード
                  </button>
                )}
                
                <button 
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600"
                  onClick={() => {
                    onLogout?.();
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
