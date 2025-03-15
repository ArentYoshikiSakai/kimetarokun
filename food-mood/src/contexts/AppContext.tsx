'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { Question, UserAnswer, UserSession, FoodSuggestion } from '../types';
import { questions } from '../data/questions';
import { v4 as uuidv4 } from 'uuid';

// コンテキストの型定義
interface AppContextType {
  // 現在の質問インデックス
  currentQuestionIndex: number;
  // 現在の質問
  currentQuestion: Question | null;
  // 全質問
  questions: Question[];
  // ユーザーの回答リスト
  userAnswers: UserAnswer[];
  // 提案された食事リスト
  suggestions: FoodSuggestion[];
  // 現在のセッション
  session: UserSession;
  // 回答を保存する関数
  saveAnswer: (answer: UserAnswer) => void;
  // ユーザーの回答リストを設定する関数
  setUserAnswers: (answers: UserAnswer[]) => void;
  // 次の質問に進む関数
  nextQuestion: () => void;
  // 前の質問に戻る関数
  previousQuestion: () => void;
  // 提案を設定する関数
  setSuggestions: (suggestions: FoodSuggestion[]) => void;
  // セッションをリセットする関数
  resetSession: () => void;
  // 質問フローが終了したかどうか
  isQuestionFlowFinished: boolean;
  // 質問の進行率（パーセント）
  progressPercentage: number;
}

// コンテキストの作成
const AppContext = createContext<AppContextType | undefined>(undefined);

// 新しいセッションを作成する関数
const createNewSession = (): UserSession => {
  return {
    id: uuidv4(),
    timestamp: Date.now(),
    answers: []
  };
};

// Provider コンポーネント
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 質問の状態
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [suggestions, setSuggestions] = useState<FoodSuggestion[]>([]);
  const [session, setSession] = useState<UserSession>(createNewSession);
  
  // 現在の質問
  const currentQuestion = questions[currentQuestionIndex] || null;
  
  // 質問フローが終了したかどうか
  const isQuestionFlowFinished = currentQuestionIndex >= questions.length;
  
  // 進行率の計算
  const progressPercentage = Math.min(
    Math.round((currentQuestionIndex / questions.length) * 100),
    100
  );

  // セッションが変更されたときの処理
  useEffect(() => {
    // セッションのIDと時間を更新
    setSession(prev => ({
      ...prev,
      answers: [...userAnswers]
    }));
  }, [userAnswers]);

  // 回答を保存する関数
  const saveAnswer = (answer: UserAnswer) => {
    setUserAnswers(prev => {
      // 既存の回答があれば更新、なければ追加
      const exists = prev.findIndex(a => a.questionId === answer.questionId);
      if (exists >= 0) {
        const updated = [...prev];
        updated[exists] = answer;
        return updated;
      }
      return [...prev, answer];
    });
  };

  // 次の質問へ進む
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // 前の質問に戻る
  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // セッションをリセットする
  const resetSession = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setSuggestions([]);
    setSession(createNewSession());
  };

  // コンテキストの値
  const value = {
    currentQuestionIndex,
    currentQuestion,
    questions,
    userAnswers,
    suggestions,
    session,
    saveAnswer,
    setUserAnswers,
    nextQuestion,
    previousQuestion,
    setSuggestions,
    resetSession,
    isQuestionFlowFinished,
    progressPercentage
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// コンテキストを使うためのカスタムフック
export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}; 