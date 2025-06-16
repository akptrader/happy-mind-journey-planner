
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Calendar, Search, Trash2 } from 'lucide-react';

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

interface DietHistoryProps {
  entries: FoodEntry[];
  onDeleteEntry: (id: string) => void;
}

const DietHistory = ({ entries, onDeleteEntry }: DietHistoryProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.food.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.notes?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDate = !selectedDate || 
                       new Date(entry.timestamp).toDateString() === new Date(selectedDate).toDateString();
    return matchesSearch && matchesDate;
  });

  const groupedEntries = filteredEntries.reduce((groups, entry) => {
    const date = new Date(entry.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(entry);
    return groups;
  }, {} as Record<string, FoodEntry[]>);

  const getMealIcon = (meal: string) => {
    switch (meal) {
      case 'breakfast': return '🌅';
      case 'lunch': return '☀️';
      case 'dinner': return '🌙';
      case 'snack': return '🍿';
      default: return '🍽️';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="space-y-6">
      <Card className="medication-card bg-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Calendar className="text-hot-pink" size={20} />
          <h3 className="text-lg font-semibold text-foreground">Diet History</h3>
        </div>
        
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Search foods..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-auto"
          />
        </div>

        {Object.keys(groupedEntries).length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No food entries found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {Object.entries(groupedEntries)
              .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
              .map(([date, dayEntries]) => {
                const dayTotals = dayEntries.reduce((totals, entry) => ({
                  calories: totals.calories + entry.calories,
                  carbs: totals.carbs + entry.carbs,
                  protein: totals.protein + entry.protein,
                  fat: totals.fat + entry.fat,
                }), { calories: 0, carbs: 0, protein: 0, fat: 0 });

                return (
                  <div key={date} className="space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="text-lg font-medium text-foreground">
                        {new Date(date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </h4>
                      <div className="text-sm text-muted-foreground">
                        {dayTotals.calories} cal • {dayTotals.carbs}g carbs • {dayTotals.protein}g protein • {dayTotals.fat}g fat
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {dayEntries
                        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                        .map(entry => (
                          <div key={entry.id} className="flex justify-between items-start p-3 bg-gray-700 rounded-lg">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-lg">{getMealIcon(entry.meal)}</span>
                                <span className="font-medium text-foreground capitalize">{entry.meal}</span>
                                <span className="text-xs text-muted-foreground">
                                  {formatTime(entry.timestamp)}
                                </span>
                              </div>
                              <div className="font-medium text-foreground">{entry.food}</div>
                              <div className="text-sm text-muted-foreground">
                                {entry.calories} cal • {entry.carbs}g carbs • {entry.protein}g protein • {entry.fat}g fat
                                {entry.fiber && ` • ${entry.fiber}g fiber`}
                                {entry.sugar && ` • ${entry.sugar}g sugar`}
                              </div>
                              {entry.notes && (
                                <div className="text-xs text-gray-400 mt-1">{entry.notes}</div>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onDeleteEntry(entry.id)}
                              className="text-red-400 hover:text-red-300 ml-2"
                            >
                              <Trash2 size={14} />
                            </Button>
                          </div>
                        ))}
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </Card>
    </div>
  );
};

export default DietHistory;
