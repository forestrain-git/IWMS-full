/**
 * @file routes.ts
 * @description 路由配置 - 集中管理所有路由
 * @frozen 禁止修改 - 如需变更，先协调所有模块
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
import { RouteConfig } from "@/types";

// ==================== 路由分组 ====================

/**
 * 核心功能路由
 * 主要业务模块路由
 */
export const CORE_ROUTES: RouteConfig[] = [
  {
    path: "/dashboard",
    label: "驾驶舱",
    icon: LayoutDashboard as LucideIcon,
    description: "数据总览与实时监控",
  },
  {
    path: "/stations",
    label: "站点管理",
    icon: MapPin as LucideIcon,
    description: "管理所有垃圾分类回收站点",
  },
  {
    path: "/monitor",
    label: "设备监控",
    icon: Monitor as LucideIcon,
    description: "实时监控设备运行状态",
  },
  {
    path: "/dispatch",
    label: "调度中心",
    icon: Truck as LucideIcon,
    description: "任务调度与车辆管理",
  },
  {
    path: "/ai-center",
    label: "AI识别",
    icon: ScanEye as LucideIcon,
    description: "智能图像识别与行为分析",
  },
  {
    path: "/alerts",
    label: "告警中心",
    icon: Bell as LucideIcon,
    description: "告警管理与处理跟踪",
    badge: 0, // 动态更新
  },
  {
    path: "/analytics",
    label: "数据分析",
    icon: BarChart3 as LucideIcon,
    description: "数据统计与分析报表",
  },
];

/**
 * 系统功能路由
 * 系统配置和管理路由
 */
export const SYSTEM_ROUTES: RouteConfig[] = [
  {
    path: "/settings",
    label: "系统设置",
    icon: Settings as LucideIcon,
    description: "系统配置和用户设置",
  },
];

/**
 * 隐藏路由
 * 不在侧边栏显示的路由
 */
export const HIDDEN_ROUTES: RouteConfig[] = [
  {
    path: "/settings/profile",
    label: "个人资料",
    icon: Settings as LucideIcon,
    description: "用户个人资料管理",
    hidden: true,
  },
  {
    path: "/settings/security",
    label: "安全设置",
    icon: Settings as LucideIcon,
    description: "密码修改和双因素认证",
    hidden: true,
  },
];

// ==================== 路由合并 ====================

/**
 * 所有路由
 */
export const ALL_ROUTES: RouteConfig[] = [
  ...CORE_ROUTES,
  ...SYSTEM_ROUTES,
  ...HIDDEN_ROUTES,
];

/**
 * 侧边栏菜单路由
 */
export const SIDEBAR_ROUTES: RouteConfig[] = [
  ...CORE_ROUTES,
  ...SYSTEM_ROUTES,
];

// ==================== 路由工具函数 ====================

/**
 * 根据路径获取路由配置
 * @param path 路由路径
 * @returns 路由配置或undefined
 */
export function getRouteByPath(path: string): RouteConfig | undefined {
  return ALL_ROUTES.find((route) => route.path === path);
}

/**
 * 根据路径获取路由标签
 * @param path 路由路径
 * @returns 路由标签
 */
export function getRouteLabel(path: string): string {
  const route = getRouteByPath(path);
  return route?.label || "未命名页面";
}

/**
 * 根据路径获取面包屑
 * @param path 当前路径
 * @returns 面包屑配置数组
 */
export function getBreadcrumb(
  path: string
): Array<{ label: string; href?: string }> {
  const breadcrumb: Array<{ label: string; href?: string }> = [];

  // 处理嵌套路由
  const segments = path.split("/").filter(Boolean);
  let currentPath = "";

  for (const segment of segments) {
    currentPath += `/${segment}`;
    const route = getRouteByPath(currentPath);
    if (route) {
      breadcrumb.push({
        label: route.label,
        href: currentPath === path ? undefined : currentPath,
      });
    }
  }

  return breadcrumb;
}

/**
 * 检查路径是否有效
 * @param path 路由路径
 * @returns 是否有效
 */
export function isValidRoute(path: string): boolean {
  return ALL_ROUTES.some((route) => route.path === path);
}

/**
 * 获取路由分组
 * @param path 路由路径
 * @returns 路由分组名称
 */
export function getRouteGroup(path: string): "core" | "system" | "hidden" | "unknown" {
  if (CORE_ROUTES.some((r) => r.path === path)) return "core";
  if (SYSTEM_ROUTES.some((r) => r.path === path)) return "system";
  if (HIDDEN_ROUTES.some((r) => r.path === path)) return "hidden";
  return "unknown";
}

// ==================== 路由权限配置 ====================

/**
 * 路由权限映射
 * 路径 -> 所需权限
 */
export const ROUTE_PERMISSIONS: Record<string, string[]> = {
  "/dashboard": ["dashboard:view"],
  "/stations": ["stations:view"],
  "/monitor": ["monitor:view"],
  "/dispatch": ["dispatch:view"],
  "/ai-center": ["ai:view"],
  "/alerts": ["alerts:view"],
  "/analytics": ["analytics:view"],
  "/settings": ["settings:view"],
};

/**
 * 检查路由权限
 * @param path 路由路径
 * @param permissions 用户权限列表
 * @returns 是否有权限
 */
export function checkRoutePermission(
  path: string,
  permissions: string[]
): boolean {
  const required = ROUTE_PERMISSIONS[path];
  if (!required || required.length === 0) return true;
  return required.some((perm) => permissions.includes(perm));
}

// ==================== 默认导出 ====================

export default {
  CORE_ROUTES,
  SYSTEM_ROUTES,
  HIDDEN_ROUTES,
  ALL_ROUTES,
  SIDEBAR_ROUTES,
  ROUTE_PERMISSIONS,
};
