import { useState } from 'react';
import { Search, Filter, FileText, Trash2, Eye, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';

const AdminProjects = () => {
  const [projects] = useState([
    { id: 1, name: '東京タワープロジェクト', client: '東京建設株式会社', status: '完了', createdAt: '2025-01-15', updatedAt: '2025-02-20' },
    { id: 2, name: '大阪駅改修工事', client: '大阪鉄道工業', status: '進行中', createdAt: '2025-02-05', updatedAt: '2025-05-10' },
    { id: 3, name: '名古屋ビル建設', client: '中部建設', status: '計画中', createdAt: '2025-03-12', updatedAt: '2025-03-12' },
    { id: 4, name: '福岡タワー足場工事', client: '九州工業', status: '完了', createdAt: '2025-02-28', updatedAt: '2025-04-15' },
    { id: 5, name: '札幌ドーム改修', client: '北海道建設', status: '進行中', createdAt: '2025-04-01', updatedAt: '2025-05-18' },
    { id: 6, name: '横浜マンション工事', client: '関東住宅', status: '完了', createdAt: '2025-01-20', updatedAt: '2025-03-25' },
    { id: 7, name: '神戸港湾施設補強', client: '兵庫県建設局', status: '計画中', createdAt: '2025-05-05', updatedAt: '2025-05-05' },
    { id: 8, name: '仙台駅前ビル工事', client: '東北開発', status: '進行中', createdAt: '2025-03-30', updatedAt: '2025-05-12' },
    { id: 9, name: '広島スタジアム改修', client: '中国地方建設', status: '完了', createdAt: '2025-02-10', updatedAt: '2025-04-20' },
    { id: 10, name: '沖縄リゾートホテル工事', client: '沖縄観光開発', status: '計画中', createdAt: '2025-04-25', updatedAt: '2025-04-25' },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  
  const filteredProjects = projects.filter(
    (project) =>
      (project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.client.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'all' || project.status === statusFilter)
  );
  
  const itemsPerPage = 7;
  const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProjects = filteredProjects.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          プロジェクト管理
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          システム内のプロジェクト一覧と管理
        </p>
      </header>

      <div className="bg-white dark:bg-dark-300 rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="p-5 border-b border-slate-200 dark:border-dark-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="flex-1 flex gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 input-field"
                placeholder="プロジェクトを検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="w-48">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Filter className="h-5 w-5 text-slate-400" />
                </div>
                <select
                  className="block w-full pl-10 input-field appearance-none pr-8"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">すべてのステータス</option>
                  <option value="完了">完了</option>
                  <option value="進行中">進行中</option>
                  <option value="計画中">計画中</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <ChevronLeft className="h-5 w-5 text-slate-400 transform rotate-90" />
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="btn-outline py-2 px-3 text-sm">
              エクスポート
            </button>
            <button className="btn-primary py-2 px-3 text-sm flex items-center">
              <FileText size={16} className="mr-1" />
              <span>レポート作成</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-dark-100">
                <th className="p-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>プロジェクト名</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="p-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>クライアント</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="p-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>ステータス</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="p-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>作成日</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="p-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>更新日</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="p-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  アクション
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedProjects.map((project) => (
                <tr
                  key={project.id}
                  className="border-b last:border-b-0 border-slate-200 dark:border-dark-100 hover:bg-slate-50 dark:hover:bg-dark-200"
                >
                  <td className="p-4 text-sm font-medium text-slate-900 dark:text-white">
                    {project.name}
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                    {project.client}
                  </td>
                  <td className="p-4">
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
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                    {project.createdAt}
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                    {project.updatedAt}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400">
                        <Eye size={16} />
                      </button>
                      <button className="p-1 text-slate-600 dark:text-slate-400 hover:text-error-600 dark:hover:text-error-400">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {paginatedProjects.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                    該当するプロジェクトが見つかりませんでした
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 flex items-center justify-between border-t border-slate-200 dark:border-dark-100">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            全{filteredProjects.length}件中 {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredProjects.length)}件を表示
          </div>
          
          <div className="flex gap-2">
            <button
              className="p-2 rounded border border-slate-300 dark:border-dark-100 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(currentPage - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            
            <button
              className="p-2 rounded border border-slate-300 dark:border-dark-100 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-dark-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProjects;