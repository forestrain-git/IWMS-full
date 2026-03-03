/**
 * @file app/dashboard/page.tsx
 * @description 监管驾驶舱主页面（高端优化版）
 * @module 模块1:监管驾驶舱
 */

"use client";

import { useEffect, useMemo } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useGlobalStore } from "@/store";
import { StrategicLayer } from "./components/StrategicLayer";
import { TacticalLayer } from "./components/TacticalLayer";
import { OperationalLayer } from "./components/OperationalLayer";
import { useDashboardData } from "./hooks/useDashboardData";
import { SPACING, ANIMATION } from "@/lib/design-tokens";

export default function DashboardPage() {
  const { kpi, stations, recentAlerts, vehicles, gasMonitoring, isLoading } = useDashboardData();
  const setCurrentPageTitle = useGlobalStore((state) => state.setCurrentPageTitle);

  useEffect(() => {
    setCurrentPageTitle("监管驾驶舱");
  }, [setCurrentPageTitle]);

  // 优化布局样式
  const containerStyles = useMemo(() => ({
    height: 'calc(100vh - 6rem)',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: SPACING.lg,
    padding: SPACING.md,
    transition: `all ${ANIMATION.duration.normal} ${ANIMATION.easing.ease}`,
  }), []);

  return (
    <MainLayout>
      <div style={containerStyles}>
        {/* 战略层：KPI指标 */}
        <StrategicLayer kpi={kpi} isLoading={isLoading} />

        {/* 战术层：3D场景 + GIS地图 */}
        <TacticalLayer stations={stations} />

        {/* 操作层：三栏面板 */}
        <OperationalLayer 
          vehicles={vehicles}
          gasMonitoring={gasMonitoring}
          alerts={recentAlerts}
        />
      </div>
    </MainLayout>
  );
}
