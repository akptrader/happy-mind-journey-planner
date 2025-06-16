
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Sun, Moon } from 'lucide-react';

interface MedicationData {
  name: string;
  instructions: string;
  type: 'cobenfy' | 'latuda' | 'seroquel' | 'caplyta' | 'lantus' | 'custom';
  dosage: string;
  frequency: string;
  takeMorning: boolean;
  takeEvening: boolean;
}

interface AddMedicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (medication: MedicationData) => void;
}

const AddMedicationDialog = ({ open, onOpenChange, onSubmit }: AddMedicationDialogProps) => {
  const [formData, setFormData] = useState<MedicationData>({
    name: '',
    instructions: '',
    type: 'custom',
    dosage: '',
    frequency: 'Daily',
    takeMorning: true,
    takeEvening: false
  });

  const handleSubmit = () => {
    if (!formData.name || (!formData.takeMorning && !formData.takeEvening)) {
      return;
    }
    onSubmit(formData);
    setFormData({
      name: '',
      instructions: '',
      type: 'custom',
      dosage: '',
      frequency: 'Daily',
      takeMorning: true,
      takeEvening: false
    });
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      instructions: '',
      type: 'custom',
      dosage: '',
      frequency: 'Daily',
      takeMorning: true,
      takeEvening: false
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
            <Label>When do you take this medication?</Label>
            <div className="flex flex-col gap-3 mt-2">
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <Sun className="text-yellow-400" size={20} />
                <span className="text-foreground font-medium">Morning</span>
                <Checkbox
                  checked={formData.takeMorning}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, takeMorning: checked as boolean }))
                  }
                  className="ml-auto"
                />
              </div>
              
              <div className="flex items-center space-x-3 p-3 bg-muted rounded-lg">
                <Moon className="text-blue-400" size={20} />
                <span className="text-foreground font-medium">Evening</span>
                <Checkbox
                  checked={formData.takeEvening}
                  onCheckedChange={(checked) => 
                    setFormData(prev => ({ ...prev, takeEvening: checked as boolean }))
                  }
                  className="ml-auto"
                />
              </div>
            </div>
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
              disabled={!formData.name || (!formData.takeMorning && !formData.takeEvening)}
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
