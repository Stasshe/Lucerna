'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SimulationLayout } from '@/components/simulation/SimulationLayout';
import { SimulationCanvas } from '@/components/simulation/visualizations/SimulationCanvas';
import { SimulationChart } from '@/components/simulation/visualizations/SimulationChart';
import { ProjectileMotionVisualization } from '@/components/simulation/visualizations/ProjectileMotionVisualization';
import { 
  projectileMotionInitialState, 
  calculateProjectileMotion, 
  resetProjectileMotion 
} from '@/lib/simulations/mechanics/projectileMotion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

export default function ProjectileMotionPage() {
  // シミュレーション状態
  const [simulationState, setSimulationState] = useState(projectileMotionInitialState);
  
  // アニメーションフレーム追跡用
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  
  // アニメーションループ
  const animate = (time: number) => {
    if (previousTimeRef.current !== null) {
      const deltaTime = (time - previousTimeRef.current) / 1000;
      setSimulationState(prevState => 
        calculateProjectileMotion(prevState, deltaTime * prevState.speed)
      );
    }
    
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };
  
  // シミュレーション開始
  const handlePlay = () => {
    setSimulationState(prevState => ({
      ...prevState,
      isRunning: true
    }));
  };
  
  // シミュレーション一時停止
  const handlePause = () => {
    setSimulationState(prevState => ({
      ...prevState,
      isRunning: false
    }));
  };
  
  // シミュレーションリセット
  const handleReset = () => {
    setSimulationState(prevState => 
      resetProjectileMotion({
        ...prevState,
        isRunning: false
      })
    );
  };
  
  // 再生速度変更
  const handleSpeedChange = (speed: number) => {
    setSimulationState(prevState => ({
      ...prevState,
      speed
    }));
  };
  
  // パラメータ変更
  const handleParameterChange = (id: string, value: number) => {
    setSimulationState(prevState => ({
      ...prevState,
      parameters: {
        ...prevState.parameters,
        [id]: {
          ...prevState.parameters[id],
          value
        }
      }
    }));
  };
  
  // アニメーションフレームの開始と終了
  useEffect(() => {
    if (simulationState.isRunning) {
      requestRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [simulationState.isRunning]);
  
  // パラメータ変更時にシミュレーションデータを更新
  useEffect(() => {
    if (!simulationState.isRunning) {
      setSimulationState(prevState => resetProjectileMotion(prevState));
    }
  }, [
    simulationState.parameters.initialSpeed.value,
    simulationState.parameters.launchAngle.value,
    simulationState.parameters.gravity.value,
    simulationState.parameters.initialHeight.value
  ]);
  
  // グラフデータの準備
  const positionData = (simulationState.simulationData.data as ProjectileDataPoint[]).map((point: ProjectileDataPoint) => ({
    time: point.time,
    height: point.height,
    distance: point.distance
  }));
  
  const energyData = (simulationState.simulationData.data as ProjectileDataPoint[]).map((point: ProjectileDataPoint) => ({
    time: point.time,
    kinetic: point.kineticEnergy,
    potential: point.potentialEnergy,
    total: point.totalEnergy
  }));
  
  // 理論解説用コンテンツ
  const theoryContent = (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">投射運動</h3>
      
      <div className="space-y-2">
        <h4 className="text-lg font-semibold">投射運動とは</h4>
        <p>
          投射運動とは、初速度を与えられた物体が重力のみを受けて描く放物線運動のことです。
          空気抵抗を無視した場合、物体は水平方向に等速直線運動、垂直方向に等加速度運動を行います。
        </p>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-lg font-semibold">運動方程式</h4>
        <div className="p-2 bg-muted rounded">
          <p>水平方向の位置：x = v₀·cos(θ)·t</p>
          <p>垂直方向の位置：y = h₀ + v₀·sin(θ)·t - (1/2)·g·t²</p>
          <p>水平方向の速度：vₓ = v₀·cos(θ) (一定)</p>
          <p>垂直方向の速度：vᵧ = v₀·sin(θ) - g·t</p>
          <p>ここで、v₀は初速度、θは発射角度、g は重力加速度、h₀は初期高さ、tは時間です。</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-lg font-semibold">重要なパラメータ</h4>
        <div className="p-2 bg-muted rounded">
          <p>
            【最大飛距離】
            平地からの投射(h₀=0)で、発射角度θ=45°のとき最大となり、
            R = v₀²·sin(2θ)/g = v₀²/g (θ=45°のとき)
          </p>
          <p>
            【最高点の高さ】
            H = h₀ + v₀²·sin²(θ)/(2g)
          </p>
          <p>
            【滞空時間】
            T = (v₀·sin(θ) + √[(v₀·sin(θ))² + 2gh₀])/g
          </p>
        </div>
      </div>
    </div>
  );
  
  // ヒント用コンテンツ
  const tipsContent = (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">使い方のヒント</h3>
      
      <ul className="list-disc list-inside space-y-2">
        <li>
          <strong>発射角度を45°</strong>に設定すると、水平面上での飛距離が最大になります。これは理論でも証明されています。
        </li>
        <li>
          <strong>初期高さ</strong>を変えることで、高所からの投射を観察できます。高所からの場合、最大飛距離を得る角度は45°より小さくなります。
        </li>
        <li>
          <strong>重力加速度</strong>を変更すると、月面や他の惑星での投射運動を観察できます。月面では地球の約1/6（1.6 m/s²）です。
        </li>
        <li>
          投射物が飛行中に<strong>速度ベクトル</strong>（赤い線）の向きが変わることを観察してください。水平成分は一定で、垂直成分のみが変化します。
        </li>
        <li>
          エネルギーグラフでは、<strong>位置エネルギー</strong>と<strong>運動エネルギー</strong>が常に交換されていますが、それらの和（<strong>全エネルギー</strong>）は保存されることを確認してください。
        </li>
      </ul>
    </div>
  );
  
  return (
    <SimulationLayout
      title="投射運動"
      description="斜め方向に投げられた物体の放物線運動をシミュレーションします。発射角度や初速度を変更して、物体の飛距離や最高点がどのように変わるかを観察しましょう。"
      parameters={simulationState.parameters}
      isRunning={simulationState.isRunning}
      speed={simulationState.speed}
      onParameterChange={handleParameterChange}
      onPlay={handlePlay}
      onPause={handlePause}
      onReset={handleReset}
      onSpeedChange={handleSpeedChange}
      theory={theoryContent}
      additionalInfo={tipsContent}
    >
      <Tabs defaultValue="3d">
        <TabsList className="mb-4">
          <TabsTrigger value="3d">2Dビュー</TabsTrigger>
          <TabsTrigger value="position">位置グラフ</TabsTrigger>
          <TabsTrigger value="energy">エネルギーグラフ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="3d" className="h-full">
          <SimulationCanvas
            cameraPosition={[15, 10, 30]}
            cameraFov={60}
            backgroundColor="#f5f5f5"
          >
            <ProjectileMotionVisualization state={simulationState} />
          </SimulationCanvas>
        </TabsContent>
        
        <TabsContent value="position" className="h-full">
          <SimulationChart
            data={positionData}
            xAxisKey="time"
            xAxisLabel="時間 (s)"
            yAxisLabel="位置 (m)"
            series={[
              { key: 'height', name: '高さ', color: '#3b82f6' },
              { key: 'distance', name: '水平距離', color: '#ef4444' }
            ]}
          />
        </TabsContent>
        
        <TabsContent value="energy" className="h-full">
          <SimulationChart
            data={energyData}
            xAxisKey="time"
            xAxisLabel="時間 (s)"
            yAxisLabel="エネルギー (J)"
            series={[
              { key: 'kinetic', name: '運動エネルギー', color: '#3b82f6' },
              { key: 'potential', name: '位置エネルギー', color: '#10b981' },
              { key: 'total', name: '全エネルギー', color: '#8b5cf6' }
            ]}
          />
        </TabsContent>
      </Tabs>
    </SimulationLayout>
  );
}