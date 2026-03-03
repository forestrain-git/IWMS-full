/**
 * 侧边栏组件
 * 固定宽度240px（可折叠到64px），深色背景，包含Logo和导航菜单
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  MapPin,
  Monitor,
  Truck,
  ScanEye,
  Bell,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Trash2,
} from "lucide-react";
import { useSidebarStore, useAlertStore } from "@/store";
import { cn } from "@/lib/utils";
import { SIDEBAR_CONFIG, APP_INFO } from "@/lib/constants";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

/**
 * 导航菜单项
 */
interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}

const navigation: NavItem[] = [
  { label: "驾驶舱", href: "/dashboard", icon: LayoutDashboard },
  { label: "站点管理", href: "/stations", icon: MapPin },
  { label: "设备监控", href: "/monitor", icon: Monitor },
  { label: "调度中心", href: "/dispatch", icon: Truck },
  { label: "AI识别", href: "/ai-center", icon: ScanEye },
  { label: "告警中心", href: "/alerts", icon: Bell },
  { label: "数据分析", href: "/analytics", icon: BarChart3 },
  { label: "系统设置", href: "/settings", icon: Settings },
];

interface SidebarProps {
  className?: string;
}

/**
 * 侧边栏组件
 */
export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();
  const { isCollapsed, toggleCollapsed } = useSidebarStore();
  const { unreadCount } = useAlertStore();

  return (
    <motion.aside
      initial={false}
      animate={{
        width: isCollapsed
          ? SIDEBAR_CONFIG.collapsedWidth
          : SIDEBAR_CONFIG.width,
      }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border/50 bg-slate-900 text-slate-100 dark:bg-slate-950",
        className
      )}
    >
      {/* Logo区域 */}
      <div className="flex h-16 items-center justify-between border-b border-slate-800 px-4">
        <Link
          href="/dashboard"
          className={cn(
            "flex items-center gap-3 overflow-hidden transition-all duration-300",
            isCollapsed && "w-0 opacity-0"
          )}
        >
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sky-500 to-blue-600">
            <Trash2 className="h-5 w-5 text-white" />
          </div>
          <span className="whitespace-nowrap text-lg font-bold">
            {APP_INFO.name}
          </span>
        </Link>

        {/* 折叠按钮 */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapsed}
          className={cn(
            "h-8 w-8 shrink-0 text-slate-400 hover:bg-slate-800 hover:text-slate-100",
            isCollapsed && "mx-auto"
          )}
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* 导航菜单 */}
      <ScrollArea className="flex-1 py-4">
        <nav className="space-y-1 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            const badgeCount = item.href === "/alerts" ? unreadCount : undefined;

            return (
              <Link key={item.href} href={item.href} className="block">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sky-600 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-slate-100",
                    isCollapsed && "justify-center px-2"
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <AnimatePresence mode="wait">
                    {!isCollapsed && (
                      <motion.span
                        initial={{ opacity: 0, width: 0 }}
                        animate={{ opacity: 1, width: "auto" }}
                        exit={{ opacity: 0, width: 0 }}
                        transition={{ duration: 0.2 }}
                        className="whitespace-nowrap"
                      >
                        {item.label}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {!isCollapsed && badgeCount !== undefined && badgeCount > 0 && (
                    <Badge
                      variant="destructive"
                      className="ml-auto h-5 min-w-5 px-1 text-xs"
                    >
                      {badgeCount > 99 ? "99+" : badgeCount}
                    </Badge>
                  )}
                  {isCollapsed && badgeCount !== undefined && badgeCount > 0 && (
                    <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-500" />
                  )}
                </motion.div>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* 底部信息 */}
      <div
        className={cn(
          "border-t border-slate-800 p-4 text-xs text-slate-500 transition-opacity",
          isCollapsed && "opacity-0"
        )}
      >
        <p className="whitespace-nowrap">{APP_INFO.fullName}</p>
        <p className="mt-1 whitespace-nowrap">版本 {APP_INFO.version}</p>
      </div>
    </motion.aside>
  );
}

export default Sidebar;
