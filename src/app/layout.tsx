/**
 * 根布局组件
 * 提供全局主题上下文和基础HTML结构
 */

import type { Metadata } from "next";
import "@/styles/globals.css";
import "@/styles/theme.css";

export const metadata: Metadata = {
  title: "智环卫士 - 智能垃圾分类管理平台",
  description: "基于AI和物联网技术的智能垃圾分类管理平台，实现垃圾分类的智能化监控、调度与管理",
  keywords: ["垃圾分类", "智慧环卫", "物联网", "AI识别", "环保"],
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export const dynamic = 'force-dynamic';

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
