import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppProvider } from '@/contexts/AppContext';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FoodMood - 食べたいもの発見アプリ",
  description: "あなたの気分に合わせた食事を提案します",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <AppProvider>
          {children}
        </AppProvider>
      </body>
    </html>
  );
}
