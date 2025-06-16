
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Briefcase, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WorkProductivityTracker = () => {
  const [workDifficulty, setWorkDifficulty] = useState([3]);
  const [energyLevel, setEnergyLevel] = useState([3]);
  const { toast } = useToast();

  const handleSubmit = () => {
    const workEntry = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      difficulty: workDifficulty[0],
      energy: energyLevel[0],
      date: new Date().toDateString()
    };

    const existingEntries = JSON.parse(localStorage.getItem('workEntries') || '[]');
    localStorage.setItem('workEntries', JSON.stringify([workEntry, ...existingEntries]));

    toast({
      title: "Work day recorded! 💼",
      description: `Difficulty: ${workDifficulty[0]}/5, Energy: ${energyLevel[0]}/5`,
    });

    // Reset form
    setWorkDifficulty([3]);
    setEnergyLevel([3]);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Briefcase className="text-hot-pink" size={24} />
        <h2 className="text-2xl font-semibold text-foreground">Work Tracker</h2>
      </div>

      <Card className="medication-card bg-gray-800 p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">How was work today?</h3>
        
        <div className="space-y-6">
          <div>
            <Label className="text-foreground mb-2 block">
              How hard was it to work today? {workDifficulty[0]}/5
            </Label>
            <Slider
              value={workDifficulty}
              onValueChange={setWorkDifficulty}
              max={5}
              min={1}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Very Easy</span>
              <span>Very Hard</span>
            </div>
          </div>

          <div>
            <Label className="text-foreground mb-2 block">
              How much energy did you have? {energyLevel[0]}/5
            </Label>
            <Slider
              value={energyLevel}
              onValueChange={setEnergyLevel}
              max={5}
              min={1}
              step={1}
              className="mt-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>No Energy</span>
              <span>Lots of Energy</span>
            </div>
          </div>

          <Button 
            onClick={handleSubmit}
            className="w-full bg-hot-pink text-black hover:bg-hot-pink/90"
          >
            <Plus size={16} className="mr-2" />
            Log Work Day
          </Button>
        </div>
      </Card>

      <Card className="medication-card calm-gradient">
        <div className="text-center">
          <p className="text-sm text-gray-300">
            💙 Remember: Some days are harder than others, and that's okay. You're doing your best.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default WorkProductivityTracker;
