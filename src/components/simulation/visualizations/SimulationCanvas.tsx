'use client';

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

interface SimulationCanvasProps {
  children: React.ReactNode;
  cameraPosition?: [number, number, number];
  cameraFov?: number;
  backgroundColor?: string;
  orbitControls?: boolean;
}

export function SimulationCanvas({
  children,
  cameraPosition = [0, 2, 5],
  cameraFov = 75,
  backgroundColor = '#f0f0f0',
  orbitControls = true
}: SimulationCanvasProps) {
  return (
    <div className="w-full h-full min-h-[400px] rounded-lg overflow-hidden">
      <Canvas
        camera={{ position: cameraPosition, fov: cameraFov }}
        gl={{ antialias: true }}
        shadows
        style={{ background: backgroundColor }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        {children}
        {orbitControls && <OrbitControls />}
      </Canvas>
    </div>
  );
}