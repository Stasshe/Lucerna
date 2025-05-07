'use client';

import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SimulationParameter } from '@/types';
import { ParameterSlider } from '@/components/simulation/controls/ParameterSlider';
import { PlaybackControls } from '@/components/simulation/controls/PlaybackControls';

interface SimulationLayoutProps {
  title: string;
  description: string;
  children: React.ReactNode;
  parameters: Record<string, SimulationParameter>;
  isRunning: boolean;
  speed: number;
  onParameterChange: (id: string, value: number) => void;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  additionalInfo?: React.ReactNode;
  theory?: React.ReactNode;
}

export function SimulationLayout({
  title,
  description,
  children,
  parameters,
  isRunning,
  speed,
  onParameterChange,
  onPlay,
  onPause,
  onReset,
  onSpeedChange,
  additionalInfo,
  theory
}: SimulationLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">{title}</h1>
      <p className="text-muted-foreground mb-8">{description}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* シミュレーション表示エリア */}
        <Card className="lg:col-span-2">
          <CardContent className="p-6">
            <div className="relative">
              {/* シミュレーションキャンバス - 高さを調整 */}
              <div className="h-[500px]">
                {children}
              </div>
              
              {/* 再生コントロール - 高いz-indexを指定して前面に表示 */}
              <div className="mt-4 pb-2 relative z-20">
                <PlaybackControls
                  isRunning={isRunning}
                  speed={speed}
                  onPlay={onPlay}
                  onPause={onPause}
                  onReset={onReset}
                  onSpeedChange={onSpeedChange}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* パラメータ調整エリア */}
        <Card>
          <CardHeader>
            <CardTitle>パラメータ設定</CardTitle>
            <CardDescription>
              値を調整して物理現象の変化を観察しましょう
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.values(parameters).map((param) => (
                <ParameterSlider
                  key={param.id}
                  parameter={param}
                  onChange={onParameterChange}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 追加情報タブ */}
      <Tabs defaultValue="theory" className="mt-8">
        <TabsList>
          <TabsTrigger value="theory">理論解説</TabsTrigger>
          <TabsTrigger value="tips">使い方のヒント</TabsTrigger>
        </TabsList>
        <TabsContent value="theory" className="p-4 bg-card rounded-md mt-2">
          {theory || (
            <div>
              <h3 className="text-xl font-bold mb-2">理論解説</h3>
              <p>このシミュレーションの背景にある物理理論についての説明です。</p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="tips" className="p-4 bg-card rounded-md mt-2">
          {additionalInfo || (
            <div>
              <h3 className="text-xl font-bold mb-2">使い方のヒント</h3>
              <p>パラメータを変更して、その効果を観察してみましょう。</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}