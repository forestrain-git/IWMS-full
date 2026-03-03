/**
 * @file AIRecommendationBar.tsx
 * @description AI建议条组件
 * @provides AI优化建议展示、一键应用功能
 */

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Lightbulb, 
  TrendingUp, 
  Clock, 
  Route, 
  Fuel, 
  Leaf,
  CheckCircle,
  X,
  Zap
} from "lucide-react";
import type { AIRecommendation } from "../types/dispatch";

// ==================== Props接口 ====================

interface AIRecommendationBarProps {
  /** AI建议列表 */
  recommendations: AIRecommendation[];
  /** 应用建议的回调 */
  onApplyRecommendation: (recommendationId: string) => void;
  /** 忽略建议的回调 */
  onDismissRecommendation: (recommendationId: string) => void;
}

// ==================== 子组件 ====================

/**
 * 建议图标组件
 */
function RecommendationIcon({ type }: { type: AIRecommendation["type"] }) {
  const iconMap = {
    route_optimization: <Route className="h-4 w-4" />,
    vehicle_reassignment: <Zap className="h-4 w-4" />,
    task_priority: <Clock className="h-4 w-4" />,
    emergency_dispatch: <TrendingUp className="h-4 w-4" />,
    fuel_efficiency: <Fuel className="h-4 w-4" />,
  };

  return iconMap[type] || <Lightbulb className="h-4 w-4" />;
}

/**
 * 收益展示组件
 */
function BenefitDisplay({ benefits }: { benefits: AIRecommendation["benefits"] }) {
  const benefitItems = [];

  if (benefits.timeSaved) {
    benefitItems.push({
      icon: <Clock className="h-3 w-3" />,
      label: "节省时间",
      value: `${benefits.timeSaved}分钟`,
      color: "text-blue-600",
    });
  }

  if (benefits.distanceReduced) {
    benefitItems.push({
      icon: <Route className="h-3 w-3" />,
      label: "减少距离",
      value: `${benefits.distanceReduced}km`,
      color: "text-green-600",
    });
  }

  if (benefits.fuelSaved) {
    benefitItems.push({
      icon: <Fuel className="h-3 w-3" />,
      label: "节省燃油",
      value: `${benefits.fuelSaved}L`,
      color: "text-orange-600",
    });
  }

  if (benefits.emissionReduced) {
    benefitItems.push({
      icon: <Leaf className="h-3 w-3" />,
      label: "减少排放",
      value: `${benefits.emissionReduced}kg`,
      color: "text-emerald-600",
    });
  }

  return (
    <div className="flex items-center space-x-3 text-sm">
      {benefitItems.map((item, index) => (
        <div key={index} className={`flex items-center space-x-1 ${item.color}`}>
          {item.icon}
          <span className="font-medium">{item.value}</span>
        </div>
      ))}
    </div>
  );
}

/**
 * 单个建议项组件
 */
function RecommendationItem({
  recommendation,
  onApply,
  onDismiss,
}: {
  recommendation: AIRecommendation;
  onApply: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const [isApplying, setIsApplying] = useState(false);

  const handleApply = async () => {
    setIsApplying(true);
    try {
      await onApply(recommendation.id);
    } finally {
      setIsApplying(false);
    }
  };

  const confidenceColor = 
    recommendation.confidence >= 0.9 ? "bg-green-100 text-green-800" :
    recommendation.confidence >= 0.7 ? "bg-yellow-100 text-yellow-800" :
    "bg-orange-100 text-orange-800";

  return (
    <Card className="border-l-4 border-l-blue-500 bg-blue-50/50">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 space-y-2">
            {/* 标题和类型 */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-blue-600">
                <RecommendationIcon type={recommendation.type} />
                <h4 className="font-semibold">{recommendation.title}</h4>
              </div>
              <Badge className={confidenceColor}>
                置信度 {Math.round(recommendation.confidence * 100)}%
              </Badge>
              {recommendation.applied && (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  已应用
                </Badge>
              )}
            </div>

            {/* 描述 */}
            <p className="text-sm text-gray-600">{recommendation.description}</p>

            {/* 收益展示 */}
            <BenefitDisplay benefits={recommendation.benefits} />

            {/* 影响范围 */}
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span>影响车辆: {recommendation.affectedVehicleIds.length}辆</span>
              <span>影响任务: {recommendation.affectedTaskIds.length}个</span>
              <span>创建时间: {new Date(recommendation.createdAt).toLocaleTimeString()}</span>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex items-center space-x-2 ml-4">
            {!recommendation.applied && (
              <Button
                size="sm"
                onClick={handleApply}
                disabled={isApplying}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isApplying ? "应用中..." : "一键应用"}
              </Button>
            )}
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onDismiss(recommendation.id)}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== 主组件 ====================

/**
 * AI建议条组件
 */
export function AIRecommendationBar({
  recommendations,
  onApplyRecommendation,
  onDismissRecommendation,
}: AIRecommendationBarProps) {
  // 过滤未应用的建议
  const activeRecommendations = recommendations.filter(rec => !rec.applied);
  
  if (activeRecommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-3">
      {/* 标题栏 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Lightbulb className="h-5 w-5 text-yellow-500" />
          <h3 className="font-semibold text-gray-900">AI智能建议</h3>
          <Badge className="bg-blue-100 text-blue-800">
            {activeRecommendations.length}个待处理建议
          </Badge>
        </div>
        <div className="text-sm text-gray-500">
          基于实时数据分析的优化建议
        </div>
      </div>

      {/* 建议列表 */}
      <div className="space-y-3">
        {activeRecommendations.slice(0, 3).map(recommendation => (
          <RecommendationItem
            key={recommendation.id}
            recommendation={recommendation}
            onApply={onApplyRecommendation}
            onDismiss={onDismissRecommendation}
          />
        ))}
      </div>

      {/* 更多建议提示 */}
      {activeRecommendations.length > 3 && (
        <div className="text-center text-sm text-gray-500 py-2">
          还有 {activeRecommendations.length - 3} 个建议待处理...
        </div>
      )}
    </div>
  );
}
