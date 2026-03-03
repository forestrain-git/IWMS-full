/**
 * @file app/dashboard/types/dashboard.ts
 * @description 驾驶舱模块私有类型扩展
 * @module 模块1:监管驾驶舱
 */

import type {
  KPIData,
  Station,
  Alert,
} from "@/types";

/**
 * 驾驶舱KPI数据，扩展预测值
 */
export interface DashboardKPI extends KPIData {
  /** 预测值（用于趋势预测） */
  readonly prediction?: number;
}

/**
 * 车辆状态
 */
export type VehicleStatus = "idle" | "loading" | "transporting" | "maintenance";

/**
 * 车辆信息
 */
export interface Vehicle {
  /** 车辆ID */
  readonly id: string;
  /** 车牌号 */
  readonly plateNumber: string;
  /** 车辆状态 */
  readonly status: VehicleStatus;
  /** 当前位置（站点名称） */
  readonly location: string;
  /** 当前任务 */
  readonly task?: string;
  /** 最后更新时间 */
  readonly lastUpdate: string;
}

/**
 * 气体监测数据
 */
export interface GasMonitoring {
  /** 氨气浓度 (ppm) */
  readonly nh3: number;
  /** 硫化氢浓度 (ppm) */
  readonly h2s: number;
  /** 甲烷浓度 (%) */
  readonly ch4: number;
  /** PM2.5 (μg/m³) */
  readonly pm25: number;
  /** 采集时间 */
  readonly timestamp: string;
}

/**
 * 3D场景中的站点节点
 */
export interface SceneNode {
  /** 站点ID */
  readonly id: string;
  /** 站点名称 */
  readonly name: string;
  /** 3D坐标 */
  readonly position: {
    readonly x: number;
    readonly y: number;
    readonly z: number;
  };
  /** 状态颜色 */
  readonly color: string;
  /** 容量百分比 */
  readonly capacity: number;
  /** 是否选中 */
  readonly isSelected: boolean;
}

/**
 * 驾驶舱数据聚合
 */
export interface DashboardData {
  /** KPI数据 */
  readonly kpi: DashboardKPI;
  /** 站点列表 */
  readonly stations: Station[];
  /** 最近告警 */
  readonly recentAlerts: Alert[];
  /** 车辆列表 */
  readonly vehicles: Vehicle[];
  /** 气体监测 */
  readonly gasMonitoring: GasMonitoring;
  /** 加载状态 */
  readonly isLoading: boolean;
  /** 最后更新时间 */
  readonly lastUpdated: Date | null;
}
