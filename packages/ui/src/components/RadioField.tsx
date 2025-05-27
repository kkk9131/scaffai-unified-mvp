/**
 * 📻 RadioField - 洗練されたラジオボタンコンポーネント (Web版)
 * モバイル版のデザインを完全移植
 */

import React from 'react';

export interface RadioOption {
  label: string;
  value: string;
  description?: string;
}

export interface RadioFieldProps {
  label: string;
  options: RadioOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export const RadioField: React.FC<RadioFieldProps> = ({
  label,
  options,
  selectedValue,
  onChange,
  disabled = false,
  className = '',
}) => {
  return (
    <div className={`mb-4 ${className}`}>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
        {label}
      </label>
      
      <div className="space-y-2">
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              relative flex items-center p-3 rounded-lg border cursor-pointer
              transition-all duration-200
              ${selectedValue === option.value
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
              }
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <input
              type="radio"
              name={label}
              value={option.value}
              checked={selectedValue === option.value}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
              className="sr-only"
            />
            
            {/* カスタムラジオボタン */}
            <div className={`
              w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center
              transition-all duration-200
              ${selectedValue === option.value
                ? 'border-blue-500 bg-blue-500'
                : 'border-gray-400 dark:border-gray-500'
              }
            `}>
              {selectedValue === option.value && (
                <div className="w-2 h-2 rounded-full bg-white" />
              )}
            </div>
            
            {/* ラベルと説明 */}
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                {option.label}
              </div>
              {option.description && (
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {option.description}
                </div>
              )}
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};
