/**
 * @file app/dashboard/page.tsx
 * @description 监管驾驶舱主页面（高端优化版）
 * @module 模块1:监管驾驶舱
 */

"use client";

import React, { useEffect, useMemo } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useGlobalStore } from "@/store";
import { useHydration } from "@/hooks/useHydration";
import { SPACING, ANIMATION } from "@/lib/design-tokens";

export default function DashboardPage() {
  const setCurrentPageTitle = useGlobalStore((state) => state.setCurrentPageTitle);
  const isHydrated = useHydration();

  // 优化布局样式 - 移到顶部，确保在所有条件返回之前
  const containerStyles = useMemo(() => ({
    height: 'calc(100vh - 6rem)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: SPACING.lg,
    padding: SPACING.md,
    transition: `all ${ANIMATION.duration.normal} ${ANIMATION.easing.ease}`,
  }), []);

  useEffect(() => {
    if (isHydrated) {
      setCurrentPageTitle("监管驾驶舱");
    }
  }, [setCurrentPageTitle, isHydrated]);

  // 在hydration完成前显示加载状态
  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-600">加载中...</div>
      </div>
    );
  }

  return (
    <MainLayout>
      <div style={containerStyles}>
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-800">监管驾驶舱</h1>
          <p className="text-gray-600 mt-2">系统运行正常，所有模块已加载</p>
        </div>
      </div>
    </MainLayout>
  );
}
