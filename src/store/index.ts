/**
 * Zustand状态管理
 * 包含主题、侧边栏、Mock数据和告警的状态管理
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  Theme,
  Station,
  Alert,
  KPIData,
  Device,
  DispatchTask,
  AIRecognition,
} from "@/types";
import {
  generateAllMockData,
  generateStations,
  generateAlerts,
  generateKPIData,
} from "@/lib/mockGenerators";
import { SIDEBAR_CONFIG, THEME_CONFIG } from "@/lib/constants";

// ==================== 主题状态 ====================

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "light" | "dark";
  setResolvedTheme: (theme: "light" | "dark") => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: THEME_CONFIG.defaultTheme,
      setTheme: (theme) => set({ theme }),
      resolvedTheme: "light",
      setResolvedTheme: (resolvedTheme) => set({ resolvedTheme }),
    }),
    {
      name: THEME_CONFIG.storageKey,
    }
  )
);

// ==================== 侧边栏状态 ====================

interface SidebarState {
  isCollapsed: boolean;
  isMobileOpen: boolean;
  toggleCollapsed: () => void;
  setCollapsed: (collapsed: boolean) => void;
  toggleMobileOpen: () => void;
  setMobileOpen: (open: boolean) => void;
}

export const useSidebarStore = create<SidebarState>()((set) => ({
  isCollapsed: false,
  isMobileOpen: false,
  toggleCollapsed: () => set((state) => ({ isCollapsed: !state.isCollapsed })),
  setCollapsed: (collapsed) => set({ isCollapsed: collapsed }),
  toggleMobileOpen: () => set((state) => ({ isMobileOpen: !state.isMobileOpen })),
  setMobileOpen: (open) => set({ isMobileOpen: open }),
}));

// ==================== Mock数据状态 ====================

interface MockDataState {
  // 数据
  stations: Station[];
  devices: Device[];
  alerts: Alert[];
  tasks: DispatchTask[];
  aiRecognitions: AIRecognition[];
  kpiData: KPIData;

  // 加载状态
  isLoading: boolean;
  lastUpdated: Date | null;

  // 操作方法
  refreshData: () => void;
  refreshStations: () => void;
  refreshAlerts: () => void;
  refreshKPIData: () => void;
}

// ==================== 全局应用状态 ====================

interface GlobalAppState {
  /** 当前页面标题 */
  currentPageTitle: string;
  setCurrentPageTitle: (title: string) => void;

  /** 当前选中站点ID - 用于模块间联动 */
  selectedStationId: string | null;
  setSelectedStationId: (id: string | null) => void;

  /** 全局时间范围 - 各模块时间筛选同步 */
  globalTimeRange: [Date, Date];
  setGlobalTimeRange: (range: [Date, Date]) => void;
}

export const useMockDataStore = create<MockDataState>()((set, get) => ({
  // 初始数据
  stations: [],
  devices: [],
  alerts: [],
  tasks: [],
  aiRecognitions: [],
  kpiData: generateKPIData(),

  // 加载状态
  isLoading: false,
  lastUpdated: null,

  // 刷新所有数据
  refreshData: () => {
    set({ isLoading: true });
    const data = generateAllMockData();
    set({
      ...data,
      isLoading: false,
      lastUpdated: new Date(),
    });
  },

  // 刷新站点数据
  refreshStations: () => {
    const stations = generateStations(20);
    set({ stations, lastUpdated: new Date() });
  },

  // 刷新告警数据
  refreshAlerts: () => {
    const { stations } = get();
    if (stations.length === 0) {
      // 如果没有站点数据，先初始化
      get().refreshData();
      return;
    }
    const alerts = generateAlerts(15, stations);
    set({ alerts, lastUpdated: new Date() });
  },

  // 刷新KPI数据
  refreshKPIData: () => {
    set({ kpiData: generateKPIData(), lastUpdated: new Date() });
  },
}));

// ==================== 告警状态 ====================

interface AlertState {
  // 未读告警数量
  unreadCount: number;

  // 已读告警ID列表
  readAlertIds: string[];

  // 操作方法
  markAsRead: (alertId: string) => void;
  markAllAsRead: () => void;
  clearReadHistory: () => void;
  updateUnreadCount: (count: number) => void;
}

export const useAlertStore = create<AlertState>()(
  persist(
    (set) => ({
      unreadCount: 0,
      readAlertIds: [],

      markAsRead: (alertId) =>
        set((state) => ({
          readAlertIds: [...state.readAlertIds, alertId],
          unreadCount: Math.max(0, state.unreadCount - 1),
        })),

      markAllAsRead: () =>
        set((state) => ({
          readAlertIds: [
            ...state.readAlertIds,
            ...useMockDataStore
              .getState()
              .alerts.filter((a) => !state.readAlertIds.includes(a.id))
              .map((a) => a.id),
          ],
          unreadCount: 0,
        })),

      clearReadHistory: () =>
        set({
          readAlertIds: [],
          unreadCount: useMockDataStore.getState().alerts.length,
        }),

      updateUnreadCount: (count) => set({ unreadCount: count }),
    }),
    {
      name: "alert-store",
    }
  )
);

// ==================== 用户状态 ====================

interface UserState {
  user: {
    id: string;
    name: string;
    avatar?: string;
    role: string;
    email: string;
  } | null;
  isAuthenticated: boolean;
  login: (user: UserState["user"]) => void;
  logout: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "user-store",
    }
  )
);

// ==================== UI状态 ====================

interface UIState {
  // 全屏状态
  isFullscreen: boolean;
  toggleFullscreen: () => void;

  // 通知状态
  notifications: Array<{
    id: string;
    type: "success" | "error" | "warning" | "info";
    message: string;
  }>;
  addNotification: (notification: Omit<UIState["notifications"][0], "id">) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isFullscreen: false,
  toggleFullscreen: () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      set({ isFullscreen: true });
    } else {
      document.exitFullscreen();
      set({ isFullscreen: false });
    }
  },

  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...notification, id: Math.random().toString(36).substr(2, 9) },
      ],
    })),
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));

// ==================== 全局应用状态 ====================

export const useGlobalStore = create<GlobalAppState>()((set) => ({
  currentPageTitle: "",
  setCurrentPageTitle: (title) => set({ currentPageTitle: title }),

  selectedStationId: null,
  setSelectedStationId: (id) => set({ selectedStationId: id }),

  globalTimeRange: [
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30天前
    new Date(),
  ],
  setGlobalTimeRange: (range) => set({ globalTimeRange: range }),
}));

// ==================== 便捷Hook ====================

/**
 * 初始化Mock数据
 * 在应用启动时调用
 */
export function initializeMockData() {
  const { refreshData } = useMockDataStore.getState();
  refreshData();

  // 模拟实时数据更新
  setInterval(() => {
    const { refreshKPIData } = useMockDataStore.getState();
    refreshKPIData();
  }, 30000); // 每30秒更新一次KPI

  // 模拟告警推送
  setInterval(() => {
    const { alerts, refreshAlerts } = useMockDataStore.getState();
    const { updateUnreadCount } = useAlertStore.getState();
    if (Math.random() > 0.7) {
      refreshAlerts();
      updateUnreadCount(alerts.filter((a) => a.status === "pending").length);
    }
  }, 60000); // 每分钟检查一次新告警
}
