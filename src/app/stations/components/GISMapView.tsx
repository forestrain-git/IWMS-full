/**
 * @file app/stations/components/GISMapView.tsx
 * @description GIS地图视图（高德地图 - 成都龙泉驿）
 * @module 模块2:站点管理
 */

"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useGlobalStore } from "@/store";
import { AMAP_CONFIG } from "@/lib/constants";
import type { Station } from "../types/station";

interface GISMapViewProps {
  readonly stations: Station[];
  readonly onStationSelect: (station: Station | null) => void;
}

// 状态颜色
const STATUS_COLORS: Record<string, string> = {
  online: "#10b981",
  offline: "#6b7280",
  warning: "#f59e0b",
  danger: "#ef4444",
  maintenance: "#3b82f6",
};

// 使用全局配置的高德地图Key（优先使用环境变量）
const AMAP_KEY = AMAP_CONFIG.key || "";

// 成都龙泉驿中心坐标
const LONGQUANYI_CENTER = [104.2748, 30.5567];

export function GISMapView({ stations, onStationSelect }: GISMapViewProps) {
  console.log("GISMapView - received stations:", stations.length);
  console.log("GISMapView - sample station:", stations[0]);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const selectedStationId = useGlobalStore((state) => state.selectedStationId);
  const fallbackToOSM = !AMAP_KEY;
  
  console.log("AMAP_KEY:", AMAP_KEY);
  console.log("fallbackToOSM:", fallbackToOSM);

  useEffect(() => {
    console.log("设置isClient为true");
    setIsClient(true);
  }, []);

  // 初始化地图
  useEffect(() => {
    console.log("地图初始化useEffect触发, isClient:", isClient, "containerRef.current:", !!containerRef.current, "fallbackToOSM:", fallbackToOSM, "stations.length:", stations.length);
    
    if (!isClient) {
      console.log("isClient为false，等待客户端渲染");
      return;
    }
    
    if (!containerRef.current) {
      console.log("containerRef.current为空，等待DOM挂载");
      return;
    }
    
    if (fallbackToOSM) {
      console.log("使用OSM降级方案，跳过高德地图初始化");
      setIsLoading(false);
      return;
    }
    
    // 等待站点数据加载完成
    if (stations.length === 0) {
      console.log("站点数据尚未加载，等待数据");
      return;
    }
    
    console.log("开始初始化高德地图，站点数量:", stations.length);

    let isMounted = true;

    const initMap = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        // 如果使用降级展示（未配置Key），跳过高德初始化
        if (fallbackToOSM) {
          setIsLoading(false);
          return;
        }

        // 加载高德地图脚本
        if (!(window as any).AMap) {
          console.log("开始加载高德地图脚本");
          await new Promise<void>((resolve, reject) => {
            // 设置安全密钥
            (window as any)._AMapSecurityConfig = {
              securityJsCode: AMAP_CONFIG.securityConfig.securityJsCode,
            };
            
            const script = document.createElement("script");
            script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}&plugin=AMap.Marker,AMap.Scale,AMap.ToolBar`;
            script.async = true;
            
            const timeout = setTimeout(() => {
              reject(new Error("地图加载超时"));
            }, 20000);

            script.onload = () => {
              console.log("高德地图脚本加载成功");
              clearTimeout(timeout);
              resolve();
            };
            
            script.onerror = () => {
              console.log("高德地图脚本加载失败");
              clearTimeout(timeout);
              reject(new Error("地图脚本加载失败"));
            };
            
            document.head.appendChild(script);
          });
        }

        if (!isMounted) return;

        const AMap = (window as any).AMap;
        if (!AMap) {
          console.log("AMap对象未找到");
          throw new Error("AMap对象未找到");
        }

        console.log("开始初始化高德地图");

        // 初始化地图
        const map = new AMap.Map(containerRef.current, {
          zoom: 13,
          center: LONGQUANYI_CENTER,
          viewMode: "2D",
          mapStyle: "amap://styles/whitesmoke",
          resizeEnable: true,
          features: ["bg", "road", "building", "point"],
        });

        mapRef.current = map;

        // 添加比例尺和工具条
        map.addControl(new AMap.Scale({ position: "LB" }));
        map.addControl(new AMap.ToolBar({ position: "RB" }));
        
        console.log("地图初始化完成，准备添加标记");
        
        // 立即添加标记
        if (isMounted) {
          updateMarkers(map, AMap);
          setIsLoading(false);
        }

        // 绑定地图点击以取消选中
        map.on("click", () => {
          if (isMounted && onStationSelect) onStationSelect(null as any);
        });

      } catch (error) {
        console.error("地图初始化失败:", error);
        setLoadError(error instanceof Error ? error.message : "地图加载失败");
        setIsLoading(false);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.destroy();
        mapRef.current = null;
      }
    };
  }, [isClient, fallbackToOSM, stations.length, onStationSelect]);

  // 更新标记
  const updateMarkers = (map: any, AMap: any) => {
    if (!map || !AMap) return;

    console.log("更新标记，站点数量:", stations.length);

    // 清除所有覆盖物
    map.clearMap();

    // 添加新标记
    stations.forEach((station) => {
      // 显式转换并验证坐标数据为数值，避免出现 NaN
      const lng = Number(station.lng);
      const lat = Number(station.lat);
      if (!isFinite(lng) || !isFinite(lat)) {
        console.warn("站点坐标数据无效或非数值:", station);
        return;
      }

      const color = STATUS_COLORS[station.status] || STATUS_COLORS.online;
      const isSelected = station.id === selectedStationId;

      // 创建自定义标记 - 16px圆点 + 名称标签
      const markerContent = document.createElement("div");
      markerContent.innerHTML = `
        <div style="
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          transform: ${isSelected ? "scale(1.2)" : "scale(1)"};
          transition: transform 0.2s ease;
          z-index: ${isSelected ? 100 : 1};
        ">
          <div style="
            width: 16px;
            height: 16px;
            border-radius: 50%;
            background: ${color};
            border: 2px solid white;
            box-shadow: 0 0 ${isSelected ? 12 : 6}px ${color}, 0 2px 4px rgba(0,0,0,0.3);
          "></div>
          <div style="
            margin-top: 2px;
            padding: 2px 6px;
            background: white;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 500;
            color: #374151;
            white-space: nowrap;
            box-shadow: 0 1px 3px rgba(0,0,0,0.2);
          ">
            ${station.name}
          </div>
        </div>
      `;

      try {
        const marker = new AMap.Marker({
          position: [lng, lat],
          content: markerContent,
          offset: new AMap.Pixel(-16, -20),
          anchor: "bottom-center",
        });

        marker.on("click", () => {
          onStationSelect(station);
        });

        map.add(marker);
      } catch (error) {
        console.error("创建标记失败:", error, station);
      }
    });

    // 自适应视野 - 针对龙泉驿20个站点优化
    if (stations.length > 0) {
      try {
        // 创建包含所有站点的边界
        const bounds = new AMap.Bounds();
        let validStations = 0;

        stations.forEach((station) => {
          const lng = Number(station.lng);
          const lat = Number(station.lat);
          if (isFinite(lng) && isFinite(lat)) {
            bounds.extend([lng, lat]);
            validStations++;
          }
        });
        
        if (validStations > 0) {
          // 调整地图视野以包含所有站点，留出适当的边距
          map.setBounds(bounds, false, [30, 30, 30, 30]);
          
          // 根据站点数量调整缩放级别，确保最大显示
          if (stations.length <= 5) {
            map.setZoom(16);
          } else if (stations.length <= 10) {
            map.setZoom(15);
          } else if (stations.length <= 20) {
            map.setZoom(14); // 20个站点的最佳缩放级别
          } else {
            map.setZoom(13);
          }
        } else {
          console.warn("没有有效的站点坐标，使用默认位置");
          map.setZoomAndCenter(14, LONGQUANYI_CENTER);
        }
      } catch (error) {
        console.error("设置地图视野失败:", error);
        // 降级处理：直接设置到龙泉驿中心
        map.setZoomAndCenter(14, LONGQUANYI_CENTER);
      }
    }
  };

  // 站点或选中状态变化时更新标记
  useEffect(() => {
    const map = mapRef.current;
    const AMap = (window as any).AMap;
    if (map && AMap && !isLoading) {
      updateMarkers(map, AMap);
      if (selectedStationId) {
        const s = stations.find((x) => x.id === selectedStationId);
        if (s) {
          const lng = Number(s.lng);
          const lat = Number(s.lat);
          if (isFinite(lng) && isFinite(lat)) {
            map.setZoomAndCenter(16, [lng, lat]);
          } else {
            console.warn("选中站点坐标无效，跳过居中:", s);
          }
        }
      }
    }
  }, [stations, selectedStationId, isLoading]);

  if (!isClient) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100">
        <div className="text-slate-500">加载地图中...</div>
      </div>
    );
  }

  // 降级展示：使用简单的静态地图背景 + 精确的站点标记
  if (fallbackToOSM) {
    return (
      <div className="w-full h-full relative bg-gradient-to-br from-blue-50 to-green-50">
        {/* 简单的地图背景 */}
        <div className="absolute inset-0 bg-slate-100">
          {/* 地图纹理 */}
          <div className="absolute inset-0 opacity-30">
            <div className="grid grid-cols-12 grid-rows-12 h-full">
              {Array.from({ length: 144 }).map((_, i) => (
                <div key={i} className="border border-slate-300"></div>
              ))}
            </div>
          </div>
          
          {/* 模拟道路 */}
          <div className="absolute top-1/4 left-0 right-0 h-1 bg-slate-400 opacity-20"></div>
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-400 opacity-20"></div>
          <div className="absolute top-3/4 left-0 right-0 h-1 bg-slate-400 opacity-20"></div>
          <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-slate-400 opacity-20"></div>
          <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-slate-400 opacity-20"></div>
          <div className="absolute left-3/4 top-0 bottom-0 w-1 bg-slate-400 opacity-20"></div>
          
          {/* 区域标识 */}
          <div className="absolute top-8 left-8 text-slate-400 text-xs font-medium opacity-50">
            成都龙泉驿区
          </div>
        </div>
        
        {/* 站点标记覆盖层 */}
        <div className="absolute inset-0">
          {stations.map((station) => {
            const color = STATUS_COLORS[station.status] || STATUS_COLORS.online;
            const isSelected = station.id === selectedStationId;
            
            // 将经纬度映射到屏幕坐标（成都龙泉驿区域）
            const lng = Number(station.lng);
            const lat = Number(station.lat);

            // 验证坐标，避免 NaN
            if (!isFinite(lng) || !isFinite(lat)) {
              console.warn("OSM 降级: 站点坐标无效, 跳过渲染", station);
              return null;
            }

            // 成都龙泉驿区域范围：104.15-104.35, 30.45-30.65
            const minLng = 104.15;
            const maxLng = 104.35;
            const minLat = 30.45;
            const maxLat = 30.65;

            // 映射到百分比坐标
            const x = ((lng - minLng) / (maxLng - minLng)) * 100;
            const y = ((maxLat - lat) / (maxLat - minLat)) * 100;
            
            return (
              <div
                key={station.id}
                className="absolute cursor-pointer"
                style={{
                  left: `${Math.max(5, Math.min(95, x))}%`,
                  top: `${Math.max(5, Math.min(95, y))}%`,
                  transform: `translate(-50%, -50%) scale(${isSelected ? 1.2 : 1})`,
                  transition: 'transform 0.2s ease',
                  zIndex: isSelected ? 100 : 1
                }}
                onClick={() => onStationSelect(station)}
              >
                <div className="relative flex flex-col items-center">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-md"
                    style={{
                      backgroundColor: color,
                      boxShadow: `0 0 ${isSelected ? 12 : 6}px ${color}, 0 2px 4px rgba(0,0,0,0.3)`
                    }}
                  />
                  <div className="mt-1 px-2 py-1 bg-white/95 rounded text-xs font-medium whitespace-nowrap border shadow-sm"
                    style={{
                      color: isSelected ? "#2563eb" : "#1f2937",
                      borderColor: isSelected ? "#2563eb" : color,
                      fontSize: '10px'
                    }}
                  >
                    {station.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* 地图标题 */}
        <div className="absolute top-4 left-4 bg-white/95 px-3 py-2 rounded shadow">
          <div className="text-sm font-medium">成都龙泉驿站点分布</div>
          <div className="text-xs text-slate-600">显示 {stations.length} 个站点</div>
        </div>
        
        {/* 站点计数 */}
        <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl border border-slate-200 shadow-lg z-10">
          <div className="text-xs text-slate-500 uppercase">站点总数</div>
          <div className="text-2xl font-bold text-slate-800">{stations.length}</div>
        </div>

        {/* 图例 */}
        <div className="absolute bottom-16 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-lg z-10">
          <div className="text-xs text-slate-500 uppercase mb-2">图例</div>
          {Object.entries(STATUS_COLORS).map(([status, color]) => (
            <div key={status} className="flex items-center gap-2 mb-1.5 last:mb-0">
              <div
                className="w-3.5 h-3.5 rounded-full border-2 border-white shadow"
                style={{ backgroundColor: color }}
              />
              <span className="text-sm text-slate-700">
                {status === "online" && "在线"}
                {status === "offline" && "离线"}
                {status === "warning" && "告警"}
                {status === "danger" && "紧急"}
                {status === "maintenance" && "维护"}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="text-red-500 mb-2 font-medium">地图加载失败</div>
          <div className="text-slate-500 text-sm">{loadError}</div>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={containerRef} className="w-full h-full" />
      
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-100/90 z-50">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <div className="text-slate-600">加载地图...</div>
          </div>
        </div>
      )}

      {/* 站点计数 */}
      <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-3 rounded-xl border border-slate-200 shadow-lg z-10">
        <div className="text-xs text-slate-500 uppercase">站点总数</div>
        <div className="text-2xl font-bold text-slate-800">{stations.length}</div>
      </div>

      {/* 图例 */}
      <div className="absolute bottom-16 left-4 bg-white/95 backdrop-blur-sm p-4 rounded-xl border border-slate-200 shadow-lg z-10">
        <div className="text-xs text-slate-500 uppercase mb-2">图例</div>
        {Object.entries(STATUS_COLORS).map(([status, color]) => (
          <div key={status} className="flex items-center gap-2 mb-1.5 last:mb-0">
            <div
              className="w-3.5 h-3.5 rounded-full border-2 border-white shadow"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm text-slate-700">
              {status === "online" && "在线"}
              {status === "offline" && "离线"}
              {status === "warning" && "告警"}
              {status === "danger" && "紧急"}
              {status === "maintenance" && "维护"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GISMapView;
