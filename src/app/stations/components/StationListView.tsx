/**
 * @file app/stations/components/StationListView.tsx
 * @description 列表视图（优化版）
 * @module 模块2:站点管理
 */

import { StationCard } from "./StationCard";
import { MapPin } from "lucide-react";
import { useMemo } from "react";
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, ANIMATION, TYPOGRAPHY } from "@/lib/design-tokens";
import type { Station } from "../types/station";

type CardMode = "compact" | "detailed";

interface StationListViewProps {
  readonly stations: Station[];
  readonly onStationSelect: (station: Station) => void;
  readonly cardMode?: CardMode;
}

export function StationListView({ stations, onStationSelect, cardMode }: StationListViewProps) {
  // 样式配置
  const emptyContainerStyles = useMemo(() => ({
    height: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }), []);

  const emptyContentStyles = useMemo(() => ({
    textAlign: 'center' as const,
  }), []);

  const iconContainerStyles = useMemo(() => ({
    width: '64px',
    height: '64px',
    backgroundColor: COLORS.neutral[800],
    borderRadius: BORDER_RADIUS.full,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: `0 auto ${SPACING.md}`,
  }), []);

  const listContainerStyles = useMemo(() => ({
    height: '100%',
    overflow: 'auto',
    padding: SPACING.md,
  }), []);

  const gridStyles = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: SPACING.md,
  }), []);

  if (stations.length === 0) {
    return (
      <div style={emptyContainerStyles}>
        <div style={emptyContentStyles}>
          <div style={iconContainerStyles}>
            <MapPin style={{
              width: '32px',
              height: '32px',
              color: COLORS.neutral[600]
            }} />
          </div>
          <div style={{
            color: COLORS.neutral[400],
            fontWeight: TYPOGRAPHY.fontWeight.medium
          }}>
            没有找到符合条件的站点
          </div>
          <div style={{
            fontSize: TYPOGRAPHY.fontSize.sm,
            color: COLORS.neutral[600],
            marginTop: SPACING.xs
          }}>
            请调整筛选条件
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={listContainerStyles}>
      <div style={gridStyles}>
        {stations.map((station) => (
          <StationCard
            key={station.id}
            station={station}
            onSelect={onStationSelect}
            compact={cardMode === "compact"}
          />
        ))}
      </div>
    </div>
  );
}

export default StationListView;
