/**
 * @file TaskPanel.tsx
 * @description 任务列表面板组件
 * @provides 任务列表展示、筛选、分配、状态管理等功能
 */

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Package, 
  MapPin, 
  Clock, 
  User, 
  Filter,
  Search,
  Plus,
  Truck,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Play,
  Square,
  RotateCcw,
  Calendar,
  Weight,
  Star
} from "lucide-react";
import type { Task, TaskStatus, TaskPriority } from "../types/dispatch";

// ==================== Props接口 ====================

interface TaskPanelProps {
  /** 任务列表 */
  tasks: Task[];
  /** 选中的任务ID */
  selectedTaskId?: string | null;
  /** 任务选择回调 */
  onSelectTask?: (taskId: string | null) => void;
  /** 任务分配回调 */
  onAssignTask?: (taskId: string, vehicleId: string) => void;
  /** 状态更新回调 */
  onUpdateStatus?: (taskId: string, status: TaskStatus) => void;
  /** 创建任务回调 */
  onCreateTask?: () => void;
}

// ==================== 子组件 ====================

/**
 * 任务状态图标组件
 */
function TaskStatusIcon({ status }: { status: TaskStatus }) {
  const iconMap = {
    pending: <Clock className="h-4 w-4 text-gray-500" />,
    assigned: <Truck className="h-4 w-4 text-blue-500" />,
    in_progress: <Play className="h-4 w-4 text-orange-500" />,
    completed: <CheckCircle className="h-4 w-4 text-green-500" />,
    cancelled: <XCircle className="h-4 w-4 text-red-500" />,
    emergency: <AlertTriangle className="h-4 w-4 text-red-600" />,
  };

  return iconMap[status];
}

/**
 * 任务优先级组件
 */
function TaskPriorityBadge({ priority }: { priority: TaskPriority }) {
  const config = {
    low: { label: "低", className: "bg-gray-100 text-gray-800" },
    normal: { label: "普通", className: "bg-blue-100 text-blue-800" },
    high: { label: "高", className: "bg-orange-100 text-orange-800" },
    urgent: { label: "紧急", className: "bg-red-100 text-red-800" },
  };

  const { label, className } = config[priority];

  return (
    <Badge className={className}>
      {priority === "urgent" && <Star className="h-3 w-3 mr-1" />}
      {label}
    </Badge>
  );
}

/**
 * 任务筛选器组件
 */
function TaskFilters({
  filters,
  onFiltersChange,
}: {
  filters: {
    status: TaskStatus | "all";
    priority: TaskPriority | "all";
    type: "collection" | "transport" | "emergency" | "all";
    search: string;
  };
  onFiltersChange: (filters: any) => void;
}) {
  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* 搜索框 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="搜索任务..."
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-10"
            />
          </div>

          {/* 状态筛选 */}
          <div>
            <Label className="text-xs text-gray-500">状态</Label>
            <select
              value={filters.status}
              onChange={(e) => onFiltersChange({ ...filters, status: e.target.value as any })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">全部状态</option>
              <option value="pending">待分配</option>
              <option value="assigned">已分配</option>
              <option value="in_progress">进行中</option>
              <option value="completed">已完成</option>
              <option value="cancelled">已取消</option>
              <option value="emergency">紧急</option>
            </select>
          </div>

          
          <div>
            <Label className="text-xs text-gray-500">类型</Label>
            <select
              value={filters.type}
              onChange={(e) => onFiltersChange({ ...filters, type: e.target.value as any })}
              className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">全部类型</option>
              <option value="collection">收运</option>
              <option value="transport">运输</option>
              <option value="emergency">应急</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 任务操作按钮组件
 */
function TaskActions({
  task,
  onUpdateStatus,
  onAssignTask,
}: {
  task: Task;
  onUpdateStatus?: (taskId: string, status: TaskStatus) => void;
  onAssignTask?: (taskId: string, vehicleId: string) => void;
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="space-y-2">
      {/* 主要操作 */}
      <div className="flex space-x-2">
        {task.status === "pending" && onUpdateStatus && (
          <Button
            size="sm"
            onClick={() => onUpdateStatus(task.id, "assigned")}
            className="flex-1"
          >
            <Truck className="h-3 w-3 mr-1" />
            分配车辆
          </Button>
        )}
        
        {task.status === "assigned" && onUpdateStatus && (
          <Button
            size="sm"
            onClick={() => onUpdateStatus(task.id, "in_progress")}
            className="flex-1"
          >
            <Play className="h-3 w-3 mr-1" />
            开始任务
          </Button>
        )}
        
        {task.status === "in_progress" && onUpdateStatus && (
          <>
            <Button
              size="sm"
              variant="outline"
              onClick={() => onUpdateStatus(task.id, "assigned")}
              className="flex-1"
            >
              <Square className="h-3 w-3 mr-1" />
              暂停
            </Button>
            <Button
              size="sm"
              onClick={() => onUpdateStatus(task.id, "completed")}
              className="flex-1"
            >
              <CheckCircle className="h-3 w-3 mr-1" />
              完成
            </Button>
          </>
        )}
        
        {task.status === "completed" && onUpdateStatus && (
          <Button
            size="sm"
            variant="outline"
            onClick={() => onUpdateStatus(task.id, "pending")}
            className="flex-1"
          >
            <RotateCcw className="h-3 w-3 mr-1" />
            重新打开
          </Button>
        )}
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

      {isExpanded && (
        <div className="border-t pt-2 space-y-1">
          <div className="text-xs text-gray-500 mb-2">其他操作:</div>
          <div className="grid grid-cols-2 gap-1">
            {task.status !== "cancelled" && onUpdateStatus && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateStatus(task.id, "cancelled")}
                className="text-xs"
              >
                <XCircle className="h-3 w-3 mr-1" />
                取消
              </Button>
            )}
            {task.status === "cancelled" && onUpdateStatus && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onUpdateStatus(task.id, "pending")}
                className="text-xs"
              >
                <RotateCcw className="h-3 w-3 mr-1" />
                恢复
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== 主组件 ====================

/**
 * 任务列表面板组件
 */
export function TaskPanel({
  tasks,
  selectedTaskId,
  onSelectTask,
  onAssignTask,
  onUpdateStatus,
  onCreateTask,
}: TaskPanelProps) {
  const [filters, setFilters] = useState({
    status: "all" as TaskStatus | "all",
    priority: "all" as TaskPriority | "all",
    type: "all" as "collection" | "transport" | "emergency" | "all",
    search: "",
  });

  // 筛选任务
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      // 状态筛选
      if (filters.status !== "all" && task.status !== filters.status) {
        return false;
      }
      
      // 优先级筛选
      if (filters.priority !== "all" && task.priority !== filters.priority) {
        return false;
      }
      
      // 类型筛选
      if (filters.type !== "all" && task.type !== filters.type) {
        return false;
      }
      
      // 搜索筛选
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        return (
          task.name.toLowerCase().includes(searchLower) ||
          task.pickup.address.toLowerCase().includes(searchLower) ||
          task.notes?.toLowerCase().includes(searchLower)
        );
      }
      
      return true;
    });
  }, [tasks, filters]);

  // 统计信息
  const statistics = useMemo(() => {
    return {
      total: tasks.length,
      pending: tasks.filter(t => t.status === "pending").length,
      assigned: tasks.filter(t => t.status === "assigned").length,
      in_progress: tasks.filter(t => t.status === "in_progress").length,
      completed: tasks.filter(t => t.status === "completed").length,
      urgent: tasks.filter(t => t.priority === "urgent").length,
    };
  }, [tasks]);

  return (
    <div className="space-y-4">
      {/* 标题和统计 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Package className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">任务管理</CardTitle>
              <Badge className="bg-blue-100 text-blue-800">
                {filteredTasks.length}/{statistics.total}
              </Badge>
            </div>
            <Button onClick={onCreateTask}>
              <Plus className="h-4 w-4 mr-2" />
              创建任务
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>待分配: {statistics.pending}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Truck className="h-4 w-4 text-blue-500" />
              <span>已分配: {statistics.assigned}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Play className="h-4 w-4 text-orange-500" />
              <span>进行中: {statistics.in_progress}</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>已完成: {statistics.completed}</span>
            </div>
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span>紧急: {statistics.urgent}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 筛选器 */}
      <TaskFilters
        filters={filters}
        onFiltersChange={setFilters}
      />

      {/* 任务列表 */}
      <div className="space-y-3">
        {filteredTasks.map(task => (
          <Card 
            key={task.id}
            className={`cursor-pointer transition-all hover:shadow-md ${
              selectedTaskId === task.id ? "ring-2 ring-blue-500" : ""
            }`}
            onClick={() => onSelectTask?.(task.id)}
          >
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* 标题行 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <TaskStatusIcon status={task.status} />
                    <div>
                      <h4 className="font-semibold text-sm">{task.name}</h4>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{task.type === "collection" ? "收运" : task.type === "transport" ? "运输" : "应急"}</span>
                        <span>•</span>
                        <span>创建于 {new Date(task.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TaskPriorityBadge priority={task.priority} />
                    {task.assignedVehicleId && (
                      <Badge className="bg-blue-100 text-blue-800">
                        <Truck className="h-3 w-3 mr-1" />
                        {task.assignedVehicleId}
                      </Badge>
                    )}
                  </div>
                </div>

                {/* 位置信息 */}
                <div className="flex items-start space-x-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-gray-600">
                      <strong>取货:</strong> {task.pickup.address}
                    </div>
                    {task.delivery && (
                      <div className="text-gray-600 mt-1">
                        <strong>送货:</strong> {task.delivery.address}
                      </div>
                    )}
                  </div>
                </div>

                {/* 工作量信息 */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>预估: {task.estimatedWorkload.duration}分钟</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Weight className="h-4 w-4 text-gray-500" />
                    <span>重量: {task.estimatedWorkload.weight}t</span>
                  </div>
                </div>

                {/* 时间信息 */}
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>计划: {new Date(task.plannedStartTime).toLocaleTimeString()}</span>
                  </div>
                  {task.actualStartTime && (
                    <div className="flex items-center space-x-1">
                      <Play className="h-3 w-3" />
                      <span>开始: {new Date(task.actualStartTime).toLocaleTimeString()}</span>
                    </div>
                  )}
                  {task.completedAt && (
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-3 w-3" />
                      <span>完成: {new Date(task.completedAt).toLocaleTimeString()}</span>
                    </div>
                  )}
                </div>

                {/* 满溢等级 */}
                {task.overflowLevel && (
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-500">满溢等级:</span>
                    <div className="flex space-x-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-2 h-2 rounded-full ${
                            i < task.overflowLevel! ? "bg-red-500" : "bg-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-medium">{task.overflowLevel!}/5</span>
                  </div>
                )}

                {/* 备注 */}
                {task.notes && (
                  <div className="bg-gray-50 rounded p-2">
                    <p className="text-xs text-gray-600">{task.notes}</p>
                  </div>
                )}

                {/* 操作按钮 */}
                <TaskActions
                  task={task}
                  onUpdateStatus={onUpdateStatus}
                  onAssignTask={onAssignTask}
                />
              </div>
            </CardContent>
          </Card>
        ))}

        {/* 空状态 */}
        {filteredTasks.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">暂无任务</h3>
              <p className="text-gray-500 mb-4">
                {filters.search || filters.status !== "all" || filters.priority !== "all" || filters.type !== "all"
                  ? "没有符合筛选条件的任务"
                  : "还没有创建任何任务"}
              </p>
              {onCreateTask && (
                <Button onClick={onCreateTask}>
                  <Plus className="h-4 w-4 mr-2" />
                  创建第一个任务
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
