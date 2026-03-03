# 开发检查清单

> 模块0和模块1-N的开发检查清单 | 版本: 1.0.0

## 目录

- [模块0自检清单](#模块0自检清单)
- [模块1-N接入检查清单](#模块1-n接入检查清单)
- [集成测试检查清单](#集成测试检查清单)
- [发布前检查清单](#发布前检查清单)

---

## 模块0自检清单

在模块0开发完成后，按以下清单进行自检：

### 1. 文件完整性检查

#### 1.1 核心代码文件

- [x] `app/layout.tsx` - 根布局存在
- [x] `components/layout/MainLayout.tsx` - 主布局存在
- [x] `components/layout/Sidebar.tsx` - 侧边栏存在
- [x] `components/layout/Header.tsx` - 顶部栏存在
- [x] `components/business/StatCard.tsx` - 数据卡片存在
- [x] `components/business/StatusTag.tsx` - 状态标签存在
- [x] `components/business/PageHeader.tsx` - 页面标题栏存在
- [x] `components/business/TrendChart.tsx` - 趋势图存在
- [x] `components/business/StationSelector.tsx` - 站点选择器存在
- [x] `components/business/AlertTicker.tsx` - 告警滚动条存在
- [x] `components/layout/ThemeToggle.tsx` - 主题切换存在
- [x] `hooks/useTheme.ts` - 主题Hook存在
- [x] `hooks/useMockData.ts` - Mock数据Hook存在
- [x] `lib/utils.ts` - 工具函数存在
- [x] `lib/constants.ts` - 常量配置存在
- [x] `lib/mockGenerators.ts` - Mock生成器存在
- [x] `lib/routes.ts` - 路由配置存在
- [x] `store/index.ts` - 全局状态存在
- [x] `types/index.ts` - 类型定义存在
- [x] `styles/theme.css` - 主题样式存在

#### 1.2 契约文档

- [x] `src/lib/CONTRACT.ts` - 冻结接口契约
- [x] `ARCHITECTURE.md` - 架构说明文档
- [x] `COMPONENT_CATALOG.md` - 组件使用手册
- [x] `DEPENDENCY_GRAPH.md` - 依赖关系图
- [x] `CHECKLIST.md` - 开发检查清单（本文档）

### 2. 类型定义完整性检查

- [x] `Station` 接口定义完整
- [x] `Alert` 接口定义完整
- [x] `KPIData` 接口定义完整
- [x] `TrendPoint` 接口定义完整
- [x] `UserInfo` 接口定义完整
- [x] `Device` 接口定义完整
- [x] `RouteConfig` 接口定义完整
- [x] `Theme` 类型定义完整
- [x] `ColorTheme` 类型定义完整
- [x] `MenuItem` 接口定义完整

### 3. 全局状态完整性检查

- [x] `theme: 'light' | 'dark' | 'system'` - 主题状态
- [x] `sidebarCollapsed: boolean` - 侧边栏折叠状态
- [x] `currentPageTitle: string` - 当前页面标题
- [x] `stations: Station[]` - 站点列表
- [x] `alerts: Alert[]` - 告警列表
- [x] `selectedStationId: string | null` - 选中站点ID
- [x] `globalTimeRange: [Date, Date]` - 全局时间范围
- [x] `userInfo: UserInfo | null` - 用户信息

### 4. Mock数据生成器检查

- [x] `generateStations(count: number): Station[]` - 站点生成
- [x] `generateAlerts(count: number, stations: Station[]): Alert[]` - 告警生成
- [x] `generateTrendData(points: number): TrendPoint[]` - 趋势数据生成
- [x] `generateKPIData(): KPIData` - KPI数据生成
- [x] `generateDevices(stations: Station[]): Device[]` - 设备生成
- [x] `generateTasks(count: number, stations: Station[]): DispatchTask[]` - 任务生成
- [x] `generateAIRecognitions(count: number, stations: Station[]): AIRecognition[]` - AI识别生成

### 5. 工具函数检查

- [x] `cn(...inputs: ClassValue[]): string` - 类名合并
- [x] `formatDateTime(date, format): string` - 日期格式化
- [x] `formatNumber(num, decimals): string` - 数字格式化
- [x] `formatPercent(value, decimals): string` - 百分比格式化
- [x] `generateId(prefix): string` - 唯一ID生成
- [x] `debounce(fn, delay)` - 防抖函数
- [x] `throttle(fn, limit)` - 节流函数
- [x] `deepClone(obj)` - 深拷贝
- [x] `isMobile()` - 移动端检测

### 6. 组件Props标准化检查

每个组件必须有：
- [x] 导出Props接口（`export interface XxxProps`）
- [x] Props接口添加JSDoc注释
- [x] 有明确的必填/选填标记（`?`）
- [x] 有默认值处理

### 7. 功能测试检查

- [x] 主题切换功能正常（light/dark/system）
- [x] 侧边栏折叠功能正常
- [x] 移动端响应式布局正常
- [x] 路由跳转正常
- [x] Mock数据加载正常
- [x] 组件渲染正常
- [x] 控制台无报错、无警告

### 8. 代码质量检查

- [x] TypeScript类型检查通过（`npx tsc --noEmit`）
- [x] ESLint检查通过（`npm run lint`）
- [x] 所有组件使用函数式组件
- [x] Props有明确的类型定义
- [x] 禁止使用`any`类型
- [x] 复杂逻辑抽离为自定义Hook
- [x] 样式使用Tailwind类名
- [x] 图标统一使用lucide-react
- [x] 颜色使用CSS变量

---

## 模块1-N接入检查清单

在开发模块1-N前，按以下清单进行检查：

### 1. 环境检查

- [ ] 已克隆模块0代码库
- [ ] 已执行 `npm install` 安装依赖
- [ ] 项目能正常启动（`npm run dev`）
- [ ] 能访问 `http://localhost:3000/dashboard`

### 2. 契约文档阅读

- [ ] 已阅读 `src/lib/CONTRACT.ts`
- [ ] 已阅读 `ARCHITECTURE.md`
- [ ] 已阅读 `COMPONENT_CATALOG.md`
- [ ] 已阅读 `DEPENDENCY_GRAPH.md`
- [ ] 已了解哪些可以依赖，哪些是禁止的

### 3. 创建新模块页面

创建文件 `src/app/your-module/page.tsx`：

```tsx
"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/business/PageHeader";

export default function YourModulePage() {
  return (
    <MainLayout>
      <PageHeader
        title="模块标题"
        description="模块描述"
      />
      {/* 模块内容 */}
    </MainLayout>
  );
}
```

检查项：
- [ ] 文件路径符合规范（`src/app/{module-name}/page.tsx`）
- [ ] 使用 `"use client"` 指令
- [ ] 导入 `MainLayout` 作为页面外层
- [ ] 使用 `PageHeader` 作为页面标题栏
- [ ] 组件使用默认导出（`export default`）

### 4. 导入规范检查

#### 4.1 类型导入

```typescript
// ✅ 正确方式
import type { Station, Alert } from "@/types";

// ❌ 错误方式
import type { Station } from "../types";
import type { Station } from "../../types";
```

- [ ] 所有类型从 `@/types` 导入
- [ ] 没有使用相对路径导入类型

#### 4.2 组件导入

```typescript
// ✅ 正确方式
import { StatCard, StatusTag } from "@/components/business";
import { MainLayout } from "@/components/layout/MainLayout";

// ❌ 错误方式
import { StatCard } from "../../../components/business/StatCard";
```

- [ ] 业务组件从 `@/components/business` 导入
- [ ] 布局组件从 `@/components/layout` 导入
- [ ] 没有使用相对路径超过2层

#### 4.3 Hooks导入

```typescript
// ✅ 正确方式
import { useTheme, useMockData } from "@/hooks";

// ❌ 错误方式
import { useTheme } from "../hooks/useTheme";
```

- [ ] Hooks 从 `@/hooks` 导入

#### 4.4 工具函数导入

```typescript
// ✅ 正确方式
import { cn, formatNumber } from "@/lib/utils";
import { STATION_STATUS_CONFIG } from "@/lib/constants";

// ❌ 错误方式
import { cn } from "../../lib/utils";
```

- [ ] 工具函数从 `@/lib/utils` 导入
- [ ] 常量从 `@/lib/constants` 导入

#### 4.5 Store导入

```typescript
// ✅ 正确方式
import { useGlobalStore, useMockDataStore } from "@/store";

// ❌ 错误方式
import { useGlobalStore } from "../../store";
```

- [ ] Store 从 `@/store` 导入

### 5. 状态使用规范

#### 5.1 读取全局状态

```typescript
// ✅ 正确方式
const selectedStationId = useGlobalStore((state) => state.selectedStationId);
const stations = useMockDataStore((state) => state.stations);

// ❌ 错误方式 - 不要解构整个store
const { selectedStationId, setSelectedStationId } = useGlobalStore();
```

- [ ] 使用 selector 函数读取特定状态
- [ ] 避免订阅不必要的重渲染

#### 5.2 修改全局状态

```typescript
// ✅ 正确方式
const setSelectedStationId = useGlobalStore((state) => state.setSelectedStationId);
setSelectedStationId(stationId);

// ❌ 错误方式 - 不要在组件内直接修改
useGlobalStore.getState().selectedStationId = stationId;
```

- [ ] 使用 Store 提供的方法修改状态
- [ ] 不要直接修改状态

### 6. 组件使用规范

#### 6.1 StatCard使用

```tsx
<StatCard
  title="今日处理量"
  value={128.5}
  unit="吨"
  trend={12.5}
  trendLabel="较昨日"
  icon={TrendingUp}
  color="blue"
/>
```

- [ ] 所有必填Props都有值
- [ ] icon使用lucide-react的图标
- [ ] color使用规定的颜色值

#### 6.2 StatusTag使用

```tsx
<StatusTag status="online" size="md" showLabel />
```

- [ ] status使用规定的值
- [ ] size使用规定的值

#### 6.3 PageHeader使用

```tsx
<PageHeader
  title="页面标题"
  description="页面描述"
  actions={<Button>操作按钮</Button>}
/>
```

- [ ] title必填
- [ ] actions使用ReactNode

### 7. 代码规范检查

- [ ] 使用 TypeScript 严格类型
- [ ] 禁止使用 `any` 类型
- [ ] 组件使用函数式组件
- [ ] Props 有明确的接口定义
- [ ] 复杂逻辑抽离为自定义 Hook
- [ ] 样式使用 Tailwind 类名
- [ ] 图标使用 lucide-react

### 8. 测试检查

- [ ] 页面能正常渲染
- [ ] 组件能正常显示
- [ ] 路由能正常访问
- [ ] 控制台无报错
- [ ] TypeScript类型检查通过

---

## 集成测试检查清单

在模块集成时，按以下清单进行检查：

### 1. 路由集成

- [ ] 所有模块路由能正常访问
- [ ] 侧边栏导航能正常跳转
- [ ] 面包屑显示正确
- [ ] 页面标题显示正确

### 2. 状态集成

- [ ] 选中站点能在各模块间同步
- [ ] 时间范围能在各模块间同步
- [ ] 主题切换能影响所有模块
- [ ] 告警数据能实时更新

### 3. 组件集成

- [ ] MainLayout 包裹所有页面
- [ ] PageHeader 显示正确
- [ ] StatCard 显示正确
- [ ] StatusTag 显示正确

### 4. 样式集成

- [ ] 主题切换能影响所有模块
- [ ] 深色模式下所有组件显示正常
- [ ] 浅色模式下所有组件显示正常
- [ ] 移动端布局正常

### 5. 性能检查

- [ ] 页面加载时间 < 3s
- [ ] 组件渲染流畅
- [ ] 状态更新不引起不必要的重渲染

---

## 发布前检查清单

在发布前，按以下清单进行最终检查：

### 1. 功能完整性

- [ ] 所有功能已完成
- [ ] 所有页面可访问
- [ ] 所有组件正常工作
- [ ] 所有状态正常同步

### 2. 代码质量

- [ ] TypeScript类型检查通过
- [ ] ESLint检查通过
- [ ] 无 console.log 调试代码
- [ ] 无未使用的导入

### 3. 文档完整性

- [ ] 契约文档已更新
- [ ] 架构文档已更新
- [ ] 组件手册已更新
- [ ] 依赖图已更新

### 4. 测试覆盖

- [ ] 所有关键路径已测试
- [ ] 所有边界情况已处理
- [ ] 无已知Bug

### 5. 发布准备

- [ ] 版本号已更新
- [ ] CHANGELOG已更新
- [ ] README已更新
- [ ] 构建成功

---

**维护者**: 模块0团队  
**最后更新**: 2026-03-02
