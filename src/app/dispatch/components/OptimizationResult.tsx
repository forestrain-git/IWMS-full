/**
 * @file OptimizationResult.tsx
 * @description 优化结果展示组件
 * @provides 路径优化结果展示、对比分析、应用功能
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  TrendingDown, 
  Route, 
  Clock, 
  Fuel, 
  Leaf,
  CheckCircle,
  BarChart3,
  Truck,
  Package,
  Play,
  Download,
  Eye,
  Target,
  Zap,
  Settings
} from "lucide-react";
import type { OptimizationResult, OptimizedRoute } from "../types/dispatch";

// ==================== Props接口 ====================

interface OptimizationResultProps {
  /** 优化结果 */
  result: OptimizationResult | null;
  /** 应用优化结果回调 */
  onApplyResult: (resultId: string) => void;
  /** 导出结果回调 */
  onExportResult: (resultId: string) => void;
  /** 查看详情回调 */
  onViewDetails: (resultId: string) => void;
}

// ==================== 子组件 ====================

/**
 * 改善指标组件
 */
function ImprovementMetric({
  label,
  value,
  unit,
  improved,
}: {
  label: string;
  value: number;
  unit: string;
  improved: boolean;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center space-x-2">
        {improved ? (
          <TrendingDown className="h-4 w-4 text-green-500" />
        ) : (
          <TrendingUp className="h-4 w-4 text-red-500" />
        )}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="text-right">
        <div className={`font-semibold ${improved ? "text-green-600" : "text-red-600"}`}>
          {improved ? "-" : "+"}{Math.abs(value).toFixed(1)}%
        </div>
        <div className="text-xs text-gray-500">{unit}</div>
      </div>
    </div>
  );
}

/**
 * 路径卡片组件
 */
function RouteCard({ route }: { route: OptimizedRoute }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* 标题 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Truck className="h-5 w-5 text-blue-500" />
              <div>
                <h4 className="font-semibold">{route.vehicleId}</h4>
                <p className="text-xs text-gray-500">
                  {route.points.length - 2}个任务点
                </p>
              </div>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs"
            >
              {isExpanded ? "收起" : "详情"}
            </Button>
          </div>

          {/* 关键指标 */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <Route className="h-4 w-4 text-gray-500" />
              <span>{route.totalDistance.toFixed(1)}km</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{Math.round(route.totalTime)}分钟</span>
            </div>
            <div className="flex items-center space-x-2">
              <Fuel className="h-4 w-4 text-gray-500" />
              <span>{route.totalFuel.toFixed(1)}L</span>
            </div>
            <div className="flex items-center space-x-2">
              <Leaf className="h-4 w-4 text-gray-500" />
              <span>{route.totalEmission.toFixed(1)}kg</span>
            </div>
          </div>

          {/* 改善对比 */}
          <div className="border-t pt-3">
            <div className="text-xs text-gray-500 mb-2">vs 之前方案:</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="text-center">
                <div className="text-green-600 font-semibold">
                  {route.comparison.vsPrevious.distance.toFixed(1)}%
                </div>
                <div className="text-gray-500">距离</div>
              </div>
              <div className="text-center">
                <div className="text-green-600 font-semibold">
                  {route.comparison.vsPrevious.time.toFixed(1)}%
                </div>
                <div className="text-gray-500">时间</div>
              </div>
              <div className="text-center">
                <div className="text-green-600 font-semibold">
                  {route.comparison.vsPrevious.fuel.toFixed(1)}%
                </div>
                <div className="text-gray-500">油耗</div>
              </div>
            </div>
          </div>

          {/* 详细路径点 */}
          {isExpanded && (
            <div className="border-t pt-3">
              <div className="text-xs text-gray-500 mb-2">路径点序列:</div>
              <div className="space-y-1">
                {route.points.map((point, index) => (
                  <div key={index} className="flex items-center space-x-2 text-xs">
                    <div className="w-4 h-4 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">
                        {point.taskId ? `任务${point.taskId.slice(-3)}` : "起点/终点"}
                      </div>
                      <div className="text-gray-500">
                        {new Date(point.estimatedArrival).toLocaleTimeString()} • {point.estimatedDuration}分钟
                      </div>
                    </div>
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

/**
 * 算法信息组件
 */
function AlgorithmInfo({ result }: { result: OptimizationResult }) {
  return (
    <Card className="border-gray-200">
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4 text-gray-500" />
            <h4 className="font-semibold text-sm">算法信息</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">算法名称</div>
              <div className="font-medium">{result.algorithm.name}</div>
            </div>
            <div>
              <div className="text-gray-500">执行时间</div>
              <div className="font-medium">{result.algorithm.executionTime}ms</div>
            </div>
            <div>
              <div className="text-gray-500">迭代次数</div>
              <div className="font-medium">{result.algorithm.iterations}</div>
            </div>
            <div>
              <div className="text-gray-500">收敛度</div>
              <div className="font-medium">{(result.algorithm.convergence * 100).toFixed(1)}%</div>
            </div>
          </div>

          <div className="border-t pt-3">
            <div className="text-xs text-gray-600 space-y-1">
              <p>• 优化目标: {result.target === "distance" ? "距离" : result.target === "time" ? "时间" : result.target === "fuel" ? "油耗" : "排放"}</p>
              <p>• 优化时间: {new Date(result.optimizedAt).toLocaleString()}</p>
              <p>• 方案ID: {result.id}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== 主组件 ====================

/**
 * 优化结果组件
 */
export function OptimizationResult({
  result,
  onApplyResult,
  onExportResult,
  onViewDetails,
}: OptimizationResultProps) {
  if (!result) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">暂无优化结果</h3>
          <p className="text-gray-500">
            完成路径优化后，结果将在此处显示
          </p>
        </CardContent>
      </Card>
    );
  }

  const {
    overallImprovement,
    routes,
  } = result;

  return (
    <div className="space-y-4">
      {/* 标题和状态 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <CardTitle className="text-lg">优化结果</CardTitle>
              <Badge className="bg-green-100 text-green-800">
                优化完成
              </Badge>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onViewDetails(result.id)}
              >
                <Eye className="h-4 w-4 mr-2" />
                查看详情
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => onExportResult(result.id)}
              >
                <Download className="h-4 w-4 mr-2" />
                导出
              </Button>
              <Button
                onClick={() => onApplyResult(result.id)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Play className="h-4 w-4 mr-2" />
                应用方案
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 总体改善 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4 text-green-500" />
            <CardTitle className="text-base">总体改善</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-4">
            <ImprovementMetric
              label="距离"
              value={overallImprovement.vsPrevious.distance}
              unit="km"
              improved={overallImprovement.vsPrevious.distance < 0}
            />
            <ImprovementMetric
              label="时间"
              value={overallImprovement.vsPrevious.time}
              unit="分钟"
              improved={overallImprovement.vsPrevious.time < 0}
            />
            <ImprovementMetric
              label="油耗"
              value={overallImprovement.vsPrevious.fuel}
              unit="升"
              improved={overallImprovement.vsPrevious.fuel < 0}
            />
            <ImprovementMetric
              label="排放"
              value={overallImprovement.vsPrevious.emission}
              unit="kg"
              improved={overallImprovement.vsPrevious.emission < 0}
            />
          </div>

          {/* 总体数据 */}
          <div className="border-t mt-4 pt-4">
            <div className="grid grid-cols-4 gap-4 text-center text-sm">
              <div>
                <div className="font-semibold text-blue-600">
                  {overallImprovement.totalDistance.toFixed(1)}
                </div>
                <div className="text-gray-500">总距离(km)</div>
              </div>
              <div>
                <div className="font-semibold text-green-600">
                  {Math.round(overallImprovement.totalTime)}
                </div>
                <div className="text-gray-500">总时间(分钟)</div>
              </div>
              <div>
                <div className="font-semibold text-orange-600">
                  {overallImprovement.totalFuel.toFixed(1)}
                </div>
                <div className="text-gray-500">总油耗(升)</div>
              </div>
              <div>
                <div className="font-semibold text-emerald-600">
                  {overallImprovement.totalEmission.toFixed(1)}
                </div>
                <div className="text-gray-500">总排放(kg)</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 路径详情 */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Route className="h-4 w-4 text-gray-500" />
          <h3 className="font-semibold">路径详情 ({routes.length}条)</h3>
        </div>
        <div className="space-y-3">
          {routes.map(route => (
            <RouteCard key={route.id} route={route} />
          ))}
        </div>
      </div>

      {/* 算法信息 */}
      <AlgorithmInfo result={result} />

      {/* 应用确认 */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Zap className="h-5 w-5 text-blue-500" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-800">准备应用优化方案</h4>
              <p className="text-sm text-blue-600">
                应用后将重新分配任务路径，预计可节省{Math.abs(overallImprovement.vsPrevious.time).toFixed(0)}分钟
              </p>
            </div>
            <Button
              onClick={() => onApplyResult(result.id)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              确认应用
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
