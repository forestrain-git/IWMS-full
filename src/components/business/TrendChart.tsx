/**
 * 迷你趋势图组件
 * 使用Recharts的AreaChart展示数据趋势
 */

"use client";

import * as React from "react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import { TrendPoint, TrendType } from "@/types";

export interface TrendChartProps {
  data: TrendPoint[];
  trendType?: TrendType;
  height?: number;
  showTooltip?: boolean;
  showAxis?: boolean;
  className?: string;
}

/**
 * 趋势类型颜色配置
 */
const trendColorConfig: Record<TrendType, { stroke: string; fill: string }> = {
  positive: {
    stroke: "#10b981",
    fill: "url(#gradient-positive)",
  },
  negative: {
    stroke: "#ef4444",
    fill: "url(#gradient-negative)",
  },
  neutral: {
    stroke: "#0ea5e9",
    fill: "url(#gradient-neutral)",
  },
};

/**
 * 迷你趋势图组件
 */
export function TrendChart({
  data,
  trendType = "neutral",
  height = 60,
  showTooltip = false,
  showAxis = false,
  className,
}: TrendChartProps) {
  const colors = trendColorConfig[trendType];

  return (
    <div className={cn("w-full", className)} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          {/* 渐变定义 */}
          <defs>
            <linearGradient id="gradient-positive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradient-negative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="gradient-neutral" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* 坐标轴 */}
          {showAxis && (
            <>
              <XAxis
                dataKey="label"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "#94a3b8" }}
                dy={5}
              />
              <YAxis hide domain={["dataMin", "dataMax"]} />
            </>
          )}

          {/* 提示框 */}
          {showTooltip && (
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                border: "none",
                borderRadius: "6px",
                padding: "8px 12px",
                fontSize: "12px",
              }}
              itemStyle={{ color: "#fff" }}
              labelStyle={{ display: "none" }}
              formatter={(value: number) => [value, "数值"]}
            />
          )}

          {/* 面积图 */}
          <Area
            type="monotone"
            dataKey="value"
            stroke={colors.stroke}
            strokeWidth={2}
            fill={colors.fill}
            dot={false}
            activeDot={{ r: 3, fill: colors.stroke }}
            animationDuration={1000}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TrendChart;
