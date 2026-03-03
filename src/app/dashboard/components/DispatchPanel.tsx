/**
 * @file app/dashboard/components/DispatchPanel.tsx
 * @description 调度面板（高端科技风格）
 * @module 模块1:监管驾驶舱
 */

import { Truck, Navigation } from "lucide-react";
import { StatusTag } from "@/components/business/StatusTag";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMemo, useCallback } from "react";
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, ANIMATION, TYPOGRAPHY } from "@/lib/design-tokens";
import type { Vehicle } from "../types/dashboard";

interface DispatchPanelProps {
  readonly vehicles: Vehicle[];
}

const STATUS_MAP: Record<string, { status: "online" | "offline" | "warning" | "danger" | "maintenance"; label: string; color: string }> = {
  idle: { status: "online", label: "空闲", color: COLORS.status.online },
  loading: { status: "warning", label: "装载中", color: COLORS.status.warning },
  transporting: { status: "online", label: "运输中", color: COLORS.primary[400] },
  maintenance: { status: "maintenance", label: "维护中", color: COLORS.neutral[400] },
};

export function DispatchPanel({ vehicles }: DispatchPanelProps) {
  // 样式配置
  const containerStyles = useMemo(() => ({
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
  }), []);

  const headerStyles = useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    paddingBottom: SPACING.sm,
    borderBottom: `1px solid ${COLORS.neutral[700]}50`,
  }), []);

  const iconContainerStyles = useMemo(() => ({
    padding: '6px',
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: `${COLORS.primary[500]}20`,
  }), []);

  const badgeStyles = useMemo(() => ({
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.neutral[500],
    backgroundColor: `${COLORS.neutral[800]}50`,
    padding: `${SPACING.xs} ${SPACING.sm}`,
    borderRadius: BORDER_RADIUS.sm,
  }), []);

  const vehicleItemStyles = useCallback((index: number) => ({
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.sm,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: `${COLORS.neutral[800]}30`,
    border: `1px solid ${COLORS.neutral[700]}30`,
    cursor: 'pointer',
    transition: `all ${ANIMATION.duration.fast} ${ANIMATION.easing.ease}`,
    animationDelay: `${index * 50}ms`,
    '&:hover': {
      backgroundColor: `${COLORS.neutral[800]}50`,
      borderColor: `${COLORS.neutral[600]}50`,
    }
  }), []);

  const vehicleIconStyles = useMemo(() => ({
    position: 'relative' as const,
  }), []);

  const iconBgStyles = useMemo(() => ({
    width: '40px',
    height: '40px',
    borderRadius: BORDER_RADIUS.xl,
    background: `linear-gradient(135deg, ${COLORS.primary[500]}20, ${COLORS.primary[600]}10)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }), []);

  const statusDotStyles = useCallback((status: string) => ({
    position: 'absolute' as const,
    top: '-4px',
    right: '-4px',
    width: '12px',
    height: '12px',
    borderRadius: BORDER_RADIUS.full,
    border: `2px solid ${COLORS.neutral[900]}`,
    backgroundColor: status === 'transporting' ? COLORS.status.online : COLORS.neutral[500],
    animation: status === 'transporting' ? 'pulse 2s infinite' : 'none',
  }), []);

  return (
    <div style={containerStyles}>
      {/* 头部 */}
      <div style={headerStyles}>
        <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm }}>
          <div style={iconContainerStyles}>
            <Truck style={{
              width: '16px',
              height: '16px',
              color: COLORS.primary[400]
            }} />
          </div>
          <span style={{
            color: COLORS.neutral[200],
            fontWeight: TYPOGRAPHY.fontWeight.medium
          }}>
            车辆调度
          </span>
        </div>
        <span style={badgeStyles}>
          共 {vehicles.length} 辆
        </span>
      </div>

      {/* 列表 */}
      <ScrollArea className="flex-1 -mx-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm, padding: `0 ${SPACING.sm}` }}>
          {vehicles.map((vehicle, index) => {
            const statusConfig = STATUS_MAP[vehicle.status];
            return (
              <div
                key={vehicle.id}
                style={vehicleItemStyles(index)}
              >
                {/* 车辆图标 */}
                <div style={vehicleIconStyles}>
                  <div style={iconBgStyles}>
                    <Truck style={{
                      width: '20px',
                      height: '20px',
                      color: COLORS.primary[400]
                    }} />
                  </div>
                  {/* 在线指示灯 */}
                  <div style={statusDotStyles(vehicle.status)} />
                </div>

                {/* 信息 */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm }}>
                    <span style={{
                      fontWeight: TYPOGRAPHY.fontWeight.medium,
                      color: COLORS.neutral[200]
                    }}>
                      {vehicle.plateNumber}
                    </span>
                    <StatusTag status={statusConfig.status} size="sm" />
                  </div>
                  <div style={{
                    fontSize: TYPOGRAPHY.fontSize.xs,
                    color: COLORS.neutral[500],
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    marginTop: '2px'
                  }}>
                    <Navigation style={{ width: '12px', height: '12px' }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {vehicle.location}
                    </span>
                  </div>
                </div>

                {/* 状态文字 */}
                <div style={{
                  fontSize: TYPOGRAPHY.fontSize.xs,
                  fontWeight: TYPOGRAPHY.fontWeight.medium,
                  color: statusConfig.color
                }}>
                  {statusConfig.label}
                </div>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}

export default DispatchPanel;
