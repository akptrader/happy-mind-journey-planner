
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, Check, Heart } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddSupplementDialog from './AddSupplementDialog';

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  taken: boolean;
  takenAt?: string;
  frequency: string;
}

interface SupplementTrackerProps {
  onBack: () => void;
}

const SupplementTracker = ({ onBack }: SupplementTrackerProps) => {
  const { toast } = useToast();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  
  const [supplements, setSupplements] = useState<Supplement[]>(() => {
    const saved = localStorage.getItem('supplements');
    return saved ? JSON.parse(saved) : [
      {
        id: '1',
        name: 'Vitamin D3',
        dosage: '1000 IU',
        taken: false,
        frequency: 'Daily'
      },
      {
        id: '2',
        name: 'Omega-3',
        dosage: '1000mg',
        taken: false,
        frequency: 'Daily'
      },
      {
        id: '3',
        name: 'Magnesium',
        dosage: '400mg',
        taken: false,
        frequency: 'Daily'
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('supplements', JSON.stringify(supplements));
  }, [supplements]);

  const markAsTaken = (id: string) => {
    const now = new Date().toISOString();
    const supplement = supplements.find(sup => sup.id === id);
    
    if (!supplement) return;

    setSupplements(prev => 
      prev.map(sup => 
        sup.id === id 
          ? { ...sup, taken: true, takenAt: now }
          : sup
      )
    );
    
    toast({
      title: "Supplement taken! 💊",
      description: `${supplement.name} (${supplement.dosage}) marked as complete`,
    });
  };

  const handleAddSupplement = (newSup: Omit<Supplement, 'id' | 'taken'>) => {
    const supplement: Supplement = {
      ...newSup,
      id: Date.now().toString(),
      taken: false
    };
    setSupplements(prev => [...prev, supplement]);
    setAddDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 mb-6">
        <Button
          onClick={onBack}
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Heart className="text-hot-pink" size={24} />
          <h2 className="text-2xl font-semibold text-foreground">Daily Supplements</h2>
        </div>
        <Button
          onClick={() => setAddDialogOpen(true)}
          variant="outline"
          className="flex items-center gap-2 ml-auto"
        >
          <Plus size={18} />
          Add Supplement
        </Button>
      </div>
      
      {supplements.map((supplement) => (
        <Card key={supplement.id} className={`medication-card border-l-4 border-l-champagne ${supplement.taken ? 'completed-task' : ''}`}>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Heart size={18} className="text-champagne" />
                <span className="font-semibold text-foreground">{supplement.name}</span>
                <span className="text-sm text-gold bg-gray-700 px-2 py-1 rounded">
                  {supplement.dosage}
                </span>
                <span className="text-sm text-muted-foreground">
                  {supplement.frequency}
                </span>
                {supplement.taken && supplement.takenAt && (
                  <span className="text-sm text-gold">
                    ✓ {new Date(supplement.takenAt).toLocaleTimeString()}
                  </span>
                )}
              </div>
            </div>
            
            <div className="flex gap-2 ml-4">
              <Button
                onClick={() => markAsTaken(supplement.id)}
                disabled={supplement.taken}
                className={`${supplement.taken ? 'bg-gray-600 text-gray-300 cursor-not-allowed' : 'bg-white text-hot-pink hover:bg-gray-100 border border-hot-pink'}`}
              >
                {supplement.taken ? <Check size={18} /> : 'Take'}
              </Button>
            </div>
          </div>
        </Card>
      ))}

      <AddSupplementDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onSubmit={handleAddSupplement}
      />
    </div>
  );
};

export default SupplementTracker;
