import { useState, useCallback } from "react";
import { nanoid } from "nanoid";
import type {
  User,
  RolePermission,
  SystemConfig,
  OperationLog,
  PersonalSettings,
  RoleType,
} from "../types/settings";

// mock generators
const randomDate = () => new Date(Date.now() - Math.random() * 1e10).toISOString();
const roles: RoleType[] = [
  "super_admin",
  "ops_manager",
  "dispatcher",
  "inspector",
  "viewer",
];
const modules = [
  "dashboard",
  "stations",
  "monitor",
  "dispatch",
  "ai-center",
  "alerts",
  "analytics",
  "settings",
];

export function useSettings() {
  // logs (moved early so other functions can record events)
  const [logs, setLogs] = useState<OperationLog[]>(
    Array.from({ length: 100 }, () => ({
      id: nanoid(),
      timestamp: randomDate(),
      userName: `用户${Math.floor(Math.random() * 30)}`,
      action: ["login", "add", "edit", "delete"][
        Math.floor(Math.random() * 4)
      ],
      objectType: ["user", "role", "config"][Math.floor(Math.random() * 3)],
      objectId: nanoid(),
      result: Math.random() < 0.9 ? "success" : "failure",
    }))
  );
  const addLog = useCallback((log: Omit<OperationLog, "id" | "timestamp">) => {
    setLogs((prev) => [...prev, { ...log, id: nanoid(), timestamp: new Date().toISOString() }]);
  }, []);

  // users
  const [users, setUsers] = useState<User[]>(() =>
    Array.from({ length: 30 }, () => ({
      id: nanoid(),
      name: `用户${Math.floor(Math.random() * 1000)}`,
      phone: `138${Math.floor(1e8 + Math.random() * 9e8)}`,
      role: roles[Math.floor(Math.random() * roles.length)],
      status: Math.random() < 0.8 ? "active" : "disabled",
      lastLogin: randomDate(),
    }))
  );

  const addUser = useCallback((u: Omit<User, "id" | "lastLogin">) => {
    setUsers((prev) => [...prev, { ...u, id: nanoid(), lastLogin: randomDate() }]);
    // Log after state update completes
    setTimeout(() => addLog({ userName: u.name, action: "add user", objectType: "user", objectId: "" , result: "success"}), 0);
  }, [addLog]);
  const updateUser = useCallback((id: string, fields: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...fields } : u)));
    setTimeout(() => addLog({ userName: fields.name || "", action: "update user", objectType: "user", objectId: id, result: "success"}), 0);
  }, [addLog]);
  const toggleUser = useCallback((id: string, enable: boolean) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: enable ? "active" : "disabled" } : u))
    );
    setTimeout(() => addLog({ userName: "", action: enable ? "enable user" : "disable user", objectType: "user", objectId: id, result: "success"}), 0);
  }, [addLog]);

  // roles
  const [rolePerms, setRolePerms] = useState<RolePermission[]>(
    roles.map((r) => ({
      role: r,
      modules: modules.slice(0, Math.floor(Math.random() * modules.length) + 1),
      dataScope: ["all", "region", "self"][
        Math.floor(Math.random() * 3)
      ] as any,
      regionIds: [],
    }))
  );
  const setRolePermission = useCallback((role: RoleType, perms: Partial<RolePermission>) => {
    setRolePerms((prev) =>
      prev.map((rp) => (rp.role === role ? { ...rp, ...perms } : rp))
    );
    setTimeout(() => addLog({ userName: "", action: "modify role perms", objectType: "role", objectId: role, result: "success"}), 0);
  }, [addLog]);

  // system config
  const [systemConfig, setSystemConfig] = useState<SystemConfig>({
    platformName: "智环卫士",
    logoUrl: "",
    loginBgUrl: "",
    themeMode: "auto",
    themeColor: "blue",
    mapCenter: [104.0, 35.0],
    mapZoom: 12,
    alertSound: true,
    alertDuration: 5,
    refreshInterval: 60,
  });
  const updateSystemConfig = useCallback((cfg: Partial<SystemConfig>) => {
    setSystemConfig((prev) => ({ ...prev, ...cfg }));
  }, []);

  // personal settings
  const [personalSettings, setPersonalSettings] = useState<PersonalSettings>({
    name: "张三",
    email: "zhangsan@example.com",
    phone: "13800000000",
    density: "comfortable",
    pageSize: 10,
    notifications: { inbox: true, email: false, sms: false },
  });
  const updatePersonalSettings = useCallback((p: Partial<PersonalSettings>) => {
    setPersonalSettings((prev) => ({ ...prev, ...p }));
  }, []);

  return {
    users,
    addUser,
    updateUser,
    toggleUser,
    rolePerms,
    setRolePermission,
    systemConfig,
    updateSystemConfig,
    logs,
    addLog,
    personalSettings,
    updatePersonalSettings,
  };
}
