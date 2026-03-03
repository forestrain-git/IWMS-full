/**
 * 主题切换组件
 * 实现light/dark/system三种模式切换
 * 切换时添加平滑过渡动画
 */

"use client";

import * as React from "react";
import { Sun, Moon, Monitor } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { Theme } from "@/types";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm" | "lg" | "icon";
}

/**
 * 主题切换按钮组件
 */
export function ThemeToggle({
  className,
  variant = "ghost",
  size = "icon",
}: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  /**
   * 主题选项配置
   */
  const themeOptions: { value: Theme; label: string; icon: React.ReactNode }[] =
    [
      {
        value: "light",
        label: "浅色",
        icon: <Sun className="h-4 w-4" />,
      },
      {
        value: "dark",
        label: "深色",
        icon: <Moon className="h-4 w-4" />,
      },
      {
        value: "system",
        label: "跟随系统",
        icon: <Monitor className="h-4 w-4" />,
      },
    ];

  /**
   * 获取当前主题图标
   */
  const getCurrentIcon = () => {
    switch (theme) {
      case "light":
        return <Sun className="h-[1.2rem] w-[1.2rem]" />;
      case "dark":
        return <Moon className="h-[1.2rem] w-[1.2rem]" />;
      case "system":
      default:
        return resolvedTheme === "dark" ? (
          <Moon className="h-[1.2rem] w-[1.2rem]" />
        ) : (
          <Sun className="h-[1.2rem] w-[1.2rem]" />
        );
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn(
            "relative transition-all duration-300 ease-in-out",
            className
          )}
        >
          {getCurrentIcon()}
          <span className="sr-only">切换主题</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-32">
        {themeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={cn(
              "flex items-center gap-2 cursor-pointer",
              theme === option.value && "bg-accent"
            )}
          >
            {option.icon}
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ThemeToggle;
