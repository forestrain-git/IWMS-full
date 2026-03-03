/**
 * @file equipment.ts
 * @description 设备监控模块类型定义
 * @extends 从CONTRACT.ts导入基础类型
 */

import type { DeviceType, DeviceStatus as DeviceStatusBase } from "@/types";

// ==================== 基础类型定义 ====================

/**
 * 设备状态（基础类型）
 */
export type DeviceStatus = DeviceStatusBase;

// ==================== 设备扩展类型 ====================

/**
 * 设备运行状态（扩展基础DeviceStatus）
 */
export type EquipmentRunningStatus = DeviceStatus | "starting" | "stopping";

/**
 * 设备类型（3D场景专用）
 */
export type Equipment3DType = 
  | "compressor"      // 压缩机
  | "crane"           // 吊机
  | "deodorizer"      // 除臭机
  | "scale"           // 地磅
  | "conveyor";       // 传送带

/**
 * 设备实时数据
 */
export interface EquipmentRealtimeData {
  /** 压力 (MPa) */
  pressure: number;
  /** 温度 (°C) */
  temperature: number;
  /** 振动 (mm) */
  vibration: number;
  /** 电流 (A) */
  current: number;
  /** 功率 (kW) */
  power: number;
  /** 转速 (rpm) */
  speed: number;
}

/**
 * 设备3D位置和旋转
 */
export interface Equipment3DTransform {
  /** 3D坐标 */
  position: [number, number, number];
  /** 3D旋转 */
  rotation: [number, number, number];
  /** 缩放比例 */
  scale: [number, number, number];
}

/**
 * 设备预测性维护数据
 */
export interface PredictiveMaintenanceData {
  /** 健康评分 (0-100) */
  healthScore: number;
  /** 故障概率 (0-100%) */
  failureProbability: number;
  /** 预计剩余寿命 (小时) */
  remainingLife: number;
  /** 下次维护时间 */
  nextMaintenance: Date;
  /** 维护建议 */
  maintenanceSuggestions: string[];
  /** 历史健康趋势 */
  healthTrend: Array<{
    timestamp: Date;
    score: number;
  }>;
  /** 故障预警列表 */
  faultPredictions: Array<{
    type: string;
    probability: number;
    estimatedTime: Date;
    severity: "low" | "medium" | "high" | "critical";
  }>;
}

/**
 * 设备控制参数
 */
export interface EquipmentControlParams {
  /** 压力阈值 */
  pressureThreshold: number;
  /** 温度阈值 */
  temperatureThreshold: number;
  /** 振动阈值 */
  vibrationThreshold: number;
  /** 自动启停 */
  autoControl: boolean;
  /** 运行模式 */
  operationMode: "manual" | "auto" | "maintenance";
}

/**
 * 设备操作记录
 */
export interface EquipmentOperation {
  id: string;
  timestamp: Date;
  operator: string;
  operation: "start" | "stop" | "emergency_stop" | "param_change";
  parameters?: Partial<EquipmentControlParams>;
  result: "success" | "failed" | "pending";
  description: string;
}

/**
 * 有害气体数据
 */
export interface GasData {
  /** NH3浓度 (ppm) */
  nh3: number;
  /** H2S浓度 (ppm) */
  h2s: number;
  /** 风向角度 */
  windDirection: number;
  /** 风速 (m/s) */
  windSpeed: number;
  /** 检测位置 */
  position: [number, number, number];
}

/**
 * 3D场景视角预设
 */
export interface CameraPreset {
  id: string;
  name: string;
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
}

// ==================== 完整设备信息 ====================

/**
 * 完整的设备信息（扩展基础Device类型）
 */
export interface EquipmentInfo {
  /** 基础设备信息 */
  id: string;
  name: string;
  type: Equipment3DType;
  stationId: string;
  stationName: string;
  status: EquipmentRunningStatus;
  
  /** 3D场景相关 */
  transform: Equipment3DTransform;
  meshType: "box" | "cylinder" | "sphere" | "complex";
  color: string;
  isAnimated: boolean;
  
  /** 实时数据 */
  realtimeData: EquipmentRealtimeData;
  
  /** 预测性维护 */
  predictiveData: PredictiveMaintenanceData;
  
  /** 控制参数 */
  controlParams: EquipmentControlParams;
  
  /** 操作记录 */
  operations: EquipmentOperation[];
  
  /** 元数据 */
  model: string;
  manufacturer: string;
  installDate: Date;
  lastMaintenance: Date;
  firmwareVersion: string;
}

// ==================== 场景配置 ====================

/**
 * 3D场景配置
 */
export interface Scene3DConfig {
  /** 场景边界 */
  bounds: {
    min: [number, number, number];
    max: [number, number, number];
  };
  /** 默认相机位置 */
  defaultCamera: {
    position: [number, number, number];
    target: [number, number, number];
  };
  /** 预设视角 */
  cameraPresets: CameraPreset[];
  /** 环境光照 */
  lighting: {
    ambient: number;
    directional: {
      position: [number, number, number];
      intensity: number;
    };
  };
  /** 地面配置 */
  ground: {
    size: number;
    color: string;
    grid: boolean;
  };
}

// ==================== Hook返回类型 ====================

/**
 * useEquipmentData Hook返回值
 */
export interface UseEquipmentDataReturn {
  /** 设备列表 */
  equipments: EquipmentInfo[];
  /** 选中的设备ID */
  selectedEquipmentId: string | null;
  /** 气体数据 */
  gasData: GasData[];
  /** 加载状态 */
  isLoading: boolean;
  /** 最后更新时间 */
  lastUpdated: Date | null;
  
  /** 操作方法 */
  selectEquipment: (id: string | null) => void;
  updateEquipmentData: (id: string) => void;
  startEquipment: (id: string) => Promise<boolean>;
  stopEquipment: (id: string) => Promise<boolean>;
  emergencyStop: (id: string) => Promise<boolean>;
  updateControlParams: (id: string, params: Partial<EquipmentControlParams>) => Promise<boolean>;
  refreshAllData: () => void;
  /** 3D场景实时更新函数 */
  updateRealtimeData: () => void;
}

// ==================== 常量定义 ====================

/**
 * 设备类型配置
 */
export const EQUIPMENT_TYPE_CONFIG = {
  compressor: {
    name: "压缩机",
    meshType: "box" as const,
    defaultColor: "#3b82f6",
    animated: true,
    size: [2, 3, 2] as [number, number, number],
  },
  crane: {
    name: "吊机",
    meshType: "complex" as const,
    defaultColor: "#10b981",
    animated: true,
    size: [1, 4, 1] as [number, number, number],
  },
  deodorizer: {
    name: "除臭机",
    meshType: "cylinder" as const,
    defaultColor: "#f59e0b",
    animated: true,
    size: [1, 2, 1] as [number, number, number],
  },
  scale: {
    name: "地磅",
    meshType: "box" as const,
    defaultColor: "#6b7280",
    animated: false,
    size: [4, 0.5, 3] as [number, number, number],
  },
  conveyor: {
    name: "传送带",
    meshType: "box" as const,
    defaultColor: "#8b5cf6",
    animated: true,
    size: [6, 0.3, 1] as [number, number, number],
  },
} as const;

/**
 * 健康评分颜色映射
 */
export const HEALTH_SCORE_COLORS = {
  excellent: "#10b981", // >80 绿色
  good: "#3b82f6",      // >60 蓝色
  warning: "#f59e0b",   // >40 黄色
  critical: "#ef4444",  // <40 红色
} as const;

/**
 * 气体浓度阈值
 */
export const GAS_THRESHOLDS = {
  nh3: {
    safe: 25,      // ppm
    warning: 50,
    danger: 100,
  },
  h2s: {
    safe: 10,      // ppm
    warning: 20,
    danger: 50,
  },
} as const;
