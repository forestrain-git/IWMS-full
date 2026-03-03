/**
 * @file app/dashboard/components/OperationalLayer.tsx
 * @description 操作层（高端优化版）
 * @module 模块1:监管驾驶舱
 */

import { DispatchPanel } from "./DispatchPanel";
import { EnvironmentalPanel } from "./EnvironmentalPanel";
import { EventPanel } from "./EventPanel";
import { useMemo } from "react";
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, ANIMATION } from "@/lib/design-tokens";
import type { Vehicle, GasMonitoring } from "../types/dashboard";
import type { Alert } from "@/types";

interface OperationalLayerProps {
  readonly vehicles: Vehicle[];
  readonly gasMonitoring: GasMonitoring;
  readonly alerts: Alert[];
}

export function OperationalLayer({ vehicles, gasMonitoring, alerts }: OperationalLayerProps) {
  // 容器样式
  const containerStyles = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: SPACING.sm,
    height: '35%',
    minHeight: '200px',
  }), []);

  const panelStyles = useMemo(() => ({
    borderRadius: '24px',
    border: `1px solid ${COLORS.neutral[700]}50`,
    backgroundColor: `${COLORS.neutral[900]}30`,
    backdropFilter: 'blur(10px)',
    padding: SPACING.md,
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    transition: `all ${ANIMATION.duration.normal} ${ANIMATION.easing.ease}`,
  }), []);

  return (
    <div style={containerStyles}>
      {/* 车辆调度 */}
      <div style={panelStyles}>
        <DispatchPanel vehicles={vehicles} />
      </div>

      {/* 环境监测 */}
      <div style={panelStyles}>
        <EnvironmentalPanel data={gasMonitoring} />
      </div>

      {/* 最近事件 */}
      <div style={panelStyles}>
        <EventPanel alerts={alerts} />
      </div>
    </div>
  );
}

export default OperationalLayer;
