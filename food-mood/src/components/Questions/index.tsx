'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, Button, ProgressBar } from '@/components/common';
import { QuestionCard } from './QuestionCard';
import { useApp } from '@/contexts/AppContext';
import { getDefaultQuestions } from '@/data/questions';
import { nanoid } from 'nanoid';

/**
 * 質問画面のメインコンポーネント
 */
export default function Questions() {
  const router = useRouter();
  const { 
    session, 
    userAnswers, 
    setUserAnswers,
    resetSession 
  } = useApp();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  // デフォルト質問の取得
  const questions = getDefaultQuestions();
  const totalQuestions = questions.length;
  
  // 現在の質問
  const currentQuestion = questions[currentQuestionIndex];
  
  // 回答の進捗率を計算
  const progress = Math.round(((currentQuestionIndex) / totalQuestions) * 100);

  // コンポーネントマウント時に回答が既にある場合、復元
  useEffect(() => {
    // 回答データがなければ初期化
    if (userAnswers.length === 0) {
      console.log('Initializing questions');
      // 質問に対応する回答オブジェクトを生成
      const initialAnswers = questions.map(question => ({
        ...question,
        answer: '',
        id: nanoid()
      }));
      setUserAnswers(initialAnswers);
    } else {
      // 回答データが既にある場合、既に回答した質問にスキップ
      const answeredCount = userAnswers.filter(q => q.answer && q.answer.trim() !== '').length;
      if (answeredCount > 0 && currentQuestionIndex === 0) {
        setCurrentQuestionIndex(Math.min(answeredCount, totalQuestions - 1));
      }
    }
  }, [questions, userAnswers, setUserAnswers, currentQuestionIndex, totalQuestions]);

  // 現在の質問の回答を取得
  const getCurrentAnswer = () => {
    const questionId = currentQuestion.id;
    const answer = userAnswers.find(a => a.id === questionId);
    return answer ? answer.answer : '';
  };

  // 回答が有効かチェック
  const isAnswerValid = (answer: string) => {
    if (!answer || answer.trim() === '') {
      setIsError(true);
      setErrorMessage('回答を入力してください');
      return false;
    }
    return true;
  };

  // 回答の保存
  const saveAnswer = (questionId: string, answer: string) => {
    setUserAnswers(
      userAnswers.map(q =>
        q.id === questionId ? { ...q, answer } : q
      )
    );
  };

  // 次の質問へ
  const handleNextQuestion = () => {
    const currentAnswer = getCurrentAnswer();
    
    if (!isAnswerValid(currentAnswer)) {
      // 回答無効の場合は次に進まない
      return;
    }
    
    // エラーをクリア
    setIsError(false);
    setErrorMessage('');
    
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 最後の質問の場合は結果画面へ
      router.push('/result');
    }
  };

  // 前の質問へ
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // エラーをクリア
      setIsError(false);
      setErrorMessage('');
    }
  };

  // 初めからやり直す
  const handleReset = () => {
    // 確認ダイアログ
    if (window.confirm('回答をリセットして最初からやり直しますか？')) {
      resetSession();
      setCurrentQuestionIndex(0);
      setIsError(false);
      setErrorMessage('');
    }
  };

  // キーボードイベントの処理
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Enterキーで次の質問へ
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleNextQuestion();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [currentQuestionIndex, userAnswers]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <ProgressBar value={progress} max={100} />
            <div className="mt-2 text-right text-sm text-gray-600">
              {currentQuestionIndex + 1} / {totalQuestions}
            </div>
          </div>

          {currentQuestion && (
            <QuestionCard
              key={currentQuestion.id}
              question={currentQuestion}
              answer={getCurrentAnswer()}
              onAnswerChange={(answer) => saveAnswer(currentQuestion.id, answer)}
              isError={isError}
              errorMessage={errorMessage}
            />
          )}

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
            >
              前の質問
            </Button>
            
            <Button
              variant="outline"
              onClick={handleReset}
              className="mx-4"
            >
              最初からやり直す
            </Button>
            
            <Button
              variant="primary"
              onClick={handleNextQuestion}
            >
              {currentQuestionIndex < totalQuestions - 1 ? '次の質問' : '結果を見る'}
            </Button>
          </div>
          
          {/* ヘルプテキスト */}
          <div className="mt-4 text-center text-sm text-gray-500">
            Enterキーを押して次の質問に進むこともできます
          </div>
        </div>
      </div>
    </Layout>
  );
} 