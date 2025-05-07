'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import { Expand, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SimulationCanvasProps {
  children: React.ReactNode;
  cameraPosition?: [number, number, number];
  cameraFov?: number;
  backgroundColor?: string;
  orbitControls?: boolean;
  is2D?: boolean; // 2Dモード（カメラ固定）の場合はtrue
}

export function SimulationCanvas({
  children,
  cameraPosition = [0, 2, 5],
  cameraFov = 75,
  backgroundColor = '#f0f0f0',
  orbitControls = true,
  is2D = false
}: SimulationCanvasProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        console.error(`フルスクリーンに切り替えられませんでした: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  // フルスクリーン状態の監視
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);
  
  // 完全な2Dモードのためのビューポートと設定を調整
  const viewportConfig = is2D ? {
    // X-Y平面で完全上からの2D視点
    position: [0, 0, 50], // Z軸方向から見下ろす
    zoom: 30, // 適切なズームレベル
    far: 2000
  } : {};

  return (
    <div 
      ref={containerRef}
      className={`relative w-full ${isFullscreen ? 'h-screen' : 'h-[600px]'} rounded-lg overflow-hidden`}
    >
      <Button
        variant="outline"
        size="icon"
        className="absolute top-2 right-2 z-10 bg-background/80 backdrop-blur-sm"
        onClick={toggleFullscreen}
        title={isFullscreen ? "フルスクリーン解除" : "フルスクリーン表示"}
      >
        {isFullscreen ? (
          <Minimize className="h-4 w-4" />
        ) : (
          <Expand className="h-4 w-4" />
        )}
      </Button>
      <Canvas
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
        
        {is2D ? (
          // 完全な2D表示用のOrthographicCamera
          <OrthographicCamera
            makeDefault
            position={[0, 0, 50]}
            zoom={30}
            near={1}
            far={1000}
          />
        ) : (
          // 通常の3Dカメラ
          <perspectiveCamera
            position={cameraPosition}
            fov={cameraFov}
          />
        )}
        
        {children}
        {orbitControls && !is2D && <OrbitControls />}
      </Canvas>
    </div>
  );
}