'use client';

import { SimulationState, SimulationParameter } from '@/types';
import { mechanics } from '@/lib/physics/formulas';
import { CONSTANTS } from '@/lib/physics/constants';

interface TrajectoryPoint {
  x: number;
  y: number;
  time: number;
  vx: number;
  vy: number;
}

interface ProjectileDataPoint {
  time: number;
  height: number;
  distance: number;
  velocity: number;
  kineticEnergy: number;
  potentialEnergy: number;
  totalEnergy: number;
}

// 初期状態
export const projectileMotionInitialState: SimulationState = {
  id: 'projectile-motion',
  unitId: 'mechanics',
  topicId: 'kinematics',
  name: '投射運動',
  parameters: {
    initialSpeed: {
      id: 'initialSpeed',
      name: 'initialSpeed',
      value: 10,
      min: 1,
      max: 30,
      step: 0.5,
      unit: 'm/s',
      label: '初速度'
    },
    launchAngle: {
      id: 'launchAngle',
      name: 'launchAngle',
      value: 45,
      min: 0,
      max: 90,
      step: 1,
      unit: '°',
      label: '発射角度'
    },
    gravity: {
      id: 'gravity',
      name: 'gravity',
      value: CONSTANTS.GRAVITY,
      min: 0.5,
      max: 20,
      step: 0.1,
      unit: 'm/s²',
      label: '重力加速度'
    },
    mass: {
      id: 'mass',
      name: 'mass',
      value: 1,
      min: 0.1,
      max: 10,
      step: 0.1,
      unit: 'kg',
      label: '質量'
    },
    initialHeight: {
      id: 'initialHeight',
      name: 'initialHeight',
      value: 0,
      min: 0,
      max: 10,
      step: 0.5,
      unit: 'm',
      label: '初期高さ'
    }
  },
  timeStep: 0.016, // 約60FPS
  isRunning: false,
  currentTime: 0,
  speed: 1,
  simulationData: {
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    time: 0,
    trajectory: [] as TrajectoryPoint[], // 物体の軌跡
    data: [] as ProjectileDataPoint[], // グラフ用データ
    maxHeight: 0,
    range: 0,
    flightTime: 0,
    hasLanded: false
  }
};

// シミュレーションの計算関数
export function calculateProjectileMotion(
  state: SimulationState,
  deltaTime: number
): SimulationState {
  if (!state.isRunning || state.simulationData.hasLanded) return state;

  const {
    initialSpeed,
    launchAngle,
    gravity,
    mass,
    initialHeight
  } = state.parameters;

  const newTime = state.currentTime + deltaTime * state.speed;
  
  // 角度をラジアンに変換
  const angleRad = launchAngle.value * Math.PI / 180;
  
  // 初速度の水平・垂直成分
  const v0x = initialSpeed.value * Math.cos(angleRad);
  const v0y = initialSpeed.value * Math.sin(angleRad);
  
  // 現在の位置を計算
  const x = v0x * newTime;
  const y = initialHeight.value + v0y * newTime - 0.5 * gravity.value * Math.pow(newTime, 2);
  
  // 現在の速度を計算
  const vx = v0x;
  const vy = v0y - gravity.value * newTime;
  
  // 速度の大きさ
  const velocity = Math.sqrt(vx * vx + vy * vy);
  
  // エネルギーの計算
  const kineticEnergy = mechanics.kineticEnergy(mass.value, velocity);
  const potentialEnergy = mechanics.potentialEnergy(mass.value, y, gravity.value);
  const totalEnergy = kineticEnergy + potentialEnergy;
  
  // 軌跡データを更新
  const trajectory = [...state.simulationData.trajectory] as TrajectoryPoint[];
  const maxTrajectoryPoints = 500; // 多めに取る
  
  if (trajectory.length >= maxTrajectoryPoints) {
    trajectory.shift();
  }
  
  trajectory.push({
    x,
    y,
    time: newTime,
    vx,
    vy
  });
  
  // グラフデータを更新
  const data = [...state.simulationData.data] as ProjectileDataPoint[];
  if (data.length >= maxTrajectoryPoints) {
    data.shift();
  }
  
  data.push({
    time: newTime,
    height: y,
    distance: x,
    velocity,
    kineticEnergy,
    potentialEnergy,
    totalEnergy
  });
  
  // 最高点と飛距離の計算
  let maxHeight = state.simulationData.maxHeight;
  if (y > maxHeight) {
    maxHeight = y;
  }
  
  // 着地判定
  let hasLanded = false;
  let range = state.simulationData.range;
  let flightTime = state.simulationData.flightTime;
  
  if (y <= 0 && newTime > 0.1) { // ある程度の時間が経過してから着地判定
    hasLanded = true;
    range = x;
    flightTime = newTime;
  }
  
  // 新しい状態を返す
  return {
    ...state,
    currentTime: newTime,
    simulationData: {
      x,
      y,
      vx,
      vy,
      time: newTime,
      trajectory,
      data,
      maxHeight,
      range,
      flightTime,
      hasLanded
    }
  };
}

// シミュレーションリセット関数
export function resetProjectileMotion(state: SimulationState): SimulationState {
  // 角度をラジアンに変換
  const angleRad = state.parameters.launchAngle.value * Math.PI / 180;
  
  // 初速度の水平・垂直成分を計算
  const v0x = state.parameters.initialSpeed.value * Math.cos(angleRad);
  const v0y = state.parameters.initialSpeed.value * Math.sin(angleRad);
  
  return {
    ...state,
    currentTime: 0,
    simulationData: {
      x: 0,
      y: state.parameters.initialHeight.value,
      vx: v0x,
      vy: v0y,
      time: 0,
      trajectory: [],
      data: [],
      maxHeight: state.parameters.initialHeight.value,
      range: 0,
      flightTime: 0,
      hasLanded: false
    }
  };
}