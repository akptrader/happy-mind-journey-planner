
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Plus, History, Clock, Check, X, Pill } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddMedicationDialog from './AddMedicationDialog';
import MedicationHistory from './MedicationHistory';
import SideEffectsTracker from './SideEffectsTracker';

interface Medication {
  id: string;
  name: string;
  time: string;
  instructions: string;
  type: 'cobenfy' | 'latuda' | 'seroquel' | 'caplyta' | 'lantus' | 'custom';
  dosage: string;
  frequency: string;
}

interface MedicationLog {
  id: string;
  medicationId: string;
  medicationName: string;
  timestamp: string;
  taken: boolean;
  notes?: string;
}

const MedicationTracker = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medicationLog, setMedicationLog] = useState<MedicationLog[]>([]);
  const [addMedicationOpen, setAddMedicationOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const { toast } = useToast();

  useEffect(() => {
    const savedMedications = localStorage.getItem('medications');
    if (savedMedications) {
      const parsedMedications = JSON.parse(savedMedications);
      // Ensure all medications have a frequency property
      const medicationsWithFrequency = parsedMedications.map((med: any) => ({
        ...med,
        frequency: med.frequency || 'Daily'
      }));
      setMedications(medicationsWithFrequency);
    }

    const savedMedicationLog = localStorage.getItem('medicationLog');
    if (savedMedicationLog) {
      setMedicationLog(JSON.parse(savedMedicationLog));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('medications', JSON.stringify(medications));
  }, [medications]);

  useEffect(() => {
    localStorage.setItem('medicationLog', JSON.stringify(medicationLog));
  }, [medicationLog]);

  const handleAddMedication = (medication: Medication) => {
    const newMedication = { 
      ...medication, 
      id: Date.now().toString(),
      frequency: medication.frequency || 'Daily'
    };
    setMedications(prev => [...prev, newMedication]);
    setAddMedicationOpen(false);
  };

  const logMedication = (medication: Medication) => {
    const now = new Date();
    const newLog: MedicationLog = {
      id: Date.now().toString(),
      medicationId: medication.id,
      medicationName: medication.name,
      timestamp: now.toISOString(),
      taken: true,
    };
    setMedicationLog(prev => [newLog, ...prev]);
    toast({
      title: "Medication logged! 🔔",
      description: `${medication.name} taken at ${now.toLocaleTimeString()}`,
    });
  };

  const markMissed = (medication: Medication) => {
    const now = new Date();
    const newLog: MedicationLog = {
      id: Date.now().toString(),
      medicationId: medication.id,
      medicationName: medication.name,
      timestamp: now.toISOString(),
      taken: false,
    };
    setMedicationLog(prev => [newLog, ...prev]);
    toast({
      title: "Medication marked missed",
      description: `You missed ${medication.name} at ${now.toLocaleTimeString()}`,
    });
  };

  const todayLogs = medicationLog.filter(log => 
    new Date(log.timestamp).toDateString() === new Date().toDateString()
  );

  if (showHistory) {
    return (
      <MedicationHistory 
        medications={medications}
        medicationLog={medicationLog}
        onBack={() => setShowHistory(false)}
      />
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-6">
          <TabsTrigger value="current" className="flex items-center gap-2">
            <Pill size={18} />
            Current Meds
          </TabsTrigger>
          <TabsTrigger value="side-effects" className="flex items-center gap-2">
            <Pill size={18} />
            Side Effects
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History size={18} />
            History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="current" className="animate-fade-in">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Bell className="text-hot-pink" size={24} />
              <h2 className="text-2xl font-semibold text-foreground">Today's Medications</h2>
            </div>
            <Button
              onClick={() => setAddMedicationOpen(true)}
              className="bg-hot-pink text-black hover:bg-hot-pink/90"
            >
              <Plus size={18} />
              Add Medication
            </Button>
          </div>

          <Card className="medication-card bg-gray-800 p-4">
            {medications.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No medications added yet</p>
            ) : (
              <div className="space-y-3">
                {medications.map((medication) => {
                  const lastLog = todayLogs.find(log => log.medicationId === medication.id);
                  const taken = lastLog?.taken ?? false;

                  return (
                    <Card key={medication.id} className="bg-gray-700">
                      <div className="flex items-center justify-between p-3">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{medication.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            Time: {medication.time}, Dosage: {medication.dosage}
                          </p>
                          <p className="text-sm text-champagne">{medication.instructions}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {taken ? (
                            <Button variant="outline" disabled>
                              <Check size={16} className="mr-2" />
                              Taken
                            </Button>
                          ) : (
                            <>
                              <Button
                                onClick={() => logMedication(medication)}
                                className="bg-green-500 text-black hover:bg-green-500/90"
                              >
                                <Clock size={16} className="mr-2" />
                                Log Taken
                              </Button>
                              <Button
                                onClick={() => markMissed(medication)}
                                className="bg-red-500 text-black hover:bg-red-500/90"
                              >
                                <X size={16} className="mr-2" />
                                Mark Missed
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </Card>
          
          <AddMedicationDialog
            open={addMedicationOpen}
            onOpenChange={setAddMedicationOpen}
            onSubmit={handleAddMedication}
          />
        </TabsContent>

        <TabsContent value="side-effects" className="animate-fade-in">
          <SideEffectsTracker />
        </TabsContent>

        <TabsContent value="history" className="animate-fade-in">
          <MedicationHistory 
            medications={medications}
            medicationLog={medicationLog}
            onBack={() => setActiveTab('current')}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicationTracker;
