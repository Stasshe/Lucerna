'use client';

import { SimulationParameter, SimulationState } from '@/types';

// Record<string, SimulationParameter>と互換性を持つ形に変更
interface PendulumParameters {
  length: SimulationParameter;
  gravity: SimulationParameter;
  initialAngle: SimulationParameter;
  dampingFactor: SimulationParameter;
  [key: string]: SimulationParameter;
}

interface PendulumData {
  time: number;
  angle: number;
  angularVelocity: number;
  potentialEnergy: number;
  kineticEnergy: number;
  totalEnergy: number;
}

// SimulationDataと互換性を持つようにインデックスシグネチャを追加
interface PendulumSimulationData {
  bobPosition: { x: number; y: number };
  data: PendulumData[];
  maxDataPoints: number;
  [key: string]: unknown;
}

export interface PendulumSimulationState extends SimulationState {
  parameters: PendulumParameters;
  simulationData: PendulumSimulationData;
}

// 初期状態
export const pendulumMotionInitialState: PendulumSimulationState = {
  id: 'pendulum-motion',
  unitId: 'mechanics',
  topicId: 'circular-motion',
  name: '単振り子運動',
  isRunning: false,
  speed: 1,
  currentTime: 0,
  timeStep: 0.01,
  parameters: {
    length: {
      id: 'length',
      name: 'length',
      value: 1,
      min: 0.1,
      max: 5,
      step: 0.1,
      label: '振り子の長さ',
      unit: 'm'
    },
    gravity: {
      id: 'gravity',
      name: 'gravity',
      value: 9.8,
      min: 1,
      max: 20,
      step: 0.1,
      label: '重力加速度',
      unit: 'm/s²'
    },
    initialAngle: {
      id: 'initialAngle',
      name: 'initialAngle',
      value: 30,
      min: 0,
      max: 90,
      step: 1,
      label: '初期角度',
      unit: '°'
    },
    dampingFactor: {
      id: 'dampingFactor',
      name: 'dampingFactor',
      value: 0.1,
      min: 0,
      max: 2,
      step: 0.05,
      label: '減衰係数',
      unit: '1/s'
    }
  },
  simulationData: {
    bobPosition: { x: 0, y: 0 },
    data: [],
    maxDataPoints: 500
  }
};

// 振り子運動の計算
export function calculatePendulumMotion(
  state: PendulumSimulationState,
  deltaTime: number
): PendulumSimulationState {
  if (!state.isRunning) return state;

  const { length, gravity, initialAngle, dampingFactor } = state.parameters;
  const L = length.value;
  const g = gravity.value;
  const b = dampingFactor.value;
  
  // 現在の状態
  const currentData = state.simulationData.data;
  const currentAngle = currentData.length > 0 
    ? currentData[currentData.length - 1].angle 
    : initialAngle.value * Math.PI / 180; // 角度をラジアンに変換
  
  const currentAngularVelocity = currentData.length > 0
    ? currentData[currentData.length - 1].angularVelocity
    : 0;
  
  // 角加速度の計算（運動方程式）
  // d²θ/dt² = -(g/L)·sin(θ) - b·dθ/dt
  const angularAcceleration = -(g / L) * Math.sin(currentAngle) - b * currentAngularVelocity;
  
  // オイラー法による積分
  const newAngularVelocity = currentAngularVelocity + angularAcceleration * deltaTime;
  const newAngle = currentAngle + newAngularVelocity * deltaTime;
  
  // エネルギーの計算（質量は1kgと仮定）
  const mass = 1; // kg
  const potentialEnergy = mass * g * L * (1 - Math.cos(newAngle));
  const kineticEnergy = 0.5 * mass * L * L * newAngularVelocity * newAngularVelocity;
  const totalEnergy = potentialEnergy + kineticEnergy;
  
  // 振り子の先端（おもり）の位置
  const bobX = L * Math.sin(newAngle);
  const bobY = -L * Math.cos(newAngle);
  
  // 新しいデータポイント
  const newData: PendulumData = {
    time: state.currentTime + deltaTime,
    angle: newAngle,
    angularVelocity: newAngularVelocity,
    potentialEnergy,
    kineticEnergy,
    totalEnergy
  };
  
  // データポイントを追加（最大数を超えたら古いものを削除）
  const updatedData = [...state.simulationData.data, newData];
  if (updatedData.length > state.simulationData.maxDataPoints) {
    updatedData.shift();
  }
  
  return {
    ...state,
    currentTime: state.currentTime + deltaTime,
    simulationData: {
      ...state.simulationData,
      bobPosition: { x: bobX, y: bobY },
      data: updatedData
    }
  };
}

// シミュレーションのリセット
export function resetPendulumMotion(state: PendulumSimulationState): PendulumSimulationState {
  const { initialAngle } = state.parameters;
  const angleInRadians = initialAngle.value * Math.PI / 180;
  const L = state.parameters.length.value;
  
  // 振り子の先端（おもり）の初期位置
  const bobX = L * Math.sin(angleInRadians);
  const bobY = -L * Math.cos(angleInRadians);
  
  // 初期データポイント
  const initialData: PendulumData = {
    time: 0,
    angle: angleInRadians,
    angularVelocity: 0,
    potentialEnergy: state.parameters.gravity.value * L * (1 - Math.cos(angleInRadians)),
    kineticEnergy: 0,
    totalEnergy: state.parameters.gravity.value * L * (1 - Math.cos(angleInRadians))
  };
  
  return {
    ...state,
    currentTime: 0,
    simulationData: {
      ...state.simulationData,
      bobPosition: { x: bobX, y: bobY },
      data: [initialData]
    }
  };
}