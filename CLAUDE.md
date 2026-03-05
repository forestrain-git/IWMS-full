# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**智环卫士 (Smart Waste Guardian)** - A Next.js TypeScript application for smart waste station management and operations. Built on a modular architecture with 8 business modules sharing a foundational framework (Module 0).

**Technology Stack:**
- Next.js 14.1.0 (App Router)
- TypeScript 5.9.3
- React 18.2.0
- Tailwind CSS 3.4.1
- Zustand 4.5.2 (State Management)
- Recharts 2.12.2 (Data Visualization)
- Radix UI Components
- Lucide React Icons
- Three.js + React Three Fiber (3D Rendering)
- Mapbox GL (GIS)

## Quick Start Commands

```bash
# Install dependencies
npm install

# Development (runs on http://localhost:3000)
npm run dev

# Build & Production
npm run build            # Build production bundle
npm start               # Start production server

# Code Quality
npm run lint            # Run ESLint checks
npm run type-check      # Run TypeScript type checking (required before commits)
```

## Architecture Overview

### Module 0: Foundation (Read-Only Core)
Located at `src/` root level directories. Provides shared infrastructure that all business modules depend on. **Critical: Do not modify without coordination.**

**Key Exports:**
- `src/components/layout/*` - Layout system (MainLayout, Sidebar, Header)
- `src/components/business/*` - Business components (StatCard, StatusTag, PageHeader, etc.)
- `src/lib/CONTRACT.ts` - Frozen interface contracts between modules
- `src/store/index.ts` - Zustand state management (theme, global, mock data)
- `src/lib/mockGenerators.ts` - Mock data generators for development
- `src/types/index.ts` - TypeScript type definitions
- `src/lib/utils.ts` - Utility functions (cn, formatters, etc.)
- `src/lib/constants.ts` - App constants and configurations
- `src/lib/routes.ts` - Centralized route management

### Business Modules 1-8
Each module is self-contained in `src/app/{module-name}/`:

1. **Dashboard** (`/dashboard`) - Real-time KPI monitoring and data overview
2. **Stations** (`/stations`) - Site management with GIS map integration
3. **Monitor** (`/monitor`) - Equipment monitoring with 3D digital twin view
4. **Dispatch** (`/dispatch`) - Task scheduling, vehicle management, route optimization
5. **AI Center** (`/ai-center`) - Image recognition and behavioral analysis
6. **Alerts** (`/alerts`) - Alert management and processing
7. **Analytics** (`/analytics`) - Reports and trend analysis
8. **Settings** (`/settings`) - System configuration and user management

## Development Conventions

### Absolute Imports Only
All imports from Module 0 must use absolute paths with `@/` alias:

```typescript
// ✅ CORRECT
import { StatCard, StatusTag } from "@/components/business";
import { useTheme, useMockData } from "@/hooks";
import type { Station, Alert } from "@/types";
import { cn, formatNumber } from "@/lib/utils";
import { useGlobalStore } from "@/store";

// ❌ WRONG - Never use relative paths for Module 0
import { StatCard } from "../../../components/business/StatCard";
```

### Store Usage Pattern
Always use selector pattern to avoid unnecessary re-renders:

```typescript
// ✅ CORRECT - Use selectors
const selectedStationId = useGlobalStore(state => state.selectedStationId);
const setSelectedStationId = useGlobalStore(state => state.setSelectedStationId);

// ❌ WRONG - Destructuring causes rerenders
const { selectedStationId, setSelectedStationId } = useGlobalStore();
```

### Component Structure
All business module pages must follow this exact structure:

```tsx
"use client";

import { MainLayout } from "@/components/layout/MainLayout";
import { PageHeader } from "@/components/business/PageHeader";

export default function ModulePage() {
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

### TypeScript Strictness
- **No `any` types** - Always use specific types or `unknown`
- All component props must have explicit interfaces with JSDoc comments
- Function components must have explicit return types

### Styling Guidelines
- Use Tailwind CSS classes exclusively (no inline styles)
- Theme colors come from CSS variables defined in `styles/theme.css`
- Icons must use `lucide-react` package
- Use `cn()` utility for conditional class names

## Key Implementation Patterns

### Mock Data System
The app uses mock data for development with realistic patterns:
- **Location**: All mock stations are in Chengdu Longquanyi District (104.15-104.35, 30.45-30.65)
- **Status Probabilities**: online(70%), warning(15%), danger(5%), offline(8%), maintenance(2%)
- **Time Patterns**: Peak hours simulated (7-9, 18-20), realistic daily curves for KPIs
- **Auto-refresh**: KPI data updates every 30s, alerts check every 60s

### 3D/2D Data Mapping
For monitor module's digital twin:
- Each device has 3D coordinates relative to its station
- Use `position: {x, y, z}` and `rotation: {x, y, z}` from Device type
- Geometry: devices positioned in circle around station (radius 2-6 units)

### GIS Integration
Stations module uses Mapbox GL for maps:
- Station coordinates in Chinese GCJ-02 coordinate system
- Map centered on Chengdu Longquanyi
- Cluster markers for dense areas
- Popups with station details

## File Organization

```
src/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Main layout wrapper
│   ├── page.tsx             # Landing page
│   ├── dashboard/           # Module 1: Dashboard
│   ├── stations/            # Module 2: Stations
│   ├── monitor/             # Module 3: Monitor
│   ├── dispatch/            # Module 4: Dispatch
│   ├── ai-center/           # Module 5: AI Center
│   ├── alerts/              # Module 6: Alerts
│   ├── analytics/           # Module 7: Analytics
│   └── settings/            # Module 8: Settings
├── components/
│   ├── ui/                  # shadcn UI components
│   ├── business/            # Module 0 business components
│   └── layout/              # Module 0 layout components
├── hooks/                   # Custom React hooks
├── lib/                     # Utilities
│   ├── utils.ts            # General utilities
│   ├── constants.ts        # App constants
│   ├── mockGenerators.ts   # Mock data
│   ├── CONTRACT.ts         # Interface contracts
│   └── routes.ts           # Route definitions
├── store/                   # Zustand state management
├── types/                   # TypeScript types
└── styles/                  # Global styles and theme
```

## Critical Rules

🚫 **NEVER modify Module 0 files** without coordination:
- `src/types/index.ts`
- `src/store/index.ts`
- `src/lib/CONTRACT.ts`
- `src/components/business/*.tsx`
- `src/components/layout/*.tsx`
- `src/hooks/*.ts`

🚫 **NEVER bypass CONTRACT.ts** - it's the single source of truth for inter-module contracts

🚫 **NEVER use relative imports** (../../) for Module 0 resources

🚫 **NEVER add business logic** to Module 0 components - they should be presentation-only

✅ **Always use CSS variables** for colors from `styles/theme.css`

✅ **Always handle loading states** when using mock data

✅ **Always add JSDoc** comments to component props and hooks

## Testing Checklist Before Committing

- [ ] Run `npm run type-check` - no TypeScript errors
- [ ] Run `npm run lint` - no ESLint warnings
- [ ] Verify responsive layout on mobile viewport
- [ ] Test theme switching (light/dark modes)
- [ ] Check no console errors or warnings
- [ ] Verify all absolute imports use `@/` alias
- [ ] Confirm module follows standard page layout

## Additional Documentation

- `ARCHITECTURE.md` - System architecture and module relationships
- `COMPONENT_CATALOG.md` - Complete usage guide for all business components
- `DEPENDENCY_GRAPH.md` - Module dependencies and constraints
- `MODULE0_COMPLETION_REPORT.md` - Module 0 completion details
- `CHECKLIST.md` - Development and deployment checklists
