/**
 * @file app/dashboard/components/EventPanel.tsx
 * @description 事件面板（高端科技风格）
 * @module 模块1:监管驾驶舱
 */

import { Bell, AlertCircle } from "lucide-react";
import { StatusTag } from "@/components/business/StatusTag";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDateTime } from "@/lib/utils";
import { useMemo, useCallback } from "react";
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, ANIMATION, TYPOGRAPHY } from "@/lib/design-tokens";
import type { Alert } from "@/types";

interface EventPanelProps {
  readonly alerts: Alert[];
}

const LEVEL_CONFIG: Record<string, { status: "online" | "offline" | "warning" | "danger" | "maintenance"; color: string; bg: string }> = {
  critical: { status: "danger", color: COLORS.semantic.error, bg: `${COLORS.semantic.error}10` },
  high: { status: "warning", color: COLORS.status.warning, bg: `${COLORS.status.warning}10` },
  medium: { status: "warning", color: COLORS.status.warning, bg: `${COLORS.status.warning}10` },
  low: { status: "online", color: COLORS.primary[400], bg: `${COLORS.primary[500]}10` },
};

const TYPE_ICONS: Record<string, string> = {
  fullness: "🗑️",
  offline: "📡",
  fault: "⚙️",
  illegal: "🚫",
  fire: "🔥",
};

export function EventPanel({ alerts }: EventPanelProps) {
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
    backgroundColor: `${COLORS.status.warning}20`,
  }), []);

  const badgeStyles = useMemo(() => ({
    fontSize: TYPOGRAPHY.fontSize.xs,
    backgroundColor: `${COLORS.status.warning}20`,
    color: COLORS.status.warning,
    padding: `${SPACING.xs} ${SPACING.sm}`,
    borderRadius: BORDER_RADIUS.sm,
  }), []);

  const alertItemStyles = useCallback((level: typeof LEVEL_CONFIG[string], index: number) => ({
    display: 'flex',
    alignItems: 'flex-start',
    gap: SPACING.sm,
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.xl,
    backgroundColor: level.bg,
    border: `1px solid ${COLORS.neutral[700]}30`,
    cursor: 'pointer',
    transition: `all ${ANIMATION.duration.fast} ${ANIMATION.easing.ease}`,
    animationDelay: `${index * 100}ms`,
    '&:hover': {
      borderColor: `${COLORS.neutral[600]}50`,
    }
  }), []);

  const iconStyles = useMemo(() => ({
    width: '32px',
    height: '32px',
    borderRadius: BORDER_RADIUS.lg,
    backgroundColor: `${COLORS.neutral[900]}50`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    flexShrink: 0,
  }), []);

  const emptyStateStyles = useMemo(() => ({
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    padding: `${SPACING.xl} 0`,
    color: COLORS.neutral[500],
  }), []);

  return (
    <div style={containerStyles}>
      {/* 头部 */}
      <div style={headerStyles}>
        <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm }}>
          <div style={iconContainerStyles}>
            <Bell style={{
              width: '16px',
              height: '16px',
              color: COLORS.status.warning
            }} />
          </div>
          <span style={{
            color: COLORS.neutral[200],
            fontWeight: TYPOGRAPHY.fontWeight.medium
          }}>
            最近事件
          </span>
        </div>
        <span style={badgeStyles}>
          {alerts.length} 条未读
        </span>
      </div>

      {/* 事件列表 */}
      <ScrollArea className="flex-1 -mx-2">
        <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.sm, padding: `0 ${SPACING.sm}` }}>
          {alerts.length === 0 ? (
            <div style={emptyStateStyles}>
              <AlertCircle style={{
                width: '40px',
                height: '40px',
                marginBottom: SPACING.sm,
                opacity: 0.3
              }} />
              <span style={{ fontSize: TYPOGRAPHY.fontSize.sm }}>
                暂无告警事件
              </span>
            </div>
          ) : (
            alerts.map((alert, index) => {
              const level = LEVEL_CONFIG[alert.level] || LEVEL_CONFIG.low;
              const icon = TYPE_ICONS[alert.type] || "⚠️";
              
              return (
                <div
                  key={alert.id}
                  style={alertItemStyles(level, index)}
                >
                  {/* 图标 */}
                  <div style={iconStyles}>
                    {icon}
                  </div>

                  {/* 内容 */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: SPACING.sm,
                      marginBottom: '2px'
                    }}>
                      <span style={{
                        fontSize: TYPOGRAPHY.fontSize.sm,
                        fontWeight: TYPOGRAPHY.fontWeight.medium,
                        color: COLORS.neutral[200],
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {alert.stationName}
                      </span>
                      <StatusTag status={level.status} size="sm" />
                    </div>
                    <p style={{
                      fontSize: TYPOGRAPHY.fontSize.xs,
                      color: COLORS.neutral[400],
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: TYPOGRAPHY.lineHeight.tight,
                    }}>
                      {alert.message}
                    </p>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: SPACING.sm
                    }}>
                      <span style={{
                        fontSize: '10px',
                        color: COLORS.neutral[500]
                      }}>
                        {formatDateTime(alert.timestamp, "relative")}
                      </span>
                      <span style={{
                        fontSize: '10px',
                        fontWeight: TYPOGRAPHY.fontWeight.medium,
                        color: level.color
                      }}>
                        {alert.level === "critical" ? "紧急" : alert.level === "high" ? "高" : "中"}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

export default EventPanel;
