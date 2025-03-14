'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, Button, ProgressBar } from '@/components/common';
import { QuestionCard } from './QuestionCard';
import { useQuestionFlow } from '@/hooks/useQuestionFlow';
import { useApp } from '@/contexts/AppContext';

/**
 * 質問画面のメインコンポーネント
 */
export default function QuestionsPage() {
  const router = useRouter();
  const { resetSession } = useApp();
  
  const {
    currentQuestion,
    currentAnswer,
    handleOptionSelect,
    goToNext,
    goToPrevious,
    progressPercentage,
    isCompleted,
    hasAnsweredCurrentQuestion,
  } = useQuestionFlow();

  // 質問フローが完了したら結果画面に遷移
  useEffect(() => {
    if (isCompleted) {
      router.push('/result');
    }
  }, [isCompleted, router]);

  // 選択肢クリック時のハンドラ
  const onSelectOption = (optionId: string) => {
    if (!currentQuestion) return;
    
    // 選択されたオプションのテキストを取得
    const optionText = currentQuestion.options.find(
      (option) => option.id === optionId
    )?.text || '';
    
    handleOptionSelect(optionId, optionText);
  };

  // ホーム画面に戻る
  const handleBackToHome = () => {
    // セッションをリセットするか確認
    if (confirm('質問をやり直しますか？現在の回答はリセットされます。')) {
      resetSession();
      router.push('/');
    }
  };

  if (!currentQuestion) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-[60vh]">
          <p className="text-gray-600 mb-6">質問が見つかりません。</p>
          <Button onClick={handleBackToHome}>ホームに戻る</Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* 進行状況表示 */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-lg font-semibold text-gray-800">
              あなたの食べたいものを探しています
            </h2>
            <span className="text-sm text-gray-600">
              {Math.round(progressPercentage)}% 完了
            </span>
          </div>
          <ProgressBar
            percentage={progressPercentage}
            height={8}
            color="primary"
            animated
          />
        </div>

        {/* 質問カード */}
        <QuestionCard
          question={currentQuestion}
          selectedOptionId={currentAnswer?.selectedOptionId}
          onSelectOption={onSelectOption}
        />

        {/* ナビゲーションボタン */}
        <div className="max-w-xl mx-auto mt-8 flex justify-between">
          <div>
            <Button
              variant="outline"
              onClick={goToPrevious}
              className="mr-3"
            >
              前へ戻る
            </Button>
            <Button
              variant="outline"
              onClick={handleBackToHome}
            >
              やり直す
            </Button>
          </div>
          <Button
            variant="primary"
            onClick={goToNext}
            disabled={!hasAnsweredCurrentQuestion}
          >
            {progressPercentage >= 100 ? '結果を見る' : '次へ進む'}
          </Button>
        </div>
      </div>
    </Layout>
  );
} 