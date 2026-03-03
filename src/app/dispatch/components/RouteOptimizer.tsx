/**
 * @file RouteOptimizer.tsx
 * @description 路径优化组件
 * @provides 优化参数设置、算法执行、进度显示等功能
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Route, 
  Clock, 
  Fuel, 
  Leaf, 
  Play, 
  Square,
  Settings,
  Zap,
  TrendingUp,
  BarChart3,
  Target,
  Truck,
  Package,
  AlertCircle
} from "lucide-react";
import type { Vehicle, Task, OptimizationTarget } from "../types/dispatch";

// ==================== Props接口 ====================

interface RouteOptimizerProps {
  /** 车辆列表 */
  vehicles: Vehicle[];
  /** 任务列表 */
  tasks: Task[];
  /** 优化目标 */
  target: OptimizationTarget;
  /** 选中的车辆ID列表 */
  selectedVehicleIds: string[];
  /** 选中的任务ID列表 */
  selectedTaskIds: string[];
  /** 目标变更回调 */
  onTargetChange: (target: OptimizationTarget) => void;
  /** 车辆选择回调 */
  onVehicleSelectionChange: (vehicleIds: string[]) => void;
  /** 任务选择回调 */
  onTaskSelectionChange: (taskIds: string[]) => void;
  /** 开始优化回调 */
  onStartOptimization: () => void;
  /** 停止优化回调 */
  onStopOptimization: () => void;
  /** 是否正在优化 */
  isOptimizing: boolean;
  /** 优化进度 */
  optimizationProgress: number;
}

// ==================== 子组件 ====================

/**
 * 优化目标选择器组件
 */
function OptimizationTargetSelector({
  target,
  onTargetChange,
}: {
  target: OptimizationTarget;
  onTargetChange: (target: OptimizationTarget) => void;
}) {
  const targets = [
    { value: "distance", label: "距离", icon: <Route className="h-4 w-4" />, description: "最小化总行驶距离" },
    { value: "time", label: "时间", icon: <Clock className="h-4 w-4" />, description: "最小化总行驶时间" },
    { value: "fuel", label: "油耗", icon: <Fuel className="h-4 w-4" />, description: "最小化燃油消耗" },
    { value: "emission", label: "排放", icon: <Leaf className="h-4 w-4" />, description: "最小化碳排放" },
  ] as const;

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">优化目标</Label>
      <div className="grid grid-cols-2 gap-3">
        {targets.map(({ value, label, icon, description }) => (
          <Card
            key={value}
            className={`cursor-pointer transition-all hover:shadow-md ${
              target === value ? "ring-2 ring-blue-500 bg-blue-50" : ""
            }`}
            onClick={() => onTargetChange(value)}
          >
            <CardContent className="p-3">
              <div className="flex items-center space-x-3">
                <div className={`p-2 rounded-lg ${
                  target === value ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"
                }`}>
                  {icon}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-sm">{label}</h4>
                  <p className="text-xs text-gray-500">{description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

/**
 * 车辆选择器组件
 */
function VehicleSelector({
  vehicles,
  selectedIds,
  onSelectionChange,
}: {
  vehicles: Vehicle[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}) {
  const availableVehicles = vehicles.filter(v => v.status === "idle" || v.status === "en_route");

  const handleToggle = (vehicleId: string) => {
    if (selectedIds.includes(vehicleId)) {
      onSelectionChange(selectedIds.filter(id => id !== vehicleId));
    } else {
      onSelectionChange([...selectedIds, vehicleId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === availableVehicles.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(availableVehicles.map(v => v.id));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">选择车辆 ({selectedIds.length}/{availableVehicles.length})</Label>
        <Button size="sm" variant="outline" onClick={handleSelectAll}>
          {selectedIds.length === availableVehicles.length ? "全选" : "取消全选"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
        {availableVehicles.map(vehicle => (
          <div
            key={vehicle.id}
            className={`flex items-center space-x-3 p-2 rounded-lg border cursor-pointer transition-colors ${
              selectedIds.includes(vehicle.id)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handleToggle(vehicle.id)}
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(vehicle.id)}
              onChange={() => {}}
              className="rounded"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">{vehicle.plateNumber}</span>
                <Badge className="bg-gray-100 text-gray-800 text-xs">
                  {vehicle.status}
                </Badge>
              </div>
              <div className="text-xs text-gray-500">
                {vehicle.driver.name} • 载重 {vehicle.capacity.current}/{vehicle.capacity.max}t
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 任务选择器组件
 */
function TaskSelector({
  tasks,
  selectedIds,
  onSelectionChange,
}: {
  tasks: Task[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}) {
  const pendingTasks = tasks.filter(t => t.status === "pending" || t.status === "assigned");

  const handleToggle = (taskId: string) => {
    if (selectedIds.includes(taskId)) {
      onSelectionChange(selectedIds.filter(id => id !== taskId));
    } else {
      onSelectionChange([...selectedIds, taskId]);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === pendingTasks.length) {
      onSelectionChange([]);
    } else {
      onSelectionChange(pendingTasks.map(t => t.id));
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">选择任务 ({selectedIds.length}/{pendingTasks.length})</Label>
        <Button size="sm" variant="outline" onClick={handleSelectAll}>
          {selectedIds.length === pendingTasks.length ? "全选" : "取消全选"}
        </Button>
      </div>
      
      <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
        {pendingTasks.map(task => (
          <div
            key={task.id}
            className={`flex items-center space-x-3 p-2 rounded-lg border cursor-pointer transition-colors ${
              selectedIds.includes(task.id)
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handleToggle(task.id)}
          >
            <input
              type="checkbox"
              checked={selectedIds.includes(task.id)}
              onChange={() => {}}
              className="rounded"
            />
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-sm">{task.name}</span>
                <Badge className={`text-xs ${
                  task.priority === "urgent" ? "bg-red-100 text-red-800" :
                  task.priority === "high" ? "bg-orange-100 text-orange-800" :
                  "bg-blue-100 text-blue-800"
                }`}>
                  {task.priority}
                </Badge>
              </div>
              <div className="text-xs text-gray-500">
                {task.pickup.address} • {task.estimatedWorkload.duration}分钟
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * 优化进度组件
 */
function OptimizationProgress({
  progress,
  isOptimizing,
  onStop,
}: {
  progress: number;
  isOptimizing: boolean;
  onStop: () => void;
}) {
  if (!isOptimizing) return null;

  return (
    <Card className="border-blue-200 bg-blue-50">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
              <span className="text-sm font-medium text-blue-800">正在优化路径...</span>
            </div>
            <Button size="sm" variant="outline" onClick={onStop}>
              <Square className="h-3 w-3 mr-1" />
              停止
            </Button>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-blue-700">
              <span>遗传算法优化中</span>
              <span>{Math.round(progress * 100)}%</span>
            </div>
            <div className="w-full bg-blue-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
            <div className="text-xs text-blue-600">
              预计剩余时间: {Math.round((1 - progress) * 5)}秒
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 优化统计组件
 */
function OptimizationStats({
  vehicles,
  tasks,
  selectedVehicleIds,
  selectedTaskIds,
}: {
  vehicles: Vehicle[];
  tasks: Task[];
  selectedVehicleIds: string[];
  selectedTaskIds: string[];
}) {
  const selectedVehicles = vehicles.filter(v => selectedVehicleIds.includes(v.id));
  const selectedTasks = tasks.filter(t => selectedTaskIds.includes(t.id));

  const totalCapacity = selectedVehicles.reduce((sum, v) => sum + v.capacity.max, 0);
  const totalWeight = selectedTasks.reduce((sum, t) => sum + t.estimatedWorkload.weight, 0);
  const totalDuration = selectedTasks.reduce((sum, t) => sum + t.estimatedWorkload.duration, 0);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-gray-500" />
            <h4 className="font-semibold text-sm">优化统计</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Truck className="h-4 w-4 text-blue-500" />
                <span>车辆: {selectedVehicleIds.length}辆</span>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="h-4 w-4 text-green-500" />
                <span>任务: {selectedTaskIds.length}个</span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Target className="h-4 w-4 text-orange-500" />
                <span>载重: {totalWeight.toFixed(1)}/{totalCapacity.toFixed(1)}t</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-purple-500" />
                <span>时长: {Math.round(totalDuration / 60)}小时</span>
              </div>
            </div>
          </div>

          {totalWeight > totalCapacity && (
            <div className="flex items-center space-x-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
              <AlertCircle className="h-3 w-3" />
              <span>注意: 任务总重量超过车辆总载重</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== 主组件 ====================

/**
 * 路径优化组件
 */
export function RouteOptimizer({
  vehicles,
  tasks,
  target,
  selectedVehicleIds,
  selectedTaskIds,
  onTargetChange,
  onVehicleSelectionChange,
  onTaskSelectionChange,
  onStartOptimization,
  onStopOptimization,
  isOptimizing,
  optimizationProgress,
}: RouteOptimizerProps) {
  const canStartOptimization = selectedVehicleIds.length > 0 && selectedTaskIds.length > 0 && !isOptimizing;

  return (
    <div className="space-y-4">
      {/* 标题 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-3">
            <Zap className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">路径优化</CardTitle>
            {isOptimizing && (
              <Badge className="bg-blue-100 text-blue-800 animate-pulse">
                优化中
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* 优化目标选择 */}
      <OptimizationTargetSelector
        target={target}
        onTargetChange={onTargetChange}
      />

      {/* 车辆选择 */}
      <VehicleSelector
        vehicles={vehicles}
        selectedIds={selectedVehicleIds}
        onSelectionChange={onVehicleSelectionChange}
      />

      {/* 任务选择 */}
      <TaskSelector
        tasks={tasks}
        selectedIds={selectedTaskIds}
        onSelectionChange={onTaskSelectionChange}
      />

      {/* 优化统计 */}
      <OptimizationStats
        vehicles={vehicles}
        tasks={tasks}
        selectedVehicleIds={selectedVehicleIds}
        selectedTaskIds={selectedTaskIds}
      />

      {/* 优化进度 */}
      <OptimizationProgress
        progress={optimizationProgress}
        isOptimizing={isOptimizing}
        onStop={onStopOptimization}
      />

      {/* 操作按钮 */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {canStartOptimization 
                ? "准备就绪，可以开始优化"
                : selectedVehicleIds.length === 0
                ? "请选择至少一辆车辆"
                : selectedTaskIds.length === 0
                ? "请选择至少一个任务"
                : "正在优化中..."
              }
            </div>
            
            <div className="flex space-x-2">
              {isOptimizing ? (
                <Button onClick={onStopOptimization} variant="outline">
                  <Square className="h-4 w-4 mr-2" />
                  停止优化
                </Button>
              ) : (
                <Button 
                  onClick={onStartOptimization}
                  disabled={!canStartOptimization}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Play className="h-4 w-4 mr-2" />
                  开始优化
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 算法说明 */}
      <Card className="border-gray-200">
        <CardContent className="p-4">
          <div className="flex items-center space-x-2 mb-2">
            <Settings className="h-4 w-4 text-gray-500" />
            <h4 className="font-semibold text-sm">算法说明</h4>
          </div>
          <div className="text-xs text-gray-600 space-y-1">
            <p>• 使用遗传算法(GA)求解车辆路径问题(VRP)</p>
            <p>• 种群大小: 50，进化代数: 100</p>
            <p>• 预计执行时间: 3-5秒</p>
            <p>• 支持多目标优化: 距离、时间、油耗、排放</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
