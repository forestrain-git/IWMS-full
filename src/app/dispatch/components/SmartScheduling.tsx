/**
 * @file SmartScheduling.tsx
 * @description 智能排班组件
 * @provides 人员排班、车辆排班、工时均衡、维保提醒等功能
 */

import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Calendar, 
  Clock, 
  Users, 
  Truck, 
  Wrench, 
  AlertTriangle,
  CheckCircle,
  User,
  Target,
  BarChart3,
  TrendingUp,
  RefreshCw,
  Settings,
  Eye,
  Edit
} from "lucide-react";
import type { StaffSchedule, VehicleSchedule } from "../types/dispatch";

// ==================== Props接口 ====================

interface SmartSchedulingProps {
  /** 人员排班数据 */
  staffSchedules: StaffSchedule[];
  /** 车辆排班数据 */
  vehicleSchedules: VehicleSchedule[];
  /** 刷新排班回调 */
  onRefreshSchedule: () => void;
  /** 自动排班回调 */
  onAutoSchedule: () => void;
  /** 编辑排班回调 */
  onEditSchedule: (type: "staff" | "vehicle", id: string) => void;
}

// ==================== 子组件 ====================

/**
 * 班次类型配置
 */
const SHIFT_TYPES = {
  morning: { label: "早班", color: "bg-blue-100 text-blue-800", icon: "🌅" },
  afternoon: { label: "中班", color: "bg-orange-100 text-orange-800", icon: "🌞" },
  night: { label: "夜班", color: "bg-purple-100 text-purple-800", icon: "🌙" },
  flexible: { label: "灵活", color: "bg-green-100 text-green-800", icon: "🔄" },
};

/**
 * 人员排班卡片组件
 */
function StaffScheduleCard({ 
  schedule, 
  onEdit 
}: { 
  schedule: StaffSchedule; 
  onEdit: (id: string) => void;
}) {
  const shiftConfig = SHIFT_TYPES[schedule.shiftType];
  const workHoursToday = schedule.workMinutesToday / 60;
  const workHoursWeek = schedule.workMinutesThisWeek / 60;
  const weeklyAverage = workHoursWeek / 7;
  
  // 工时状态判断
  const getWorkHoursStatus = () => {
    if (workHoursToday > 10) return { status: "high", color: "text-red-600", label: "超时" };
    if (workHoursToday < 4) return { status: "low", color: "text-orange-600", label: "不足" };
    return { status: "normal", color: "text-green-600", label: "正常" };
  };

  const workHoursStatus = getWorkHoursStatus();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* 标题 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <User className="h-5 w-5 text-blue-500" />
              <div>
                <h4 className="font-semibold">{schedule.staffName}</h4>
                <p className="text-xs text-gray-500">{schedule.staffId}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={shiftConfig.color}>
                {shiftConfig.icon} {shiftConfig.label}
              </Badge>
              <Button size="sm" variant="ghost" onClick={() => onEdit(schedule.staffId)}>
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* 工作时间 */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">工作时间:</span>
            <span className="font-medium">
              {schedule.workHours.start} - {schedule.workHours.end}
            </span>
          </div>

          {/* 分配车辆 */}
          {schedule.assignedVehicleId && (
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">分配车辆:</span>
              <span className="font-medium">{schedule.assignedVehicleId}</span>
            </div>
          )}

          {/* 技能标签 */}
          <div className="flex flex-wrap gap-1">
            {schedule.skills.map(skill => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>

          {/* 工时统计 */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">今日工时</div>
              <div className={`font-semibold ${workHoursStatus.color}`}>
                {workHoursToday.toFixed(1)}h ({workHoursStatus.label})
              </div>
            </div>
            <div>
              <div className="text-gray-500">本周日均</div>
              <div className="font-semibold text-gray-700">
                {weeklyAverage.toFixed(1)}h
              </div>
            </div>
          </div>

          {/* 工时进度条 */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>今日进度</span>
              <span>{Math.round((workHoursToday / 8) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  workHoursStatus.status === "high" ? "bg-red-500" :
                  workHoursStatus.status === "low" ? "bg-orange-500" :
                  "bg-green-500"
                }`}
                style={{ width: `${Math.min((workHoursToday / 8) * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 车辆排班卡片组件
 */
function VehicleScheduleCard({ 
  schedule, 
  onEdit 
}: { 
  schedule: VehicleSchedule; 
  onEdit: (id: string) => void;
}) {
  const getShiftStatusColor = (status: string) => {
    const colorMap = {
      active: "bg-green-100 text-green-800",
      break: "bg-yellow-100 text-yellow-800",
      off_duty: "bg-gray-100 text-gray-800",
      maintenance: "bg-red-100 text-red-800",
    };
    return colorMap[status as keyof typeof colorMap] || "bg-gray-100 text-gray-800";
  };

  const getShiftStatusLabel = (status: string) => {
    const labelMap = {
      active: "在岗",
      break: "休息",
      off_duty: "下班",
      maintenance: "维保",
    };
    return labelMap[status as keyof typeof labelMap] || status;
  };

  const workProgress = (schedule.actualWorkMinutes / schedule.plannedWorkMinutes) * 100;
  const daysUntilMaintenance = Math.ceil((new Date(schedule.nextMaintenance).getTime() - Date.now()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* 标题 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Truck className="h-5 w-5 text-blue-500" />
              <div>
                <h4 className="font-semibold">{schedule.vehicleId}</h4>
                <p className="text-xs text-gray-500">车辆排班</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={getShiftStatusColor(schedule.shiftStatus)}>
                {getShiftStatusLabel(schedule.shiftStatus)}
              </Badge>
              <Button size="sm" variant="ghost" onClick={() => onEdit(schedule.vehicleId)}>
                <Edit className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* 可用性 */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">可用性:</span>
            <div className="flex items-center space-x-2">
              {schedule.availability.available ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-500" />
              )}
              <span className={`font-medium ${
                schedule.availability.available ? "text-green-600" : "text-red-600"
              }`}>
                {schedule.availability.available ? "可用" : "不可用"}
              </span>
            </div>
          </div>

          {/* 不可用原因 */}
          {!schedule.availability.available && schedule.availability.reason && (
            <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
              {schedule.availability.reason}
            </div>
          )}

          {/* 任务统计 */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="text-gray-500">今日任务</div>
              <div className="font-semibold">{schedule.tasksToday}个</div>
            </div>
            <div>
              <div className="text-gray-500">计划工时</div>
              <div className="font-semibold">{schedule.plannedWorkMinutes / 60}h</div>
            </div>
          </div>

          {/* 工作进度 */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-gray-500">
              <span>工作进度</span>
              <span>{Math.round(workProgress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full transition-all"
                style={{ width: `${Math.min(workProgress, 100)}%` }}
              />
            </div>
          </div>

          {/* 维保提醒 */}
          <div className={`p-2 rounded-lg ${
            daysUntilMaintenance <= 7 
              ? "bg-orange-50 border border-orange-200" 
              : "bg-gray-50 border border-gray-200"
          }`}>
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center space-x-2">
                <Wrench className="h-4 w-4 text-gray-500" />
                <span>下次维保</span>
              </div>
              <span className={`font-medium ${
                daysUntilMaintenance <= 7 ? "text-orange-600" : "text-gray-600"
              }`}>
                {daysUntilMaintenance <= 0 ? "已到期" : `${daysUntilMaintenance}天后`}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {new Date(schedule.nextMaintenance).toLocaleDateString()}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * 排班统计组件
 */
function SchedulingStats({
  staffSchedules,
  vehicleSchedules,
}: {
  staffSchedules: StaffSchedule[];
  vehicleSchedules: VehicleSchedule[];
}) {
  const staffStats = useMemo(() => {
    const onDuty = staffSchedules.filter(s => 
      ["morning", "afternoon", "night"].includes(s.shiftType)
    ).length;
    const overtime = staffSchedules.filter(s => s.workMinutesToday > 8 * 60).length;
    const totalHours = staffSchedules.reduce((sum, s) => sum + s.workMinutesToday, 0) / 60;
    
    return { onDuty, overtime, totalHours };
  }, [staffSchedules]);

  const vehicleStats = useMemo(() => {
    const active = vehicleSchedules.filter(s => s.shiftStatus === "active").length;
    const maintenance = vehicleSchedules.filter(s => s.shiftStatus === "maintenance").length;
    const maintenanceDue = vehicleSchedules.filter(s => {
      const days = Math.ceil((new Date(s.nextMaintenance).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return days <= 7;
    }).length;
    
    return { active, maintenance, maintenanceDue };
  }, [vehicleSchedules]);

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-4 w-4 text-gray-500" />
            <h4 className="font-semibold text-sm">排班统计</h4>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {/* 人员统计 */}
            <div className="space-y-3">
              <h5 className="font-medium text-sm text-blue-600">人员排班</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">在岗人数:</span>
                  <span className="font-medium">{staffStats.onDuty}人</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">加班人数:</span>
                  <span className="font-medium text-orange-600">{staffStats.overtime}人</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">总工时:</span>
                  <span className="font-medium">{staffStats.totalHours.toFixed(1)}h</span>
                </div>
              </div>
            </div>
            
            {/* 车辆统计 */}
            <div className="space-y-3">
              <h5 className="font-medium text-sm text-green-600">车辆排班</h5>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">在岗车辆:</span>
                  <span className="font-medium">{vehicleStats.active}辆</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">维保车辆:</span>
                  <span className="font-medium text-red-600">{vehicleStats.maintenance}辆</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">待维保:</span>
                  <span className="font-medium text-orange-600">{vehicleStats.maintenanceDue}辆</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ==================== 主组件 ====================

/**
 * 智能排班组件
 */
export function SmartScheduling({
  staffSchedules,
  vehicleSchedules,
  onRefreshSchedule,
  onAutoSchedule,
  onEditSchedule,
}: SmartSchedulingProps) {
  const [activeTab, setActiveTab] = useState<"staff" | "vehicle">("staff");
  const [searchTerm, setSearchTerm] = useState("");

  // 过滤数据
  const filteredStaffSchedules = useMemo(() => {
    if (!searchTerm) return staffSchedules;
    return staffSchedules.filter(s => 
      s.staffName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.staffId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [staffSchedules, searchTerm]);

  const filteredVehicleSchedules = useMemo(() => {
    if (!searchTerm) return vehicleSchedules;
    return vehicleSchedules.filter(s => 
      s.vehicleId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [vehicleSchedules, searchTerm]);

  return (
    <div className="space-y-4">
      {/* 标题和操作 */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg">智能排班</CardTitle>
            </div>
            <div className="flex space-x-2">
              <Button size="sm" variant="outline" onClick={onRefreshSchedule}>
                <RefreshCw className="h-4 w-4 mr-2" />
                刷新
              </Button>
              <Button size="sm" onClick={onAutoSchedule}>
                <Target className="h-4 w-4 mr-2" />
                自动排班
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 统计信息 */}
      <SchedulingStats
        staffSchedules={staffSchedules}
        vehicleSchedules={vehicleSchedules}
      />

      {/* 搜索框 */}
      <div className="relative">
        <Input
          placeholder="搜索员工或车辆..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
        <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
      </div>

      {/* 标签页切换 */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("staff")}
          className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "staff"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <Users className="h-4 w-4" />
          <span>人员排班 ({filteredStaffSchedules.length})</span>
        </button>
        <button
          onClick={() => setActiveTab("vehicle")}
          className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "vehicle"
              ? "bg-white text-green-600 shadow-sm"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          <Truck className="h-4 w-4" />
          <span>车辆排班 ({filteredVehicleSchedules.length})</span>
        </button>
      </div>

      {/* 内容区域 */}
      <div className="space-y-3">
        {activeTab === "staff" ? (
          <>
            {filteredStaffSchedules.length > 0 ? (
                filteredStaffSchedules.map(schedule => (
                <StaffScheduleCard
                  key={schedule.staffId}
                  schedule={schedule}
                  onEdit={(id: string) => onEditSchedule("staff", id)}
                />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">暂无人员排班</h3>
                  <p className="text-gray-500">
                    {searchTerm ? "没有找到匹配的员工" : "还没有创建人员排班"}
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <>
            {filteredVehicleSchedules.length > 0 ? (
              filteredVehicleSchedules.map(schedule => (
                <VehicleScheduleCard
                  key={schedule.vehicleId}
                  schedule={schedule}
                  onEdit={(id: string) => onEditSchedule("vehicle", id)}
                />
              ))
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Truck className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">暂无车辆排班</h3>
                  <p className="text-gray-500">
                    {searchTerm ? "没有找到匹配的车辆" : "还没有创建车辆排班"}
                  </p>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {/* 排班建议 */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <div className="flex-1">
              <h4 className="font-semibold text-blue-800">智能排班建议</h4>
              <p className="text-sm text-blue-600">
                基于历史数据和当前工作负荷，建议调整3名员工的排班以平衡工时
              </p>
            </div>
            <Button size="sm" variant="outline">
              <Eye className="h-4 w-4 mr-2" />
              查看建议
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
