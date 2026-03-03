/**
 * 顶部导航栏组件
 * 高度64px，包含面包屑、主题切换、全屏按钮、用户菜单
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Maximize,
  Minimize,
  ChevronRight,
  User,
  LogOut,
  Settings,
  Bell,
} from "lucide-react";
import { useSidebarStore, useUIStore, useUserStore } from "@/store";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

/**
 * 面包屑映射
 */
const breadcrumbMap: Record<string, string> = {
  dashboard: "驾驶舱",
  stations: "站点管理",
  monitor: "设备监控",
  dispatch: "调度中心",
  "ai-center": "AI识别",
  alerts: "告警中心",
  analytics: "数据分析",
  settings: "系统设置",
};

interface HeaderProps {
  className?: string;
}

/**
 * 顶部导航栏组件
 */
export function Header({ className }: HeaderProps) {
  const pathname = usePathname();
  const { isCollapsed, toggleMobileOpen } = useSidebarStore();
  const { isFullscreen, toggleFullscreen } = useUIStore();
  const { user, logout } = useUserStore();

  /**
   * 生成面包屑
   */
  const breadcrumbs = React.useMemo(() => {
    const paths = pathname.split("/").filter(Boolean);
    return paths.map((path, index) => {
      const href = "/" + paths.slice(0, index + 1).join("/");
      const label = breadcrumbMap[path] || path;
      return { label, href, isLast: index === paths.length - 1 };
    });
  }, [pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 right-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-md transition-all duration-300",
        isCollapsed ? "left-16" : "left-60",
        className
      )}
    >
      {/* 左侧：移动端菜单按钮 + 面包屑 */}
      <div className="flex items-center gap-4">
        {/* 移动端菜单按钮 */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={toggleMobileOpen}
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* 面包屑导航 */}
        <nav className="hidden items-center gap-2 text-sm text-muted-foreground md:flex">
          <Link href="/dashboard" className="hover:text-foreground">
            首页
          </Link>
          {breadcrumbs.map((item) => (
            <React.Fragment key={item.href}>
              <ChevronRight className="h-4 w-4" />
              {item.isLast ? (
                <span className="font-medium text-foreground">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:text-foreground">
                  {item.label}
                </Link>
              )}
            </React.Fragment>
          ))}
        </nav>
      </div>

      {/* 右侧：功能按钮 */}
      <div className="flex items-center gap-2">
        <TooltipProvider>
          {/* 主题切换 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <ThemeToggle variant="ghost" size="icon" />
            </TooltipTrigger>
            <TooltipContent>
              <p>切换主题</p>
            </TooltipContent>
          </Tooltip>

          {/* 全屏按钮 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? (
                  <Minimize className="h-5 w-5" />
                ) : (
                  <Maximize className="h-5 w-5" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isFullscreen ? "退出全屏" : "全屏显示"}</p>
            </TooltipContent>
          </Tooltip>

          {/* 通知按钮 */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/alerts">
                  <Bell className="h-5 w-5" />
                </Link>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>告警通知</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* 用户菜单 */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="relative h-9 w-9 rounded-full"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={user?.avatar}
                  alt={user?.name || "用户"}
                />
                <AvatarFallback className="bg-sky-100 text-sky-700 dark:bg-sky-900 dark:text-sky-300">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">
                  {user?.name || "管理员"}
                </p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email || "admin@example.com"}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings" className="cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                设置
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings/profile" className="cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                个人资料
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="cursor-pointer text-red-600 focus:text-red-600"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              退出登录
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Header;
