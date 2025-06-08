
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Bell, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MedicationDose {
  id: string;
  name: string;
  time: string;
  taken: boolean;
  instructions: string;
  type: 'cobenfy' | 'latuda' | 'anti-nausea';
}

const MedicationTracker = () => {
  const { toast } = useToast();
  const [medications, setMedications] = useState<MedicationDose[]>([
    {
      id: '1',
      name: 'Anti-nausea medication',
      time: '08:00',
      taken: false,
      instructions: 'Take before first Cobenfy dose',
      type: 'anti-nausea'
    },
    {
      id: '2',
      name: 'Cobenfy (Morning)',
      time: '08:30',
      taken: false,
      instructions: '2 hours after breakfast OR 1 hour before lunch',
      type: 'cobenfy'
    },
    {
      id: '3',
      name: 'Anti-nausea medication',
      time: '15:00',
      taken: false,
      instructions: 'Take before second Cobenfy dose',
      type: 'anti-nausea'
    },
    {
      id: '4',
      name: 'Cobenfy (Afternoon)',
      time: '15:30',
      taken: false,
      instructions: '2 hours after lunch, 1+ hour before Latuda',
      type: 'cobenfy'
    },
    {
      id: '5',
      name: 'Latuda with dinner',
      time: '18:00',
      taken: false,
      instructions: 'With 350+ calories, 2+ hours before bed',
      type: 'latuda'
    }
  ]);

  const markAsTaken = (id: string) => {
    setMedications(prev => 
      prev.map(med => 
        med.id === id 
          ? { ...med, taken: true }
          : med
      )
    );
    
    const medication = medications.find(med => med.id === id);
    toast({
      title: "Medication taken! 💊",
      description: `${medication?.name} marked as complete`,
    });
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cobenfy':
        return 'border-l-wellness-blue bg-blue-50';
      case 'latuda':
        return 'border-l-wellness-purple bg-purple-50';
      case 'anti-nausea':
        return 'border-l-wellness-green bg-green-50';
      default:
        return 'border-l-gray-300 bg-gray-50';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="text-wellness-blue" size={24} />
        <h2 className="text-2xl font-semibold text-foreground">Today's Medications</h2>
      </div>
      
      {medications.map((med) => (
        <Card key={med.id} className={`medication-card border-l-4 ${getTypeColor(med.type)} ${med.taken ? 'completed-task' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Clock size={18} className="text-muted-foreground" />
                <span className="font-medium text-lg">{med.time}</span>
                <span className="font-semibold text-foreground">{med.name}</span>
              </div>
              <p className="text-sm text-muted-foreground ml-9">{med.instructions}</p>
            </div>
            
            <Button
              onClick={() => markAsTaken(med.id)}
              disabled={med.taken}
              className={`ml-4 ${med.taken 
                ? 'bg-accent text-accent-foreground cursor-not-allowed' 
                : 'bg-primary hover:bg-primary/90'
              }`}
            >
              {med.taken ? <Check size={18} /> : 'Take'}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MedicationTracker;
