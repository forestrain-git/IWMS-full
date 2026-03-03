/**
 * @file app/dashboard/components/EnvironmentalPanel.tsx
 * @description 环保面板（高端科技风格）
 * @module 模块1:监管驾驶舱
 */

import { Wind, AlertTriangle } from "lucide-react";
import { useMemo, useCallback } from "react";
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, ANIMATION, TYPOGRAPHY } from "@/lib/design-tokens";
import type { GasMonitoring } from "../types/dashboard";

interface EnvironmentalPanelProps {
  readonly data: GasMonitoring;
}

const GAS_CONFIG = [
  { key: "nh3" as const, label: "NH₃", name: "氨气", unit: "ppm", max: 2.0, color: `from-blue-500 to-cyan-400` },
  { key: "h2s" as const, label: "H₂S", name: "硫化氢", unit: "ppm", max: 0.5, color: `from-purple-500 to-pink-400` },
  { key: "ch4" as const, label: "CH₄", name: "甲烷", unit: "%", max: 5.0, color: `from-amber-500 to-orange-400` },
  { key: "pm25" as const, label: "PM2.5", name: "颗粒物", unit: "μg/m³", max: 100, color: `from-emerald-500 to-teal-400` },
];

export function EnvironmentalPanel({ data }: EnvironmentalPanelProps) {
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

  const liveIndicatorStyles = useMemo(() => ({
    fontSize: TYPOGRAPHY.fontSize.xs,
    color: COLORS.status.online,
    display: 'flex',
    alignItems: 'center',
    gap: '2px',
  }), []);

  const liveDotStyles = useMemo(() => ({
    width: '6px',
    height: '6px',
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.status.online,
    animation: 'pulse 2s infinite',
  }), []);

  const gasItemStyles = useMemo(() => ({
    marginBottom: SPACING.md,
  }), []);

  const labelRowStyles = useMemo(() => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  }), []);

  const progressBarStyles = useMemo(() => ({
    height: '10px',
    backgroundColor: COLORS.neutral[800],
    borderRadius: BORDER_RADIUS.full,
    overflow: 'hidden',
    position: 'relative' as const,
  }), []);

  const progressFillStyles = useCallback((percentage: number, color: string) => ({
    height: '100%',
    borderRadius: BORDER_RADIUS.full,
    background: `linear-gradient(90deg, ${color})`,
    transition: `all ${ANIMATION.duration.slow} ${ANIMATION.easing.ease}`,
    width: `${percentage}%`,
    position: 'relative' as const,
  }), []);

  const shineEffectStyles = useMemo(() => ({
    position: 'absolute' as const,
    inset: 0,
    background: 'linear-gradient(180deg, rgba(255,255,255,0.3) 0%, transparent 100%)',
  }), []);

  const scaleStyles = useMemo(() => ({
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: SPACING.xs,
    fontSize: '10px',
    color: COLORS.neutral[600],
  }), []);

  return (
    <div style={containerStyles}>
      {/* 头部 */}
      <div style={headerStyles}>
        <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm }}>
          <div style={iconContainerStyles}>
            <Wind style={{
              width: '16px',
              height: '16px',
              color: COLORS.status.warning
            }} />
          </div>
          <span style={{
            color: COLORS.neutral[200],
            fontWeight: TYPOGRAPHY.fontWeight.medium
          }}>
            环境监测
          </span>
        </div>
        <div style={liveIndicatorStyles}>
          <span style={liveDotStyles} />
          实时
        </div>
      </div>

      {/* 气体指标 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: SPACING.md }}>
        {GAS_CONFIG.map((gas) => {
          const value = data[gas.key];
          const percentage = Math.min((value / gas.max) * 100, 100);
          const isWarning = percentage > 70;

          return (
            <div key={gas.key} style={gasItemStyles}>
              {/* 标签行 */}
              <div style={labelRowStyles}>
                <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm }}>
                  <span style={{
                    fontSize: TYPOGRAPHY.fontSize.sm,
                    fontWeight: TYPOGRAPHY.fontWeight.medium,
                    color: COLORS.neutral[300]
                  }}>
                    {gas.label}
                  </span>
                  <span style={{
                    fontSize: TYPOGRAPHY.fontSize.xs,
                    color: COLORS.neutral[500]
                  }}>
                    {gas.name}
                  </span>
                  {isWarning && <AlertTriangle style={{
                    width: '14px',
                    height: '14px',
                    color: COLORS.status.warning
                  }} />}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '2px' }}>
                  <span style={{
                    fontSize: TYPOGRAPHY.fontSize.lg,
                    fontWeight: TYPOGRAPHY.fontWeight.bold,
                    fontVariantNumeric: 'tabular-nums',
                    color: isWarning ? COLORS.status.warning : COLORS.neutral[200]
                  }}>
                    {value}
                  </span>
                  <span style={{
                    fontSize: TYPOGRAPHY.fontSize.xs,
                    color: COLORS.neutral[500]
                  }}>
                    {gas.unit}
                  </span>
                </div>
              </div>

              {/* 进度条背景 */}
              <div style={progressBarStyles}>
                {/* 进度条 */}
                <div style={progressFillStyles(percentage, gas.color)}>
                  {/* 光泽效果 */}
                  <div style={shineEffectStyles} />
                </div>
              </div>

              {/* 刻度标记 */}
              <div style={scaleStyles}>
                <span>0</span>
                <span>{gas.max / 2}</span>
                <span>{gas.max}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default EnvironmentalPanel;
