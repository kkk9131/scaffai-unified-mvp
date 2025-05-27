/**
 * 🎨 InputField - 美しい入力フィールドコンポーネント (Web版)
 * モバイル版のデザインを完全移植
 */

import React from 'react';

export interface InputFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'number' | 'email';
  error?: string | null;
  suffix?: string;
  disabled?: boolean;
  multiline?: boolean;
  rows?: number;
  maxLength?: number;
  className?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  error,
  suffix,
  disabled = false,
  multiline = false,
  rows = 1,
  maxLength,
  className = '',
}) => {
  const baseClasses = `
    w-full px-3 py-3 text-base
    bg-white dark:bg-gray-800
    border border-gray-300 dark:border-gray-600
    rounded-lg
    text-gray-900 dark:text-white
    placeholder-gray-500 dark:placeholder-gray-400
    focus:ring-2 focus:ring-blue-500 focus:border-transparent
    transition-all duration-200
    ${error ? 'border-red-500 focus:ring-red-500' : ''}
    ${disabled ? 'bg-gray-100 dark:bg-gray-700 text-gray-500 cursor-not-allowed' : ''}
  `;

  const InputElement = multiline ? 'textarea' : 'input';

  return (
    <div className={`mb-4 ${className}`}>
      {/* ラベル */}
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
      
      {/* 入力フィールドコンテナ */}
      <div className="relative">
        <InputElement
          {...(multiline ? { rows } : { type })}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          maxLength={maxLength}
          className={baseClasses}
        />
        
        {/* サフィックス */}
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {suffix}
            </span>
          </div>
        )}
      </div>
      
      {/* エラーメッセージ */}
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
};
