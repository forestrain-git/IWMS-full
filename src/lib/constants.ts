/**
 * 常量定义文件
 * 包含导航配置、状态映射、枚举值等
 */

import {
  LayoutDashboard,
  MapPin,
  Monitor,
  Truck,
  ScanEye,
  Bell,
  BarChart3,
  Settings,
  LucideIcon,
} from "lucide-react";
import {
  StationStatus,
  AlertType,
  AlertLevel,
  MenuItem,
  ColorTheme,
} from "@/types";

// ==================== 导航菜单配置 ====================

/** 侧边栏导航菜单 */
export const NAVIGATION_MENU: MenuItem[] = [
  {
    label: "驾驶舱",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "站点管理",
    href: "/stations",
    icon: MapPin,
  },
  {
    label: "设备监控",
    href: "/monitor",
    icon: Monitor,
  },
  {
    label: "调度中心",
    href: "/dispatch",
    icon: Truck,
  },
  {
    label: "AI识别",
    href: "/ai-center",
    icon: ScanEye,
  },
  {
    label: "告警中心",
    href: "/alerts",
    icon: Bell,
    badge: 0, // 动态更新
  },
  {
    label: "数据分析",
    href: "/analytics",
    icon: BarChart3,
  },
  {
    label: "系统设置",
    href: "/settings",
    icon: Settings,
  },
];

// ==================== 状态映射配置 ====================

/** 站点状态配置 */
export const STATION_STATUS_CONFIG: Record<
  StationStatus,
  { label: string; color: string; bgColor: string; dotColor: string }
> = {
  online: {
    label: "在线",
    color: "text-status-online",
    bgColor: "bg-emerald-50 dark:bg-emerald-950",
    dotColor: "bg-status-online",
  },
  offline: {
    label: "离线",
    color: "text-status-offline",
    bgColor: "bg-gray-50 dark:bg-gray-900",
    dotColor: "bg-status-offline",
  },
  warning: {
    label: "告警",
    color: "text-status-warning",
    bgColor: "bg-amber-50 dark:bg-amber-950",
    dotColor: "bg-status-warning",
  },
  danger: {
    label: "紧急",
    color: "text-status-danger",
    bgColor: "bg-red-50 dark:bg-red-950",
    dotColor: "bg-status-danger",
  },
  maintenance: {
    label: "维护",
    color: "text-status-maintenance",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    dotColor: "bg-status-maintenance",
  },
};

/** 告警类型配置 */
export const ALERT_TYPE_CONFIG: Record<AlertType, { label: string; icon: string; description: string }> = {
  fullness: {
    label: "满溢告警",
    icon: "Trash2",
    description: "垃圾桶容量达到预警阈值",
  },
  offline: {
    label: "设备离线",
    icon: "WifiOff",
    description: "设备长时间未上报数据",
  },
  fault: {
    label: "设备故障",
    icon: "AlertTriangle",
    description: "设备检测到异常故障",
  },
  illegal: {
    label: "违规投放",
    icon: "Ban",
    description: "检测到违规垃圾投放行为",
  },
  fire: {
    label: "火情预警",
    icon: "Flame",
    description: "检测到烟雾或高温异常",
  },
};

/** 告警等级配置 */
export const ALERT_LEVEL_CONFIG: Record<
  AlertLevel,
  { label: string; color: ColorTheme; priority: number }
> = {
  low: {
    label: "低",
    color: "slate",
    priority: 1,
  },
  medium: {
    label: "中",
    color: "blue",
    priority: 2,
  },
  high: {
    label: "高",
    color: "amber",
    priority: 3,
  },
  critical: {
    label: "紧急",
    color: "red",
    priority: 4,
  },
};

/** 告警状态配置 */
export const ALERT_STATUS_CONFIG: Record<
  string,
  { label: string; color: string }
> = {
  pending: {
    label: "待处理",
    color: "text-amber-600",
  },
  processing: {
    label: "处理中",
    color: "text-blue-600",
  },
  resolved: {
    label: "已解决",
    color: "text-green-600",
  },
};

// ==================== 颜色主题配置 ====================

/** 颜色主题映射 */
export const COLOR_THEME_CONFIG: Record<ColorTheme, { primary: string; light: string; dark: string }> = {
  blue: {
    primary: "#0ea5e9",
    light: "#e0f2fe",
    dark: "#0284c7",
  },
  green: {
    primary: "#10b981",
    light: "#d1fae5",
    dark: "#059669",
  },
  amber: {
    primary: "#f59e0b",
    light: "#fef3c7",
    dark: "#d97706",
  },
  red: {
    primary: "#ef4444",
    light: "#fee2e2",
    dark: "#dc2626",
  },
  purple: {
    primary: "#8b5cf6",
    light: "#ede9fe",
    dark: "#7c3aed",
  },
  slate: {
    primary: "#64748b",
    light: "#f1f5f9",
    dark: "#475569",
  },
};

// ==================== 地图配置 ====================

/** 高德地图配置 */
export const AMAP_CONFIG = {
  key: process.env.NEXT_PUBLIC_AMAP_KEY || "889dc7d3059320fac2451ed0dee2d863",
  securityConfig: {
    securityJsCode: process.env.NEXT_PUBLIC_AMAP_SECURITY_CODE || "0b305eca3c5cb6db3b1fcb16f59ab2af",
  },
  defaultCenter: [116.397428, 39.90923] as [number, number],
  defaultZoom: 12,
};

// ==================== 分页配置 ====================

/** 默认分页参数 */
export const DEFAULT_PAGINATION = {
  page: 1,
  pageSize: 10,
};

/** 分页选项 */
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// ==================== 系统配置 ====================

/** 应用信息 */
export const APP_INFO = {
  name: "智环卫士",
  fullName: "智能垃圾分类管理平台",
  version: "1.0.0",
  logo: "/logo.svg",
  copyright: "© 2024 智环卫士. All rights reserved.",
};

/** 侧边栏配置 */
export const SIDEBAR_CONFIG = {
  width: 240,
  collapsedWidth: 64,
  mobileBreakpoint: 768,
};

/** 主题配置 */
export const THEME_CONFIG = {
  storageKey: "theme-preference",
  defaultTheme: "system" as const,
};

// ==================== Mock数据配置 ====================

/** 站点名称前缀 */
export const STATION_NAME_PREFIXES = [
  "阳光",
  "翠竹",
  "金域",
  "碧海",
  "星河",
  "云山",
  "锦绣",
  "凤岭",
  "龙腾",
  "鹏程",
];

/** 站点名称后缀 */
export const STATION_NAME_SUFFIXES = [
  "花园",
  "小区",
  "雅苑",
  "名都",
  "新城",
  "家园",
  "广场",
  "中心",
  "大厦",
  "公寓",
];

/** 街道列表 */
export const STREET_NAMES = [
  "中关村大街",
  "建国路",
  "复兴路",
  "长安街",
  "平安大街",
  "朝阳北路",
  "西直门外大街",
  "学院路",
  "知春路",
  "成府路",
];

/** 告警消息模板 */
export const ALERT_MESSAGE_TEMPLATES: Record<AlertType, string[]> = {
  fullness: [
    "垃圾桶容量超过80%，请及时清运",
    "垃圾桶已满溢，需要立即处理",
    "容量传感器检测到异常增长",
  ],
  offline: [
    "设备已离线超过30分钟",
    "连接超时，请检查网络状态",
    "心跳包丢失，设备可能断电",
  ],
  fault: [
    "压缩机工作异常",
    "传感器读数异常",
    "电路故障，请派技术人员检修",
  ],
  illegal: [
    "检测到违规投放行为",
    "AI识别到非生活垃圾",
    "有人试图破坏设备",
  ],
  fire: [
    "烟雾传感器触发报警",
    "温度异常升高，注意火情",
    "检测到疑似火源，请立即处理",
  ],
};
