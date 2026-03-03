/**
 * @file VehicleCard.tsx
 * @description 车辆状态卡片组件
 * @provides 车辆信息展示、进度饼图、操作按钮等功能
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Truck, 
  User, 
  Fuel, 
  Gauge, 
  Clock, 
  Phone, 
  Mic, 
  Video,
  MapPin,
  AlertTriangle,
  CheckCircle,
  Wrench,
  Play,
  Square,
  RotateCcw
} from "lucide-react";
import type { Vehicle, VehicleStatus } from "../types/dispatch";

// ==================== Props接口 ====================

interface VehicleCardProps {
  /** 车辆信息 */
  vehicle: Vehicle;
  /** 是否选中 */
  selected?: boolean;
  /** 选择回调 */
  onSelect?: (vehicleId: string) => void;
  /** 状态更新回调 */
  onUpdateStatus?: (vehicleId: string, status: VehicleStatus) => void;
  /** 语音调度回调 */
  onVoiceDispatch?: (vehicleIds: string[]) => void;
  /** 视频会商回调 */
  onVideoConference?: (vehicleIds: string[]) => void;
}

// ==================== 子组件 ====================

/**
 * 车辆状态图标组件
 */
function VehicleStatusIcon({ status }: { status: VehicleStatus }) {
  const iconMap = {
    idle: <CheckCircle className="h-4 w-4 text-green-500" />,
    en_route: <Truck className="h-4 w-4 text-blue-500" />,
    loading: <RotateCcw className="h-4 w-4 text-orange-500" />,
    unloading: <RotateCcw className="h-4 w-4 text-orange-500" />,
    maintenance: <Wrench className="h-4 w-4 text-gray-500" />,
    emergency: <AlertTriangle className="h-4 w-4 text-red-500" />,
  };

  return iconMap[status];
}

/**
 * 载重进度饼图组件
 */
function LoadProgressPieChart({ current, max }: { current: number; max: number }) {
  const percentage = (current / max) * 100;
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative w-12 h-12">
      <svg className="transform -rotate-90 w-12 h-12">
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          className="text-gray-200"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className={`${
            percentage > 80 ? "text-red-500" : 
            percentage > 60 ? "text-orange-500" : 
            "text-green-500"
          } transition-colors`}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-semibold">{Math.round(percentage)}%</span>
      </div>
    </div>
  );
}

/**
 * 油位指示器组件
 */
function FuelIndicator({ level }: { level: number }) {
  const getColor = () => {
    if (level > 50) return "bg-green-500";
    if (level > 20) return "bg-orange-500";
    return "bg-red-500";
  };

  return (
    <div className="flex items-center space-x-2">
      <Fuel className="h-4 w-4 text-gray-500" />
      <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
        <div 
          className={`h-full transition-all ${getColor()}`}
          style={{ width: `${level}%` }}
        />
      </div>
      <span className="text-xs font-medium">{level}%</span>
    </div>
  );
}

/**
 * 车辆操作按钮组件
 */
function VehicleActions({
  vehicle,
  onVoiceDispatch,
  onVideoConference,
  onUpdateStatus,
}: {
  vehicle: Vehicle;
  onVoiceDispatch?: (vehicleIds: string[]) => void;
  onVideoConference?: (vehicleIds: string[]) => void;
  onUpdateStatus?: (vehicleId: string, status: VehicleStatus) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-2">
      {/* 主要操作 */}
      <div className="flex space-x-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onVoiceDispatch?.([vehicle.id])}
          className="flex-1"
        >
          <Phone className="h-3 w-3 mr-1" />
          呼叫
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onVoiceDispatch?.([vehicle.id])}
          className="flex-1"
        >
          <Mic className="h-3 w-3 mr-1" />
          语音
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onVideoConference?.([vehicle.id])}
          className="flex-1"
        >
          <Video className="h-3 w-3 mr-1" />
          视频
        </Button>
      </div>

      {/* 扩展操作 */}
      <div className="flex items-center justify-between">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs"
        >
          {isExpanded ? "收起" : "更多"}
        </Button>
      </div>

      {isExpanded && onUpdateStatus && (
        <div className="border-t pt-2 space-y-1">
          <div className="text-xs text-gray-500 mb-2">状态控制:</div>
          <div className="grid grid-cols-2 gap-1">
            {vehicle.status === "idle" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateStatus(vehicle.id, "en_route")}
                className="text-xs"
              >
                <Play className="h-3 w-3 mr-1" />
                出发
              </Button>
            )}
            {vehicle.status === "en_route" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateStatus(vehicle.id, "loading")}
                className="text-xs"
              >
                <Square className="h-3 w-3 mr-1" />
                到达
              </Button>
            )}
            {["loading", "unloading"].includes(vehicle.status) && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateStatus(vehicle.id, "en_route")}
                className="text-xs"
              >
                <Play className="h-3 w-3 mr-1" />
                继续行驶
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateStatus(vehicle.id, "idle")}
              className="text-xs"
            >
              <RotateCcw className="h-3 w-3 mr-1" />
              重置
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== 主组件 ====================

/**
 * 车辆状态卡片组件
 */
export function VehicleCard({
  vehicle,
  selected = false,
  onSelect,
  onUpdateStatus,
  onVoiceDispatch,
  onVideoConference,
}: VehicleCardProps) {
  const getStatusColor = (status: VehicleStatus) => {
    const colorMap = {
      idle: "border-green-200 bg-green-50",
      en_route: "border-blue-200 bg-blue-50",
      loading: "border-orange-200 bg-orange-50",
      unloading: "border-orange-200 bg-orange-50",
      maintenance: "border-gray-200 bg-gray-50",
      emergency: "border-red-200 bg-red-50",
    };
    return colorMap[status];
  };

  const getStatusBadgeColor = (status: VehicleStatus) => {
    const colorMap = {
      idle: "bg-green-100 text-green-800",
      en_route: "bg-blue-100 text-blue-800",
      loading: "bg-orange-100 text-orange-800",
      unloading: "bg-orange-100 text-orange-800",
      maintenance: "bg-gray-100 text-gray-800",
      emergency: "bg-red-100 text-red-800",
    };
    return colorMap[status];
  };

  return (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${
        selected ? "ring-2 ring-blue-500" : ""
      } ${getStatusColor(vehicle.status)}`}
      onClick={() => onSelect?.(vehicle.id)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <VehicleStatusIcon status={vehicle.status} />
            <div>
              <CardTitle className="text-sm font-semibold">
                {vehicle.plateNumber}
              </CardTitle>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <Truck className="h-3 w-3" />
                <span>{vehicle.type === "collection" ? "收运" : vehicle.type === "transport" ? "运输" : "应急"}</span>
              </div>
            </div>
          </div>
          <Badge className={getStatusBadgeColor(vehicle.status)}>
            {vehicle.status === "idle" ? "空闲" :
             vehicle.status === "en_route" ? "在途" :
             vehicle.status === "loading" ? "装载" :
             vehicle.status === "unloading" ? "卸载" :
             vehicle.status === "maintenance" ? "维保" : "应急"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* 驾驶员信息 */}
        <div className="flex items-center space-x-2 text-sm">
          <User className="h-4 w-4 text-gray-500" />
          <span className="font-medium">{vehicle.driver.name}</span>
          <span className="text-gray-500">{vehicle.driver.phone}</span>
        </div>

        {/* 位置信息 */}
        <div className="flex items-start space-x-2 text-sm">
          <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
          <div className="flex-1">
            <div className="text-gray-600">
              纬度: {vehicle.location.latitude.toFixed(4)}, 
              经度: {vehicle.location.longitude.toFixed(4)}
            </div>
            {vehicle.location.speed && (
              <div className="text-gray-500 text-xs">
                速度: {vehicle.location.speed.toFixed(1)} km/h
              </div>
            )}
          </div>
        </div>

        {/* 载重和油位 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">载重</span>
              <LoadProgressPieChart 
                current={vehicle.capacity.current} 
                max={vehicle.capacity.max} 
              />
            </div>
            <div className="text-xs text-gray-500">
              {vehicle.capacity.current.toFixed(1)}/{vehicle.capacity.max}t
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-sm font-medium">油位</div>
            <FuelIndicator level={vehicle.fuel.level} />
            <div className="text-xs text-gray-500">
              {vehicle.fuel.consumption}L/100km
            </div>
          </div>
        </div>

        {/* 今日统计 */}
        <div className="border-t pt-3">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div>
                <div className="font-medium">{vehicle.completedTasksToday}</div>
                <div className="text-xs text-gray-500">完成任务</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <div>
                <div className="font-medium">{Math.floor(vehicle.workMinutesToday / 60)}h</div>
                <div className="text-xs text-gray-500">工作时长</div>
              </div>
            </div>
          </div>
        </div>

        {/* 维保提醒 */}
        {vehicle.maintenance.daysUntilNext <= 7 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
            <div className="flex items-center space-x-2 text-sm text-yellow-800">
              <Wrench className="h-4 w-4" />
              <span>
                {vehicle.maintenance.daysUntilNext === 0 
                  ? "今日需要维保" 
                  : `${vehicle.maintenance.daysUntilNext}天后需要维保`}
              </span>
            </div>
          </div>
        )}

        {/* 操作按钮 */}
        <VehicleActions
          vehicle={vehicle}
          onVoiceDispatch={onVoiceDispatch}
          onVideoConference={onVideoConference}
          onUpdateStatus={onUpdateStatus}
        />
      </CardContent>
    </Card>
  );
}
