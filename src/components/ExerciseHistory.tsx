
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, Timer, MapPin } from 'lucide-react';

interface Exercise {
  id: string;
  timestamp: string;
  type: 'cardio' | 'strength' | 'yoga' | 'walking' | 'stretching' | 'other';
  duration: number;
  intensity: 'low' | 'moderate' | 'high';
  notes?: string;
  location?: string;
}

interface ExerciseHistoryProps {
  exercises: Exercise[];
  onBack: () => void;
}

const ExerciseHistory = ({ exercises, onBack }: ExerciseHistoryProps) => {
  const [selectedDate, setSelectedDate] = useState<string>('');

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cardio': return '🏃';
      case 'strength': return '💪';
      case 'yoga': return '🧘';
      case 'walking': return '🚶';
      case 'stretching': return '🤸';
      default: return '🏋️';
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low': return 'border-l-green-500';
      case 'moderate': return 'border-l-yellow-500';
      case 'high': return 'border-l-red-500';
      default: return 'border-l-blue-500';
    }
  };

  // Group exercises by date
  const groupedExercises = exercises.reduce((acc, exercise) => {
    const date = new Date(exercise.timestamp).toDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(exercise);
    return acc;
  }, {} as Record<string, Exercise[]>);

  const dates = Object.keys(groupedExercises).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
  const filteredDates = selectedDate ? [selectedDate] : dates;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <Button
          onClick={onBack}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </Button>
        <h2 className="text-2xl font-semibold text-foreground">Exercise History</h2>
      </div>

      {dates.length > 1 && (
        <Card className="medication-card bg-gray-800 p-4">
          <div className="flex items-center gap-2 mb-3">
            <Calendar size={18} className="text-hot-pink" />
            <span className="font-medium">Filter by date:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => setSelectedDate('')}
              variant={selectedDate === '' ?'default' : 'outline'}
              size="sm"
            >
              All dates
            </Button>
            {dates.slice(0, 7).map(date => (
              <Button
                key={date}
                onClick={() => setSelectedDate(date)}
                variant={selectedDate === date ? 'default' : 'outline'}
                size="sm"
              >
                {new Date(date).toLocaleDateString()}
              </Button>
            ))}
          </div>
        </Card>
      )}

      {filteredDates.length === 0 ? (
        <Card className="medication-card bg-gray-800 p-6 text-center">
          <p className="text-muted-foreground">No exercise history found.</p>
        </Card>
      ) : (
        filteredDates.map(date => (
          <div key={date} className="space-y-3">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Calendar size={18} className="text-hot-pink" />
              {new Date(date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
              <span className="text-sm text-gold ml-2">
                ({groupedExercises[date].reduce((sum, ex) => sum + ex.duration, 0)} min total)
              </span>
            </h3>
            
            {groupedExercises[date]
              .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
              .map(exercise => (
                <Card key={exercise.id} className={`medication-card border-l-4 ${getIntensityColor(exercise.intensity)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-lg">{getTypeIcon(exercise.type)}</span>
                        <span className="font-medium text-foreground capitalize">{exercise.type}</span>
                        <div className="flex items-center gap-1 text-gold">
                          <Timer size={14} />
                          <span className="text-sm">{exercise.duration} min</span>
                        </div>
                        <span className="text-xs bg-gray-600 text-gray-200 px-2 py-1 rounded capitalize">
                          {exercise.intensity}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(exercise.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      {exercise.location && (
                        <div className="flex items-center gap-1 ml-6 mb-1">
                          <MapPin size={12} className="text-muted-foreground" />
                          <span className="text-xs text-champagne">{exercise.location}</span>
                        </div>
                      )}
                      {exercise.notes && (
                        <p className="text-sm text-champagne ml-6">{exercise.notes}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        ))
      )}
    </div>
  );
};

export default ExerciseHistory;
