# 依赖关系图

> 模块0与模块1-N的依赖关系说明 | 版本: 1.0.0

## 1. 模块0内部依赖关系

```
┌─────────────────────────────────────────────────────────────────┐
│                          模块0: 基础框架                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────┐                                                │
│  │   types     │ ◄───────────────────────────────────────┐      │
│  └──────┬──────┘                                       │      │
│         │                                              │      │
│         ▼                                              │      │
│  ┌─────────────┐     ┌─────────────┐     ┌───────────┐ │      │
│  │   store     │────►│  constants  │────►│   utils   │ │      │
│  └──────┬──────┘     └─────────────┘     └─────┬─────┘ │      │
│         │                                        │      │      │
│         │         ┌─────────────┐               │      │      │
│         └────────►│mockGenerators│◄─────────────┘      │      │
│                   └──────┬──────┘                      │      │
│                          │                             │      │
│                          ▼                             │      │
│  ┌─────────────┐     ┌─────────────┐     ┌───────────┐ │      │
│  │   hooks     │◄────┤  business   │     │   layout  │ │      │
│  │  useTheme   │     │ components  │────►│ components│ │      │
│  │ useMockData │     │ StatCard    │     │MainLayout │ │      │
│  └─────────────┘     │ StatusTag   │     └───────────┘ │      │
│                      └─────────────┘                   │      │
│                                │                       │      │
│                                └───────────────────────┘      │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### 依赖说明

| 源文件 | 依赖文件 | 依赖类型 |
|-------|---------|---------|
| store/index.ts | types/index.ts | 类型导入 |
| store/index.ts | lib/mockGenerators.ts | 函数导入 |
| store/index.ts | lib/constants.ts | 常量导入 |
| lib/mockGenerators.ts | types/index.ts | 类型导入 |
| lib/mockGenerators.ts | lib/utils.ts | 函数导入 |
| lib/constants.ts | types/index.ts | 类型导入 |
| components/business/*.tsx | types/index.ts | 类型导入 |
| components/business/*.tsx | lib/utils.ts | 函数导入 |
| components/layout/*.tsx | store/index.ts | Hook导入 |
| components/layout/*.tsx | lib/constants.ts | 常量导入 |
| hooks/*.ts | store/index.ts | Store导入 |
| hooks/*.ts | lib/utils.ts | 函数导入 |

## 2. 模块1-N对模块0的依赖点

### 2.1 类型依赖 (types/index.ts)

所有业务模块必须使用的类型：

```typescript
// ✅ 正确导入方式
import type { Station, Alert, KPIData } from '@/types';

// ❌ 错误导入方式
import type { Station } from '../types'; // 相对路径
```

| 类型 | 模块1 | 模块2 | 模块3 | 模块4 | 模块5 | 模块6 | 模块7 | 模块8 |
|-----|-------|-------|-------|-------|-------|-------|-------|-------|
| Station | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Alert | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| KPIData | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| Device | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| DispatchTask | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| AIRecognition | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ✅ | ❌ |
| UserInfo | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |
| RouteConfig | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

### 2.2 状态依赖 (store/index.ts)

所有业务模块可以使用的全局状态：

```typescript
// ✅ 正确导入方式
import { useGlobalStore, useMockDataStore } from '@/store';

// 读取状态
const { stations, selectedStationId } = useGlobalStore();

// 修改状态
const setSelectedStationId = useGlobalStore((state) => state.setSelectedStationId);
```

| Store | 状态/方法 | 模块1 | 模块2 | 模块3 | 模块4 | 模块5 | 模块6 | 模块7 | 模块8 |
|------|----------|-------|-------|-------|-------|-------|-------|-------|-------|
| useGlobalStore | currentPageTitle | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| useGlobalStore | setCurrentPageTitle | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| useGlobalStore | selectedStationId | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| useGlobalStore | setSelectedStationId | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| useGlobalStore | globalTimeRange | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | ❌ |
| useGlobalStore | setGlobalTimeRange | ✅ | ❌ | ❌ | ✅ | ❌ | ✅ | ✅ | ❌ |
| useMockDataStore | stations | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| useMockDataStore | alerts | ✅ | ❌ | ❌ | ❌ | ✅ | ✅ | ✅ | ❌ |
| useMockDataStore | devices | ❌ | ❌ | ✅ | ❌ | ❌ | ❌ | ✅ | ❌ |
| useMockDataStore | tasks | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ | ✅ | ❌ |
| useMockDataStore | kpiData | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| useMockDataStore | refreshData | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |

### 2.3 组件依赖 (components/business/*.tsx)

业务组件使用规范：

```tsx
// ✅ 正确导入方式
import { StatCard, StatusTag, PageHeader } from '@/components/business';
import { MainLayout } from '@/components/layout/MainLayout';

// ❌ 错误导入方式
import { StatCard } from '../../../components/business/StatCard';
```

| 组件 | 模块1 | 模块2 | 模块3 | 模块4 | 模块5 | 模块6 | 模块7 | 模块8 |
|-----|-------|-------|-------|-------|-------|-------|-------|-------|
| MainLayout | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| PageHeader | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| StatCard | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| StatusTag | ✅ | ✅ | ✅ | ✅ | ❌ | ✅ | ❌ | ❌ |
| TrendChart | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ |
| StationSelector | ✅ | ✅ | ❌ | ✅ | ❌ | ✅ | ❌ | ❌ |
| AlertTicker | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 2.4 Hooks依赖 (hooks/*.ts)

```typescript
// ✅ 正确导入方式
import { useTheme, useMockData } from '@/hooks';

// ❌ 错误导入方式
import { useTheme } from '../hooks/useTheme';
```

| Hook | 模块1 | 模块2 | 模块3 | 模块4 | 模块5 | 模块6 | 模块7 | 模块8 |
|-----|-------|-------|-------|-------|-------|-------|-------|-------|
| useTheme | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| useMockData | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| useLocalStorage | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ✅ |

### 2.5 工具函数依赖 (lib/*.ts)

```typescript
// ✅ 正确导入方式
import { cn, formatNumber, generateId } from '@/lib/utils';
import { STATION_STATUS_CONFIG } from '@/lib/constants';
import { generateStations } from '@/lib/mockGenerators';
```

| 工具/常量 | 模块1 | 模块2 | 模块3 | 模块4 | 模块5 | 模块6 | 模块7 | 模块8 |
|----------|-------|-------|-------|-------|-------|-------|-------|-------|
| cn | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| formatNumber | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| formatDateTime | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ |
| generateId | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| STATION_STATUS_CONFIG | ✅ | ✅ | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| ALERT_LEVEL_CONFIG | ✅ | ❌ | ❌ | ❌ | ❌ | ✅ | ❌ | ❌ |
| SIDEBAR_CONFIG | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| APP_INFO | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| generateStations | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| generateAlerts | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |

### 2.6 路由配置依赖 (lib/routes.ts)

```typescript
// ✅ 正确导入方式
import { getRouteByPath, getBreadcrumb } from '@/lib/routes';
```

| 导出 | 模块1 | 模块2 | 模块3 | 模块4 | 模块5 | 模块6 | 模块7 | 模块8 |
|-----|-------|-------|-------|-------|-------|-------|-------|-------|
| ALL_ROUTES | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| SIDEBAR_ROUTES | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| getRouteByPath | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| getBreadcrumb | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |
| getRouteLabel | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ |

## 3. 禁止事项

### 3.1 循环依赖

```
❌ 禁止以下循环依赖模式：

模块A ──► 模块B
   ▲       │
   └───────┘

具体场景：
- 模块1不能依赖模块2，模块2也不能依赖模块1
- 业务模块不能修改模块0的任何文件
- 业务模块不能绕过模块0直接引用基础库
```

### 3.2 跨模块直接调用

```typescript
// ❌ 禁止：直接从其他业务模块导入
import { SomeComponent } from '@/app/dashboard/components/SomeComponent';
import { useDashboardHook } from '@/app/dashboard/hooks/useDashboardHook';

// ✅ 正确：只从模块0导入
import { StatCard } from '@/components/business';
import { useMockData } from '@/hooks';
```

### 3.3 修改模块0文件

```
❌ 禁止以下操作：
- 修改 types/index.ts
- 修改 store/index.ts
- 修改 lib/CONTRACT.ts
- 修改 components/business/*.tsx
- 修改 hooks/*.ts

✅ 如果需要变更，必须：
1. 在 CONTRACT.ts 中标记变更
2. 更新 ARCHITECTURE.md
3. 通知所有模块负责人
4. 协调版本升级
```

### 3.4 使用未导出的内部实现

```typescript
// ❌ 禁止：使用内部实现细节
import { internalHelper } from '@/lib/utils';
import { SomeInternalType } from '@/types/internal';

// ✅ 正确：只使用公开导出
import { cn, formatNumber } from '@/lib/utils';
import type { Station, Alert } from '@/types';
```

## 4. 依赖检查清单

在开发新模块前，请确认：

- [ ] 所有类型导入使用 `@/types`
- [ ] 所有组件导入使用 `@/components/business` 或 `@/components/layout`
- [ ] 所有 Hooks 导入使用 `@/hooks`
- [ ] 所有工具导入使用 `@/lib/utils` 或 `@/lib/constants`
- [ ] 所有 Store 导入使用 `@/store`
- [ ] 没有相对路径超过2层的导入
- [ ] 没有从其他业务模块导入
- [ ] 没有修改模块0的任何文件

## 5. 版本兼容性

| 模块0版本 | 兼容的模块1-N版本 | 说明 |
|----------|------------------|------|
| 1.0.0 | 1.0.x | 初始版本，所有模块使用相同的契约版本 |

---

**注意**: 本文档由模块0生成，模块1-N只读不写。如需变更，请联系模块0维护者。
