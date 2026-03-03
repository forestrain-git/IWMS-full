/**
 * @file app/stations/page.tsx
 * @description 站点管理主页面（全屏地图版）
 * @module 模块2:站点管理
 */

"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import { useGlobalStore } from "@/store";
import { debounce } from "@/lib/utils";
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, ANIMATION, TYPOGRAPHY } from "@/lib/design-tokens";
import { DiscoveryBar } from "./components/DiscoveryBar";
import { GISMapView } from "./components/GISMapView";
import { StationListView } from "./components/StationListView";
import StationDetailDrawer from "./components/StationDetailDrawer";
import { QuickActionBar } from "./components/QuickActionBar";
import { useStationData } from "./hooks/useStationData";
import type { Station } from "./types/station";

type ViewMode = "map" | "list";
type CardMode = "compact" | "detailed";

function StationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // 全局状态
  const { selectedStationId, setSelectedStationId, setCurrentPageTitle } = useGlobalStore();

  // 本地状态
  const [viewMode, setViewMode] = useState<ViewMode>("map");
  const [cardMode, setCardMode] = useState<CardMode>("compact");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  // 设置页面标题
  useEffect(() => {
    setCurrentPageTitle("站点管理");
  }, [setCurrentPageTitle]);

  // 站点数据与选择逻辑
  const { stations: filteredStations, selectedStation } = useStationData(
    searchQuery,
    selectedStatuses
  );

  // 从URL参数同步（模块1跳转过来）
  useEffect(() => {
    const idFromUrl = searchParams.get("id");
    if (idFromUrl && idFromUrl !== selectedStationId) {
      setSelectedStationId(idFromUrl);
    }
  }, [searchParams, selectedStationId, setSelectedStationId]);

  // 监听selectedStationId变化，打开/关闭抽屉
  useEffect(() => {
    if (selectedStationId) {
      router.replace(`/stations?id=${selectedStationId}`, { scroll: false });
    } else {
      router.replace("/stations", { scroll: false });
    }
  }, [selectedStationId, router]);

  // 选择站点
  const handleStationSelect = useCallback((station: Station | null) => {
    if (station) {
      setSelectedStationId(station.id);
    } else {
      setSelectedStationId(null);
    }
  }, [setSelectedStationId]);

  // 关闭抽屉
  const handleDrawerClose = useCallback(() => {
    setSelectedStationId(null);
  }, [setSelectedStationId]);

  // 搜索（防抖）
  const handleSearchChange = useMemo(
    () => debounce(((query: string) => {
      setSearchQuery(query);
    }) as any, 300),
    []
  );

  // 状态筛选
  const handleStatusFilterChange = useCallback((statuses: string[]) => {
    setSelectedStatuses(statuses);
  }, []);

  // 样式配置
  const mapContainerStyles = useMemo(() => ({
    position: 'fixed' as const,
    inset: '64px 0 0 64px',
  }), []);

  const floatingNavStyles = useMemo(() => ({
    position: 'absolute' as const,
    top: SPACING.md,
    left: SPACING.md,
    right: SPACING.md,
    zIndex: 20,
  }), []);

  const contentContainerStyles = useMemo(() => ({
    width: '100%',
    height: '100%',
  }), []);

  const listContainerStyles = useMemo(() => ({
    height: '100%',
    padding: SPACING.md,
    paddingTop: '96px',
    overflow: 'auto',
  }), []);

  return (
    <MainLayout>
      {/* 全屏地图容器 */}
      <div style={mapContainerStyles}>
        {/* 悬浮导航栏 */}
        <div style={floatingNavStyles}>
          <DiscoveryBar
            viewMode={viewMode}
            cardMode={cardMode}
            onViewModeChange={setViewMode}
            onCardModeChange={setCardMode}
            onSearchChange={handleSearchChange}
            onStatusFilterChange={handleStatusFilterChange}
            selectedStatuses={selectedStatuses}
            totalCount={filteredStations.length}
          />
        </div>

        {/* 地图/列表内容 */}
        <div style={contentContainerStyles}>
          {viewMode === "map" ? (
            <GISMapView 
              stations={filteredStations} 
              onStationSelect={handleStationSelect}
            />
          ) : (
            <div style={listContainerStyles}>
              <StationListView 
                stations={filteredStations} 
                onStationSelect={handleStationSelect}
                cardMode={cardMode}
              />
            </div>
          )}
        </div>
      </div>

      {/* 详情抽屉 */}
      <StationDetailDrawer
        station={selectedStation}
        isOpen={!!selectedStationId}
        onClose={handleDrawerClose}
      />
      <QuickActionBar stationId={selectedStation?.id} />
    </MainLayout>
  );
}

// 包装组件以处理Suspense
function StationsPageWithSuspense() {
  const loadingStyles = useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    fontSize: TYPOGRAPHY.fontSize.lg,
    color: COLORS.neutral[500],
    backgroundColor: COLORS.neutral[100],
  }), []);

  return (
    <Suspense fallback={<div style={loadingStyles}>Loading...</div>}>
      <StationsPage />
    </Suspense>
  );
}

export default StationsPageWithSuspense;
