
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, History, Timer, MapPin, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddExerciseDialog from './AddExerciseDialog';
import ExerciseHistory from './ExerciseHistory';
import ExerciseTimer from './ExerciseTimer';

interface Exercise {
  id: string;
  timestamp: string;
  type: 'cardio' | 'strength' | 'yoga' | 'walking' | 'stretching' | 'other';
  duration: number; // in minutes
  intensity: 'low' | 'moderate' | 'high';
  notes?: string;
  location?: string;
}

interface ExerciseTrackerProps {
  onBack?: () => void;
}

const ExerciseTracker = ({ onBack }: ExerciseTrackerProps) => {
  const { toast } = useToast();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  
  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const saved = localStorage.getItem('exercises');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('exercises', JSON.stringify(exercises));
  }, [exercises]);

  const handleAddExercise = (exercise: Omit<Exercise, 'id' | 'timestamp'>) => {
    const newExercise: Exercise = {
      ...exercise,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setExercises(prev => [newExercise, ...prev]);
    setAddDialogOpen(false);
    
    toast({
      title: "Exercise logged! 💪",
      description: `${exercise.type} for ${exercise.duration} minutes recorded`,
    });
  };

  const handleTimerComplete = (duration: number) => {
    // Pre-fill the add dialog with timer duration
    const timedExercise = {
      type: 'other' as const,
      duration,
      intensity: 'moderate' as const,
      notes: 'Completed with timer',
      location: ''
    };
    
    const newExercise: Exercise = {
      ...timedExercise,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    setExercises(prev => [newExercise, ...prev]);
    setShowTimer(false);
    
    toast({
      title: "Timed exercise logged! ⏱️",
      description: `${duration} minutes of exercise recorded`,
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'cardio':
        return '🏃';
      case 'strength':
        return '💪';
      case 'yoga':
        return '🧘';
      case 'walking':
        return '🚶';
      case 'stretching':
        return '🤸';
      default:
        return '🏋️';
    }
  };

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'low':
        return 'border-l-green-500';
      case 'moderate':
        return 'border-l-yellow-500';
      case 'high':
        return 'border-l-red-500';
      default:
        return 'border-l-blue-500';
    }
  };

  if (showHistory) {
    return (
      <ExerciseHistory 
        exercises={exercises}
        onBack={() => setShowHistory(false)}
      />
    );
  }

  if (showTimer) {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-4 mb-6">
          <Button
            onClick={() => setShowTimer(false)}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
          <div className="flex items-center gap-2">
            <Clock className="text-hot-pink" size={24} />
            <h2 className="text-2xl font-semibold text-foreground">Exercise Timer</h2>
          </div>
        </div>
        
        <ExerciseTimer onComplete={handleTimerComplete} />
      </div>
    );
  }

  const todayExercises = exercises.filter(exercise => 
    new Date(exercise.timestamp).toDateString() === new Date().toDateString()
  );

  const totalMinutesToday = todayExercises.reduce((sum, exercise) => sum + exercise.duration, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        {onBack && (
          <Button
            onClick={onBack}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </Button>
        )}
        <div className="flex items-center gap-2">
          <span className="text-2xl">💪</span>
          <h2 className="text-2xl font-semibold text-foreground">Exercise Tracker</h2>
        </div>
        <div className="flex gap-2 ml-auto">
          <Button
            onClick={() => setShowTimer(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Clock size={18} />
            Timer
          </Button>
          <Button
            onClick={() => setAddDialogOpen(true)}
            className="bg-hot-pink text-black hover:bg-hot-pink/90"
          >
            <Plus size={18} />
            Log Exercise
          </Button>
          <Button
            onClick={() => setShowHistory(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <History size={18} />
            History
          </Button>
        </div>
      </div>

      {/* Today's Summary */}
      <Card className="medication-card wellness-gradient text-white">
        <div className="text-center">
          <h3 className="text-xl font-semibold mb-2">Today's Activity</h3>
          <div className="text-3xl font-bold mb-2">{totalMinutesToday} min</div>
          <p className="text-sm opacity-90">{todayExercises.length} exercise sessions</p>
        </div>
      </Card>

      <Card className="medication-card bg-gray-800 p-4">
        <h3 className="font-semibold text-foreground mb-3">Today's Exercises</h3>
        {todayExercises.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No exercises logged today</p>
        ) : (
          <div className="space-y-3">
            {todayExercises.map((exercise) => (
              <Card key={exercise.id} className={`border-l-4 ${getIntensityColor(exercise.intensity)} bg-gray-700`}>
                <div className="flex items-start justify-between p-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-lg">{getTypeIcon(exercise.type)}</span>
                      <span className="font-medium text-foreground capitalize">
                        {exercise.type}
                      </span>
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
        )}
      </Card>

      <AddExerciseDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddExercise}
      />
    </div>
  );
};

export default ExerciseTracker;
