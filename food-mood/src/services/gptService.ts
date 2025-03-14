'use client';

import { UserAnswer, FoodSuggestion } from '../types';
import { OpenAI } from 'openai';
import { v4 as uuidv4 } from 'uuid';

// OpenAI APIクライアントの初期化
// APIキーは環境変数から取得
const createOpenAIClient = () => {
  const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('OpenAI API key is not set in environment variables');
    throw new Error('OpenAI API key is not set');
  }
  
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true // クライアントサイドでのAPI呼び出しを許可（注：本番環境では推奨されません）
  });
};

// 質問IDとテキストのマッピング
const questionIdToLabel: Record<string, string> = {
  'nutrition': '栄養成分',
  'taste_intensity': '味の濃さ',
  'juiciness': 'ジューシーさ',
  'quantity': '量',
  'soup': '汁っけ',
  'immediacy': '即時性',
  'cooked': '熱通し',
  'budget': '予算',
  'temperature': '温度',
  'texture': '食感',
  'flavor': '味の種類',
  'cuisine': '料理ジャンル',
  'satisfaction': '満足度'
};

/**
 * ユーザーの回答からプロンプトを生成する
 */
const generatePrompt = (answers: UserAnswer[]): string => {
  // 回答を整形
  const formattedAnswers = answers.map(answer => {
    const questionLabel = questionIdToLabel[answer.questionId] || answer.questionId;
    return `- ${questionLabel}: ${answer.selectedOptionText}`;
  }).join('\n');

  // プロンプトを構築
  return `あなたは食事提案アシスタントです。以下のユーザーの好みに基づいて、3つの食事を提案してください。

ユーザーの回答:
${formattedAnswers}

各提案には以下を含めてください:
1. 料理名
2. 簡単な説明（なぜこの料理がユーザーの好みに合うか）
3. 主な特徴（5つ以内のキーワード）

以下のJSON形式で回答してください：
{
  "suggestions": [
    {
      "name": "料理名",
      "description": "説明文",
      "characteristics": ["特徴1", "特徴2", "特徴3"]
    },
    ...
  ]
}`;
};

/**
 * APIレスポンスをパースして提案データに変換
 */
const parseResponse = (
  response: string, 
  sessionId: string
): FoodSuggestion[] => {
  try {
    const parsedResponse = JSON.parse(response);
    const timestamp = Date.now();
    
    // APIレスポンスから提案データを構築
    return (parsedResponse.suggestions || []).map((suggestion: any) => ({
      id: uuidv4(),
      name: suggestion.name || '不明な料理',
      description: suggestion.description || '',
      characteristics: suggestion.characteristics || [],
      sessionId,
      timestamp
    }));
  } catch (error) {
    console.error('Failed to parse API response:', error);
    // パースに失敗した場合は空の配列を返す
    return [];
  }
};

/**
 * 食事提案を生成する
 */
export const generateFoodSuggestions = async (
  answers: UserAnswer[],
  sessionId: string
): Promise<FoodSuggestion[]> => {
  try {
    // 回答がない場合は空の配列を返す
    if (!answers.length) {
      return [];
    }
    
    // OpenAI APIクライアントを作成
    const openai = createOpenAIClient();
    
    // プロンプトを生成
    const prompt = generatePrompt(answers);
    
    // APIリクエストを送信
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // または最新の適切なモデル
      messages: [
        { role: 'system', content: 'あなたは日本語で応答する食事提案の専門家です。' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1000
    });
    
    // レスポンスを取得
    const responseContent = completion.choices[0]?.message?.content || '';
    
    // レスポンスをパースして提案データに変換
    return parseResponse(responseContent, sessionId);
  } catch (error) {
    console.error('Error generating food suggestions:', error);
    // エラーが発生した場合は空の配列を返す
    return [];
  }
};

/**
 * モックデータを生成する（開発用）
 * APIキーがない場合やテスト時に使用
 */
export const generateMockSuggestions = (
  answers: UserAnswer[],
  sessionId: string
): FoodSuggestion[] => {
  const timestamp = Date.now();
  
  return [
    {
      id: uuidv4(),
      name: '和風きのこパスタ',
      description: 'しょうゆベースの和風ソースと旨味たっぷりのきのこを使ったパスタです。あっさりした味わいながらも満足感があります。',
      characteristics: ['和風', 'パスタ', 'きのこ', 'あっさり', '中程度の量'],
      sessionId,
      timestamp
    },
    {
      id: uuidv4(),
      name: '鶏胸肉のヘルシーカレー',
      description: 'タンパク質豊富な鶏胸肉をメインに、野菜もたっぷり入ったヘルシーなカレーです。スパイシーながらも食べやすい味わいです。',
      characteristics: ['カレー', '鶏胸肉', 'ヘルシー', 'スパイシー', 'タンパク質豊富'],
      sessionId,
      timestamp
    },
    {
      id: uuidv4(),
      name: '豆腐と野菜のサラダ丼',
      description: '食物繊維が豊富な野菜と豆腐を組み合わせたさっぱりとした丼ものです。軽く食べたい時におすすめです。',
      characteristics: ['サラダ', '豆腐', '野菜', 'さっぱり', '食物繊維'],
      sessionId,
      timestamp
    }
  ];
}; 