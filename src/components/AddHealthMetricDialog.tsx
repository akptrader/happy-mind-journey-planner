
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface HealthMetricData {
  type: 'heart-rate-variability' | 'sleep' | 'blood-pressure' | 'weight' | 'blood-sugar';
  value: number;
  unit: string;
  notes?: string;
  additionalData?: Record<string, any>;
}

interface AddHealthMetricDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (metric: HealthMetricData) => void;
}

const AddHealthMetricDialog = ({ open, onOpenChange, onSubmit }: AddHealthMetricDialogProps) => {
  const [formData, setFormData] = useState<HealthMetricData>({
    type: 'blood-sugar',
    value: 100,
    unit: 'mg/dL',
    notes: '',
    additionalData: {}
  });

  const handleTypeChange = (type: HealthMetricData['type']) => {
    let defaultValue = 100;
    let defaultUnit = 'mg/dL';
    
    switch (type) {
      case 'heart-rate-variability':
        defaultValue = 30;
        defaultUnit = 'ms';
        break;
      case 'sleep':
        defaultValue = 8;
        defaultUnit = 'hours';
        break;
      case 'blood-pressure':
        defaultValue = 120;
        defaultUnit = 'mmHg';
        break;
      case 'weight':
        defaultValue = 150;
        defaultUnit = 'lbs';
        break;
      case 'blood-sugar':
        defaultValue = 100;
        defaultUnit = 'mg/dL';
        break;
    }
    
    setFormData(prev => ({
      ...prev,
      type,
      value: defaultValue,
      unit: defaultUnit
    }));
  };

  const handleSubmit = () => {
    const metric = {
      ...formData,
      notes: formData.notes || undefined,
      additionalData: Object.keys(formData.additionalData || {}).length > 0 ? formData.additionalData : undefined
    };
    onSubmit(metric);
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      type: 'blood-sugar',
      value: 100,
      unit: 'mg/dL',
      notes: '',
      additionalData: {}
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
            <span className="text-2xl">📊</span>
            Log Health Metric
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="type">Metric Type</Label>
            <select
              id="type"
              value={formData.type}
              onChange={(e) => handleTypeChange(e.target.value as HealthMetricData['type'])}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="blood-sugar">Blood Sugar</option>
              <option value="sleep">Sleep Duration</option>
              <option value="heart-rate-variability">Heart Rate Variability</option>
              <option value="blood-pressure">Blood Pressure</option>
              <option value="weight">Weight</option>
            </select>
          </div>

          <div>
            <Label htmlFor="value">Value</Label>
            <div className="flex gap-2">
              <Input
                id="value"
                type="number"
                step="0.1"
                value={formData.value}
                onChange={(e) => setFormData(prev => ({ ...prev, value: parseFloat(e.target.value) || 0 }))}
                className="flex-1"
              />
              <Input
                value={formData.unit}
                onChange={(e) => setFormData(prev => ({ ...prev, unit: e.target.value }))}
                className="w-20"
                placeholder="Unit"
              />
            </div>
          </div>

          {formData.type === 'blood-pressure' && (
            <div>
              <Label htmlFor="diastolic">Diastolic (optional)</Label>
              <Input
                id="diastolic"
                type="number"
                placeholder="e.g., 80"
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  additionalData: { ...prev.additionalData, diastolic: parseInt(e.target.value) || undefined }
                }))}
              />
            </div>
          )}

          <div>
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="Any additional context or observations..."
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
              Log Metric
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddHealthMetricDialog;
