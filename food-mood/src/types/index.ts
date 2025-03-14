// 質問のインターフェース
export interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  nextQuestionId?: string | Record<string, string>;
}

// ユーザーの回答のインターフェース
export interface UserAnswer {
  questionId: string;
  selectedOptionId: string;
  selectedOptionText: string;
}

// ユーザーセッションのインターフェース
export interface UserSession {
  id: string;
  timestamp: number;
  answers: UserAnswer[];
}

// 食事提案のインターフェース
export interface FoodSuggestion {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  sessionId: string;
  timestamp: number;
} 