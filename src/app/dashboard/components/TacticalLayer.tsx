/**
 * @file app/dashboard/components/TacticalLayer.tsx
 * @description 战术层（高端优化版）
 * @module 模块1:监管驾驶舱
 */

import dynamic from "next/dynamic";
import { Map, Layers } from "lucide-react";
import { useGlobalStore } from "@/store";
import { useMemo, useCallback } from "react";
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS, ANIMATION, TYPOGRAPHY } from "@/lib/design-tokens";
import type { Station } from "@/types";

const DigitalTwinScene = dynamic(
  () => import("./DigitalTwinScene").then((mod) => mod.DigitalTwinScene),
  { 
    ssr: false, 
    loading: () => (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        backgroundColor: COLORS.neutral[900],
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: SPACING.sm,
          color: COLORS.neutral[500],
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: `2px solid ${COLORS.primary[500]}30`,
            borderTopColor: COLORS.primary[500],
            borderRadius: BORDER_RADIUS.full,
            animation: `spin 1s linear infinite`,
          }} />
          加载3D场景中...
        </div>
      </div>
    )
  }
);

const GISMap = dynamic(
  () => import("./GISMapView").then((mod) => mod.GISMapView),
  { 
    ssr: false,
    loading: () => (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        backgroundColor: COLORS.neutral[900],
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: SPACING.sm,
          color: COLORS.neutral[500],
        }}>
          <div style={{
            width: '20px',
            height: '20px',
            border: `2px solid ${COLORS.primary[500]}30`,
            borderTopColor: COLORS.primary[500],
            borderRadius: BORDER_RADIUS.full,
            animation: `spin 1s linear infinite`,
          }} />
          加载地图中...
        </div>
      </div>
    )
  }
);

interface TacticalLayerProps {
  readonly stations: Station[];
}

export function TacticalLayer({ stations }: TacticalLayerProps) {
  const { setSelectedStationId } = useGlobalStore();
  
  const handleStationSelect = useCallback((station: Station) => {
    setSelectedStationId(station.id);
  }, [setSelectedStationId]);

  // 容器样式
  const containerStyles = useMemo(() => ({
    display: 'flex',
    gap: SPACING.sm,
    height: '65%',
    minHeight: '400px',
  }), []);

  const panelStyles = useMemo(() => ({
    borderRadius: '24px',
    overflow: 'hidden',
    border: `1px solid ${COLORS.neutral[700]}50`,
    backgroundColor: `${COLORS.neutral[900]}50`,
    backdropFilter: 'blur(10px)',
    display: 'flex',
    flexDirection: 'column' as const,
  }), []);

  const headerStyles = useMemo(() => ({
    height: '48px',
    padding: `0 ${SPACING.md}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottom: `1px solid ${COLORS.neutral[700]}30`,
    backgroundColor: `${COLORS.neutral[900]}80`,
  }), []);

  const getStatusIndicatorStyles = useCallback((color: string) => ({
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.xs,
    fontSize: TYPOGRAPHY.fontSize.xs,
  }), []);

  const getStatusDotStyles = useCallback((color: string) => ({
    width: '8px',
    height: '8px',
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: color,
    boxShadow: `0 0 8px ${color}80`,
  }), []);

  return (
    <div style={containerStyles}>
      {/* 左侧：数字孪生3D场景 */}
      <div style={{ ...panelStyles, flex: 1, minWidth: 0 }}>
        {/* Header */}
        <div style={headerStyles}>
          <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm }}>
            <Layers style={{
              width: '16px',
              height: '16px',
              color: COLORS.primary[400]
            }} />
            <span style={{
              fontSize: TYPOGRAPHY.fontSize.sm,
              fontWeight: TYPOGRAPHY.fontWeight.medium,
              color: COLORS.neutral[200]
            }}>
              数字孪生场景
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm, fontSize: TYPOGRAPHY.fontSize.xs }}>
            <div style={getStatusIndicatorStyles(COLORS.status.online)}>
              <span style={getStatusDotStyles(COLORS.status.online)} />
              <span style={{ color: COLORS.neutral[400] }}>正常</span>
            </div>
            <div style={getStatusIndicatorStyles(COLORS.status.warning)}>
              <span style={getStatusDotStyles(COLORS.status.warning)} />
              <span style={{ color: COLORS.neutral[400] }}>满溢</span>
            </div>
            <div style={getStatusIndicatorStyles(COLORS.semantic.error)}>
              <span style={getStatusDotStyles(COLORS.semantic.error)} />
              <span style={{ color: COLORS.neutral[400] }}>紧急</span>
            </div>
          </div>
        </div>
        {/* 3D Canvas */}
        <DigitalTwinScene stations={stations} className="flex-1" />
      </div>

      {/* 右侧：GIS地图 */}
      <div style={{ ...panelStyles, width: '42%', minWidth: '350px' }}>
        {/* Header */}
        <div style={headerStyles}>
          <div style={{ display: 'flex', alignItems: 'center', gap: SPACING.sm }}>
            <Map style={{
              width: '16px',
              height: '16px',
              color: COLORS.primary[400]
            }} />
            <span style={{
              fontSize: TYPOGRAPHY.fontSize.sm,
              fontWeight: TYPOGRAPHY.fontWeight.medium,
              color: COLORS.neutral[200]
            }}>
              GIS站点分布
            </span>
          </div>
          <span style={{
            fontSize: TYPOGRAPHY.fontSize.xs,
            color: COLORS.neutral[500]
          }}>
            {stations.length} 个站点
          </span>
        </div>
        {/* Map Canvas */}
        <GISMap stations={stations} onStationSelect={handleStationSelect} className="flex-1" />
      </div>
    </div>
  );
}

export default TacticalLayer;
