import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Timer, Clock, Utensils, Bell } from 'lucide-react';
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
  const [nextDoseTime, setNextDoseTime] = useState<Date | null>(null);
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
  const setNextDose = (hours: number) => {
    const nextDose = new Date(currentTime.getTime() + hours * 60 * 60 * 1000);
    setNextDoseTime(nextDose);
  };
  const formatTimeUntil = (targetTime: Date) => {
    const diff = targetTime.getTime() - currentTime.getTime();
    if (diff <= 0) return 'Now available!';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff % (1000 * 60 * 60) / (1000 * 60));
    const seconds = Math.floor(diff % (1000 * 60) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };
  const getNextSafeEatTime = () => {
    if (!lastCobenfy) return null;
    return new Date(lastCobenfy.getTime() + 2 * 60 * 60 * 1000);
  };
  const getStopEatingTime = () => {
    if (!nextDoseTime) return null;
    return new Date(nextDoseTime.getTime() - 60 * 60 * 1000); // 1 hour before next dose
  };
  const nextSafeEat = getNextSafeEatTime();
  const stopEatingTime = getStopEatingTime();
  const canEatNow = !lastCobenfy || nextSafeEat && currentTime >= nextSafeEat;
  const shouldStopEating = stopEatingTime && currentTime >= stopEatingTime;
  return <div className="space-y-4">
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
          
          <Button onClick={addCobenfy} className="bg-white text-hot-pink hover:bg-gray-100 border border-hot-pink">
            I just took Cobenfy
          </Button>
          
          {lastCobenfy && <div className="text-sm text-muted-foreground">
              Last Cobenfy taken: {lastCobenfy.toLocaleTimeString()}
            </div>}
        </div>
      </Card>

      <Card className="medication-card bg-gray-800 border-l-4 border-l-champagne">
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Bell size={18} className="text-champagne" />
            Schedule Next Dose
          </h3>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={() => setNextDose(8)} size="sm" className="bg-white text-hot-pink hover:bg-gray-100 border border-hot-pink">
              In 8 hours
            </Button>
            <Button onClick={() => setNextDose(12)} size="sm" className="bg-white text-hot-pink hover:bg-gray-100 border border-hot-pink text-pink-500">
              In 12 hours
            </Button>
            <Button onClick={() => setNextDose(24)} size="sm" className="bg-white text-hot-pink hover:bg-gray-100 border border-hot-pink">
              Tomorrow
            </Button>
          </div>
          {nextDoseTime && <div className="text-sm text-muted-foreground">
              Next dose scheduled: {nextDoseTime.toLocaleTimeString()}
            </div>}
        </div>
      </Card>

      {nextSafeEat && <Card className={`medication-card border-l-4 ${canEatNow ? 'border-l-gold bg-gold/10' : 'border-l-champagne bg-gray-800'}`}>
          <div className="flex items-center gap-3">
            <Utensils size={20} className={canEatNow ? 'text-gold' : 'text-champagne'} />
            <div>
              <h3 className="font-semibold">
                {canEatNow ? '🍽️ You can eat now!' : '⏰ Eating Timer (After Last Dose)'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {canEatNow ? 'It\'s been 2+ hours since your last Cobenfy dose' : `Time until you can eat: ${formatTimeUntil(nextSafeEat)}`}
              </p>
            </div>
          </div>
        </Card>}

      {stopEatingTime && <Card className={`medication-card border-l-4 ${shouldStopEating ? 'border-l-red-500 bg-red-500/10' : 'border-l-gold bg-gray-800'}`}>
          <div className="flex items-center gap-3">
            <Utensils size={20} className={shouldStopEating ? 'text-red-400' : 'text-gold'} />
            <div>
              <h3 className="font-semibold">
                {shouldStopEating ? '⚠️ Stop eating now!' : '🍽️ Eating Window (Before Next Dose)'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {shouldStopEating ? 'You need to stop eating 1 hour before your next Cobenfy dose' : `Time left to eat before next dose: ${formatTimeUntil(stopEatingTime)}`}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Next dose: {nextDoseTime?.toLocaleTimeString()}
              </p>
            </div>
          </div>
        </Card>}

      {!lastCobenfy && !nextDoseTime && <Card className="medication-card bg-gray-800 border-l-4 border-l-champagne">
          <div className="text-center">
            <h3 className="font-semibold mb-2">Cobenfy Timing Guidelines</h3>
            <p className="text-sm text-muted-foreground">
              • Take 2+ hours after meals<br />
              • Wait 2+ hours before eating after taking Cobenfy<br />
              • Stop eating 1+ hour before your next dose<br />
              • Set your next dose time to track eating windows
            </p>
          </div>
        </Card>}
    </div>;
};
export default TimingTimer;