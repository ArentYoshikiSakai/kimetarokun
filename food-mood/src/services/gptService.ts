'use client';

import { UserAnswer, FoodSuggestion, Question } from '../types';
import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';

// モックデータのみを使用するモード（開発中や課金制限時に使用）
const useMockOnly = true;

// レスポンスキャッシュ（同じリクエストに対して重複APIコールを防止）
type CacheRecord = {
  suggestions: FoodSuggestion[];
  timestamp: number;
};
const responseCache: Record<string, CacheRecord> = {};
const CACHE_TTL = 1000 * 60 * 60; // 1時間キャッシュを保持

// APIキーの確認
const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
if (!apiKey && !useMockOnly) {
  console.warn('OpenAI API key is not set. Mock data will be used instead.');
}

// OpenAIクライアントの初期化（APIキーがある場合のみ）
const openai = apiKey ? new OpenAI({ apiKey, dangerouslyAllowBrowser: true }) : null;

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
 * リトライロジックをともなうAPIリクエスト
 * レート制限（429エラー）発生時に、指数バックオフで再試行します
 */
const makeRequestWithRetry = async (
  apiCall: () => Promise<any>,
  maxRetries: number = 3,
  initialBackoff: number = 2000
): Promise<any> => {
  let retries = 0;
  let backoff = initialBackoff;

  while (retries <= maxRetries) {
    try {
      return await apiCall();
    } catch (error: any) {
      // 429エラー (Too Many Requests) か確認
      if (error?.status === 429 && retries < maxRetries) {
        console.warn(`Rate limit exceeded. Retrying in ${backoff}ms... (${retries + 1}/${maxRetries})`);
        // 指定時間待機
        await new Promise(resolve => setTimeout(resolve, backoff));
        // バックオフ時間を2倍に増加（指数バックオフ）
        backoff *= 2;
        retries++;
      } else {
        // その他のエラーまたは最大リトライ回数に達した場合
        throw error;
      }
    }
  }
  
  throw new Error('Maximum retry attempts reached');
};

/**
 * ユーザー回答からキャッシュのキーを生成
 */
const generateCacheKey = (answers: UserAnswer[]): string => {
  return answers
    .map(a => `${a.questionId}:${a.selectedOptionId}`)
    .sort()
    .join('|');
};

/**
 * 食事提案を生成する
 */
export async function generateFoodSuggestions(
  answers: UserAnswer[],
  sessionId: string
): Promise<FoodSuggestion[]> {
  // 回答がなければモックデータを返す
  if (answers.length === 0) {
    return generateMockSuggestions(answers, sessionId);
  }

  // モックデータのみのモードが有効な場合
  if (useMockOnly || !apiKey || !openai) {
    console.log('Using mock data (mock mode or no API key)');
    return generateMockSuggestions(answers, sessionId);
  }

  // キャッシュキー生成
  const cacheKey = generateCacheKey(answers);
  
  // キャッシュチェック
  const cachedResult = responseCache[cacheKey];
  if (cachedResult && Date.now() - cachedResult.timestamp < CACHE_TTL) {
    console.log('Using cached result for this query');
    return cachedResult.suggestions;
  }

  // プロンプトの準備
  const prompt = generatePrompt(answers);
  
  // 最大リトライ回数
  const MAX_RETRIES = 3;
  let retryCount = 0;
  
  // リトライループ
  while (retryCount < MAX_RETRIES) {
    try {
      console.log(`Attempt ${retryCount + 1} to generate suggestions`);
      
      // GPT APIを呼び出す
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'あなたは日本食の専門家です。ユーザーの好みや制限に基づいて、3つの食事提案を生成してください。'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 1000,
        response_format: { type: 'json_object' }
      });

      // レスポンスからテキストを取得
      const responseText = completion.choices[0]?.message?.content || '';
      
      try {
        // JSONをパースしてフードサジェスチョンに変換
        const parsedResponse = JSON.parse(responseText);
        const suggestions = parsedResponse.suggestions || [];
        
        // 有効な提案があることを確認
        if (suggestions.length > 0) {
          // 提案を正規化してIDとタイムスタンプを追加
          const formattedSuggestions: FoodSuggestion[] = suggestions.map((suggestion: any) => ({
            id: uuidv4(),
            name: suggestion.name || '不明な料理',
            description: suggestion.description || 'この料理の説明はありません。',
            characteristics: suggestion.characteristics || [],
            sessionId,
            timestamp: new Date().toISOString()
          }));

          // キャッシュに保存
          responseCache[cacheKey] = {
            suggestions: formattedSuggestions,
            timestamp: Date.now()
          };
          
          return formattedSuggestions;
        }
      } catch (parseError) {
        console.error('Error parsing API response:', parseError);
      }
      
      // 成功レスポンスがない場合はリトライカウントを増やす
      retryCount++;
      
    } catch (error: any) {
      console.error('OpenAI API error:', error);
      
      // 429エラー（レートリミット）の場合は待機してリトライ
      if (error.status === 429) {
        retryCount++;
        const waitTime = Math.pow(2, retryCount) * 1000; // 指数バックオフ
        console.log(`Rate limited. Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      // その他のエラーの場合はモックデータを使用
      return generateMockSuggestions(answers, sessionId);
    }
  }

  // 全てのリトライが失敗した場合はモックデータを使用
  console.log('All API attempts failed, using mock data');
  return generateMockSuggestions(answers, sessionId);
}

/**
 * モックデータを生成する（開発用）
 * APIキーがない場合やテスト時に使用
 */
export function generateMockSuggestions(
  answers: UserAnswer[],
  sessionId: string
): FoodSuggestion[] {
  // 多様なモックデータを用意
  const mockFoodSuggestions = [
    {
      id: uuidv4(),
      name: '鯖の味噌煮',
      description: 'ビタミンDとオメガ3脂肪酸が豊富な鯖を使った伝統的な日本料理です。甘みと旨味のある味噌だれでコクがあり、ご飯との相性抜群です。',
      characteristics: ['高タンパク質', 'オメガ3脂肪酸', '旨味たっぷり'],
      sessionId,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      name: '豆腐と野菜の味噌汁',
      description: '豆腐、わかめ、ねぎなどの具材が入った栄養バランスの良い味噌汁です。朝食にぴったりで、優しい味わいながらも満足感があります。',
      characteristics: ['低カロリー', '食物繊維', '大豆イソフラボン'],
      sessionId,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      name: '鶏の照り焼き丼',
      description: '甘辛いソースでコーティングされた鶏肉を新鮮な野菜と一緒にご飯の上に盛り付けた丼ぶりです。食べ応えがありながらもバランスの取れた一品です。',
      characteristics: ['高タンパク質', '食べ応え', 'エネルギー補給'],
      sessionId,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      name: '冷やし茶漬け',
      description: '夏にぴったりの冷たいお茶をかけて食べる和風のライスサラダです。梅干し、海苔、わさびなどをトッピングし、さっぱりとした口当たりが特徴です。',
      characteristics: ['さっぱり', '低カロリー', '夏向き'],
      sessionId,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      name: '納豆と長芋の山かけ丼',
      description: '栄養価の高い納豆と長芋をご飯にかけたシンプルながら栄養満点の一品です。消化がよく、朝食やランチにおすすめです。',
      characteristics: ['発酵食品', '食物繊維豊富', '消化良好'],
      sessionId,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      name: '焼きサバの塩おにぎり',
      description: '焼きサバをほぐして塩と混ぜ、海苔で包んだおにぎりです。香ばしさと魚の旨味が広がり、手軽に魚の栄養を摂取できます。',
      characteristics: ['持ち運び便利', 'オメガ3脂肪酸', 'シンプル'],
      sessionId,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      name: 'きのこの炊き込みご飯',
      description: 'しいたけ、まいたけ、えのきなどの複数のきのこを使った風味豊かな炊き込みご飯です。食物繊維が豊富で腹持ちがよく、免疫力アップにも役立ちます。',
      characteristics: ['食物繊維', '低脂肪', 'ビタミンD'],
      sessionId,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      name: '鮭と野菜の蒸し料理',
      description: '鮭と季節の野菜を一緒に蒸した、シンプルながらも素材の味を最大限に引き出した料理です。油をほとんど使わずヘルシーで、タンパク質と野菜をバランスよく摂取できます。',
      characteristics: ['ヘルシー', '高タンパク質', '低糖質'],
      sessionId,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      name: '冷やし中華',
      description: '冷たい麺に彩り豊かな野菜やハム、ゆで卵をトッピングした夏の定番料理です。さっぱりとした酸味のあるタレで和えて食べる、暑い日にぴったりの一品です。',
      characteristics: ['冷製', 'さっぱり', '彩り豊か'],
      sessionId,
      timestamp: Date.now()
    },
    {
      id: uuidv4(),
      name: 'ほうれん草と厚揚げの煮浸し',
      description: 'ほうれん草と厚揚げを和風だしで優しく煮た、栄養価の高い副菜です。鉄分と植物性タンパク質が豊富で、どんな主食にも合わせやすい一品です。',
      characteristics: ['鉄分豊富', '植物性タンパク質', '和風'],
      sessionId,
      timestamp: Date.now()
    }
  ];

  // モックデータからランダムに3つ選択
  const shuffled = [...mockFoodSuggestions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
} 