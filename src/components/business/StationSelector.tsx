/**
 * 站点选择器组件
 * 支持搜索过滤，显示站点状态图标
 */

"use client";

import * as React from "react";
import { MapPin, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Station } from "@/types";
import { useMockDataStore } from "@/store";
import { STATION_STATUS_CONFIG } from "@/lib/constants";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface StationSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  showAllOption?: boolean;
  className?: string;
}

/**
 * 站点选择器组件
 */
export function StationSelector({
  value,
  onChange,
  placeholder = "选择站点",
  showAllOption = true,
  className,
}: StationSelectorProps) {
  const stations = useMockDataStore((state) => state.stations);

  /**
   * 获取站点状态颜色
   */
  const getStationDotColor = (status: Station["status"]) => {
    return STATION_STATUS_CONFIG[status].dotColor;
  };

  /**
   * 获取选中的站点名称
   */
  const getSelectedStationName = () => {
    if (value === "all" || !value) return "全部站点";
    const station = stations.find((s) => s.id === value);
    return station?.name || "";
  };

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn("w-[200px]", className)}>
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <SelectValue placeholder={placeholder}>
            {getSelectedStationName()}
          </SelectValue>
        </div>
      </SelectTrigger>
      <SelectContent className="max-h-80">
        {showAllOption && (
          <SelectItem value="all">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-slate-400" />
              <span>全部站点</span>
            </div>
          </SelectItem>
        )}
        {stations.map((station) => (
          <SelectItem key={station.id} value={station.id}>
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  "h-2 w-2 rounded-full",
                  getStationDotColor(station.status)
                )}
              />
              <span className="flex-1 truncate">{station.name}</span>
              <span className="text-xs text-muted-foreground">
                {station.capacity}%
              </span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default StationSelector;
