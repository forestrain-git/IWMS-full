/**
 * @file EquipmentMesh.tsx
 * @description 单个设备3D网格组件
 * @provides 设备3D渲染、动画、交互功能
 */

import { useRef, useMemo, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import { Mesh, BoxGeometry, CylinderGeometry, SphereGeometry } from "three";
import type { EquipmentInfo } from "../types/equipment";
import { HEALTH_SCORE_COLORS } from "../types/equipment";

// ==================== Props接口 ====================

interface EquipmentMeshProps {
  /** 设备信息 */
  equipment: EquipmentInfo;
  /** 是否被选中 */
  isSelected: boolean;
  /** 点击回调 */
  onClick: (equipment: EquipmentInfo) => void;
  /** 悬停回调 */
  onHover: (equipment: EquipmentInfo | null) => void;
}

// ==================== 组件实现 ====================

/**
 * 设备3D网格组件
 */
export function EquipmentMesh({
  equipment,
  isSelected,
  onClick,
  onHover,
}: EquipmentMeshProps) {
  const meshRef = useRef<Mesh>(null);
  const groupRef = useRef<any>(null);

  // 根据健康度获取颜色
  const getHealthColor = useMemo(() => {
    const { healthScore } = equipment.predictiveData;
    if (healthScore > 80) return HEALTH_SCORE_COLORS.excellent;
    if (healthScore > 60) return HEALTH_SCORE_COLORS.good;
    if (healthScore > 40) return HEALTH_SCORE_COLORS.warning;
    return HEALTH_SCORE_COLORS.critical;
  }, [equipment.predictiveData.healthScore]);

  // 创建几何体（使用useMemo优化性能）
  const geometry = useMemo(() => {
    switch (equipment.meshType) {
      case "cylinder":
        return new CylinderGeometry(1, 1, 2, 16);
      case "sphere":
        return new SphereGeometry(1, 16, 16);
      case "box":
      default:
        return new BoxGeometry(...EQUIPMENT_DIMENSIONS[equipment.type]);
    }
  }, [equipment.meshType, equipment.type]);

  // 设备尺寸配置
  const EQUIPMENT_DIMENSIONS = {
    compressor: [2, 3, 2],
    crane: [1, 4, 1],
    deodorizer: [1, 2, 1],
    scale: [4, 0.5, 3],
    conveyor: [6, 0.3, 1],
  } as const;

  // 动画更新
  useFrame((state) => {
    if (!meshRef.current) return;

    // 运行状态动画
    if (equipment.status === "online" && equipment.isAnimated) {
      const time = state.clock.elapsedTime;
      
      switch (equipment.type) {
        case "compressor":
          // 压缩机活塞往复运动
          meshRef.current.position.y = equipment.transform.position[1] + 
            Math.sin(time * 2) * 0.3;
          break;
          
        case "crane":
          // 吊机旋转动画
          meshRef.current.rotation.y = equipment.transform.rotation[1] + 
            Math.sin(time * 0.5) * 0.2;
          break;
          
        case "deodorizer":
          // 除臭机喷雾效果（通过缩放模拟）
          const scale = 1 + Math.sin(time * 3) * 0.1;
          meshRef.current.scale.set(scale, scale, scale);
          break;
          
        case "conveyor":
          // 传送带移动效果
          meshRef.current.position.x = equipment.transform.position[0] + 
            Math.sin(time) * 0.5;
          break;
      }
    }

    // 选中状态高亮动画
    if (isSelected) {
      const pulseScale = 1 + Math.sin(state.clock.elapsedTime * 3) * 0.1;
      meshRef.current.scale.setScalar(pulseScale);
    }
  });

  // 处理点击事件
  const handleClick = (event: any) => {
    event.stopPropagation();
    onClick(equipment);
  };

  // 处理悬停事件
  const handlePointerOver = () => onHover(equipment);
  const handlePointerOut = () => onHover(null);

  // 生成设备状态标签
  const getStatusLabel = () => {
    const statusMap: Record<string, string> = {
      online: "在线",
      offline: "离线",
      error: "故障",
      maintenance: "维护",
      starting: "启动中",
      stopping: "停止中",
    };

    return statusMap[equipment.status] || "未知";
  };

  return (
    <group
      ref={groupRef}
      position={equipment.transform.position}
      rotation={equipment.transform.rotation}
      scale={equipment.transform.scale}
    >
      {/* 主要设备几何体 */}
      <mesh
        ref={meshRef}
        geometry={geometry}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <meshStandardMaterial
          color={getHealthColor}
          emissive={isSelected ? getHealthColor : "#000000"}
          emissiveIntensity={isSelected ? 0.3 : 0}
          roughness={0.4}
          metalness={0.6}
        />
      </mesh>

      {/* 设备类型特定附加组件 */}
      {equipment.type === "compressor" && (
        <group position={[0, 2, 0]}>
          {/* 压缩机顶部管道 */}
          <mesh position={[0, 0.5, 0]}>
            <cylinderGeometry args={[0.2, 0.2, 1, 8]} />
            <meshStandardMaterial color="#6b7280" />
          </mesh>
        </group>
      )}

      {equipment.type === "crane" && (
        <group position={[0, 2, 0]}>
          {/* 吊机吊臂 */}
          <mesh position={[0, 0, 1]}>
            <boxGeometry args={[0.3, 0.3, 3]} />
            <meshStandardMaterial color="#374151" />
          </mesh>
        </group>
      )}

      {equipment.type === "deodorizer" && equipment.status === "online" && (
        <group position={[0, 1.5, 0]}>
          {/* 除臭机喷雾效果（简化版） */}
          <mesh>
            <sphereGeometry args={[0.5, 8, 8]} />
            <meshStandardMaterial
              color="#60a5fa"
              transparent
              opacity={0.3}
            />
          </mesh>
        </group>
      )}

      {/* 设备信息标签 */}
      <Html
        position={[0, equipment.transform.position[1] + 2, 0]}
        center
        occlude
      >
        <div className="bg-black/80 text-white text-xs px-2 py-1 rounded pointer-events-none">
          <div className="font-semibold">{equipment.name}</div>
          <div className="text-yellow-400">{getStatusLabel()}</div>
          <div className="text-blue-400">
            {equipment.realtimeData.pressure.toFixed(1)} MPa
          </div>
          <div className="text-green-400">
            {equipment.realtimeData.temperature.toFixed(1)} °C
          </div>
          <div className="text-orange-400">
            健康度: {equipment.predictiveData.healthScore}
          </div>
        </div>
      </Html>

      {/* 选中状态指示器 */}
      {isSelected && (
        <mesh position={[0, -0.5, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.5, 2, 32]} />
          <meshBasicMaterial color="#fbbf24" />
        </mesh>
      )}

      {/* 状态指示灯 */}
      <mesh position={[1, equipment.transform.position[1] + 0.5, 1]}>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshBasicMaterial
          color={
            equipment.status === "online" ? "#10b981" :
            equipment.status === "offline" ? "#6b7280" :
            equipment.status === "error" ? "#ef4444" : "#f59e0b"
          }
        />
      </mesh>
    </group>
  );
}

// ==================== 设备图例组件 ====================

interface EquipmentLegendProps {
  /** 设备列表 */
  equipments: EquipmentInfo[];
}

/**
 * 设备图例组件
 */
export function EquipmentLegend({ equipments }: EquipmentLegendProps) {
  const equipmentTypes = Array.from(new Set(equipments.map(eq => eq.type)));

  return (
    <div className="bg-white/90 backdrop-blur rounded-lg p-4 shadow-lg">
      <h3 className="text-sm font-semibold mb-3">设备图例</h3>
      <div className="space-y-2">
        {equipmentTypes.map(type => {
          const typeEquipments = equipments.filter(eq => eq.type === type);
          const onlineCount = typeEquipments.filter(eq => eq.status === "online").length;
          const totalCount = typeEquipments.length;
          
          return (
            <div key={type} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <div
                  className="w-3 h-3 rounded"
                  style={{
                    backgroundColor: HEALTH_SCORE_COLORS[
                      totalCount > 0 ? "good" : "warning"
                    ],
                  }}
                />
                <span className="capitalize">{type}</span>
              </div>
              <span className="text-gray-600">
                {onlineCount}/{totalCount} 在线
              </span>
            </div>
          );
        })}
      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200">
        <h4 className="text-xs font-semibold mb-2">健康度颜色</h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: HEALTH_SCORE_COLORS.excellent }} />
            <span>优秀 (&gt;80)</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: HEALTH_SCORE_COLORS.good }} />
            <span>良好 (60-80)</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: HEALTH_SCORE_COLORS.warning }} />
            <span>警告 (40-60)</span>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <div className="w-3 h-3 rounded" style={{ backgroundColor: HEALTH_SCORE_COLORS.critical }} />
            <span>危险 (&lt;40)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
