
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Bell, Plus, History, Check, Pill, List, Download, Sun, Moon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddMedicationDialog from './AddMedicationDialog';
import MedicationHistory from './MedicationHistory';
import SideEffectsTracker from './SideEffectsTracker';
import MedicationList from './MedicationList';

interface Medication {
  id: string;
  name: string;
  instructions: string;
  type: 'cobenfy' | 'latuda' | 'seroquel' | 'caplyta' | 'lantus' | 'custom';
  dosage: string;
  frequency: string;
  takeMorning: boolean;
  takeEvening: boolean;
}

interface MedicationLog {
  id: string;
  medicationId: string;
  medicationName: string;
  timestamp: string;
  timeOfDay: 'morning' | 'evening';
  taken: boolean;
  notes?: string;
}

const MedicationTracker = () => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medicationLog, setMedicationLog] = useState<MedicationLog[]>([]);
  const [addMedicationOpen, setAddMedicationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const { toast } = useToast();

  useEffect(() => {
    const savedMedications = localStorage.getItem('medications');
    if (savedMedications) {
      const parsedMedications = JSON.parse(savedMedications);
      // Ensure all medications have the new properties
      const medicationsWithTimeOfDay = parsedMedications.map((med: any) => ({
        ...med,
        frequency: med.frequency || 'Daily',
        takeMorning: med.takeMorning !== undefined ? med.takeMorning : true,
        takeEvening: med.takeEvening !== undefined ? med.takeEvening : false
      }));
      setMedications(medicationsWithTimeOfDay);
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
      frequency: medication.frequency || 'Daily',
      takeMorning: true,
      takeEvening: false
    };
    setMedications(prev => [...prev, newMedication]);
    setAddMedicationOpen(false);
  };

  const handleMedicationCheck = (medication: Medication, timeOfDay: 'morning' | 'evening', checked: boolean) => {
    const now = new Date();
    const today = now.toDateString();
    
    // Check if already logged today for this time
    const existingLog = medicationLog.find(log => 
      log.medicationId === medication.id && 
      log.timeOfDay === timeOfDay &&
      new Date(log.timestamp).toDateString() === today
    );

    if (existingLog) {
      // Update existing log
      const updatedLog = medicationLog.map(log =>
        log.id === existingLog.id ? { ...log, taken: checked } : log
      );
      setMedicationLog(updatedLog);
    } else if (checked) {
      // Create new log entry
      const newLog: MedicationLog = {
        id: Date.now().toString(),
        medicationId: medication.id,
        medicationName: medication.name,
        timestamp: now.toISOString(),
        timeOfDay,
        taken: true,
      };
      setMedicationLog(prev => [newLog, ...prev]);
    }

    toast({
      title: checked ? "Medication logged! 💊" : "Medication unmarked",
      description: `${medication.name} ${checked ? 'taken' : 'unmarked'} for ${timeOfDay}`,
    });
  };

  const getMedicationStatus = (medicationId: string, timeOfDay: 'morning' | 'evening') => {
    const today = new Date().toDateString();
    const log = medicationLog.find(log => 
      log.medicationId === medicationId && 
      log.timeOfDay === timeOfDay &&
      new Date(log.timestamp).toDateString() === today
    );
    return log?.taken || false;
  };

  const exportToPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const currentDate = new Date().toLocaleDateString();
    const recentLogs = medicationLog.slice(0, 30); // Last 30 entries
    
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Medication Report - ${currentDate}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1, h2 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .header { text-align: center; margin-bottom: 30px; }
            .section { margin: 30px 0; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Medication Report</h1>
            <p>Generated on ${currentDate}</p>
          </div>
          
          <div class="section">
            <h2>Current Medications</h2>
            <table>
              <thead>
                <tr>
                  <th>Medication</th>
                  <th>Dosage</th>
                  <th>Morning</th>
                  <th>Evening</th>
                  <th>Instructions</th>
                </tr>
              </thead>
              <tbody>
                ${medications.map(med => `
                  <tr>
                    <td>${med.name}</td>
                    <td>${med.dosage}</td>
                    <td>${med.takeMorning ? 'Yes' : 'No'}</td>
                    <td>${med.takeEvening ? 'Yes' : 'No'}</td>
                    <td>${med.instructions}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
          
          <div class="section">
            <h2>Recent Medication Log (Last 30 entries)</h2>
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Medication</th>
                  <th>Time of Day</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${recentLogs.map(log => `
                  <tr>
                    <td>${new Date(log.timestamp).toLocaleDateString()}</td>
                    <td>${new Date(log.timestamp).toLocaleTimeString()}</td>
                    <td>${log.medicationName}</td>
                    <td>${log.timeOfDay}</td>
                    <td>${log.taken ? 'Taken' : 'Missed'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;
    
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.print();
    
    toast({
      title: "PDF Export Ready! 📄",
      description: "Your medication report is ready to print or save as PDF",
    });
  };

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="current" className="flex items-center gap-2">
            <Pill size={18} />
            Today
          </TabsTrigger>
          <TabsTrigger value="list" className="flex items-center gap-2">
            <List size={18} />
            Current List
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
            <div className="flex gap-2">
              <Button
                onClick={exportToPDF}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download size={18} />
                Export PDF
              </Button>
              <Button
                onClick={() => setAddMedicationOpen(true)}
                className="bg-hot-pink text-black hover:bg-hot-pink/90"
              >
                <Plus size={18} />
                Add Medication
              </Button>
            </div>
          </div>

          <Card className="medication-card bg-gray-800 p-4">
            {medications.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No medications added yet</p>
            ) : (
              <div className="space-y-4">
                {medications.map((medication) => (
                  <Card key={medication.id} className="bg-gray-700 p-4">
                    <div className="flex flex-col space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">{medication.name}</h3>
                        <p className="text-sm text-muted-foreground">Dosage: {medication.dosage}</p>
                        <p className="text-sm text-champagne">{medication.instructions}</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4">
                        {medication.takeMorning && (
                          <div className="flex items-center space-x-3 p-3 bg-gray-600 rounded-lg">
                            <Sun className="text-yellow-400" size={20} />
                            <span className="text-foreground font-medium">Morning</span>
                            <Checkbox
                              checked={getMedicationStatus(medication.id, 'morning')}
                              onCheckedChange={(checked) => 
                                handleMedicationCheck(medication, 'morning', checked as boolean)
                              }
                              className="ml-auto"
                            />
                          </div>
                        )}
                        
                        {medication.takeEvening && (
                          <div className="flex items-center space-x-3 p-3 bg-gray-600 rounded-lg">
                            <Moon className="text-blue-400" size={20} />
                            <span className="text-foreground font-medium">Evening</span>
                            <Checkbox
                              checked={getMedicationStatus(medication.id, 'evening')}
                              onCheckedChange={(checked) => 
                                handleMedicationCheck(medication, 'evening', checked as boolean)
                              }
                              className="ml-auto"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </Card>
          
          <AddMedicationDialog
            open={addMedicationOpen}
            onOpenChange={setAddMedicationOpen}
            onSubmit={handleAddMedication}
          />
        </TabsContent>

        <TabsContent value="list" className="animate-fade-in">
          <MedicationList 
            medications={medications}
            onUpdateMedication={(updatedMed) => {
              setMedications(prev => prev.map(med => 
                med.id === updatedMed.id ? updatedMed : med
              ));
            }}
            onDeleteMedication={(medId) => {
              setMedications(prev => prev.filter(med => med.id !== medId));
              toast({
                title: "Medication removed",
                description: "The medication has been deleted from your list",
              });
            }}
            onExportPDF={exportToPDF}
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
