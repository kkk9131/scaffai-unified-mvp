/**
 * 📊 ScaffAI Dashboard Page
 * ログイン後のダッシュボード
 */

'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Plus, History, Settings, LogOut, User } from 'lucide-react';
import { auth, projects, type ScaffAIProject } from '@scaffai/config';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [userProjects, setUserProjects] = useState<ScaffAIProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    loadProjects();
  }, []);

  // 🔐 認証チェック
  const checkAuth = async () => {
    try {
      const { data } = await auth.getCurrentUser();
      if (!data.user) {
        router.push('/login');
        return;
      }
      setUser(data.user);
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/login');
    }
  };

  // 📋 プロジェクト読み込み
  const loadProjects = async () => {
    try {
      const { data, error } = await projects.getAll();
      if (error) throw error;
      setUserProjects(data || []);
    } catch (error) {
      console.error('Failed to load projects:', error);
    } finally {
      setLoading(false);
    }
  };

  // 🚪 ログアウト
  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // ✨ 新しいプロジェクト作成
  const createNewProject = () => {
    router.push('/scaffold');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* 🎯 ヘッダー */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-primary" />
              <h1 className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                ScaffAI Dashboard
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user?.email}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                <span>ログアウト</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* 📊 メインコンテンツ */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* 🎯 アクションカード */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* 新規プロジェクト */}
            <div 
              onClick={createNewProject}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-primary"
            >
              <div className="p-6 text-center">
                <Plus className="mx-auto h-12 w-12 text-primary mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  新しいプロジェクト
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  足場設計を開始
                </p>
              </div>
            </div>

            {/* 統計カード */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <History className="h-8 w-8 text-secondary" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      プロジェクト数
                    </h3>
                    <p className="text-2xl font-bold text-secondary">
                      {userProjects.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 設定 */}
            <div className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg hover:shadow-lg transition-shadow cursor-pointer">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Settings className="h-8 w-8 text-accent" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      設定
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      アカウント設定
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 📋 プロジェクト一覧 */}
          <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                最近のプロジェクト
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500 dark:text-gray-400">
                あなたの足場設計プロジェクト
              </p>
            </div>
            
            {userProjects.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                  プロジェクトがありません
                </h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  新しいプロジェクトを作成して始めましょう
                </p>
                <div className="mt-6">
                  <button
                    onClick={createNewProject}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90"
                  >
                    <Plus className="-ml-1 mr-2 h-5 w-5" />
                    新規作成
                  </button>
                </div>
              </div>
            ) : (
              <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                {userProjects.map((project) => (
                  <li key={project.id}>
                    <div className="px-4 py-4 flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700">
                      <div className="flex items-center">
                        <Building2 className="h-8 w-8 text-primary" />
                        <div className="ml-4">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                            {project.name}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(project.updated_at!).toLocaleDateString('ja-JP')}
                            {project.last_edited_platform && (
                              <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-gray-600 text-gray-800 dark:text-gray-200">
                                {project.last_edited_platform}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => router.push(`/scaffold?project=${project.id}`)}
                          className="text-primary hover:text-primary/80 text-sm font-medium"
                        >
                          編集
                        </button>
                        {project.calculation_result && (
                          <button
                            onClick={() => router.push(`/result?project=${project.id}`)}
                            className="text-secondary hover:text-secondary/80 text-sm font-medium"
                          >
                            結果表示
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
