
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Briefcase, Plus, History, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import AddWorkEntryDialog from './AddWorkEntryDialog';
import WorkProductivityHistory from './WorkProductivityHistory';

interface WorkEntry {
  id: string;
  timestamp: string;
  productivityLevel: number; // 1-10 scale
  focusLevel: number; // 1-10 scale
  energyLevel: number; // 1-10 scale
  tasksCompleted: number;
  hoursWorked: number;
  workType: 'creative' | 'analytical' | 'administrative' | 'meetings' | 'mixed';
  distractions: string[];
  notes?: string;
}

interface WorkProductivityTrackerProps {
  onBack: () => void;
}

const WorkProductivityTracker = ({ onBack }: WorkProductivityTrackerProps) => {
  const { toast } = useToast();
  const [addEntryOpen, setAddEntryOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  
  const [workEntries, setWorkEntries] = useState<WorkEntry[]>(() => {
    const saved = localStorage.getItem('workEntries');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('workEntries', JSON.stringify(workEntries));
  }, [workEntries]);

  const handleAddEntry = (entry: Omit<WorkEntry, 'id' | 'timestamp'>) => {
    const newEntry: WorkEntry = {
      ...entry,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    setWorkEntries(prev => [newEntry, ...prev]);
    setAddEntryOpen(false);
    
    toast({
      title: "Work entry logged! 💼",
      description: `Productivity: ${entry.productivityLevel}/10, Focus: ${entry.focusLevel}/10`,
    });
  };

  if (showHistory) {
    return (
      <WorkProductivityHistory 
        workEntries={workEntries}
        onBack={() => setShowHistory(false)}
      />
    );
  }

  const todayEntries = workEntries.filter(entry => 
    new Date(entry.timestamp).toDateString() === new Date().toDateString()
  );

  const todayAverage = todayEntries.length > 0 ? {
    productivity: Math.round((todayEntries.reduce((sum, entry) => sum + entry.productivityLevel, 0) / todayEntries.length) * 10) / 10,
    focus: Math.round((todayEntries.reduce((sum, entry) => sum + entry.focusLevel, 0) / todayEntries.length) * 10) / 10,
    energy: Math.round((todayEntries.reduce((sum, entry) => sum + entry.energyLevel, 0) / todayEntries.length) * 10) / 10,
    totalHours: todayEntries.reduce((sum, entry) => sum + entry.hoursWorked, 0)
  } : null;

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
          <Briefcase className="text-hot-pink" size={24} />
          <h2 className="text-2xl font-semibold text-foreground">Work Productivity</h2>
        </div>
        <div className="flex gap-2 ml-auto">
          <Button
            onClick={() => setAddEntryOpen(true)}
            className="bg-hot-pink text-black hover:bg-hot-pink/90"
          >
            <Plus size={18} />
            Log Work Session
          </Button>
          <Button
            onClick={() => setShowHistory(true)}
            variant="outline"
            className="flex items-center gap-2"
          >
            <History size={18} />
            History
          </Button>
        </div>
      </div>

      {/* Today's Summary */}
      {todayAverage && (
        <Card className="medication-card bg-gray-800 p-6">
          <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="text-hot-pink" size={20} />
            Today's Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gold">{todayAverage.productivity}/10</div>
              <div className="text-sm text-muted-foreground">Productivity</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-champagne">{todayAverage.focus}/10</div>
              <div className="text-sm text-muted-foreground">Focus</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-hot-pink">{todayAverage.energy}/10</div>
              <div className="text-sm text-muted-foreground">Energy</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">{todayAverage.totalHours}h</div>
              <div className="text-sm text-muted-foreground">Hours Worked</div>
            </div>
          </div>
        </Card>
      )}

      {/* Today's Entries */}
      <Card className="medication-card bg-gray-800 p-4">
        <h3 className="font-semibold text-foreground mb-3">Today's Work Sessions</h3>
        {todayEntries.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No work sessions logged today</p>
        ) : (
          <div className="space-y-3">
            {todayEntries.map((entry) => (
              <Card key={entry.id} className="bg-gray-700 border-l-4 border-l-hot-pink">
                <div className="p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-foreground capitalize">
                      {entry.workType.replace('-', ' ')} Work
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {new Date(entry.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                    <div>
                      <span className="text-muted-foreground">Productivity: </span>
                      <span className="text-gold font-medium">{entry.productivityLevel}/10</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Focus: </span>
                      <span className="text-champagne font-medium">{entry.focusLevel}/10</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Energy: </span>
                      <span className="text-hot-pink font-medium">{entry.energyLevel}/10</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm mb-2">
                    <span>
                      <span className="text-muted-foreground">Tasks: </span>
                      <span className="text-green-400 font-medium">{entry.tasksCompleted}</span>
                    </span>
                    <span>
                      <span className="text-muted-foreground">Hours: </span>
                      <span className="text-blue-400 font-medium">{entry.hoursWorked}h</span>
                    </span>
                  </div>
                  {entry.distractions.length > 0 && (
                    <div className="text-xs text-orange-400 mb-1">
                      Distractions: {entry.distractions.join(', ')}
                    </div>
                  )}
                  {entry.notes && (
                    <p className="text-sm text-champagne">{entry.notes}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <AddWorkEntryDialog
        open={addEntryOpen}
        onOpenChange={setAddEntryOpen}
        onSubmit={handleAddEntry}
      />
    </div>
  );
};

export default WorkProductivityTracker;
