<think>仕様を元にアプリケーションを開発する実装手順を分解して示す必要があります。仕様書を元に、段階的な実装手順をまとめます。

主な実装ステップを考えると：
1. プロジェクト環境のセットアップ
2. コンポーネント構造の構築
3. 状態管理の実装
4. 質問フローの実装
5. APIサービスの構築
6. UI/UXデザインの実装
7. 履歴機能の実装
8. テストとデバッグ
9. デプロイ

各ステップについて具体的な作業内容を詳細に説明します。</think># アプリケーション開発実装手順

仕様書を元に「FoodMood - 食べたいもの発見アプリ」の実装手順を以下に段階的に分解します。

## フェーズ1: 環境構築と基本設定

### ステップ1: プロジェクトのセットアップ
1. Next.jsプロジェクトの作成
   ```
   npx create-next-app@latest food-mood --typescript --eslint --tailwind --app --src-dir
   ```
2. 必要なパッケージのインストール
   ```
   npm install axios openai @types/node-localstorage
   ```

### ステップ2: プロジェクト構造の整備
1. 仕様書のディレクトリ構造に従ってフォルダを作成
   - components/
     - Home/
     - Questions/
     - Results/
     - History/
     - common/
   - contexts/
   - hooks/
   - services/
   - types/
   - utils/

## フェーズ2: データモデルとタイプの定義

### ステップ3: 型定義の作成
1. `src/types/index.ts`に基本型を定義
   - Question, UserAnswer, UserSession, FoodSuggestion インターフェースを作成

### ステップ4: 質問データの定義
1. 質問データセットの作成 (`src/data/questions.ts`)
   - 仕様書の質問フローに基づく13の質問を定義

## フェーズ3: コア機能の実装

### ステップ5: コンテキスト作成とステート管理
1. `src/contexts/AppContext.tsx`の実装
   - ユーザーセッション管理
   - 質問の状態管理
   - 回答の保存

### ステップ6: 質問フロー制御の実装
1. `src/hooks/useQuestionFlow.ts`の作成
   - 質問の表示制御
   - 回答の保存
   - 次の質問への遷移ロジック

### ステップ7: GPT API連携サービスの実装
1. `src/services/gptService.ts`の作成
   - OpenAI APIの設定
   - プロンプト生成機能
   - レスポンス処理

### ステップ8: ローカルストレージ機能の実装
1. `src/utils/storage.ts`の作成
   - セッション保存機能
   - 履歴読み込み機能
   - 履歴管理機能

## フェーズ4: UI実装

### ステップ9: 共通コンポーネントの実装
1. `src/components/common/`以下に共通コンポーネントを作成
   - Button, Card, Layout, ProgressBar など

### ステップ10: 画面コンポーネントの実装
1. ホーム画面の実装
   ```
   src/components/Home/index.tsx
   ```
2. 質問画面の実装
   ```
   src/components/Questions/QuestionCard.tsx
   src/components/Questions/OptionButton.tsx
   src/components/Questions/index.tsx
   ```
3. 結果画面の実装
   ```
   src/components/Results/SuggestionCard.tsx
   src/components/Results/index.tsx
   ```
4. 履歴画面の実装
   ```
   src/components/History/HistoryItem.tsx
   src/components/History/index.tsx
   ```

### ステップ11: ルーティングの設定
1. Next.jsのApp Routerの設定
   ```
   src/app/page.tsx  (ホーム画面)
   src/app/questions/page.tsx
   src/app/results/page.tsx
   src/app/history/page.tsx
   ```

## フェーズ5: 機能連携と統合

### ステップ12: アプリケーションの統合
1. コンテキストプロバイダーでアプリケーションをラップ
   ```
   src/app/layout.tsx
   ```
2. 各画面の連携確認

### ステップ13: 質問フローのテスト
1. 全質問の表示テスト
2. 回答選択時の状態管理テスト
3. 質問間の遷移テスト

### ステップ14: GPT API連携テスト
1. APIキーの設定確認
2. テスト用プロンプトによる結果確認
3. エラーハンドリングの検証

## フェーズ6: エラーハンドリングと品質向上

### ステップ15: エラーハンドリングの実装
1. API呼び出しのエラー処理
2. ローディング状態の実装
3. フォールバックUIの準備

### ステップ16: パフォーマンス最適化
1. コンポーネントのメモ化
2. 不要な再描画の抑制
3. APIリクエストのキャッシング

### ステップ17: ユーザーエクスペリエンス改善
1. トランジションとアニメーションの追加
2. レスポンシブデザインの調整
3. アクセシビリティの確認

## フェーズ7: テストとデプロイ

### ステップ18: テストの実施
1. ユニットテストの作成
2. インテグレーションテストの実施
3. E2Eテストの実施

### ステップ19: デプロイ準備
1. 環境変数の設定
2. ビルドと最適化
3. デプロイ設定

### ステップ20: デプロイと監視
1. VercelまたはNetlifyへのデプロイ
2. 動作確認
3. エラーモニタリングの設定

## 具体的なコード実装例

### 質問データ構造の例
```typescript
// src/data/questions.ts
import { Question } from '../types';

export const questions: Question[] = [
  {
    id: 'nutrition',
    text: '今どんな栄養を取りたい気分ですか？',
    options: [
      { id: 'protein', text: 'タンパク質' },
      { id: 'carbs', text: '炭水化物' },
      { id: 'fat', text: '脂質' },
      { id: 'fiber', text: '食物繊維' }
    ]
  },
  // 残りの質問も同様に定義...
];
```

### コンテキスト実装例
```typescript
// src/contexts/AppContext.tsx
import React, { createContext, useState, useContext } from 'react';
import { Question, UserAnswer, UserSession, FoodSuggestion } from '../types';
import { questions } from '../data/questions';

interface AppContextType {
  currentQuestionIndex: number;
  userAnswers: UserAnswer[];
  suggestions: FoodSuggestion[];
  saveAnswer: (answer: UserAnswer) => void;
  nextQuestion: () => void;
  previousQuestion: () => void;
  setSuggestions: (suggestions: FoodSuggestion[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [suggestions, setSuggestions] = useState<FoodSuggestion[]>([]);

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
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  // 前の質問に戻る
  const previousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const value = {
    currentQuestionIndex,
    userAnswers,
    suggestions,
    saveAnswer,
    nextQuestion,
    previousQuestion,
    setSuggestions
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
```

### 質問コンポーネント例
```tsx
// src/components/Questions/QuestionCard.tsx
import React from 'react';
import { Question } from '../../types';
import OptionButton from './OptionButton';
import { useApp } from '../../contexts/AppContext';

interface QuestionCardProps {
  question: Question;
}

const QuestionCard: React.FC<QuestionCardProps> = ({ question }) => {
  const { saveAnswer, nextQuestion } = useApp();

  const handleOptionSelect = (optionId: string, optionText: string) => {
    saveAnswer({
      questionId: question.id,
      selectedOptionId: optionId,
      selectedOptionText: optionText
    });
    nextQuestion();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">{question.text}</h2>
      <div className="flex flex-col gap-2">
        {question.options.map(option => (
          <OptionButton
            key={option.id}
            text={option.text}
            onClick={() => handleOptionSelect(option.id, option.text)}
          />
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
```

これらの実装手順に従って開発を進めることで、仕様書に基づいた「FoodMood - 食べたいもの発見アプリ」を段階的に構築できます。各フェーズを順番に完成させながら、機能を継続的に統合していくことをお勧めします。
