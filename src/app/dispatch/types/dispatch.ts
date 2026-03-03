/**
 * @file dispatch.ts
 * @description 智能调度与路径优化模块类型定义
 * @extends 从@/types导入基础类型
 */

import type { DeviceStatus } from "@/types";

// ==================== 基础类型定义 ====================

/**
 * 车辆状态
 */
export type VehicleStatus = "idle" | "en_route" | "loading" | "unloading" | "maintenance" | "emergency";

/**
 * 任务状态
 */
export type TaskStatus = "pending" | "assigned" | "in_progress" | "completed" | "cancelled" | "emergency";

/**
 * 任务优先级
 */
export type TaskPriority = "low" | "normal" | "high" | "urgent";

/**
 * 优化目标类型
 */
export type OptimizationTarget = "distance" | "time" | "fuel" | "emission";

/**
 * 应急预案类型
 */
export type EmergencyType = "overflow" | "breakdown" | "weather" | "accident";

// ==================== 车辆相关类型 ====================

/**
 * 车辆位置信息
 */
export interface VehicleLocation {
  /** 纬度 */
  latitude: number;
  /** 经度 */
  longitude: number;
  /** 方向角度（0-360） */
  heading?: number;
  /** 速度（km/h） */
  speed?: number;
  /** 更新时间 */
  timestamp: string;
}

/**
 * 车辆信息
 */
export interface Vehicle {
  /** 车辆ID */
  id: string;
  /** 车牌号 */
  plateNumber: string;
  /** 车辆类型 */
  type: "collection" | "transport" | "emergency";
  /** 车辆状态 */
  status: VehicleStatus;
  /** 当前位置 */
  location: VehicleLocation;
  /** 驾驶员信息 */
  driver: {
    id: string;
    name: string;
    phone: string;
  };
  /** 载重信息 */
  capacity: {
    max: number; // 最大载重（吨）
    current: number; // 当前载重（吨）
  };
  /** 燃油信息 */
  fuel: {
    level: number; // 油位百分比
    consumption: number; // 百公里油耗
  };
  /** 维保信息 */
  maintenance: {
    lastMileage: number;
    nextMileage: number;
    daysUntilNext: number;
  };
  /** 当前任务ID */
  currentTaskId?: string;
  /** 今日完成任务数 */
  completedTasksToday: number;
  /** 今日工作时长（分钟） */
  workMinutesToday: number;
}

// ==================== 任务相关类型 ====================

/**
 * 任务位置信息
 */
export interface TaskLocation {
  /** 纬度 */
  latitude: number;
  /** 经度 */
  longitude: number;
  /** 地址描述 */
  address: string;
  /** 区域名称 */
  district?: string;
}

/**
 * 任务信息
 */
export interface Task {
  /** 任务ID */
  id: string;
  /** 任务名称 */
  name: string;
  /** 任务类型 */
  type: "collection" | "transport" | "emergency";
  /** 任务状态 */
  status: TaskStatus;
  /** 优先级 */
  priority: TaskPriority;
  /** 起始位置 */
  pickup: TaskLocation;
  /** 目标位置 */
  delivery?: TaskLocation;
  /** 预估工作量 */
  estimatedWorkload: {
    duration: number; // 预估时长（分钟）
    weight: number; // 预估重量（吨）
  };
  /** 分配的车辆ID */
  assignedVehicleId?: string;
  /** 创建时间 */
  createdAt: string;
  /** 计划开始时间 */
  plannedStartTime: string;
  /** 实际开始时间 */
  actualStartTime?: string;
  /** 完成时间 */
  completedAt?: string;
  /** 满溢等级（1-5） */
  overflowLevel?: number;
  /** 备注 */
  notes?: string;
}

// ==================== 路径优化相关类型 ====================

/**
 * 路径点
 */
export interface RoutePoint {
  /** 位置 */
  location: TaskLocation;
  /** 任务ID（如果是任务点） */
  taskId?: string;
  /** 预计到达时间 */
  estimatedArrival: string;
  /** 预计停留时长（分钟） */
  estimatedDuration: number;
}

/**
 * 优化路径
 */
export interface OptimizedRoute {
  /** 路径ID */
  id: string;
  /** 车辆ID */
  vehicleId: string;
  /** 路径点序列 */
  points: RoutePoint[];
  /** 总距离（公里） */
  totalDistance: number;
  /** 总时间（分钟） */
  totalTime: number;
  /** 总油耗（升） */
  totalFuel: number;
  /** 总碳排放（kg） */
  totalEmission: number;
  /** 优化对比 */
  comparison: {
    vsPrevious: {
      distance: number; // 百分比
      time: number; // 百分比
      fuel: number; // 百分比
    };
  };
}

/**
 * 优化结果
 */
export interface OptimizationResult {
  /** 结果ID */
  id: string;
  /** 优化时间 */
  optimizedAt: string;
  /** 优化目标 */
  target: OptimizationTarget;
  /** 优化后的路径 */
  routes: OptimizedRoute[];
  /** 总体改善 */
  overallImprovement: {
    totalDistance: number; // 公里
    totalTime: number; // 分钟
    totalFuel: number; // 升
    totalEmission: number; // kg
    vsPrevious: {
      distance: number; // 百分比
      time: number; // 百分比
      fuel: number; // 百分比
      emission: number; // 百分比
    };
  };
  /** 算法信息 */
  algorithm: {
    name: string;
    iterations: number;
    executionTime: number; // 毫秒
    convergence: number; // 收敛度
  };
}

// ==================== AI建议相关类型 ====================

/**
 * AI建议类型
 */
export type AIRecommendationType = 
  | "route_optimization" 
  | "vehicle_reassignment" 
  | "task_priority" 
  | "emergency_dispatch"
  | "fuel_efficiency";

/**
 * AI建议
 */
export interface AIRecommendation {
  /** 建议ID */
  id: string;
  /** 建议类型 */
  type: AIRecommendationType;
  /** 标题 */
  title: string;
  /** 描述 */
  description: string;
  /** 预期收益 */
  benefits: {
    timeSaved?: number; // 节省时间（分钟）
    distanceReduced?: number; // 减少距离（公里）
    fuelSaved?: number; // 节省燃油（升）
    emissionReduced?: number; // 减少排放（kg）
  };
  /** 影响的车辆ID列表 */
  affectedVehicleIds: string[];
  /** 影响的任务ID列表 */
  affectedTaskIds: string[];
  /** 建议的解决方案 */
  solution: any; // 具体解决方案数据
  /** 置信度（0-1） */
  confidence: number;
  /** 创建时间 */
  createdAt: string;
  /** 是否已应用 */
  applied: boolean;
}

// ==================== 应急调度相关类型 ====================

/**
 * 应急预案
 */
export interface EmergencyPlan {
  /** 预案ID */
  id: string;
  /** 预案类型 */
  type: EmergencyType;
  /** 预案名称 */
  name: string;
  /** 预案描述 */
  description: string;
  /** 触发条件 */
  triggerConditions: string[];
  /** 响应步骤 */
  responseSteps: {
    step: number;
    action: string;
    responsible: string;
    estimatedTime: number; // 预估执行时间（分钟）
  }[];
  /** 所需资源 */
  requiredResources: {
    vehicles: number;
    personnel: number;
    equipment: string[];
  };
  /** 预案级别 */
  level: "low" | "medium" | "high" | "critical";
}

/**
 * 应急事件
 */
export interface EmergencyEvent {
  /** 事件ID */
  id: string;
  /** 事件类型 */
  type: EmergencyType;
  /** 事件位置 */
  location: TaskLocation;
  /** 事件描述 */
  description: string;
  /** 严重程度 */
  severity: "low" | "medium" | "high" | "critical";
  /** 报告时间 */
  reportedAt: string;
  /** 响应状态 */
  responseStatus: "pending" | "responding" | "resolved";
  /** 启动的预案ID */
  activatedPlanId?: string;
  /** 派遣的车辆ID列表 */
  dispatchedVehicleIds: string[];
}

// ==================== 排班相关类型 ====================

/**
 * 人员排班
 */
export interface StaffSchedule {
  /** 员工ID */
  staffId: string;
  /** 员工姓名 */
  staffName: string;
  /** 班次类型 */
  shiftType: "morning" | "afternoon" | "night" | "flexible";
  /** 工作时间 */
  workHours: {
    start: string;
    end: string;
  };
  /** 分配的车辆ID */
  assignedVehicleId?: string;
  /** 技能标签 */
  skills: string[];
  /** 今日工作时长（分钟） */
  workMinutesToday: number;
  /** 本周工作时长（分钟） */
  workMinutesThisWeek: number;
}

/**
 * 车辆排班
 */
export interface VehicleSchedule {
  /** 车辆ID */
  vehicleId: string;
  /** 班次状态 */
  shiftStatus: "active" | "break" | "off_duty" | "maintenance";
  /** 计划工作时长（分钟） */
  plannedWorkMinutes: number;
  /** 实际工作时长（分钟） */
  actualWorkMinutes: number;
  /** 下次维保时间 */
  nextMaintenance: string;
  /** 今日任务数 */
  tasksToday: number;
  /** 可用性 */
  availability: {
    available: boolean;
    reason?: string;
    estimatedAvailable?: string;
  };
}

// ==================== 通信相关类型 ====================

/**
 * 语音通话状态
 */
export interface VoiceCallState {
  /** 通话ID */
  callId: string;
  /** 参与者 */
  participants: {
    userId: string;
    userName: string;
    isMuted: boolean;
    isSpeaking: boolean;
  }[];
  /** 通话状态 */
  status: "connecting" | "active" | "ended";
  /** 开始时间 */
  startTime: string;
  /** 通话时长（秒） */
  duration: number;
}

/**
 * 视频会议状态
 */
export interface VideoConferenceState {
  /** 会议ID */
  conferenceId: string;
  /** 会议主题 */
  topic: string;
  /** 参与者 */
  participants: {
    userId: string;
    userName: string;
    isVideoOn: boolean;
    isMuted: boolean;
  }[];
  /** 会议状态 */
  status: "waiting" | "active" | "ended";
  /** 开始时间 */
  startTime: string;
  /** 会议时长（分钟） */
  duration: number;
}

// ==================== Hook返回类型 ====================

/**
 * 调度数据Hook返回类型
 */
export interface UseDispatchDataReturn {
  /** 车辆列表 */
  vehicles: Vehicle[];
  /** 任务列表 */
  tasks: Task[];
  /** AI建议列表 */
  aiRecommendations: AIRecommendation[];
  /** 应急事件列表 */
  emergencyEvents: EmergencyEvent[];
  /** 人员排班 */
  staffSchedules: StaffSchedule[];
  /** 车辆排班 */
  vehicleSchedules: VehicleSchedule[];
  /** 加载状态 */
  isLoading: boolean;
  /** 最后更新时间 */
  lastUpdated: Date | null;
  /** 选择车辆 */
  selectVehicle: (vehicleId: string | null) => void;
  /** 选择任务 */
  selectTask: (taskId: string | null) => void;
  /** 更新车辆状态 */
  updateVehicleStatus: (vehicleId: string, status: VehicleStatus) => void;
  /** 更新任务状态 */
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  /** 分配任务 */
  assignTask: (taskId: string, vehicleId: string) => void;
  /** 应用AI建议 */
  applyAIRecommendation: (recommendationId: string) => void;
  /** 启动应急预案 */
  activateEmergencyPlan: (eventId: string, planId: string) => void;
  /** 刷新数据 */
  refreshData: () => void;
}

/**
 * 路径优化Hook返回类型
 */
export interface UseRouteOptimizationReturn {
  /** 优化结果 */
  optimizationResult: OptimizationResult | null;
  /** 正在优化 */
  isOptimizing: boolean;
  /** 优化进度 */
  optimizationProgress: number;
  /** 开始优化 */
  startOptimization: (target: OptimizationTarget, vehicleIds: string[], taskIds: string[]) => void;
  /** 停止优化 */
  stopOptimization: () => void;
  /** 应用优化结果 */
  applyOptimization: (resultId: string) => void;
}

// ==================== 常量定义 ====================

/**
 * 车辆状态配置
 */
export const VEHICLE_STATUS_CONFIG = {
  idle: { label: "空闲", color: "green", icon: "🟢" },
  en_route: { label: "在途", color: "blue", icon: "🔵" },
  loading: { label: "装载", color: "orange", icon: "🟠" },
  unloading: { label: "卸载", color: "orange", icon: "🟠" },
  maintenance: { label: "维保", color: "gray", icon: "⚫" },
  emergency: { label: "应急", color: "red", icon: "🔴" },
} as const;

/**
 * 任务状态配置
 */
export const TASK_STATUS_CONFIG = {
  pending: { label: "待分配", color: "gray", icon: "⚪" },
  assigned: { label: "已分配", color: "blue", icon: "🔵" },
  in_progress: { label: "进行中", color: "orange", icon: "🟠" },
  completed: { label: "已完成", color: "green", icon: "🟢" },
  cancelled: { label: "已取消", color: "red", icon: "🔴" },
  emergency: { label: "紧急", color: "red", icon: "🚨" },
} as const;

/**
 * 优化目标配置
 */
export const OPTIMIZATION_TARGET_CONFIG = {
  distance: { label: "距离", unit: "km", icon: "📏" },
  time: { label: "时间", unit: "min", icon: "⏰" },
  fuel: { label: "油耗", unit: "L", icon: "⛽" },
  emission: { label: "排放", unit: "kg", icon: "🌱" },
} as const;

/**
 * 应急预案配置
 */
export const EMERGENCY_TYPE_CONFIG = {
  overflow: { label: "满溢", level: "high", icon: "🗑️" },
  breakdown: { label: "故障", level: "medium", icon: "🔧" },
  weather: { label: "天气", level: "high", icon: "🌧️" },
  accident: { label: "事故", level: "critical", icon: "🚨" },
} as const;
