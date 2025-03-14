'use client';

import React from 'react';
import { Card } from '@/components/common';
import { OptionButton } from './OptionButton';
import { Question } from '@/types';

// QuestionCardコンポーネントのプロパティ定義
export interface QuestionCardProps {
  /**
   * 表示する質問
   */
  question: Question;
  /**
   * 現在選択されている選択肢のID
   */
  selectedOptionId?: string | null;
  /**
   * 選択肢クリック時のハンドラ関数
   */
  onSelectOption: (optionId: string) => void;
  /**
   * 非活性状態かどうか
   */
  disabled?: boolean;
  /**
   * 追加のCSSクラス
   */
  className?: string;
}

/**
 * 質問を表示するカードコンポーネント
 */
export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedOptionId,
  onSelectOption,
  disabled = false,
  className = '',
}) => {
  return (
    <Card
      className={`w-full max-w-xl mx-auto transition-opacity ${className}`}
      title={question.text}
    >
      <div className="space-y-2">
        {/* 選択肢リスト */}
        <div className="mt-4">
          {question.options.map((option) => (
            <OptionButton
              key={option.id}
              id={option.id}
              text={option.text}
              isSelected={selectedOptionId === option.id}
              onClick={onSelectOption}
              disabled={disabled}
            />
          ))}
        </div>
      </div>
    </Card>
  );
}; 