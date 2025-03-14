'use client';

import React from 'react';

// Cardコンポーネントのプロパティ定義
export interface CardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  bordered?: boolean;
}

/**
 * 共通のCardコンポーネント
 * コンテンツをグループ化して表示するためのカードUIです
 */
export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  footer,
  children,
  className = '',
  onClick,
  hoverable = false,
  bordered = true,
}) => {
  const cardClasses = `
    bg-white 
    rounded-lg 
    shadow-sm 
    overflow-hidden 
    ${bordered ? 'border border-gray-200' : ''} 
    ${hoverable ? 'transition-shadow duration-300 hover:shadow-md' : ''} 
    ${onClick ? 'cursor-pointer' : ''} 
    ${className}
  `;

  return (
    <div className={cardClasses} onClick={onClick}>
      {/* カードのヘッダー（タイトルがある場合） */}
      {(title || subtitle) && (
        <div className="px-4 py-3 border-b border-gray-100">
          {title && (
            <div className="text-lg font-semibold text-gray-800">{title}</div>
          )}
          {subtitle && (
            <div className="text-sm text-gray-500 mt-1">{subtitle}</div>
          )}
        </div>
      )}

      {/* カードの本体 */}
      <div className="p-4">{children}</div>

      {/* カードのフッター（ある場合） */}
      {footer && (
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
          {footer}
        </div>
      )}
    </div>
  );
};

/**
 * カードグリッドレイアウト
 * 複数のカードをグリッドレイアウトで表示するためのコンポーネント
 */
export const CardGrid: React.FC<{
  children: React.ReactNode;
  columns?: number;
  gap?: number;
  className?: string;
}> = ({ children, columns = 3, gap = 4, className = '' }) => {
  const gapClass = `gap-${gap}`;
  const columnsClass = `grid-cols-1 sm:grid-cols-2 lg:grid-cols-${columns}`;

  return (
    <div className={`grid ${columnsClass} ${gapClass} ${className}`}>
      {children}
    </div>
  );
}; 