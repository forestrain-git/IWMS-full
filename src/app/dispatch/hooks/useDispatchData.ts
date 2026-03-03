/**
 * @file useDispatchData.ts
 * @description 调度数据管理Hook
 * @provides 车辆、任务、AI建议、应急事件等数据管理
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { useGlobalStore } from "@/store";

// 确保只在客户端运行
const isClient = typeof window !== 'undefined';

import type { 
  Vehicle, 
  Task, 
  AIRecommendation, 
  EmergencyEvent,
  StaffSchedule,
  VehicleSchedule,
  VehicleStatus,
  TaskStatus,
  UseDispatchDataReturn 
} from "../types/dispatch";

// ==================== 模拟数据生成器 ====================

/**
 * 生成模拟车辆数据
 */
function generateMockVehicles(stationId?: string): Vehicle[] {
  const baseLocation = stationId ? {
    latitude: 30.5728 + (Math.random() - 0.5) * 0.1,
    longitude: 104.0668 + (Math.random() - 0.5) * 0.1,
  } : {
    latitude: 30.5728,
    longitude: 104.0668,
  };

  return Array.from({ length: 12 }, (_, i) => ({
    id: `vehicle_${i + 1}`,
    plateNumber: `川A${String(10000 + i).slice(-5)}`,
    type: i < 8 ? "collection" : i < 10 ? "transport" : "emergency",
    status: ["idle", "en_route", "loading", "unloading", "maintenance"][Math.floor(Math.random() * 5)] as VehicleStatus,
    location: {
      latitude: baseLocation.latitude + (Math.random() - 0.5) * 0.05,
      longitude: baseLocation.longitude + (Math.random() - 0.5) * 0.05,
      heading: Math.random() * 360,
      speed: Math.random() * 60,
      timestamp: new Date().toISOString(),
    },
    driver: {
      id: `driver_${i + 1}`,
      name: `司机${i + 1}`,
      phone: `138${String(10000000 + i).slice(-8)}`,
    },
    capacity: {
      max: 5 + Math.random() * 10,
      current: Math.random() * 5,
    },
    fuel: {
      level: 20 + Math.random() * 80,
      consumption: 15 + Math.random() * 10,
    },
    maintenance: {
      lastMileage: 50000 + i * 1000,
      nextMileage: 55000 + i * 1000,
      daysUntilNext: Math.floor(Math.random() * 30),
    },
    currentTaskId: Math.random() > 0.3 ? `task_${Math.floor(Math.random() * 20) + 1}` : undefined,
    completedTasksToday: Math.floor(Math.random() * 8),
    workMinutesToday: Math.floor(Math.random() * 480),
  }));
}

/**
 * 生成模拟任务数据
 */
function generateMockTasks(stationId?: string): Task[] {
  const baseLocation = stationId ? {
    latitude: 30.5728 + (Math.random() - 0.5) * 0.1,
    longitude: 104.0668 + (Math.random() - 0.5) * 0.1,
  } : {
    latitude: 30.5728,
    longitude: 104.0668,
  };

  return Array.from({ length: 25 }, (_, i) => {
    const pickupLat = baseLocation.latitude + (Math.random() - 0.5) * 0.08;
    const pickupLng = baseLocation.longitude + (Math.random() - 0.5) * 0.08;
    
    return {
      id: `task_${i + 1}`,
      name: `清运任务${i + 1}`,
      type: i < 20 ? "collection" : "transport",
      status: ["pending", "assigned", "in_progress", "completed"][Math.floor(Math.random() * 4)] as TaskStatus,
      priority: ["low", "normal", "high", "urgent"][Math.floor(Math.random() * 4)] as any,
      pickup: {
        latitude: pickupLat,
        longitude: pickupLng,
        address: `成都市武侯区第${i + 1}大街${Math.floor(Math.random() * 100) + 1}号`,
        district: `武侯区`,
      },
      delivery: i >= 15 ? {
        latitude: pickupLat + (Math.random() - 0.5) * 0.02,
        longitude: pickupLng + (Math.random() - 0.5) * 0.02,
        address: `处理中心${Math.floor(Math.random() * 5) + 1}`,
        district: `高新区`,
      } : undefined,
      estimatedWorkload: {
        duration: 30 + Math.random() * 60,
        weight: 1 + Math.random() * 4,
      },
      assignedVehicleId: Math.random() > 0.5 ? `vehicle_${Math.floor(Math.random() * 12) + 1}` : undefined,
      createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString(),
      plannedStartTime: new Date(Date.now() + Math.random() * 3600000).toISOString(),
      actualStartTime: Math.random() > 0.7 ? new Date(Date.now() - Math.random() * 3600000).toISOString() : undefined,
      completedAt: Math.random() > 0.8 ? new Date(Date.now() - Math.random() * 7200000).toISOString() : undefined,
      overflowLevel: Math.floor(Math.random() * 5) + 1,
      notes: Math.random() > 0.7 ? `备注信息${i + 1}` : undefined,
    };
  });
}

/**
 * 生成模拟AI建议
 */
function generateMockAIRecommendations(): AIRecommendation[] {
  return [
    {
      id: "ai_rec_1",
      type: "route_optimization",
      title: "路径优化建议",
      description: "重新规划3号车辆的收运路径，预计节省23分钟",
      benefits: {
        timeSaved: 23,
        distanceReduced: 8.5,
        fuelSaved: 2.3,
      },
      affectedVehicleIds: ["vehicle_3"],
      affectedTaskIds: ["task_5", "task_8", "task_12"],
      solution: {
        newRoute: ["task_8", "task_5", "task_12"],
        estimatedTime: 156,
      },
      confidence: 0.92,
      createdAt: new Date().toISOString(),
      applied: false,
    },
    {
      id: "ai_rec_2",
      type: "vehicle_reassignment",
      title: "车辆重新分配",
      description: "将7号任务分配给5号车辆，避免等待时间",
      benefits: {
        timeSaved: 45,
        distanceReduced: 12.3,
      },
      affectedVehicleIds: ["vehicle_5"],
      affectedTaskIds: ["task_7"],
      solution: {
        fromVehicleId: "vehicle_2",
        toVehicleId: "vehicle_5",
        reason: "5号车辆距离更近且当前空闲",
      },
      confidence: 0.87,
      createdAt: new Date(Date.now() - 1800000).toISOString(),
      applied: false,
    },
    {
      id: "ai_rec_3",
      type: "fuel_efficiency",
      title: "油耗优化建议",
      description: "调整6号车辆行驶速度，可节省15%燃油",
      benefits: {
        fuelSaved: 3.2,
        emissionReduced: 8.4,
      },
      affectedVehicleIds: ["vehicle_6"],
      affectedTaskIds: ["task_9", "task_15"],
      solution: {
        recommendedSpeed: 45,
        currentSpeed: 65,
        routeAdjustment: "避开拥堵路段",
      },
      confidence: 0.78,
      createdAt: new Date(Date.now() - 3600000).toISOString(),
      applied: true,
    },
  ];
}

/**
 * 生成模拟应急事件
 */
function generateMockEmergencyEvents(): EmergencyEvent[] {
  return [
    {
      id: "emergency_1",
      type: "overflow",
      location: {
        latitude: 30.5728,
        longitude: 104.0668,
        address: "成都市武侯区天府大道100号",
        district: "武侯区",
      },
      description: "垃圾桶满溢严重，需要紧急处理",
      severity: "high",
      reportedAt: new Date(Date.now() - 900000).toISOString(),
      responseStatus: "responding",
      activatedPlanId: "plan_overflow_1",
      dispatchedVehicleIds: ["vehicle_11", "vehicle_12"],
    },
    {
      id: "emergency_2",
      type: "breakdown",
      location: {
        latitude: 30.5828,
        longitude: 104.0768,
        address: "成都市高新区世纪城路200号",
        district: "高新区",
      },
      description: "3号车辆发生故障，需要维修支援",
      severity: "medium",
      reportedAt: new Date(Date.now() - 1800000).toISOString(),
      responseStatus: "pending",
      dispatchedVehicleIds: [],
    },
  ];
}

/**
 * 生成模拟排班数据
 */
function generateMockSchedules(): {
  staffSchedules: StaffSchedule[];
  vehicleSchedules: VehicleSchedule[];
} {
  const staffSchedules: StaffSchedule[] = Array.from({ length: 15 }, (_, i) => ({
    staffId: `staff_${i + 1}`,
    staffName: `员工${i + 1}`,
    shiftType: ["morning", "afternoon", "night", "flexible"][Math.floor(Math.random() * 4)] as any,
    workHours: {
      start: ["08:00", "16:00", "00:00"][Math.floor(Math.random() * 3)],
      end: ["16:00", "00:00", "08:00"][Math.floor(Math.random() * 3)],
    },
    assignedVehicleId: Math.random() > 0.3 ? `vehicle_${Math.floor(Math.random() * 12) + 1}` : undefined,
    skills: ["驾驶", "维修", "调度", "应急处理"].slice(0, Math.floor(Math.random() * 3) + 1),
    workMinutesToday: Math.floor(Math.random() * 480),
    workMinutesThisWeek: Math.floor(Math.random() * 2400),
  }));

  const vehicleSchedules: VehicleSchedule[] = Array.from({ length: 12 }, (_, i) => ({
    vehicleId: `vehicle_${i + 1}`,
    shiftStatus: ["active", "break", "off_duty", "maintenance"][Math.floor(Math.random() * 4)] as any,
    plannedWorkMinutes: 480,
    actualWorkMinutes: Math.floor(Math.random() * 480),
    nextMaintenance: new Date(Date.now() + Math.random() * 2592000000).toISOString(),
    tasksToday: Math.floor(Math.random() * 10),
    availability: {
      available: Math.random() > 0.2,
      reason: Math.random() > 0.8 ? "维保中" : undefined,
      estimatedAvailable: Math.random() > 0.8 ? new Date(Date.now() + 3600000).toISOString() : undefined,
    },
  }));

  return { staffSchedules, vehicleSchedules };
}

// ==================== 主要Hook ====================

/**
 * 调度数据管理Hook
 */
export function useDispatchData(stationId?: string): UseDispatchDataReturn {
  const { selectedStationId } = useGlobalStore();
  const targetStationId = stationId || selectedStationId || undefined;

  // 状态管理
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [aiRecommendations, setAIRecommendations] = useState<AIRecommendation[]>([]);
  const [emergencyEvents, setEmergencyEvents] = useState<EmergencyEvent[]>([]);
  const [staffSchedules, setStaffSchedules] = useState<StaffSchedule[]>([]);
  const [vehicleSchedules, setVehicleSchedules] = useState<VehicleSchedule[]>([]);
  const [selectedVehicleId, setSelectedVehicleId] = useState<string | null>(null);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  // 更新定时器引用
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // 初始化数据
  const initializeData = useCallback(() => {
    if (!isClient) return;
    
    setIsLoading(true);
    
    try {
      const mockVehicles = generateMockVehicles(targetStationId);
      const mockTasks = generateMockTasks(targetStationId);
      const mockAIRecommendations = generateMockAIRecommendations();
      const mockEmergencyEvents = generateMockEmergencyEvents();
      const { staffSchedules: mockStaffSchedules, vehicleSchedules: mockVehicleSchedules } = generateMockSchedules();

      setVehicles(mockVehicles);
      setTasks(mockTasks);
      setAIRecommendations(mockAIRecommendations);
      setEmergencyEvents(mockEmergencyEvents);
      setStaffSchedules(mockStaffSchedules);
      setVehicleSchedules(mockVehicleSchedules);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Failed to initialize dispatch data:", error);
    } finally {
      setIsLoading(false);
    }
  }, [targetStationId]);

  // 模拟实时数据更新
  const updateRealtimeData = useCallback(() => {
    // 更新车辆位置和状态
    setVehicles(prev => prev.map(vehicle => {
      if (vehicle.status === "en_route") {
        // 模拟车辆移动
        const newLocation = {
          ...vehicle.location,
          latitude: vehicle.location.latitude + (Math.random() - 0.5) * 0.001,
          longitude: vehicle.location.longitude + (Math.random() - 0.5) * 0.001,
          heading: Math.random() * 360,
          speed: 30 + Math.random() * 40,
          timestamp: new Date().toISOString(),
        };
        return { ...vehicle, location: newLocation };
      }
      return vehicle;
    }));

    // 随机更新一些任务状态
    setTasks(prev => prev.map(task => {
      if (task.status === "in_progress" && Math.random() > 0.95) {
        return { ...task, status: "completed", completedAt: new Date().toISOString() };
      }
      if (task.status === "assigned" && Math.random() > 0.98) {
        return { ...task, status: "in_progress", actualStartTime: new Date().toISOString() };
      }
      return task;
    }));

    // 更新时间戳
    setLastUpdated(new Date());
  }, []);

  // 启动实时更新
  useEffect(() => {
    if (!isClient) return;
    
    initializeData();

    // 设置定时更新（每5秒更新一次）
    updateIntervalRef.current = setInterval(() => {
      updateRealtimeData();
    }, 5000);

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current);
      }
    };
  }, [initializeData, updateRealtimeData]);

  // 业务操作函数
  const selectVehicle = useCallback((vehicleId: string | null) => {
    setSelectedVehicleId(vehicleId);
  }, []);

  const selectTask = useCallback((taskId: string | null) => {
    setSelectedTaskId(taskId);
  }, []);

  const updateVehicleStatus = useCallback((vehicleId: string, status: VehicleStatus) => {
    setVehicles(prev => prev.map(vehicle => 
      vehicle.id === vehicleId ? { ...vehicle, status } : vehicle
    ));
  }, []);

  const updateTaskStatus = useCallback((taskId: string, status: TaskStatus) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedTask = { ...task, status };
        if (status === "in_progress" && !task.actualStartTime) {
          updatedTask.actualStartTime = new Date().toISOString();
        }
        if (status === "completed" && !task.completedAt) {
          updatedTask.completedAt = new Date().toISOString();
        }
        return updatedTask;
      }
      return task;
    }));
  }, []);

  const assignTask = useCallback((taskId: string, vehicleId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, assignedVehicleId: vehicleId, status: "assigned" as TaskStatus } : task
    ));
    setVehicles(prev => prev.map(vehicle => 
      vehicle.id === vehicleId ? { ...vehicle, currentTaskId: taskId, status: "en_route" as VehicleStatus } : vehicle
    ));
  }, []);

  const applyAIRecommendation = useCallback((recommendationId: string) => {
    setAIRecommendations(prev => prev.map(rec => 
      rec.id === recommendationId ? { ...rec, applied: true } : rec
    ));
    
    // 这里可以添加应用建议的具体逻辑
    console.log(`Applied AI recommendation: ${recommendationId}`);
  }, []);

  const activateEmergencyPlan = useCallback((eventId: string, planId: string) => {
    setEmergencyEvents(prev => prev.map(event => 
      event.id === eventId ? { 
        ...event, 
        activatedPlanId: planId, 
        responseStatus: "responding" 
      } : event
    ));
    
    console.log(`Activated emergency plan ${planId} for event ${eventId}`);
  }, []);

  const refreshData = useCallback(() => {
    initializeData();
  }, [initializeData]);

  return {
    vehicles,
    tasks,
    aiRecommendations,
    emergencyEvents,
    staffSchedules,
    vehicleSchedules,
    isLoading,
    lastUpdated,
    selectVehicle,
    selectTask,
    updateVehicleStatus,
    updateTaskStatus,
    assignTask,
    applyAIRecommendation,
    activateEmergencyPlan,
    refreshData,
  };
}
