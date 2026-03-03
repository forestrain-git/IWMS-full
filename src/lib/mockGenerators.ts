/**
 * Mock数据生成器
 * 用于生成模拟的业务数据
 */

import {
  Station,
  StationStatus,
  Alert,
  AlertType,
  AlertLevel,
  AlertStatus,
  TrendPoint,
  KPIData,
  Device,
  DeviceType,
  DeviceStatus,
  DispatchTask,
  TaskType,
  TaskStatus,
  AIRecognition,
  RecognitionType,
} from "@/types";
import {
  STATION_NAME_PREFIXES,
  STATION_NAME_SUFFIXES,
  STREET_NAMES,
  ALERT_MESSAGE_TEMPLATES,
} from "./constants";
import { generateId, randomElement, randomInt, randomFloat } from "./utils";

// ==================== 站点数据生成器 ====================

/**
 * 生成随机站点状态
 * 概率分布：online(70%)/warning(15%)/danger(5%)/offline(8%)/maintenance(2%)
 */
function generateStationStatus(): StationStatus {
  const rand = Math.random();
  if (rand < 0.7) return "online";
  if (rand < 0.85) return "warning";
  if (rand < 0.9) return "danger";
  if (rand < 0.98) return "offline";
  return "maintenance";
}

/**
 * 生成站点名称
 */
function generateStationName(): string {
  const prefix = randomElement(STATION_NAME_PREFIXES);
  const suffix = randomElement(STATION_NAME_SUFFIXES);
  return `${prefix}${suffix}回收站`;
}

/**
 * 生成站点地址（成都龙泉驿）
 */
function generateAddress(): string {
  const streets = ["驿都大道", "成龙大道", "车城大道", "桃都大道", "建材路", "长柏路", "建设路", "文明东街", "滨河南街", "鸥鹏大道"];
  const street = randomElement(streets);
  const number = randomInt(1, 999);
  return `成都市龙泉驿区${street}${number}号`;
}

/**
 * 生成站点编码
 */
function generateStationCode(index: number): string {
  return `ST${String(index + 1).padStart(4, "0")}`;
}

/**
 * 生成单个站点
 */
function generateStation(index: number): Station {
  const status = generateStationStatus();
  const deviceCount = randomInt(3, 8);
  const onlineDeviceCount =
    status === "online"
      ? deviceCount
      : status === "offline"
      ? 0
      : randomInt(0, deviceCount - 1);

  // 容量与状态相关
  let capacity = randomInt(20, 80);
  if (status === "warning") capacity = randomInt(75, 90);
  if (status === "danger") capacity = randomInt(90, 100);

  // 坐标范围：成都龙泉驿区（104.15-104.35, 30.45-30.65）
  const lng = randomFloat(104.15, 104.35, 6);
  const lat = randomFloat(30.45, 30.65, 6);

  // 生成最近收集时间
  const lastCollection = new Date();
  lastCollection.setHours(lastCollection.getHours() - randomInt(1, 48));

  return {
    id: generateId("station"),
    name: generateStationName(),
    code: generateStationCode(index),
    address: generateAddress(),
    lng,
    lat,
    status,
    capacity,
    dailyVolume: randomFloat(0.5, 5, 2),
    lastCollection: lastCollection.toISOString(),
    deviceCount,
    onlineDeviceCount,
    managerName: `张${randomElement(["伟", "芳", "敏", "静", "强", "磊", "洋"])}`,
    managerPhone: `138${randomInt(10000000, 99999999)}`,
  };
}

/**
 * 生成站点列表
 * @param count 站点数量
 * @returns 站点列表
 */
export function generateStations(count: number): Station[] {
  return Array.from({ length: count }, (_, i) => generateStation(i));
}

// ==================== 趋势数据生成器 ====================

/**
 * 生成趋势数据
 * 模拟24小时曲线，带有合理的业务波动（早晚高峰）
 * @param points 数据点数量
 * @returns 趋势数据点列表
 */
export function generateTrendData(points: number = 24): TrendPoint[] {
  const data: TrendPoint[] = [];
  const now = new Date();

  for (let i = 0; i < points; i++) {
    const time = new Date(now);
    time.setHours(time.getHours() - (points - 1 - i));

    // 模拟早晚高峰：7-9点和18-20点
    const hour = time.getHours();
    let baseValue = 30;
    if ((hour >= 7 && hour <= 9) || (hour >= 18 && hour <= 20)) {
      baseValue = 70; // 高峰时段
    } else if (hour >= 22 || hour <= 5) {
      baseValue = 10; // 深夜时段
    }

    // 添加随机波动
    const value = Math.max(0, baseValue + randomInt(-15, 15));

    data.push({
      timestamp: time.toISOString(),
      value,
      label: `${hour}:00`,
    });
  }

  return data;
}

/**
 * 生成多组趋势数据（用于对比）
 * @param series 数据系列数量
 * @param points 每个系列的数据点数量
 * @returns 多组趋势数据
 */
export function generateMultiTrendData(
  series: number = 3,
  points: number = 24
): TrendPoint[][] {
  return Array.from({ length: series }, () => generateTrendData(points));
}

// ==================== 告警数据生成器 ====================

/**
 * 生成随机告警类型
 */
function generateAlertType(): AlertType {
  return randomElement(["fullness", "offline", "fault", "illegal", "fire"]);
}

/**
 * 生成随机告警等级
 * 概率分布：low(30%)/medium(40%)/high(20%)/critical(10%)
 */
function generateAlertLevel(): AlertLevel {
  const rand = Math.random();
  if (rand < 0.3) return "low";
  if (rand < 0.7) return "medium";
  if (rand < 0.9) return "high";
  return "critical";
}

/**
 * 生成随机告警状态
 */
function generateAlertStatus(): AlertStatus {
  return randomElement(["pending", "processing", "resolved"]);
}

/**
 * 生成单个告警
 * @param stations 站点列表（用于关联）
 */
function generateAlert(stations: Station[]): Alert {
  const type = generateAlertType();
  const level = generateAlertLevel();
  const status = generateAlertStatus();
  const station = randomElement(stations);

  // 生成时间（最近1小时内）
  const timestamp = new Date();
  timestamp.setMinutes(timestamp.getMinutes() - randomInt(1, 60));

  const messages = ALERT_MESSAGE_TEMPLATES[type];

  return {
    id: generateId("alert"),
    timestamp: timestamp.toISOString(),
    stationId: station.id,
    stationName: station.name,
    type,
    level,
    message: randomElement(messages),
    status,
    handler: status !== "pending" ? `李${randomElement(["明", "华", "军", "勇"])}` : undefined,
  };
}

/**
 * 生成告警列表
 * @param count 告警数量
 * @param stations 站点列表（用于关联）
 * @returns 告警列表（按时间倒序）
 */
export function generateAlerts(count: number, stations: Station[]): Alert[] {
  const alerts = Array.from({ length: count }, () => generateAlert(stations));
  return alerts.sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
}

// ==================== KPI数据生成器 ====================

/**
 * 生成KPI数据
 * @returns KPI数据
 */
export function generateKPIData(): KPIData {
  return {
    dailyVolume: {
      value: randomFloat(120, 180, 1),
      unit: "吨",
      trend: randomFloat(-10, 15, 1),
      trendLabel: "较昨日",
    },
    onlineRate: {
      value: randomFloat(85, 99, 1),
      trend: randomFloat(-2, 3, 1),
      trendLabel: "较上周",
    },
    alertRate: {
      value: randomFloat(2, 8, 1),
      trend: randomFloat(-20, 10, 1),
      trendLabel: "较昨日",
    },
    carbonReduction: {
      value: randomFloat(45, 65, 1),
      unit: "吨",
      trend: randomFloat(5, 15, 1),
      trendLabel: "本月累计",
      period: "本月",
    },
  };
}

// ==================== 设备数据生成器 ====================

/**
 * 生成随机设备类型
 */
function generateDeviceType(): DeviceType {
  return randomElement(["sensor", "camera", "compressor", "weigher", "screen"]);
}

/**
 * 生成随机设备状态
 */
function generateDeviceStatus(): DeviceStatus {
  const rand = Math.random();
  if (rand < 0.75) return "online";
  if (rand < 0.9) return "offline";
  if (rand < 0.97) return "error";
  return "maintenance";
}

/**
 * 生成单个设备
 * @param station 所属站点
 */
function generateDevice(station: Station): Device {
  const type = generateDeviceType();
  const status = generateDeviceStatus();

  // 生成最后心跳时间
  const lastHeartbeat = new Date();
  if (status === "online") {
    lastHeartbeat.setMinutes(lastHeartbeat.getMinutes() - randomInt(1, 5));
  } else {
    lastHeartbeat.setHours(lastHeartbeat.getHours() - randomInt(1, 24));
  }

  const typeNames: Record<DeviceType, string> = {
    sensor: "容量传感器",
    camera: "智能摄像头",
    compressor: "压缩装置",
    weigher: "称重设备",
    screen: "信息显示屏",
  };

  // 健康评分根据状态生成
  let healthScore: number;
  if (status === "online") {
    healthScore = randomInt(70, 100);
  } else if (status === "maintenance") {
    healthScore = randomInt(40, 80);
  } else if (status === "error") {
    healthScore = randomInt(10, 40);
  } else {
    healthScore = randomInt(0, 20);
  }

  // 生成3D场景中的位置（围绕站点分布）
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.random() * 4 + 2; // 2-6单位距离
  const position = {
    x: Math.cos(angle) * radius,
    y: Math.random() * 3 + 1, // 1-4单位高度
    z: Math.sin(angle) * radius,
  };

  // 生成随机的旋转
  const rotation = {
    x: Math.random() * Math.PI * 2,
    y: Math.random() * Math.PI * 2,
    z: Math.random() * Math.PI * 2,
  };

  // 是否正在运行
  const isRunning = status === "online";

  // 生成性能数据
  const performanceData = {
    efficiency: randomFloat(60, 100, 1),
    throughput: randomInt(50, 200),
    latency: randomInt(10, 300),
  };

  return {
    id: generateId("device"),
    name: `${station.name}-${typeNames[type]}`,
    type,
    stationId: station.id,
    stationName: station.name,
    status,
    lastHeartbeat: lastHeartbeat.toISOString(),
    batteryLevel: type === "sensor" ? randomInt(20, 100) : undefined,
    firmwareVersion: `v${randomInt(1, 3)}.${randomInt(0, 9)}.${randomInt(0, 9)}`,
    healthScore,
    position,
    rotation,
    isRunning,
    performanceData,
  };
}

/**
 * 生成设备列表
 * @param stations 站点列表
 * @returns 设备列表
 */
export function generateDevices(stations: Station[]): Device[] {
  const devices: Device[] = [];
  stations.forEach((station) => {
    const count = station.deviceCount;
    for (let i = 0; i < count; i++) {
      devices.push(generateDevice(station));
    }
  });
  return devices;
}

// ==================== 调度任务生成器 ====================

/**
 * 生成随机任务类型
 */
function generateTaskType(): TaskType {
  return randomElement(["collection", "maintenance", "inspection", "emergency"]);
}

/**
 * 生成随机任务状态
 */
function generateTaskStatus(): TaskStatus {
  return randomElement(["pending", "assigned", "in_progress", "completed", "cancelled"]);
}

/**
 * 生成单个调度任务
 * @param stations 站点列表
 */
function generateTask(stations: Station[]): DispatchTask {
  const type = generateTaskType();
  const status = generateTaskStatus();
  const station = randomElement(stations);
  const priority: AlertLevel =
    type === "emergency" ? "critical" : randomElement(["low", "medium", "high"]);

  // 生成计划时间
  const scheduledTime = new Date();
  scheduledTime.setHours(scheduledTime.getHours() + randomInt(-12, 24));

  // 生成完成时间（已完成任务）
  const completedTime =
    status === "completed"
      ? new Date(scheduledTime.getTime() + randomInt(30, 180) * 60000).toISOString()
      : undefined;

  const descriptions: Record<TaskType, string[]> = {
    collection: ["例行清运", "满溢清运", "紧急清运"],
    maintenance: ["设备检修", "传感器校准", "固件升级"],
    inspection: ["定期检查", "安全检查", "卫生检查"],
    emergency: ["设备故障处理", "火情处理", "违规处理"],
  };

  return {
    id: generateId("task"),
    type,
    status,
    stationId: station.id,
    stationName: station.name,
    assignedTo: status !== "pending" ? `王${randomElement(["强", "军", "明", "涛"])}` : undefined,
    vehicleId: type === "collection" ? `京A${randomInt(10000, 99999)}` : undefined,
    priority,
    scheduledTime: scheduledTime.toISOString(),
    completedTime,
    description: randomElement(descriptions[type]),
  };
}

/**
 * 生成调度任务列表
 * @param count 任务数量
 * @param stations 站点列表
 * @returns 任务列表
 */
export function generateTasks(count: number, stations: Station[]): DispatchTask[] {
  return Array.from({ length: count }, () => generateTask(stations));
}

// ==================== AI识别数据生成器 ====================

/**
 * 生成随机识别类型
 */
function generateRecognitionType(): RecognitionType {
  return randomElement(["waste_type", "illegal_dumping", "fire_smoke", "person", "vehicle"]);
}

/**
 * 生成单个AI识别结果
 * @param stations 站点列表
 */
function generateAIRecognition(stations: Station[]): AIRecognition {
  const type = generateRecognitionType();
  const station = randomElement(stations);
  const confidence = randomFloat(70, 99, 1);

  // 生成识别时间
  const timestamp = new Date();
  timestamp.setMinutes(timestamp.getMinutes() - randomInt(1, 120));

  const descriptions: Record<RecognitionType, string[]> = {
    waste_type: ["识别为厨余垃圾", "识别为可回收物", "识别为有害垃圾", "识别为其他垃圾"],
    illegal_dumping: ["检测到大件垃圾违规投放", "检测到建筑垃圾违规投放"],
    fire_smoke: ["检测到烟雾", "检测到明火"],
    person: ["检测到人员靠近", "检测到人员操作"],
    vehicle: ["检测到清运车辆到达", "检测到其他车辆靠近"],
  };

  const isAlert =
    type === "illegal_dumping" || type === "fire_smoke" || (type === "waste_type" && confidence < 80);

  return {
    id: generateId("ai"),
    timestamp: timestamp.toISOString(),
    stationId: station.id,
    stationName: station.name,
    type,
    confidence,
    imageUrl: `/api/mock/ai-image/${generateId("img")}`,
    description: randomElement(descriptions[type]),
    isAlert,
  };
}

/**
 * 生成AI识别结果列表
 * @param count 识别结果数量
 * @param stations 站点列表
 * @returns AI识别结果列表
 */
export function generateAIRecognitions(count: number, stations: Station[]): AIRecognition[] {
  return Array.from({ length: count }, () => generateAIRecognition(stations));
}

// ==================== 完整Mock数据生成器 ====================

/**
 * 生成完整的Mock数据
 * @returns 包含所有业务数据的对象
 */
export function generateAllMockData() {
  const stations = generateStations(20);
  const devices = generateDevices(stations);
  const alerts = generateAlerts(15, stations);
  const tasks = generateTasks(10, stations);
  const aiRecognitions = generateAIRecognitions(20, stations);
  const kpiData = generateKPIData();

  return {
    stations,
    devices,
    alerts,
    tasks,
    aiRecognitions,
    kpiData,
  };
}
