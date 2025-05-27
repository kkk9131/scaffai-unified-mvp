/**
 * 🎨 Section - セクション分割コンポーネント (Web版)
 * モバイル版の美しいセクションレイアウトを移植
 */

import React from 'react';

export interface SectionProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'card' | 'highlight';
}

export const Section: React.FC<SectionProps> = ({
  title,
  children,
  className = '',
  variant = 'card',
}) => {
  const variantClasses = {
    default: 'bg-transparent',
    card: 'bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700',
    highlight: 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-700',
  };

  return (
    <div className={`mb-6 p-6 ${variantClasses[variant]} ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {title}
        </h3>
      )}
      {children}
    </div>
  );
};
