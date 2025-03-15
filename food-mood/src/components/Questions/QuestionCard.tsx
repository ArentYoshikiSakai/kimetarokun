'use client';

import React, { useState } from 'react';
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
   * 現在の回答（テキスト）
   */
  answer?: string;
  /**
   * 現在選択されている選択肢のID
   */
  selectedOptionId?: string | null;
  /**
   * 選択肢クリック時のハンドラ関数
   */
  onSelectOption?: (optionId: string) => void;
  /**
   * 回答変更時のハンドラ関数（テキスト入力用）
   */
  onAnswerChange?: (answer: string) => void;
  /**
   * エラー状態
   */
  isError?: boolean;
  /**
   * エラーメッセージ
   */
  errorMessage?: string;
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
  answer = '',
  selectedOptionId,
  onSelectOption,
  onAnswerChange,
  isError = false,
  errorMessage = '',
  disabled = false,
  className = '',
}) => {
  // 選択肢をクリックしたときの処理
  const handleOptionClick = (optionId: string) => {
    if (onSelectOption) {
      onSelectOption(optionId);
    }
    
    // 選択肢のテキストを取得して回答としても設定
    if (onAnswerChange) {
      const optionText = question.options.find(opt => opt.id === optionId)?.text || '';
      onAnswerChange(optionText);
    }
  };
  
  // テキスト入力の変更処理
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onAnswerChange) {
      onAnswerChange(e.target.value);
    }
  };

  return (
    <Card
      className={`w-full max-w-xl mx-auto transition-opacity ${className}`}
      title={question.text}
    >
      <div className="space-y-4">
        {/* 選択肢リスト */}
        {question.options && question.options.length > 0 ? (
          <div className="mt-4">
            {question.options.map((option) => (
              <OptionButton
                key={option.id}
                id={option.id}
                text={option.text}
                isSelected={selectedOptionId === option.id || answer === option.text}
                onClick={handleOptionClick}
                disabled={disabled}
              />
            ))}
          </div>
        ) : (
          // 選択肢がない場合はテキストエリアを表示
          <div className="mt-4">
            <textarea
              value={answer}
              onChange={handleTextChange}
              placeholder="あなたの回答を入力してください..."
              disabled={disabled}
              className={`
                w-full p-3 border rounded-md resize-none min-h-[120px]
                ${isError ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'}
                focus:border-transparent focus:outline-none focus:ring-2
              `}
            />
          </div>
        )}
        
        {/* エラーメッセージ */}
        {isError && errorMessage && (
          <div className="text-sm text-red-600 mt-2">
            {errorMessage}
          </div>
        )}
      </div>
    </Card>
  );
}; 