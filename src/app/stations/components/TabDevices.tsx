/**
 * @file app/stations/components/TabDevices.tsx
 * @description 设备档案标签页
 * @module 模块2:站点管理
 */

import type { Station } from "../types/station";
import { Device } from "@/types";

interface TabDevicesProps {
  readonly station: Station;
}

export function TabDevices({ station }: TabDevicesProps) {
  // 模拟设备数据
  const devices: Device[] = [];

  return (
    <div className="space-y-4">
      {devices.length === 0 ? (
        <div className="text-center text-slate-500">暂无设备记录</div>
      ) : (
        <ul className="space-y-2">
          {devices.map((d) => (
            <li key={d.id} className="text-sm text-slate-300">
              {d.name} ({d.status})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TabDevices;