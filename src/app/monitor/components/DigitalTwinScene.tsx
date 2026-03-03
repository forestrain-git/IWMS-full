/**
 * @file DigitalTwinScene.tsx
 * @description 3D数字孪生场景主组件
 * @provides 完整的3D场景渲染、设备展示、气体云图等功能
 */

import { Suspense, useRef, useMemo, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Grid, Environment, PerspectiveCamera } from "@react-three/drei";
import { Group, Vector3 } from "three";
import { EquipmentMesh, EquipmentLegend } from "./EquipmentMesh";
import { ParticleEffects } from "./ParticleEffects";
import type { EquipmentInfo, GasData, CameraPreset } from "../types/equipment";
import { GAS_THRESHOLDS } from "../types/equipment";

// ==================== Props接口 ====================

interface DigitalTwinSceneProps {
  /** 设备列表 */
  equipments: EquipmentInfo[];
  /** 气体数据 */
  gasData: GasData[];
  /** 选中的设备ID */
  selectedEquipmentId: string | null;
  /** 设备选择回调 */
  onEquipmentSelect: (id: string | null) => void;
  /** 设备悬停回调 */
  onEquipmentHover: (equipment: EquipmentInfo | null) => void;
  /** 悬停的设备 */
  hoveredEquipment: EquipmentInfo | null;
  /** 实时数据更新回调 */
  updateRealtimeData: () => void;
}

// ==================== 场景配置 ====================

const SCENE_CONFIG = {
  bounds: {
    min: [-15, 0, -10] as [number, number, number],
    max: [15, 8, 10] as [number, number, number],
  },
  lighting: {
    ambient: 0.4,
    directional: {
      position: [10, 10, 5] as [number, number, number],
      intensity: 1,
    },
  },
  ground: {
    size: 40,
    color: "#1f2937",
    grid: true,
  },
};

const CAMERA_PRESETS: CameraPreset[] = [
  {
    id: "overview",
    name: "总览视角",
    position: [20, 15, 20],
    target: [0, 0, 0],
    fov: 60,
  },
  {
    id: "compressor",
    name: "压缩机视角",
    position: [5, 3, 5],
    target: [0, 1.5, 0],
    fov: 50,
  },
  {
    id: "crane",
    name: "吊机视角",
    position: [-5, 4, 8],
    target: [0, 2, 5],
    fov: 50,
  },
];

// ==================== 子组件 ====================

/**
 * 场景内容组件
 */
function SceneContent({
  equipments,
  gasData,
  selectedEquipmentId,
  onEquipmentSelect,
  onEquipmentHover,
  updateRealtimeData,
}: Omit<DigitalTwinSceneProps, "hoveredEquipment">) {
  const groupRef = useRef<Group>(null);
  const frameCount = useRef(0);

  // 实时数据更新（每60帧约1秒）
  useFrame(() => {
    frameCount.current++;
    if (frameCount.current % 60 === 0) {
      updateRealtimeData();
    }
  });

  // 建筑物组件
  const Building = () => (
    <group>
      {/* 卸料大厅 */}
      <mesh position={[0, 4, -5]}>
        <boxGeometry args={[12, 8, 6]} />
        <meshStandardMaterial color="#374151" transparent opacity={0.8} />
      </mesh>
      
      {/* 压缩车间 */}
      <mesh position={[0, 3, 0]}>
        <boxGeometry args={[8, 6, 8]} />
        <meshStandardMaterial color="#4b5563" transparent opacity={0.8} />
      </mesh>
      
      {/* 地磅区 */}
      <mesh position={[0, 0.5, -8]}>
        <boxGeometry args={[6, 1, 4]} />
        <meshStandardMaterial color="#6b7280" />
      </mesh>
      
      {/* 屋顶 */}
      <mesh position={[0, 8, 0]}>
        <boxGeometry args={[15, 0.5, 12]} />
        <meshStandardMaterial color="#1f2937" />
      </mesh>
    </group>
  );

  return (
    <group ref={groupRef}>
      {/* 建筑物 */}
      <Building />
      
      {/* 设备网格 */}
      {equipments.map((equipment) => (
        <EquipmentMesh
          key={equipment.id}
          equipment={equipment}
          isSelected={selectedEquipmentId === equipment.id}
          onClick={() => onEquipmentSelect(equipment.id)}
          onHover={onEquipmentHover}
        />
      ))}
      
      {/* 气体云图 */}
      <ParticleEffects gasData={gasData} />
    </group>
  );
}

/**
 * 相机控制组件
 */
function CameraController({ presetId }: { presetId: string }) {
  const preset = CAMERA_PRESETS.find(p => p.id === presetId);
  
  if (!preset) return null;
  
  return (
    <PerspectiveCamera
      makeDefault
      position={preset.position}
      fov={preset.fov}
    />
  );
}

// ==================== 主组件 ====================

/**
 * 3D数字孪生场景组件
 */
export function DigitalTwinScene({
  equipments,
  gasData,
  selectedEquipmentId,
  onEquipmentSelect,
  onEquipmentHover,
  hoveredEquipment,
  updateRealtimeData,
}: DigitalTwinSceneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraPreset, setCameraPreset] = useState("overview");

  // 处理设备选择
  const handleEquipmentSelect = (id: string | null) => {
    onEquipmentSelect(id);
  };

  // 处理设备悬停
  const handleEquipmentHover = (equipment: EquipmentInfo | null) => {
    onEquipmentHover(equipment);
  };

  return (
    <div className="relative w-full h-full">
      {/* 3D画布 */}
      <Canvas
        ref={canvasRef}
        shadows
        camera={{
          position: CAMERA_PRESETS[0].position,
          fov: CAMERA_PRESETS[0].fov,
        }}
      >
        {/* 相机控制 */}
        <CameraController presetId={cameraPreset} />
        
        {/* 场景控制 */}
        <OrbitControls
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2}
          minDistance={5}
          maxDistance={50}
        />
        
        {/* 环境光照 */}
        <ambientLight intensity={SCENE_CONFIG.lighting.ambient} />
        <directionalLight
          position={SCENE_CONFIG.lighting.directional.position}
          intensity={SCENE_CONFIG.lighting.directional.intensity}
          castShadow
          shadow-mapSize={[2048, 2048]}
        />
        
        {/* 环境贴图 */}
        <Environment preset="warehouse" />
        
        {/* 地面网格 */}
        <Grid
          args={[SCENE_CONFIG.ground.size, SCENE_CONFIG.ground.size]}
          position={[0, 0, 0]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#6b7280"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#9ca3af"
          fadeDistance={30}
          fadeStrength={1}
          followCamera={false}
        />
        
        {/* 场景内容 */}
        <Suspense fallback={null}>
          <SceneContent
            equipments={equipments}
            gasData={gasData}
            selectedEquipmentId={selectedEquipmentId}
            onEquipmentSelect={handleEquipmentSelect}
            onEquipmentHover={handleEquipmentHover}
            updateRealtimeData={updateRealtimeData}
          />
        </Suspense>
      </Canvas>
      
      {/* 场景控制面板 */}
      <div className="absolute top-4 left-4 space-y-4">
        {/* 视角切换按钮 */}
        <div className="bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg">
          <h3 className="text-sm font-semibold mb-2">视角切换</h3>
          <div className="space-y-1">
            {CAMERA_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => setCameraPreset(preset.id)}
                className={`w-full text-left px-3 py-2 text-xs rounded transition-colors ${
                  cameraPreset === preset.id
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* 设备图例 */}
        <EquipmentLegend equipments={equipments} />
      </div>
      
      {/* 悬停设备信息 */}
      {hoveredEquipment && (
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur rounded-lg p-4 shadow-lg max-w-xs">
          <h3 className="text-sm font-semibold mb-2">{hoveredEquipment.name}</h3>
          <div className="space-y-1 text-xs">
            <div className="flex justify-between">
              <span>状态:</span>
              <span className={
                hoveredEquipment.status === "online" ? "text-green-600" :
                hoveredEquipment.status === "offline" ? "text-gray-600" :
                "text-red-600"
              }>
                {hoveredEquipment.status === "online" ? "在线" :
                 hoveredEquipment.status === "offline" ? "离线" : "故障"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>压力:</span>
              <span>{hoveredEquipment.realtimeData.pressure.toFixed(1)} MPa</span>
            </div>
            <div className="flex justify-between">
              <span>温度:</span>
              <span>{hoveredEquipment.realtimeData.temperature.toFixed(1)} °C</span>
            </div>
            <div className="flex justify-between">
              <span>健康度:</span>
              <span className={
                hoveredEquipment.predictiveData.healthScore > 80 ? "text-green-600" :
                hoveredEquipment.predictiveData.healthScore > 60 ? "text-blue-600" :
                hoveredEquipment.predictiveData.healthScore > 40 ? "text-yellow-600" :
                "text-red-600"
              }>
                {hoveredEquipment.predictiveData.healthScore}
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* 场景统计信息 */}
      <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur rounded-lg p-3 shadow-lg">
        <div className="text-xs space-y-1">
          <div className="flex justify-between space-x-4">
            <span>设备总数:</span>
            <span className="font-semibold">{equipments.length}</span>
          </div>
          <div className="flex justify-between space-x-4">
            <span>在线设备:</span>
            <span className="font-semibold text-green-600">
              {equipments.filter(eq => eq.status === "online").length}
            </span>
          </div>
          <div className="flex justify-between space-x-4">
            <span>故障设备:</span>
            <span className="font-semibold text-red-600">
              {equipments.filter(eq => eq.status === "error").length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// 导出相机预设供其他组件使用
export { CAMERA_PRESETS };
