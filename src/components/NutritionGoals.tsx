
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Target, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface NutritionGoals {
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber: number;
  sugar: number;
}

const NutritionGoals = () => {
  const [goals, setGoals] = useState<NutritionGoals>({
    calories: 2000,
    carbs: 250,
    protein: 150,
    fat: 65,
    fiber: 25,
    sugar: 50
  });
  const { toast } = useToast();

  useEffect(() => {
    const savedGoals = localStorage.getItem('nutritionGoals');
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  const saveGoals = () => {
    localStorage.setItem('nutritionGoals', JSON.stringify(goals));
    toast({
      title: "Goals saved! 🎯",
      description: "Your nutrition goals have been updated",
    });
  };

  const handleGoalChange = (key: keyof NutritionGoals, value: string) => {
    setGoals(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  return (
    <Card className="medication-card bg-gray-800 p-6">
      <div className="flex items-center gap-2 mb-6">
        <Target className="text-hot-pink" size={20} />
        <h3 className="text-lg font-semibold text-foreground">Nutrition Goals</h3>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="calories">Daily Calories</Label>
            <Input
              id="calories"
              type="number"
              min="0"
              value={goals.calories}
              onChange={(e) => handleGoalChange('calories', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="carbs">Carbs (g)</Label>
            <Input
              id="carbs"
              type="number"
              min="0"
              step="0.1"
              value={goals.carbs}
              onChange={(e) => handleGoalChange('carbs', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="protein">Protein (g)</Label>
            <Input
              id="protein"
              type="number"
              min="0"
              step="0.1"
              value={goals.protein}
              onChange={(e) => handleGoalChange('protein', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="fat">Fat (g)</Label>
            <Input
              id="fat"
              type="number"
              min="0"
              step="0.1"
              value={goals.fat}
              onChange={(e) => handleGoalChange('fat', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="fiber">Fiber (g)</Label>
            <Input
              id="fiber"
              type="number"
              min="0"
              step="0.1"
              value={goals.fiber}
              onChange={(e) => handleGoalChange('fiber', e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="sugar">Sugar (g) - Max</Label>
            <Input
              id="sugar"
              type="number"
              min="0"
              step="0.1"
              value={goals.sugar}
              onChange={(e) => handleGoalChange('sugar', e.target.value)}
            />
          </div>
        </div>

        <div className="bg-gray-700 p-4 rounded-lg">
          <h4 className="font-medium text-foreground mb-2">Diabetes & Bipolar Considerations</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Keep carbs consistent for better blood sugar control</li>
            <li>• Include protein with each meal to stabilize mood</li>
            <li>• Limit added sugars to prevent blood sugar spikes</li>
            <li>• Aim for high fiber foods for better glucose management</li>
            <li>• Regular meal timing can help with mood stability</li>
          </ul>
        </div>

        <Button 
          onClick={saveGoals}
          className="w-full bg-hot-pink text-black hover:bg-hot-pink/90"
        >
          <Save size={16} />
          Save Goals
        </Button>
      </div>
    </Card>
  );
};

export default NutritionGoals;
