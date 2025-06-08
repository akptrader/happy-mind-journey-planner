import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Bell, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface SelfCareReminder {
  id: string;
  title: string;
  description: string;
  time: string;
  completed: boolean;
  type: 'relaxation' | 'motivation' | 'mindfulness' | 'movement';
}

const SelfCareReminders = () => {
  const { toast } = useToast();
  const [reminders, setReminders] = useState<SelfCareReminder[]>([
    {
      id: '1',
      title: 'Morning Mindfulness',
      description: 'Take 5 deep breaths and set a positive intention for the day',
      time: '09:00',
      completed: false,
      type: 'mindfulness'
    },
    {
      id: '2',
      title: 'Midday Check-in',
      description: 'How are you feeling? Rate your mood and energy',
      time: '12:00',
      completed: false,
      type: 'mindfulness'
    },
    {
      id: '3',
      title: 'Relaxation Break',
      description: 'Take 10 minutes to listen to calming music or meditate',
      time: '14:00',
      completed: false,
      type: 'relaxation'
    },
    {
      id: '4',
      title: 'Call Motivation Hotline',
      description: 'Connect with supportive voices when you need encouragement',
      time: '16:00',
      completed: false,
      type: 'motivation'
    },
    {
      id: '5',
      title: 'Gentle Movement',
      description: 'Stretch, walk, or do light exercise for 15 minutes',
      time: '17:00',
      completed: false,
      type: 'movement'
    },
    {
      id: '6',
      title: 'Evening Wind-down',
      description: 'Prepare for restful sleep with a calming routine',
      time: '20:00',
      completed: false,
      type: 'relaxation'
    }
  ]);

  const markCompleted = (id: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, completed: true }
          : reminder
      )
    );
    
    const reminder = reminders.find(r => r.id === id);
    toast({
      title: "Self-care completed! 🌟",
      description: `Great job taking care of yourself with ${reminder?.title}`,
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'relaxation':
        return '🧘‍♀️';
      case 'motivation':
        return '📞';
      case 'mindfulness':
        return '🌸';
      case 'movement':
        return '🚶‍♀️';
      default:
        return '💚';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'relaxation':
        return 'border-l-hot-pink bg-gray-800';
      case 'motivation':
        return 'border-l-gold bg-gray-800';
      case 'mindfulness':
        return 'border-l-champagne bg-gray-800';
      case 'movement':
        return 'border-l-champagne-dark bg-gray-800';
      default:
        return 'border-l-gray-300 bg-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="text-hot-pink" size={24} />
        <h2 className="text-2xl font-semibold text-foreground">Self-Care Reminders</h2>
      </div>

      <Card className="medication-card calm-gradient text-foreground">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">Remember to be kind to yourself today 💚</h3>
          <p className="text-sm opacity-80">Your mental health journey matters, and every small step counts.</p>
        </div>
      </Card>

      {reminders.map((reminder, index) => (
        <Card key={reminder.id} className={`medication-card border-l-4 ${getTypeColor(reminder.type)} ${reminder.completed ? 'completed-task' : ''}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-xl">{getTypeIcon(reminder.type)}</span>
                <Clock size={16} className="text-muted-foreground" />
                <span className="font-medium">{reminder.time}</span>
                <span className="font-semibold text-foreground">{reminder.title}</span>
              </div>
              <p className="text-sm text-muted-foreground ml-11">{reminder.description}</p>
            </div>
            
            <Button
              onClick={() => markCompleted(reminder.id)}
              disabled={reminder.completed}
              size="sm"
              className={`ml-4 ${reminder.completed ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-white text-hot-pink hover:bg-gray-100 border border-hot-pink'}`}
            >
              {reminder.completed ? 'Done' : 'Complete'}
            </Button>
          </div>
        </Card>
      ))}

      <Card className="medication-card border-l-4 border-l-hot-pink bg-gray-800">
        <div className="text-center">
          <h3 className="font-semibold mb-2">Need Support Right Now?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Motivation Hotline: <span className="font-mono font-bold">1-800-MOTIVATE</span>
          </p>
          <Button className="bg-white text-hot-pink hover:bg-gray-100 border border-hot-pink">
            Call Now
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SelfCareReminders;
