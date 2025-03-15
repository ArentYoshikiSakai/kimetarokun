'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Layout, Button, Card, CardGrid } from '@/components/common';
import { SuggestionCard } from './SuggestionCard';
import { useApp } from '@/contexts/AppContext';
import { generateFoodSuggestions, generateMockSuggestions } from '@/services/gptService';
import { historyStorage } from '@/utils/storage';

/**
 * 結果画面のメインコンポーネント
 */
export default function Results() {
  const router = useRouter();
  const { 
    userAnswers, 
    suggestions, 
    setSuggestions, 
    resetSession, 
    session 
  } = useApp();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  // 提案を生成する
  useEffect(() => {
    if (userAnswers.length === 0) {
      // 回答がない場合は質問画面にリダイレクト
      router.push('/question');
      return;
    }

    if (suggestions.length > 0) {
      // 既に提案がある場合はロード完了
      setIsLoading(false);
      return;
    }

    // 提案を生成
    const generateSuggestions = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // APIから提案を取得（エラー時はキャッチして処理）
        const newSuggestions = await generateFoodSuggestions(userAnswers, session.id);
        
        if (newSuggestions.length === 0) {
          // 結果が空の場合はモックデータを使用
          console.warn('Empty suggestions received, using mock data');
          const mockData = generateMockSuggestions(userAnswers, session.id);
          setSuggestions(mockData);
        } else {
          // 正常に結果を取得できた場合
          setSuggestions(newSuggestions);
        }
      } catch (err) {
        console.error('Error generating suggestions:', err);
        
        // エラー表示と同時にモックデータで回復
        setError('提案の生成中にエラーが発生しました。代替データを表示します。');
        
        // モックデータを使用
        const mockData = generateMockSuggestions(userAnswers, session.id);
        setSuggestions(mockData);
        
        // 2秒後にエラーメッセージを消す（ユーザビリティ向上）
        setTimeout(() => {
          setError(null);
        }, 2000);
      } finally {
        setIsLoading(false);
      }
    };

    generateSuggestions();
  }, [userAnswers, suggestions, setSuggestions, router, session.id]);

  // 質問をやり直す
  const handleRestart = () => {
    resetSession();
    router.push('/question');
  };

  // 履歴に保存
  const handleSaveToHistory = () => {
    if (suggestions.length > 0) {
      // セッションと提案を履歴に保存
      historyStorage.saveSessionAndSuggestions(session, suggestions);
      setIsSaved(true);
      
      // 保存メッセージを数秒後に消す
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    }
  };

  // ホームに戻る
  const handleBackToHome = () => {
    router.push('/');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* ヘッダー */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              あなたにおすすめの食事
            </h1>
            <p className="text-gray-600">
              あなたの回答に基づいて、以下の食事をおすすめします
            </p>
          </div>

          {/* ローディング状態 */}
          {isLoading && (
            <Card className="p-8 text-center">
              <div className="flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mb-4"></div>
                <p className="text-gray-600">食事の提案を生成中...</p>
              </div>
            </Card>
          )}

          {/* エラー表示 */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-center">
              {error}
            </div>
          )}

          {/* 提案リスト */}
          {!isLoading && suggestions.length > 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {suggestions.map((suggestion) => (
                  <SuggestionCard
                    key={suggestion.id}
                    suggestion={suggestion}
                    className="h-full"
                  />
                ))}
              </div>

              {/* 操作ボタン */}
              <div className="flex flex-col sm:flex-row justify-center items-center mt-8 space-y-4 sm:space-y-0 sm:space-x-4">
                <Button
                  variant="outline"
                  onClick={handleBackToHome}
                  className="w-full sm:w-auto"
                >
                  ホームに戻る
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRestart}
                  className="w-full sm:w-auto"
                >
                  もう一度質問に答える
                </Button>
                <Button
                  variant="primary"
                  onClick={handleSaveToHistory}
                  disabled={isSaved}
                  className="w-full sm:w-auto"
                >
                  {isSaved ? '保存しました！' : '履歴に保存'}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
} 