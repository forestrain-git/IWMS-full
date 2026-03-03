/**
 * @file useEquipmentData.ts
 * @description 设备数据模拟Hook
 * @provides 设备实时数据、预测性维护、远程控制等功能
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useGlobalStore } from "@/store";
import { generateId, randomInt, randomFloat } from "@/lib/utils";
import type {
  EquipmentInfo,
  EquipmentRealtimeData,
  PredictiveMaintenanceData,
  EquipmentControlParams,
  EquipmentOperation,
  GasData,
  UseEquipmentDataReturn,
  Equipment3DType,
} from "../types/equipment";

// ==================== 数据生成函数 ====================

/**
 * 生成实时设备数据
 */
function generateRealtimeData(): EquipmentRealtimeData {
  return {
    pressure: randomFloat(10, 20, 1),
    temperature: randomFloat(30, 80, 1),
    vibration: randomFloat(0, 5, 1),
    current: randomFloat(10, 50, 1),
    power: randomFloat(5, 30, 1),
    speed: randomInt(1000, 3000),
  };
}

/**
 * 生成预测性维护数据
 */
function generatePredictiveData(): PredictiveMaintenanceData {
  const healthScore = randomInt(40, 100);
  const now = new Date();
  
  // 生成历史健康趋势（最近30天）
  const healthTrend = Array.from({ length: 30 }, (_, i) => {
    const date = new Date(now);
    date.setDate(date.getDate() - (29 - i));
    return {
      timestamp: date,
      score: Math.max(30, healthScore + randomInt(-10, 10)),
    };
  });

  // 生成故障预测
  const faultPredictions = [];
  if (healthScore < 60) {
    faultPredictions.push({
      type: "轴承磨损",
      probability: randomInt(60, 90),
      estimatedTime: new Date(now.getTime() + randomInt(7, 30) * 24 * 60 * 60 * 1000),
      severity: healthScore < 40 ? "critical" as const : "high" as const,
    });
  }

  return {
    healthScore,
    failureProbability: Math.max(0, 100 - healthScore),
    remainingLife: Math.floor(healthScore * 24), // 小时
    nextMaintenance: new Date(now.getTime() + randomInt(1, 30) * 24 * 60 * 60 * 1000),
    maintenanceSuggestions: [
      healthScore < 40 ? "立即停机检修" : "定期检查润滑系统",
      healthScore < 60 ? "更换易损件" : "清洁设备表面",
      "校准传感器精度",
    ],
    healthTrend,
    faultPredictions,
  };
}

/**
 * 生成控制参数
 */
function generateControlParams(): EquipmentControlParams {
  return {
    pressureThreshold: randomFloat(15, 18, 1),
    temperatureThreshold: randomFloat(60, 75, 1),
    vibrationThreshold: randomFloat(3, 4, 1),
    autoControl: Math.random() > 0.5,
    operationMode: randomInt(0, 2) === 0 ? "manual" : "auto",
  };
}

/**
 * 生成单个设备信息
 */
function generateEquipment(
  type: Equipment3DType,
  stationId: string,
  stationName: string,
  index: number
): EquipmentInfo {
  const status = randomInt(0, 10) < 7 ? "online" : 
                 randomInt(0, 10) < 5 ? "offline" : "error";
  
  // 根据设备类型设置3D位置
  const positions: Record<Equipment3DType, [number, number, number]> = {
    compressor: [index * 4 - 8, 1.5, 0],
    crane: [index * 3 - 6, 2, 5],
    deodorizer: [index * 2.5 - 5, 1, -5],
    scale: [0, 0.25, -8],
    conveyor: [index * 2 - 4, 0.15, 3],
  };

  return {
    id: generateId("equipment"),
    name: `${stationName}-${type}-${index + 1}`,
    type,
    stationId,
    stationName,
    status,
    
    transform: {
      position: positions[type],
      rotation: [0, randomInt(0, 360) * Math.PI / 180, 0],
      scale: [1, 1, 1],
    },
    meshType: type === "deodorizer" ? "cylinder" : "box",
    color: "#3b82f6",
    isAnimated: type !== "scale",
    
    realtimeData: generateRealtimeData(),
    predictiveData: generatePredictiveData(),
    controlParams: generateControlParams(),
    operations: [],
    
    model: `${type.toUpperCase()}-${randomInt(1000, 9999)}`,
    manufacturer: "智能设备有限公司",
    installDate: new Date(Date.now() - randomInt(30, 365) * 24 * 60 * 60 * 1000),
    lastMaintenance: new Date(Date.now() - randomInt(1, 30) * 24 * 60 * 60 * 1000),
    firmwareVersion: `v${randomInt(1, 3)}.${randomInt(0, 9)}.${randomInt(0, 9)}`,
  };
}

/**
 * 生成气体数据
 */
function generateGasData(): GasData[] {
  return Array.from({ length: 5 }, (_, i) => ({
    nh3: randomFloat(5, 80, 1),
    h2s: randomFloat(2, 30, 1),
    windDirection: randomInt(0, 360),
    windSpeed: randomFloat(0.5, 5, 1),
    position: [
      randomInt(-10, 10),
      randomInt(1, 5),
      randomInt(-10, 10),
    ] as [number, number, number],
  }));
}

// ==================== 主Hook ====================

/**
 * 设备数据管理Hook
 */
export function useEquipmentData(stationId?: string): UseEquipmentDataReturn {
  const { selectedStationId } = useGlobalStore();
  const targetStationId = stationId || selectedStationId;
  
  const [equipments, setEquipments] = useState<EquipmentInfo[]>([]);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<string | null>(null);
  const [gasData, setGasData] = useState<GasData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  
  const updateIntervalRef = useRef<NodeJS.Timeout>();
  const frameCountRef = useRef(0);

  // 初始化设备数据
  const initializeEquipments = useCallback(() => {
    if (!targetStationId) return;
    
    setIsLoading(true);
    
    const equipmentTypes: Equipment3DType[] = [
      "compressor", "compressor", "crane", "deodorizer", "scale", "conveyor"
    ];
    
    const newEquipments = equipmentTypes.map((type, index) =>
      generateEquipment(type, targetStationId, `站点${targetStationId.slice(-4)}`, index)
    );
    
    setEquipments(newEquipments);
    setGasData(generateGasData());
    setLastUpdated(new Date());
    setIsLoading(false);
  }, [targetStationId]);

  // 更新单个设备数据
  const updateEquipmentData = useCallback((id: string) => {
    setEquipments(prev => prev.map(eq => {
      if (eq.id === id) {
        return {
          ...eq,
          realtimeData: generateRealtimeData(),
        };
      }
      return eq;
    }));
    setLastUpdated(new Date());
  }, []);

  // 模拟设备控制操作
  const performEquipmentOperation = useCallback(async (
    id: string,
    operation: "start" | "stop" | "emergency_stop",
    description: string
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setEquipments(prev => prev.map(eq => {
          if (eq.id === id) {
            const newStatus = operation === "emergency_stop" ? "error" :
                            operation === "start" ? "online" : "offline";
            
            const newOperation: EquipmentOperation = {
              id: generateId("operation"),
              timestamp: new Date(),
              operator: "当前用户",
              operation,
              result: "success",
              description,
            };
            
            return {
              ...eq,
              status: newStatus,
              operations: [...eq.operations, newOperation],
            };
          }
          return eq;
        }));
        setLastUpdated(new Date());
        resolve(true);
      }, 500); // 模拟网络延迟
    });
  }, []);

  // 启动设备
  const startEquipment = useCallback(async (id: string): Promise<boolean> => {
    return performEquipmentOperation(id, "start", "启动设备");
  }, [performEquipmentOperation]);

  // 停止设备
  const stopEquipment = useCallback(async (id: string): Promise<boolean> => {
    return performEquipmentOperation(id, "stop", "停止设备");
  }, [performEquipmentOperation]);

  // 急停设备
  const emergencyStop = useCallback(async (id: string): Promise<boolean> => {
    return performEquipmentOperation(id, "emergency_stop", "紧急停止");
  }, [performEquipmentOperation]);

  // 更新控制参数
  const updateControlParams = useCallback(async (
    id: string,
    params: Partial<EquipmentControlParams>
  ): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setEquipments(prev => prev.map(eq => {
          if (eq.id === id) {
            const newOperation: EquipmentOperation = {
              id: generateId("operation"),
              timestamp: new Date(),
              operator: "当前用户",
              operation: "param_change",
              parameters: params,
              result: "success",
              description: "更新控制参数",
            };
            
            return {
              ...eq,
              controlParams: { ...eq.controlParams, ...params },
              operations: [...eq.operations, newOperation],
            };
          }
          return eq;
        }));
        setLastUpdated(new Date());
        resolve(true);
      }, 300);
    });
  }, []);

  // 刷新所有数据
  const refreshAllData = useCallback(() => {
    initializeEquipments();
  }, [initializeEquipments]);

  // 模拟实时数据更新（每60帧约1秒）
  const updateRealtimeData = useCallback(() => {
    frameCountRef.current++;
    
    if (frameCountRef.current % 60 === 0) {
      // 随机更新一些设备的数据
      setEquipments(prev => prev.map(eq => {
        if (Math.random() > 0.7) { // 30%概率更新
          return {
            ...eq,
            realtimeData: generateRealtimeData(),
          };
        }
        return eq;
      }));
      
      // 更新气体数据
      if (Math.random() > 0.5) {
        setGasData(generateGasData());
      }
      
      setLastUpdated(new Date());
    }
  }, []);

  // 初始化
  useEffect(() => {
    if (targetStationId) {
      initializeEquipments();
    }
  }, [targetStationId, initializeEquipments]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, []);

  return {
    equipments,
    selectedEquipmentId,
    gasData,
    isLoading,
    lastUpdated,
    
    selectEquipment: setSelectedEquipmentId,
    updateEquipmentData,
    startEquipment,
    stopEquipment,
    emergencyStop,
    updateControlParams,
    refreshAllData,
    
    // 供3D场景使用的实时更新函数
    updateRealtimeData,
  };
}
