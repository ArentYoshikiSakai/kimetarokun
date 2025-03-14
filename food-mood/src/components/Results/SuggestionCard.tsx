'use client';

import React from 'react';
import { Card } from '@/components/common';
import { FoodSuggestion } from '@/types';

// SuggestionCardコンポーネントのプロパティ定義
export interface SuggestionCardProps {
  /**
   * 表示する食事提案データ
   */
  suggestion: FoodSuggestion;
  /**
   * カードクリック時のハンドラ関数
   */
  onClick?: () => void;
  /**
   * 追加のCSSクラス
   */
  className?: string;
}

/**
 * 食事提案を表示するカードコンポーネント
 */
export const SuggestionCard: React.FC<SuggestionCardProps> = ({
  suggestion,
  onClick,
  className = '',
}) => {
  return (
    <Card
      title={suggestion.name}
      hoverable={!!onClick}
      onClick={onClick}
      className={`h-full transition-transform duration-300 ${className}`}
    >
      {/* 提案の説明文 */}
      <p className="text-gray-600 mb-4">{suggestion.description}</p>

      {/* 特徴タグ */}
      <div className="flex flex-wrap gap-2 mt-2">
        {suggestion.characteristics.map((characteristic, index) => (
          <span
            key={index}
            className="inline-block bg-primary-50 text-primary-700 px-2 py-1 text-xs rounded-full"
          >
            {characteristic}
          </span>
        ))}
      </div>
    </Card>
  );
}; 