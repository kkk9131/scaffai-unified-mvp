import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion } from 'framer-motion';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      // Error handling is already in the AuthContext
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">ログイン</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">アカウントにアクセスする</p>
      </div>

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-error-100 dark:bg-error-900/30 text-error-800 dark:text-error-200 p-3 rounded-md mb-4 text-sm"
        >
          {error}
        </motion.div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
            メールアドレス
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
            disabled={loading}
          />
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              パスワード
            </label>
            <Link to="/forgot-password" className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
              パスワードをお忘れですか？
            </Link>
          </div>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field"
            required
            disabled={loading}
          />
        </div>
        
        <div className="mb-4">
          <button
            type="submit"
            className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors disabled:opacity-70"
            disabled={loading}
          >
            {loading ? 'ログイン中...' : 'ログイン'}
          </button>
        </div>
        
        <p className="text-center text-sm text-slate-600 dark:text-slate-400">
          アカウントをお持ちでないですか？{' '}
          <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:underline">
            新規登録
          </Link>
        </p>
      </form>
      
      <div className="mt-6 pt-4 border-t border-slate-200 dark:border-dark-100">
        <p className="text-center text-xs text-slate-500 dark:text-slate-400 mb-2">
          以下のユーザーでもログインできます
        </p>
        <div className="space-y-2 text-xs">
          <div className="p-2 bg-slate-100 dark:bg-dark-200 rounded flex justify-between">
            <span>管理者:</span>
            <span className="font-mono">admin@scaffai.com / password</span>
          </div>
          <div className="p-2 bg-slate-100 dark:bg-dark-200 rounded flex justify-between">
            <span>ユーザー:</span>
            <span className="font-mono">user@scaffai.com / password</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;