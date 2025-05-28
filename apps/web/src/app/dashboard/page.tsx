/**
 * 📊 ScaffAI Dashboard Page
 * ログイン後の美しいダッシュボード（元のホームページデザインベース）
 */

'use client';

import { Calculator, FileText, Layers, Clock, AlertTriangle, Menu, Bell, User, Sun, Moon, Laptop, LogOut } from 'lucide-react';
import { useTheme } from '../components/ThemeProvider';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// インラインでThemeToggleを定義
const ThemeToggleInline = () => {
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

export default function Dashboard() {
  const router = useRouter();
  const user = { name: 'デモユーザー', email: 'demo@scaffai.com' };
  const recentProjects = [
    { id: 1, name: '東京タワープロジェクト', date: '2025-05-15', status: '完了' },
    { id: 2, name: '大阪梅田改修工事', date: '2025-05-12', status: '進行中' },
    { id: 3, name: '名古屋駅ビル建設', date: '2025-05-08', status: '計画中' },
  ];

  // ログアウト処理
  const handleLogout = () => {
    // 簡易的なログアウト（実際のSupabase認証は後で実装）
    router.push('/login');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm h-16 flex items-center px-4 z-10">
        <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              🏗️ ScaffAI Dashboard
            </h1>
          </div>
          
          <div className="flex items-center gap-2">
            <ThemeToggleInline />
            <button className="p-2 rounded-full text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-gray-700 focus:outline-none relative">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary-500 rounded-full"></span>
            </button>
            <div className="flex items-center gap-2 p-2 rounded-full text-slate-600 dark:text-slate-200">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white">
                <User size={16} />
              </div>
              <span className="text-sm hidden sm:block">{user.email}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-3 py-2 text-slate-600 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-gray-700 rounded-md transition-colors"
            >
              <LogOut size={16} />
              <span className="hidden sm:block">ログアウト</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            こんにちは、{user.name}さん
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            ScaffAIダッシュボードへようこそ
          </p>
        </header>

        {/* Day 5 修正: 全て /scaffold に統一 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg inline-block mb-4">
              <Calculator className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">計算ツール</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">足場の寸法を入力して計算</p>
            <Link
              href="/scaffold"
              className="text-primary-600 dark:text-primary-400 font-medium text-sm hover:underline"
            >
              入力を開始 →
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="bg-secondary-100 dark:bg-secondary-900/30 p-3 rounded-lg inline-block mb-4">
              <FileText className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">計算結果</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">最新の計算結果を表示</p>
            <Link
              href="/scaffold"
              className="text-secondary-600 dark:text-secondary-400 font-medium text-sm hover:underline"
            >
              結果を確認 →
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="bg-accent-100 dark:bg-accent-900/30 p-3 rounded-lg inline-block mb-4">
              <Layers className="h-6 w-6 text-accent-600 dark:text-accent-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">描画ツール</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">2D/3D自動描画インターフェース</p>
            <Link
              href="/drawing"
              className="text-accent-600 dark:text-accent-400 font-medium text-sm hover:underline"
            >
              描画を開始 →
            </Link>
          </motion.div>

          <motion.div
            whileHover={{ y: -5 }}
            transition={{ type: 'spring', stiffness: 300 }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="bg-success-100 dark:bg-success-900/30 p-3 rounded-lg inline-block mb-4">
              <Clock className="h-6 w-6 text-success-600 dark:text-success-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">最近のプロジェクト</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">最近のプロジェクト履歴</p>
            <Link
              href="/projects"
              className="text-success-600 dark:text-success-400 font-medium text-sm hover:underline"
            >
              すべて表示 →
            </Link>
          </motion.div>
        </div>

        {/* クイックアクセス - Day 5 修正 */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">クイックアクセス</h2>
          <div className="space-y-2">
            <Link
              href="/scaffold"
              className="block p-3 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg hover:from-green-100 hover:to-green-200 dark:hover:from-green-800/30 dark:hover:to-green-700/30 transition-all duration-200 border border-green-200 dark:border-green-700"
            >
              <div className="flex items-center gap-3">
                <div className="bg-green-500 p-1.5 rounded-md">
                  <Calculator className="h-4 w-4 text-white" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-green-800 dark:text-green-200">🏗️ 足場計算システム</span>
                  <p className="text-xs text-green-600 dark:text-green-300">リアルタイム計算 & Railway API</p>
                </div>
              </div>
            </Link>
            
            <Link
              href="/scaffold"
              className="block p-3 bg-slate-50 dark:bg-gray-700 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Calculator className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                <span className="text-sm text-slate-900 dark:text-white">新規計算を開始</span>
              </div>
            </Link>
            
            <Link
              href="/scaffold"
              className="block p-3 bg-slate-50 dark:bg-gray-700 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
                <span className="text-sm text-slate-900 dark:text-white">保存された計算</span>
              </div>
            </Link>
            
            <Link
              href="/drawing"
              className="block p-3 bg-slate-50 dark:bg-gray-700 rounded-lg hover:bg-slate-100 dark:hover:bg-gray-600 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Layers className="h-5 w-5 text-accent-600 dark:text-accent-400" />
                <span className="text-sm text-slate-900 dark:text-white">足場図面描画</span>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
