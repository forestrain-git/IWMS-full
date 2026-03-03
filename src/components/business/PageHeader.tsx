/**
 * 页面标题栏组件
 * 包含标题、描述、面包屑和右侧操作按钮
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, ANIMATION, TYPOGRAPHY } from "@/lib/design-tokens";
import { BreadcrumbItem } from "@/types";
import { Separator } from "@/components/ui/separator";

export interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  breadcrumb?: BreadcrumbItem[];
  className?: string;
}

/**
 * 页面标题栏组件
 */
const PageHeader = React.memo(function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
  className,
}: PageHeaderProps) {
  // 样式配置
  const containerStyles = React.useMemo(() => ({
    marginBottom: SPACING.xl,
    display: 'flex',
    flexDirection: 'column' as const,
    gap: SPACING.md,
  }), []);

  const breadcrumbStyles = React.useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.neutral[500],
  }), []);

  const breadcrumbLinkStyles = React.useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    textDecoration: 'none',
    color: COLORS.neutral[500],
    '&:hover': {
      color: COLORS.neutral[900],
    }
  }), []);

  const breadcrumbIconStyles = React.useMemo(() => ({
    marginRight: SPACING.xs,
    width: '16px',
    height: '16px',
  }), []);

  const headerStyles = React.useMemo(() => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: SPACING.md,
    '@media (min-width: 640px)': {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    }
  }), []);

  const titleContainerStyles = React.useMemo(() => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: SPACING.xs,
  }), []);

  const titleStyles = React.useMemo(() => ({
    fontSize: TYPOGRAPHY.fontSize['2xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    letterSpacing: '-0.025em',
    color: COLORS.neutral[900],
    '@media (min-width: 640px)': {
      fontSize: TYPOGRAPHY.fontSize['3xl'],
    }
  }), []);

  const descriptionStyles = React.useMemo(() => ({
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.neutral[500],
    '@media (min-width: 640px)': {
      fontSize: TYPOGRAPHY.fontSize.base,
    }
  }), []);

  const actionsContainerStyles = React.useMemo(() => ({
    display: 'flex',
    flexWrap: 'wrap' as const,
    alignItems: 'center',
    gap: SPACING.sm,
  }), []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      style={containerStyles}
      className={className}
    >
      {/* 面包屑导航 */}
      {breadcrumb && breadcrumb.length > 0 && (
        <nav style={breadcrumbStyles}>
          <Link
            href="/dashboard"
            style={breadcrumbLinkStyles}
          >
            <Home style={breadcrumbIconStyles} />
            首页
          </Link>
          {breadcrumb.map((item, index) => (
            <React.Fragment key={index}>
              <ChevronRight style={{ width: '16px', height: '16px' }} />
              {item.href ? (
                <Link href={item.href} style={breadcrumbLinkStyles}>
                  {item.label}
                </Link>
              ) : (
                <span style={{ color: COLORS.neutral[900] }}>{item.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* 标题栏主体 */}
      <div style={headerStyles}>
        <div style={titleContainerStyles}>
          <h1 style={titleStyles}>
            {title}
          </h1>
          {description && (
            <p style={descriptionStyles}>
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div style={actionsContainerStyles}>{actions}</div>
        )}
      </div>

      <Separator />
    </motion.div>
  );
});

PageHeader.displayName = 'PageHeader';

export default PageHeader;
