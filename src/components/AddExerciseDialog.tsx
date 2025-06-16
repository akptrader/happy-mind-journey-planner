
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface ExerciseData {
  type: 'cardio' | 'strength' | 'yoga' | 'walking' | 'stretching' | 'other';
  duration: number;
  intensity: 'low' | 'moderate' | 'high';
  notes?: string;
  location?: string;
}

interface AddExerciseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (exercise: ExerciseData) => void;
}

const AddExerciseDialog = ({ open, onOpenChange, onSubmit }: AddExerciseDialogProps) => {
  const [formData, setFormData] = useState<ExerciseData>({
    type: 'walking',
    duration: 30,
    intensity: 'moderate',
    notes: '',
    location: ''
  });

  const handleSubmit = () => {
    const exercise = {
      ...formData,
      notes: formData.notes || undefined,
      location: formData.location || undefined
    };
    onSubmit(exercise);
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      type: 'walking',
      duration: 30,
      intensity: 'moderate',
      notes: '',
      location: ''
    });
  };

  const handleCancel = () => {
    handleReset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-2xl">💪</span>
            Log Exercise
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="type">Exercise Type</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as ExerciseData['type'] }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="walking">Walking</option>
              <option value="cardio">Cardio</option>
              <option value="strength">Strength Training</option>
              <option value="yoga">Yoga</option>
              <option value="stretching">Stretching</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Input
              id="duration"
              type="number"
              min="1"
              value={formData.duration}
              onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) || 30 }))}
            />
          </div>

          <div>
            <Label htmlFor="intensity">Intensity</Label>
            <select
              id="intensity"
              value={formData.intensity}
              onChange={(e) => setFormData(prev => ({ ...prev, intensity: e.target.value as ExerciseData['intensity'] }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="low">Low</option>
              <option value="moderate">Moderate</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <Label htmlFor="location">Location (optional)</Label>
            <Input
              id="location"
              placeholder="e.g., gym, park, home"
              value={formData.location}
              onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="How did it feel? Any achievements?"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-hot-pink text-black hover:bg-hot-pink/90"
            >
              Log Exercise
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddExerciseDialog;
