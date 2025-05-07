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
    <div className="flex items-center space-x-2 bg-card p-2 rounded-md shadow">
      <Button
        variant="outline"
        size="icon"
        onClick={onReset}
        title="リセット"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      
      {!isRunning ? (
        <Button
          variant="default"
          size="icon"
          onClick={onPlay}
          title="再生"
        >
          <Play className="h-4 w-4" />
        </Button>
      ) : (
        <Button
          variant="default"
          size="icon"
          onClick={onPause}
          title="一時停止"
        >
          <Pause className="h-4 w-4" />
        </Button>
      )}
      
      <div className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const currentIndex = speedOptions.indexOf(speed);
            if (currentIndex > 0) {
              onSpeedChange(speedOptions[currentIndex - 1]);
            }
          }}
          disabled={speedOptions.indexOf(speed) <= 0}
          title="再生速度を下げる"
        >
          <Rewind className="h-4 w-4" />
        </Button>
        
        <div className="text-xs font-medium w-10 text-center">
          {speed}x
        </div>
        
        <Button
          variant="outline"
          size="icon"
          onClick={() => {
            const currentIndex = speedOptions.indexOf(speed);
            if (currentIndex < speedOptions.length - 1) {
              onSpeedChange(speedOptions[currentIndex + 1]);
            }
          }}
          disabled={speedOptions.indexOf(speed) >= speedOptions.length - 1}
          title="再生速度を上げる"
        >
          <FastForward className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}