/**
 * @file app/dashboard/components/GISMapView.tsx
 * @description GIS地图视图（带地图背景）
 * @module 模块1:监管驾驶舱
 */

import { useEffect, useRef, useCallback, useState } from "react";
import { useGlobalStore } from "@/store";
import type { Station } from "@/types";

interface GISMapViewProps {
  readonly stations: Station[];
  readonly onStationSelect: (station: Station) => void;
  readonly className?: string;
}

const STATUS_COLORS: Record<string, string> = {
  online: "#10b981",
  offline: "#6b7280",
  warning: "#f59e0b",
  danger: "#ef4444",
  maintenance: "#3b82f6",
};

export function GISMapView({ stations, onStationSelect, className }: GISMapViewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const selectedStationId = useGlobalStore((state) => state.selectedStationId);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const drawMap = useCallback((canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
    const width = canvas.width;
    const height = canvas.height;

    // 卫星地图风格背景
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "#1a2332");
    gradient.addColorStop(1, "#0f172a");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // 绘制地图区块（模拟区域）
    const drawDistrict = (x: number, y: number, w: number, h: number, color: string) => {
      ctx.fillStyle = color;
      ctx.fillRect(x, y, w, h);
      ctx.strokeStyle = "rgba(59, 130, 246, 0.2)";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, h);
    };

    // 绘制多个区块模拟城市区域
    drawDistrict(20, 20, width * 0.3, height * 0.25, "rgba(30, 41, 59, 0.5)");
    drawDistrict(width * 0.35, 40, width * 0.4, height * 0.3, "rgba(30, 41, 59, 0.3)");
    drawDistrict(60, height * 0.35, width * 0.25, height * 0.4, "rgba(30, 41, 59, 0.4)");
    drawDistrict(width * 0.4, height * 0.4, width * 0.5, height * 0.35, "rgba(15, 23, 42, 0.6)");
    drawDistrict(width * 0.15, height * 0.7, width * 0.35, height * 0.22, "rgba(30, 41, 59, 0.35)");
    drawDistrict(width * 0.55, height * 0.75, width * 0.4, height * 0.2, "rgba(30, 41, 59, 0.45)");

    // 绘制主要道路
    ctx.strokeStyle = "rgba(71, 85, 105, 0.6)";
    ctx.lineWidth = 3;
    
    // 横向道路
    for (let i = 1; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(0, height * i / 5);
      ctx.lineTo(width, height * i / 5);
      ctx.stroke();
    }
    
    // 纵向道路
    for (let i = 1; i < 5; i++) {
      ctx.beginPath();
      ctx.moveTo(width * i / 5, 0);
      ctx.lineTo(width * i / 5, height);
      ctx.stroke();
    }

    // 绘制次要道路（虚线）
    ctx.strokeStyle = "rgba(71, 85, 105, 0.3)";
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);
    
    for (let i = 1; i < 10; i++) {
      if (i % 2 === 0) continue;
      ctx.beginPath();
      ctx.moveTo(0, height * i / 10);
      ctx.lineTo(width, height * i / 10);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(width * i / 10, 0);
      ctx.lineTo(width * i / 10, height);
      ctx.stroke();
    }
    ctx.setLineDash([]);

    // 绘制水域（模拟河流/湖泊）
    ctx.fillStyle = "rgba(59, 130, 246, 0.15)";
    ctx.beginPath();
    ctx.moveTo(0, height * 0.6);
    ctx.quadraticCurveTo(width * 0.3, height * 0.55, width * 0.5, height * 0.65);
    ctx.quadraticCurveTo(width * 0.7, height * 0.75, width, height * 0.6);
    ctx.lineTo(width, height * 0.8);
    ctx.quadraticCurveTo(width * 0.7, height * 0.9, width * 0.5, height * 0.85);
    ctx.quadraticCurveTo(width * 0.3, height * 0.8, 0, height * 0.85);
    ctx.closePath();
    ctx.fill();
    
    // 水域边缘线
    ctx.strokeStyle = "rgba(59, 130, 246, 0.3)";
    ctx.lineWidth = 2;
    ctx.stroke();

    // 计算站点位置（基于真实经纬度的相对位置）
    const positions = stations.slice(0, 30).map((station, index) => {
      // 使用螺旋布局但基于中心分布
      const angle = (index / Math.min(stations.length, 30)) * Math.PI * 4;
      const radius = 40 + (index / 30) * Math.min(width, height) * 0.35;
      const x = width / 2 + Math.cos(angle) * radius;
      const y = height / 2 + Math.sin(angle) * radius;
      return { x, y, station };
    });

    // 绘制站点连线（相邻站点）
    ctx.strokeStyle = "rgba(59, 130, 246, 0.15)";
    ctx.lineWidth = 1;
    for (let i = 0; i < positions.length - 1; i++) {
      const dist = Math.sqrt(
        Math.pow(positions[i].x - positions[i + 1].x, 2) +
        Math.pow(positions[i].y - positions[i + 1].y, 2)
      );
      if (dist < 150) {
        ctx.beginPath();
        ctx.moveTo(positions[i].x, positions[i].y);
        ctx.lineTo(positions[i + 1].x, positions[i + 1].y);
        ctx.stroke();
      }
    }

    // 绘制站点标记
    const time = Date.now() / 1000;
    
    positions.forEach(({ x, y, station }, index) => {
      const color = STATUS_COLORS[station.status] || STATUS_COLORS.online;
      const isSelected = station.id === selectedStationId;
      const pulseScale = 1 + Math.sin(time * 2 + index) * 0.15;

      // 外圈脉冲效果
      const outerGradient = ctx.createRadialGradient(x, y, 0, x, y, 20 * pulseScale);
      outerGradient.addColorStop(0, color + "60");
      outerGradient.addColorStop(0.5, color + "30");
      outerGradient.addColorStop(1, "transparent");
      ctx.fillStyle = outerGradient;
      ctx.beginPath();
      ctx.arc(x, y, 20 * pulseScale, 0, Math.PI * 2);
      ctx.fill();

      // 选中效果
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(59, 130, 246, 0.4)";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x, y, 18, 0, Math.PI * 2);
        ctx.strokeStyle = "#60a5fa";
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // 选中光环动画
        ctx.beginPath();
        ctx.arc(x, y, 25 + Math.sin(time * 3) * 3, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(96, 165, 250, 0.3)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      // 主标记点 - 带阴影
      ctx.shadowColor = color;
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
      ctx.shadowBlur = 0;
      
      // 内高光
      ctx.beginPath();
      ctx.arc(x - 3, y - 3, 4, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fill();

      // 状态点边框
      ctx.beginPath();
      ctx.arc(x, y, 9, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(255,255,255,0.3)";
      ctx.lineWidth = 1;
      ctx.stroke();

      // 标签背景 - 圆角矩形
      const label = station.name.slice(0, 6);
      ctx.font = "12px system-ui, -apple-system, sans-serif";
      const textWidth = ctx.measureText(label).width;
      const padding = 6;
      const labelY = y + 22;
      
      // 标签背景
      ctx.fillStyle = isSelected ? "rgba(15, 23, 42, 0.95)" : "rgba(15, 23, 42, 0.8)";
      ctx.beginPath();
      ctx.roundRect(x - textWidth/2 - padding, labelY - 12, textWidth + padding * 2, 20, 4);
      ctx.fill();
      
      // 标签边框
      ctx.strokeStyle = isSelected ? "rgba(96, 165, 250, 0.5)" : "rgba(71, 85, 105, 0.5)";
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // 标签文字
      ctx.fillStyle = isSelected ? "#60a5fa" : "#cbd5e1";
      ctx.textAlign = "center";
      ctx.fillText(label, x, labelY + 3);
      
      // 容量小点
      const capacityColor = station.capacity > 70 ? "#ef4444" : station.capacity > 30 ? "#f59e0b" : "#10b981";
      ctx.beginPath();
      ctx.arc(x + textWidth/2 + padding + 4, labelY - 2, 3, 0, Math.PI * 2);
      ctx.fillStyle = capacityColor;
      ctx.fill();
    });

    // 存储位置用于点击检测
    (canvas as any).stationPositions = positions.map(p => ({ x: p.x, y: p.y, station: p.station }));
  }, [stations, selectedStationId]);

  useEffect(() => {
    if (!isClient || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };

    resize();
    window.addEventListener("resize", resize);
    container.appendChild(canvas);

    // 动画循环
    let animationId: number;
    const animate = () => {
      drawMap(canvas, ctx);
      animationId = requestAnimationFrame(animate);
    };
    animate();

    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;

      const positions = (canvas as any).stationPositions || [];
      positions.forEach(({ x, y, station }: any) => {
        const dist = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2);
        if (dist < 25) {
          onStationSelect(station);
        }
      });
    };

    canvas.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("click", handleClick);
      container.removeChild(canvas);
    };
  }, [isClient, drawMap, onStationSelect]);

  if (!isClient) {
    return (
      <div className={`flex items-center justify-center bg-slate-900 ${className}`}>
        <div className="text-slate-500">加载地图中...</div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef} 
      className={`bg-slate-900 rounded-lg overflow-hidden ${className}`}
      style={{ cursor: "pointer" }}
    />
  );
}

export default GISMapView;
