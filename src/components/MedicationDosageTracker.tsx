
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Calendar, Pill, TrendingUp, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface DosageChange {
  id: string;
  timestamp: string;
  medicationName: string;
  oldDosage: string;
  newDosage: string;
  reason: string;
  notes?: string;
  sideEffects: string[];
}

interface SideEffectLog {
  id: string;
  timestamp: string;
  medicationName?: string;
  sideEffect: string;
  severity: 'mild' | 'moderate' | 'severe';
  notes?: string;
}

const MedicationDosageTracker = () => {
  const [dosageChanges, setDosageChanges] = useState<DosageChange[]>([]);
  const [sideEffects, setSideEffects] = useState<SideEffectLog[]>([]);
  const [showDosageDialog, setShowDosageDialog] = useState(false);
  const [showSideEffectDialog, setShowSideEffectDialog] = useState(false);
  const { toast } = useToast();

  const [dosageForm, setDosageForm] = useState({
    medicationName: '',
    oldDosage: '',
    newDosage: '',
    reason: '',
    notes: ''
  });

  const [sideEffectForm, setSideEffectForm] = useState({
    medicationName: '',
    sideEffect: '',
    severity: 'mild' as const,
    notes: ''
  });

  const commonSideEffects = [
    'Nausea', 'Fatigue', 'Dizziness', 'Headache', 'Drowsiness',
    'Dry mouth', 'Weight gain', 'Weight loss', 'Insomnia',
    'Tremor', 'Blurred vision', 'Constipation', 'Diarrhea',
    'Anxiety', 'Depression', 'Mood swings', 'Memory issues'
  ];

  useEffect(() => {
    const savedDosageChanges = localStorage.getItem('dosageChanges');
    const savedSideEffects = localStorage.getItem('sideEffects');
    
    if (savedDosageChanges) {
      setDosageChanges(JSON.parse(savedDosageChanges));
    }
    if (savedSideEffects) {
      setSideEffects(JSON.parse(savedSideEffects));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dosageChanges', JSON.stringify(dosageChanges));
  }, [dosageChanges]);

  useEffect(() => {
    localStorage.setItem('sideEffects', JSON.stringify(sideEffects));
  }, [sideEffects]);

  const handleDosageSubmit = () => {
    if (!dosageForm.medicationName || !dosageForm.newDosage) return;

    const newChange: DosageChange = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      medicationName: dosageForm.medicationName,
      oldDosage: dosageForm.oldDosage || 'Not specified',
      newDosage: dosageForm.newDosage,
      reason: dosageForm.reason,
      notes: dosageForm.notes,
      sideEffects: []
    };

    setDosageChanges(prev => [newChange, ...prev]);
    setDosageForm({
      medicationName: '',
      oldDosage: '',
      newDosage: '',
      reason: '',
      notes: ''
    });
    setShowDosageDialog(false);

    toast({
      title: "Dosage change logged! 💊",
      description: `${dosageForm.medicationName} dosage updated`,
    });
  };

  const handleSideEffectSubmit = () => {
    if (!sideEffectForm.sideEffect) return;

    const newSideEffect: SideEffectLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      medicationName: sideEffectForm.medicationName || undefined,
      sideEffect: sideEffectForm.sideEffect,
      severity: sideEffectForm.severity,
      notes: sideEffectForm.notes || undefined
    };

    setSideEffects(prev => [newSideEffect, ...prev]);
    setSideEffectForm({
      medicationName: '',
      sideEffect: '',
      severity: 'mild',
      notes: ''
    });
    setShowSideEffectDialog(false);

    toast({
      title: "Side effect logged! 📝",
      description: `${sideEffectForm.sideEffect} recorded`,
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'mild': return 'text-yellow-500';
      case 'moderate': return 'text-orange-500';
      case 'severe': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6">
        <Button
          onClick={() => setShowDosageDialog(true)}
          className="bg-hot-pink text-black hover:bg-hot-pink/90"
        >
          <Pill size={18} />
          Log Dosage Change
        </Button>
        <Button
          onClick={() => setShowSideEffectDialog(true)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <AlertTriangle size={18} />
          Log Side Effect
        </Button>
      </div>

      {/* Recent Dosage Changes */}
      <Card className="medication-card bg-gray-800 p-4">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="text-hot-pink" size={20} />
          <h3 className="text-lg font-semibold text-foreground">Recent Dosage Changes</h3>
        </div>
        {dosageChanges.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No dosage changes logged yet</p>
        ) : (
          <div className="space-y-3">
            {dosageChanges.slice(0, 5).map((change) => (
              <Card key={change.id} className="border-l-4 border-l-blue-500 bg-gray-700 p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{change.medicationName}</span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(change.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-champagne mb-1">
                      <span className="text-red-400">{change.oldDosage}</span>
                      <span className="mx-2">→</span>
                      <span className="text-green-400">{change.newDosage}</span>
                    </div>
                    {change.reason && (
                      <p className="text-sm text-muted-foreground">Reason: {change.reason}</p>
                    )}
                    {change.notes && (
                      <p className="text-sm text-champagne mt-1">{change.notes}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Recent Side Effects */}
      <Card className="medication-card bg-gray-800 p-4">
        <div className="flex items-center gap-2 mb-4">
          <AlertTriangle className="text-hot-pink" size={20} />
          <h3 className="text-lg font-semibold text-foreground">Recent Side Effects</h3>
        </div>
        {sideEffects.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No side effects logged yet</p>
        ) : (
          <div className="space-y-3">
            {sideEffects.slice(0, 5).map((effect) => (
              <Card key={effect.id} className="border-l-4 border-l-orange-500 bg-gray-700 p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{effect.sideEffect}</span>
                      <span className={`text-sm font-medium ${getSeverityColor(effect.severity)}`}>
                        {effect.severity}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(effect.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                    {effect.medicationName && (
                      <p className="text-sm text-champagne">From: {effect.medicationName}</p>
                    )}
                    {effect.notes && (
                      <p className="text-sm text-muted-foreground mt-1">{effect.notes}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      {/* Dosage Change Dialog */}
      <Dialog open={showDosageDialog} onOpenChange={setShowDosageDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pill className="text-hot-pink" size={20} />
              Log Dosage Change
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="med-name">Medication Name</Label>
              <Input
                id="med-name"
                placeholder="e.g., Lithium, Quetiapine"
                value={dosageForm.medicationName}
                onChange={(e) => setDosageForm(prev => ({ ...prev, medicationName: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="old-dosage">Old Dosage</Label>
                <Input
                  id="old-dosage"
                  placeholder="e.g., 25mg"
                  value={dosageForm.oldDosage}
                  onChange={(e) => setDosageForm(prev => ({ ...prev, oldDosage: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="new-dosage">New Dosage</Label>
                <Input
                  id="new-dosage"
                  placeholder="e.g., 50mg"
                  value={dosageForm.newDosage}
                  onChange={(e) => setDosageForm(prev => ({ ...prev, newDosage: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="reason">Reason for Change</Label>
              <Input
                id="reason"
                placeholder="e.g., Side effects, Ineffective"
                value={dosageForm.reason}
                onChange={(e) => setDosageForm(prev => ({ ...prev, reason: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional notes about this change..."
                value={dosageForm.notes}
                onChange={(e) => setDosageForm(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowDosageDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleDosageSubmit}
                disabled={!dosageForm.medicationName || !dosageForm.newDosage}
                className="bg-hot-pink text-black hover:bg-hot-pink/90"
              >
                Log Change
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Side Effect Dialog */}
      <Dialog open={showSideEffectDialog} onOpenChange={setShowSideEffectDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="text-hot-pink" size={20} />
              Log Side Effect
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="se-medication">Medication (optional)</Label>
              <Input
                id="se-medication"
                placeholder="Which medication caused this?"
                value={sideEffectForm.medicationName}
                onChange={(e) => setSideEffectForm(prev => ({ ...prev, medicationName: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="side-effect">Side Effect</Label>
              <select
                id="side-effect"
                value={sideEffectForm.sideEffect}
                onChange={(e) => setSideEffectForm(prev => ({ ...prev, sideEffect: e.target.value }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select or type custom...</option>
                {commonSideEffects.map(effect => (
                  <option key={effect} value={effect}>{effect}</option>
                ))}
                <option value="custom">Other (specify in notes)</option>
              </select>
            </div>

            <div>
              <Label htmlFor="severity">Severity</Label>
              <select
                id="severity"
                value={sideEffectForm.severity}
                onChange={(e) => setSideEffectForm(prev => ({ ...prev, severity: e.target.value as any }))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="mild">Mild - Noticeable but manageable</option>
                <option value="moderate">Moderate - Interferes with daily activities</option>
                <option value="severe">Severe - Significantly impacts quality of life</option>
              </select>
            </div>

            <div>
              <Label htmlFor="se-notes">Notes</Label>
              <Textarea
                id="se-notes"
                placeholder="Describe the side effect, duration, etc..."
                value={sideEffectForm.notes}
                onChange={(e) => setSideEffectForm(prev => ({ ...prev, notes: e.target.value }))}
              />
            </div>
            
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setShowSideEffectDialog(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleSideEffectSubmit}
                disabled={!sideEffectForm.sideEffect}
                className="bg-hot-pink text-black hover:bg-hot-pink/90"
              >
                Log Side Effect
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MedicationDosageTracker;
