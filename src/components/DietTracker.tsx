
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Apple, Plus, History, Target, TrendingUp, Utensils } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddFoodDialog from './AddFoodDialog';
import DietHistory from './DietHistory';
import NutritionGoals from './NutritionGoals';

interface FoodEntry {
  id: string;
  timestamp: string;
  meal: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food: string;
  calories: number;
  carbs: number;
  protein: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  notes?: string;
}

const DietTracker = () => {
  const [activeTab, setActiveTab] = useState('today');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [foodEntries, setFoodEntries] = useState<FoodEntry[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const savedEntries = localStorage.getItem('dietEntries');
    if (savedEntries) {
      setFoodEntries(JSON.parse(savedEntries));
    }
  }, []);

  const saveFoodEntries = (entries: FoodEntry[]) => {
    setFoodEntries(entries);
    localStorage.setItem('dietEntries', JSON.stringify(entries));
  };

  const addFoodEntry = (entry: Omit<FoodEntry, 'id' | 'timestamp'>) => {
    const newEntry: FoodEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };
    
    const updatedEntries = [...foodEntries, newEntry];
    saveFoodEntries(updatedEntries);
    
    toast({
      title: "Food logged! 🍎",
      description: `${entry.food} added to ${entry.meal}`,
    });
  };

  const deleteFoodEntry = (id: string) => {
    const updatedEntries = foodEntries.filter(entry => entry.id !== id);
    saveFoodEntries(updatedEntries);
    
    toast({
      title: "Food entry deleted",
      description: "Entry removed from your log",
    });
  };

  // Get today's entries
  const today = new Date().toDateString();
  const todayEntries = foodEntries.filter(entry => 
    new Date(entry.timestamp).toDateString() === today
  );

  // Calculate daily totals
  const dailyTotals = todayEntries.reduce((totals, entry) => ({
    calories: totals.calories + entry.calories,
    carbs: totals.carbs + entry.carbs,
    protein: totals.protein + entry.protein,
    fat: totals.fat + entry.fat,
    fiber: totals.fiber + (entry.fiber || 0),
    sugar: totals.sugar + (entry.sugar || 0),
  }), { calories: 0, carbs: 0, protein: 0, fat: 0, fiber: 0, sugar: 0 });

  // Group entries by meal
  const mealGroups = {
    breakfast: todayEntries.filter(entry => entry.meal === 'breakfast'),
    lunch: todayEntries.filter(entry => entry.meal === 'lunch'),
    dinner: todayEntries.filter(entry => entry.meal === 'dinner'),
    snack: todayEntries.filter(entry => entry.meal === 'snack'),
  };

  const getMealIcon = (meal: string) => {
    switch (meal) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍿';
      default: return '🍽️';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Apple className="text-hot-pink" size={24} />
          <h2 className="text-2xl font-semibold text-foreground">Diet Tracker</h2>
        </div>
        <Button 
          onClick={() => setShowAddDialog(true)}
          className="bg-hot-pink text-black hover:bg-hot-pink/90"
        >
          <Plus size={16} />
          Log Food
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="today" className="flex items-center gap-2">
            <Utensils size={18} />
            Today
          </TabsTrigger>
          <TabsTrigger value="goals" className="flex items-center gap-2">
            <Target size={18} />
            Goals
          </TabsTrigger>
          <TabsTrigger value="trends" className="flex items-center gap-2">
            <TrendingUp size={18} />
            Trends
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History size={18} />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-6">
          {/* Daily Summary */}
          <Card className="medication-card bg-gray-800 p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Today's Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-hot-pink">{dailyTotals.calories}</div>
                <div className="text-sm text-muted-foreground">Calories</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-400">{dailyTotals.carbs}g</div>
                <div className="text-sm text-muted-foreground">Carbs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">{dailyTotals.protein}g</div>
                <div className="text-sm text-muted-foreground">Protein</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-400">{dailyTotals.fat}g</div>
                <div className="text-sm text-muted-foreground">Fat</div>
              </div>
            </div>
          </Card>

          {/* Meals */}
          <div className="space-y-4">
            {Object.entries(mealGroups).map(([meal, entries]) => (
              <Card key={meal} className="medication-card bg-gray-800 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl">{getMealIcon(meal)}</span>
                  <h3 className="text-lg font-semibold text-foreground capitalize">{meal}</h3>
                </div>
                
                {entries.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">No items logged for {meal}</p>
                ) : (
                  <div className="space-y-2">
                    {entries.map(entry => (
                      <div key={entry.id} className="flex justify-between items-center p-3 bg-gray-700 rounded-lg">
                        <div>
                          <div className="font-medium text-foreground">{entry.food}</div>
                          <div className="text-sm text-muted-foreground">
                            {entry.calories} cal • {entry.carbs}g carbs • {entry.protein}g protein • {entry.fat}g fat
                          </div>
                          {entry.notes && (
                            <div className="text-xs text-gray-400 mt-1">{entry.notes}</div>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteFoodEntry(entry.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="goals">
          <NutritionGoals />
        </TabsContent>

        <TabsContent value="trends">
          <Card className="medication-card bg-gray-800 p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Nutrition Trends</h3>
            <p className="text-muted-foreground">Trend analysis coming soon...</p>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <DietHistory 
            entries={foodEntries} 
            onDeleteEntry={deleteFoodEntry}
          />
        </TabsContent>
      </Tabs>

      <AddFoodDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        onSubmit={addFoodEntry}
      />
    </div>
  );
};

export default DietTracker;
