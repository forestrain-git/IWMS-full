/**
 * 状态标签组件
 * 用于显示设备、站点等的状态
 */

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, ANIMATION, TYPOGRAPHY } from "@/lib/design-tokens";
import { StationStatus } from "@/types";
import { STATION_STATUS_CONFIG } from "@/lib/constants";

export type StatusTagSize = "sm" | "md" | "lg";

export interface StatusTagProps {
  status: StationStatus;
  size?: StatusTagSize;
  showLabel?: boolean;
  pulse?: boolean;
  className?: string;
}

/**
 * 尺寸配置
 */
const sizeConfig: Record<
  StatusTagSize,
  { dot: { width: string; height: string }; text: { fontSize: string }; padding: string }
> = {
  sm: {
    dot: { width: '6px', height: '6px' },
    text: { fontSize: TYPOGRAPHY.fontSize.xs },
    padding: `${SPACING.xs} ${SPACING.xs} ${SPACING.xs} ${SPACING.sm}`,
  },
  md: {
    dot: { width: '8px', height: '8px' },
    text: { fontSize: TYPOGRAPHY.fontSize.sm },
    padding: `${SPACING.xs} ${SPACING.sm}`,
  },
  lg: {
    dot: { width: '10px', height: '10px' },
    text: { fontSize: TYPOGRAPHY.fontSize.base },
    padding: `${SPACING.sm} ${SPACING.md}`,
  },
};

/**
 * 状态标签组件
 */
export function StatusTag({
  status,
  size = "md",
  showLabel = true,
  pulse = true,
  className,
}: StatusTagProps) {
  const config = STATION_STATUS_CONFIG[status];
  const sizes = sizeConfig[size];

  // 判断是否需要闪烁动画
  const needsAnimation = pulse && (status === "warning" || status === "danger");

  // 样式配置
  const containerStyles = React.useMemo(() => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    padding: sizes.padding,
    fontSize: sizes.text.fontSize,
    backgroundColor: config.bgColor,
    color: config.color,
  }), [config, sizes]);

  const dotContainerStyles = React.useMemo(() => ({
    position: 'relative' as const,
    display: 'flex',
    width: '8px',
    height: '8px',
  }), []);

  const dangerDotStyles = React.useMemo(() => ({
    position: 'absolute' as const,
    display: 'inline-flex',
    width: '100%',
    height: '100%',
    borderRadius: BORDER_RADIUS.full,
    opacity: 0.75,
    backgroundColor: config.dotColor,
  }), [config]);

  const statusDotStyles = React.useMemo(() => ({
    position: 'relative' as const,
    display: 'inline-flex',
    borderRadius: BORDER_RADIUS.full,
    width: sizes.dot.width,
    height: sizes.dot.height,
    backgroundColor: config.dotColor,
  }), [config, sizes]);

  return (
    <span style={containerStyles} className={className}>
      {/* 状态指示点 */}
      <span style={dotContainerStyles}>
        {needsAnimation && status === "danger" && (
          <motion.span
            style={dangerDotStyles}
            className="animate-ping"
          />
        )}
        <motion.span
          style={statusDotStyles}
          animate={
            needsAnimation && status === "warning"
              ? { opacity: [1, 0.4, 1] }
              : {}
          }
          transition={
            needsAnimation && status === "warning"
              ? { duration: 1.5, repeat: Infinity }
              : {}
          }
        />
      </span>

      {/* 状态文字 */}
      {showLabel && <span>{config.label}</span>}
    </span>
  );
}

export default StatusTag;
