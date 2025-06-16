
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus } from 'lucide-react';

interface MedicationData {
  name: string;
  time: string;
  instructions: string;
  type: 'cobenfy' | 'latuda' | 'seroquel' | 'caplyta' | 'lantus' | 'custom';
  dosage?: string;
}

interface AddMedicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (medication: MedicationData) => void;
}

const AddMedicationDialog = ({ open, onOpenChange, onSubmit }: AddMedicationDialogProps) => {
  const [formData, setFormData] = useState<MedicationData>({
    name: '',
    time: '',
    instructions: '',
    type: 'custom',
    dosage: ''
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.time) {
      return;
    }
    onSubmit(formData);
    setFormData({
      name: '',
      time: '',
      instructions: '',
      type: 'custom',
      dosage: ''
    });
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      time: '',
      instructions: '',
      type: 'custom',
      dosage: ''
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="text-hot-pink" size={20} />
            Add New Medication
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Medication Name</Label>
            <Input
              id="name"
              placeholder="e.g., Vitamin D, Melatonin"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="dosage">Dosage</Label>
            <Input
              id="dosage"
              placeholder="e.g., 25mg, 2 tablets"
              value={formData.dosage}
              onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="instructions">Instructions</Label>
            <Textarea
              id="instructions"
              placeholder="e.g., Take with food, Before bedtime"
              value={formData.instructions}
              onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!formData.name || !formData.time}
              className="bg-hot-pink text-black hover:bg-hot-pink/90"
            >
              Add Medication
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddMedicationDialog;
