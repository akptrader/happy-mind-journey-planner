
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { List, Download, Edit, Trash2, Save, X, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Medication {
  id: string;
  name: string;
  time: string;
  instructions: string;
  type: 'cobenfy' | 'latuda' | 'seroquel' | 'caplyta' | 'lantus' | 'custom';
  dosage: string;
  frequency: string;
}

interface MedicationListProps {
  medications: Medication[];
  onUpdateMedication: (medication: Medication) => void;
  onDeleteMedication: (medId: string) => void;
  onExportPDF: () => void;
}

const MedicationList = ({ 
  medications, 
  onUpdateMedication, 
  onDeleteMedication, 
  onExportPDF 
}: MedicationListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Medication | null>(null);
  const { toast } = useToast();

  const startEditing = (medication: Medication) => {
    setEditingId(medication.id);
    setEditForm({ ...medication });
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(null);
  };

  const saveChanges = () => {
    if (!editForm) return;
    
    onUpdateMedication(editForm);
    setEditingId(null);
    setEditForm(null);
    
    toast({
      title: "Medication updated! ✅",
      description: `${editForm.name} has been updated`,
    });
  };

  const handleDelete = (medication: Medication) => {
    if (window.confirm(`Are you sure you want to delete ${medication.name}?`)) {
      onDeleteMedication(medication.id);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <List className="text-hot-pink" size={24} />
          <h2 className="text-2xl font-semibold text-foreground">Current Medication List</h2>
        </div>
        <Button
          onClick={onExportPDF}
          className="bg-hot-pink text-black hover:bg-hot-pink/90 flex items-center gap-2"
        >
          <Download size={18} />
          Export for Doctor
        </Button>
      </div>

      <Card className="medication-card bg-gray-800 p-4">
        {medications.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No medications added yet</p>
        ) : (
          <div className="space-y-4">
            {medications.map((medication) => (
              <Card key={medication.id} className="bg-gray-700 p-4">
                {editingId === medication.id && editForm ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Name</label>
                        <Input
                          value={editForm.name}
                          onChange={(e) => setEditForm(prev => prev ? {...prev, name: e.target.value} : null)}
                          className="bg-gray-600"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Dosage</label>
                        <Input
                          value={editForm.dosage}
                          onChange={(e) => setEditForm(prev => prev ? {...prev, dosage: e.target.value} : null)}
                          className="bg-gray-600"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Time</label>
                        <Input
                          type="time"
                          value={editForm.time}
                          onChange={(e) => setEditForm(prev => prev ? {...prev, time: e.target.value} : null)}
                          className="bg-gray-600"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Frequency</label>
                        <Input
                          value={editForm.frequency}
                          onChange={(e) => setEditForm(prev => prev ? {...prev, frequency: e.target.value} : null)}
                          className="bg-gray-600"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Instructions</label>
                      <Textarea
                        value={editForm.instructions}
                        onChange={(e) => setEditForm(prev => prev ? {...prev, instructions: e.target.value} : null)}
                        className="bg-gray-600"
                      />
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button onClick={cancelEditing} variant="outline" size="sm">
                        <X size={16} />
                        Cancel
                      </Button>
                      <Button onClick={saveChanges} className="bg-green-500 text-black hover:bg-green-500/90" size="sm">
                        <Save size={16} />
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-foreground">{medication.name}</h3>
                        <span className="text-gold bg-gray-600 px-2 py-1 rounded text-sm">
                          {medication.dosage}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p><span className="text-champagne">Time:</span> {medication.time}</p>
                        <p><span className="text-champagne">Frequency:</span> {medication.frequency}</p>
                        <p><span className="text-champagne">Instructions:</span> {medication.instructions}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => startEditing(medication)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        <Edit size={14} />
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleDelete(medication)}
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1 text-red-400 hover:text-red-300"
                      >
                        <Trash2 size={14} />
                        Delete
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default MedicationList;
