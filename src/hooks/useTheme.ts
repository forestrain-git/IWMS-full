/**
 * 主题Hook
 * 实现light/dark/system三种模式切换
 * 使用localStorage持久化用户选择
 * 监听系统主题变化自动切换
 */

"use client";

import { useEffect, useCallback } from "react";
import { useThemeStore } from "@/store";
import { Theme } from "@/types";

/**
 * 主题Hook
 * 管理主题切换和系统主题监听
 */
export function useTheme() {
  const { theme, setTheme, resolvedTheme, setResolvedTheme } = useThemeStore();

  /**
   * 获取系统主题偏好
   */
  const getSystemTheme = useCallback((): "light" | "dark" => {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }, []);

  /**
   * 应用主题到DOM
   */
  const applyTheme = useCallback(
    (newTheme: "light" | "dark") => {
      const root = document.documentElement;
      root.classList.remove("light", "dark");
      root.classList.add(newTheme);
      setResolvedTheme(newTheme);
    },
    [setResolvedTheme]
  );

  /**
   * 切换主题
   */
  const changeTheme = useCallback(
    (newTheme: Theme) => {
      setTheme(newTheme);

      if (newTheme === "system") {
        const systemTheme = getSystemTheme();
        applyTheme(systemTheme);
      } else {
        applyTheme(newTheme);
      }
    },
    [setTheme, getSystemTheme, applyTheme]
  );

  /**
   * 监听系统主题变化
   */
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      if (theme === "system") {
        applyTheme(e.matches ? "dark" : "light");
      }
    };

    // 初始应用主题
    if (theme === "system") {
      applyTheme(getSystemTheme());
    } else {
      applyTheme(theme);
    }

    // 监听系统主题变化
    mediaQuery.addEventListener("change", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, [theme, getSystemTheme, applyTheme]);

  /**
   * 切换主题（在light/dark间切换，忽略system）
   */
  const toggleTheme = useCallback(() => {
    const currentTheme = theme === "system" ? getSystemTheme() : theme;
    changeTheme(currentTheme === "light" ? "dark" : "light");
  }, [theme, getSystemTheme, changeTheme]);

  return {
    theme,
    resolvedTheme,
    setTheme: changeTheme,
    toggleTheme,
    isDark: resolvedTheme === "dark",
  };
}

export default useTheme;
