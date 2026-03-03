/**
 * @file DispatchMap.tsx
 * @description GIS调度地图核心组件
 * @provides 地图显示、车辆轨迹、任务状态、框选调度等功能
 */

import { useState, useEffect, useRef, useCallback } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Navigation, 
  Users, 
  Square,
  Mic,
  Video,
  Phone,
  RotateCcw,
  Maximize2,
  Layers
} from "lucide-react";
import type { Vehicle, Task, VehicleStatus } from "../types/dispatch";

// ==================== 全局类型声明 ====================

declare global {
  interface Window {
    AMap: any;
  }
}

// 确保只在客户端运行
const isClient = typeof window !== 'undefined';

// ==================== Props接口 ====================

interface DispatchMapProps {
  /** 车辆列表 */
  vehicles: Vehicle[];
  /** 任务列表 */
  tasks: Task[];
  /** 选中的车辆ID */
  selectedVehicleId?: string | null;
  /** 选中的任务ID */
  selectedTaskId?: string | null;
  /** 车辆选择回调 */
  onVehicleSelect: (vehicleId: string | null) => void;
  /** 任务选择回调 */
  onTaskSelect: (taskId: string | null) => void;
  /** 批量调度回调 */
  onBatchDispatch: (vehicleIds: string[], taskIds: string[]) => void;
  /** 语音调度回调 */
  onVoiceDispatch: (vehicleIds: string[]) => void;
  /** 视频会商回调 */
  onVideoConference: (vehicleIds: string[]) => void;
}

// ==================== 地图配置 ====================

const MAP_CONFIG = {
  zoom: 12,
  center: [104.0668, 30.5728], // 成都中心
  features: ["bg", "road", "building"],
  viewMode: "2D",
};

const VEHICLE_STATUS_COLORS = {
  idle: "#10b981",      // 绿色
  en_route: "#3b82f6",  // 蓝色
  loading: "#f59e0b",   // 橙色
  unloading: "#f59e0b", // 橙色
  maintenance: "#6b7280", // 灰色
  emergency: "#ef4444",   // 红色
};

const TASK_STATUS_COLORS = {
  pending: "#6b7280",     // 灰色
  assigned: "#3b82f6",    // 蓝色
  in_progress: "#f59e0b", // 橙色
  completed: "#10b981",   // 绿色
  cancelled: "#ef4444",   // 红色
  emergency: "#dc2626",   // 深红色
};

// ==================== 子组件 ====================

/**
 * 地图工具栏组件
 */
function MapToolbar({
  onResetView,
  onToggleFullscreen,
  onToggleLayers,
  onMeasureDistance,
  onBatchSelect,
}: {
  onResetView: () => void;
  onToggleFullscreen: () => void;
  onToggleLayers: () => void;
  onMeasureDistance: () => void;
  onBatchSelect: () => void;
}) {
  return (
    <div className="absolute top-4 right-4 z-10 space-y-2">
      <div className="bg-white rounded-lg shadow-lg p-1 space-y-1">
        <Button
          size="sm"
          variant="ghost"
          onClick={onResetView}
          className="w-full justify-start"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          重置视图
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onToggleFullscreen}
          className="w-full justify-start"
        >
          <Maximize2 className="h-4 w-4 mr-2" />
          全屏
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onToggleLayers}
          className="w-full justify-start"
        >
          <Layers className="h-4 w-4 mr-2" />
          图层
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onMeasureDistance}
          className="w-full justify-start"
        >
          <Navigation className="h-4 w-4 mr-2" />
          测距
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={onBatchSelect}
          className="w-full justify-start"
        >
          <Square className="h-4 w-4 mr-2" />
          框选
        </Button>
      </div>
    </div>
  );
}

/**
 * 车辆信息弹窗组件
 */
function VehicleInfoWindow({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 min-w-64">
      <div className="space-y-3">
        {/* 标题 */}
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">{vehicle.plateNumber}</h4>
          <Badge 
            style={{ backgroundColor: VEHICLE_STATUS_COLORS[vehicle.status] }}
            className="text-white"
          >
            {vehicle.status}
          </Badge>
        </div>

        {/* 基本信息 */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">驾驶员:</span>
            <span>{vehicle.driver.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">载重:</span>
            <span>{vehicle.capacity.current.toFixed(1)}/{vehicle.capacity.max}t</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">油位:</span>
            <span>{vehicle.fuel.level}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">速度:</span>
            <span>{vehicle.location.speed || 0}km/h</span>
          </div>
        </div>

        {/* 今日统计 */}
        <div className="border-t pt-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">今日任务:</span>
            <span>{vehicle.completedTasksToday}个</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">工作时长:</span>
            <span>{Math.floor(vehicle.workMinutesToday / 60)}小时</span>
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex space-x-2 pt-2">
          <Button size="sm" className="flex-1">
            <Phone className="h-3 w-3 mr-1" />
            呼叫
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Mic className="h-3 w-3 mr-1" />
            语音
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            <Video className="h-3 w-3 mr-1" />
            视频
          </Button>
        </div>
      </div>
    </div>
  );
}

/**
 * 任务信息弹窗组件
 */
function TaskInfoWindow({ task }: { task: Task }) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 min-w-64">
      <div className="space-y-3">
        {/* 标题 */}
        <div className="flex items-center justify-between">
          <h4 className="font-semibold">{task.name}</h4>
          <Badge 
            style={{ backgroundColor: TASK_STATUS_COLORS[task.status] }}
            className="text-white"
          >
            {task.status}
          </Badge>
        </div>

        {/* 基本信息 */}
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">类型:</span>
            <span>{task.type === "collection" ? "收运" : "运输"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">优先级:</span>
            <span>{task.priority}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">预估时长:</span>
            <span>{task.estimatedWorkload.duration}分钟</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">预估重量:</span>
            <span>{task.estimatedWorkload.weight}t</span>
          </div>
          {task.overflowLevel && (
            <div className="flex justify-between">
              <span className="text-gray-500">满溢等级:</span>
              <span>{task.overflowLevel}/5</span>
            </div>
          )}
        </div>

        {/* 位置信息 */}
        <div className="border-t pt-2 text-sm">
          <div className="text-gray-500 mb-1">取货地址:</div>
          <div className="text-xs">{task.pickup.address}</div>
          {task.delivery && (
            <>
              <div className="text-gray-500 mb-1 mt-2">送货地址:</div>
              <div className="text-xs">{task.delivery.address}</div>
            </>
          )}
        </div>

        {/* 分配信息 */}
        {task.assignedVehicleId && (
          <div className="border-t pt-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">分配车辆:</span>
              <span>{task.assignedVehicleId}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ==================== 主组件 ====================

/**
 * GIS调度地图组件
 */
export function DispatchMap({
  vehicles,
  tasks,
  selectedVehicleId,
  selectedTaskId,
  onVehicleSelect,
  onTaskSelect,
  onBatchDispatch,
  onVoiceDispatch,
  onVideoConference,
}: DispatchMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  const [selectedVehicles, setSelectedVehicles] = useState<string[]>([]);
  const [isBatchSelecting, setIsBatchSelecting] = useState(false);

  // 初始化地图
  useEffect(() => {
    if (!isClient) return;
    
    const initMap = async () => {
      try {
        const AMap = await AMapLoader.load({
          key: process.env.NEXT_PUBLIC_AMAP_KEY || "your-amap-key",
          version: "2.0",
          plugins: ["AMap.Scale", "AMap.ToolBar", "AMap.MarkerClusterer"],
        });

        if (mapContainerRef.current && !mapRef.current) {
          const map = new AMap.Map(mapContainerRef.current, {
            zoom: 12,
            center: [116.397428, 39.90923],
            mapStyle: "amap://styles/normal",
          });

          mapRef.current = map;
          setIsMapLoaded(true);

          // 添加地图事件监听
          map.on("click", (e: any) => {
            // 点击空白处取消选择
            onVehicleSelect?.(null);
            onTaskSelect?.(null);
          });
        }

      } catch (error) {
        console.error("Failed to initialize map:", error);
      }
    };

    initMap();
  }, []);

  // 更新车辆标记
  useEffect(() => {
    if (!mapRef.current || !isMapLoaded) return;

    // 清除现有标记
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    // 添加车辆标记
    vehicles.forEach(vehicle => {
      const AMap = window.AMap;
      
      // 创建车辆标记
      const marker = new AMap.Marker({
        position: [vehicle.location.longitude, vehicle.location.latitude],
        title: vehicle.plateNumber,
        content: createVehicleMarker(vehicle),
        offset: new AMap.Pixel(-20, -20),
      });

      // 添加点击事件
      marker.on("click", () => {
        onVehicleSelect(vehicle.id);
        showVehicleInfoWindow(vehicle);
      });

      // 添加到地图
      marker.setMap(mapRef.current);
      markersRef.current.push(marker);
    });

    // 添加任务标记
    tasks.forEach(task => {
      const AMap = window.AMap;
      
      const marker = new AMap.Marker({
        position: [task.pickup.longitude, task.pickup.latitude],
        title: task.name,
        content: createTaskMarker(task),
        offset: new AMap.Pixel(-15, -15),
      });

      marker.on("click", () => {
        onTaskSelect(task.id);
        showTaskInfoWindow(task);
      });

      marker.setMap(mapRef.current);
      markersRef.current.push(marker);
    });
  }, [vehicles, tasks, isMapLoaded, onVehicleSelect, onTaskSelect]);

  // 创建车辆标记HTML
  const createVehicleMarker = (vehicle: Vehicle) => {
    const isSelected = vehicle.id === selectedVehicleId;
    const isBatchSelected = selectedVehicles.includes(vehicle.id);
    
    return `
      <div class="relative">
        <div class="
          w-10 h-10 rounded-full border-2 border-white shadow-lg flex items-center justify-center
          ${isSelected ? 'ring-2 ring-blue-500' : ''}
          ${isBatchSelected ? 'ring-2 ring-orange-500' : ''}
        " style="background-color: ${VEHICLE_STATUS_COLORS[vehicle.status]}">
          <div class="text-white text-xs font-bold">${vehicle.plateNumber.slice(-4)}</div>
        </div>
        ${vehicle.status === "en_route" ? `
          <div class="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
        ` : ''}
      </div>
    `;
  };

  // 创建任务标记HTML
  const createTaskMarker = (task: Task) => {
    const isSelected = task.id === selectedTaskId;
    
    return `
      <div class="relative">
        <div class="
          w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center
          ${isSelected ? 'ring-2 ring-blue-500' : ''}
        " style="background-color: ${TASK_STATUS_COLORS[task.status]}">
          <div class="text-white text-xs">📦</div>
        </div>
        ${task.priority === "urgent" ? `
          <div class="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        ` : ''}
      </div>
    `;
  };

  // 显示车辆信息窗口
  const showVehicleInfoWindow = (vehicle: Vehicle) => {
    if (!mapRef.current) return;
    
    const AMap = window.AMap;
    const infoWindow = new AMap.InfoWindow({
      content: `<div id="vehicle-info-${vehicle.id}"></div>`,
      offset: new AMap.Pixel(0, -40),
    });

    infoWindow.open(mapRef.current, [vehicle.location.longitude, vehicle.location.latitude]);
    
    // 渲染React组件到信息窗口（这里简化处理）
    setTimeout(() => {
      const container = document.getElementById(`vehicle-info-${vehicle.id}`);
      if (container) {
        container.innerHTML = `
          <div class="bg-white rounded-lg shadow-lg p-4 min-w-64">
            <h4 class="font-semibold">${vehicle.plateNumber}</h4>
            <p class="text-sm text-gray-600">状态: ${vehicle.status}</p>
            <p class="text-sm text-gray-600">驾驶员: ${vehicle.driver.name}</p>
          </div>
        `;
      }
    }, 100);
  };

  // 显示任务信息窗口
  const showTaskInfoWindow = (task: Task) => {
    if (!mapRef.current) return;
    
    const AMap = window.AMap;
    const infoWindow = new AMap.InfoWindow({
      content: `<div id="task-info-${task.id}"></div>`,
      offset: new AMap.Pixel(0, -40),
    });

    infoWindow.open(mapRef.current, [task.pickup.longitude, task.pickup.latitude]);
    
    setTimeout(() => {
      const container = document.getElementById(`task-info-${task.id}`);
      if (container) {
        container.innerHTML = `
          <div class="bg-white rounded-lg shadow-lg p-4 min-w-64">
            <h4 class="font-semibold">${task.name}</h4>
            <p class="text-sm text-gray-600">状态: ${task.status}</p>
            <p class="text-sm text-gray-600">地址: ${task.pickup.address}</p>
          </div>
        `;
      }
    }, 100);
  };

  // 工具栏操作
  const handleResetView = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.setZoomAndCenter(MAP_CONFIG.zoom, MAP_CONFIG.center);
    }
  }, []);

  const handleToggleFullscreen = useCallback(() => {
    if (mapContainerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        mapContainerRef.current.requestFullscreen();
      }
    }
  }, []);

  const handleToggleLayers = useCallback(() => {
    // 切换图层显示
    console.log("Toggle layers");
  }, []);

  const handleMeasureDistance = useCallback(() => {
    // 启动测距工具
    console.log("Measure distance");
  }, []);

  const handleBatchSelect = useCallback(() => {
    setIsBatchSelecting(!isBatchSelecting);
    if (!isBatchSelecting) {
      setSelectedVehicles([]);
    }
  }, [isBatchSelecting]);

  return (
    <Card className="h-full">
      <CardContent className="p-0 h-full relative">
        {/* 地图容器 */}
        <div 
          ref={mapContainerRef} 
          className="w-full h-full min-h-[500px]"
        />

        {/* 工具栏 */}
        <MapToolbar
          onResetView={handleResetView}
          onToggleFullscreen={handleToggleFullscreen}
          onToggleLayers={handleToggleLayers}
          onMeasureDistance={handleMeasureDistance}
          onBatchSelect={handleBatchSelect}
        />

        {/* 状态栏 */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center space-x-4 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>空闲: {vehicles.filter(v => v.status === "idle").length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>在途: {vehicles.filter(v => v.status === "en_route").length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-orange-500"></div>
              <span>作业: {vehicles.filter(v => ["loading", "unloading"].includes(v.status)).length}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>应急: {vehicles.filter(v => v.status === "emergency").length}</span>
            </div>
          </div>
        </div>

        {/* 批量选择状态 */}
        {isBatchSelecting && selectedVehicles.length > 0 && (
          <div className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-3">
            <div className="flex items-center space-x-3">
              <Badge className="bg-orange-100 text-orange-800">
                已选择 {selectedVehicles.length} 辆车
              </Badge>
              <Button size="sm" onClick={() => onVoiceDispatch(selectedVehicles)}>
                <Mic className="h-3 w-3 mr-1" />
                语音调度
              </Button>
              <Button size="sm" onClick={() => onVideoConference(selectedVehicles)}>
                <Video className="h-3 w-3 mr-1" />
                视频会商
              </Button>
            </div>
          </div>
        )}

        {/* 加载状态 */}
        {!isMapLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">地图加载中...</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
