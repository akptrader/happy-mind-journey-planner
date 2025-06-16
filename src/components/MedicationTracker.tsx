import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Bell,
  List,
  Heart,
  Calendar,
  Timer,
  Edit,
  Plus,
  History,
  Activity,
  Pill,
  TrendingUp
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddMedicationDialog from './AddMedicationDialog';
import MedicationHistory from './MedicationHistory';
import MoodTracker from './MoodTracker';
import HealthMetrics from './HealthMetrics';
import Supplements from './Supplements';
import AddSupplementDialog from './AddSupplementDialog';
import Analytics from './Analytics';
import ExerciseTracker from './ExerciseTracker';

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  notes?: string;
}

interface MedicationLog {
  id: string;
  medicationId: string;
  timestamp: string;
}

const MedicationTracker = () => {
  const [medications, setMedications] = useState<Medication[]>(() => {
    const saved = localStorage.getItem('medications');
    return saved ? JSON.parse(saved) : [];
  });
  const [medicationLog, setMedicationLog] = useState<MedicationLog[]>(() => {
    const saved = localStorage.getItem('medicationLog');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showMoodTracker, setShowMoodTracker] = useState(false);
  const [showHealthMetrics, setShowHealthMetrics] = useState(false);
  const [showSupplements, setShowSupplements] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showExercise, setShowExercise] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem('medicationLog', JSON.stringify(medicationLog));
  }, [medicationLog]);

  const addMedication = (medicationData: any) => {
    const medication = {
      id: Date.now().toString(),
      name: medicationData.name,
      dosage: medicationData.dosage,
      frequency: medicationData.frequency || 'Daily',
      notes: medicationData.notes
    };
    setMedications(prev => [...prev, medication]);
    setShowAddDialog(false);
    toast({
      title: "Medication added! 💊",
      description: `${medication.name} added to your list.`,
    });
  };

  const logMedication = (medicationId: string) => {
    const newLogEntry: MedicationLog = {
      id: Date.now().toString(),
      medicationId: medicationId,
      timestamp: new Date().toISOString(),
    };
    setMedicationLog(prev => [...prev, newLogEntry]);
    toast({
      title: "Medication logged! ✅",
      description: "Good job, keep it up!",
    });
  };

  const deleteMedication = (id: string) => {
    setMedications(prev => prev.filter(medication => medication.id !== id));
    setMedicationLog(prev => prev.filter(log => log.medicationId !== id));
    toast({
      title: "Medication deleted! 🗑️",
      description: "Medication removed from your list.",
    });
  };

  if (showAnalytics) {
    return <Analytics onBack={() => setShowAnalytics(false)} />;
  }

  if (showHistory) {
    return <MedicationHistory
      medications={medications}
      medicationLog={medicationLog}
      onBack={() => setShowHistory(false)}
    />;
  }

  if (showMoodTracker) {
    return <MoodTracker onBack={() => setShowMoodTracker(false)} />;
  }

  if (showHealthMetrics) {
    return <HealthMetrics onBack={() => setShowHealthMetrics(false)} />;
  }

  if (showSupplements) {
    return <Supplements onBack={() => setShowSupplements(false)} />;
  }

  if (showExercise) {
    return <ExerciseTracker onBack={() => setShowExercise(false)} />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="text-hot-pink" size={24} />
          <h2 className="text-2xl font-semibold text-foreground">Medication Tracker</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setShowAddDialog(true)}
            className="bg-hot-pink text-black hover:bg-hot-pink/90"
          >
            <Plus size={18} />
            Add Medication
          </Button>
          <Button
            onClick={() => setShowHistory(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <History size={18} />
            History
          </Button>
          <Button
            onClick={() => setShowMoodTracker(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Heart size={18} />
            Mood
          </Button>
          <Button
            onClick={() => setShowHealthMetrics(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Activity size={18} />
            Health
          </Button>
          <Button
            onClick={() => setShowSupplements(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <Pill size={18} />
            Supplements
          </Button>
          <Button
            onClick={() => setShowAnalytics(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <TrendingUp size={18} />
            Analytics
          </Button>
        </div>
      </div>

      {medications.length === 0 ? (
        <Card className="medication-card bg-gray-800 p-6 text-center">
          <Bell className="text-hot-pink mx-auto mb-4" size={48} />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Medications Added</h3>
          <p className="text-muted-foreground">Add your medications to start tracking.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {medications.map((medication) => (
            <Card key={medication.id} className="medication-card bg-gray-800 p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gold">{medication.name}</h3>
                  <p className="text-sm text-champagne">
                    {medication.dosage}, {medication.frequency}
                  </p>
                  {medication.notes && (
                    <p className="text-xs text-muted-foreground">{medication.notes}</p>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => deleteMedication(medication.id)}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex justify-between items-center mt-4">
                <Button
                  className="bg-hot-pink text-black hover:bg-hot-pink/90"
                  onClick={() => logMedication(medication.id)}
                >
                  Take Now
                </Button>
                <span className="text-xs text-muted-foreground">
                  Last taken:{' '}
                  {medicationLog
                    .filter((log) => log.medicationId === medication.id)
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .slice(0, 1)
                    .map((log) => (
                      <span key={log.id}>
                        {new Date(log.timestamp).toLocaleDateString()}
                      </span>
                    ))}
                </span>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AddMedicationDialog open={showAddDialog} onOpenChange={setShowAddDialog} onSubmit={addMedication} />
    </div>
  );
};

export default MedicationTracker;
