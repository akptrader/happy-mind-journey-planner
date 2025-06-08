
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Bell, Check, History, StickyNote } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MedicationHistory from './MedicationHistory';
import AddNoteDialog from './AddNoteDialog';

interface MedicationDose {
  id: string;
  name: string;
  time: string;
  taken: boolean;
  takenAt?: string;
  instructions: string;
  type: 'cobenfy' | 'latuda' | 'anti-nausea';
  note?: string;
}

interface MedicationRecord {
  id: string;
  medicationId: string;
  name: string;
  takenAt: string;
  note?: string;
  type: 'cobenfy' | 'latuda' | 'anti-nausea';
}

const MedicationTracker = () => {
  const { toast } = useToast();
  const [showHistory, setShowHistory] = useState(false);
  const [noteDialogOpen, setNoteDialogOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<string | null>(null);
  const [medications, setMedications] = useState<MedicationDose[]>([
    {
      id: '1',
      name: 'Anti-nausea medication',
      time: '08:00',
      taken: false,
      instructions: 'Take before first Cobenfy dose',
      type: 'anti-nausea'
    },
    {
      id: '2',
      name: 'Cobenfy (Morning)',
      time: '08:30',
      taken: false,
      instructions: '2 hours after breakfast OR 1 hour before lunch',
      type: 'cobenfy'
    },
    {
      id: '3',
      name: 'Anti-nausea medication',
      time: '15:00',
      taken: false,
      instructions: 'Take before second Cobenfy dose',
      type: 'anti-nausea'
    },
    {
      id: '4',
      name: 'Cobenfy (Afternoon)',
      time: '15:30',
      taken: false,
      instructions: '2 hours after lunch, 1+ hour before Latuda',
      type: 'cobenfy'
    },
    {
      id: '5',
      name: 'Latuda with dinner',
      time: '18:00',
      taken: false,
      instructions: 'With 350+ calories, 2+ hours before bed',
      type: 'latuda'
    }
  ]);

  const [medicationHistory, setMedicationHistory] = useState<MedicationRecord[]>(() => {
    const saved = localStorage.getItem('medicationHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('medicationHistory', JSON.stringify(medicationHistory));
  }, [medicationHistory]);

  const markAsTaken = (id: string, note?: string) => {
    const now = new Date().toISOString();
    const medication = medications.find(med => med.id === id);
    
    if (!medication) return;

    setMedications(prev => 
      prev.map(med => 
        med.id === id 
          ? { ...med, taken: true, takenAt: now, note }
          : med
      )
    );

    // Add to history
    const historyRecord: MedicationRecord = {
      id: `${id}-${now}`,
      medicationId: id,
      name: medication.name,
      takenAt: now,
      note,
      type: medication.type
    };

    setMedicationHistory(prev => [historyRecord, ...prev]);
    
    toast({
      title: "Medication taken! 💊",
      description: `${medication.name} marked as complete at ${new Date(now).toLocaleTimeString()}`,
    });
  };

  const handleTakeWithNote = (id: string) => {
    setSelectedMedication(id);
    setNoteDialogOpen(true);
  };

  const handleNoteSubmit = (note: string) => {
    if (selectedMedication) {
      markAsTaken(selectedMedication, note);
    }
    setNoteDialogOpen(false);
    setSelectedMedication(null);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'cobenfy':
        return 'border-l-hot-pink bg-gray-800';
      case 'latuda':
        return 'border-l-gold bg-gray-800';
      case 'anti-nausea':
        return 'border-l-champagne-dark bg-gray-800';
      default:
        return 'border-l-gray-300 bg-gray-800';
    }
  };

  if (showHistory) {
    return (
      <MedicationHistory 
        history={medicationHistory}
        onBack={() => setShowHistory(false)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Bell className="text-hot-pink" size={24} />
          <h2 className="text-2xl font-semibold text-foreground">Today's Medications</h2>
        </div>
        <Button
          onClick={() => setShowHistory(true)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <History size={18} />
          History
        </Button>
      </div>
      
      {medications.map((med, index) => (
        <Card key={med.id} className={`medication-card border-l-4 ${getTypeColor(med.type)} ${med.taken ? 'completed-task' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Clock size={18} className="text-muted-foreground" />
                <span className="font-medium text-lg">{med.time}</span>
                <span className="font-semibold text-foreground">{med.name}</span>
                {med.taken && med.takenAt && (
                  <span className="text-sm text-gold">
                    ✓ {new Date(med.takenAt).toLocaleTimeString()}
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground ml-9">{med.instructions}</p>
              {med.note && (
                <p className="text-sm text-champagne ml-9 mt-1">📝 {med.note}</p>
              )}
            </div>
            
            <div className="flex gap-2 ml-4">
              {!med.taken && (
                <Button
                  onClick={() => handleTakeWithNote(med.id)}
                  variant="outline"
                  size="sm"
                  className="border-hot-pink text-hot-pink hover:bg-hot-pink hover:text-black"
                >
                  <StickyNote size={16} />
                </Button>
              )}
              <Button
                onClick={() => markAsTaken(med.id)}
                disabled={med.taken}
                className={`${med.taken ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-white text-hot-pink hover:bg-gray-100 border border-hot-pink'}`}
              >
                {med.taken ? <Check size={18} /> : 'Take'}
              </Button>
            </div>
          </div>
        </Card>
      ))}

      <AddNoteDialog
        open={noteDialogOpen}
        onOpenChange={setNoteDialogOpen}
        onSubmit={handleNoteSubmit}
        medicationName={selectedMedication ? medications.find(m => m.id === selectedMedication)?.name || '' : ''}
      />
    </div>
  );
};

export default MedicationTracker;
