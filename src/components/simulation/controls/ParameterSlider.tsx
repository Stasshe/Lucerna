'use client';

import React from 'react';
import { Slider } from '@/components/ui/slider';
import { SimulationParameter } from '@/types';

interface ParameterSliderProps {
  parameter: SimulationParameter;
  onChange: (id: string, value: number) => void;
}

export function ParameterSlider({ parameter, onChange }: ParameterSliderProps) {
  const { id, name, value, min, max, step, unit, label } = parameter;

  const handleChange = (values: number[]) => {
    onChange(id, values[0]);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <label htmlFor={id} className="text-sm font-medium">
          {label}
        </label>
        <div className="text-sm">
          {value.toFixed(2)} {unit}
        </div>
      </div>
      <Slider
        id={id}
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={handleChange}
      />
    </div>
  );
}