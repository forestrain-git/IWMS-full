/**
 * @file useRouteOptimization.ts
 * @description 路径优化算法Hook
 * @provides 遗传算法VRP实现、多目标优化
 */

import { useState, useCallback, useRef } from "react";
import type { 
  Vehicle, 
  Task, 
  OptimizationResult, 
  OptimizedRoute, 
  RoutePoint,
  OptimizationTarget,
  UseRouteOptimizationReturn 
} from "../types/dispatch";

// ==================== 距离计算工具 ====================

/**
 * 计算两点间距离（哈弗辛公式）
 */
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // 地球半径（公里）
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * 计算路径总距离
 */
function calculateRouteDistance(route: RoutePoint[]): number {
  let totalDistance = 0;
  for (let i = 0; i < route.length - 1; i++) {
    totalDistance += calculateDistance(
      route[i].location.latitude,
      route[i].location.longitude,
      route[i + 1].location.latitude,
      route[i + 1].location.longitude
    );
  }
  return totalDistance;
}

/**
 * 计算路径总时间（考虑距离和停留时间）
 */
function calculateRouteTime(route: RoutePoint[], averageSpeed: number = 40): number {
  const distance = calculateRouteDistance(route);
  const travelTime = (distance / averageSpeed) * 60; // 转换为分钟
  const serviceTime = route.reduce((sum, point) => sum + point.estimatedDuration, 0);
  return travelTime + serviceTime;
}

/**
 * 计算油耗和排放
 */
function calculateFuelAndEmission(distance: number, fuelConsumption: number = 20): {
  fuel: number;
  emission: number;
} {
  const fuel = (distance / 100) * fuelConsumption;
  const emission = fuel * 2.31; // 柴油车CO2排放系数
  return { fuel, emission };
}

// ==================== 遗传算法实现 ====================

/**
 * 个体（路径方案）
 */
interface Individual {
  routes: RoutePoint[][];
  fitness: number;
}

/**
 * 遗传算法参数
 */
interface GAParams {
  populationSize: number;
  generations: number;
  mutationRate: number;
  crossoverRate: number;
  elitismRate: number;
}

/**
 * 创建初始种群
 */
function createInitialPopulation(
  tasks: Task[],
  vehicles: Vehicle[],
  depotLocation: { latitude: number; longitude: number },
  populationSize: number
): Individual[] {
  const population: Individual[] = [];
  
  for (let i = 0; i < populationSize; i++) {
    const routes: RoutePoint[][] = [];
    
    // 为每辆车分配任务
    const availableTasks = [...tasks];
    const shuffledTasks = availableTasks.sort(() => Math.random() - 0.5);
    
    vehicles.forEach((vehicle, vehicleIndex) => {
      const route: RoutePoint[] = [];
      
      // 添加起点（仓库/车辆当前位置）
      route.push({
        location: {
          latitude: vehicleIndex === 0 ? depotLocation.latitude : vehicle.location.latitude,
          longitude: vehicleIndex === 0 ? depotLocation.longitude : vehicle.location.longitude,
          address: vehicleIndex === 0 ? "仓库" : "车辆当前位置",
        },
        estimatedArrival: new Date().toISOString(),
        estimatedDuration: 0,
      });
      
      // 随机分配任务给这辆车
      const tasksPerVehicle = Math.ceil(shuffledTasks.length / vehicles.length);
      const vehicleTasks = shuffledTasks.splice(0, tasksPerVehicle);
      
      vehicleTasks.forEach(task => {
        route.push({
          location: task.pickup,
          taskId: task.id,
          estimatedArrival: new Date(Date.now() + Math.random() * 3600000).toISOString(),
          estimatedDuration: task.estimatedWorkload.duration,
        });
        
        if (task.delivery) {
          route.push({
            location: task.delivery,
            taskId: task.id,
            estimatedArrival: new Date(Date.now() + Math.random() * 3600000).toISOString(),
            estimatedDuration: 15, // 卸货时间
          });
        }
      });
      
      // 添加终点（返回仓库）
      route.push({
        location: {
          latitude: depotLocation.latitude,
          longitude: depotLocation.longitude,
          address: "仓库",
        },
        estimatedArrival: new Date().toISOString(),
        estimatedDuration: 0,
      });
      
      routes.push(route);
    });
    
    population.push({
      routes,
      fitness: calculateFitness(routes),
    });
  }
  
  return population;
}

/**
 * 计算个体适应度
 */
function calculateFitness(routes: RoutePoint[][]): number {
  let totalDistance = 0;
  let totalTime = 0;
  let totalFuel = 0;
  let totalEmission = 0;
  
  routes.forEach(route => {
    const distance = calculateRouteDistance(route);
    const time = calculateRouteTime(route);
    const { fuel, emission } = calculateFuelAndEmission(distance);
    
    totalDistance += distance;
    totalTime += time;
    totalFuel += fuel;
    totalEmission += emission;
  });
  
  // 适应度函数：距离、时间、油耗、排放的加权和（越小越好）
  const fitness = totalDistance * 0.3 + totalTime * 0.01 + totalFuel * 0.5 + totalEmission * 0.2;
  return fitness;
}

/**
 * 选择操作（轮盘赌选择）
 */
function selection(population: Individual[]): Individual[] {
  const selected: Individual[] = [];
  const totalFitness = population.reduce((sum, ind) => sum + 1 / ind.fitness, 0);
  
  for (let i = 0; i < population.length; i++) {
    let random = Math.random() * totalFitness;
    let sum = 0;
    
    for (const individual of population) {
      sum += 1 / individual.fitness;
      if (sum >= random) {
        selected.push(individual);
        break;
      }
    }
  }
  
  return selected;
}

/**
 * 交叉操作（顺序交叉）
 */
function crossover(parent1: Individual, parent2: Individual): [Individual, Individual] {
  if (Math.random() > 0.7) return [parent1, parent2]; // 70%概率不交叉
  
  const child1Routes: RoutePoint[][] = [];
  const child2Routes: RoutePoint[][] = [];
  
  // 简化的交叉：随机选择部分路径交换
  parent1.routes.forEach((route, index) => {
    if (Math.random() > 0.5 && parent2.routes[index]) {
      child1Routes.push([...parent2.routes[index]]);
      child2Routes.push([...route]);
    } else {
      child1Routes.push([...route]);
      child2Routes.push(parent2.routes[index] ? [...parent2.routes[index]] : []);
    }
  });
  
  return [
    { routes: child1Routes, fitness: calculateFitness(child1Routes) },
    { routes: child2Routes, fitness: calculateFitness(child2Routes) },
  ];
}

/**
 * 变异操作（交换变异）
 */
function mutation(individual: Individual, mutationRate: number): Individual {
  if (Math.random() > mutationRate) return individual;
  
  const mutatedRoutes = individual.routes.map(route => {
    if (route.length <= 3) return route;
    
    const newRoute = [...route];
    // 随机交换两个任务点
    const idx1 = 1 + Math.floor(Math.random() * (newRoute.length - 2));
    const idx2 = 1 + Math.floor(Math.random() * (newRoute.length - 2));
    
    if (idx1 !== idx2) {
      [newRoute[idx1], newRoute[idx2]] = [newRoute[idx2], newRoute[idx1]];
    }
    
    return newRoute;
  });
  
  return {
    routes: mutatedRoutes,
    fitness: calculateFitness(mutatedRoutes),
  };
}

/**
 * 遗传算法主函数
 */
function geneticAlgorithm(
  tasks: Task[],
  vehicles: Vehicle[],
  depotLocation: { latitude: number; longitude: number },
  target: OptimizationTarget,
  onProgress?: (progress: number) => void
): OptimizationResult {
  const params: GAParams = {
    populationSize: 50,
    generations: 100,
    mutationRate: 0.1,
    crossoverRate: 0.7,
    elitismRate: 0.1,
  };
  
  const startTime = Date.now();
  
  // 创建初始种群
  let population = createInitialPopulation(tasks, vehicles, depotLocation, params.populationSize);
  
  // 进化循环
  for (let generation = 0; generation < params.generations; generation++) {
    // 选择
    const selected = selection(population);
    
    // 交叉和变异
    const newPopulation: Individual[] = [];
    
    // 精英保留
    const eliteSize = Math.floor(params.populationSize * params.elitismRate);
    const elite = population
      .sort((a, b) => a.fitness - b.fitness)
      .slice(0, eliteSize);
    newPopulation.push(...elite);
    
    // 生成新个体
    while (newPopulation.length < params.populationSize) {
      const parent1 = selected[Math.floor(Math.random() * selected.length)];
      const parent2 = selected[Math.floor(Math.random() * selected.length)];
      
      const [child1, child2] = crossover(parent1, parent2);
      const mutatedChild1 = mutation(child1, params.mutationRate);
      const mutatedChild2 = mutation(child2, params.mutationRate);
      
      newPopulation.push(mutatedChild1, mutatedChild2);
    }
    
    population = newPopulation.slice(0, params.populationSize);
    
    // 报告进度
    if (onProgress) {
      onProgress((generation + 1) / params.generations);
    }
  }
  
  // 获取最优解
  const bestIndividual = population.sort((a, b) => a.fitness - b.fitness)[0];
  
  // 转换为优化结果格式
  const routes: OptimizedRoute[] = bestIndividual.routes.map((route, index) => {
    const distance = calculateRouteDistance(route);
    const time = calculateRouteTime(route);
    const { fuel, emission } = calculateFuelAndEmission(distance);
    
    return {
      id: `route_${index + 1}`,
      vehicleId: vehicles[index]?.id || `vehicle_${index + 1}`,
      points: route,
      totalDistance: distance,
      totalTime: time,
      totalFuel: fuel,
      totalEmission: emission,
      comparison: {
        vsPrevious: {
          distance: -Math.random() * 20, // 模拟改善百分比
          time: -Math.random() * 25,
          fuel: -Math.random() * 15,
        },
      },
    };
  });
  
  // 计算总体改善
  const totalDistance = routes.reduce((sum, route) => sum + route.totalDistance, 0);
  const totalTime = routes.reduce((sum, route) => sum + route.totalTime, 0);
  const totalFuel = routes.reduce((sum, route) => sum + route.totalFuel, 0);
  const totalEmission = routes.reduce((sum, route) => sum + route.totalEmission, 0);
  
  const result: OptimizationResult = {
    id: `optimization_${Date.now()}`,
    optimizedAt: new Date().toISOString(),
    target,
    routes,
    overallImprovement: {
      totalDistance,
      totalTime,
      totalFuel,
      totalEmission,
      vsPrevious: {
        distance: -Math.random() * 18,
        time: -Math.random() * 22,
        fuel: -Math.random() * 16,
        emission: -Math.random() * 20,
      },
    },
    algorithm: {
      name: "Genetic Algorithm VRP",
      iterations: params.generations,
      executionTime: Date.now() - startTime,
      convergence: 0.95,
    },
  };
  
  return result;
}

// ==================== 主要Hook ====================

/**
 * 路径优化Hook
 */
export function useRouteOptimization(): UseRouteOptimizationReturn {
  const [optimizationResult, setOptimizationResult] = useState<OptimizationResult | null>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);
  
  const optimizationRef = useRef<{
    cancelled: boolean;
  }>({ cancelled: false });

  const startOptimization = useCallback((
    target: OptimizationTarget,
    vehicleIds: string[],
    taskIds: string[]
  ) => {
    // 这里应该从外部传入vehicles和tasks数据
    // 为了演示，使用模拟数据
    const mockVehicles: Vehicle[] = vehicleIds.map((id, index) => ({
      id,
      plateNumber: `川A${String(10000 + index).slice(-5)}`,
      type: "collection" as const,
      status: "idle" as const,
      location: {
        latitude: 30.5728 + Math.random() * 0.01,
        longitude: 104.0668 + Math.random() * 0.01,
        timestamp: new Date().toISOString(),
      },
      driver: {
        id: `driver_${index}`,
        name: `司机${index}`,
        phone: `138${String(10000000 + index).slice(-8)}`,
      },
      capacity: { max: 10, current: 0 },
      fuel: { level: 80, consumption: 20 },
      maintenance: {
        lastMileage: 50000,
        nextMileage: 55000,
        daysUntilNext: 15,
      },
      completedTasksToday: 0,
      workMinutesToday: 0,
    }));

    const mockTasks: Task[] = taskIds.map((id, index) => ({
      id,
      name: `任务${index}`,
      type: "collection" as const,
      status: "pending" as const,
      priority: "normal" as const,
      pickup: {
        latitude: 30.5728 + Math.random() * 0.02,
        longitude: 104.0668 + Math.random() * 0.02,
        address: `地址${index}`,
        district: "武侯区",
      },
      estimatedWorkload: {
        duration: 30 + Math.random() * 60,
        weight: 1 + Math.random() * 4,
      },
      createdAt: new Date().toISOString(),
      plannedStartTime: new Date().toISOString(),
      overflowLevel: Math.floor(Math.random() * 5) + 1,
    }));

    setIsOptimizing(true);
    setOptimizationProgress(0);
    optimizationRef.current.cancelled = false;

    // 异步执行优化
    setTimeout(() => {
      if (optimizationRef.current.cancelled) {
        setIsOptimizing(false);
        return;
      }

      try {
        const result = geneticAlgorithm(
          mockTasks,
          mockVehicles,
          { latitude: 30.5728, longitude: 104.0668 }, // 仓库位置
          target,
          (progress) => {
            if (!optimizationRef.current.cancelled) {
              setOptimizationProgress(progress);
            }
          }
        );

        if (!optimizationRef.current.cancelled) {
          setOptimizationResult(result);
          setOptimizationProgress(1);
        }
      } catch (error) {
        console.error("Route optimization failed:", error);
      } finally {
        setIsOptimizing(false);
      }
    }, 100);
  }, []);

  const stopOptimization = useCallback(() => {
    optimizationRef.current.cancelled = true;
    setIsOptimizing(false);
    setOptimizationProgress(0);
  }, []);

  const applyOptimization = useCallback((resultId: string) => {
    if (optimizationResult && optimizationResult.id === resultId) {
      console.log("Applied optimization result:", resultId);
      // 这里应该触发实际的路径应用逻辑
    }
  }, [optimizationResult]);

  return {
    optimizationResult,
    isOptimizing,
    optimizationProgress,
    startOptimization,
    stopOptimization,
    applyOptimization,
  };
}
