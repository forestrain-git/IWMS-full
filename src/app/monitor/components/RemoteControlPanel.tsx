/**
 * @file RemoteControlPanel.tsx
 * @description 远程控制面板组件
 * @provides 设备启停控制、参数调整、权限验证等功能
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { 
  Power, 
  PowerOff, 
  AlertTriangle, 
  Settings,
  Shield,
  Play,
  Square,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock
} from "lucide-react";
import type { EquipmentInfo } from "../types/equipment";

// ==================== Props接口 ====================

interface RemoteControlPanelProps {
  /** 设备列表 */
  equipments: EquipmentInfo[];
  /** 选中的设备ID */
  selectedEquipmentId: string | null;
  /** 启动设备 */
  onStartEquipment: (id: string) => Promise<boolean>;
  /** 停止设备 */
  onStopEquipment: (id: string) => Promise<boolean>;
  /** 急停设备 */
  onEmergencyStop: (id: string) => Promise<boolean>;
  /** 更新控制参数 */
  onUpdateControlParams: (id: string, params: any) => Promise<boolean>;
}

// ==================== 子组件 ====================

/**
 * 设备控制按钮组
 */
function EquipmentControls({ 
  equipment, 
  onStart, 
  onStop, 
  onEmergencyStop 
}: {
  equipment: EquipmentInfo;
  onStart: () => Promise<void>;
  onStop: () => Promise<void>;
  onEmergencyStop: () => Promise<void>;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    setIsLoading(true);
    try {
      await onStart();
      console.log(`${equipment.name} 已成功启动`);
    } catch (error) {
      console.error(`${equipment.name} 启动失败，请检查设备状态`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStop = async () => {
    setIsLoading(true);
    try {
      await onStop();
      console.log(`${equipment.name} 已成功停止`);
    } catch (error) {
      console.error(`${equipment.name} 停止失败，请检查设备状态`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergencyStop = async () => {
    if (!confirm(`确定要紧急停止 ${equipment.name} 吗？此操作不可逆。`)) {
      return;
    }
    
    setIsLoading(true);
    try {
      await onEmergencyStop();
      console.log(`${equipment.name} 已紧急停止`);
    } catch (error) {
      console.error(`${equipment.name} 急停失败`);
    } finally {
      setIsLoading(false);
    }
  };

  const isRunning = equipment.status === "online";
  const canControl = equipment.status !== "error";

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <Settings className="h-4 w-4 mr-2" />
          设备控制
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 设备状态 */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">当前状态</span>
          <Badge className={
            equipment.status === "online" ? "bg-green-100 text-green-800" :
            equipment.status === "offline" ? "bg-gray-100 text-gray-800" :
            "bg-red-100 text-red-800"
          }>
            {equipment.status === "online" ? "运行中" :
             equipment.status === "offline" ? "已停止" : "故障"}
          </Badge>
        </div>

        {/* 控制按钮 */}
        <div className="grid grid-cols-3 gap-2">
          <Button
            size="sm"
            onClick={handleStart}
            disabled={isRunning || !canControl || isLoading}
            className="flex items-center"
          >
            <Play className="h-3 w-3 mr-1" />
            启动
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={handleStop}
            disabled={!isRunning || !canControl || isLoading}
            className="flex items-center"
          >
            <Square className="h-3 w-3 mr-1" />
            停止
          </Button>
          
          <Button
            size="sm"
            variant="destructive"
            onClick={handleEmergencyStop}
            disabled={isLoading}
            className="flex items-center"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            急停
          </Button>
        </div>

        {/* 权限提示 */}
        <div className="flex items-center space-x-2 text-xs text-gray-500">
          <Shield className="h-3 w-3" />
          <span>需要操作员权限</span>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 参数调整面板
 */
function ParameterAdjustment({ 
  equipment, 
  onUpdateParams 
}: {
  equipment: EquipmentInfo;
  onUpdateParams: (params: any) => Promise<void>;
}) {
  const [params, setParams] = useState(equipment.controlParams);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdate = async () => {
    setIsLoading(true);
    try {
      await onUpdateParams(params);
      console.log("设备参数已成功更新");
    } catch (error) {
      console.error("参数更新失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setParams(equipment.controlParams);
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <Settings className="h-4 w-4 mr-2" />
          参数调整
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 压力阈值 */}
        <div>
          <Label htmlFor="pressure" className="text-xs">压力阈值 (MPa)</Label>
          <Input
            id="pressure"
            type="number"
            step="0.1"
            value={params.pressureThreshold}
            onChange={(e) => setParams({
              ...params,
              pressureThreshold: parseFloat(e.target.value)
            })}
            className="h-8 text-sm"
            disabled={equipment.status !== "offline"}
          />
        </div>

        {/* 温度阈值 */}
        <div>
          <Label htmlFor="temperature" className="text-xs">温度阈值 (°C)</Label>
          <Input
            id="temperature"
            type="number"
            step="1"
            value={params.temperatureThreshold}
            onChange={(e) => setParams({
              ...params,
              temperatureThreshold: parseFloat(e.target.value)
            })}
            className="h-8 text-sm"
            disabled={equipment.status !== "offline"}
          />
        </div>

        {/* 振动阈值 */}
        <div>
          <Label htmlFor="vibration" className="text-xs">振动阈值 (mm)</Label>
          <Input
            id="vibration"
            type="number"
            step="0.1"
            value={params.vibrationThreshold}
            onChange={(e) => setParams({
              ...params,
              vibrationThreshold: parseFloat(e.target.value)
            })}
            className="h-8 text-sm"
            disabled={equipment.status !== "offline"}
          />
        </div>

        {/* 自动控制开关 */}
        <div className="flex items-center justify-between">
          <Label htmlFor="autoControl" className="text-xs">自动控制</Label>
          <Switch
            id="autoControl"
            checked={params.autoControl}
            onCheckedChange={(checked) => setParams({
              ...params,
              autoControl: checked
            })}
            disabled={equipment.status !== "offline"}
          />
        </div>

        {/* 运行模式 */}
        <div>
          <Label className="text-xs">运行模式</Label>
          <div className="flex space-x-2 mt-1">
            {["manual", "auto", "maintenance"].map((mode) => (
              <Button
                key={mode}
                size="sm"
                variant={params.operationMode === mode ? "default" : "outline"}
                onClick={() => setParams({
                  ...params,
                  operationMode: mode as any
                })}
                className="flex-1 text-xs"
                disabled={equipment.status !== "offline"}
              >
                {mode === "manual" ? "手动" : mode === "auto" ? "自动" : "维护"}
              </Button>
            ))}
          </div>
        </div>

        {/* 操作按钮 */}
        <div className="flex space-x-2">
          <Button
            size="sm"
            onClick={handleUpdate}
            disabled={isLoading || equipment.status !== "offline"}
            className="flex-1"
          >
            {isLoading ? <Clock className="h-3 w-3 mr-1 animate-spin" /> : <CheckCircle className="h-3 w-3 mr-1" />}
            应用
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={handleReset}
            disabled={isLoading}
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            重置
          </Button>
        </div>

        {/* 提示信息 */}
        {equipment.status !== "offline" && (
          <div className="flex items-center space-x-2 text-xs text-yellow-600 bg-yellow-50 p-2 rounded">
            <AlertTriangle className="h-3 w-3" />
            <span>设备必须处于停止状态才能调整参数</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/**
 * 操作历史
 */
function OperationHistory({ equipment }: { equipment: EquipmentInfo }) {
  const operations = equipment.operations.slice(-5).reverse();

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <Clock className="h-4 w-4 mr-2" />
          操作历史
        </CardTitle>
      </CardHeader>
      <CardContent>
        {operations.length === 0 ? (
          <div className="text-center py-4">
            <div className="text-sm text-gray-500">暂无操作记录</div>
          </div>
        ) : (
          <div className="space-y-2">
            {operations.map((operation) => (
              <div key={operation.id} className="flex items-center justify-between text-xs p-2 bg-gray-50 rounded">
                <div className="flex items-center space-x-2">
                  {operation.result === "success" ? (
                    <CheckCircle className="h-3 w-3 text-green-500" />
                  ) : (
                    <XCircle className="h-3 w-3 text-red-500" />
                  )}
                  <span>{operation.description}</span>
                </div>
                <div className="text-gray-500">
                  {new Date(operation.timestamp).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ==================== 主组件 ====================

/**
 * 远程控制面板组件
 */
export function RemoteControlPanel({
  equipments,
  selectedEquipmentId,
  onStartEquipment,
  onStopEquipment,
  onEmergencyStop,
  onUpdateControlParams,
}: RemoteControlPanelProps) {
  const selectedEquipment = equipments.find(eq => eq.id === selectedEquipmentId);

  if (!selectedEquipment) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Power className="h-4 w-4 mr-2" />
            远程控制
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <PowerOff className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <div className="text-sm text-gray-600">请选择设备进行控制</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* 设备控制 */}
      <EquipmentControls
        equipment={selectedEquipment}
        onStart={async () => { await onStartEquipment(selectedEquipment.id); }}
        onStop={async () => { await onStopEquipment(selectedEquipment.id); }}
        onEmergencyStop={async () => { await onEmergencyStop(selectedEquipment.id); }}
      />

      {/* 参数调整 */}
      <ParameterAdjustment
        equipment={selectedEquipment}
        onUpdateParams={async (params) => { await onUpdateControlParams(selectedEquipment.id, params); }}
      />

      {/* 操作历史 */}
      <OperationHistory equipment={selectedEquipment} />
    </div>
  );
}
