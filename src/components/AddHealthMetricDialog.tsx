
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Activity } from 'lucide-react';

interface HealthMetricData {
  type: 'heart-rate-variability' | 'sleep' | 'blood-pressure' | 'weight';
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
    type: 'heart-rate-variability',
    value: 0,
    unit: 'ms',
    notes: '',
    additionalData: {}
  });
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [sleepQuality, setSleepQuality] = useState('');

  const getUnitForType = (type: HealthMetricData['type']) => {
    switch (type) {
      case 'heart-rate-variability':
        return 'ms';
      case 'sleep':
        return 'hours';
      case 'blood-pressure':
        return 'mmHg';
      case 'weight':
        return 'lbs';
      default:
        return '';
    }
  };

  const handleTypeChange = (type: HealthMetricData['type']) => {
    setFormData(prev => ({
      ...prev,
      type,
      unit: getUnitForType(type),
      value: 0,
      additionalData: {}
    }));
    setSystolic('');
    setDiastolic('');
    setSleepQuality('');
  };

  const handleSubmit = () => {
    let additionalData: Record<string, any> = {};
    
    if (formData.type === 'blood-pressure' && systolic && diastolic) {
      additionalData = { systolic: parseInt(systolic), diastolic: parseInt(diastolic) };
    } else if (formData.type === 'sleep' && sleepQuality) {
      additionalData = { quality: sleepQuality };
    }

    const metric = {
      ...formData,
      additionalData: Object.keys(additionalData).length > 0 ? additionalData : undefined
    };
    
    onSubmit(metric);
    handleReset();
  };

  const handleReset = () => {
    setFormData({
      type: 'heart-rate-variability',
      value: 0,
      unit: 'ms',
      notes: '',
      additionalData: {}
    });
    setSystolic('');
    setDiastolic('');
    setSleepQuality('');
  };

  const handleCancel = () => {
    handleReset();
    on Open Change(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Activity className="text-hot-pink" size={20} />
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
              <option value="heart-rate-variability">Heart Rate Variability</option>
              <option value="sleep">Sleep Duration</option>
              <option value="blood-pressure">Blood Pressure</option>
              <option value="weight">Weight</option>
            </select>
          </div>

          {formData.type === 'blood-pressure' ? (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label htmlFor="systolic">Systolic</Label>
                <Input
                  id="systolic"
                  type="number"
                  placeholder="120"
                  value={systolic}
                  onChange={(e) => {
                    setSystolic(e.target.value);
                    setFormData(prev => ({ ...prev, value: parseInt(e.target.value) || 0 }));
                  }}
                />
              </div>
              <div>
                <Label htmlFor="diastolic">Diastolic</Label>
                <Input
                  id="diastolic"
                  type="number"
                  placeholder="80"
                  value={diastolic}
                  onChange={(e) => setDiastolic(e.target.value)}
                />
              </div>
            </div>
          ) : (
            <div>
              <Label htmlFor="value">
                Value ({formData.unit})
              </Label>
              <Input
                id="value"
                type="number"
                step={formData.type === 'sleep' ? '0.5' : '1'}
                value={formData.value || ''}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  value: parseFloat(e.target.value) || 0
                }))}
              />
            </div>
          )}

          {formData.type === 'sleep' && (
            <div>
              <Label htmlFor="sleepQuality">Sleep Quality</Label>
              <select
                id="sleepQuality"
                value={sleepQuality}
                onChange={(e) => setSleepQuality(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select quality (optional)</option>
                <option value="poor">Poor</option>
                <option value="fair">Fair</option>
                <option value="good">Good</option>
                <option value="excellent">Excellent</option>
              </select>
            </div>
          )}

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Additional notes..."
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
              disabled={formData.value <= 0}
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
