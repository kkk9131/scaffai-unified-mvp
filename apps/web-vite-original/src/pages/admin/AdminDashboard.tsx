import { Link } from 'react-router-dom';
import { Users, FileText, Settings, BarChart, Activity, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          管理者ダッシュボード
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          システム全体の統計と管理機能
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-dark-300 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">ユーザー総数</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">842</h3>
            </div>
            <div className="bg-primary-100 dark:bg-primary-900/30 p-2 rounded-lg">
              <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
            </div>
          </div>
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 text-success-600 dark:text-success-400 mr-1" />
            <p className="text-xs text-success-600 dark:text-success-400">
              <span className="font-medium">+12.5%</span> 先月比
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-300 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">プロジェクト数</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">1,293</h3>
            </div>
            <div className="bg-secondary-100 dark:bg-secondary-900/30 p-2 rounded-lg">
              <FileText className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
            </div>
          </div>
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 text-success-600 dark:text-success-400 mr-1" />
            <p className="text-xs text-success-600 dark:text-success-400">
              <span className="font-medium">+8.2%</span> 先月比
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-300 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">計算実行数</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">5,621</h3>
            </div>
            <div className="bg-accent-100 dark:bg-accent-900/30 p-2 rounded-lg">
              <BarChart className="h-6 w-6 text-accent-600 dark:text-accent-400" />
            </div>
          </div>
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 text-success-600 dark:text-success-400 mr-1" />
            <p className="text-xs text-success-600 dark:text-success-400">
              <span className="font-medium">+15.3%</span> 先月比
            </p>
          </div>
        </div>

        <div className="bg-white dark:bg-dark-300 rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">アクティブユーザー</p>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white">428</h3>
            </div>
            <div className="bg-success-100 dark:bg-success-900/30 p-2 rounded-lg">
              <Activity className="h-6 w-6 text-success-600 dark:text-success-400" />
            </div>
          </div>
          <div className="flex items-center">
            <TrendingUp className="h-4 w-4 text-success-600 dark:text-success-400 mr-1" />
            <p className="text-xs text-success-600 dark:text-success-400">
              <span className="font-medium">+5.1%</span> 先月比
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-dark-300 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-dark-100 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                ユーザーアクティビティ
              </h2>
              <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
                詳細を見る
              </button>
            </div>
            
            <div className="p-5 h-64 flex items-center justify-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm">
                グラフ表示エリア（実際の実装ではChart.jsなどを使用）
              </p>
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white dark:bg-dark-300 rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-200 dark:border-dark-100">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                システム状態
              </h2>
            </div>
            
            <div className="p-5">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-600 dark:text-slate-400">CPU使用率</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">28%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-dark-100 rounded-full h-2">
                    <div className="bg-primary-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-600 dark:text-slate-400">メモリ使用率</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">64%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-dark-100 rounded-full h-2">
                    <div className="bg-secondary-500 h-2 rounded-full" style={{ width: '64%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-600 dark:text-slate-400">ストレージ</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">42%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-dark-100 rounded-full h-2">
                    <div className="bg-accent-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-slate-600 dark:text-slate-400">帯域幅使用率</span>
                    <span className="text-sm font-medium text-slate-900 dark:text-white">15%</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-dark-100 rounded-full h-2">
                    <div className="bg-success-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-dark-300 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-dark-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              最近のユーザー
            </h2>
            <Link
              to="/admin/users"
              className="text-sm text-primary-600 dark:text-primary-400 hover:underline"
            >
              すべて表示
            </Link>
          </div>
          
          <div className="p-5">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mr-3">
                      <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900 dark:text-white">
                        ユーザー{i}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        user{i}@example.com
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {i}日前
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-dark-300 rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 dark:border-dark-100 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
              システム設定
            </h2>
            <button className="text-sm text-primary-600 dark:text-primary-400 hover:underline">
              すべて表示
            </button>
          </div>
          
          <div className="p-5">
            <div className="space-y-6">
              <div>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    メンテナンスモード
                  </span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" />
                    <div className="block bg-slate-300 dark:bg-dark-100 w-12 h-6 rounded-full"></div>
                    <div className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                  </div>
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  有効にするとユーザーはログインできなくなります
                </p>
              </div>
              
              <div>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    デバッグモード
                  </span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked />
                    <div className="block bg-primary-500 w-12 h-6 rounded-full"></div>
                    <div className="dot absolute left-7 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                  </div>
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  詳細なログを記録します
                </p>
              </div>
              
              <div>
                <label className="flex items-center justify-between cursor-pointer">
                  <span className="text-sm font-medium text-slate-900 dark:text-white">
                    メール通知
                  </span>
                  <div className="relative">
                    <input type="checkbox" className="sr-only" checked />
                    <div className="block bg-primary-500 w-12 h-6 rounded-full"></div>
                    <div className="dot absolute left-7 top-1 bg-white w-4 h-4 rounded-full transition"></div>
                  </div>
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  システムイベントのメール通知を送信します
                </p>
              </div>
              
              <div className="pt-2">
                <button className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors flex items-center justify-center">
                  <Settings size={16} className="mr-2" />
                  <span>詳細設定</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;