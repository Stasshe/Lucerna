'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface DataPoint {
  [key: string]: number;
}

interface SimulationChartProps {
  data: DataPoint[];
  xAxisKey: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  series: {
    key: string;
    name: string;
    color: string;
  }[];
}

export function SimulationChart({
  data,
  xAxisKey,
  xAxisLabel,
  yAxisLabel,
  series
}: SimulationChartProps) {
  // データが空の場合のサンプルデータを作成
  const displayData = data.length > 0 ? data : [
    { [xAxisKey]: 0, ...series.reduce((acc, s) => ({ ...acc, [s.key]: 0 }), {}) },
    { [xAxisKey]: 1, ...series.reduce((acc, s) => ({ ...acc, [s.key]: 0 }), {}) }
  ];

  return (
    <div className="w-full h-full" style={{ minHeight: '600px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={displayData}
          margin={{ top: 20, right: 30, left: 30, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey={xAxisKey}
            label={{ value: xAxisLabel, position: 'insideBottomRight', offset: -10 }}
          />
          <YAxis label={{ value: yAxisLabel, angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          {series.map((s) => (
            <Line
              key={s.key}
              type="monotone"
              dataKey={s.key}
              name={s.name}
              stroke={s.color}
              activeDot={{ r: 6 }}
              isAnimationActive={true}
              animationDuration={500}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}