
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Heart, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  category: 'medication' | 'meals' | 'selfcare';
  time?: string;
}

const DailyChecklist = () => {
  const { toast } = useToast();
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', title: 'Morning anti-nausea med', completed: false, category: 'medication', time: '8:00 AM' },
    { id: '2', title: 'First Cobenfy dose', completed: false, category: 'medication', time: '8:30 AM' },
    { id: '3', title: 'Breakfast (before Cobenfy)', completed: false, category: 'meals', time: '6:30 AM' },
    { id: '4', title: 'Lunch', completed: false, category: 'meals', time: '1:00 PM' },
    { id: '5', title: 'Afternoon anti-nausea med', completed: false, category: 'medication', time: '3:00 PM' },
    { id: '6', title: 'Second Cobenfy dose', completed: false, category: 'medication', time: '3:30 PM' },
    { id: '7', title: 'Dinner with 350+ calories', completed: false, category: 'meals', time: '6:00 PM' },
    { id: '8', title: 'Latuda with dinner', completed: false, category: 'medication', time: '6:00 PM' },
    { id: '9', title: '10 minutes of relaxation', completed: false, category: 'selfcare' },
    { id: '10', title: 'Call motivation hotline', completed: false, category: 'selfcare' },
    { id: '11', title: 'Journal or mood tracking', completed: false, category: 'selfcare' },
    { id: '12', title: 'Gentle movement/stretching', completed: false, category: 'selfcare' }
  ]);

  const toggleItem = (id: string) => {
    setChecklist(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, completed: !item.completed }
          : item
      )
    );
    
    const item = checklist.find(item => item.id === id);
    if (item && !item.completed) {
      toast({
        title: "Great job! ✨",
        description: `${item.title} completed`,
      });
    }
  };

  const completedCount = checklist.filter(item => item.completed).length;
  const totalCount = checklist.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medication':
        return '💊';
      case 'meals':
        return '🍽️';
      case 'selfcare':
        return '💚';
      default:
        return '✓';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'medication':
        return 'border-l-wellness-blue bg-blue-50';
      case 'meals':
        return 'border-l-calm-orange bg-orange-50';
      case 'selfcare':
        return 'border-l-wellness-green bg-green-50';
      default:
        return 'border-l-gray-300 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <List className="text-wellness-green" size={24} />
        <h2 className="text-2xl font-semibold text-foreground">Daily Checklist</h2>
      </div>

      {/* Progress Card */}
      <Card className="medication-card wellness-gradient text-white">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Today's Progress</h3>
          <div className="text-3xl font-bold mb-2">{progressPercentage}%</div>
          <p className="text-sm opacity-90">{completedCount} of {totalCount} tasks completed</p>
          <div className="w-full bg-white/30 rounded-full h-3 mt-4">
            <div 
              className="bg-white h-3 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
      </Card>

      {/* Checklist Items */}
      <div className="space-y-3">
        {checklist.map((item) => (
          <Card 
            key={item.id} 
            className={`medication-card border-l-4 ${getCategoryColor(item.category)} ${
              item.completed ? 'completed-task' : ''
            } cursor-pointer transition-all duration-200 hover:scale-[1.02]`}
            onClick={() => toggleItem(item.id)}
          >
            <div className="flex items-center gap-4">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                item.completed 
                  ? 'bg-accent border-accent text-white' 
                  : 'border-muted-foreground'
              }`}>
                {item.completed && <Check size={16} />}
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{getCategoryIcon(item.category)}</span>
                  <span className={`font-medium ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                    {item.title}
                  </span>
                  {item.time && (
                    <span className="text-sm text-muted-foreground ml-auto">
                      {item.time}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DailyChecklist;
