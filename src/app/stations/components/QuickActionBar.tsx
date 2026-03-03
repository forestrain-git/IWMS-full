/**
 * @file app/stations/components/QuickActionBar.tsx
 * @description 站点管理悬浮快捷操作栏
 * @module 模块2:站点管理
 */

"use client";

import { useCallback } from "react";
import { MapPin, Lock, Phone, Navigation, Clipboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface QuickActionBarProps {
  readonly stationId?: string | null;
}

export function QuickActionBar({ stationId }: QuickActionBarProps) {
  const handleClick = useCallback((action: string) => {
    alert(`快捷操作: ${action} (stationId=${stationId || "-"})`);
  }, [stationId]);

  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-30">
      <Button
        size="icon"
        variant="secondary"
        onClick={() => handleClick("预约")}
      >
        <Clipboard className="h-5 w-5" />
      </Button>
      <Button
        size="icon"
        variant="secondary"
        onClick={() => handleClick("开门")}
      >
        <Lock className="h-5 w-5" />
      </Button>
      <Button
        size="icon"
        variant="secondary"
        onClick={() => handleClick("对讲")}
      >
        <Phone className="h-5 w-5" />
      </Button>
      <Button
        size="icon"
        variant="secondary"
        onClick={() => handleClick("导航")}
      >
        <Navigation className="h-5 w-5" />
      </Button>
    </div>
  );
}

export default QuickActionBar;