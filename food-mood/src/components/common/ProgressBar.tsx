'use client';

import React from 'react';

// ProgressBarコンポーネントのプロパティ定義
export interface ProgressBarProps {
  /**
   * 進捗率（0〜100）
   */
  percentage: number;
  /**
   * コンポーネントの高さ（px）
   */
  height?: number;
  /**
   * バーの色（Tailwind CSSのクラス名）
   */
  color?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  /**
   * 進捗率のテキストを表示するかどうか
   */
  showPercentage?: boolean;
  /**
   * 進捗率のテキスト位置
   */
  textPosition?: 'inside' | 'right';
  /**
   * アニメーションの有無
   */
  animated?: boolean;
  /**
   * ラベル（説明テキスト）
   */
  label?: string;
  /**
   * 追加のCSSクラス
   */
  className?: string;
}

/**
 * 共通のProgressBarコンポーネント
 * 進捗状況を視覚的に表示します
 */
export const ProgressBar: React.FC<ProgressBarProps> = ({
  percentage,
  height = 8,
  color = 'primary',
  showPercentage = false,
  textPosition = 'right',
  animated = true,
  label,
  className = '',
}) => {
  // パーセンテージを0〜100の範囲に制限
  const normalizedPercentage = Math.min(100, Math.max(0, percentage));
  
  // カラーマッピング
  const colorClasses = {
    primary: 'bg-primary-600',
    secondary: 'bg-gray-600',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  };

  const barColor = colorClasses[color];
  const animationClass = animated ? 'transition-all duration-500 ease-out' : '';

  return (
    <div className={`w-full ${className}`}>
      {/* ラベルと進捗率表示（テキスト位置が右の場合） */}
      {(label || (showPercentage && textPosition === 'right')) && (
        <div className="flex justify-between mb-1">
          {label && <span className="text-sm text-gray-600">{label}</span>}
          {showPercentage && textPosition === 'right' && (
            <span className="text-sm font-medium text-gray-700">
              {normalizedPercentage}%
            </span>
          )}
        </div>
      )}

      {/* プログレスバー本体 */}
      <div
        className="w-full bg-gray-200 rounded-full overflow-hidden"
        style={{ height: `${height}px` }}
      >
        <div
          className={`${barColor} ${animationClass} rounded-full flex items-center justify-center`}
          style={{
            width: `${normalizedPercentage}%`,
            height: '100%',
          }}
        >
          {/* 進捗率テキスト（テキスト位置がバー内部の場合） */}
          {showPercentage && textPosition === 'inside' && normalizedPercentage > 5 && (
            <span className="text-xs font-medium text-white px-1">
              {normalizedPercentage}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}; 