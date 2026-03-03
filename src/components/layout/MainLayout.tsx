/**
 * 主布局组件
 * 包含侧边栏、顶部导航栏和内容区域
 */

"use client";

import * as React from "react";
import { useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, ANIMATION, TYPOGRAPHY } from "@/lib/design-tokens";
import { useSidebarStore, useMockDataStore } from "@/store";
import { cn } from "@/lib/utils";
import { isMobile as checkIsMobile } from "@/lib/utils";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { Button } from "@/components/ui/button";

interface MainLayoutProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * 主布局组件
 */
const MainLayout = React.memo(function MainLayout({ children, className }: MainLayoutProps) {
  const { isCollapsed, isMobileOpen, setMobileOpen, setCollapsed } = useSidebarStore();
  const refreshData = useMockDataStore((state) => state.refreshData);

  // 初始化Mock数据
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // 监听窗口大小变化，自动折叠侧边栏
  useEffect(() => {
    const handleResize = () => {
      if (checkIsMobile()) {
        setCollapsed(true);
      }
    };

    // 初始检查
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [setCollapsed]);

  // 样式配置
  const containerStyles = useMemo(() => ({
    minHeight: '100vh',
    backgroundColor: COLORS.neutral[900],
  }), []);

  const desktopSidebarStyles = useMemo(() => ({
    display: 'none',
    '@media (min-width: 768px)': {
      display: 'block',
    }
  }), []);

  const overlayStyles = useMemo(() => ({
    position: 'fixed' as const,
    inset: 0,
    zIndex: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    '@media (min-width: 768px)': {
      display: 'none',
    }
  }), []);

  const drawerStyles = useMemo(() => ({
    position: 'fixed' as const,
    insetY: 0,
    left: 0,
    zIndex: 50,
    width: '256px',
    '@media (min-width: 768px)': {
      display: 'none',
    }
  }), []);

  const closeButtonContainerStyles = useMemo(() => ({
    position: 'absolute' as const,
    right: SPACING.md,
    top: SPACING.md,
    zIndex: 50,
  }), []);

  const closeButtonStyles = useMemo(() => ({
    color: 'white',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    }
  }), []);

  const mainStyles = useMemo(() => ({
    paddingTop: '4rem',
    transition: `all ${ANIMATION.duration.normal} ${ANIMATION.easing.ease}`,
    paddingLeft: isCollapsed ? '4rem' : '15rem',
    '@media (min-width: 768px)': {
      paddingLeft: isCollapsed ? '4rem' : '15rem',
    }
  }), [isCollapsed]);

  const contentContainerStyles = useMemo(() => ({
    height: 'calc(100vh - 4rem)',
    overflow: 'auto',
    padding: SPACING.lg,
  }), []);

  const contentWrapperStyles = useMemo(() => ({
    margin: '0 auto',
    maxWidth: '1280px',
  }), []);

  return (
    <div style={containerStyles}>
      {/* 桌面端侧边栏 */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* 移动端抽屉式侧边栏 */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            {/* 遮罩层 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            {/* 抽屉 */}
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="fixed inset-y-0 left-0 z-50 w-64 md:hidden"
            >
              <div style={closeButtonContainerStyles}>
                <Button
                  variant="ghost"
                  size="icon"
                  style={closeButtonStyles}
                  onClick={() => setMobileOpen(false)}
                >
                  <X style={{ width: '20px', height: '20px' }} />
                </Button>
              </div>
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 顶部导航栏 */}
      <Header />

      {/* 主内容区域 */}
      <main 
        className={`pt-16 transition-all duration-300 md:pl-16 ${className || ''}`}
        style={{
          paddingLeft: isCollapsed ? '4rem' : '15rem'
        }}
      >
        <div style={contentContainerStyles}>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={contentWrapperStyles}
          >
            {children}
          </motion.div>
        </div>
      </main>
    </div>
  );
});

MainLayout.displayName = 'MainLayout';

export default MainLayout;
