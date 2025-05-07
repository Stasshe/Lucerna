'use client';

import React from 'react';
import { Canvas } from '@react-three/fiber';
import { Line, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { PendulumSimulationState } from '@/lib/simulations/mechanics/pendulumMotion';

interface PendulumMotionVisualizationProps {
  state: PendulumSimulationState;
}

// Three.jsの振り子コンポーネント
function Pendulum({ state }: PendulumMotionVisualizationProps) {
  // 状態から必要な情報を取得
  const { bobPosition } = state.simulationData;
  const length = state.parameters.length.value;
  
  // 最新のデータポイントから角度を取得
  const data = state.simulationData.data;
  const currentData = data.length > 0 ? data[data.length - 1] : null;
  const angle = currentData ? currentData.angle : 0;
  
  // 軌跡のポイントを計算
  const trajectoryPoints = data.slice(-50).map(point => {
    const x = length * Math.sin(point.angle);
    const y = -length * Math.cos(point.angle);
    return new THREE.Vector3(x, y, 0);
  });
  
  return (
    <>
      {/* 振り子の支点 */}
      <Sphere position={[0, 0, 0]} args={[0.05]} castShadow receiveShadow>
        <meshStandardMaterial color="#666" />
      </Sphere>
      
      {/* 振り子の紐 */}
      <Line
        points={[
          [0, 0, 0],
          [bobPosition.x, bobPosition.y, 0],
        ]}
        color="#444"
        lineWidth={2}
      />
      
      {/* 振り子の重り */}
      <Sphere position={[bobPosition.x, bobPosition.y, 0]} args={[0.15]} castShadow receiveShadow>
        <meshStandardMaterial color="royalblue" />
      </Sphere>
      
      {/* 振り子の軌跡 */}
      {trajectoryPoints.length > 1 && (
        <Line
          points={trajectoryPoints}
          color="rgba(70, 130, 180, 0.5)"
          lineWidth={1}
        />
      )}
      
      {/* 基準面（地面） */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -length - 0.15, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
    </>
  );
}

export function PendulumMotionVisualization({ state }: PendulumMotionVisualizationProps) {
  return (
    <Pendulum state={state} />
  );
}