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
    // If we have no Cobenfy time or can already take Cobenfy, go to waiting for Cobenfy
    if (!lastCobenfy || canTakeCobenfy()) {
      setState('waiting-for-cobenfy');
    } else {
      // Otherwise, determine state based on most recent action
      setState('waiting-to-eat');
    }
  };

  const handleTookCobenfy = () => {
    const now = new Date();
    setLastCobenfy(now);
    // If we have no meal time or can already eat, go to waiting to eat
    if (!lastMeal || canEat()) {
      setState('waiting-to-eat');
    } else {
      // Otherwise, determine state based on most recent action
      setState('waiting-for-cobenfy');
    }
  };

  const resetCycle = () => {
    setState('idle');
    setLastMeal(null);
    setLastCobenfy(null);
  };

  const canTakeCobenfy = () => {
    if (!lastMeal) return true;
    const safeTime = new Date(lastMeal.getTime() + 2 * 60 * 60 * 1000); // 2 hours after eating
    return currentTime >= safeTime;
  };

  const canEat = () => {
    if (!lastCobenfy) return true;
    const safeTime = new Date(lastCobenfy.getTime() + 1 * 60 * 60 * 1000); // 1 hour after Cobenfy
    return currentTime >= safeTime;
  };

  const getSafeCobenFyTime = () => {
    if (!lastMeal) return null;
    return new Date(lastMeal.getTime() + 2 * 60 * 60 * 1000); // 2 hours after eating
  };

  const getSafeEatTime = () => {
    if (!lastCobenfy) return null;
    return new Date(lastCobenfy.getTime() + 1 * 60 * 60 * 1000); // 1 hour after Cobenfy
  };

  const renderMainContent = () => {
    if (state === 'idle') {
      return (
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold mb-4">Ready to track your cycle</h3>
          <p className="text-muted-foreground mb-4">Log your food or Cobenfy to start tracking</p>
          
          <div className="flex gap-3 justify-center">
            <Button 
              onClick={handleAte} 
              className="bg-hot-pink text-black font-bold hover:bg-hot-pink/90 flex items-center gap-2"
            >
              <Utensils size={18} />
              I just ate
            </Button>
            <Button 
              onClick={handleTookCobenfy} 
              className="bg-hot-pink text-black font-bold hover:bg-hot-pink/90 flex items-center gap-2"
            >
              <Pill size={18} />
              I took Cobenfy
            </Button>
          </div>
        </div>
      );
    }

    const safeCobenFyTime = getSafeCobenFyTime();
    const safeEatTime = getSafeEatTime();
    const cobenFyTimeLeft = safeCobenFyTime ? formatTimeUntil(safeCobenFyTime) : null;
    const eatTimeLeft = safeEatTime ? formatTimeUntil(safeEatTime) : null;
    const isSafeForCobenfy = canTakeCobenfy();
    const isSafeToEat = canEat();

    return (
      <div className="space-y-4">
        {/* Last actions display */}
        <div className="text-center text-sm space-y-1">
          {lastMeal && (
            <p className="text-muted-foreground">Last meal: {lastMeal.toLocaleTimeString()}</p>
          )}
          {lastCobenfy && (
            <p className="text-muted-foreground">Last Cobenfy: {lastCobenfy.toLocaleTimeString()}</p>
          )}
        </div>

        {/* Current status */}
        <div className="text-center py-4">
          {state === 'waiting-for-cobenfy' && (
            <>
              {isSafeForCobenfy ? (
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gold">✅ Safe to take Cobenfy!</h3>
                  <p className="text-sm text-muted-foreground">It's been 2+ hours since you ate</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-champagne">⏰ Wait before taking Cobenfy</h3>
                  {cobenFyTimeLeft && (
                    <div className="text-2xl font-mono text-hot-pink">{cobenFyTimeLeft}</div>
                  )}
                  <p className="text-sm text-muted-foreground">Until you can safely take Cobenfy</p>
                </div>
              )}
            </>
          )}

          {state === 'waiting-to-eat' && (
            <>
              {isSafeToEat ? (
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-gold">🍽️ Safe to eat!</h3>
                  <p className="text-sm text-muted-foreground">It's been 1+ hour since you took Cobenfy</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <h3 className="text-xl font-semibold text-champagne">⏰ Wait before eating</h3>
                  {eatTimeLeft && (
                    <div className="text-2xl font-mono text-hot-pink">{eatTimeLeft}</div>
                  )}
                  <p className="text-sm text-muted-foreground">Until you can safely eat</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 justify-center">
          <Button 
            onClick={handleAte} 
            className="bg-hot-pink text-black font-bold hover:bg-hot-pink/90 flex items-center gap-2"
          >
            <Utensils size={18} />
            I just ate
          </Button>
          <Button 
            onClick={handleTookCobenfy} 
            className="bg-hot-pink text-black font-bold hover:bg-hot-pink/90 flex items-center gap-2"
          >
            <Pill size={18} />
            I took Cobenfy
          </Button>
        </div>

        <div className="text-center">
          <Button 
            onClick={resetCycle} 
            variant="outline" 
            size="sm"
            className="!text-muted-foreground font-bold"
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

      <div className="flex items-center justify-center gap-2 mb-4">
        <Clock size={20} className="text-hot-pink" />
        <span className="text-lg font-semibold">Current Time: {currentTime.toLocaleTimeString()}</span>
      </div>

      <Card className="medication-card bg-gray-800 border-l-4 border-l-hot-pink p-6">
        {renderMainContent()}
      </Card>

      <Card className="medication-card bg-gray-800 border-l-4 border-l-champagne p-4">
        <h3 className="font-semibold mb-2 text-center">Cobenfy Timing Guidelines</h3>
        <div className="text-sm text-muted-foreground text-center space-y-1">
          <p>🍽️ Eat → ⏰ Wait 2+ hours → 💊 Take Cobenfy</p>
          <p>💊 Take Cobenfy → ⏰ Wait 1+ hour → 🍽️ Eat</p>
        </div>
      </Card>
    </div>
  );
};

export default TimingTimer;
