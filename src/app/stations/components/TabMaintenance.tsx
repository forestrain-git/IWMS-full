/**
 * @file app/stations/components/TabMaintenance.tsx
 * @description 巡检与维修标签页
 * @module 模块2:站点管理
 */

import type { Station } from "../types/station";

interface TabMaintenanceProps {
  readonly station: Station;
}

export function TabMaintenance({ station }: TabMaintenanceProps) {
  return (
    <div className="text-center text-slate-500">暂无巡检/维修记录</div>
  );
}

export default TabMaintenance;