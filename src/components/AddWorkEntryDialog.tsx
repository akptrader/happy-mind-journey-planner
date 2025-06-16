
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Briefcase } from 'lucide-react';

interface WorkEntryData {
  productivityLevel: number;
  focusLevel: number;
  energyLevel: number;
  tasksCompleted: number;
  hoursWorked: number;
  workType: 'creative' | 'analytical' | 'administrative' | 'meetings' | 'mixed';
  distractions: string[];
  notes?: string;
}

interface AddWorkEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (entry: WorkEntryData) => void;
}

const AddWorkEntryDialog = ({ open, onOpenChange, onSubmit }: AddWorkEntryDialogProps) => {
  const [formData, setFormData] = useState<WorkEntryData>({
    productivityLevel: 5,
    focusLevel: 5,
    energyLevel: 5,
    tasksCompleted: 0,
    hoursWorked: 1,
    workType: 'mixed',
    distractions: [],
    notes: ''
  });
  const [distractionInput, setDistractionInput] = useState('');

  const handleSubmit = () => {
    const entry = {
      ...formData,
      distractions: distractionInput ? distractionInput.split(',').map(d => d.trim()).filter(d => d) : [],
      notes: formData.notes || undefined
    };
    onSubmit(entry);
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      productivityLevel: 5,
      focusLevel: 5,
      energyLevel: 5,
      tasksCompleted: 0,
      hoursWorked: 1,
      workType: 'mixed',
      distractions: [],
      notes: ''
    });
    setDistractionInput('');
  };

  const handleCancel = () => {
    handleReset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="text-hot-pink" size={20} />
            Log Work Session
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="productivity">Productivity (1-10)</Label>
              <Input
                id="productivity"
                type="number"
                min="1"
                max="10"
                value={formData.productivityLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, productivityLevel: parseInt(e.target.value) || 1 }))}
              />
            </div>
            <div>
              <Label htmlFor="focus">Focus (1-10)</Label>
              <Input
                id="focus"
                type="number"
                min="1"
                max="10"
                value={formData.focusLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, focusLevel: parseInt(e.target.value) || 1 }))}
              />
            </div>
            <div>
              <Label htmlFor="energy">Energy (1-10)</Label>
              <Input
                id="energy"
                type="number"
                min="1"
                max="10"
                value={formData.energyLevel}
                onChange={(e) => setFormData(prev => ({ ...prev, energyLevel: parseInt(e.target.value) || 1 }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="tasks">Tasks Completed</Label>
              <Input
                id="tasks"
                type="number"
                min="0"
                value={formData.tasksCompleted}
                onChange={(e) => setFormData(prev => ({ ...prev, tasksCompleted: parseInt(e.target.value) || 0 }))}
              />
            </div>
            <div>
              <Label htmlFor="hours">Hours Worked</Label>
              <Input
                id="hours"
                type="number"
                min="0"
                step="0.5"
                value={formData.hoursWorked}
                onChange={(e) => setFormData(prev => ({ ...prev, hoursWorked: parseFloat(e.target.value) || 0 }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="workType">Work Type</Label>
            <select
              id="workType"
              value={formData.workType}
              onChange={(e) => setFormData(prev => ({ ...prev, workType: e.target.value as WorkEntryData['workType'] }))}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="creative">Creative Work</option>
              <option value="analytical">Analytical Work</option>
              <option value="administrative">Administrative Work</option>
              <option value="meetings">Meetings</option>
              <option value="mixed">Mixed Tasks</option>
            </select>
          </div>

          <div>
            <Label htmlFor="distractions">Distractions (comma-separated)</Label>
            <Input
              id="distractions"
              placeholder="e.g., social media, noise, fatigue, brain fog"
              value={distractionInput}
              onChange={(e) => setDistractionInput(e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="How did you feel? Any observations about your work performance?"
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
              Log Session
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddWorkEntryDialog;
