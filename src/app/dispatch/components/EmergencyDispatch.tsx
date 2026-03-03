/**
 * @file EmergencyDispatch.tsx
 * @description 应急调度组件
 * @provides 应急预案管理、事件响应、跨区协同等功能
 */

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertTriangle, 
  Shield, 
  Phone, 
  Users, 
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Play,
  Square,
  Zap,
  Radio,
  Navigation,
  AlertCircle,
  FileText,
  Settings
} from "lucide-react";
import type { EmergencyEvent, EmergencyPlan, EmergencyType } from "../types/dispatch";

// ==================== Props接口 ====================

interface EmergencyDispatchProps {
  /** 应急事件列表 */
  emergencyEvents: EmergencyEvent[];
  /** 应急预案列表 */
  emergencyPlans: EmergencyPlan[];
  /** 启动预案回调 */
  onActivatePlan: (eventId: string, planId: string) => void;
  /** 更新事件状态回调 */
  onUpdateEventStatus: (eventId: string, status: "pending" | "responding" | "resolved") => void;
  /** 派遣车辆回调 */
  onDispatchVehicles: (eventId: string, vehicleIds: string[]) => void;
}

// ==================== 子组件 ====================

/**
 * 应急类型配置
 */
const EMERGENCY_TYPE_CONFIG = {
  overflow: { 
    label: "满溢", 
    color: "bg-orange-100 text-orange-800", 
    icon: "🗑️",
    level: "high" 
  },
  breakdown: { 
    label: "故障", 
    color: "bg-red-100 text-red-800", 
    icon: "🔧",
    level: "medium" 
  },
  weather: { 
    label: "天气", 
    color: "bg-purple-100 text-purple-800", 
    icon: "🌧️",
    level: "high" 
  },
  accident: { 
    label: "事故", 
    color: "bg-red-100 text-red-800", 
    icon: "🚨",
    level: "critical" 
  },
};

/**
 * 应急级别配置
 */
const EMERGENCY_LEVEL_CONFIG = {
  low: { label: "低", color: "bg-green-100 text-green-800" },
  medium: { label: "中", color: "bg-yellow-100 text-yellow-800" },
  high: { label: "高", color: "bg-orange-100 text-orange-800" },
  critical: { label: "紧急", color: "bg-red-100 text-red-800" },
};

/**
 * 应急事件卡片组件
 */
function EmergencyEventCard({ 
  event, 
  plans, 
  onActivatePlan, 
  onUpdateStatus,
  onDispatchVehicles 
}: {
  event: EmergencyEvent;
  plans: EmergencyPlan[];
  onActivatePlan: (eventId: string, planId: string) => void;
  onUpdateStatus: (eventId: string, status: "pending" | "responding" | "resolved") => void;
  onDispatchVehicles: (eventId: string, vehicleIds: string[]) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  
  const typeConfig = EMERGENCY_TYPE_CONFIG[event.type];
  const levelConfig = EMERGENCY_LEVEL_CONFIG[event.severity];
  const availablePlans = plans.filter(plan => plan.type === event.type);
  const activatedPlan = plans.find(plan => plan.id === event.activatedPlanId);

  const handleActivatePlan = () => {
    if (selectedPlanId) {
      onActivatePlan(event.id, selectedPlanId);
    }
  };

  const getStatusColor = (status: string) => {
    const colorMap = {
      pending: "bg-gray-100 text-gray-800",
      responding: "bg-blue-100 text-blue-800",
      resolved: "bg-green-100 text-green-800",
    };
    return colorMap[status as keyof typeof colorMap] || "bg-gray-100 text-gray-800";
  };

  const getStatusLabel = (status: string) => {
    const labelMap = {
      pending: "待处理",
      responding: "响应中",
      resolved: "已解决",
    };
    return labelMap[status as keyof typeof labelMap] || status;
  };

  return (
    <Card className={`border-l-4 border-l-red-500 ${event.responseStatus === "responding" ? "bg-blue-50" : ""}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* 标题 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-2xl">{typeConfig.icon}</div>
              <div>
                <h4 className="font-semibold">{event.type === "overflow" ? "垃圾桶满溢" : event.type === "breakdown" ? "设备故障" : event.type === "weather" ? "恶劣天气" : "交通事故"}</h4>
                <p className="text-xs text-gray-500">
                  {new Date(event.reportedAt).toLocaleString()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={typeConfig.color}>
                {typeConfig.label}
              </Badge>
              <Badge className={levelConfig.color}>
                {levelConfig.label}
              </Badge>
              <Badge className={getStatusColor(event.responseStatus)}>
                {getStatusLabel(event.responseStatus)}
              </Badge>
            </div>
          </div>

          {/* 位置和描述 */}
          <div className="space-y-2">
            <div className="flex items-start space-x-2 text-sm">
              <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
              <div className="flex-1">
                <div className="text-gray-600">{event.location.address}</div>
                <div className="text-xs text-gray-500">{event.location.district}</div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <strong>描述:</strong> {event.description}
            </div>
          </div>

          {/* 响应状态 */}
          {event.activatedPlanId && activatedPlan && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-4 w-4 text-blue-500" />
                <span className="font-medium text-blue-800">已启动预案: {activatedPlan.name}</span>
              </div>
              <div className="text-sm text-blue-600">
                {activatedPlan.responseSteps.length}个响应步骤 • 预计{activatedPlan.responseSteps.reduce((sum, step) => sum + step.estimatedTime, 0)}分钟
              </div>
            </div>
          )}

          {/* 派遣车辆 */}
          {event.dispatchedVehicleIds.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center space-x-2 mb-2">
                <Truck className="h-4 w-4 text-green-500" />
                <span className="font-medium text-green-800">已派遣车辆</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {event.dispatchedVehicleIds.map(vehicleId => (
                  <Badge key={vehicleId} variant="outline" className="text-xs">
                    {vehicleId}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex space-x-2">
            {event.responseStatus === "pending" && (
              <>
                <Button
                  size="sm"
                  onClick={() => onUpdateStatus(event.id, "responding")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Play className="h-3 w-3 mr-1" />
                  开始响应
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? "收起" : "展开"}
                </Button>
              </>
            )}
            
            {event.responseStatus === "responding" && (
              <>
                <Button
                  size="sm"
                  onClick={() => onUpdateStatus(event.id, "resolved")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="h-3 w-3 mr-1" />
                  解决完成
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? "收起" : "展开"}
                </Button>
              </>
            )}

            {event.responseStatus === "resolved" && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? "收起" : "查看详情"}
              </Button>
            )}
          </div>

          {/* 展开内容 */}
          {isExpanded && (
            <div className="border-t pt-3 space-y-3">
              {/* 预案选择 */}
              {event.responseStatus === "pending" && availablePlans.length > 0 && (
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">选择应急预案:</h5>
                  <div className="space-y-2">
                    {availablePlans.map(plan => (
                      <div
                        key={plan.id}
                        className={`p-2 border rounded cursor-pointer transition-colors ${
                          selectedPlanId === plan.id
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => setSelectedPlanId(plan.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm">{plan.name}</div>
                          <Badge className="bg-gray-100 text-gray-800 text-xs">
                            {plan.level}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{plan.description}</p>
                        <div className="text-xs text-gray-500 mt-1">
                          {plan.responseSteps.length}步骤 • {plan.requiredResources.vehicles}辆车
                        </div>
                      </div>
                    ))}
                  </div>
                  {selectedPlanId && (
                    <Button onClick={handleActivatePlan} className="w-full">
                      <Zap className="h-4 w-4 mr-2" />
                      启动预案
                    </Button>
                  )}
                </div>
              )}

              {/* 响应步骤 */}
              {activatedPlan && (
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">响应步骤:</h5>
                  <div className="space-y-1">
                    {activatedPlan.responseSteps.map((step, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-semibold">
                          {step.step}
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium">{step.action}</div>
                          <div className="text-xs text-gray-500">
                            负责人: {step.responsible} • {step.estimatedTime}分钟
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 所需资源 */}
              {activatedPlan && (
                <div className="space-y-2">
                  <h5 className="font-medium text-sm">所需资源:</h5>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <Truck className="h-4 w-4 text-blue-500 mx-auto mb-1" />
                      <div className="font-medium">{activatedPlan.requiredResources.vehicles}</div>
                      <div className="text-xs text-gray-500">车辆</div>
                    </div>
                    <div className="text-center">
                      <Users className="h-4 w-4 text-green-500 mx-auto mb-1" />
                      <div className="font-medium">{activatedPlan.requiredResources.personnel}</div>
                      <div className="text-xs text-gray-500">人员</div>
                    </div>
                    <div className="text-center">
                      <Settings className="h-4 w-4 text-orange-500 mx-auto mb-1" />
                      <div className="font-medium">{activatedPlan.requiredResources.equipment.length}</div>
                      <div className="text-xs text-gray-500">设备</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 应急预案卡片组件
 */
function EmergencyPlanCard({ 
  plan, 
  eventId,
  onActivate 
}: { 
  plan: EmergencyPlan; 
  eventId?: string;
  onActivate: (eventId: string, planId: string) => void;
}) {
  const typeConfig = EMERGENCY_TYPE_CONFIG[plan.type];
  const levelConfig = EMERGENCY_LEVEL_CONFIG[plan.level];

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* 标题 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-xl">{typeConfig.icon}</div>
              <div>
                <h4 className="font-semibold">{plan.name}</h4>
                <p className="text-xs text-gray-500">预案ID: {plan.id}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={typeConfig.color}>
                {typeConfig.label}
              </Badge>
              <Badge className={levelConfig.color}>
                {levelConfig.label}
              </Badge>
            </div>
          </div>

          {/* 描述 */}
          <p className="text-sm text-gray-600">{plan.description}</p>

          {/* 触发条件 */}
          <div className="space-y-1">
            <h5 className="font-medium text-sm">触发条件:</h5>
            <ul className="text-xs text-gray-600 space-y-1">
              {plan.triggerConditions.map((condition, index) => (
                <li key={index} className="flex items-center space-x-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div>
                  <span>{condition}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* 响应信息 */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">响应步骤</div>
              <div className="font-medium">{plan.responseSteps.length}个</div>
            </div>
            <div>
              <div className="text-gray-500">预计时间</div>
              <div className="font-medium">
                {plan.responseSteps.reduce((sum, step) => sum + step.estimatedTime, 0)}分钟
              </div>
            </div>
          </div>

          {/* 资源需求 */}
          <div className="border-t pt-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <Truck className="h-3 w-3" />
                  <span>{plan.requiredResources.vehicles}辆</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-3 w-3" />
                  <span>{plan.requiredResources.personnel}人</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Settings className="h-3 w-3" />
                  <span>{plan.requiredResources.equipment.length}项</span>
                </div>
              </div>
              <Button size="sm" onClick={() => eventId && onActivate(eventId, plan.id)}>
                <Shield className="h-3 w-3 mr-1" />
                启动预案
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== 主组件 ====================

/**
 * 应急调度组件
 */
export function EmergencyDispatch({
  emergencyEvents,
  emergencyPlans,
  onActivatePlan,
  onUpdateEventStatus,
  onDispatchVehicles,
}: EmergencyDispatchProps) {
  const [activeTab, setActiveTab] = useState<"events" | "plans">("events");

  // 统计信息
  const statistics = {
    total: emergencyEvents.length,
    pending: emergencyEvents.filter(e => e.responseStatus === "pending").length,
    responding: emergencyEvents.filter(e => e.responseStatus === "responding").length,
    resolved: emergencyEvents.filter(e => e.responseStatus === "resolved").length,
    critical: emergencyEvents.filter(e => e.severity === "critical").length,
  };

  return (
    <div className="space-y-4">
      {/* 标题和统计 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <CardTitle className="text-lg">应急调度</CardTitle>
              {statistics.critical > 0 && (
                <Badge className="bg-red-100 text-red-800 animate-pulse">
                  {statistics.critical}个紧急事件
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Radio className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">实时监控</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-gray-500" />
              <span>待处理: {statistics.pending}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Navigation className="h-4 w-4 text-blue-500" />
              <span>响应中: {statistics.responding}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>已解决: {statistics.resolved}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 标签页切换 */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("events")}
          className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "events"
              ? "bg-white text-red-600 shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <AlertTriangle className="h-4 w-4" />
          <span>应急事件 ({statistics.pending + statistics.responding})</span>
        </button>
        <button
          onClick={() => setActiveTab("plans")}
          className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "plans"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <FileText className="h-4 w-4" />
          <span>应急预案 ({emergencyPlans.length})</span>
        </button>
      </div>

      {/* 内容区域 */}
      <div className="space-y-3">
        {activeTab === "events" ? (
          <>
            {/* 活跃事件 */}
            {emergencyEvents.filter(e => e.responseStatus !== "resolved").length > 0 ? (
              emergencyEvents
                .filter(e => e.responseStatus !== "resolved")
                .map(event => (
                  <EmergencyEventCard
                    key={event.id}
                    event={event}
                    plans={emergencyPlans}
                    onActivatePlan={onActivatePlan}
                    onUpdateStatus={onUpdateEventStatus}
                    onDispatchVehicles={onDispatchVehicles}
                  />
                ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">暂无活跃事件</h3>
                  <p className="text-gray-500">
                    当前没有需要处理的应急事件
                  </p>
                </CardContent>
              </Card>
            )}

            {/* 已解决事件 */}
            {emergencyEvents.filter(e => e.responseStatus === "resolved").length > 0 && (
              <>
                <h4 className="font-medium text-sm text-gray-500">已解决事件</h4>
                {emergencyEvents
                  .filter(e => e.responseStatus === "resolved")
                  .map(event => (
                    <EmergencyEventCard
                      key={event.id}
                      event={event}
                      plans={emergencyPlans}
                      onActivatePlan={onActivatePlan}
                      onUpdateStatus={onUpdateEventStatus}
                      onDispatchVehicles={onDispatchVehicles}
                    />
                  ))}
              </>
            )}
          </>
        ) : (
          <>
            {emergencyPlans.length > 0 ? (
              emergencyPlans.map(plan => (
                <EmergencyPlanCard
                  key={plan.id}
                  plan={plan}
                  onActivate={(eventId, planId) => onActivatePlan(eventId, planId)}
                />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">暂无应急预案</h3>
                  <p className="text-gray-500">
                    还没有创建任何应急预案
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {/* 跨区协同提示 */}
      <Card className="border-orange-200 bg-orange-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Users className="h-5 w-5 text-orange-500" />
            <div className="flex-1">
              <h4 className="font-semibold text-orange-800">跨区协同</h4>
              <p className="text-sm text-orange-600">
                检测到相邻区域有2个类似事件，建议启动跨区协同响应机制
              </p>
            </div>
            <Button size="sm" variant="outline">
              <Navigation className="h-4 w-4 mr-2" />
              协同响应
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
