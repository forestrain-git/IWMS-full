/**
 * @file app/dashboard/components/DigitalTwinScene.tsx
 * @description 数字孪生3D场景（高端优化版）
 * @module 模块1:监管驾驶舱
 */

import { useEffect, useRef, useCallback, useState } from "react";
import { useMockDataStore, useGlobalStore } from "@/store";
import type { Station } from "@/types";

interface DigitalTwinSceneProps {
  readonly stations: Station[];
  readonly className?: string;
}

const STATUS_COLORS: Record<string, number> = {
  online: 0x10b981,
  offline: 0x6b7280,
  warning: 0xf59e0b,
  danger: 0xef4444,
  maintenance: 0x3b82f6,
};

export function DigitalTwinScene({ stations, className }: DigitalTwinSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);
  const selectedStationId = useGlobalStore((state) => state.selectedStationId);
  const setSelectedStationId = useGlobalStore((state) => state.setSelectedStationId);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const initScene = useCallback(async () => {
    if (!containerRef.current) return;
    
    const THREE = await import("three");
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 场景 - 深色科技风
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    
    // 雾效
    scene.fog = new THREE.FogExp2(0x0f172a, 0.02);

    // 相机 - 调整视角使场景更大
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 18, 28);
    camera.lookAt(0, 0, 0);

    // 渲染器
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 环境光
    const ambientLight = new THREE.AmbientLight(0x3b82f6, 0.3);
    scene.add(ambientLight);
    
    // 主光源
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    scene.add(dirLight);
    
    // 蓝色点光源营造科技感
    const pointLight = new THREE.PointLight(0x3b82f6, 0.5, 50);
    pointLight.position.set(0, 10, 0);
    scene.add(pointLight);

    // 地面 - 网格
    const gridHelper = new THREE.GridHelper(40, 40, 0x1e293b, 0x1e293b);
    scene.add(gridHelper);
    
    // 地面发光圆环
    const ringGeometry = new THREE.RingGeometry(15, 15.2, 64);
    const ringMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x3b82f6, 
      transparent: true, 
      opacity: 0.3,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = -Math.PI / 2;
    ring.position.y = 0.05;
    scene.add(ring);

    // 站点节点组
    const nodesGroup = new THREE.Group();
    scene.add(nodesGroup);

    // 创建站点节点
    stations.slice(0, 30).forEach((station, index) => {
      const group = new THREE.Group();
      
      // 主立方体 - 增大尺寸
      const geometry = new THREE.BoxGeometry(1.8, 1.8, 1.8);
      const color = STATUS_COLORS[station.status] || STATUS_COLORS.online;
      const material = new THREE.MeshLambertMaterial({ 
        color,
        transparent: true,
        opacity: 0.9,
        emissive: color,
        emissiveIntensity: 0.2,
      });
      const cube = new THREE.Mesh(geometry, material);
      cube.castShadow = true;
      
      // 外发光框
      const edges = new THREE.EdgesGeometry(geometry);
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.3 });
      const wireframe = new THREE.LineSegments(edges, lineMaterial);
      cube.add(wireframe);
      
      // 底部光圈
      const glowGeometry = new THREE.RingGeometry(0.8, 1.5, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({ 
        color, 
        transparent: true, 
        opacity: 0.4,
        side: THREE.DoubleSide
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      glow.rotation.x = -Math.PI / 2;
      glow.position.y = -0.8;
      
      // 数据标签（简化版）
      const canvas = document.createElement("canvas");
      canvas.width = 128;
      canvas.height = 64;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "rgba(15, 23, 42, 0.8)";
      ctx.fillRect(0, 0, 128, 64);
      ctx.fillStyle = "#fff";
      ctx.font = "12px Arial";
      ctx.textAlign = "center";
      ctx.fillText(station.name.slice(0, 6), 64, 25);
      ctx.fillStyle = color === STATUS_COLORS.danger ? "#ef4444" : "#10b981";
      ctx.fillText(`${station.capacity}%`, 64, 48);
      
      const texture = new THREE.CanvasTexture(canvas);
      const spriteMaterial = new THREE.SpriteMaterial({ map: texture, transparent: true });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(3, 1.5, 1);
      sprite.position.y = 2.5;
      
      group.add(cube);
      group.add(glow);
      group.add(sprite);
      
      // 网格布局 - 更紧凑的布局使站点更大
      const angle = (index / Math.min(stations.length, 30)) * Math.PI * 2;
      const radius = 6 + Math.floor(index / 10) * 4;
      group.position.set(
        Math.cos(angle) * radius,
        0.6,
        Math.sin(angle) * radius
      );
      
      group.userData = { stationId: station.id, stationName: station.name };
      nodesGroup.add(group);
    });

    // 动画循环
    let animationId: number;
    let time = 0;
    
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      time += 0.01;
      
      // 缓慢旋转
      nodesGroup.rotation.y = time * 0.1;
      
      // 选中站点高亮
      nodesGroup.children.forEach((group: any) => {
        const cube = group.children[0];
        const isSelected = group.userData.stationId === selectedStationId;
        
        if (isSelected) {
          cube.material.emissiveIntensity = 0.8;
          cube.scale.setScalar(1.2);
          group.position.y = 0.6 + Math.sin(time * 3) * 0.3;
        } else {
          cube.material.emissiveIntensity = 0.2;
          cube.scale.setScalar(1);
          group.position.y = 0.6;
        }
      });
      
      // 光环保留旋转
      ring.rotation.z = time * 0.5;
      
      renderer.render(scene, camera);
    };
    animate();

    // 鼠标交互
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    
    const handleClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
      
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(nodesGroup.children, true);
      
      if (intersects.length > 0) {
        let target = intersects[0].object;
        while (target.parent && !target.userData.stationId) {
          target = target.parent;
        }
        if (target.userData.stationId) {
          setSelectedStationId(target.userData.stationId);
        }
      }
    };

    container.addEventListener("click", handleClick);
    
    // 清理
    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener("click", handleClick);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, [stations, selectedStationId, setSelectedStationId]);

  useEffect(() => {
    if (!isClient) return;
    const cleanup = initScene();
    return () => { cleanup?.then?.(fn => fn?.()); };
  }, [isClient, initScene]);

  if (!isClient) {
    return (
      <div className={`flex items-center justify-center bg-slate-900 ${className}`}>
        <div className="text-slate-500">加载3D场景中...</div>
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

export default DigitalTwinScene;
