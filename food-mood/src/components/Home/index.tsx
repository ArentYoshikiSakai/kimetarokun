import React from 'react';
import Link from 'next/link';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4 py-12">
        {/* ヒーローセクション */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-gray-800 animate-pulse">FoodMood</h1>
          <p className="text-xl text-gray-600 mb-8">
            今の気分や状況に合わせた食事を提案します。何を食べるか迷ったときにご利用ください。
          </p>
          <div className="flex justify-center space-x-4">
            <Link href="/question">
              <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg transition transform hover:scale-105">
                質問に答えて提案を受ける
              </button>
            </Link>
            <Link href="/history">
              <button className="border-2 border-blue-500 text-blue-500 hover:bg-blue-50 px-6 py-3 rounded-lg shadow transition transform hover:scale-105">
                過去の提案を見る
              </button>
            </Link>
          </div>
        </div>

        {/* 機能説明セクション */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">簡単な質問</h3>
            <p className="text-gray-600 text-center">
              シンプルな質問に答えるだけで、あなたの今の気分にぴったりの食事を見つけます。
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">AIによる提案</h3>
            <p className="text-gray-600 text-center">
              最新のAI技術を活用し、あなたの好みに合わせた食事の提案をパーソナライズします。
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1">
            <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-center mb-2">履歴保存</h3>
            <p className="text-gray-600 text-center">
              過去の提案を自動的に保存。前回のお気に入りの食事を簡単に思い出せます。
            </p>
          </div>
        </div>
        
        {/* 使い方セクション */}
        <div className="bg-white p-8 rounded-xl shadow-md mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">使い方</h2>
          <div className="flex flex-col md:flex-row justify-between items-center md:items-start">
            <div className="text-center mb-8 md:mb-0">
              <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">質問に答える</h3>
              <p className="text-gray-600 max-w-xs mx-auto">
                現在の気分や好みに関する簡単な質問に答えます。
              </p>
            </div>
            
            <div className="hidden md:block text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            
            <div className="text-center mb-8 md:mb-0">
              <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">AIによる分析</h3>
              <p className="text-gray-600 max-w-xs mx-auto">
                回答を基に、AIがあなたにぴったりの食事を分析します。
              </p>
            </div>
            
            <div className="hidden md:block text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">結果を受け取る</h3>
              <p className="text-gray-600 max-w-xs mx-auto">
                おすすめの食事の提案と、その理由を確認できます。
              </p>
            </div>
          </div>
        </div>
        
        {/* CTAセクション */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">今すぐ始めましょう！</h2>
          <p className="text-gray-600 mb-8">
            何を食べるか迷ったら、FoodMoodにおまかせください。
          </p>
          <Link href="/question">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg shadow-lg text-xl transition transform hover:scale-105">
              質問に答える
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home; 