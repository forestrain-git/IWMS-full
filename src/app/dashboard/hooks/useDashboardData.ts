/**
 * @file app/dashboard/hooks/useDashboardData.ts
 * @description 驾驶舱数据聚合Hook
 * @module 模块1:监管驾驶舱
 */

import { useState, useEffect, useCallback, useMemo } from "react";
import { useMockDataStore } from "@/store";
import {
  generateKPIData,
  generateStations,
  generateAlerts,
} from "@/lib/mockGenerators";
import { randomElement, randomInt, randomFloat } from "@/lib/utils";
import type {
  DashboardKPI,
  Vehicle,
  GasMonitoring,
  DashboardData,
} from "../types/dashboard";

/**
 * 生成Mock车辆数据
 */
function generateVehicles(): Vehicle[] {
  const statuses: Vehicle["status"][] = ["idle", "loading", "transporting", "maintenance"];
  const locations = ["阳光花园回收站", "翠竹雅苑回收站", "金域名都回收站", "碧海新城回收站", "星河家园回收站"];
  
  return Array.from({ length: 5 }, (_, i) => ({
    id: `vehicle_${i + 1}`,
    plateNumber: `京A${randomInt(10000, 99999)}`,
    status: randomElement(statuses),
    location: randomElement(locations),
    task: Math.random() > 0.5 ? "垃圾清运" : undefined,
    lastUpdate: new Date(Date.now() - randomInt(1, 60) * 60000).toISOString(),
  }));
}

/**
 * 生成气体监测数据
 */
function generateGasMonitoring(): GasMonitoring {
  return {
    nh3: randomFloat(0.1, 2.0, 2),
    h2s: randomFloat(0.01, 0.5, 3),
    ch4: randomFloat(0.5, 5.0, 2),
    pm25: randomInt(15, 80),
    timestamp: new Date().toISOString(),
  };
}

/**
 * 驾驶舱数据聚合Hook
 * @returns 驾驶舱数据及刷新方法
 */
export function useDashboardData(): DashboardData & { refresh: () => void } {
  // 从全局store读取
  const globalStations = useMockDataStore((state) => state.stations);
  
  // 本地状态
  const [kpi, setKpi] = useState<DashboardKPI>(() => generateKPIData());
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [gasMonitoring, setGasMonitoring] = useState<GasMonitoring>(() => generateGasMonitoring());
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // 刷新数据
  const refresh = useCallback(() => {
    setIsLoading(true);
    
    // 模拟API调用
    setTimeout(() => {
      setKpi(generateKPIData());
      setVehicles(generateVehicles());
      setGasMonitoring(generateGasMonitoring());
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 500);
  }, []);

  // 初始加载
  useEffect(() => {
    refresh();
  }, [refresh]);

  // KPI每30秒自动刷新
  useEffect(() => {
    // 暂时注释掉定时器，避免热更新死循环
    // const interval = setInterval(() => {
    //   setKpi(generateKPIData());
    //   setLastUpdated(new Date());
    // }, 30000);
    
    // return () => clearInterval(interval);
  }, []);

  // 使用全局站点或生成Mock站点
  const stations = useMemo(() => {
    return globalStations.length > 0 ? globalStations : generateStations(30);
  }, [globalStations]);

  // 获取最近5条告警
  const recentAlerts = useMemo(() => {
    return generateAlerts(5, stations);
  }, [stations]);

  return {
    kpi,
    stations,
    recentAlerts,
    vehicles,
    gasMonitoring,
    isLoading,
    lastUpdated,
    refresh,
  };
}

export default useDashboardData;
