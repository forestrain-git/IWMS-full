/**
 * @file app/dashboard/components/StrategicLayer.tsx
 * @description 战略层：4个智能KPI卡片（优化版）
 * @module 模块1:监管驾驶舱
 */

import { TrendingUp, Activity, AlertTriangle, Leaf } from "lucide-react";
import { motion } from "framer-motion";
import { formatNumber } from "@/lib/utils";
import { useMemo, useCallback } from "react";
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, ANIMATION, TYPOGRAPHY } from "@/lib/design-tokens";
import type { DashboardKPI } from "../types/dashboard";

interface StrategicLayerProps {
  readonly kpi: DashboardKPI;
  readonly isLoading?: boolean;
}

// KPI配置
const KPI_CONFIG = [
  {
    key: "dailyVolume",
    title: "日处理量",
    icon: TrendingUp,
    gradient: `from-blue-500/20 to-cyan-500/20`,
    iconBg: COLORS.primary[100],
    iconColor: COLORS.primary[500],
    borderColor: COLORS.primary[300],
    glowColor: SHADOWS.md,
  },
  {
    key: "onlineRate",
    title: "设备在线率",
    icon: Activity,
    gradient: `from-emerald-500/20 to-green-500/20`,
    iconBg: `${COLORS.status.online}20`,
    iconColor: COLORS.status.online,
    borderColor: `${COLORS.status.online}30`,
    glowColor: SHADOWS.md,
  },
  {
    key: "alertRate",
    title: "告警处理率",
    icon: AlertTriangle,
    gradient: `from-amber-500/20 to-orange-500/20`,
    iconBg: `${COLORS.status.warning}20`,
    iconColor: COLORS.status.warning,
    borderColor: `${COLORS.status.warning}30`,
    glowColor: SHADOWS.md,
  },
  {
    key: "carbonReduction",
    title: "碳减排贡献",
    icon: Leaf,
    gradient: `from-teal-500/20 to-emerald-500/20`,
    iconBg: `${COLORS.semantic.success}20`,
    iconColor: COLORS.semantic.success,
    borderColor: `${COLORS.semantic.success}30`,
    glowColor: SHADOWS.md,
  },
];

export function StrategicLayer({ kpi, isLoading }: StrategicLayerProps) {
  const treeEquivalent = useMemo(() => 
    Math.round((kpi.carbonReduction.value * 1000) / 18),
    [kpi.carbonReduction.value]
  );

  const kpiData = useMemo(() => {
    const data = [
      { ...KPI_CONFIG[0], value: kpi.dailyVolume.value, unit: kpi.dailyVolume.unit, trend: kpi.dailyVolume.trend, trendLabel: kpi.dailyVolume.trendLabel },
      { ...KPI_CONFIG[1], value: kpi.onlineRate.value, unit: "%", trend: kpi.onlineRate.trend, trendLabel: kpi.onlineRate.trendLabel },
      { ...KPI_CONFIG[2], value: 100 - kpi.alertRate.value, unit: "%", trend: -kpi.alertRate.trend, trendLabel: "24小时统计" },
      { ...KPI_CONFIG[3], value: kpi.carbonReduction.value, unit: kpi.carbonReduction.unit, trend: kpi.carbonReduction.trend, trendLabel: kpi.carbonReduction.trendLabel, extra: `≈ ${treeEquivalent} 棵树` },
    ];
    return data as any[];
  }, [kpi, treeEquivalent]);

  const containerStyles = useMemo(() => ({
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: SPACING.md,
  }), []);

  const getCardStyles = useCallback((item: typeof KPI_CONFIG[0]) => ({
    position: 'relative' as const,
    overflow: 'hidden',
    borderRadius: BORDER_RADIUS.lg,
    border: `1px solid ${item.borderColor}`,
    background: `linear-gradient(135deg, ${item.gradient})`,
    backdropFilter: 'blur(10px)',
    padding: SPACING.lg,
    cursor: 'pointer',
    boxShadow: item.glowColor,
    transition: `all ${ANIMATION.duration.normal} ${ANIMATION.easing.ease}`,
  }), []);

  return (
    <div style={containerStyles}>
      {kpiData.map((item, index) => {
        const Icon = item.icon;
        const isPositive = (item.trend || 0) >= 0;
        
        return (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02, y: -2 }}
            style={getCardStyles(item)}
          >
            {/* 背景光效 */}
            <div 
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 100%)',
                opacity: 0,
                transition: `opacity ${ANIMATION.duration.normal} ${ANIMATION.easing.ease}`,
              }}
              className="group-hover:opacity-100"
            />
            
            {/* 角落装饰 */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: '80px',
                height: '80px',
                background: `linear-gradient(135deg, ${item.gradient})`,
                opacity: 0.3,
                borderBottomLeftRadius: BORDER_RADIUS.full,
              }}
            />
            
            {/* 内容 */}
            <div style={{ position: 'relative' }}>
              {/* 头部：标题+图标 */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                marginBottom: SPACING.sm 
              }}>
                <span style={{
                  color: COLORS.neutral[400],
                  fontSize: TYPOGRAPHY.fontSize.sm,
                  fontWeight: TYPOGRAPHY.fontWeight.medium
                }}>
                  {item.title}
                </span>
                <div style={{
                  backgroundColor: item.iconBg,
                  padding: SPACING.sm,
                  borderRadius: BORDER_RADIUS.md
                }}>
                  <Icon style={{
                    width: '20px',
                    height: '20px',
                    color: item.iconColor
                  }} />
                </div>
              </div>
              
              {/* 数值 */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'baseline',
                gap: SPACING.xs,
                marginBottom: SPACING.sm 
              }}>
                <span style={{
                  fontSize: TYPOGRAPHY.fontSize['3xl'],
                  fontWeight: TYPOGRAPHY.fontWeight.bold,
                  color: 'white',
                  letterSpacing: '-0.025em'
                }}>
                  {isLoading ? "--" : formatNumber(item.value, 1)}
                </span>
                <span style={{
                  color: COLORS.neutral[400],
                  fontSize: TYPOGRAPHY.fontSize.sm
                }}>
                  {item.unit}
                </span>
              </div>
              
              {/* 趋势 */}
              {item.trend !== undefined && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: SPACING.xs 
                }}>
                  <span style={{
                    fontSize: TYPOGRAPHY.fontSize.xs,
                    fontWeight: TYPOGRAPHY.fontWeight.medium,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                    color: isPositive ? COLORS.status.online : COLORS.semantic.error
                  }}>
                    {isPositive ? "↑" : "↓"} {Math.abs(item.trend).toFixed(1)}%
                  </span>
                  <span style={{
                    fontSize: TYPOGRAPHY.fontSize.xs,
                    color: COLORS.neutral[500]
                  }}>
                    {item.trendLabel}
                  </span>
                </div>
              )}
              
              {/* 额外信息（碳减排） */}
              {item.extra && (
                <div style={{
                  marginTop: SPACING.xs,
                  fontSize: TYPOGRAPHY.fontSize.xs,
                  color: `${COLORS.semantic.success}cc`,
                  fontWeight: TYPOGRAPHY.fontWeight.medium
                }}>
                  {item.extra}
                </div>
              )}
            </div>
            
            {/* 底部光条 */}
            <div 
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: `linear-gradient(90deg, ${item.gradient})`,
                opacity: 0.5
              }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

export default StrategicLayer;
