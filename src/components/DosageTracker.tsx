
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Pill, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const DosageTracker = () => {
  const [selectedMedication, setSelectedMedication] = useState('');
  const [dosage, setDosage] = useState('');
  const [unit, setUnit] = useState('mg');
  const [notes, setNotes] = useState('');
  const { toast } = useToast();

  const medications = JSON.parse(localStorage.getItem('medications') || '[]');

  const handleSubmit = () => {
    if (!selectedMedication || !dosage) {
      toast({
        title: "Missing information",
        description: "Please select a medication and enter dosage",
        variant: "destructive"
      });
      return;
    }

    const medication = medications.find((m: any) => m.id === selectedMedication);
    const dosageEntry = {
      id: Date.now().toString(),
      medicationId: selectedMedication,
      medicationName: medication?.name || '',
      timestamp: new Date().toISOString(),
      dosage: parseFloat(dosage),
      unit,
      notes
    };

    const existingEntries = JSON.parse(localStorage.getItem('dosageEntries') || '[]');
    localStorage.setItem('dosageEntries', JSON.stringify([dosageEntry, ...existingEntries]));

    toast({
      title: "Dosage recorded! 💊",
      description: `${dosage}${unit} of ${medication?.name} logged`,
    });

    // Reset form
    setDosage('');
    setNotes('');
  };

  return (
    <Card className="medication-card bg-gray-800 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Pill className="text-hot-pink" size={20} />
        <h3 className="text-lg font-semibold text-foreground">Track Medication Dosage</h3>
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

        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2">
            <Label htmlFor="dosage">Dosage</Label>
            <Input
              id="dosage"
              type="number"
              step="0.1"
              placeholder="25"
              value={dosage}
              onChange={(e) => setDosage(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="unit">Unit</Label>
            <Select value={unit} onValueChange={setUnit}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mg">mg</SelectItem>
                <SelectItem value="mcg">mcg</SelectItem>
                <SelectItem value="ml">ml</SelectItem>
                <SelectItem value="tablets">tablets</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            placeholder="Any notes about this dosage..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <Button 
          onClick={handleSubmit}
          className="w-full bg-hot-pink text-black hover:bg-hot-pink/90"
        >
          <Plus size={16} className="mr-2" />
          Record Dosage
        </Button>
      </div>
    </Card>
  );
};

export default DosageTracker;
