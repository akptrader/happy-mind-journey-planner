
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Brain } from 'lucide-react';

interface MoodEntryData {
  moodLevel: number;
  type: 'normal' | 'rapid-cycling' | 'panic-attack' | 'mixed-episode';
  notes?: string;
  triggers?: string[];
  severity?: 'mild' | 'moderate' | 'severe';
}

interface AddMoodEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (entry: MoodEntryData) => void;
}

const AddMoodEntryDialog = ({ open, onOpenChange, onSubmit }: AddMoodEntryDialogProps) => {
  const [formData, setFormData] = useState<MoodEntryData>({
    moodLevel: 5,
    type: 'normal',
    notes: '',
    triggers: [],
    severity: undefined
  });
  const [triggerInput, setTriggerInput] = useState('');

  const handleSubmit = () => {
    const entry = {
      ...formData,
      triggers: triggerInput ? triggerInput.split(',').map(t => t.trim()).filter(t => t) : undefined
    };
    onSubmit(entry);
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      moodLevel: 5,
      type: 'normal',
      notes: '',
      triggers: [],
      severity: undefined
    });
    setTriggerInput('');
  };

  const handleCancel = () => {
    handleReset();
    onOpenChange(false);
  };

  const requiresSeverity = formData.type === 'rapid-cycling' || formData.type === 'panic-attack' || formData.type === 'mixed-episode';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="text-hot-pink" size={20} />
            Log Mood Entry
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="moodLevel">Mood Level (1-10)</Label>
            <Input
              id="moodLevel"
              type="number"
              min="1"
              max="10"
              value={formData.moodLevel}
              onChange={(e) => setFormData(prev => ({ ...prev, moodLevel: parseInt(e.target.value) || 5 }))}
            />
            <p className="text-xs text-muted-foreground mt-1">
              1 = Very Low, 5 = Neutral, 10 = Very High
            </p>
          </div>

          <div>
            <Label htmlFor="type">Type</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                type: e.target.value as MoodEntryData['type'],
                severity: e.target.value === 'normal' ? undefined : prev.severity
              }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="normal">Normal Mood</option>
              <option value="rapid-cycling">Rapid Cycling</option>
              <option value="panic-attack">Panic Attack</option>
              <option value="mixed-episode">Mixed Episode</option>
            </select>
          </div>

          {requiresSeverity && (
            <div>
              <Label htmlFor="severity">Severity</Label>
              <select
                id="severity"
                value={formData.severity || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  severity: e.target.value as MoodEntryData['severity'] || undefined
                }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select severity</option>
                <option value="mild">Mild</option>
                <option value="moderate">Moderate</option>
                <option value="severe">Severe</option>
              </select>
            </div>
          )}

          <div>
            <Label htmlFor="triggers">Triggers (comma-separated)</Label>
            <Input
              id="triggers"
              placeholder="e.g., stress, lack of sleep, medication change"
              value={triggerInput}
              onChange={(e) => setTriggerInput(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional details about your mood..."
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
              Log Entry
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMoodEntryDialog;
