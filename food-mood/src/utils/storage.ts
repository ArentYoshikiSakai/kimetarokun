'use client';

import { UserSession, FoodSuggestion } from '../types';

// ローカルストレージのキー
const STORAGE_KEYS = {
  SESSIONS: 'food-mood-sessions',
  SUGGESTIONS: 'food-mood-suggestions'
};

// ローカルストレージが利用可能かどうかチェック
const isLocalStorageAvailable = (): boolean => {
  try {
    if (typeof window === 'undefined') return false;
    
    const testKey = '___test___';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * セッション関連の機能
 */
export const sessionStorage = {
  /**
   * セッションを保存する
   */
  saveSession: (session: UserSession): void => {
    if (!isLocalStorageAvailable()) return;
    
    try {
      // 既存のセッションを取得
      const existingSessions = sessionStorage.getSessions();
      
      // 同じIDのセッションがあれば更新、なければ追加
      const sessionExists = existingSessions.some(s => s.id === session.id);
      const updatedSessions = sessionExists
        ? existingSessions.map(s => s.id === session.id ? session : s)
        : [...existingSessions, session];
      
      // ローカルストレージに保存
      localStorage.setItem(
        STORAGE_KEYS.SESSIONS, 
        JSON.stringify(updatedSessions)
      );
    } catch (error) {
      console.error('Failed to save session to localStorage:', error);
    }
  },
  
  /**
   * 全てのセッションを取得する
   */
  getSessions: (): UserSession[] => {
    if (!isLocalStorageAvailable()) return [];
    
    try {
      const sessions = localStorage.getItem(STORAGE_KEYS.SESSIONS);
      return sessions ? JSON.parse(sessions) : [];
    } catch (error) {
      console.error('Failed to get sessions from localStorage:', error);
      return [];
    }
  },
  
  /**
   * 特定のセッションを取得する
   */
  getSession: (sessionId: string): UserSession | null => {
    if (!isLocalStorageAvailable()) return null;
    
    try {
      const sessions = sessionStorage.getSessions();
      return sessions.find(session => session.id === sessionId) || null;
    } catch (error) {
      console.error('Failed to get session from localStorage:', error);
      return null;
    }
  },
  
  /**
   * セッションを削除する
   */
  deleteSession: (sessionId: string): void => {
    if (!isLocalStorageAvailable()) return;
    
    try {
      const sessions = sessionStorage.getSessions();
      const updatedSessions = sessions.filter(session => session.id !== sessionId);
      
      localStorage.setItem(
        STORAGE_KEYS.SESSIONS, 
        JSON.stringify(updatedSessions)
      );
    } catch (error) {
      console.error('Failed to delete session from localStorage:', error);
    }
  },
  
  /**
   * 全てのセッションを削除する
   */
  clearAllSessions: (): void => {
    if (!isLocalStorageAvailable()) return;
    
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSIONS);
    } catch (error) {
      console.error('Failed to clear sessions from localStorage:', error);
    }
  }
};

/**
 * 食事提案関連の機能
 */
export const suggestionStorage = {
  /**
   * 提案を保存する
   */
  saveSuggestions: (suggestions: FoodSuggestion[]): void => {
    if (!isLocalStorageAvailable() || !suggestions.length) return;
    
    try {
      // 既存の提案を取得
      const existingSuggestions = suggestionStorage.getAllSuggestions();
      
      // セッションIDが同じ提案があれば更新、なければ追加
      const sessionId = suggestions[0].sessionId;
      const filteredSuggestions = existingSuggestions.filter(
        s => s.sessionId !== sessionId
      );
      
      const updatedSuggestions = [...filteredSuggestions, ...suggestions];
      
      // ローカルストレージに保存
      localStorage.setItem(
        STORAGE_KEYS.SUGGESTIONS, 
        JSON.stringify(updatedSuggestions)
      );
    } catch (error) {
      console.error('Failed to save suggestions to localStorage:', error);
    }
  },
  
  /**
   * 全ての提案を取得する
   */
  getAllSuggestions: (): FoodSuggestion[] => {
    if (!isLocalStorageAvailable()) return [];
    
    try {
      const suggestions = localStorage.getItem(STORAGE_KEYS.SUGGESTIONS);
      return suggestions ? JSON.parse(suggestions) : [];
    } catch (error) {
      console.error('Failed to get suggestions from localStorage:', error);
      return [];
    }
  },
  
  /**
   * 特定のセッションの提案を取得する
   */
  getSessionSuggestions: (sessionId: string): FoodSuggestion[] => {
    if (!isLocalStorageAvailable()) return [];
    
    try {
      const suggestions = suggestionStorage.getAllSuggestions();
      return suggestions.filter(suggestion => suggestion.sessionId === sessionId);
    } catch (error) {
      console.error('Failed to get session suggestions from localStorage:', error);
      return [];
    }
  },
  
  /**
   * 特定のセッションの提案を削除する
   */
  deleteSessionSuggestions: (sessionId: string): void => {
    if (!isLocalStorageAvailable()) return;
    
    try {
      const suggestions = suggestionStorage.getAllSuggestions();
      const updatedSuggestions = suggestions.filter(
        suggestion => suggestion.sessionId !== sessionId
      );
      
      localStorage.setItem(
        STORAGE_KEYS.SUGGESTIONS, 
        JSON.stringify(updatedSuggestions)
      );
    } catch (error) {
      console.error('Failed to delete session suggestions from localStorage:', error);
    }
  },
  
  /**
   * 全ての提案を削除する
   */
  clearAllSuggestions: (): void => {
    if (!isLocalStorageAvailable()) return;
    
    try {
      localStorage.removeItem(STORAGE_KEYS.SUGGESTIONS);
    } catch (error) {
      console.error('Failed to clear suggestions from localStorage:', error);
    }
  }
};

/**
 * 履歴関連の機能
 */
export const historyStorage = {
  /**
   * セッションと提案を同時に保存する
   */
  saveSessionAndSuggestions: (session: UserSession, suggestions: FoodSuggestion[]): void => {
    // セッションを保存
    sessionStorage.saveSession(session);
    
    // 提案を保存
    suggestionStorage.saveSuggestions(suggestions);
  },

  /**
   * 全ての履歴を取得する（セッションと提案をマージ）
   */
  getAllHistory: () => {
    if (!isLocalStorageAvailable()) return [];
    
    try {
      const sessions = sessionStorage.getSessions();
      const suggestions = suggestionStorage.getAllSuggestions();
      
      // セッションと提案をマージ
      return sessions.map(session => {
        const sessionSuggestions = suggestions.filter(
          suggestion => suggestion.sessionId === session.id
        );
        
        return {
          session,
          suggestions: sessionSuggestions,
          timestamp: session.timestamp
        };
      })
      // 新しい順にソート
      .sort((a, b) => b.timestamp - a.timestamp);
    } catch (error) {
      console.error('Failed to get history from localStorage:', error);
      return [];
    }
  },
  
  /**
   * 履歴を削除する
   */
  deleteHistory: (sessionId: string): void => {
    if (!isLocalStorageAvailable()) return;
    
    try {
      // セッションと提案の両方を削除
      sessionStorage.deleteSession(sessionId);
      suggestionStorage.deleteSessionSuggestions(sessionId);
    } catch (error) {
      console.error('Failed to delete history from localStorage:', error);
    }
  },
  
  /**
   * 全ての履歴を削除する
   */
  clearAllHistory: (): void => {
    if (!isLocalStorageAvailable()) return;
    
    try {
      // セッションと提案の両方を削除
      sessionStorage.clearAllSessions();
      suggestionStorage.clearAllSuggestions();
    } catch (error) {
      console.error('Failed to clear history from localStorage:', error);
    }
  }
}; 