
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Clock, Utensils, Pill } from 'lucide-react';

type TimerState = 'idle' | 'waiting-for-cobenfy' | 'waiting-to-eat';

const TimingTimer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [state, setState] = useState<TimerState>('idle');
  const [lastMeal, setLastMeal] = useState<Date | null>(null);
  const [lastCobenfy, setLastCobenfy] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimeUntil = (targetTime: Date) => {
    const diff = targetTime.getTime() - currentTime.getTime();
    if (diff <= 0) return null;
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const handleAte = () => {
    const now = new Date();
    setLastMeal(now);
    setState('waiting-for-cobenfy');
  };

  const handleTookCobenfy = () => {
    const now = new Date();
    setLastCobenfy(now);
    setState('waiting-to-eat');
  };

  const resetCycle = () => {
    setState('idle');
    setLastMeal(null);
    setLastCobenfy(null);
  };

  const canTakeCobenfy = () => {
    if (!lastMeal) return false;
    const safeTime = new Date(lastMeal.getTime() + 2 * 60 * 60 * 1000);
    return currentTime >= safeTime;
  };

  const canEat = () => {
    if (!lastCobenfy) return false;
    const safeTime = new Date(lastCobenfy.getTime() + 2 * 60 * 60 * 1000);
    return currentTime >= safeTime;
  };

  const getSafeCobenFyTime = () => {
    if (!lastMeal) return null;
    return new Date(lastMeal.getTime() + 2 * 60 * 60 * 1000);
  };

  const getSafeEatTime = () => {
    if (!lastCobenfy) return null;
    return new Date(lastCobenfy.getTime() + 2 * 60 * 60 * 1000);
  };

  const renderIdleState = () => (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center gap-2 mb-4">
        <Clock size={20} className="text-hot-pink" />
        <span className="text-lg font-semibold">Current Time: {currentTime.toLocaleTimeString()}</span>
      </div>
      
      <h3 className="text-xl font-semibold mb-4">Ready to track your cycle</h3>
      <p className="text-muted-foreground mb-4">Start by logging when you eat</p>
      
      <Button 
        onClick={handleAte} 
        className="bg-white text-hot-pink hover:bg-gray-100 border border-hot-pink flex items-center gap-2"
      >
        <Utensils size={18} />
        I just ate
      </Button>
    </div>
  );

  const renderWaitingForCobenfy = () => {
    const safeTime = getSafeCobenFyTime();
    const timeLeft = safeTime ? formatTimeUntil(safeTime) : null;
    const isSafe = canTakeCobenfy();

    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock size={20} className="text-hot-pink" />
            <span className="text-lg font-semibold">Current Time: {currentTime.toLocaleTimeString()}</span>
          </div>
          {lastMeal && (
            <p className="text-sm text-muted-foreground">Last meal: {lastMeal.toLocaleTimeString()}</p>
          )}
        </div>

        <div className="text-center py-4">
          {isSafe ? (
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gold">✅ Safe to take Cobenfy!</h3>
              <p className="text-sm text-muted-foreground">It's been 2+ hours since you ate</p>
              <Button 
                onClick={handleTookCobenfy}
                className="bg-white text-hot-pink hover:bg-gray-100 border border-hot-pink flex items-center gap-2 mx-auto"
              >
                <Pill size={18} />
                I took Cobenfy
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-champagne">⏰ Wait before taking Cobenfy</h3>
              {timeLeft && (
                <div className="text-2xl font-mono text-hot-pink">{timeLeft}</div>
              )}
              <p className="text-sm text-muted-foreground">Until you can safely take Cobenfy</p>
            </div>
          )}
        </div>

        <div className="text-center">
          <Button 
            onClick={resetCycle} 
            variant="outline" 
            size="sm"
            className="text-muted-foreground"
          >
            Reset cycle
          </Button>
        </div>
      </div>
    );
  };

  const renderWaitingToEat = () => {
    const safeTime = getSafeEatTime();
    const timeLeft = safeTime ? formatTimeUntil(safeTime) : null;
    const isSafe = canEat();

    return (
      <div className="space-y-4">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Clock size={20} className="text-hot-pink" />
            <span className="text-lg font-semibold">Current Time: {currentTime.toLocaleTimeString()}</span>
          </div>
          {lastCobenfy && (
            <p className="text-sm text-muted-foreground">Last Cobenfy: {lastCobenfy.toLocaleTimeString()}</p>
          )}
        </div>

        <div className="text-center py-4">
          {isSafe ? (
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-gold">🍽️ Safe to eat!</h3>
              <p className="text-sm text-muted-foreground">It's been 2+ hours since you took Cobenfy</p>
              <Button 
                onClick={handleAte}
                className="bg-white text-hot-pink hover:bg-gray-100 border border-hot-pink flex items-center gap-2 mx-auto"
              >
                <Utensils size={18} />
                I just ate
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-champagne">⏰ Wait before eating</h3>
              {timeLeft && (
                <div className="text-2xl font-mono text-hot-pink">{timeLeft}</div>
              )}
              <p className="text-sm text-muted-foreground">Until you can safely eat</p>
            </div>
          )}
        </div>

        <div className="text-center">
          <Button 
            onClick={resetCycle} 
            variant="outline" 
            size="sm"
            className="text-muted-foreground"
          >
            Reset cycle
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Timer className="text-hot-pink" size={24} />
        <h2 className="text-2xl font-semibold text-foreground">Cobenfy Timer</h2>
      </div>

      <Card className="medication-card bg-gray-800 border-l-4 border-l-hot-pink p-6">
        {state === 'idle' && renderIdleState()}
        {state === 'waiting-for-cobenfy' && renderWaitingForCobenfy()}
        {state === 'waiting-to-eat' && renderWaitingToEat()}
      </Card>

      <Card className="medication-card bg-gray-800 border-l-4 border-l-champagne p-4">
        <h3 className="font-semibold mb-2 text-center">Cobenfy Timing Guidelines</h3>
        <div className="text-sm text-muted-foreground text-center space-y-1">
          <p>🍽️ Eat → ⏰ Wait 2+ hours → 💊 Take Cobenfy</p>
          <p>💊 Take Cobenfy → ⏰ Wait 2+ hours → 🍽️ Eat</p>
        </div>
      </Card>
    </div>
  );
};

export default TimingTimer;
