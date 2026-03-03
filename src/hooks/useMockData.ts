/**
 * Mock数据Hook
 * 用于获取和管理Mock数据
 */

"use client";

import { useEffect, useCallback } from "react";
import { useMockDataStore, useAlertStore } from "@/store";

/**
 * Mock数据Hook
 * 初始化数据并提供刷新方法
 */
export function useMockData() {
  const {
    stations,
    devices,
    alerts,
    tasks,
    aiRecognitions,
    kpiData,
    isLoading,
    lastUpdated,
    refreshData,
    refreshStations,
    refreshAlerts,
    refreshKPIData,
  } = useMockDataStore();

  const { updateUnreadCount } = useAlertStore();

  // 初始化数据
  useEffect(() => {
    if (stations.length === 0) {
      refreshData();
    }
  }, [stations.length, refreshData]);

  // 更新未读告警数量
  useEffect(() => {
    const pendingCount = alerts.filter((a) => a.status === "pending").length;
    updateUnreadCount(pendingCount);
  }, [alerts, updateUnreadCount]);

  /**
   * 获取站点统计数据
   */
  const getStationStats = useCallback(() => {
    const total = stations.length;
    const online = stations.filter((s) => s.status === "online").length;
    const offline = stations.filter((s) => s.status === "offline").length;
    const warning = stations.filter((s) => s.status === "warning").length;
    const danger = stations.filter((s) => s.status === "danger").length;

    return {
      total,
      online,
      offline,
      warning,
      danger,
      onlineRate: total > 0 ? (online / total) * 100 : 0,
    };
  }, [stations]);

  /**
   * 获取告警统计数据
   */
  const getAlertStats = useCallback(() => {
    const total = alerts.length;
    const pending = alerts.filter((a) => a.status === "pending").length;
    const processing = alerts.filter((a) => a.status === "processing").length;
    const resolved = alerts.filter((a) => a.status === "resolved").length;

    const critical = alerts.filter((a) => a.level === "critical").length;
    const high = alerts.filter((a) => a.level === "high").length;

    return {
      total,
      pending,
      processing,
      resolved,
      critical,
      high,
    };
  }, [alerts]);

  return {
    // 数据
    stations,
    devices,
    alerts,
    tasks,
    aiRecognitions,
    kpiData,

    // 状态
    isLoading,
    lastUpdated,

    // 方法
    refreshData,
    refreshStations,
    refreshAlerts,
    refreshKPIData,

    // 统计数据
    stationStats: getStationStats(),
    alertStats: getAlertStats(),
  };
}

export default useMockData;
