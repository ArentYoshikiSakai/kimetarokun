'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

// Layoutコンポーネントのプロパティ定義
export interface LayoutProps {
  children: React.ReactNode;
  showNavigation?: boolean;
  showFooter?: boolean;
  className?: string;
}

/**
 * 共通のLayoutコンポーネント
 * アプリケーション全体のレイアウト構造を提供します
 */
export const Layout: React.FC<LayoutProps> = ({
  children,
  showNavigation = true,
  showFooter = true,
  className = '',
}) => {
  const pathname = usePathname();

  // ナビゲーションリンクの定義
  const navLinks = [
    { href: '/', label: 'ホーム' },
    { href: '/question', label: '質問' },
    { href: '/history', label: '履歴' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* ヘッダー/ナビゲーション */}
      {showNavigation && (
        <header className="bg-white shadow-sm">
          <div className="container mx-auto px-4 py-3">
            <div className="flex justify-between items-center">
              {/* ロゴ/タイトル */}
              <Link href="/" className="text-xl font-bold text-primary-600">
                FoodMood
              </Link>

              {/* ナビゲーションリンク */}
              <nav className="hidden sm:flex space-x-4">
                {navLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`px-3 py-2 rounded-md text-sm font-medium transition-colors
                        ${
                          isActive
                            ? 'text-primary-600 bg-primary-50'
                            : 'text-gray-600 hover:text-primary-600 hover:bg-gray-100'
                        }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>

              {/* モバイルメニューアイコン (簡略化) */}
              <div className="sm:hidden">
                <button
                  type="button"
                  className="text-gray-600 hover:text-gray-900"
                  aria-label="メニューを開く"
                >
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* メインコンテンツ */}
      <main className={`flex-grow ${className}`}>{children}</main>

      {/* フッター */}
      {showFooter && (
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
            <p>© {new Date().getFullYear()} FoodMood. All rights reserved.</p>
          </div>
        </footer>
      )}
    </div>
  );
}; 