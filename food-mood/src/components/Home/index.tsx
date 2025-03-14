'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button, Card, Layout } from '@/components/common';

/**
 * ホーム画面コンポーネント
 * アプリケーションのメインランディングページ
 */
export default function Home() {
  const router = useRouter();

  // 質問画面へ遷移する関数
  const handleStartClick = () => {
    router.push('/question');
  };

  // 履歴画面へ遷移する関数
  const handleHistoryClick = () => {
    router.push('/history');
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 flex flex-col items-center">
        {/* ヒーローセクション */}
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl font-bold text-primary-600 mb-4">
            FoodMood
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            食べたいものが決まらない時に、あなたの気分に合わせた食事を提案します
          </p>
        </div>

        {/* メインコンテンツ */}
        <div className="w-full max-w-4xl">
          <Card className="mb-8 p-2">
            <div className="flex flex-col md:flex-row items-center p-4">
              <div className="md:w-1/2 mb-6 md:mb-0 md:pr-8">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                  今日の食事、どうしよう？
                </h2>
                <p className="text-gray-600 mb-6">
                  FoodMoodは、いくつかの質問に答えるだけで、
                  あなたの気分や状況に合った食事を提案します。
                  面倒な選択肢から解放されて、
                  すぐに食べたいものを見つけましょう。
                </p>
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleStartClick}
                  className="w-full md:w-auto"
                >
                  質問に答えて食事を提案してもらう
                </Button>
              </div>
              <div className="md:w-1/2 flex justify-center">
                <div className="relative w-64 h-64 rounded-full bg-primary-50 overflow-hidden">
                  {/* この部分は実際の画像に置き換えるか、またはデザイン要素として維持 */}
                  <div className="absolute inset-0 flex items-center justify-center text-primary-600 text-6xl font-bold opacity-30">
                    Food
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* 機能説明カード */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card hoverable className="text-center p-6">
              <div className="text-primary-600 text-3xl mb-4">🍽️</div>
              <h3 className="text-lg font-semibold mb-2">簡単な質問</h3>
              <p className="text-gray-600">
                シンプルな質問に答えるだけで、あなたの好みを分析します
              </p>
            </Card>

            <Card hoverable className="text-center p-6">
              <div className="text-primary-600 text-3xl mb-4">🤖</div>
              <h3 className="text-lg font-semibold mb-2">AI提案</h3>
              <p className="text-gray-600">
                AIがあなたの回答に基づいた、ぴったりの食事を提案します
              </p>
            </Card>

            <Card hoverable className="text-center p-6">
              <div className="text-primary-600 text-3xl mb-4">📋</div>
              <h3 className="text-lg font-semibold mb-2">履歴保存</h3>
              <p className="text-gray-600">
                過去の提案を保存して、いつでも参照できます
              </p>
            </Card>
          </div>

          {/* 履歴リンク */}
          <div className="text-center mb-12">
            <p className="text-gray-600 mb-4">
              過去の提案履歴を確認しますか？
            </p>
            <Button
              variant="outline"
              size="md"
              onClick={handleHistoryClick}
              className="mx-auto"
            >
              履歴を見る
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
} 