/**
 * @file app/dashboard/components/GISMap.tsx
 * @description GIS地图组件（高德地图）
 * @module 模块1:监管驾驶舱
 */

import { useEffect, useRef, useState } from "react";
import { useGlobalStore, useMockDataStore } from "@/store";
import type { Station } from "@/types";

interface GISMapProps {
  readonly stations: Station[];
  readonly className?: string;
}

/**
 * 获取站点标记颜色
 */
function getMarkerColor(status: Station["status"], capacity: number): string {
  if (status === "offline") return "#6b7280";
  if (status === "danger" || capacity > 90) return "#ef4444";
  if (status === "warning" || capacity > 70) return "#f59e0b";
  return "#10b981";
}

/**
 * GIS地图组件
 */
export function GISMap({ stations, className }: GISMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const [loadError, setLoadError] = useState(false);
  
  const selectedStationId = useGlobalStore((state) => state.selectedStationId);
  const setSelectedStationId = useGlobalStore((state) => state.setSelectedStationId);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    // 模拟地图加载（没有高德key时使用Canvas绘制）
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const container = containerRef.current;
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    container.appendChild(canvas);

    // 绘制简化地图
    const draw = () => {
      // 背景
      ctx.fillStyle = "#f1f5f9";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // 绘制网格
      ctx.strokeStyle = "#e2e8f0";
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 40) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }
      for (let i = 0; i < canvas.height; i += 40) {
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
      }

      // 绘制站点标记
      stations.slice(0, 30).forEach((station, index) => {
        const x = ((index % 6) + 1) * (canvas.width / 7);
        const y = (Math.floor(index / 6) + 1) * (canvas.height / 5);
        const color = getMarkerColor(station.status, station.capacity);
        const isSelected = station.id === selectedStationId;

        // 外圈
        ctx.beginPath();
        ctx.arc(x, y, isSelected ? 12 : 8, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.strokeStyle = "#fff";
        ctx.lineWidth = 2;
        ctx.stroke();

        // 选中效果
        if (isSelected) {
          ctx.beginPath();
          ctx.arc(x, y, 16, 0, Math.PI * 2);
          ctx.strokeStyle = "#3b82f6";
          ctx.lineWidth = 2;
          ctx.stroke();
        }

        // 标签
        ctx.fillStyle = "#374151";
        ctx.font = "10px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(station.name.slice(0, 6), x, y + 20);
      });
    };

    draw();

    // 点击交互
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      stations.slice(0, 30).forEach((station, index) => {
        const x = ((index % 6) + 1) * (canvas.width / 7);
        const y = (Math.floor(index / 6) + 1) * (canvas.height / 5);
        
        const distance = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2);
        if (distance < 15) {
          setSelectedStationId(station.id);
        }
      });
    };

    canvas.addEventListener("click", handleClick);

    return () => {
      canvas.removeEventListener("click", handleClick);
      container.removeChild(canvas);
    };
  }, [isClient, stations, selectedStationId, setSelectedStationId]);

  if (!isClient) {
    return (
      <div className={className}>
        <div className="flex items-center justify-center h-full text-muted-foreground">
          加载地图中...
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={className}
      style={{ cursor: "pointer" }}
    />
  );
}

export default GISMap;
