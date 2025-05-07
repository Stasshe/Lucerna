'use client';

import { SimulationState, SimulationParameter } from '@/types';
import { mechanics } from '@/lib/physics/formulas';

interface TrailPoint {
  time: number;
  position: number;
  velocity: number;
}

interface EnergyDataPoint {
  time: number;
  kinetic: number;
  potential: number;
  total: number;
}

// 初期状態
export const uniformMotionInitialState: SimulationState = {
  id: 'uniform-motion',
  unitId: 'mechanics',
  topicId: 'kinematics',
  name: '等速直線運動・等加速度運動',
  parameters: {
    initialPosition: {
      id: 'initialPosition',
      name: 'initialPosition',
      value: 0,
      min: -10,
      max: 10,
      step: 0.1,
      unit: 'm',
      label: '初期位置'
    },
    initialVelocity: {
      id: 'initialVelocity',
      name: 'initialVelocity',
      value: 5,
      min: -10,
      max: 10,
      step: 0.1,
      unit: 'm/s',
      label: '初速度'
    },
    acceleration: {
      id: 'acceleration',
      name: 'acceleration',
      value: 0,
      min: -5,
      max: 5,
      step: 0.1,
      unit: 'm/s²',
      label: '加速度'
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
    }
  },
  timeStep: 0.016, // 約60FPS
  isRunning: false,
  currentTime: 0,
  speed: 1,
  simulationData: {
    position: 0,
    velocity: 5,
    acceleration: 0,
    time: 0,
    trail: [] as TrailPoint[], // 物体の軌跡
    energyData: [] as EnergyDataPoint[], // エネルギーグラフ用データ
  }
};

// シミュレーションの計算関数
export function calculateUniformMotion(
  state: SimulationState, 
  deltaTime: number
): SimulationState {
  if (!state.isRunning) return state;

  const {
    initialPosition,
    initialVelocity,
    acceleration,
    mass
  } = state.parameters;
  
  const newTime = state.currentTime + deltaTime * state.speed;
  
  // 新しい位置と速度を計算
  const newPosition = mechanics.position(
    initialPosition.value,
    initialVelocity.value,
    acceleration.value,
    newTime
  );
  
  const newVelocity = mechanics.velocity(
    initialVelocity.value,
    acceleration.value,
    newTime
  );
  
  // 運動エネルギーと位置エネルギー（ここでは加速度を重力と考える場合）を計算
  const kineticEnergy = mechanics.kineticEnergy(mass.value, newVelocity);
  let potentialEnergy = 0;
  
  // 加速度が正の場合は重力として扱わない
  if (acceleration.value < 0) {
    potentialEnergy = mechanics.potentialEnergy(
      mass.value,
      newPosition - initialPosition.value,
      Math.abs(acceleration.value)
    );
  }
  
  // トレイルデータ（物体の軌跡）を更新
  const maxTrailPoints = 100;
  const trail = [...state.simulationData.trail] as TrailPoint[];
  
  if (trail.length >= maxTrailPoints) {
    trail.shift(); // 古いポイントを削除
  }
  
  trail.push({ 
    time: newTime, 
    position: newPosition,
    velocity: newVelocity,
  });
  
  // エネルギーデータを更新
  const energyData = [...state.simulationData.energyData] as EnergyDataPoint[];
  if (energyData.length >= maxTrailPoints) {
    energyData.shift();
  }
  
  energyData.push({
    time: newTime,
    kinetic: kineticEnergy,
    potential: potentialEnergy,
    total: kineticEnergy + potentialEnergy
  });
  
  // 新しい状態を返す
  return {
    ...state,
    currentTime: newTime,
    simulationData: {
      position: newPosition,
      velocity: newVelocity,
      acceleration: acceleration.value,
      time: newTime,
      trail,
      energyData
    }
  };
}

// シミュレーションリセット関数
export function resetUniformMotion(state: SimulationState): SimulationState {
  return {
    ...state,
    currentTime: 0,
    simulationData: {
      position: state.parameters.initialPosition.value,
      velocity: state.parameters.initialVelocity.value,
      acceleration: state.parameters.acceleration.value,
      time: 0,
      trail: [],
      energyData: []
    }
  };
}