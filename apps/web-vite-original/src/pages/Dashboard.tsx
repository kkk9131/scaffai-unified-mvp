import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Calculator, FileText, Layers, Clock, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentProjects] = useState([
    { id: 1, name: '東京タワープロジェクト', date: '2025-05-15', status: '完了' },
    { id: 2, name: '大阪駅改修工事', date: '2025-05-12', status: '進行中' },
    { id: 3, name: '名古屋ビル建設', date: '2025-05-08', status: '計画中' },
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 md:px-6">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          こんにちは、{user?.name}さん
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          ScaffAIダッシュボードへようこそ
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <motion.div
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="bg-white dark:bg-dark-300 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="bg-primary-100 dark:bg-primary-900/30 p-3 rounded-lg inline-block mb-4">
            <Calculator className="h-6 w-6 text-primary-600 dark:text-primary-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">計算ツール</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">足場の寸法を入力して計算</p>
          <Link
            to="/input"
            className="text-primary-600 dark:text-primary-400 font-medium text-sm hover:underline"
          >
            入力を開始 →
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="bg-white dark:bg-dark-300 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="bg-secondary-100 dark:bg-secondary-900/30 p-3 rounded-lg inline-block mb-4">
            <FileText className="h-6 w-6 text-secondary-600 dark:text-secondary-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">計算結果</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">最新の計算結果を表示</p>
          <Link
            to="/results"
            className="text-secondary-600 dark:text-secondary-400 font-medium text-sm hover:underline"
          >
            結果を確認 →
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="bg-white dark:bg-dark-300 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="bg-accent-100 dark:bg-accent-900/30 p-3 rounded-lg inline-block mb-4">
            <Layers className="h-6 w-6 text-accent-600 dark:text-accent-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">描画ツール</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">2D/3D自動描画インターフェース</p>
          <Link
            to="/drawing"
            className="text-accent-600 dark:text-accent-400 font-medium text-sm hover:underline"
          >
            描画を開始 →
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ y: -5 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="bg-white dark:bg-dark-300 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="bg-success-100 dark:bg-success-900/30 p-3 rounded-lg inline-block mb-4">
            <Clock className="h-6 w-6 text-success-600 dark:text-success-400" />
          </div>
          <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-1">最近のプロジェクト</h3>
          <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm">最近のプロジェクト履歴</p>
          <Link
            to="/projects"
            className="text-success-600 dark:text-success-400 font-medium text-sm hover:underline"
          >
            すべて表示 →
          </Link>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white dark:bg-dark-300 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">最近のプロジェクト</h2>
              <Link
                to="/projects"
                className="text-primary-600 dark:text-primary-400 text-sm hover:underline"
              >
                すべて表示
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-dark-100">
                    <th className="py-3 px-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      プロジェクト名
                    </th>
                    <th className="py-3 px-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      日付
                    </th>
                    <th className="py-3 px-2 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      状態
                    </th>
                    <th className="py-3 px-2 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      アクション
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentProjects.map((project) => (
                    <tr
                      key={project.id}
                      className="border-b last:border-b-0 border-slate-200 dark:border-dark-100"
                    >
                      <td className="py-3 px-2 text-sm text-slate-900 dark:text-white">
                        {project.name}
                      </td>
                      <td className="py-3 px-2 text-sm text-slate-600 dark:text-slate-400">
                        {project.date}
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            project.status === '完了'
                              ? 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300'
                              : project.status === '進行中'
                              ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300'
                          }`}
                        >
                          {project.status}
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Link
                          to={`/projects/${project.id}`}
                          className="text-primary-600 dark:text-primary-400 text-sm hover:underline"
                        >
                          表示
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white dark:bg-dark-300 rounded-xl p-5 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">通知</h2>
              <button className="text-primary-600 dark:text-primary-400 text-sm hover:underline">
                すべて既読
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="bg-warning-100 dark:bg-warning-900/30 p-2 rounded-lg h-min">
                  <AlertTriangle className="h-5 w-5 text-warning-600 dark:text-warning-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-900 dark:text-white">システムアップデート</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    新しいバージョンが利用可能です。今すぐ更新してください。
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">2時間前</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="bg-success-100 dark:bg-success-900/30 p-2 rounded-lg h-min">
                  <FileText className="h-5 w-5 text-success-600 dark:text-success-400" />
                </div>
                <div>
                  <p className="text-sm text-slate-900 dark:text-white">計算結果の保存</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    計算結果が正常に保存されました。
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">昨日</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white dark:bg-dark-300 rounded-xl p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3">クイックアクセス</h2>
            <div className="space-y-2">
              <Link
                to="/input"
                className="block p-3 bg-slate-50 dark:bg-dark-200 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Calculator className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                  <span className="text-sm text-slate-900 dark:text-white">新規計算を開始</span>
                </div>
              </Link>
              
              <Link
                to="/results"
                className="block p-3 bg-slate-50 dark:bg-dark-200 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5 text-secondary-600 dark:text-secondary-400" />
                  <span className="text-sm text-slate-900 dark:text-white">保存された計算</span>
                </div>
              </Link>
              
              <Link
                to="/drawing"
                className="block p-3 bg-slate-50 dark:bg-dark-200 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-100 transition-colors"
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
    </div>
  );
};

export default Dashboard;