import { useState } from 'react';
import { Search, Plus, Edit, Trash2, ChevronLeft, ChevronRight, ArrowUpDown } from 'lucide-react';

const AdminUsers = () => {
  const [users] = useState([
    { id: 1, name: '山田太郎', email: 'yamada@example.com', role: '管理者', status: 'アクティブ', createdAt: '2025-01-15' },
    { id: 2, name: '佐藤花子', email: 'sato@example.com', role: 'ユーザー', status: 'アクティブ', createdAt: '2025-02-20' },
    { id: 3, name: '鈴木一郎', email: 'suzuki@example.com', role: 'ユーザー', status: 'アクティブ', createdAt: '2025-03-05' },
    { id: 4, name: '高橋二郎', email: 'takahashi@example.com', role: 'ユーザー', status: '停止中', createdAt: '2025-03-12' },
    { id: 5, name: '田中三郎', email: 'tanaka@example.com', role: 'ユーザー', status: 'アクティブ', createdAt: '2025-03-18' },
    { id: 6, name: '伊藤四郎', email: 'ito@example.com', role: '管理者', status: 'アクティブ', createdAt: '2025-04-01' },
    { id: 7, name: '渡辺五郎', email: 'watanabe@example.com', role: 'ユーザー', status: 'アクティブ', createdAt: '2025-04-10' },
    { id: 8, name: '山本六郎', email: 'yamamoto@example.com', role: 'ユーザー', status: '未確認', createdAt: '2025-04-15' },
    { id: 9, name: '中村七郎', email: 'nakamura@example.com', role: 'ユーザー', status: 'アクティブ', createdAt: '2025-04-28' },
    { id: 10, name: '小林八郎', email: 'kobayashi@example.com', role: 'ユーザー', status: 'アクティブ', createdAt: '2025-05-02' },
  ]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const itemsPerPage = 7;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  
  const handleSelectAll = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map((user) => user.id));
    }
  };
  
  const handleSelectUser = (userId: number) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          ユーザー管理
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          システムユーザーの管理と権限設定
        </p>
      </header>

      <div className="bg-white dark:bg-dark-300 rounded-xl shadow-sm overflow-hidden mb-6">
        <div className="p-5 border-b border-slate-200 dark:border-dark-100 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 input-field"
              placeholder="ユーザーを検索..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex gap-2">
            <button className="btn-outline py-2 px-3 text-sm">
              エクスポート
            </button>
            <button className="btn-primary py-2 px-3 text-sm flex items-center">
              <Plus size={16} className="mr-1" />
              <span>ユーザー追加</span>
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-dark-100">
                <th className="p-4 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="rounded border-slate-300 dark:border-dark-100 text-primary-600 focus:ring-primary-500 h-4 w-4"
                      checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                      onChange={handleSelectAll}
                    />
                  </div>
                </th>
                <th className="p-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>名前</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="p-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>メールアドレス</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="p-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>役割</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="p-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>状態</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="p-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  <div className="flex items-center gap-1 cursor-pointer">
                    <span>作成日</span>
                    <ArrowUpDown size={14} />
                  </div>
                </th>
                <th className="p-4 text-right text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  アクション
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b last:border-b-0 border-slate-200 dark:border-dark-100 hover:bg-slate-50 dark:hover:bg-dark-200"
                >
                  <td className="p-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-slate-300 dark:border-dark-100 text-primary-600 focus:ring-primary-500 h-4 w-4"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleSelectUser(user.id)}
                      />
                    </div>
                  </td>
                  <td className="p-4 text-sm text-slate-900 dark:text-white">
                    {user.name}
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                    {user.email}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === '管理者'
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.status === 'アクティブ'
                          ? 'bg-success-100 dark:bg-success-900/30 text-success-800 dark:text-success-300'
                          : user.status === '停止中'
                          ? 'bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-300'
                          : 'bg-warning-100 dark:bg-warning-900/30 text-warning-800 dark:text-warning-300'
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-slate-600 dark:text-slate-400">
                    {user.createdAt}
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1 text-slate-600 dark:text-slate-400 hover:text-primary-600 dark:hover:text-primary-400">
                        <Edit size={16} />
                      </button>
                      <button className="p-1 text-slate-600 dark:text-slate-400 hover:text-error-600 dark:hover:text-error-400">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              
              {paginatedUsers.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-sm text-slate-500 dark:text-slate-400">
                    該当するユーザーが見つかりませんでした
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 flex items-center justify-between border-t border-slate-200 dark:border-dark-100">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            全{filteredUsers.length}件中 {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredUsers.length)}件を表示
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

export default AdminUsers;