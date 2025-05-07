'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Line, Text } from '@react-three/drei';
import { SimulationState } from '@/types';

interface TrailPoint {
  time: number;
  position: number;
  velocity: number;
}

interface UniformMotionVisualizationProps {
  state: SimulationState;
}

export function UniformMotionVisualization({ state }: UniformMotionVisualizationProps) {
  const { position, velocity, trail } = state.simulationData;
  
  // オブジェクトのサイズを質量に応じて変更
  const mass = state.parameters.mass.value;
  const objectSize = 0.2 + mass * 0.1; // 質量に応じてサイズを調整
  
  // X軸の範囲（調整可能）
  const xMin = -15;
  const xMax = 15;
  
  // 物体の色を速度に応じて変更（速いほど赤く）
  const velocityColor = () => {
    const absVelocity = Math.abs(velocity);
    const normalizedVelocity = Math.min(absVelocity / 10, 1); // 10 m/sを最大値として正規化
    
    // 低速（青）から高速（赤）への色の変化
    return `rgb(
      ${Math.floor(255 * normalizedVelocity)},
      ${Math.floor(100 * (1 - normalizedVelocity))},
      ${Math.floor(255 * (1 - normalizedVelocity))}
    )`;
  };
  
  // トレイル（軌跡）のポイントを作成
  const trailPoints = (trail as TrailPoint[]).map((point: TrailPoint) => [point.position, 0, 0]);
  
  return (
    <>
      {/* 地面 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -objectSize / 2, 0]} receiveShadow>
        <planeGeometry args={[30, 5]} />
        <meshStandardMaterial color="#f0f0f0" />
      </mesh>
      
      {/* X軸（運動の軸） */}
      <Line
        points={[[xMin, 0, 0], [xMax, 0, 0]]}
        color="black"
        lineWidth={1}
      />
      
      {/* X軸の目盛り */}
      {Array.from({ length: xMax - xMin + 1 }).map((_, i) => {
        const x = xMin + i;
        return (
          <React.Fragment key={x}>
            <Line
              points={[[x, -0.1, 0], [x, 0.1, 0]]}
              color="black"
              lineWidth={1}
            />
            <Text
              position={[x, -0.3, 0]}
              fontSize={0.3}
              color="black"
              anchorX="center"
              anchorY="top"
            >
              {x}
            </Text>
          </React.Fragment>
        );
      })}
      
      {/* 移動物体 */}
      <Box
        position={[position, 0, 0]}
        args={[objectSize, objectSize, objectSize]}
        castShadow
      >
        <meshStandardMaterial color={velocityColor()} />
      </Box>
      
      {/* 速度と位置の表示 */}
      <Text
        position={[position, objectSize + 0.5, 0]}
        fontSize={0.4}
        color="black"
        anchorX="center"
        anchorY="bottom"
      >
        位置: {position.toFixed(2)} m
      </Text>
      <Text
        position={[position, objectSize + 0.9, 0]}
        fontSize={0.4}
        color="black"
        anchorX="center"
        anchorY="bottom"
      >
        速度: {velocity.toFixed(2)} m/s
      </Text>
      
      {/* 軌跡の表示 */}
      {trailPoints.length > 1 && (
        <Line
          points={trailPoints as [number, number, number][]}
          color="rgba(0, 100, 200, 0.5)"
          lineWidth={2}
        />
      )}
    </>
  );
}