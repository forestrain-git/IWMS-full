/**
 * @file RealtimeDataPanel.tsx
 * @description 实时数据面板组件
 * @provides 设备实时数据显示、趋势图表、状态监控等功能
 */

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { StatusTag } from "@/components/business/StatusTag";
import { TrendChart } from "@/components/business/TrendChart";
import { 
  Activity, 
  Thermometer, 
  Zap, 
  Gauge,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import type { EquipmentInfo } from "../types/equipment";

// ==================== Props接口 ====================

interface RealtimeDataPanelProps {
  /** 设备列表 */
  equipments: EquipmentInfo[];
  /** 选中的设备ID */
  selectedEquipmentId: string | null;
  /** 设备选择回调 */
  onEquipmentSelect: (id: string) => void;
}

// ==================== 子组件 ====================

/**
 * 设备实时数据卡片
 */
function EquipmentDataCard({ equipment }: { equipment: EquipmentInfo }) {
  const [trendData, setTrendData] = useState<Array<{timestamp: string, value: number, label: string}>>([]);

  // 生成模拟趋势数据
  useEffect(() => {
    const generateTrendData = () => {
      const now = new Date();
      const data = [];
      
      for (let i = 23; i >= 0; i--) {
        const time = new Date(now);
        time.setHours(time.getHours() - i);
        
        data.push({
          timestamp: time.toISOString(),
          value: equipment.realtimeData.pressure + (Math.random() - 0.5) * 2,
          label: `${time.getHours()}:00`
        });
      }
      
      setTrendData(data);
    };

    generateTrendData();
    // 暂时注释掉定时器，避免热更新死循环
    // const interval = setInterval(generateTrendData, 5000); // 每5秒更新
    
    return () => {
      // clearInterval(interval);
    };
  }, [equipment.realtimeData.pressure]);

  const dataItems = [
    {
      label: "压力",
      value: `${equipment.realtimeData.pressure.toFixed(1)} MPa`,
      icon: Gauge,
      color: "blue" as const,
      trend: ((Math.random() - 0.5) * 10).toFixed(1),
      unit: "MPa",
    },
    {
      label: "温度",
      value: `${equipment.realtimeData.temperature.toFixed(1)} °C`,
      icon: Thermometer,
      color: "red" as const,
      trend: ((Math.random() - 0.5) * 5).toFixed(1),
      unit: "°C",
    },
    {
      label: "振动",
      value: `${equipment.realtimeData.vibration.toFixed(1)} mm`,
      icon: Activity,
      color: "amber" as const,
      trend: ((Math.random() - 0.5) * 2).toFixed(1),
      unit: "mm",
    },
    {
      label: "电流",
      value: `${equipment.realtimeData.current.toFixed(1)} A`,
      icon: Zap,
      color: "green" as const,
      trend: ((Math.random() - 0.5) * 8).toFixed(1),
      unit: "A",
    },
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{equipment.name}</CardTitle>
          <StatusTag 
            status={equipment.status as any}
            size="sm"
            showLabel
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 实时数据指标 */}
        <div className="grid grid-cols-2 gap-3">
          {dataItems.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <item.icon className="h-4 w-4 text-gray-500" />
              <div className="flex-1">
                <div className="text-xs text-gray-500">{item.label}</div>
                <div className="text-sm font-semibold">{item.value}</div>
              </div>
              {Math.random() > 0.5 && (
                <TrendingUp className="h-3 w-3 text-green-500" />
              )}
            </div>
          ))}
        </div>

        {/* 压力趋势图 */}
        <div>
          <div className="text-xs text-gray-500 mb-2">压力趋势 (24h)</div>
          <TrendChart
            data={trendData}
            height={80}
            trendType={parseFloat(dataItems[0].trend) > 0 ? "positive" : "negative"}
            showTooltip={false}
          />
        </div>

        {/* 健康度指示 */}
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-xs text-gray-500">健康度</span>
          <div className="flex items-center space-x-2">
            <div className="flex-1 bg-gray-200 rounded-full h-2 w-16">
              <div 
                className={`h-2 rounded-full ${
                  equipment.predictiveData.healthScore > 80 ? "bg-green-500" :
                  equipment.predictiveData.healthScore > 60 ? "bg-blue-500" :
                  equipment.predictiveData.healthScore > 40 ? "bg-yellow-500" :
                  "bg-red-500"
                }`}
                style={{ width: `${equipment.predictiveData.healthScore}%` }}
              />
            </div>
            <span className="text-xs font-semibold">
              {equipment.predictiveData.healthScore}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 设备列表视图
 */
function EquipmentListView({ 
  equipments, 
  selectedEquipmentId, 
  onEquipmentSelect 
}: {
  equipments: EquipmentInfo[];
  selectedEquipmentId: string | null;
  onEquipmentSelect: (id: string) => void;
}) {
  const sortedEquipments = useMemo(() => {
    return [...equipments].sort((a, b) => {
      // 按状态排序：故障 > 离线 > 在线
      const statusOrder = { error: 0, offline: 1, online: 2 };
      const aStatus = statusOrder[a.status as keyof typeof statusOrder] ?? 3;
      const bStatus = statusOrder[b.status as keyof typeof statusOrder] ?? 3;
      
      if (aStatus !== bStatus) return aStatus - bStatus;
      
      // 相同状态按健康度排序
      return a.predictiveData.healthScore - b.predictiveData.healthScore;
    });
  }, [equipments]);

  return (
    <div className="space-y-3">
      {sortedEquipments.map((equipment) => (
        <div
          key={equipment.id}
          onClick={() => onEquipmentSelect(equipment.id)}
          className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
            selectedEquipmentId === equipment.id
              ? "border-blue-500 bg-blue-50"
              : "border-gray-200 hover:border-gray-300"
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium truncate">{equipment.name}</h4>
            <StatusTag 
              status={equipment.status as any}
              size="sm"
              showLabel
            />
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div>
              <span className="text-gray-500">压力:</span>
              <span className="ml-1 font-semibold">
                {equipment.realtimeData.pressure.toFixed(1)} MPa
              </span>
            </div>
            <div>
              <span className="text-gray-500">温度:</span>
              <span className="ml-1 font-semibold">
                {equipment.realtimeData.temperature.toFixed(1)} °C
              </span>
            </div>
            <div>
              <span className="text-gray-500">健康度:</span>
              <span className={`ml-1 font-semibold ${
                equipment.predictiveData.healthScore > 80 ? "text-green-600" :
                equipment.predictiveData.healthScore > 60 ? "text-blue-600" :
                equipment.predictiveData.healthScore > 40 ? "text-yellow-600" :
                "text-red-600"
              }`}>
                {equipment.predictiveData.healthScore}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==================== 主组件 ====================

/**
 * 实时数据面板组件
 */
export function RealtimeDataPanel({
  equipments,
  selectedEquipmentId,
  onEquipmentSelect,
}: RealtimeDataPanelProps) {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const selectedEquipment = useMemo(() => {
    return equipments.find(eq => eq.id === selectedEquipmentId);
  }, [equipments, selectedEquipmentId]);

  const statistics = useMemo(() => {
    const online = equipments.filter(eq => eq.status === "online").length;
    const offline = equipments.filter(eq => eq.status === "offline").length;
    const error = equipments.filter(eq => eq.status === "error").length;
    const avgHealth = equipments.reduce((sum, eq) => sum + eq.predictiveData.healthScore, 0) / equipments.length;

    return { online, offline, error, avgHealth };
  }, [equipments]);

  return (
    <div className="space-y-4">
      {/* 统计概览 */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Activity className="h-4 w-4 mr-2" />
            设备概览
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-green-600">{statistics.online}</div>
              <div className="text-xs text-gray-500">在线</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-600">{statistics.offline}</div>
              <div className="text-xs text-gray-500">离线</div>
            </div>
            <div>
              <div className="text-lg font-bold text-red-600">{statistics.error}</div>
              <div className="text-xs text-gray-500">故障</div>
            </div>
            <div>
              <div className="text-lg font-bold text-blue-600">
                {statistics.avgHealth.toFixed(0)}
              </div>
              <div className="text-xs text-gray-500">平均健康度</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 视图切换 */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">设备监控</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`px-3 py-1 text-xs rounded ${
              viewMode === "grid"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            网格视图
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`px-3 py-1 text-xs rounded ${
              viewMode === "list"
                ? "bg-blue-500 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            列表视图
          </button>
        </div>
      </div>

      {/* 设备列表/网格 */}
      {viewMode === "list" ? (
        <EquipmentListView
          equipments={equipments}
          selectedEquipmentId={selectedEquipmentId}
          onEquipmentSelect={onEquipmentSelect}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {equipments.slice(0, 4).map((equipment) => (
            <EquipmentDataCard key={equipment.id} equipment={equipment} />
          ))}
        </div>
      )}

      {/* 选中设备详情 */}
      {selectedEquipment && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-blue-500" />
              {selectedEquipment.name} - 详细数据
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">设备型号:</span>
                  <span className="font-medium">{selectedEquipment.model}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">制造商:</span>
                  <span className="font-medium">{selectedEquipment.manufacturer}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">固件版本:</span>
                  <span className="font-medium">{selectedEquipment.firmwareVersion}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">安装日期:</span>
                  <span className="font-medium">
                    {new Date(selectedEquipment.installDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">功率:</span>
                  <span className="font-medium">
                    {selectedEquipment.realtimeData.power.toFixed(1)} kW
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">转速:</span>
                  <span className="font-medium">
                    {selectedEquipment.realtimeData.speed} rpm
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">剩余寿命:</span>
                  <span className="font-medium">
                    {selectedEquipment.predictiveData.remainingLife} h
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">故障概率:</span>
                  <span className="font-medium text-red-600">
                    {selectedEquipment.predictiveData.failureProbability.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
