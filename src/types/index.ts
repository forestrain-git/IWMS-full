/**
 * 类型定义文件
 * 包含所有业务实体和通用类型定义
 */

import { LucideIcon } from "lucide-react";

// ==================== 站点相关类型 ====================

/** 站点状态 */
export type StationStatus = "online" | "offline" | "warning" | "danger" | "maintenance";

/** 站点信息 */
export interface Station {
  id: string;
  name: string;
  code: string;
  address: string;
  lng: number;
  lat: number;
  status: StationStatus;
  capacity: number; // 当前容量百分比 0-100
  dailyVolume: number; // 日处理量（吨）
  lastCollection: string; // ISO时间
  deviceCount: number;
  onlineDeviceCount: number;
  managerName: string;
  managerPhone: string;
  imageUrl?: string;
}

// ==================== 告警相关类型 ====================

/** 告警类型 */
export type AlertType = "fullness" | "offline" | "fault" | "illegal" | "fire";

/** 告警等级 */
export type AlertLevel = "low" | "medium" | "high" | "critical";

/** 告警状态 */
export type AlertStatus = "pending" | "processing" | "resolved";

/** 告警信息 */
export interface Alert {
  id: string;
  timestamp: string;
  stationId: string;
  stationName: string;
  type: AlertType;
  level: AlertLevel;
  message: string;
  status: AlertStatus;
  handler?: string;
}

// ==================== 数据指标类型 ====================

/** 单个指标数据 */
export interface MetricData {
  value: number;
  unit?: string;
  trend: number; // 百分比变化
  trendLabel?: string;
}

/** KPI数据集合 */
export interface KPIData {
  dailyVolume: MetricData;
  onlineRate: Omit<MetricData, "unit">;
  alertRate: Omit<MetricData, "unit">;
  carbonReduction: MetricData & { period: string };
}

// ==================== 趋势数据类型 ====================

/** 趋势数据点 */
export interface TrendPoint {
  timestamp: string;
  value: number;
  label?: string;
}

/** 趋势类型 */
export type TrendType = "positive" | "negative" | "neutral";

// ==================== 设备相关类型 ====================

/** 设备类型 */
export type DeviceType = "sensor" | "camera" | "compressor" | "weigher" | "screen";

/** 设备状态 */
export type DeviceStatus = "online" | "offline" | "error" | "maintenance";

/** 设备信息 */
export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  stationId: string;
  stationName: string;
  status: DeviceStatus;
  lastHeartbeat: string;
  batteryLevel?: number;
  firmwareVersion: string;
  /** 健康评分(0-100) */
  healthScore?: number;
  /** 3D场景中的位置 */
  position?: {
    x: number;
    y: number;
    z: number;
  };
  /** 3D场景中的旋转(弧度) */
  rotation?: {
    x: number;
    y: number;
    z: number;
  };
  /** 是否正在运行（用于动画） */
  isRunning?: boolean;
  /** 性能数据 */
  performanceData?: {
    efficiency: number; // 效率百分比
    throughput: number; // 吞吐量
    latency?: number;   // 延迟(ms)
  };
}

// ==================== 调度相关类型 ====================

/** 任务状态 */
export type TaskStatus = "pending" | "assigned" | "in_progress" | "completed" | "cancelled";

/** 任务类型 */
export type TaskType = "collection" | "maintenance" | "inspection" | "emergency";

/** 调度任务 */
export interface DispatchTask {
  id: string;
  type: TaskType;
  status: TaskStatus;
  stationId: string;
  stationName: string;
  assignedTo?: string;
  vehicleId?: string;
  priority: AlertLevel;
  scheduledTime: string;
  completedTime?: string;
  description: string;
}

// ==================== AI识别类型 ====================

/** 识别类型 */
export type RecognitionType = "waste_type" | "illegal_dumping" | "fire_smoke" | "person" | "vehicle";

/** AI识别结果 */
export interface AIRecognition {
  id: string;
  timestamp: string;
  stationId: string;
  stationName: string;
  type: RecognitionType;
  confidence: number;
  imageUrl: string;
  description: string;
  isAlert: boolean;
}

// ==================== 组件Props类型 ====================

/** 状态标签尺寸 */
export type StatusTagSize = "sm" | "md" | "lg";

/** 主题类型 */
export type Theme = "light" | "dark" | "system";

/** 菜单项 */
export interface MenuItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: number;
  children?: Omit<MenuItem, "icon" | "children">[];
}

/** 面包屑项 */
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// ==================== 用户信息类型 ====================

/** 用户信息 */
export interface UserInfo {
  id: string;
  name: string;
  avatar?: string;
  role: string;
  email: string;
  phone?: string;
  permissions?: string[];
}

// ==================== 路由配置类型 ====================

/** 路由配置 */
export interface RouteConfig {
  path: string;
  label: string;
  icon: LucideIcon;
  description?: string;
  badge?: number;
  children?: Omit<RouteConfig, "icon" | "children">[];
  /** 是否在菜单中隐藏 */
  hidden?: boolean;
  /** 所需权限 */
  requiredPermission?: string;
}

// ==================== 通用类型 ====================

/** 颜色主题 */
export type ColorTheme = "blue" | "green" | "amber" | "red" | "purple" | "slate";

/** 可选值 */
export type Nullable<T> = T | null;

/** API响应 */
export interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

/** 分页参数 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/** 分页结果 */
export interface PaginatedResult<T> {
  list: T[];
  total: number;
  page: number;
  pageSize: number;
}
