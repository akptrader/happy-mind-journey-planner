import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { Bell, Plus, History, Check, Pill, List, Download, Sun, Moon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useDataMigration } from '@/hooks/useDataMigration';
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
  const { user } = useAuth();
  const { migrationComplete } = useDataMigration();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [medicationLog, setMedicationLog] = useState<MedicationLog[]>([]);
  const [addMedicationOpen, setAddMedicationOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Load medications from Supabase
  useEffect(() => {
    if (!user || !migrationComplete) return;

    const loadMedications = async () => {
      try {
        const { data: supabaseMeds, error } = await supabase
          .from('medications')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;

        // Transform Supabase data to local format
        const transformedMeds = supabaseMeds?.map(med => ({
          id: med.id,
          name: med.name,
          instructions: `Take ${med.dosage} ${med.frequency}`,
          type: 'custom' as const,
          dosage: med.dosage,
          frequency: med.frequency,
          takeMorning: med.time === 'morning' || !med.time,
          takeEvening: med.time === 'evening'
        })) || [];

        setMedications(transformedMeds);
        setLoading(false);
      } catch (error) {
        console.error('Error loading medications:', error);
        setLoading(false);
      }
    };

    loadMedications();
  }, [user, migrationComplete]);

  const handleAddMedication = async (medication: Medication) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('medications')
        .insert({
          user_id: user.id,
          name: medication.name,
          dosage: medication.dosage,
          frequency: medication.frequency,
          time: medication.takeMorning ? 'morning' : (medication.takeEvening ? 'evening' : null)
        })
        .select()
        .single();

      if (error) throw error;

      const newMedication = {
        id: data.id,
        name: data.name,
        instructions: `Take ${data.dosage} ${data.frequency}`,
        type: 'custom' as const,
        dosage: data.dosage,
        frequency: data.frequency,
        takeMorning: data.time === 'morning' || !data.time,
        takeEvening: data.time === 'evening'
      };

      setMedications(prev => [...prev, newMedication]);
      setAddMedicationOpen(false);

      toast({
        title: "Medication added! 💊",
        description: "Your medication has been saved to the cloud",
      });
    } catch (error) {
      console.error('Error adding medication:', error);
      toast({
        title: "Error adding medication",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const handleMedicationCheck = async (medication: Medication, timeOfDay: 'morning' | 'evening', checked: boolean) => {
    if (!user) return;

    try {
      if (checked) {
        await supabase
          .from('medications')
          .update({ 
            taken: true, 
            taken_at: new Date().toISOString() 
          })
          .eq('id', medication.id);
      }

      toast({
        title: checked ? "Medication logged! 💊" : "Medication unmarked",
        description: `${medication.name} ${checked ? 'taken' : 'unmarked'} for ${timeOfDay}`,
      });
    } catch (error) {
      console.error('Error updating medication:', error);
    }
  };

  const getMedicationStatus = (medicationId: string, timeOfDay: 'morning' | 'evening') => {
    // For now, return false - we'll implement this with proper logging later
    return false;
  };

  // ... keep existing code (exportToPDF function)
  const exportToPDF = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const currentDate = new Date().toLocaleDateString();
    
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

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Loading your medications...</div>
      </div>
    );
  }

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
