'use client';

import React from 'react';
import { Line, Text, Box } from '@react-three/drei';
import { SimulationState } from '@/types';

interface TrajectoryPoint {
  x: number;
  y: number;
  time: number;
  vx: number;
  vy: number;
}

interface ProjectileMotionVisualizationProps {
  state: SimulationState;
}

export function ProjectileMotionVisualization({ state }: ProjectileMotionVisualizationProps) {
  const { x, y, vx, vy, trajectory, maxHeight, range, hasLanded } = state.simulationData;
  
  // オブジェクトのサイズを質量に応じて変更
  const mass = state.parameters.mass.value;
  const objectSize = 0.2 + mass * 0.1; // 質量に応じてサイズを調整
  
  // 表示範囲の調整（初速度と角度に応じて自動調整）
  const initialSpeed = state.parameters.initialSpeed.value;
  const gravity = state.parameters.gravity.value;
  const launchAngle = state.parameters.launchAngle.value * Math.PI / 180;
  
  // 理論上の最大飛距離と最高点の計算（初期位置を考慮）
  const initialHeight = state.parameters.initialHeight.value;
  const theoreticalRange = (initialSpeed * initialSpeed * Math.sin(2 * launchAngle)) / gravity;
  const theoreticalMaxHeight = initialHeight + (initialSpeed * initialSpeed * Math.sin(launchAngle) * Math.sin(launchAngle)) / (2 * gravity);
  
  // 表示範囲を適切に設定
  const xMax = Math.max(25, Math.ceil(theoreticalRange * 1.2));
  const yMax = Math.max(15, Math.ceil(theoreticalMaxHeight * 1.5));
  
  // 地面のサイズを調整
  const groundWidth = xMax * 2;
  const groundDepth = 10;
  
  // 軌跡のポイントを2D座標に変換
  const trailPoints = (trajectory as TrajectoryPoint[]).map(point => [point.x, point.y, 0]);
  
  // 速度ベクトルの表示のためのスケール係数
  const velocityScale = 0.25;
  
  return (
    <>
      {/* 地面 */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[xMax / 2, 0, 0]} 
        receiveShadow
      >
        <planeGeometry args={[groundWidth, groundDepth]} />
        <meshStandardMaterial color="#8BC34A" />
      </mesh>
      
      {/* X軸 */}
      <Line
        points={[[0, 0, 0], [xMax, 0, 0]]}
        color="black"
        lineWidth={1}
      />
      
      {/* Y軸 */}
      <Line
        points={[[0, 0, 0], [0, yMax, 0]]}
        color="black"
        lineWidth={1}
      />
      
      {/* X軸の目盛り */}
      {Array.from({ length: xMax / 5 + 1 }).map((_, i) => {
        const xTick = i * 5;
        return (
          <React.Fragment key={`x-${xTick}`}>
            <Line
              points={[[xTick, -0.1, 0], [xTick, 0.1, 0]]}
              color="black"
              lineWidth={1}
            />
            <Text
              position={[xTick, -0.5, 0]}
              fontSize={0.4}
              color="black"
              anchorX="center"
              anchorY="top"
            >
              {xTick}m
            </Text>
          </React.Fragment>
        );
      })}
      
      {/* Y軸の目盛り */}
      {Array.from({ length: yMax / 5 + 1 }).map((_, i) => {
        const yTick = i * 5;
        if (yTick === 0) return null; // 0mは表示しない
        return (
          <React.Fragment key={`y-${yTick}`}>
            <Line
              points={[[-0.1, yTick, 0], [0.1, yTick, 0]]}
              color="black"
              lineWidth={1}
            />
            <Text
              position={[-0.5, yTick, 0]}
              fontSize={0.4}
              color="black"
              anchorX="right"
              anchorY="middle"
            >
              {yTick}m
            </Text>
          </React.Fragment>
        );
      })}
      
      {/* 投射物体 */}
      <Box
        position={[x, y, 0]}
        args={[objectSize, objectSize, objectSize]}
        castShadow
      >
        <meshStandardMaterial color={hasLanded ? "#f44336" : "#2196F3"} />
      </Box>
      
      {/* 速度ベクトル */}
      {!hasLanded && (
        <Line
          points={[
            [x, y, 0],
            [x + vx * velocityScale, y + vy * velocityScale, 0]
          ]}
          color="red"
          lineWidth={2}
        />
      )}
      
      {/* 軌跡の表示 */}
      {trailPoints.length > 1 && (
        <Line
          points={trailPoints as [number, number, number][]}
          color="#9C27B0"
          lineWidth={1.5}
        />
      )}
      
      {/* 計測データの表示 */}
      <group position={[xMax * 0.75, yMax * 0.8, 0]}>
        <Text
          position={[0, 0, 0]}
          fontSize={0.6}
          color="black"
          anchorX="center"
          anchorY="top"
        >
          最高点: {maxHeight.toFixed(2)} m
        </Text>
        <Text
          position={[0, -1, 0]}
          fontSize={0.6}
          color="black"
          anchorX="center"
          anchorY="top"
        >
          到達距離: {hasLanded ? range.toFixed(2) : "---"} m
        </Text>
        <Text
          position={[0, -2, 0]}
          fontSize={0.6}
          color="black"
          anchorX="center"
          anchorY="top"
        >
          滞空時間: {hasLanded ? state.simulationData.flightTime.toFixed(2) : "---"} s
        </Text>
      </group>
    </>
  );
}