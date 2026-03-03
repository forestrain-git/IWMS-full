# 组件使用手册

> 模块0提供的业务组件目录 | 版本: 1.0.0

## 目录

- [布局组件](#布局组件)
- [数据展示组件](#数据展示组件)
- [表单组件](#表单组件)
- [反馈组件](#反馈组件)

---

## 布局组件

### MainLayout

主布局组件，提供统一的页面结构。

**导入路径**: `@/components/layout/MainLayout`

**Props**

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|-----|------|-----|-------|------|
| children | ReactNode | ✅ | - | 页面内容 |
| className | string | ❌ | - | 自定义类名 |

**使用示例**

```tsx
import { MainLayout } from '@/components/layout/MainLayout';

export default function YourPage() {
  return (
    <MainLayout>
      <div>Your page content</div>
    </MainLayout>
  );
}
```

**注意事项**
- 必须作为页面的最外层组件
- 自动处理侧边栏折叠和移动端适配
- 内置主题切换和全局状态初始化

---

### PageHeader

页面标题栏组件，包含标题、描述和面包屑。

**导入路径**: `@/components/business/PageHeader`

**Props**

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|-----|------|-----|-------|------|
| title | string | ✅ | - | 页面标题 |
| description | string | ❌ | - | 页面描述 |
| actions | ReactNode | ❌ | - | 右侧操作按钮区 |
| breadcrumb | Array<{label, href?}> | ❌ | - | 面包屑配置 |
| className | string | ❌ | - | 自定义类名 |

**使用示例**

```tsx
import { PageHeader } from '@/components/business/PageHeader';
import { Button } from '@/components/ui/button';

export default function YourPage() {
  return (
    <>
      <PageHeader
        title="站点管理"
        description="管理所有垃圾分类回收站点"
        actions={
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            新增站点
          </Button>
        }
        breadcrumb={[
          { label: '首页', href: '/dashboard' },
          { label: '站点管理' }
        ]}
      />
      {/* 页面内容 */}
    </>
  );
}
```

---

### ThemeToggle

主题切换按钮组件。

**导入路径**: `@/components/layout/ThemeToggle`

**Props**

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|-----|------|-----|-------|------|
| className | string | ❌ | - | 自定义类名 |
| variant | 'default' \| 'outline' \| 'ghost' | ❌ | 'ghost' | 按钮样式 |
| size | 'default' \| 'sm' \| 'lg' \| 'icon' | ❌ | 'icon' | 按钮尺寸 |

**使用示例**

```tsx
import { ThemeToggle } from '@/components/layout/ThemeToggle';

// 在Header中使用
<ThemeToggle />

// 自定义样式
<ThemeToggle variant="outline" size="sm" />
```

---

## 数据展示组件

### StatCard

数据指标卡片组件，用于展示关键业务指标。

**导入路径**: `@/components/business/StatCard`

**Props**

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|-----|------|-----|-------|------|
| title | string | ✅ | - | 卡片标题 |
| value | string \| number | ✅ | - | 数值 |
| unit | string | ❌ | - | 单位，如"吨"、"%" |
| trend | number | ❌ | - | 趋势百分比，正数上升，负数下降 |
| trendLabel | string | ❌ | - | 趋势描述，如"较昨日" |
| icon | LucideIcon | ✅ | - | 图标组件 |
| color | 'blue' \| 'green' \| 'amber' \| 'red' \| 'purple' | ✅ | - | 颜色主题 |
| loading | boolean | ❌ | false | 加载状态 |
| onClick | () => void | ❌ | - | 点击回调 |
| className | string | ❌ | - | 自定义类名 |

**使用示例**

```tsx
import { StatCard } from '@/components/business/StatCard';
import { TrendingUp } from 'lucide-react';

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

**注意事项**
- trend为正数时显示上升箭头和绿色
- trend为负数时显示下降箭头和红色
- loading为true时显示骨架屏

---

### StatusTag

状态标签组件，用于显示设备、站点的状态。

**导入路径**: `@/components/business/StatusTag`

**Props**

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|-----|------|-----|-------|------|
| status | 'online' \| 'offline' \| 'warning' \| 'danger' \| 'maintenance' | ✅ | - | 状态类型 |
| size | 'sm' \| 'md' \| 'lg' | ❌ | 'md' | 尺寸 |
| showLabel | boolean | ❌ | true | 是否显示文字 |
| pulse | boolean | ❌ | true | 是否显示动画效果 |
| className | string | ❌ | - | 自定义类名 |

**使用示例**

```tsx
import { StatusTag } from '@/components/business/StatusTag';

// 基本用法
<StatusTag status="online" />

// 小尺寸
<StatusTag status="warning" size="sm" />

// 仅显示圆点
<StatusTag status="danger" showLabel={false} />
```

**状态映射**

| 状态 | 显示文字 | 颜色 | 动画效果 |
|-----|---------|------|---------|
| online | 在线 | 绿色 | 无 |
| offline | 离线 | 灰色 | 无 |
| warning | 告警 | 黄色 | 闪烁 |
| danger | 紧急 | 红色 | 脉冲 |
| maintenance | 维护 | 蓝色 | 无 |

---

### TrendChart

迷你趋势图组件，使用 Recharts 绘制。

**导入路径**: `@/components/business/TrendChart`

**Props**

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|-----|------|-----|-------|------|
| data | TrendPoint[] | ✅ | - | 趋势数据 |
| trendType | 'positive' \| 'negative' \| 'neutral' | ❌ | 'neutral' | 趋势类型，影响颜色 |
| height | number | ❌ | 60 | 图表高度 |
| showTooltip | boolean | ❌ | false | 是否显示提示框 |
| showAxis | boolean | ❌ | false | 是否显示坐标轴 |
| className | string | ❌ | - | 自定义类名 |

**TrendPoint 数据结构**

```typescript
interface TrendPoint {
  timestamp: string;  // ISO时间字符串
  value: number;      // 数值
  label?: string;     // 显示标签
}
```

**使用示例**

```tsx
import { TrendChart } from '@/components/business/TrendChart';
import { generateTrendData } from '@/lib/mockGenerators';

const data = generateTrendData(24);

<TrendChart
  data={data}
  trendType="positive"
  height={100}
  showTooltip
/>
```

---

### AlertTicker

告警滚动条组件，显示最新告警信息。

**导入路径**: `@/components/business/AlertTicker`

**Props**

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|-----|------|-----|-------|------|
| className | string | ❌ | - | 自定义类名 |
| maxAlerts | number | ❌ | 5 | 最大显示告警数 |

**使用示例**

```tsx
import { AlertTicker } from '@/components/business/AlertTicker';

// 放在页面顶部
<AlertTicker maxAlerts={5} />
```

**注意事项**
- 自动从 useMockDataStore 获取告警数据
- 鼠标悬停时暂停滚动
- 点击跳转到告警中心

---

## 表单组件

### StationSelector

站点选择器组件。

**导入路径**: `@/components/business/StationSelector`

**Props**

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|-----|------|-----|-------|------|
| value | string | ❌ | - | 当前选中的站点ID |
| onChange | (value: string) => void | ❌ | - | 选择变更回调 |
| placeholder | string | ❌ | '选择站点' | 占位符文本 |
| showAllOption | boolean | ❌ | true | 是否显示"全部站点"选项 |
| className | string | ❌ | - | 自定义类名 |

**使用示例**

```tsx
import { StationSelector } from '@/components/business/StationSelector';

const [selectedId, setSelectedId] = useState('all');

<StationSelector
  value={selectedId}
  onChange={setSelectedId}
  showAllOption
/>
```

**注意事项**
- 自动从 useMockDataStore 获取站点列表
- 每个选项显示站点状态圆点
- 选择'all'表示全部站点

---

## 反馈组件

### 暂无

后续版本将添加 Toast、Modal、Drawer 等反馈组件。

---

## 常量引用

### 状态配置

```typescript
import { STATION_STATUS_CONFIG, ALERT_LEVEL_CONFIG } from '@/lib/constants';

// 站点状态配置
STATION_STATUS_CONFIG.online // { label: '在线', color: '...', bgColor: '...' }

// 告警等级配置
ALERT_LEVEL_CONFIG.critical // { label: '紧急', color: 'red', priority: 4 }
```

### 侧边栏配置

```typescript
import { SIDEBAR_CONFIG, APP_INFO, NAVIGATION_MENU } from '@/lib/constants';

SIDEBAR_CONFIG.width // 240
SIDEBAR_CONFIG.collapsedWidth // 64
APP_INFO.name // '智环卫士'
```

---

## 使用限制

### 禁止事项

1. ❌ 禁止修改业务组件的 Props 接口
2. ❌ 禁止在业务组件中添加业务逻辑
3. ❌ 禁止绕过模块0提供的工具函数
4. ❌ 禁止在组件中使用 `any` 类型

### 推荐做法

1. ✅ 使用模块0提供的所有工具函数
2. ✅ 通过 Props 传递数据和回调
3. ✅ 使用 TypeScript 严格类型
4. ✅ 遵循 React 最佳实践

---

## 更新日志

| 版本 | 日期 | 变更内容 |
|-----|------|---------|
| 1.0.0 | 2026-03-02 | 初始版本，包含所有基础组件 |
