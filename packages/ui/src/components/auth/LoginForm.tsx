/**
 * 🔐 ScaffAI Login Form
 * 美しいログインフォーム
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, ArrowRight, UserPlus } from 'lucide-react';
import { 
  AuthCard, 
  AuthInput, 
  PasswordInput, 
  AuthButton, 
  ErrorAlert, 
  SuccessAlert 
} from './AuthComponents';
import { auth } from '@scaffai/config';

interface LoginFormProps {
  onToggleMode?: () => void;
  redirectTo?: string;
}

export const LoginForm: React.FC<LoginFormProps> = ({ 
  onToggleMode, 
  redirectTo = '/dashboard' 
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  // 🔧 入力値更新
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // エラークリア
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // ✅ バリデーション
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    if (!formData.password) {
      newErrors.password = 'パスワードを入力してください';
    } else if (formData.password.length < 6) {
      newErrors.password = 'パスワードは6文字以上で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🚀 ログイン実行
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setMessage(null);

    try {
      const { data, error } = await auth.signInWithEmail(formData.email, formData.password);
      
      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        setMessage({ 
          type: 'success', 
          text: 'ログイン成功！ダッシュボードに移動します...' 
        });
        
        // 成功後リダイレクト
        setTimeout(() => {
          router.push(redirectTo);
        }, 1000);
      }

    } catch (error: any) {
      console.error('❌ Login error:', error);
      
      // エラーメッセージのローカライズ
      let errorMessage = 'ログインに失敗しました';
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = 'メールアドレスまたはパスワードが間違っています';
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = 'メールアドレスが確認されていません。メールをご確認ください';
      } else if (error.message.includes('Too many requests')) {
        errorMessage = 'しばらく時間をおいてから再度お試しください';
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard 
      title="ログイン" 
      subtitle="ScaffAIアカウントでログイン"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 📧 メッセージ表示 */}
        {message && (
          <div className="mb-4">
            {message.type === 'error' ? (
              <ErrorAlert 
                message={message.text} 
                onDismiss={() => setMessage(null)} 
              />
            ) : (
              <SuccessAlert 
                message={message.text} 
                onDismiss={() => setMessage(null)} 
              />
            )}
          </div>
        )}

        {/* 📧 メールアドレス */}
        <AuthInput
          label="メールアドレス"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="your@email.com"
          icon={<Mail />}
          error={errors.email}
          required
        />

        {/* 🔐 パスワード */}
        <PasswordInput
          label="パスワード"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="パスワードを入力"
          error={errors.password}
          required
        />

        {/* 🔗 パスワード忘れた */}
        <div className="flex items-center justify-between">
          <div className="text-sm">
            <a 
              href="/auth/forgot-password" 
              className="text-primary hover:text-primary/80 transition-colors"
            >
              パスワードをお忘れですか？
            </a>
          </div>
        </div>

        {/* 🚀 ログインボタン */}
        <AuthButton 
          type="submit" 
          loading={loading}
          variant="primary"
        >
          {loading ? 'ログイン中...' : (
            <>
              ログイン
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </AuthButton>

        {/* 📝 サインアップリンク */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            アカウントをお持ちでない方は{' '}
            {onToggleMode ? (
              <button
                type="button"
                onClick={onToggleMode}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                新規登録
              </button>
            ) : (
              <a 
                href="/auth/signup" 
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                新規登録
              </a>
            )}
          </p>
        </div>

        {/* 🎯 テストアカウント（開発用） */}
        {process.env.NODE_ENV === 'development' && (
          <div className="border-t pt-4 mt-6">
            <p className="text-xs text-gray-500 text-center mb-2">
              🧪 開発用テストアカウント
            </p>
            <AuthButton
              type="button"
              variant="outline"
              onClick={() => {
                setFormData({
                  email: 'test@scaffai.com',
                  password: 'scaffai123'
                });
              }}
            >
              <UserPlus className="w-4 h-4" />
              テストアカウントで入力
            </AuthButton>
          </div>
        )}
      </form>
    </AuthCard>
  );
};

export default LoginForm;
