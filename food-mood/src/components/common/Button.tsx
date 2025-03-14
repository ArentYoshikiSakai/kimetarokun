'use client';

import React, { ButtonHTMLAttributes } from 'react';

// ボタンの種類（バリエーション）
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'text';

// ボタンのサイズ
export type ButtonSize = 'sm' | 'md' | 'lg';

// Buttonコンポーネントのプロパティ定義
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}

/**
 * 共通のButtonコンポーネント
 * 様々なバリエーションとサイズを持つボタンです
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  icon,
  className = '',
  children,
  disabled,
  ...props
}) => {
  // バリエーションに応じたスタイルのマッピング
  const variantStyles = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 active:bg-blue-800 border border-transparent',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300 active:bg-gray-400 border border-transparent',
    outline: 'bg-transparent border border-gray-300 text-gray-800 hover:bg-gray-100 active:bg-gray-200',
    text: 'bg-transparent text-blue-600 hover:bg-gray-100 active:bg-gray-200 border border-transparent',
  };

  // サイズに応じたスタイルのマッピング
  const sizeStyles = {
    sm: 'text-xs py-1 px-2',
    md: 'text-sm py-2 px-4',
    lg: 'text-base py-3 px-6',
  };

  // 無効状態のスタイル
  const disabledStyle = 'opacity-50 cursor-not-allowed';

  // フルワイドスタイル
  const widthStyle = fullWidth ? 'w-full' : '';

  return (
    <button
      className={`
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled || isLoading ? disabledStyle : ''}
        ${widthStyle}
        rounded-md font-medium transition-colors duration-200 flex items-center justify-center
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      
      {icon && !isLoading && <span className="mr-2">{icon}</span>}
      
      {children}
    </button>
  );
}; 