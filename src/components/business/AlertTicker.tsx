/**
 * 告警滚动条组件
 * 显示最新告警，支持暂停滚动（鼠标悬停）
 */

"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, Bell, ChevronRight } from "lucide-react";
import { cn, formatDateTime } from "@/lib/utils";
import { useMockDataStore } from "@/store";
import { ALERT_LEVEL_CONFIG } from "@/lib/constants";

export interface AlertTickerProps {
  className?: string;
  maxAlerts?: number;
}

/**
 * 告警滚动条组件
 */
export function AlertTicker({ className, maxAlerts = 5 }: AlertTickerProps) {
  const [isPaused, setIsPaused] = React.useState(false);
  const alerts = useMockDataStore((state) =>
    state.alerts.slice(0, maxAlerts)
  );

  if (alerts.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative h-10 overflow-hidden rounded-lg bg-amber-500/10 border border-amber-500/20",
        className
      )}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* 左侧图标 */}
      <div className="absolute left-0 top-0 z-10 flex h-full items-center gap-2 bg-gradient-to-r from-amber-50 via-amber-50 to-transparent px-3 dark:from-amber-950 dark:via-amber-950">
        <Bell className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <span className="text-xs font-medium text-amber-700 dark:text-amber-300">
          最新告警
        </span>
      </div>

      {/* 滚动内容 */}
      <div className="flex h-full items-center overflow-hidden pl-24">
        <motion.div
          className="flex items-center gap-8 whitespace-nowrap"
          animate={{
            x: isPaused ? 0 : ["0%", "-50%"],
          }}
          transition={{
            x: {
              duration: 30,
              repeat: Infinity,
              ease: "linear",
            },
          }}
        >
          {/* 复制一份数据实现无缝滚动 */}
          {[...alerts, ...alerts].map((alert, index) => (
            <Link
              key={`${alert.id}-${index}`}
              href="/alerts"
              className="group flex items-center gap-2 text-sm"
            >
              <span
                className={cn(
                  "flex h-2 w-2 rounded-full",
                  ALERT_LEVEL_CONFIG[alert.level].color === "red"
                    ? "bg-red-500"
                    : ALERT_LEVEL_CONFIG[alert.level].color === "amber"
                    ? "bg-amber-500"
                    : "bg-blue-500"
                )}
              />
              <span className="text-muted-foreground">
                {formatDateTime(alert.timestamp, "time")}
              </span>
              <span className="font-medium text-foreground group-hover:text-amber-600 dark:group-hover:text-amber-400">
                {alert.stationName}
              </span>
              <span className="text-muted-foreground">{alert.message}</span>
              <ChevronRight className="h-3 w-3 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </motion.div>
      </div>

      {/* 右侧渐变遮罩 */}
      <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-background to-transparent" />
    </div>
  );
}

export default AlertTicker;
