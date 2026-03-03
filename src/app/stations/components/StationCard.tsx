/**
 * @file app/stations/components/StationCard.tsx
 * @description 站点卡片（优化版，信息更丰富）
 * @module 模块2:站点管理
 */

import { StatusTag } from "@/components/business/StatusTag";
import { cn, formatDateTime } from "@/lib/utils";
import { useMemo, useCallback } from "react";
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, ANIMATION, TYPOGRAPHY } from "@/lib/design-tokens";
import type { Station } from "../types/station";

interface StationCardProps {
  readonly station: Station;
  readonly onSelect: (station: Station) => void;
  readonly compact?: boolean;
}

export function StationCard({ station, onSelect, compact }: StationCardProps) {
  // 容量颜色
  const capacityColor = useMemo(() => 
    station.capacity > 70 
      ? COLORS.semantic.error
      : station.capacity > 30 
      ? COLORS.status.warning
      : COLORS.status.online,
    [station.capacity]
  );

  // 样式配置
  const cardStyles = useMemo(() => ({
    padding: SPACING.md,
    backgroundColor: `${COLORS.neutral[800]}50`,
    borderRadius: BORDER_RADIUS.xl,
    border: `1px solid ${COLORS.neutral[700]}50`,
    cursor: 'pointer',
    transition: `all ${ANIMATION.duration.fast} ${ANIMATION.easing.ease}`,
    '&:hover': {
      borderColor: COLORS.neutral[600],
      backgroundColor: COLORS.neutral[800],
    }
  }), []);

  const headerStyles = useMemo(() => ({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  }), []);

  const titleStyles = useMemo(() => ({
    fontWeight: TYPOGRAPHY.fontWeight.semibold,
    color: COLORS.neutral[200],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    flex: 1,
    minWidth: 0,
    '&:hover': {
      color: COLORS.neutral[100],
    }
  }), []);

  const addressStyles = useMemo(() => ({
    fontSize: TYPOGRAPHY.fontSize.sm,
    color: COLORS.neutral[500],
    marginBottom: SPACING.sm,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    '&:hover': {
      color: COLORS.neutral[400],
    }
  }), []);

  const progressContainerStyles = useMemo(() => ({
    marginBottom: SPACING.md,
  }), []);

  const progressHeaderStyles = useMemo(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: TYPOGRAPHY.fontSize.xs,
    marginBottom: '6px',
  }), []);

  const progressLabelStyles = useMemo(() => ({
    color: COLORS.neutral[400],
  }), []);

  const progressValueStyles = useMemo(() => ({
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: station.capacity > 70 ? COLORS.semantic.error : COLORS.neutral[300],
  }), []);

  const progressBarStyles = useMemo(() => ({
    height: '8px',
    backgroundColor: COLORS.neutral[700],
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
  }), []);

  const progressFillStyles = useMemo(() => ({
    height: '100%',
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: capacityColor,
    transition: `all ${ANIMATION.duration.slow} ${ANIMATION.easing.ease}`,
    width: `${station.capacity}%`,
  }), []);

  const footerStyles = useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: SPACING.sm,
    borderTop: `1px solid ${COLORS.neutral[700]}50`,
  }), []);

  const statItemStyles = useMemo(() => ({
    display: 'flex',
    flexDirection: 'column' as const,
  }), []);

  const statLabelStyles = useMemo(() => ({
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.neutral[500],
  }), []);

  const statValueStyles = useMemo(() => ({
    fontSize: TYPOGRAPHY.fontSize.sm,
    fontWeight: TYPOGRAPHY.fontWeight.medium,
    color: COLORS.neutral[300],
  }), []);

  const handleClick = useCallback(() => {
    onSelect(station);
  }, [station, onSelect]);

  return (
    <div
      onClick={handleClick}
      style={cardStyles}
    >
      {/* 头部：状态标签 + 名称 */}
      <div style={headerStyles}>
        <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm, flex: 1, minWidth: 0 }}>
          <StatusTag status={station.status} size="sm" />
          <h3 style={titleStyles}>
            {station.name}
          </h3>
        </div>
      </div>

      {/* 地址 */}
      {!compact && (
        <p style={addressStyles}>
          {station.address}
        </p>
      )}

      {/* 容量进度条 */}
      <div style={progressContainerStyles}>
        <div style={progressHeaderStyles}>
          <span style={progressLabelStyles}>容量</span>
          <span style={progressValueStyles}>
            {station.capacity}%
          </span>
        </div>
        <div style={progressBarStyles}>
          <div style={progressFillStyles} />
        </div>
      </div>

      {/* 底部统计 */}
      {!compact && (
        <div style={footerStyles}>
          <div style={statItemStyles}>
            <div style={statLabelStyles}>今日处理</div>
            <div style={statValueStyles}>{station.dailyVolume} 吨</div>
          </div>
          <div style={{ textAlign: 'right' as const, ...statItemStyles }}>
            <div style={statLabelStyles}>最近收运</div>
            <div style={statValueStyles}>
              {formatDateTime(station.lastCollection, "relative")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StationCard;
