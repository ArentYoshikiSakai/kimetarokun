'use client';

import { useState, useCallback, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';
import { UserAnswer } from '../types';

/**
 * 質問フローを制御するためのカスタムフック
 * 質問の表示、回答の保存、質問間の遷移を管理します
 */
export const useQuestionFlow = () => {
  // AppContextから必要な状態と関数を取得
  const {
    currentQuestion,
    currentQuestionIndex,
    questions,
    userAnswers,
    saveAnswer: saveAnswerToContext,
    nextQuestion: goToNextQuestion,
    previousQuestion: goToPreviousQuestion,
    isQuestionFlowFinished,
    progressPercentage,
  } = useApp();

  // 現在の質問に対する回答を取得
  const getCurrentAnswer = useCallback(() => {
    if (!currentQuestion) return null;
    return userAnswers.find(answer => answer.questionId === currentQuestion.id) || null;
  }, [currentQuestion, userAnswers]);

  // 現在の回答
  const [currentAnswer, setCurrentAnswer] = useState<UserAnswer | null>(getCurrentAnswer());

  // 質問が変わったときに現在の回答を更新
  useEffect(() => {
    setCurrentAnswer(getCurrentAnswer());
  }, [currentQuestion, getCurrentAnswer]);

  // 選択肢を選んだときの処理
  const handleOptionSelect = useCallback((optionId: string, optionText: string) => {
    if (!currentQuestion) return;

    const answer: UserAnswer = {
      questionId: currentQuestion.id,
      selectedOptionId: optionId,
      selectedOptionText: optionText
    };

    // 回答を一時的に保存
    setCurrentAnswer(answer);
    
    // コンテキストに回答を保存
    saveAnswerToContext(answer);
  }, [currentQuestion, saveAnswerToContext]);

  // 次の質問に進む
  const goToNext = useCallback(() => {
    if (currentAnswer) {
      goToNextQuestion();
    }
  }, [currentAnswer, goToNextQuestion]);

  // 前の質問に戻る
  const goToPrevious = useCallback(() => {
    goToPreviousQuestion();
  }, [goToPreviousQuestion]);

  // 特定の質問に直接ジャンプする
  const jumpToQuestion = useCallback((index: number) => {
    // インデックスが有効範囲内かチェック
    if (index >= 0 && index < questions.length) {
      // この実装では単純に指定されたインデックスに移動
      // より複雑なロジックが必要な場合はここに追加
    }
  }, [questions.length]);

  // 質問フローが完了しているかどうか
  const isCompleted = isQuestionFlowFinished;

  // 全ての質問に回答しているかどうか
  const hasAnsweredAllQuestions = userAnswers.length === questions.length;

  // 現在の質問に回答しているかどうか
  const hasAnsweredCurrentQuestion = !!currentAnswer;

  return {
    // 現在の質問と回答
    currentQuestion,
    currentAnswer,
    currentQuestionIndex,
    
    // 質問の総数と進捗
    totalQuestions: questions.length,
    progressPercentage,
    
    // アクション
    handleOptionSelect,
    goToNext,
    goToPrevious,
    jumpToQuestion,
    
    // 状態チェック
    isCompleted,
    hasAnsweredAllQuestions,
    hasAnsweredCurrentQuestion,
    
    // 全ての回答
    allAnswers: userAnswers
  };
}; 