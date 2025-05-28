/**
 * 🎨 ScaffAI Authentication Components
 * 美しい認証UI - 工事現場テーマ
 */

'use client';

import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Building2, Loader2 } from 'lucide-react';

// 🎯 基本Inputコンポーネント
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

export const AuthInput: React.FC<InputProps> = ({ 
  label, 
  icon, 
  error, 
  className = '', 
  ...props 
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-gray-400 w-5 h-5">
              {icon}
            </div>
          </div>
        )}
        <input
          className={`
            w-full px-4 py-3 ${icon ? 'pl-10' : ''} 
            border border-gray-300 dark:border-gray-600
            rounded-lg shadow-sm
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
            focus:ring-2 focus:ring-primary/20 focus:border-primary
            transition-all duration-200
            ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
            ${className}
          `}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <span className="w-4 h-4">⚠️</span>
          {error}
        </p>
      )}
    </div>
  );
};

// 🔐 パスワード入力コンポーネント
export const PasswordInput: React.FC<Omit<InputProps, 'type'>> = ({ 
  label = "パスワード", 
  ...props 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className="text-gray-400 w-5 h-5" />
        </div>
        <input
          type={showPassword ? 'text' : 'password'}
          className={`
            w-full px-4 py-3 pl-10 pr-10
            border border-gray-300 dark:border-gray-600
            rounded-lg shadow-sm
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-gray-100
            placeholder-gray-500 dark:placeholder-gray-400
            focus:ring-2 focus:ring-primary/20 focus:border-primary
            transition-all duration-200
            ${props.error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}
          `}
          {...props}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={() => setShowPassword(!showPassword)}
        >
          {showPassword ? (
            <EyeOff className="text-gray-400 hover:text-gray-600 w-5 h-5" />
          ) : (
            <Eye className="text-gray-400 hover:text-gray-600 w-5 h-5" />
          )}
        </button>
      </div>
      {props.error && (
        <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
          <span className="w-4 h-4">⚠️</span>
          {props.error}
        </p>
      )}
    </div>
  );
};

// 🔲 認証ボタンコンポーネント
interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
  children: React.ReactNode;
}

export const AuthButton: React.FC<AuthButtonProps> = ({ 
  loading = false,
  variant = 'primary',
  children,
  className = '',
  disabled,
  ...props 
}) => {
  const baseClasses = `
    w-full px-6 py-3 rounded-lg font-medium
    transition-all duration-200
    flex items-center justify-center gap-2
    focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:cursor-not-allowed disabled:opacity-50
  `;

  const variants = {
    primary: `
      bg-primary hover:bg-primary/90 
      text-white
      focus:ring-primary/50
      shadow-md hover:shadow-lg
    `,
    secondary: `
      bg-secondary hover:bg-secondary/90
      text-white
      focus:ring-secondary/50
      shadow-md hover:shadow-lg
    `,
    outline: `
      border-2 border-gray-300 dark:border-gray-600
      bg-transparent hover:bg-gray-50 dark:hover:bg-gray-800
      text-gray-700 dark:text-gray-300
      focus:ring-gray-500/50
    `,
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-5 h-5 animate-spin" />}
      {children}
    </button>
  );
};

// 📱 認証カードコンテナ
interface AuthCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* 🏗️ ヘッダー */}
        <div className="text-center">
          <div className="mx-auto w-16 h-16 bg-primary rounded-xl flex items-center justify-center mb-4">
            <Building2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          )}
        </div>

        {/* 📝 カードコンテンツ */}
        <div className="bg-white dark:bg-gray-800 py-8 px-6 shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">
          {children}
        </div>

        {/* 🔗 フッター */}
        <div className="text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            🏗️ <strong>ScaffAI</strong> - プロフェッショナル足場設計プラットフォーム
          </p>
        </div>
      </div>
    </div>
  );
};

// 🚨 エラーアラート
interface ErrorAlertProps {
  message: string;
  onDismiss?: () => void;
}

export const ErrorAlert: React.FC<ErrorAlertProps> = ({ message, onDismiss }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="text-red-400 text-xl">⚠️</span>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-800 dark:text-red-200">
            {message}
          </p>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              className="text-red-400 hover:text-red-600"
              onClick={onDismiss}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// ✅ 成功アラート
interface SuccessAlertProps {
  message: string;
  onDismiss?: () => void;
}

export const SuccessAlert: React.FC<SuccessAlertProps> = ({ message, onDismiss }) => {
  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <span className="text-green-400 text-xl">✅</span>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-green-800 dark:text-green-200">
            {message}
          </p>
        </div>
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              className="text-green-400 hover:text-green-600"
              onClick={onDismiss}
            >
              ✕
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
