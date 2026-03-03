/**
 * @file settings.ts
 * @description 模块6: 系统设置相关业务类型
 */

// 用户管理相关
export type UserStatus = "active" | "disabled";
export type RoleType =
  | "super_admin"
  | "ops_manager"
  | "dispatcher"
  | "inspector"
  | "viewer";

export interface User {
  id: string;
  name: string;
  phone: string;
  role: RoleType;
  status: UserStatus;
  lastLogin: string; // ISO
}

export interface RolePermission {
  role: RoleType;
  modules: string[]; // list of module keys
  dataScope: "all" | "region" | "self";
  regionIds?: string[];
}

// 系统配置
export interface SystemConfig {
  platformName: string;
  logoUrl?: string;
  loginBgUrl?: string;
  themeMode: "light" | "dark" | "auto";
  themeColor: "blue" | "green" | "purple";
  mapCenter: [number, number];
  mapZoom: number;
  alertSound: boolean;
  alertDuration: number; // seconds
  refreshInterval: number; // seconds
}

// 操作日志
export interface OperationLog {
  id: string;
  timestamp: string;
  userName: string;
  action: string;
  objectType: string;
  objectId: string;
  result: "success" | "failure";
}

// 个人设置
export interface PersonalSettings {
  // 基本信息
  name: string;
  email: string;
  phone?: string;

  // 界面偏好
  density: "compact" | "comfortable";
  pageSize: number;
  notifications: {
    inbox: boolean;
    email: boolean;
    sms: boolean;
  };
}
