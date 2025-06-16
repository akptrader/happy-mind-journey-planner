
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Activity, Plus, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const SideEffectsTracker = () => {
  const [selectedMedication, setSelectedMedication] = useState('');
  const [selectedEffects, setSelectedEffects] = useState<string[]>([]);
  const [severity, setSeverity] = useState([5]);
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const medications = JSON.parse(localStorage.getItem('medications') || '[]');
  
  const commonSideEffects = [
    'Drowsiness', 'Weight gain', 'Dizziness', 'Dry mouth', 'Nausea',
    'Headache', 'Fatigue', 'Blurred vision', 'Constipation', 'Restlessness',
    'Increased appetite', 'Sleep disturbance', 'Tremor', 'Memory issues'
  ];

  const addEffect = (effect: string) => {
    if (!selectedEffects.includes(effect)) {
      setSelectedEffects([...selectedEffects, effect]);
    }
  };

  const removeEffect = (effect: string) => {
    setSelectedEffects(selectedEffects.filter(e => e !== effect));
  };

  const handleSubmit = () => {
    if (!selectedMedication || selectedEffects.length === 0) {
      toast({
        title: "Missing information",
        description: "Please select a medication and at least one side effect",
        variant: "destructive"
      });
      return;
    }

    const medication = medications.find((m: any) => m.id === selectedMedication);
    const sideEffectEntry = {
      id: Date.now().toString(),
      medicationId: selectedMedication,
      medicationName: medication?.name || '',
      timestamp: new Date().toISOString(),
      effects: selectedEffects,
      severity: severity[0],
      notes
    };

    const existingEntries = JSON.parse(localStorage.getItem('sideEffects') || '[]');
    localStorage.setItem('sideEffects', JSON.stringify([sideEffectEntry, ...existingEntries]));

    toast({
      title: "Side effects recorded! ⚠️",
      description: `${selectedEffects.length} effects logged for ${medication?.name}`,
    });

    // Reset form
    setSelectedEffects([]);
    setSeverity([5]);
    setNotes('');
  };

  return (
    <Card className="medication-card bg-gray-800 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Activity className="text-hot-pink" size={20} />
        <h3 className="text-lg font-semibold text-foreground">Track Side Effects</h3>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="medication">Medication</Label>
          <Select value={selectedMedication} onValueChange={setSelectedMedication}>
            <SelectTrigger>
              <SelectValue placeholder="Select medication" />
            </SelectTrigger>
            <SelectContent>
              {medications.map((med: any) => (
                <SelectItem key={med.id} value={med.id}>
                  {med.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Common Side Effects</Label>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {commonSideEffects.map((effect) => (
              <Button
                key={effect}
                variant="outline"
                size="sm"
                onClick={() => addEffect(effect)}
                disabled={selectedEffects.includes(effect)}
                className="justify-start text-left"
              >
                <Plus size={12} className="mr-1" />
                {effect}
              </Button>
            ))}
          </div>
        </div>

        {selectedEffects.length > 0 && (
          <div>
            <Label>Selected Effects</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedEffects.map((effect) => (
                <Badge key={effect} variant="secondary" className="flex items-center gap-1">
                  {effect}
                  <X 
                    size={12} 
                    className="cursor-pointer hover:text-red-500"
                    onClick={() => removeEffect(effect)}
                  />
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div>
          <Label>Severity: {severity[0]}/10</Label>
          <Slider
            value={severity}
            onValueChange={setSeverity}
            max={10}
            min={1}
            step={1}
            className="mt-2"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
            <span>Mild</span>
            <span>Severe</span>
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            placeholder="Additional details about the side effects..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <Button 
          onClick={handleSubmit}
          className="w-full bg-hot-pink text-black hover:bg-hot-pink/90"
        >
          <Plus size={16} className="mr-2" />
          Record Side Effects
        </Button>
      </div>
    </Card>
  );
};

export default SideEffectsTracker;
