/**
 * @file PredictiveMaintenance.tsx
 * @description 预测性维护面板组件
 * @provides AI健康度评估、故障预警、维护建议等功能
 */

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendChart } from "@/components/business/TrendChart";
import { 
  Heart, 
  AlertTriangle, 
  Wrench, 
  Calendar,
  TrendingDown,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import type { EquipmentInfo } from "../types/equipment";

// ==================== Props接口 ====================

interface PredictiveMaintenanceProps {
  /** 设备列表 */
  equipments: EquipmentInfo[];
  /** 选中的设备ID */
  selectedEquipmentId: string | null;
}

// ==================== 子组件 ====================

/**
 * 健康度评分卡片
 */
function HealthScoreCard({ equipment }: { equipment: EquipmentInfo }) {
  const { healthScore, failureProbability, remainingLife } = equipment.predictiveData;
  
  const getHealthColor = (score: number) => {
    if (score > 80) return "text-green-600";
    if (score > 60) return "text-blue-600";
    if (score > 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getHealthBgColor = (score: number) => {
    if (score > 80) return "bg-green-100";
    if (score > 60) return "bg-blue-100";
    if (score > 40) return "bg-yellow-100";
    return "bg-red-100";
  };

  const getHealthStatus = (score: number) => {
    if (score > 80) return "优秀";
    if (score > 60) return "良好";
    if (score > 40) return "警告";
    return "危险";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <Heart className="h-4 w-4 mr-2" />
          AI健康度评估
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* 健康度评分 */}
        <div className="text-center">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full ${getHealthBgColor(healthScore)}`}>
            <span className={`text-2xl font-bold ${getHealthColor(healthScore)}`}>
              {healthScore}
            </span>
          </div>
          <div className={`text-sm font-medium mt-2 ${getHealthColor(healthScore)}`}>
            {getHealthStatus(healthScore)}
          </div>
        </div>

        {/* 关键指标 */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">故障概率</span>
            <span className={`text-sm font-semibold ${
              failureProbability > 30 ? "text-red-600" :
              failureProbability > 15 ? "text-yellow-600" :
              "text-green-600"
            }`}>
              {failureProbability.toFixed(1)}%
            </span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">剩余寿命</span>
            <span className="text-sm font-semibold">
              {Math.floor(remainingLife / 24)} 天
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">下次维护</span>
            <span className="text-sm font-semibold">
              {new Date(equipment.predictiveData.nextMaintenance).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* 健康度进度条 */}
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>健康度</span>
            <span>{healthScore}/100</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                healthScore > 80 ? "bg-green-500" :
                healthScore > 60 ? "bg-blue-500" :
                healthScore > 40 ? "bg-yellow-500" :
                "bg-red-500"
              }`}
              style={{ width: `${healthScore}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 故障预警列表
 */
function FaultPredictions({ equipment }: { equipment: EquipmentInfo }) {
  const { faultPredictions } = equipment.predictiveData;
  
  if (faultPredictions.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            故障预警
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">
            <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-sm text-gray-600">暂无故障预警</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-600 bg-red-100";
      case "high": return "text-orange-600 bg-orange-100";
      case "medium": return "text-yellow-600 bg-yellow-100";
      case "low": return "text-blue-600 bg-blue-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getSeverityText = (severity: string) => {
    switch (severity) {
      case "critical": return "紧急";
      case "high": return "高";
      case "medium": return "中";
      case "low": return "低";
      default: return "未知";
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 text-red-500" />
          故障预警 ({faultPredictions.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {faultPredictions.map((prediction, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{prediction.type}</span>
                <Badge className={getSeverityColor(prediction.severity)}>
                  {getSeverityText(prediction.severity)}
                </Badge>
              </div>
              
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>发生概率:</span>
                  <span className="font-semibold">{prediction.probability}%</span>
                </div>
                <div className="flex justify-between">
                  <span>预计时间:</span>
                  <span className="font-semibold">
                    {new Date(prediction.estimatedTime).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 健康趋势图
 */
function HealthTrendChart({ equipment }: { equipment: EquipmentInfo }) {
  const trendData = equipment.predictiveData.healthTrend.map(point => ({
    timestamp: point.timestamp.toISOString(),
    value: point.score,
    label: new Date(point.timestamp).toLocaleDateString()
  }));

  // 计算趋势
  const recentTrend = useMemo(() => {
    if (trendData.length < 2) return "neutral";
    const recent = trendData.slice(-7);
    const first = recent[0].value;
    const last = recent[recent.length - 1].value;
    return last > first ? "positive" : last < first ? "negative" : "neutral";
  }, [trendData]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <TrendingUp className="h-4 w-4 mr-2" />
          健康趋势 (30天)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <TrendChart
          data={trendData}
          height={120}
          trendType={recentTrend}
          showTooltip={true}
        />
        
        <div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-gray-500">当前趋势</span>
          <div className="flex items-center">
            {recentTrend === "positive" && (
              <>
                <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                <span className="text-green-600">改善</span>
              </>
            )}
            {recentTrend === "negative" && (
              <>
                <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                <span className="text-red-600">下降</span>
              </>
            )}
            {recentTrend === "neutral" && (
              <>
                <AlertCircle className="h-3 w-3 text-yellow-500 mr-1" />
                <span className="text-yellow-600">稳定</span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 维护建议
 */
function MaintenanceSuggestions({ equipment }: { equipment: EquipmentInfo }) {
  const { maintenanceSuggestions } = equipment.predictiveData;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center">
          <Wrench className="h-4 w-4 mr-2" />
          维护建议
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {maintenanceSuggestions.map((suggestion, index) => (
            <div key={index} className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm">{suggestion}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-3 border-t">
          <Button size="sm" className="w-full">
            <Calendar className="h-4 w-4 mr-2" />
            安排维护
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== 主组件 ====================

/**
 * 预测性维护面板组件
 */
export function PredictiveMaintenance({
  equipments,
  selectedEquipmentId,
}: PredictiveMaintenanceProps) {
  const selectedEquipment = useMemo(() => {
    return equipments.find(eq => eq.id === selectedEquipmentId);
  }, [equipments, selectedEquipmentId]);

  // 获取需要关注的设备（健康度低于60或有故障预警）
  const criticalEquipments = useMemo(() => {
    return equipments.filter(eq => 
      eq.predictiveData.healthScore < 60 || 
      eq.predictiveData.faultPredictions.length > 0
    );
  }, [equipments]);

  if (!selectedEquipment) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center">
            <Heart className="h-4 w-4 mr-2" />
            预测性维护
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <div className="text-sm text-gray-600 mb-2">请选择设备查看维护信息</div>
            
            {criticalEquipments.length > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <div className="text-sm font-medium text-yellow-800 mb-1">
                  需要关注的设备 ({criticalEquipments.length})
                </div>
                <div className="space-y-1">
                  {criticalEquipments.slice(0, 3).map(eq => (
                    <div key={eq.id} className="text-xs text-yellow-700">
                      • {eq.name} (健康度: {eq.predictiveData.healthScore})
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {/* 健康度评估 */}
      <HealthScoreCard equipment={selectedEquipment} />
      
      {/* 故障预警 */}
      <FaultPredictions equipment={selectedEquipment} />
      
      {/* 健康趋势 */}
      <HealthTrendChart equipment={selectedEquipment} />
      
      {/* 维护建议 */}
      <MaintenanceSuggestions equipment={selectedEquipment} />
    </div>
  );
}
