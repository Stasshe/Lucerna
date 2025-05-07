'use client';

import React, { useState, useEffect, useRef } from 'react';
import { SimulationLayout } from '@/components/simulation/SimulationLayout';
import { SimulationCanvas } from '@/components/simulation/visualizations/SimulationCanvas';
import { SimulationChart } from '@/components/simulation/visualizations/SimulationChart';
import { PendulumMotionVisualization } from '@/components/simulation/visualizations/PendulumMotionVisualization';
import { 
  pendulumMotionInitialState, 
  calculatePendulumMotion, 
  resetPendulumMotion,
  createFreshPendulumState,
  PendulumSimulationState
} from '@/lib/simulations/mechanics/pendulumMotion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function PendulumMotionPage() {
  // シミュレーション状態
  const [simulationState, setSimulationState] = useState<PendulumSimulationState>(pendulumMotionInitialState);
  
  // アニメーションフレーム追跡用
  const requestRef = useRef<number | null>(null);
  const previousTimeRef = useRef<number | null>(null);
  const isResetRef = useRef<boolean>(false); // リセット状態を追跡する参照
  
  // アニメーションループ
  const animate = (time: number) => {
    // リセット直後の場合、時間参照をリセットして次のフレームを待つ
    if (isResetRef.current) {
      previousTimeRef.current = time;
      isResetRef.current = false;
      requestRef.current = requestAnimationFrame(animate);
      return;
    }
    
    if (previousTimeRef.current !== null) {
      const deltaTime = (time - previousTimeRef.current) / 1000;
      setSimulationState(prevState => 
        calculatePendulumMotion(prevState, deltaTime * prevState.speed)
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
    // リセット処理の前にアニメーションフレームをキャンセル
    if (requestRef.current !== null) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    previousTimeRef.current = null;
    isResetRef.current = true; // リセット状態をマーク
    
    // 完全に新しいシミュレーション状態を作成して設定
    const freshState = createFreshPendulumState(simulationState.parameters);
    setSimulationState(freshState);
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
      // アニメーションが再開される前に、リセット直後かどうかチェック
      if (isResetRef.current || previousTimeRef.current === null) {
        previousTimeRef.current = null; // 時間参照を確実にリセット
      }
      requestRef.current = requestAnimationFrame(animate);
    }
    
    return () => {
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };
  }, [simulationState.isRunning]);
  
  // パラメータ変更時にシミュレーションデータを更新
  useEffect(() => {
    if (!simulationState.isRunning) {
      // 現在のパラメータで新しい状態を作成
      const freshState = createFreshPendulumState({
        ...simulationState.parameters
      });
      setSimulationState(freshState);
      
      // アニメーション参照もリセット
      previousTimeRef.current = null;
      isResetRef.current = true;
    }
  }, [
    simulationState.parameters.length.value,
    simulationState.parameters.gravity.value,
    simulationState.parameters.initialAngle.value,
    simulationState.parameters.dampingFactor.value
  ]);
  
  // グラフデータの準備 - 型キャストを避け、安全にアクセス
  const motionData = simulationState.simulationData.data.map(point => ({
    time: point.time,
    angle: point.angle * 180 / Math.PI, // ラジアンから度に変換
    angularVelocity: point.angularVelocity * 180 / Math.PI  // ラジアンから度に変換
  }));
  
  // エネルギーデータ
  const energyData = simulationState.simulationData.data.map(point => ({
    time: point.time,
    potentialEnergy: point.potentialEnergy,
    kineticEnergy: point.kineticEnergy,
    totalEnergy: point.totalEnergy
  }));
  
  // 理論解説用コンテンツ
  const theoryContent = (
    <div className="space-y-4">
      <h3 className="text-xl font-bold">単振り子</h3>
      
      <div className="space-y-2">
        <h4 className="text-lg font-semibold">単振り子とは</h4>
        <p>
          単振り子とは、質点が糸で吊るされ、重力の影響下で振動する系です。
          単振り子運動は、角度が小さいとき（sin θ ≈ θが成り立つとき）は単振動になります。
        </p>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-lg font-semibold">運動方程式</h4>
        <div className="p-2 bg-muted rounded">
          <p>d²θ/dt² = -(g/L)·sin(θ) - b·dθ/dt</p>
          <p>ここで、</p>
          <p>θ: 垂直線からの角度</p>
          <p>g: 重力加速度</p>
          <p>L: 振り子の長さ</p>
          <p>b: 減衰係数（空気抵抗などによる）</p>
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-lg font-semibold">小角近似と周期</h4>
        <div className="p-2 bg-muted rounded">
          <p>
            角度が小さいとき（θ &lt; 10°程度）、sin θ ≈ θ と近似できます。
            このとき、減衰がなければ、単振り子の周期は：
          </p>
          <p>T = 2π·√(L/g)</p>
          <p>
            これは、振り子の振幅（最大角度）に依存しません。
            ただし、角度が大きくなると近似が成り立たなくなり、実際の周期は上記の式より長くなります。
          </p>
        </div>
      </div>
      
      <div className="space-y-2">
        <h4 className="text-lg font-semibold">エネルギー</h4>
        <div className="p-2 bg-muted rounded">
          <p>運動エネルギー: K = (1/2)·m·L²·(dθ/dt)²</p>
          <p>位置エネルギー: U = m·g·L·(1-cos θ)</p>
          <p>
            減衰がない場合、全エネルギー（K+U）は一定です。
            減衰がある場合、全エネルギーは時間とともに減少します。
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
          <strong>周期の確認</strong>：振り子の長さを変えると周期が変化します。長さを2倍にすると周期は√2倍になることを確認しましょう。
        </li>
        <li>
          <strong>減衰の影響</strong>：減衰係数を大きくすると、振動が徐々に小さくなっていく様子を観察できます。減衰係数0の場合と比較してみましょう。
        </li>
        <li>
          <strong>初期角度の影響</strong>：小さな角度（10°以下）では単振動に近い動きをしますが、大きな角度ではどうなるか観察してみましょう。周期が変わるか確認してください。
        </li>
        <li>
          <strong>エネルギー保存</strong>：減衰がない場合、運動エネルギーと位置エネルギーが交換されますが、全エネルギーは保存されます。減衰がある場合、全エネルギーは時間とともに減少します。
        </li>
        <li>
          <strong>位相図の観察</strong>：角度と角速度の関係を示す位相図は、振り子の振る舞いを理解するのに役立ちます。減衰の有無によって位相図がどう変化するか注目してください。
        </li>
      </ul>
    </div>
  );
  
  return (
    <SimulationLayout
      title="単振り子運動"
      description="質点が糸で吊るされた単振り子の運動をシミュレーションします。振り子の長さ、初期角度、重力加速度、減衰係数を変化させることで、周期や減衰の様子を観察できます。"
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
      <Tabs defaultValue="visualization" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="visualization">可視化</TabsTrigger>
          <TabsTrigger value="angle">角度・角速度</TabsTrigger>
          <TabsTrigger value="energy">エネルギー</TabsTrigger>
        </TabsList>
        
        <TabsContent value="visualization" className="h-full">
          <SimulationCanvas height="500px">
            <PendulumMotionVisualization state={simulationState} />
          </SimulationCanvas>
        </TabsContent>
        
        <TabsContent value="angle" className="h-full">
          <SimulationChart
            data={motionData}
            xAxisKey="time"
            xAxisLabel="時間 (s)"
            yAxisLabel="角度・角速度"
            series={[
              { key: 'angle', name: '角度 (°)', color: '#2563eb' },
              { key: 'angularVelocity', name: '角速度 (°/s)', color: '#16a34a' }
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
              { key: 'potentialEnergy', name: '位置エネルギー', color: '#2563eb' },
              { key: 'kineticEnergy', name: '運動エネルギー', color: '#16a34a' },
              { key: 'totalEnergy', name: '全エネルギー', color: '#dc2626' }
            ]}
          />
        </TabsContent>
      </Tabs>
    </SimulationLayout>
  );
}