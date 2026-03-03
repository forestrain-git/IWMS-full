/**
 * @file page.tsx
 * @description 智能调度与路径优化中心主页面
 * @integrates 所有调度模块组件
 */

"use client";

import { useState, useEffect, Suspense, useMemo, useCallback } from "react";
import { useParams } from "next/navigation";
import MainLayout from "@/components/layout/MainLayout";
import PageHeader from "@/components/business/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, ANIMATION, TYPOGRAPHY } from "@/lib/design-tokens";
import { useGlobalStore } from "@/store";
import { useDispatchData } from "./hooks/useDispatchData";
import { useRouteOptimization } from "./hooks/useRouteOptimization";
import { AIRecommendationBar } from "./components/AIRecommendationBar";
import { DispatchMap } from "./components/DispatchMap";
import { VehicleCard } from "./components/VehicleCard";
import { TaskPanel } from "./components/TaskPanel";
import { RouteOptimizer } from "./components/RouteOptimizer";
import { OptimizationResult } from "./components/OptimizationResult";
import { SmartScheduling } from "./components/SmartScheduling";
import { EmergencyDispatch } from "./components/EmergencyDispatch";
import { VoiceDispatch } from "./components/VoiceDispatch";
import { VideoConference } from "./components/VideoConference";
import type { VehicleStatus, TaskStatus, OptimizationTarget } from "./types/dispatch";

function DispatchPage() {
  const params = useParams();
  const { selectedStationId } = useGlobalStore();
  
  // 获取URL参数中的站点ID，优先使用URL参数
  const targetStationId = params.stationId as string || selectedStationId || undefined;
  
  // 使用调度数据Hook
  const {
    vehicles,
    tasks,
    aiRecommendations,
    emergencyEvents,
    staffSchedules,
    vehicleSchedules,
    isLoading,
    lastUpdated,
    selectVehicle,
    selectTask,
    updateVehicleStatus,
    updateTaskStatus,
    assignTask,
    applyAIRecommendation,
    activateEmergencyPlan,
    refreshData,
  } = useDispatchData(targetStationId);
  
  // 使用路径优化Hook
  const {
    optimizationResult,
    isOptimizing,
    optimizationProgress,
    startOptimization,
    stopOptimization,
    applyOptimization,
  } = useRouteOptimization();
  
  // 本地状态
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedVehicleIds, setSelectedVehicleIds] = useState<string[]>([]);
  const [selectedTaskIds, setSelectedTaskIds] = useState<string[]>([]);
  const [optimizationTarget, setOptimizationTarget] = useState<OptimizationTarget>("distance");
  const [activeTab, setActiveTab] = useState("overview");

  // 处理车辆选择
  const handleVehicleSelect = useCallback((vehicleId: string | null) => {
    setSelectedVehicleId(vehicleId);
    selectVehicle(vehicleId);
  }, [selectVehicle]);

  // 处理任务选择
  const handleTaskSelect = useCallback((taskId: string | null) => {
    setSelectedTaskId(taskId);
    selectTask(taskId);
  }, [selectTask]);

  // 处理批量车辆选择
  const handleVehicleSelectionChange = useCallback((vehicleIds: string[]) => {
    setSelectedVehicleIds(vehicleIds);
  }, []);

  // 处理批量任务选择
  const handleTaskSelectionChange = useCallback((taskIds: string[]) => {
    setSelectedTaskIds(taskIds);
  }, []);

  // 开始优化
  const handleStartOptimization = useCallback(() => {
    startOptimization(optimizationTarget, selectedVehicleIds, selectedTaskIds);
  }, [startOptimization, optimizationTarget, selectedVehicleIds, selectedTaskIds]);

  // 应用优化结果
  const handleApplyOptimization = useCallback((resultId: string) => {
    applyOptimization(resultId);
  }, [applyOptimization]);

  // 处理语音调度
  const handleVoiceDispatch = useCallback((vehicleIds: string[]) => {
    console.log("Voice dispatch to vehicles:", vehicleIds);
  }, []);

  // 处理视频会议
  const handleVideoConference = useCallback((vehicleIds: string[]) => {
    console.log("Video conference with vehicles:", vehicleIds);
  }, []);

  // 处理应急事件
  const handleUpdateEventStatus = useCallback((eventId: string, status: "pending" | "responding" | "resolved") => {
    console.log("Update event status:", eventId, status);
  }, []);

  const handleDispatchVehicles = useCallback((eventId: string, vehicleIds: string[]) => {
    console.log("Dispatch vehicles for event:", eventId, vehicleIds);
  }, []);

  // 处理排班编辑
  const handleEditSchedule = useCallback((type: "staff" | "vehicle", id: string) => {
    console.log("Edit schedule:", type, id);
  }, []);

  // 统计数据
  const statistics = useMemo(() => ({
    vehicles: {
      total: vehicles.length,
      idle: vehicles.filter(v => v.status === "idle").length,
      enRoute: vehicles.filter(v => v.status === "en_route").length,
      working: vehicles.filter(v => ["loading", "unloading"].includes(v.status)).length,
      maintenance: vehicles.filter(v => v.status === "maintenance").length,
    },
    tasks: {
      total: tasks.length,
      pending: tasks.filter(t => t.status === "pending").length,
      assigned: tasks.filter(t => t.status === "assigned").length,
      inProgress: tasks.filter(t => t.status === "in_progress").length,
      completed: tasks.filter(t => t.status === "completed").length,
    },
    emergencies: {
      total: emergencyEvents.length,
      pending: emergencyEvents.filter(e => e.responseStatus === "pending").length,
      responding: emergencyEvents.filter(e => e.responseStatus === "responding").length,
      resolved: emergencyEvents.filter(e => e.responseStatus === "resolved").length,
    },
    ai: {
      pending: aiRecommendations.filter(r => !r.applied).length,
      applied: aiRecommendations.filter(r => r.applied).length,
    },
  }), [vehicles, tasks, emergencyEvents, aiRecommendations]);

  // 样式配置
  const tabContentStyles = useMemo(() => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: SPACING.lg,
  }), []);

  const tabsContainerStyles = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    width: '100%',
    gap: SPACING.sm,
  }), []);

  const tabTriggerStyles = useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.sm,
  }), []);

  return (
    <MainLayout>
      <div>
        {/* AI推荐栏 */}
        <AIRecommendationBar
          recommendations={aiRecommendations}
          onApply={applyAIRecommendation}
        />

        {/* 主要内容区域 */}
        <Tabs value={activeTab} onValueChange={setActiveTab} style={tabContentStyles}>
          <TabsList style={tabsContainerStyles}>
            <TabsTrigger value="overview" style={tabTriggerStyles}>
              总览
            </TabsTrigger>
            <TabsTrigger value="vehicles" style={tabTriggerStyles}>
              车辆
            </TabsTrigger>
            <TabsTrigger value="tasks" style={tabTriggerStyles}>
              任务
            </TabsTrigger>
            <TabsTrigger value="optimization" style={tabTriggerStyles}>
              路径优化
            </TabsTrigger>
            <TabsTrigger value="scheduling" style={tabTriggerStyles}>
              智能排班
            </TabsTrigger>
            <TabsTrigger value="emergency" style={tabTriggerStyles}>
              应急调度
            </TabsTrigger>
            <TabsTrigger value="voice" style={tabTriggerStyles}>
              语音调度
            </TabsTrigger>
            <TabsTrigger value="video" style={tabTriggerStyles}>
              视频会议
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" style={tabContentStyles}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: SPACING.lg }}>
              <DispatchMap
                vehicles={vehicles}
                tasks={tasks}
                selectedVehicleId={selectedVehicleId}
                selectedTaskId={selectedTaskId}
                onVehicleSelect={handleVehicleSelect}
                onTaskSelect={handleTaskSelect}
              />
              <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.lg }}>
                <VehicleCard
                  vehicles={vehicles.slice(0, 3)}
                  selectedIds={selectedVehicleIds}
                  onSelectionChange={handleVehicleSelectionChange}
                />
                <TaskPanel
                  tasks={tasks.slice(0, 5)}
                  selectedIds={selectedTaskIds}
                  onSelectionChange={handleTaskSelectionChange}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="vehicles" style={tabContentStyles}>
            <VehicleCard
              vehicles={vehicles}
              selectedIds={selectedVehicleIds}
              onSelectionChange={handleVehicleSelectionChange}
            />
          </TabsContent>

          <TabsContent value="tasks" style={tabContentStyles}>
            <TaskPanel
              tasks={tasks}
              selectedIds={selectedTaskIds}
              onSelectionChange={handleTaskSelectionChange}
            />
          </TabsContent>

          <TabsContent value="optimization" style={tabContentStyles}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: SPACING.lg }}>
              <RouteOptimizer
                vehicles={vehicles}
                tasks={tasks}
                selectedVehicleIds={selectedVehicleIds}
                selectedTaskIds={selectedTaskIds}
                optimizationTarget={optimizationTarget}
                onTargetChange={setOptimizationTarget}
                onStartOptimization={handleStartOptimization}
                onStopOptimization={stopOptimization}
                isOptimizing={isOptimizing}
                progress={optimizationProgress}
              />
              <OptimizationResult
                result={optimizationResult}
                onApply={handleApplyOptimization}
              />
            </div>
          </TabsContent>

          <TabsContent value="scheduling" style={tabContentStyles}>
            <SmartScheduling
              staffSchedules={staffSchedules}
              vehicleSchedules={vehicleSchedules}
              onEdit={handleEditSchedule}
            />
          </TabsContent>

          <TabsContent value="emergency" style={tabContentStyles}>
            <EmergencyDispatch
              events={emergencyEvents}
              vehicles={vehicles}
              onUpdateStatus={handleUpdateEventStatus}
              onDispatchVehicles={handleDispatchVehicles}
              onActivatePlan={activateEmergencyPlan}
            />
          </TabsContent>

          <TabsContent value="voice" style={tabContentStyles}>
            <VoiceDispatch
              vehicles={vehicles}
              selectedIds={selectedVehicleIds}
              onSelectionChange={handleVehicleSelectionChange}
              onDispatch={handleVoiceDispatch}
            />
          </TabsContent>

          <TabsContent value="video" style={tabContentStyles}>
            <VideoConference
              vehicles={vehicles}
              selectedIds={selectedVehicleIds}
              onSelectionChange={handleVehicleSelectionChange}
              onStartConference={handleVideoConference}
            />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}

// 包装组件以处理Suspense
function DispatchPageWithSuspense() {
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
      <DispatchPage />
    </Suspense>
  );
}

export default DispatchPageWithSuspense;
