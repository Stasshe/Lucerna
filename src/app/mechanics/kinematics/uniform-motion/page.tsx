'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SimulationLayout } from '@/components/simulation/SimulationLayout';
import { SimulationCanvas } from '@/components/simulation/visualizations/SimulationCanvas';
import { SimulationChart } from '@/components/simulation/visualizations/SimulationChart';
import { UniformMotionVisualization } from '@/components/simulation/visualizations/UniformMotionVisualization';
import { 
  uniformMotionInitialState, 
  calculateUniformMotion, 
  resetUniformMotion 
} from '@/lib/simulations/mechanics/uniformMotion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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

export default function UniformMotionPage() {
  // シミュレーション状態
  const [simulationState, setSimulationState] = useState(uniformMotionInitialState);
  
  // アニメーションフレーム追跡用
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  
  // アニメーションループ
  const animate = (time: number) => {
    if (previousTimeRef.current !== null) {
      const deltaTime = (time - previousTimeRef.current) / 1000;
      setSimulationState(prevState => 
        calculateUniformMotion(prevState, deltaTime * prevState.speed)
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
      resetUniformMotion({
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
      setSimulationState(prevState => resetUniformMotion(prevState));
    }
  }, [
    simulationState.parameters.initialPosition.value,
    simulationState.parameters.initialVelocity.value,
    simulationState.parameters.acceleration.value
  ]);
  
  // グラフデータの準備
  const chartData = (simulationState.simulationData.trail as TrailPoint[]).map((point: TrailPoint) => ({
    time: point.time,
    position: point.position,
    velocity: point.velocity
  }));
  
  const energyChartData = (simulationState.simulationData.energyData as EnergyDataPoint[]).map((point: EnergyDataPoint) => ({
    time: point.time,
    kinetic: point.kinetic,
    potential: point.potential,
    total: point.total
  }));
  
  // 理論解説用コンテンツ
  const theoryContent = (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">等速直線運動と等加速度運動</h3>
      
      <div className="space-y-2">
        <h4 className="text-lg font-semibold">等速直線運動</h4>
        <p>
          加速度がゼロの状態での運動を等速直線運動といいます。速度は一定で、位置は時間に比例して変化します。
        </p>
        <div className="p-2 bg-muted rounded">
          <p>位置：x = x₀ + v·t</p>
          <p>速度：v = 一定</p>
          <p>加速度：a = 0</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-lg font-semibold">等加速度運動</h4>
        <p>
          加速度が一定の状態での運動を等加速度直線運動といいます。速度は時間に比例して変化し、位置は時間の二次関数となります。
        </p>
        <div className="p-2 bg-muted rounded">
          <p>位置：x = x₀ + v₀·t + (1/2)·a·t²</p>
          <p>速度：v = v₀ + a·t</p>
          <p>加速度：a = 一定</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-lg font-semibold">エネルギー保存則</h4>
        <p>
          運動エネルギーと位置エネルギー（重力による位置エネルギー）の和は保存されます。
        </p>
        <div className="p-2 bg-muted rounded">
          <p>運動エネルギー：E_k = (1/2)·m·v²</p>
          <p>位置エネルギー：E_p = m·g·h</p>
          <p>力学的エネルギー：E = E_k + E_p = 一定（保存される）</p>
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
          <strong>初速度を0、加速度を変更</strong>して、自由落下や投げ上げ運動をシミュレーションできます。
        </li>
        <li>
          <strong>加速度を0</strong>にすると等速直線運動を、<strong>加速度に値を設定</strong>すると等加速度運動を観察できます。
        </li>
        <li>
          速度と位置のグラフを観察し、等速運動では位置が直線的に変化し、等加速度運動では二次曲線を描くことを確認しましょう。
        </li>
        <li>
          エネルギーグラフでは、<strong>加速度がマイナス</strong>の場合、重力場での運動として位置エネルギーが計算されます。
        </li>
        <li>
          パラメータを変更して、エネルギー保存則が成り立つことを確認してみましょう。
        </li>
      </ul>
    </div>
  );
  
  return (
    <SimulationLayout
      title="等速直線運動・等加速度運動"
      description="加速度がゼロまたは一定の物体の運動をシミュレーションします。パラメータを変更して物体の運動を観察しましょう。"
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
          <TabsTrigger value="position">位置・速度グラフ</TabsTrigger>
          <TabsTrigger value="energy">エネルギーグラフ</TabsTrigger>
        </TabsList>
        
        <TabsContent value="3d" className="h-full">
          <SimulationCanvas
            cameraPosition={[0, 3, 10]}
            backgroundColor="#f5f5f5"
            orbitControls={false}
            is2D={true}
          >
            <UniformMotionVisualization state={simulationState} />
          </SimulationCanvas>
        </TabsContent>
        
        <TabsContent value="position" className="h-full">
          <SimulationChart
            data={chartData}
            xAxisKey="time"
            xAxisLabel="時間 (s)"
            yAxisLabel="位置 (m) / 速度 (m/s)"
            series={[
              { key: 'position', name: '位置', color: '#3b82f6' },
              { key: 'velocity', name: '速度', color: '#ef4444' }
            ]}
          />
        </TabsContent>
        
        <TabsContent value="energy" className="h-full">
          <SimulationChart
            data={energyChartData}
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