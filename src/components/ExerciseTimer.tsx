
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';

interface ExerciseTimerProps {
  onComplete?: (duration: number) => void;
}

const ExerciseTimer = ({ onComplete }: ExerciseTimerProps) => {
  const [time, setTime] = useState(0); // in seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsRunning(false);
    setIsPaused(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    setIsPaused(false);
    if (time > 0 && onComplete) {
      onComplete(Math.floor(time / 60)); // return duration in minutes
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    setTime(0);
  };

  return (
    <Card className="medication-card bg-gray-800 p-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-2xl">⏱️</span>
          <h3 className="text-lg font-semibold text-foreground">Exercise Timer</h3>
        </div>
        
        <div className="text-6xl font-mono font-bold text-hot-pink mb-6">
          {formatTime(time)}
        </div>
        
        <div className="flex justify-center gap-3">
          {!isRunning && !isPaused && (
            <Button
              onClick={handleStart}
              className="bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <Play size={20} />
              Start
            </Button>
          )}
          
          {isRunning && (
            <Button
              onClick={handlePause}
              className="bg-yellow-600 hover:bg-yellow-700"
              size="lg"
            >
              <Pause size={20} />
              Pause
            </Button>
          )}
          
          {isPaused && (
            <Button
              onClick={handleStart}
              className="bg-green-600 hover:bg-green-700"
              size="lg"
            >
              <Play size={20} />
              Resume
            </Button>
          )}
          
          {(isRunning || isPaused) && (
            <>
              <Button
                onClick={handleStop}
                className="bg-red-600 hover:bg-red-700"
                size="lg"
              >
                <Square size={20} />
                Stop & Log
              </Button>
              
              <Button
                onClick={handleReset}
                variant="outline"
                size="lg"
              >
                <RotateCcw size={20} />
                Reset
              </Button>
            </>
          )}
        </div>
        
        {time > 0 && (
          <div className="mt-4 text-sm text-muted-foreground">
            Duration: {Math.floor(time / 60)} minutes {time % 60} seconds
          </div>
        )}
      </div>
    </Card>
  );
};

export default ExerciseTimer;
