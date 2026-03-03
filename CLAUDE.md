# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**智环卫士 (Smart Waste Guardian)** - A Next.js TypeScript application for smart waste station management and operations. The platform includes 8 core business modules built on a shared foundational framework (Module 0).

**Technology Stack:**
- Next.js 14.1.0 (App Router)
- TypeScript 5.9.3
- React 18.2.0
- Tailwind CSS 3.4.1
- Zustand 4.5.2 (State Management)
- Recharts 2.12.2 (Data Visualization)
- Radix UI Components
- Lucide React Icons

## Common Commands

```bash
# Development
npm run dev              # Start development server on http://localhost:3000

# Build & Production
npm run build            # Build production bundle
npm start               # Start production server

# Code Quality
npm run lint            # Run ESLint checks
npm run type-check      # Run TypeScript type checking (required before commits)
```

## Module Architecture

### Module 0: Foundation (Frozen - Read Only)
Provides all shared infrastructure, components, and tools. **Do not modify files in this module**.

**Location:** `src/` (root level directories)
**Key Files:**
- `src/components/layout/*` - Layout system (MainLayout, Sidebar, Header)
- `src/components/business/*` - Business components (StatCard, StatusTag, PageHeader, etc.)
- `src/lib/CONTRACT.ts` - Frozen interface contracts (DO NOT MODIFY)
- `src/store/index.ts` - Zustand state management
- `src/lib/mockGenerators.ts` - Mock data generators
- `src/types/index.ts` - TypeScript type definitions

### Business Modules (1-8)
Each module is self-contained in `src/app/{module-name}/`:

1. **监管驾驶舱 (Dashboard)** - `/dashboard` - Real-time KPIs and monitoring
2. **站点管理 (Stations)** - `/stations` - Site management with GIS map
3. **设备监控 (Monitor)** - `/monitor` - Equipment monitoring and control
4. **调度中心 (Dispatch)** - `/dispatch` - Task scheduling and vehicle management
5. **AI识别中心 (AI Center)** - `/ai-center` - Image recognition and analysis
6. **告警中心 (Alerts)** - `/alerts` - Alert management and processing
7. **数据分析 (Analytics)** - `/analytics` - Reports and trend analysis
8. **系统设置 (Settings)** - `/settings` - System configuration

## Development Conventions

### Import Rules
Always use absolute imports from module 0:

```typescript
// ✅ CORRECT - Import from module 0 exports
import { StatCard, StatusTag } from "@/components/business";
import { MainLayout } from "@/components/layout/MainLayout";
import { useTheme, useMockData } from "@/hooks";
import type { Station, Alert } from "@/types";
import { cn, formatNumber } from "@/lib/utils";
import { useGlobalStore } from "@/store";

// ❌ WRONG - Do not use relative paths for module 0 resources
import { StatCard } from "../../../components/business/StatCard";
```

### State Management
Use Zustand stores with selector pattern:

```typescript
// ✅ CORRECT - Use selectors to avoid rerenders
const selectedStationId = useGlobalStore((state) => state.selectedStationId);
const setSelectedStationId = useGlobalStore((state) => state.setSelectedStationId);

// ❌ WRONG - Do not destructure entire store
const { selectedStationId, setSelectedStationId } = useGlobalStore();
```

### Component Structure
All business module pages must follow this structure:

```tsx
"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/business/PageHeader";

export default function YourModulePage() {
  return (
    <MainLayout>
      <PageHeader
        title="Page Title"
        description="Page description"
      />
      {/* Your module content */}
    </MainLayout>
  );
}
```

### TypeScript Strict Mode
- **No `any` types** - Always use specific types
- Props must have explicit interfaces with JSDoc comments
- Use function components with explicit return types

### Styling
- Use Tailwind CSS classes exclusively
- No inline styles
- Use CSS variables for theme colors (defined in `styles/theme.css`)
- Icons must use `lucide-react`

## Critical Files Reference

### State Stores (`src/store/index.ts`)
- `useThemeStore` - Theme management (light/dark/system)
- `useSidebarStore` - Sidebar state (collapsed, mobile open)
- `useMockDataStore` - Mock data for all modules
- `useGlobalStore` - Global app state (selectedStationId, timeRange)
- `useAlertStore` - Alert state management
- `useUserStore` - User authentication state

### Mock Data Hook (`src/hooks/useMockData.ts`)
Returns pre-generated mock data for development. In production, replace with API calls.

### Constants (`src/lib/constants.ts`)
- `SIDEBAR_CONFIG` - Sidebar dimensions
- `APP_INFO` - Application metadata
- `NAVIGATION_MENU` - Main navigation structure
- `STATION_STATUS_CONFIG` - Status color mappings
- `ALERT_LEVEL_CONFIG` - Alert priority levels

### Routes (`src/lib/routes.ts`)
Centralized route definitions and utility functions for navigation.

## Module Development Workflow

1. **Check Module 0 First**: Always verify if functionality exists in Module 0 before creating new components
2. **Read CONTRACT.ts**: Understand available interfaces and frozen contracts
3. **Use Provided Components**: Use business components from Module 0 (StatCard, StatusTag, etc.)
4. **Access Global State**: Use Zustand stores for shared state
5. **Generate Mock Data**: Use mock generators for development
6. **Follow Import Rules**: Use absolute imports only

## Testing Guidelines

- Run `npm run type-check` before committing changes
- Run `npm run lint` to ensure code quality
- Verify no console errors or warnings
- Test responsive layout on mobile viewport
- Verify theme switching works correctly

## Critical Rules

🚫 **NEVER modify files in Module 0** without coordination
🚫 **NEVER bypass CONTRACT.ts** - it's the single source of truth
🚫 **NEVER use relative imports** for Module 0 resources
🚫 **NEVER use `any` type** in TypeScript
🚫 **NEVER add business logic** to Module 0 components

✅ **Always use provided utilities** from `@/lib/utils`
✅ **Always use provided hooks** from `@/hooks`
✅ **Always use CSS variables** for colors
✅ **Always add JSDoc** to component props
✅ **Always handle loading states** with mock data

## Documentation Files

- `ARCHITECTURE.md` - System architecture and module relationships
- `COMPONENT_CATALOG.md` - Complete component usage guide
- `CHECKLIST.md` - Development and deployment checklists
- `DEPENDENCY_GRAPH.md` - Module dependencies and constraints
- `MODULE0_COMPLETION_REPORT.md` - Module 0 completion details

## Getting Help

If you need to understand Module 0 capabilities:
1. Read `src/lib/CONTRACT.ts` for all available interfaces
2. Check `COMPONENT_CATALOG.md` for component usage examples
3. Review existing module implementations in `src/app/`
