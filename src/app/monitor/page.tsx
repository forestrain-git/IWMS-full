/**
 * @file page.tsx
 * @description 设备监控模块主页面
 * @provides 3D数字孪生、实时监控、预测性维护、远程控制等功能
 */

"use client";

import { useState, useEffect, Suspense, useMemo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/business/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  Activity, 
  Monitor, 
  Wrench, 
  Settings,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { useGlobalStore } from "@/store";
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, ANIMATION, TYPOGRAPHY } from "@/lib/design-tokens";
import { useEquipmentData } from "./hooks/useEquipmentData";
import { DigitalTwinScene } from "./components/DigitalTwinScene";
import { RealtimeDataPanel } from "./components/RealtimeDataPanel";
import { PredictiveMaintenance } from "./components/PredictiveMaintenance";
import { RemoteControlPanel } from "./components/RemoteControlPanel";
import { SceneControls } from "./components/SceneControls";
import type { EquipmentInfo } from "./types/equipment";

// ==================== 页面组件 ====================

/**
 * 3D场景标签页
 */
function Scene3DTab({ 
  equipments, 
  gasData, 
  selectedEquipmentId, 
  onEquipmentSelect, 
  updateRealtimeData 
}: {
  equipments: EquipmentInfo[];
  gasData: any[];
  selectedEquipmentId: string | null;
  onEquipmentSelect: (id: string | null) => void;
  updateRealtimeData: () => void;
}) {
  const [hoveredEquipment, setHoveredEquipment] = useState<EquipmentInfo | null>(null);
  const [cameraPreset, setCameraPreset] = useState("overview");

  // 样式配置
  const containerStyles = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: SPACING.lg,
    height: '100%',
  }), []);

  const sceneContainerStyles = useMemo(() => ({
    gridColumn: 'span 3 / span 4',
  }), []);

  const controlsContainerStyles = useMemo(() => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: SPACING.md,
  }), []);

  const sceneContentStyles = useMemo(() => ({
    position: 'relative' as const,
    height: '100%',
    minHeight: '600px',
  }), []);

  return (
    <div style={containerStyles}>
      {/* 3D场景主体 */}
      <div style={sceneContainerStyles}>
        <Card style={{ height: '100%' }}>
          <CardContent style={{ padding: 0, height: '100%' }}>
            <div style={sceneContentStyles}>
              <DigitalTwinScene
                equipments={equipments}
                gasData={gasData}
                selectedEquipmentId={selectedEquipmentId}
                onEquipmentSelect={onEquipmentSelect}
                onEquipmentHover={setHoveredEquipment}
                hoveredEquipment={hoveredEquipment}
                updateRealtimeData={updateRealtimeData}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 场景控制面板 */}
      <div style={controlsContainerStyles}>
        <SceneControls
          currentPreset={cameraPreset}
          onPresetChange={setCameraPreset}
          equipments={equipments}
          gasData={gasData}
        />
      </div>
    </div>
  );
}

/**
 * 实时数据标签页
 */
function RealtimeDataTab({ 
  equipments, 
  selectedEquipmentId, 
  onEquipmentSelect 
}: {
  equipments: EquipmentInfo[];
  selectedEquipmentId: string | null;
  onEquipmentSelect: (id: string) => void;
}) {
  const containerStyles = useMemo(() => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: SPACING.lg,
  }), []);

  return (
    <div style={containerStyles}>
      <RealtimeDataPanel
        equipments={equipments}
        selectedEquipmentId={selectedEquipmentId}
        onEquipmentSelect={onEquipmentSelect}
      />
    </div>
  );
}

/**
 * 预测性维护标签页
 */
function PredictiveMaintenanceTab({ 
  equipments, 
  selectedEquipmentId 
}: {
  equipments: EquipmentInfo[];
  selectedEquipmentId: string | null;
}) {
  const containerStyles = useMemo(() => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: SPACING.lg,
  }), []);

  return (
    <div style={containerStyles}>
      <PredictiveMaintenance
        equipments={equipments}
        selectedEquipmentId={selectedEquipmentId}
      />
    </div>
  );
}

/**
 * 远程控制标签页
 */
function RemoteControlTab({ 
  equipments, 
  selectedEquipmentId,
  onStartEquipment,
  onStopEquipment,
  onEmergencyStop,
  onUpdateControlParams
}: {
  equipments: EquipmentInfo[];
  selectedEquipmentId: string | null;
  onStartEquipment: (id: string) => Promise<boolean>;
  onStopEquipment: (id: string) => Promise<boolean>;
  onEmergencyStop: (id: string) => Promise<boolean>;
  onUpdateControlParams: (id: string, params: any) => Promise<boolean>;
}) {
  const containerStyles = useMemo(() => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: SPACING.lg,
  }), []);

  return (
    <div style={containerStyles}>
      <RemoteControlPanel
        equipments={equipments}
        selectedEquipmentId={selectedEquipmentId}
        onStartEquipment={onStartEquipment}
        onStopEquipment={onStopEquipment}
        onEmergencyStop={onEmergencyStop}
        onUpdateControlParams={onUpdateControlParams}
      />
    </div>
  );
}

// ==================== 主页面 ====================

function MonitorPage() {
  const searchParams = useSearchParams();
  const { selectedStationId } = useGlobalStore();
  const [activeTab, setActiveTab] = useState("scene");
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);

  // 从URL参数获取站点ID
  const urlStationId = searchParams?.get("stationId") ?? undefined;
  const targetStationId = urlStationId || selectedStationId;

  // 使用设备数据Hook
  const {
    equipments,
    gasData,
    isLoading,
    lastUpdated,
    selectEquipment,
    updateEquipmentData,
    startEquipment,
    stopEquipment,
    emergencyStop,
    updateControlParams,
    refreshAllData,
    updateRealtimeData,
  } = useEquipmentData(targetStationId || undefined);

  // 处理设备选择
  const handleEquipmentSelect = useCallback((id: string | null) => {
    setSelectedEquipmentId(id);
    selectEquipment(id);
  }, [selectEquipment]);

  // 页面标题更新
  useEffect(() => {
    if (targetStationId) {
      document.title = `设备监控 - 站点${targetStationId.slice(-4)}`;
    } else {
      document.title = "设备监控";
    }
  }, [targetStationId]);

  // 初始化时刷新数据
  useEffect(() => {
    if (targetStationId && equipments.length === 0) {
      refreshAllData();
    }
  }, [targetStationId, equipments.length, refreshAllData]);

  // 获取统计信息
  const statistics = useMemo(() => ({
    total: equipments.length,
    online: equipments.filter(eq => eq.status === "online").length,
    offline: equipments.filter(eq => eq.status === "offline").length,
    error: equipments.filter(eq => eq.status === "error").length,
    critical: equipments.filter(eq => eq.predictiveData.healthScore < 40).length,
  }), [equipments]);

  // 样式配置
  const mainContainerStyles = useMemo(() => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: SPACING.lg,
  }), []);

  const actionsContainerStyles = useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.md,
    fontSize: TYPOGRAPHY.fontSize.sm,
  }), []);

  const statsContainerStyles = useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  }), []);

  const statItemStyles = useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.xs,
  }), []);

  const refreshButtonStyles = useMemo(() => ({
    padding: `${SPACING.xs} ${SPACING.sm}`,
    fontSize: TYPOGRAPHY.fontSize.sm,
    backgroundColor: COLORS.primary[500],
    color: 'white',
    borderRadius: BORDER_RADIUS.md,
    border: 'none',
    cursor: 'pointer',
    transition: `all ${ANIMATION.duration.fast} ${ANIMATION.easing.ease}`,
    '&:hover': {
      backgroundColor: COLORS.primary[600],
    },
    '&:disabled': {
      opacity: 0.7,
      cursor: 'not-allowed',
    }
  }), []);

  const statusCardStyles = useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: SPACING.md,
  }), []);

  const statusInfoStyles = useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  }), []);

  const tabsContainerStyles = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    width: '100%',
  }), []);

  const tabTriggerStyles = useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
  }), []);

  const tabContentStyles = useMemo(() => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: SPACING.md,
  }), []);

  const skeletonContainerStyles = useMemo(() => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: SPACING.md,
    padding: SPACING.lg,
  }), []);

  return (
    <MainLayout>
      <div style={mainContainerStyles}>
        {/* 页面头部 */}
        <PageHeader
          title="设备智能监控中心"
          description={
            targetStationId 
              ? `站点${targetStationId.slice(-4)} - 3D数字孪生与预测性维护`
              : "3D数字孪生与预测性维护系统"
          }
          actions={
            <div style={actionsContainerStyles}>
              {/* 统计信息 */}
              <div style={statsContainerStyles}>
                <div style={statItemStyles}>
                  <Monitor style={{ 
                    width: '16px', 
                    height: '16px', 
                    color: COLORS.neutral[500] 
                  }} />
                  <span>总计: {statistics.total}</span>
                </div>
                <div style={statItemStyles}>
                  <CheckCircle style={{ 
                    width: '16px', 
                    height: '16px', 
                    color: COLORS.status.online 
                  }} />
                  <span>在线: {statistics.online}</span>
                </div>
                <div style={statItemStyles}>
                  <AlertTriangle style={{ 
                    width: '16px', 
                    height: '16px', 
                    color: COLORS.semantic.error 
                  }} />
                  <span>故障: {statistics.error}</span>
                </div>
              </div>
              
              {/* 刷新按钮 */}
              <button
                onClick={refreshAllData}
                style={refreshButtonStyles}
                disabled={isLoading}
              >
                {isLoading ? "刷新中..." : "刷新数据"}
              </button>
            </div>
          }
          breadcrumb={[
            { label: "首页", href: "/dashboard" },
            { label: "设备监控" },
          ]}
        />

        {/* 状态提示 */}
        {targetStationId && (
          <Card>
            <CardContent style={statusCardStyles}>
              <div style={statusInfoStyles}>
                <Activity style={{ 
                  width: '20px', 
                  height: '20px', 
                  color: COLORS.primary[500] 
                }} />
                <span style={{
                  fontSize: TYPOGRAPHY.fontSize.sm,
                  fontWeight: TYPOGRAPHY.fontWeight.medium
                }}>
                  正在监控站点{targetStationId.slice(-4)}
                </span>
                {lastUpdated && (
                  <span style={{
                    fontSize: TYPOGRAPHY.fontSize.xs,
                    color: COLORS.neutral[500]
                  }}>
                    (更新时间: {lastUpdated.toLocaleTimeString()})
                  </span>
                )}
              </div>
              {statistics.critical > 0 && (
                <Badge style={{
                  backgroundColor: `${COLORS.semantic.error}20`,
                  color: COLORS.semantic.error
                }}>
                  {statistics.critical} 个设备需要紧急关注
                </Badge>
              )}
            </CardContent>
          </Card>
        )}

        {/* 主要内容区域 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} style={tabContentStyles}>
          <TabsList style={tabsContainerStyles}>
            <TabsTrigger value="scene" style={tabTriggerStyles}>
              <Monitor style={{ width: '16px', height: '16px' }} />
              <span>3D场景</span>
            </TabsTrigger>
            <TabsTrigger value="realtime" style={tabTriggerStyles}>
              <Activity style={{ width: '16px', height: '16px' }} />
              <span>实时数据</span>
            </TabsTrigger>
            <TabsTrigger value="maintenance" style={tabTriggerStyles}>
              <Wrench style={{ width: '16px', height: '16px' }} />
              <span>预测维护</span>
            </TabsTrigger>
            <TabsTrigger value="control" style={tabTriggerStyles}>
              <Settings style={{ width: '16px', height: '16px' }} />
              <span>远程控制</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scene" style={tabContentStyles}>
            {isLoading ? (
              <Card>
                <CardContent style={skeletonContainerStyles}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-96 w-full" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Scene3DTab
                equipments={equipments}
                gasData={gasData}
                selectedEquipmentId={selectedEquipmentId}
                onEquipmentSelect={handleEquipmentSelect}
                updateRealtimeData={updateRealtimeData}
              />
            )}
          </TabsContent>

          <TabsContent value="realtime" style={tabContentStyles}>
            {isLoading ? (
              <Card>
                <CardContent style={skeletonContainerStyles}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
                    <Skeleton className="h-8 w-full" />
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: SPACING.md }}>
                      <Skeleton className="h-32 w-full" />
                      <Skeleton className="h-32 w-full" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <RealtimeDataTab
                equipments={equipments}
                selectedEquipmentId={selectedEquipmentId}
                onEquipmentSelect={handleEquipmentSelect}
              />
            )}
          </TabsContent>

          <TabsContent value="maintenance" style={tabContentStyles}>
            {isLoading ? (
              <Card>
                <CardContent style={skeletonContainerStyles}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <PredictiveMaintenanceTab
                equipments={equipments}
                selectedEquipmentId={selectedEquipmentId}
              />
            )}
          </TabsContent>

          <TabsContent value="control" style={tabContentStyles}>
            {isLoading ? (
              <Card>
                <CardContent style={skeletonContainerStyles}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
                    <Skeleton className="h-8 w-full" />
                    <Skeleton className="h-32 w-full" />
                  </div>
                </CardContent>
              </Card>
            ) : (
              <RemoteControlTab
                equipments={equipments}
                selectedEquipmentId={selectedEquipmentId}
                onStartEquipment={startEquipment}
                onStopEquipment={stopEquipment}
                onEmergencyStop={emergencyStop}
                onUpdateControlParams={updateControlParams}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

// 包装组件以处理Suspense
function MonitorPageWithSuspense() {
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
      <MonitorPage />
    </Suspense>
  );
}

export default MonitorPageWithSuspense;
