'use client';

import React from 'react';
import { Button } from '@/components/common';

// OptionButtonコンポーネントのプロパティ定義
export interface OptionButtonProps {
  /**
   * 選択肢のID
   */
  id: string;
  /**
   * 選択肢のテキスト
   */
  text: string;
  /**
   * 選択状態（選択されているかどうか）
   */
  isSelected?: boolean;
  /**
   * クリック時のハンドラ関数
   */
  onClick: (id: string) => void;
  /**
   * 非活性状態かどうか
   */
  disabled?: boolean;
}

/**
 * 質問の選択肢を表示するボタンコンポーネント
 */
export const OptionButton: React.FC<OptionButtonProps> = ({
  id,
  text,
  isSelected = false,
  onClick,
  disabled = false,
}) => {
  // クリックイベントハンドラ
  const handleClick = () => {
    onClick(id);
  };

  // 選択状態に応じたスタイルを適用
  return (
    <Button
      variant={isSelected ? 'primary' : 'outline'}
      fullWidth
      className={`
        mb-3 
        py-3 
        justify-start 
        text-left 
        relative
        ${isSelected ? 'shadow-sm' : ''}
      `}
      onClick={handleClick}
      disabled={disabled}
    >
      <div className="flex items-center">
        {/* 選択状態を示すインジケーター */}
        <div
          className={`
            mr-3 
            w-5 
            h-5 
            rounded-full 
            flex 
            items-center 
            justify-center
            border
            ${
              isSelected
                ? 'bg-primary-600 border-primary-600'
                : 'border-gray-300 bg-white'
            }
          `}
        >
          {isSelected && (
            <div className="w-2 h-2 rounded-full bg-white"></div>
          )}
        </div>
        {/* 選択肢のテキスト */}
        <span className={isSelected ? 'font-medium' : ''}>{text}</span>
      </div>
    </Button>
  );
}; 