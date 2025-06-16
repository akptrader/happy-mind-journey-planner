
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart } from 'lucide-react';

interface SupplementData {
  name: string;
  dosage: string;
  frequency: string;
}

interface AddSupplementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (supplement: SupplementData) => void;
}

const AddSupplementDialog = ({ open, onOpenChange, onSubmit }: AddSupplementDialogProps) => {
  const [formData, setFormData] = useState<SupplementData>({
    name: '',
    dosage: '',
    frequency: 'Daily'
  });

  const handleSubmit = () => {
    if (!formData.name || !formData.dosage) {
      return;
    }
    onSubmit(formData);
    setFormData({
      name: '',
      dosage: '',
      frequency: 'Daily'
    });
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      dosage: '',
      frequency: 'Daily'
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="text-hot-pink" size={20} />
            Add New Supplement
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Supplement Name</Label>
            <Input
              id="name"
              placeholder="e.g., Vitamin D3, Omega-3"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="dosage">Dosage</Label>
            <Input
              id="dosage"
              placeholder="e.g., 1000mg, 2 capsules"
              value={formData.dosage}
              onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
            />
          </div>

          <div>
            <Label htmlFor="frequency">Frequency</Label>
            <Input
              id="frequency"
              placeholder="e.g., Daily, Twice daily"
              value={formData.frequency}
              onChange={(e) => setFormData(prev => ({ ...prev, frequency: e.target.value }))}
            />
          </div>
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!formData.name || !formData.dosage}
              className="bg-hot-pink text-black hover:bg-hot-pink/90"
            >
              Add Supplement
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddSupplementDialog;
