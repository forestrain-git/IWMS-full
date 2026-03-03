/**
 * @file ParticleEffects.tsx
 * @description 粒子效果组件（气体云图、喷雾效果等）
 * @provides 有害气体3D云图可视化
 */

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import { BufferGeometry, Float32BufferAttribute, Vector3, Points as ThreePoints } from "three";
import type { GasData } from "../types/equipment";
import { GAS_THRESHOLDS } from "../types/equipment";

// ==================== Props接口 ====================

interface ParticleEffectsProps {
  /** 气体数据 */
  gasData: GasData[];
}

// ==================== 粒子系统组件 ====================

/**
 * 气体云图粒子组件
 */
function GasCloudParticles({ gasData }: { gasData: GasData[] }) {
  const pointsRef = useRef<ThreePoints>(null);
  const materialRef = useRef<any>(null);

  // 生成粒子数据
  const particleData = useMemo(() => {
    const positions: number[] = [];
    const colors: number[] = [];
    const sizes: number[] = [];

    gasData.forEach((gas) => {
      // 根据气体浓度生成粒子数量
      const nh3Level = gas.nh3 / GAS_THRESHOLDS.nh3.danger;
      const h2sLevel = gas.h2s / GAS_THRESHOLDS.h2s.danger;
      const intensity = Math.max(nh3Level, h2sLevel);
      
      // 每个气体位置生成粒子
      const particleCount = Math.floor(intensity * 50);
      
      for (let i = 0; i < particleCount; i++) {
        // 在气体位置周围随机分布
        const radius = Math.random() * 2;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        
        const x = gas.position[0] + radius * Math.sin(phi) * Math.cos(theta);
        const y = gas.position[1] + radius * Math.cos(phi);
        const z = gas.position[2] + radius * Math.sin(phi) * Math.sin(theta);
        
        positions.push(x, y, z);
        
        // 根据气体类型和浓度设置颜色
        if (nh3Level > h2sLevel) {
          // NH3 - 绿色到黄色
          const colorIntensity = Math.min(nh3Level, 1);
          colors.push(
            0.2 * colorIntensity,  // R
            0.8 * colorIntensity,  // G
            0.1 * colorIntensity   // B
          );
        } else {
          // H2S - 黄色到红色
          const colorIntensity = Math.min(h2sLevel, 1);
          colors.push(
            0.8 * colorIntensity,  // R
            0.4 * colorIntensity,  // G
            0.1 * colorIntensity   // B
          );
        }
        
        sizes.push(Math.random() * 0.5 + 0.1);
      }
    });

    return { positions, colors, sizes };
  }, [gasData]);

  // 创建几何体
  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(particleData.positions, 3));
    geo.setAttribute('color', new Float32BufferAttribute(particleData.colors, 3));
    geo.setAttribute('size', new Float32BufferAttribute(particleData.sizes, 1));
    return geo;
  }, [particleData]);

  // 动画更新
  useFrame((state) => {
    if (!pointsRef.current || !materialRef.current) return;

    // 粒子飘动效果
    const time = state.clock.elapsedTime;
    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < positions.length; i += 3) {
      // 模拟风向影响
      const windEffect = Math.sin(time + i * 0.1) * 0.01;
      positions[i] += windEffect; // X轴飘动
      positions[i + 1] += Math.sin(time * 2 + i * 0.1) * 0.005; // Y轴浮动
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // 材质透明度动画
    materialRef.current.opacity = 0.6 + Math.sin(time * 2) * 0.2;
  });

  return (
    <points geometry={geometry} ref={pointsRef}>
      <pointsMaterial
        ref={materialRef}
        size={0.3}
        vertexColors
        transparent
        opacity={0.6}
        sizeAttenuation
        depthWrite={false}
        blending={2} // AdditiveBlending
      />
    </points>
  );
}

/**
 * 除臭机喷雾效果组件
 */
function SprayEffect({ position }: { position: [number, number, number] }) {
  const pointsRef = useRef<ThreePoints>(null);
  
  // 生成喷雾粒子
  const sprayData = useMemo(() => {
    const positions: number[] = [];
    const velocities: number[] = [];
    
    for (let i = 0; i < 30; i++) {
      positions.push(
        position[0] + (Math.random() - 0.5) * 0.5,
        position[1],
        position[2] + (Math.random() - 0.5) * 0.5
      );
      
      velocities.push(
        (Math.random() - 0.5) * 0.02,
        Math.random() * 0.05 + 0.02, // 向上飘
        (Math.random() - 0.5) * 0.02
      );
    }
    
    return { positions, velocities };
  }, [position]);

  const geometry = useMemo(() => {
    const geo = new BufferGeometry();
    geo.setAttribute('position', new Float32BufferAttribute(sprayData.positions, 3));
    return geo;
  }, [sprayData]);

  useFrame((state) => {
    if (!pointsRef.current) return;

    const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
    
    for (let i = 0; i < positions.length; i += 3) {
      positions[i] += sprayData.velocities[i];
      positions[i + 1] += sprayData.velocities[i + 1];
      positions[i + 2] += sprayData.velocities[i + 2];
      
      // 重置超出范围的粒子
      if (positions[i + 1] > position[1] + 3) {
        positions[i] = position[0] + (Math.random() - 0.5) * 0.5;
        positions[i + 1] = position[1];
        positions[i + 2] = position[2] + (Math.random() - 0.5) * 0.5;
      }
    }
    
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points geometry={geometry} ref={pointsRef}>
      <pointsMaterial
        size={0.2}
        color="#60a5fa"
        transparent
        opacity={0.4}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}

// ==================== 主组件 ====================

/**
 * 粒子效果组件
 */
export function ParticleEffects({ gasData }: ParticleEffectsProps) {
  return (
    <group>
      {/* 气体云图 */}
      <GasCloudParticles gasData={gasData} />
      
      {/* 除臭机喷雾效果（示例位置） */}
      <SprayEffect position={[0, 1.5, -5]} />
      <SprayEffect position={[5, 1.5, -5]} />
      <SprayEffect position={[-5, 1.5, -5]} />
    </group>
  );
}
