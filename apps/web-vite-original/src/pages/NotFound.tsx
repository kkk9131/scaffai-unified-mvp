import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-dark-600 flex flex-col items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-primary-600 dark:text-primary-400 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-2">ページが見つかりません</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">
          お探しのページは存在しないか、移動された可能性があります。
        </p>
        
        <Link
          to="/"
          className="inline-flex items-center py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
        >
          <Home size={18} className="mr-2" />
          ホームに戻る
        </Link>
      </div>
    </div>
  );
};

export default NotFound;