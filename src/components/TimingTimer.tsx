
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Clock, Utensils } from 'lucide-react';

interface TimingEvent {
  id: string;
  name: string;
  time: Date;
  type: 'meal' | 'medication' | 'safe-to-eat';
  description: string;
}

const TimingTimer = () => {
  const [events, setEvents] = useState<TimingEvent[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [lastCobenfy, setLastCobenfy] = useState<Date | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const addCobenfy = () => {
    const now = new Date();
    setLastCobenfy(now);
    
    const safeToEatTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours later
    
    const newEvent: TimingEvent = {
      id: Date.now().toString(),
      name: 'Safe to eat',
      time: safeToEatTime,
      type: 'safe-to-eat',
      description: 'You can now eat (2 hours after Cobenfy)'
    };

    setEvents(prev => [...prev.filter(e => e.type !== 'safe-to-eat'), newEvent]);
  };

  const formatTimeUntil = (targetTime: Date) => {
    const diff = targetTime.getTime() - currentTime.getTime();
    if (diff <= 0) return 'Now available!';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const getNextSafeEatTime = () => {
    if (!lastCobenfy) return null;
    return new Date(lastCobenfy.getTime() + 2 * 60 * 60 * 1000);
  };

  const nextSafeEat = getNextSafeEatTime();
  const canEatNow = !lastCobenfy || (nextSafeEat && currentTime >= nextSafeEat);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Timer className="text-hot-pink" size={24} />
        <h2 className="text-2xl font-semibold text-foreground">Cobenfy Timer</h2>
      </div>

      <Card className="medication-card bg-gray-800 border-l-4 border-l-hot-pink">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Clock size={20} className="text-hot-pink" />
            <span className="text-lg font-semibold">Current Time: {currentTime.toLocaleTimeString()}</span>
          </div>
          
          <Button
            onClick={addCobenfy}
            className="bg-white text-hot-pink hover:bg-gray-100 border border-hot-pink"
          >
            I just took Cobenfy
          </Button>
          
          {lastCobenfy && (
            <div className="text-sm text-muted-foreground">
              Last Cobenfy taken: {lastCobenfy.toLocaleTimeString()}
            </div>
          )}
        </div>
      </Card>

      {nextSafeEat && (
        <Card className={`medication-card border-l-4 ${canEatNow ? 'border-l-gold bg-gold/10' : 'border-l-champagne bg-gray-800'}`}>
          <div className="flex items-center gap-3">
            <Utensils size={20} className={canEatNow ? 'text-gold' : 'text-champagne'} />
            <div>
              <h3 className="font-semibold">
                {canEatNow ? '🍽️ You can eat now!' : '⏰ Eating Timer'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {canEatNow 
                  ? 'It\'s been 2+ hours since your last Cobenfy dose'
                  : `Time until you can eat: ${formatTimeUntil(nextSafeEat)}`
                }
              </p>
            </div>
          </div>
        </Card>
      )}

      {!lastCobenfy && (
        <Card className="medication-card bg-gray-800 border-l-4 border-l-champagne">
          <div className="text-center">
            <h3 className="font-semibold mb-2">Cobenfy Timing Guidelines</h3>
            <p className="text-sm text-muted-foreground">
              • Take 2+ hours after meals<br/>
              • Wait 2+ hours before eating after taking Cobenfy<br/>
              • Click "I just took Cobenfy" to start the timer
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default TimingTimer;
