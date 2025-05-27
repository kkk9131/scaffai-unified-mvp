import { Outlet } from 'react-router-dom';
import { Bold as Scaffold } from 'lucide-react';
import ThemeToggle from '../components/ThemeToggle';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-slate-200 dark:from-dark-500 dark:to-dark-700 flex flex-col">
      <header className="py-4 px-6 flex justify-end">
        <ThemeToggle />
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary-600 dark:bg-primary-500 rounded-full p-4 inline-flex">
                <Scaffold size={40} className="text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">ScaffAI</h1>
            <p className="text-lg text-slate-600 dark:text-slate-300">足場計算をサポートするアプリです</p>
          </div>
          
          <div className="bg-white dark:bg-dark-300 rounded-xl shadow-xl overflow-hidden">
            <Outlet />
          </div>
        </div>
      </main>
      
      <footer className="py-4 text-center text-sm text-slate-500 dark:text-slate-400">
        &copy; 2025 ScaffAI. All rights reserved.
      </footer>
    </div>
  );
};

export default AuthLayout;