/**
 * 📝 ScaffAI Signup Form
 * 美しいサインアップフォーム
 */

'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, User, Building2, ArrowRight, LogIn } from 'lucide-react';
import { 
  AuthCard, 
  AuthInput, 
  PasswordInput, 
  AuthButton, 
  ErrorAlert, 
  SuccessAlert 
} from './AuthComponents';
import { auth, profiles } from '@scaffai/config';

interface SignupFormProps {
  onToggleMode?: () => void;
  redirectTo?: string;
}

export const SignupForm: React.FC<SignupFormProps> = ({ 
  onToggleMode, 
  redirectTo = '/dashboard' 
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    company: '',
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

    // メールアドレス
    if (!formData.email) {
      newErrors.email = 'メールアドレスを入力してください';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '有効なメールアドレスを入力してください';
    }

    // パスワード
    if (!formData.password) {
      newErrors.password = 'パスワードを入力してください';
    } else if (formData.password.length < 6) {
      newErrors.password = 'パスワードは6文字以上で入力してください';
    } else if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(formData.password)) {
      newErrors.password = 'パスワードは英数字を含む必要があります';
    }

    // パスワード確認
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワード確認を入力してください';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'パスワードが一致しません';
    }

    // 名前
    if (!formData.name) {
      newErrors.name = 'お名前を入力してください';
    } else if (formData.name.length < 2) {
      newErrors.name = 'お名前は2文字以上で入力してください';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🚀 サインアップ実行
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setMessage(null);

    try {
      // 1️⃣ Supabase Auth でユーザー作成
      const { data, error } = await auth.signUpWithEmail(formData.email, formData.password);
      
      if (error) {
        throw new Error(error.message);
      }

      if (data.user) {
        // 2️⃣ プロファイル作成
        await profiles.upsert({
          name: formData.name,
          company: formData.company,
          web_preferences: {
            theme: 'system',
            language: 'ja'
          },
          mobile_preferences: {
            notifications: true,
            haptics: true
          }
        });

        setMessage({ 
          type: 'success', 
          text: 'アカウント作成完了！メールをご確認ください。' 
        });

        // 成功後リダイレクト（確認待ちページへ）
        setTimeout(() => {
          router.push('/auth/verify-email');
        }, 2000);
      }

    } catch (error: any) {
      console.error('❌ Signup error:', error);
      
      // エラーメッセージのローカライズ
      let errorMessage = 'アカウント作成に失敗しました';
      if (error.message.includes('User already registered')) {
        errorMessage = 'このメールアドレスは既に登録されています';
      } else if (error.message.includes('Password should be at least 6 characters')) {
        errorMessage = 'パスワードは6文字以上で入力してください';
      } else if (error.message.includes('Invalid email')) {
        errorMessage = '有効なメールアドレスを入力してください';
      } else if (error.message.includes('Signup is disabled')) {
        errorMessage = '現在新規登録を停止しています';
      }
      
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthCard 
      title="新規登録" 
      subtitle="ScaffAIアカウントを作成"
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

        {/* 👤 お名前 */}
        <AuthInput
          label="お名前"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="山田 太郎"
          icon={<User />}
          error={errors.name}
          required
        />

        {/* 🏢 会社名（オプション） */}
        <AuthInput
          label="会社名（任意）"
          name="company"
          type="text"
          value={formData.company}
          onChange={handleChange}
          placeholder="株式会社○○建設"
          icon={<Building2 />}
          error={errors.company}
        />

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
          placeholder="6文字以上の英数字"
          error={errors.password}
          required
        />

        {/* 🔐 パスワード確認 */}
        <PasswordInput
          label="パスワード確認"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="パスワードを再入力"
          error={errors.confirmPassword}
          required
        />

        {/* 📝 利用規約 */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              name="terms"
              type="checkbox"
              className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
              required
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="text-gray-600 dark:text-gray-400">
              <a href="/terms" className="text-primary hover:text-primary/80">利用規約</a>
              {' '}および{' '}
              <a href="/privacy" className="text-primary hover:text-primary/80">プライバシーポリシー</a>
              に同意します
            </label>
          </div>
        </div>

        {/* 🚀 サインアップボタン */}
        <AuthButton 
          type="submit" 
          loading={loading}
          variant="primary"
        >
          {loading ? 'アカウント作成中...' : (
            <>
              アカウント作成
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </AuthButton>

        {/* 🔗 ログインリンク */}
        <div className="text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            既にアカウントをお持ちの方は{' '}
            {onToggleMode ? (
              <button
                type="button"
                onClick={onToggleMode}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                ログイン
              </button>
            ) : (
              <a 
                href="/auth/login" 
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                ログイン
              </a>
            )}
          </p>
        </div>
      </form>
    </AuthCard>
  );
};

export default SignupForm;
