/**
 * @file SceneControls.tsx
 * @description 场景控制组件
 * @provides 3D场景视角切换、显示控制、图层管理等功能
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Eye, 
  EyeOff, 
  Camera, 
  Grid3X3, 
  Box, 
  Wind,
  Settings,
  Maximize2,
  Move3d,
  RotateCw,
  ZoomIn,
  ZoomOut
} from "lucide-react";
import type { CameraPreset } from "../types/equipment";

// ==================== Props接口 ====================

interface SceneControlsProps {
  /** 当前相机预设 */
  currentPreset: string;
  /** 视角切换回调 */
  onPresetChange: (presetId: string) => void;
  /** 设备列表 */
  equipments: any[];
  /** 气体数据 */
  gasData: any[];
}

// ==================== 相机预设配置 ====================

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
  {
    id: "ground",
    name: "地面视角",
    position: [10, 2, 10],
    target: [0, 0, 0],
    fov: 70,
  },
  {
    id: "top",
    name: "俯视视角",
    position: [0, 25, 0],
    target: [0, 0, 0],
    fov: 45,
  },
];

// ==================== 子组件 ====================

/**
 * 视角切换面板
 */
function CameraPresetsPanel({ 
  currentPreset, 
  onPresetChange 
}: {
  currentPreset: string;
  onPresetChange: (presetId: string) => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <Camera className="h-4 w-4 mr-2" />
          视角切换
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-2">
          {CAMERA_PRESETS.map((preset) => (
            <Button
              key={preset.id}
              size="sm"
              variant={currentPreset === preset.id ? "default" : "outline"}
              onClick={() => onPresetChange(preset.id)}
              className="justify-start text-xs h-8"
            >
              <Camera className="h-3 w-3 mr-2" />
              {preset.name}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 显示控制面板
 */
function DisplayControls({ 
  showGrid, 
  showEquipment, 
  showGas, 
  onToggleGrid, 
  onToggleEquipment, 
  onToggleGas 
}: {
  showGrid: boolean;
  showEquipment: boolean;
  showGas: boolean;
  onToggleGrid: (show: boolean) => void;
  onToggleEquipment: (show: boolean) => void;
  onToggleGas: (show: boolean) => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <Eye className="h-4 w-4 mr-2" />
          显示控制
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* 网格显示 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Grid3X3 className="h-4 w-4 text-gray-500" />
            <Label htmlFor="show-grid" className="text-sm">网格</Label>
          </div>
          <Switch
            id="show-grid"
            checked={showGrid}
            onCheckedChange={onToggleGrid}
          />
        </div>

        {/* 设备显示 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Box className="h-4 w-4 text-gray-500" />
            <Label htmlFor="show-equipment" className="text-sm">设备</Label>
          </div>
          <Switch
            id="show-equipment"
            checked={showEquipment}
            onCheckedChange={onToggleEquipment}
          />
        </div>

        {/* 气体云图 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Wind className="h-4 w-4 text-gray-500" />
            <Label htmlFor="show-gas" className="text-sm">气体云图</Label>
          </div>
          <Switch
            id="show-gas"
            checked={showGas}
            onCheckedChange={onToggleGas}
          />
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 场景统计面板
 */
function SceneStatistics({ equipments, gasData }: { 
  equipments: any[]; 
  gasData: any[] 
}) {
  const onlineCount = equipments.filter(eq => eq.status === "online").length;
  const offlineCount = equipments.filter(eq => eq.status === "offline").length;
  const errorCount = equipments.filter(eq => eq.status === "error").length;
  
  const avgHealth = equipments.length > 0 
    ? equipments.reduce((sum, eq) => sum + eq.predictiveData.healthScore, 0) / equipments.length 
    : 0;

  const highGasLevel = gasData.filter(gas => 
    gas.nh3 > 50 || gas.h2s > 20
  ).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <Settings className="h-4 w-4 mr-2" />
          场景统计
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {/* 设备统计 */}
        <div>
          <div className="text-xs text-gray-500 mb-2">设备状态</div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-green-50 rounded p-2">
              <div className="text-sm font-bold text-green-600">{onlineCount}</div>
              <div className="text-xs text-gray-600">在线</div>
            </div>
            <div className="bg-gray-50 rounded p-2">
              <div className="text-sm font-bold text-gray-600">{offlineCount}</div>
              <div className="text-xs text-gray-600">离线</div>
            </div>
            <div className="bg-red-50 rounded p-2">
              <div className="text-sm font-bold text-red-600">{errorCount}</div>
              <div className="text-xs text-gray-600">故障</div>
            </div>
          </div>
        </div>

        {/* 健康度 */}
        <div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">平均健康度</span>
            <Badge className={
              avgHealth > 80 ? "bg-green-100 text-green-800" :
              avgHealth > 60 ? "bg-blue-100 text-blue-800" :
              avgHealth > 40 ? "bg-yellow-100 text-yellow-800" :
              "bg-red-100 text-red-800"
            }>
              {avgHealth.toFixed(0)}
            </Badge>
          </div>
        </div>

        {/* 气体警报 */}
        <div>
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">气体警报</span>
            <Badge className={highGasLevel > 0 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}>
              {highGasLevel} 个区域
            </Badge>
          </div>
        </div>

        {/* 场景信息 */}
        <div className="pt-2 border-t text-xs text-gray-500">
          <div>设备总数: {equipments.length}</div>
          <div>监测点: {gasData.length}</div>
          <div>更新时间: {new Date().toLocaleTimeString()}</div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 快捷操作面板
 */
function QuickActions({ 
  onResetView, 
  onZoomIn, 
  onZoomOut, 
  onToggleFullscreen 
}: {
  onResetView: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onToggleFullscreen: () => void;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <Move3d className="h-4 w-4 mr-2" />
          快捷操作
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={onResetView}
            className="text-xs h-8"
          >
            <RotateCw className="h-3 w-3 mr-1" />
            重置视角
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={onZoomIn}
            className="text-xs h-8"
          >
            <ZoomIn className="h-3 w-3 mr-1" />
            放大
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={onZoomOut}
            className="text-xs h-8"
          >
            <ZoomOut className="h-3 w-3 mr-1" />
            缩小
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={onToggleFullscreen}
            className="text-xs h-8"
          >
            <Maximize2 className="h-3 w-3 mr-1" />
            全屏
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== 主组件 ====================

/**
 * 场景控制组件
 */
export function SceneControls({
  currentPreset,
  onPresetChange,
  equipments,
  gasData,
}: SceneControlsProps) {
  const [showGrid, setShowGrid] = useState(true);
  const [showEquipment, setShowEquipment] = useState(true);
  const [showGas, setShowGas] = useState(true);

  // 处理快捷操作
  const handleResetView = () => {
    onPresetChange("overview");
  };

  const handleZoomIn = () => {
    // 这里可以调用Three.js的相机缩放功能
    console.log("Zoom in");
  };

  const handleZoomOut = () => {
    // 这里可以调用Three.js的相机缩放功能
    console.log("Zoom out");
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  };

  return (
    <div className="space-y-4">
      {/* 视角切换 */}
      <CameraPresetsPanel
        currentPreset={currentPreset}
        onPresetChange={onPresetChange}
      />

      {/* 显示控制 */}
      <DisplayControls
        showGrid={showGrid}
        showEquipment={showEquipment}
        showGas={showGas}
        onToggleGrid={setShowGrid}
        onToggleEquipment={setShowEquipment}
        onToggleGas={setShowGas}
      />

      {/* 场景统计 */}
      <SceneStatistics
        equipments={equipments}
        gasData={gasData}
      />

      {/* 快捷操作 */}
      <QuickActions
        onResetView={handleResetView}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onToggleFullscreen={handleToggleFullscreen}
      />
    </div>
  );
}

// 导出相机预设供其他组件使用
export { CAMERA_PRESETS };
