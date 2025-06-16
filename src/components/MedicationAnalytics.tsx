
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from 'recharts';
import { Pill, Plus, Edit, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface MedicationAnalyticsProps {
  timeRange: string;
}

const MedicationAnalytics = ({ timeRange }: MedicationAnalyticsProps) => {
  const [medications, setMedications] = useState<any[]>([]);
  const [dosageData, setDosageData] = useState<any[]>([]);
  const [editingMed, setEditingMed] = useState<string | null>(null);
  const [newMedName, setNewMedName] = useState('');
  const [newMedDosage, setNewMedDosage] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const loadData = () => {
      const storedMeds = JSON.parse(localStorage.getItem('medications') || '[]');
      setMedications(storedMeds);
      
      const dosageEntries = JSON.parse(localStorage.getItem('dosageEntries') || '[]');
      
      const daysToCheck = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - daysToCheck);

      // Generate dosage trend data
      const trendData = [];
      for (let i = daysToCheck - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toDateString();
        
        const dayData: any = {
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        };

        storedMeds.forEach((med: any) => {
          const dayEntries = dosageEntries.filter((entry: any) => 
            entry.medicationId === med.id && 
            new Date(entry.timestamp).toDateString() === dateStr
          );
          
          if (dayEntries.length > 0) {
            const avgDosage = dayEntries.reduce((sum: number, entry: any) => sum + entry.dosage, 0) / dayEntries.length;
            dayData[med.name] = avgDosage;
          }
        });
        
        trendData.push(dayData);
      }
      
      setDosageData(trendData);
    };

    loadData();
  }, [timeRange]);

  const addMedication = () => {
    if (!newMedName.trim()) return;
    
    const newMed = {
      id: Date.now().toString(),
      name: newMedName,
      dosage: newMedDosage,
      time: '12:00',
      instructions: '',
      type: 'custom',
      frequency: 'Daily'
    };
    
    const updatedMeds = [...medications, newMed];
    setMedications(updatedMeds);
    localStorage.setItem('medications', JSON.stringify(updatedMeds));
    
    setNewMedName('');
    setNewMedDosage('');
    
    toast({
      title: "Medication added! 💊",
      description: `${newMedName} added to your list`,
    });
  };

  const deleteMedication = (id: string) => {
    const updatedMeds = medications.filter(med => med.id !== id);
    setMedications(updatedMeds);
    localStorage.setItem('medications', JSON.stringify(updatedMeds));
    
    const medName = medications.find(med => med.id === id)?.name;
    toast({
      title: "Medication removed",
      description: `${medName} removed from your list`,
    });
  };

  const updateMedication = (id: string, newName: string) => {
    if (!newName.trim()) return;
    
    const updatedMeds = medications.map(med => 
      med.id === id ? { ...med, name: newName } : med
    );
    setMedications(updatedMeds);
    localStorage.setItem('medications', JSON.stringify(updatedMeds));
    setEditingMed(null);
    
    toast({
      title: "Medication updated! ✏️",
      description: `Medication name changed to ${newName}`,
    });
  };

  const chartConfig = medications.reduce((config, med, index) => {
    const colors = ['#ec4899', '#ffd700', '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];
    config[med.name] = {
      label: med.name,
      color: colors[index % colors.length],
    };
    return config;
  }, {} as any);

  return (
    <div className="space-y-6">
      {/* Medication Management */}
      <Card className="medication-card bg-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Pill className="text-hot-pink" size={20} />
          <h3 className="text-lg font-semibold text-foreground">Manage Medications</h3>
        </div>
        
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-2">
            <Input
              placeholder="Medication name"
              value={newMedName}
              onChange={(e) => setNewMedName(e.target.value)}
            />
            <Input
              placeholder="Default dosage"
              value={newMedDosage}
              onChange={(e) => setNewMedDosage(e.target.value)}
            />
            <Button onClick={addMedication} className="bg-hot-pink text-black hover:bg-hot-pink/90">
              <Plus size={16} />
              Add
            </Button>
          </div>
          
          <div className="space-y-2">
            {medications.map((med) => (
              <div key={med.id} className="flex items-center justify-between bg-gray-700 p-3 rounded">
                {editingMed === med.id ? (
                  <Input
                    defaultValue={med.name}
                    onBlur={(e) => updateMedication(med.id, e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && updateMedication(med.id, (e.target as HTMLInputElement).value)}
                    className="flex-1 mr-2"
                  />
                ) : (
                  <span className="text-foreground">{med.name}</span>
                )}
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setEditingMed(editingMed === med.id ? null : med.id)}
                  >
                    <Edit size={14} />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => deleteMedication(med.id)}
                    className="hover:bg-red-500 hover:text-white"
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Dosage Trends Chart */}
      <Card className="medication-card bg-gray-800 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Pill className="text-hot-pink" size={20} />
          <h3 className="text-lg font-semibold text-foreground">Dosage Trends</h3>
        </div>
        <ChartContainer config={chartConfig} className="h-80">
          <LineChart data={dosageData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <ChartTooltip content={<ChartTooltipContent />} />
            {medications.map((med, index) => {
              const colors = ['#ec4899', '#ffd700', '#10b981', '#3b82f6', '#8b5cf6', '#f59e0b'];
              return (
                <Line
                  key={med.id}
                  type="monotone"
                  dataKey={med.name}
                  stroke={colors[index % colors.length]}
                  strokeWidth={2}
                  connectNulls={false}
                  dot={{ fill: colors[index % colors.length], strokeWidth: 2, r: 4 }}
                />
              );
            })}
          </LineChart>
        </ChartContainer>
        <div className="mt-4 text-xs text-muted-foreground">
          <p>Track your medication dosage changes over time. Add dosage entries in the Medication Tracker.</p>
        </div>
      </Card>
    </div>
  );
};

export default MedicationAnalytics;
