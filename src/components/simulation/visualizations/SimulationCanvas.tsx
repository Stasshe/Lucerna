'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, OrthographicCamera } from '@react-three/drei';
import { Expand, Minimize } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SimulationCanvasProps {
  children: React.ReactNode;
  height?: string; // heightプロパティをオプショナルに変更
  cameraPosition?: [number, number, number];
  cameraFov?: number;
  backgroundColor?: string;
  orbitControls?: boolean;
  is2D?: boolean; // 2Dモード（カメラ固定）の場合はtrue
}

export function SimulationCanvas({
  children,
  height = '500px', // デフォルト値を600pxから500pxに変更
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

  return (
    <div 
      ref={containerRef}
      className={`relative w-full ${isFullscreen ? 'h-screen' : ''} rounded-lg overflow-hidden`}
      style={{ height: !isFullscreen ? height : undefined }} // 通常時にheightを適用
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
          // 2D表示用のOrthographicCamera
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
        
        {/* 2Dモードでもカメラ移動を可能にする */}
        {orbitControls && (
          <OrbitControls 
            enableRotate={!is2D} // 2Dモードでは回転を無効
            enableZoom={true}    // ズームは常に有効
            enablePan={true}     // パン（移動）も常に有効
            // 2Dモードの場合、上下方向の回転を制限
            minPolarAngle={is2D ? Math.PI / 2 : 0}
            maxPolarAngle={is2D ? Math.PI / 2 : Math.PI}
          />
        )}
      </Canvas>
    </div>
  );
}