'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  FastForward, 
  Rewind
} from 'lucide-react';

interface PlaybackControlsProps {
  isRunning: boolean;
  speed: number;
  onPlay: () => void;
  onPause: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
}

const speedOptions = [0.25, 0.5, 1, 2, 4];

export function PlaybackControls({
  isRunning,
  speed,
  onPlay,
  onPause,
  onReset,
  onSpeedChange
}: PlaybackControlsProps) {
  return (
    <div className="flex items-center justify-between flex-wrap bg-card p-3 rounded-md shadow z-10 relative">
      <div className="flex items-center space-x-2 mb-2 sm:mb-0">
        <Button
          variant="outline"
          size="sm"
          onClick={onReset}
          title="リセット"
          className="h-9 px-3"
        >
          <RotateCcw className="h-4 w-4 mr-1" />
          <span>リセット</span>
        </Button>
        
        {!isRunning ? (
          <Button
            variant="default"
            size="sm"
            onClick={onPlay}
            title="再生"
            className="h-9 px-4"
          >
            <Play className="h-4 w-4 mr-1" />
            <span>再生</span>
          </Button>
        ) : (
          <Button
            variant="default"
            size="sm"
            onClick={onPause}
            title="一時停止"
            className="h-9 px-4"
          >
            <Pause className="h-4 w-4 mr-1" />
            <span>停止</span>
          </Button>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-sm font-medium mr-1">速度：</span>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const currentIndex = speedOptions.indexOf(speed);
            if (currentIndex > 0) {
              onSpeedChange(speedOptions[currentIndex - 1]);
            }
          }}
          disabled={speedOptions.indexOf(speed) <= 0}
          title="再生速度を下げる"
          className="h-8 w-8 p-0"
        >
          <Rewind className="h-4 w-4" />
        </Button>
        
        <div className="text-sm font-medium w-10 text-center">
          {speed}x
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            const currentIndex = speedOptions.indexOf(speed);
            if (currentIndex < speedOptions.length - 1) {
              onSpeedChange(speedOptions[currentIndex + 1]);
            }
          }}
          disabled={speedOptions.indexOf(speed) >= speedOptions.length - 1}
          title="再生速度を上げる"
          className="h-8 w-8 p-0"
        >
          <FastForward className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}