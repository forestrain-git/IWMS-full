/**
 * 数据指标卡片组件
 * 用于展示关键业务指标
 */

"use client";

import * as React from "react";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { cn, formatNumber, formatPercent } from "@/lib/utils";
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, ANIMATION, TYPOGRAPHY } from "@/lib/design-tokens";
import { ColorTheme } from "@/types";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * 颜色主题配置
 */
const colorConfig: Record<
  ColorTheme,
  { bg: string; iconBg: string; text: string }
> = {
  blue: {
    bg: `${COLORS.primary[50]}20`,
    iconBg: `${COLORS.primary[500]}10`,
    text: COLORS.primary[600],
  },
  green: {
    bg: `${COLORS.status.online}20`,
    iconBg: `${COLORS.status.online}10`,
    text: COLORS.status.online,
  },
  amber: {
    bg: `${COLORS.status.warning}20`,
    iconBg: `${COLORS.status.warning}10`,
    text: COLORS.status.warning,
  },
  red: {
    bg: `${COLORS.semantic.error}20`,
    iconBg: `${COLORS.semantic.error}10`,
    text: COLORS.semantic.error,
  },
  purple: {
    bg: `${COLORS.neutral[500]}20`,
    iconBg: `${COLORS.neutral[500]}10`,
    text: COLORS.neutral[600],
  },
  slate: {
    bg: `${COLORS.neutral[100]}50`,
    iconBg: `${COLORS.neutral[500]}10`,
    text: COLORS.neutral[600],
  },
};

export interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: number;
  trendLabel?: string;
  icon: LucideIcon;
  color: ColorTheme;
  loading?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * 数据指标卡片组件
 */
export function StatCard({
  title,
  value,
  unit,
  trend,
  trendLabel,
  icon: Icon,
  color,
  loading = false,
  onClick,
  className,
}: StatCardProps) {
  const colors = colorConfig[color];

  // 样式配置
  const loadingCardStyles = React.useMemo(() => ({
    padding: SPACING.lg,
  }), []);

  const loadingContentStyles = React.useMemo(() => ({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  }), []);

  const loadingInfoStyles = React.useMemo(() => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: SPACING.sm,
  }), []);

  const containerStyles = React.useMemo(() => ({
    cursor: onClick ? 'pointer' : 'default',
  }), []);

  const cardStyles = React.useMemo(() => ({
    position: 'relative' as const,
    overflow: 'hidden',
    padding: SPACING.lg,
    transition: `all ${ANIMATION.duration.normal} ${ANIMATION.easing.ease}`,
    backgroundColor: colors.bg,
    '&:hover': {
      boxShadow: SHADOWS.lg,
    }
  }), [colors]);

  const backgroundDecorationStyles = React.useMemo(() => ({
    position: 'absolute' as const,
    right: `-${SPACING.lg}`,
    top: `-${SPACING.lg}`,
    width: '96px',
    height: '96px',
    borderRadius: BORDER_RADIUS.full,
    opacity: 0.2,
    backgroundColor: colors.iconBg,
  }), [colors]);

  const contentStyles = React.useMemo(() => ({
    position: 'relative' as const,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  }), []);

  const infoStyles = React.useMemo(() => ({
    display: 'flex',
    flexDirection: 'column' as const,
    gap: SPACING.sm,
  }), []);

  const titleStyles = React.useMemo(() => ({
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.neutral[500],
  }), []);

  const valueContainerStyles = React.useMemo(() => ({
    display: 'flex',
    alignItems: 'baseline',
    gap: SPACING.xs,
  }), []);

  const valueStyles = React.useMemo(() => ({
    fontSize: TYPOGRAPHY.fontSize['3xl'],
    fontWeight: TYPOGRAPHY.fontWeight.bold,
    letterSpacing: '-0.025em',
    color: COLORS.neutral[900],
  }), []);

  const unitStyles = React.useMemo(() => ({
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.neutral[500],
  }), []);

  const trendContainerStyles = React.useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.xs,
  }), []);

  const trendStyles = React.useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
    fontSize: TYPOGRAPHY.fontSize.xs,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: trend !== undefined && trend >= 0 ? COLORS.status.online : COLORS.semantic.error,
  }), []);

  const trendLabelStyles = React.useMemo(() => ({
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.neutral[500],
  }), []);

  const iconContainerStyles = React.useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '48px',
    height: '48px',
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: colors.iconBg,
  }), [colors]);

  const iconStyles = React.useMemo(() => ({
    width: '24px',
    height: '24px',
  }), []);

  if (loading) {
    return (
      <Card style={loadingCardStyles} className={className}>
        <div style={loadingContentStyles}>
          <div style={loadingInfoStyles}>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-32" />
          </div>
          <Skeleton className="h-12 w-12" style={{ borderRadius: BORDER_RADIUS.xl }} />
        </div>
      </Card>
    );
  }

  const isPositiveTrend = trend !== undefined && trend >= 0;
  const formattedValue = typeof value === "number" ? formatNumber(value) : value;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      style={containerStyles}
      className={className}
      onClick={onClick}
    >
      <Card style={cardStyles}>
        {/* 背景装饰 */}
        <div style={backgroundDecorationStyles} />

        <div style={contentStyles}>
          <div style={infoStyles}>
            {/* 标题 */}
            <p style={titleStyles}>{title}</p>

            {/* 数值 */}
            <div style={valueContainerStyles}>
              <span style={valueStyles}>
                {formattedValue}
              </span>
              {unit && (
                <span style={unitStyles}>
                  {unit}
                </span>
              )}
            </div>

            {/* 趋势 */}
            {trend !== undefined && (
              <div style={trendContainerStyles}>
                <span style={trendStyles}>
                  {isPositiveTrend ? (
                    <TrendingUp style={{ width: '14px', height: '14px' }} />
                  ) : (
                    <TrendingDown style={{ width: '14px', height: '14px' }} />
                  )}
                  {formatPercent(Math.abs(trend))}
                </span>
                {trendLabel && (
                  <span style={trendLabelStyles}>
                    {trendLabel}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* 图标 */}
          <div style={iconContainerStyles}>
            <Icon style={iconStyles} />
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default StatCard;
