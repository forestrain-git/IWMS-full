/**
 * @file CONTRACT.ts
 * @description 模块连接契约文档 - 由模块0生成，模块1-N只读不写
 * @frozen 禁止修改 - 如需变更，先协调所有模块
 * @version 1.0.0
 */

import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

// ==================== 全局状态契约 ====================

/**
 * @frozen
 * @description 全局状态接口 - 使用Zustand管理
 * @usage const { theme, setTheme } = useGlobalStore();
 */
export interface GlobalStateContract {
  /** 当前主题 */
  readonly theme: "light" | "dark" | "system";
  /** 侧边栏是否折叠 */
  readonly sidebarCollapsed: boolean;
  /** 当前页面标题 */
  readonly currentPageTitle: string;
  /** 站点列表 - 各模块共享 */
  readonly stations: import("@/types").Station[];
  /** 告警列表 - 实时更新 */
  readonly alerts: import("@/types").Alert[];
  /** 当前选中站点ID - 用于模块间联动 */
  readonly selectedStationId: string | null;
  /** 全局时间范围 - 各模块时间筛选同步 */
  readonly globalTimeRange: readonly [Date, Date];
  /** 用户信息 */
  readonly userInfo: import("@/types").UserInfo | null;
}

// ==================== 组件Props契约 ====================

/**
 * @frozen
 * @description StatCard组件Props
 * @usage <StatCard title="日处理量" value={128.5} unit="吨" trend={12.5} icon={Truck} color="blue" />
 */
export interface StatCardPropsContract {
  /** 卡片标题 */
  readonly title: string;
  /** 数值 */
  readonly value: string | number;
  /** 单位 */
  readonly unit?: string;
  /** 趋势百分比，正数上升，负数下降 */
  readonly trend?: number;
  /** 趋势描述，如"较昨日" */
  readonly trendLabel?: string;
  /** 图标组件 */
  readonly icon: LucideIcon;
  /** 颜色主题 */
  readonly color: "blue" | "green" | "amber" | "red" | "purple";
  /** 加载状态 */
  readonly loading?: boolean;
  /** 点击回调 */
  readonly onClick?: () => void;
  /** 自定义类名 */
  readonly className?: string;
}

/**
 * @frozen
 * @description StatusTag组件Props
 * @usage <StatusTag status="online" size="md" showLabel />
 */
export interface StatusTagPropsContract {
  /** 状态类型 */
  readonly status: "online" | "offline" | "warning" | "danger" | "maintenance";
  /** 尺寸 */
  readonly size?: "sm" | "md" | "lg";
  /** 是否显示文字 */
  readonly showLabel?: boolean;
  /** 是否显示动画效果 */
  readonly pulse?: boolean;
  /** 自定义类名 */
  readonly className?: string;
}

/**
 * @frozen
 * @description PageHeader组件Props
 * @usage <PageHeader title="站点管理" description="管理所有站点" actions={<Button>新增</Button>} />
 */
export interface PageHeaderPropsContract {
  /** 页面标题 */
  readonly title: string;
  /** 页面描述 */
  readonly description?: string;
  /** 右侧操作区 */
  readonly actions?: ReactNode;
  /** 面包屑配置 */
  readonly breadcrumb?: Array<{
    readonly label: string;
    readonly href?: string;
  }>;
  /** 自定义类名 */
  readonly className?: string;
}

/**
 * @frozen
 * @description MainLayout组件Props
 * @usage <MainLayout><YourPage /></MainLayout>
 */
export interface MainLayoutPropsContract {
  /** 页面内容 */
  readonly children: ReactNode;
  /** 自定义类名 */
  readonly className?: string;
}

/**
 * @frozen
 * @description TrendChart组件Props
 * @usage <TrendChart data={trendData} trendType="positive" height={200} showTooltip />
 */
export interface TrendChartPropsContract {
  /** 趋势数据 */
  readonly data: import("@/types").TrendPoint[];
  /** 趋势类型 - 影响颜色 */
  readonly trendType?: "positive" | "negative" | "neutral";
  /** 图表高度 */
  readonly height?: number;
  /** 是否显示提示框 */
  readonly showTooltip?: boolean;
  /** 是否显示坐标轴 */
  readonly showAxis?: boolean;
  /** 自定义类名 */
  readonly className?: string;
}

/**
 * @frozen
 * @description StationSelector组件Props
 * @usage <StationSelector value={selectedId} onChange={handleChange} showAllOption />
 */
export interface StationSelectorPropsContract {
  /** 当前选中的站点ID */
  readonly value?: string;
  /** 选择变更回调 */
  readonly onChange?: (value: string) => void;
  /** 占位符文本 */
  readonly placeholder?: string;
  /** 是否显示"全部站点"选项 */
  readonly showAllOption?: boolean;
  /** 自定义类名 */
  readonly className?: string;
}

/**
 * @frozen
 * @description AlertTicker组件Props
 * @usage <AlertTicker maxAlerts={5} />
 */
export interface AlertTickerPropsContract {
  /** 自定义类名 */
  readonly className?: string;
  /** 最大显示告警数 */
  readonly maxAlerts?: number;
}

// ==================== 类型导出契约 ====================

/**
 * @frozen
 * @description 重新导出核心类型，供模块1-N直接使用
 * 禁止模块1-N直接从@/types导入，统一从此文件导入以确保版本一致
 */
export type {
  Station as StationType,
  Alert as AlertType,
  KPIData as KPIDataType,
  TrendPoint as TrendPointType,
  UserInfo as UserInfoType,
  Device as DeviceType,
  RouteConfig as RouteConfigType,
  ColorTheme as ColorThemeType,
  MenuItem as MenuItemType,
  BreadcrumbItem as BreadcrumbItemType,
} from "@/types";

// ==================== 工具函数契约 ====================

/**
 * @frozen
 * @description 类名合并工具
 * @usage cn("class1", "class2", condition && "class3")
 */
export type CNFunction = (...inputs: import("clsx").ClassValue[]) => string;

/**
 * @frozen
 * @description Mock数据生成器函数签名
 */
export interface MockGeneratorsContract {
  readonly generateStations: (count: number) => import("@/types").Station[];
  readonly generateAlerts: (count: number, stations: import("@/types").Station[]) => import("@/types").Alert[];
  readonly generateTrendData: (points: number) => import("@/types").TrendPoint[];
  readonly generateKPIData: () => import("@/types").KPIData;
}

// ==================== 常量契约 ====================

/**
 * @frozen
 * @description 侧边栏配置常量
 */
export interface SidebarConfigContract {
  readonly width: number;
  readonly collapsedWidth: number;
  readonly mobileBreakpoint: number;
}

/**
 * @frozen
 * @description 应用信息常量
 */
export interface AppInfoContract {
  readonly name: string;
  readonly fullName: string;
  readonly version: string;
  readonly copyright: string;
}

// ==================== 钩子函数契约 ====================

/**
 * @frozen
 * @description useTheme Hook返回值
 */
export interface UseThemeContract {
  readonly theme: "light" | "dark" | "system";
  readonly resolvedTheme: "light" | "dark";
  readonly setTheme: (theme: "light" | "dark" | "system") => void;
  readonly toggleTheme: () => void;
  readonly isDark: boolean;
}

/**
 * @frozen
 * @description useMockData Hook返回值
 */
export interface UseMockDataContract {
  readonly stations: import("@/types").Station[];
  readonly devices: import("@/types").Device[];
  readonly alerts: import("@/types").Alert[];
  readonly tasks: import("@/types").DispatchTask[];
  readonly aiRecognitions: import("@/types").AIRecognition[];
  readonly kpiData: import("@/types").KPIData;
  readonly isLoading: boolean;
  readonly lastUpdated: Date | null;
  readonly refreshData: () => void;
  readonly refreshStations: () => void;
  readonly refreshAlerts: () => void;
  readonly refreshKPIData: () => void;
  readonly stationStats: {
    readonly total: number;
    readonly online: number;
    readonly offline: number;
    readonly warning: number;
    readonly danger: number;
    readonly onlineRate: number;
  };
  readonly alertStats: {
    readonly total: number;
    readonly pending: number;
    readonly processing: number;
    readonly resolved: number;
    readonly critical: number;
    readonly high: number;
  };
}

// ==================== 状态契约 ====================

/**
 * @frozen
 * @description Zustand Store 类型 - 主题状态
 */
export interface ThemeStoreContract {
  readonly theme: "light" | "dark" | "system";
  readonly setTheme: (theme: "light" | "dark" | "system") => void;
  readonly resolvedTheme: "light" | "dark";
  readonly setResolvedTheme: (theme: "light" | "dark") => void;
}

/**
 * @frozen
 * @description Zustand Store 类型 - 侧边栏状态
 */
export interface SidebarStoreContract {
  readonly isCollapsed: boolean;
  readonly isMobileOpen: boolean;
  readonly toggleCollapsed: () => void;
  readonly setCollapsed: (collapsed: boolean) => void;
  readonly toggleMobileOpen: () => void;
  readonly setMobileOpen: (open: boolean) => void;
}

/**
 * @frozen
 * @description Zustand Store 类型 - 全局应用状态
 */
export interface GlobalStoreContract {
  readonly currentPageTitle: string;
  readonly setCurrentPageTitle: (title: string) => void;
  readonly selectedStationId: string | null;
  readonly setSelectedStationId: (id: string | null) => void;
  readonly globalTimeRange: readonly [Date, Date];
  readonly setGlobalTimeRange: (range: [Date, Date]) => void;
}

/**
 * @frozen
 * @description Zustand Store 类型 - 告警状态
 */
export interface AlertStoreContract {
  readonly unreadCount: number;
  readonly readAlertIds: readonly string[];
  readonly markAsRead: (alertId: string) => void;
  readonly markAllAsRead: () => void;
  readonly clearReadHistory: () => void;
  readonly updateUnreadCount: (count: number) => void;
}

// ==================== 版本信息 ====================

/**
 * @frozen
 * @description 契约版本 - 变更时必须更新
 */
export const CONTRACT_VERSION = "1.0.0";

/**
 * @frozen
 * @description 最后更新时间
 */
export const CONTRACT_LAST_UPDATED = "2026-03-02";

/**
 * @frozen
 * @description 模块0依赖的React版本
 */
export const REQUIRED_REACT_VERSION = "^18.0.0";

/**
 * @frozen
 * @description 模块0依赖的Next.js版本
 */
export const REQUIRED_NEXT_VERSION = "^14.0.0";
