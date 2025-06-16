
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Heart, Save, Apple, Droplets } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface WellnessGoals {
  vegetables: number; // servings per day
  protein: number; // servings per day
  water: number; // glasses per day
  mindfulEating: boolean;
  regularMeals: boolean;
  enjoyFood: boolean;
  listenToBody: boolean;
  balanceNotPerfection: boolean;
  nourishingSnacks: boolean;
}

const NutritionGoals = () => {
  const [goals, setGoals] = useState<WellnessGoals>({
    vegetables: 5,
    protein: 3,
    water: 8,
    mindfulEating: true,
    regularMeals: true,
    enjoyFood: true,
    listenToBody: true,
    balanceNotPerfection: true,
    nourishingSnacks: true
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedGoals = localStorage.getItem('wellnessGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  const saveGoals = () => {
    localStorage.setItem('wellnessGoals', JSON.stringify(goals));
    toast({
      title: "Wellness goals saved! 💚",
      description: "Your nourishing goals have been updated",
    });
  };

  const handleNumberChange = (key: keyof WellnessGoals, value: string) => {
    setGoals(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  const handleCheckboxChange = (key: keyof WellnessGoals, checked: boolean) => {
    setGoals(prev => ({
      ...prev,
      [key]: checked
    }));
  };

  return (
    <Card className="medication-card bg-gray-800 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Heart className="text-hot-pink" size={20} />
        <h3 className="text-lg font-semibold text-foreground">Nourishment Goals</h3>
      </div>

      <div className="space-y-6">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
            <Apple className="text-green-400" size={16} />
            Daily Nourishment Targets
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="vegetables">Vegetable Servings</Label>
              <Input
                id="vegetables"
                type="number"
                min="0"
                value={goals.vegetables}
                onChange={(e) => handleNumberChange('vegetables', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Aim for colorful variety</p>
            </div>
            <div>
              <Label htmlFor="protein">Protein Servings</Label>
              <Input
                id="protein"
                type="number"
                min="0"
                value={goals.protein}
                onChange={(e) => handleNumberChange('protein', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">For stable mood & energy</p>
            </div>
            <div>
              <Label htmlFor="water" className="flex items-center gap-1">
                <Droplets className="text-blue-400" size={14} />
                Water (glasses)
              </Label>
              <Input
                id="water"
                type="number"
                min="0"
                value={goals.water}
                onChange={(e) => handleNumberChange('water', e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-1">Stay hydrated throughout the day</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <h4 className="font-medium text-foreground mb-4">Mindful Eating Practices</h4>
          <div className="space-y-3">
            {[
              { key: 'mindfulEating', label: 'Practice mindful eating', desc: 'Eat slowly and savor meals' },
              { key: 'regularMeals', label: 'Maintain regular meal times', desc: 'Support mood stability' },
              { key: 'enjoyFood', label: 'Find joy in food', desc: 'Food is nourishment and pleasure' },
              { key: 'listenToBody', label: 'Listen to hunger and fullness cues', desc: 'Trust your body' },
              { key: 'balanceNotPerfection', label: 'Choose balance over perfection', desc: 'Progress, not perfection' },
              { key: 'nourishingSnacks', label: 'Choose nourishing snacks', desc: 'Fuel your body between meals' }
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-start space-x-3">
                <Checkbox
                  id={key}
                  checked={goals[key as keyof WellnessGoals] as boolean}
                  onCheckedChange={(checked) => handleCheckboxChange(key as keyof WellnessGoals, checked as boolean)}
                />
                <div className="space-y-1 leading-none">
                  <label
                    htmlFor={key}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-foreground"
                  >
                    {label}
                  </label>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <h4 className="font-medium text-foreground mb-2">Gentle Reminders</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Your body deserves nourishment and care</li>
            <li>• Every meal is a chance to nurture yourself</li>
            <li>• Balance and flexibility support long-term wellness</li>
            <li>• Include foods that stabilize blood sugar and mood</li>
            <li>• Celebrate small wins and be kind to yourself</li>
          </ul>
        </div>

        <Button 
          onClick={saveGoals}
          className="w-full bg-hot-pink text-black hover:bg-hot-pink/90"
        >
          <Save size={16} />
          Save Wellness Goals
        </Button>
      </div>
    </Card>
  );
};

export default NutritionGoals;
