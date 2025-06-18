import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Brain, TrendingUp, AlertTriangle, History, TrendingDown, Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useDataMigration } from '@/hooks/useDataMigration';
import AddMoodEntryDialog from './AddMoodEntryDialog';
import MoodHistory from './MoodHistory';

interface MoodEntry {
  id: string;
  timestamp: string;
  moodLevel: number;
  type: 'normal' | 'rapid-cycling' | 'panic-attack' | 'mixed-episode' | 'depression' | 'hypomania' | 'mania';
  notes?: string;
  triggers?: string[];
  severity?: 'mild' | 'moderate' | 'severe';
}

interface MoodTrackerProps {
  onBack: () => void;
}

const MoodTracker = ({ onBack }: MoodTrackerProps) => {
  const { user } = useAuth();
  const { migrationComplete } = useDataMigration();
  const { toast } = useToast();
  const [addEntryOpen, setAddEntryOpen] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([]);
  const [loading, setLoading] = useState(true);

  // Load mood entries from Supabase
  useEffect(() => {
    if (!user || !migrationComplete) return;

    const loadMoodEntries = async () => {
      try {
        const { data: supabaseEntries, error } = await supabase
          .from('mood_entries')
          .select('*')
          .eq('user_id', user.id)
          .order('timestamp', { ascending: false });

        if (error) throw error;

        // Transform Supabase data to local format
        const transformedEntries = supabaseEntries?.map(entry => ({
          id: entry.id,
          timestamp: entry.timestamp,
          moodLevel: entry.mood,
          type: 'normal' as const,
          notes: entry.notes || undefined
        })) || [];

        setMoodEntries(transformedEntries);
        setLoading(false);
      } catch (error) {
        console.error('Error loading mood entries:', error);
        setLoading(false);
      }
    };

    loadMoodEntries();
  }, [user, migrationComplete]);

  const handleAddEntry = async (entry: Omit<MoodEntry, 'id' | 'timestamp'>) => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('mood_entries')
        .insert({
          user_id: user.id,
          mood: entry.moodLevel,
          notes: entry.notes || null,
          timestamp: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      const newEntry: MoodEntry = {
        id: data.id,
        timestamp: data.timestamp,
        moodLevel: data.mood,
        type: entry.type,
        notes: data.notes || undefined
      };

      setMoodEntries(prev => [newEntry, ...prev]);
      setAddEntryOpen(false);
      
      toast({
        title: "Mood entry logged! 🧠",
        description: `${entry.type.replace('-', ' ')} recorded and saved to cloud`,
      });
    } catch (error) {
      console.error('Error adding mood entry:', error);
      toast({
        title: "Error logging mood",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'depression':
        return <TrendingDown className="text-blue-600" size={18} />;
      case 'hypomania':
        return <TrendingUp className="text-yellow-500" size={18} />;
      case 'mania':
        return <Zap className="text-red-500" size={18} />;
      case 'rapid-cycling':
        return <TrendingUp className="text-orange-500" size={18} />;
      case 'panic-attack':
        return <AlertTriangle className="text-red-500" size={18} />;
      case 'mixed-episode':
        return <Brain className="text-purple-500" size={18} />;
      default:
        return <Brain className="text-blue-500" size={18} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'depression':
        return 'border-l-blue-600';
      case 'hypomania':
        return 'border-l-yellow-500';
      case 'mania':
        return 'border-l-red-500';
      case 'rapid-cycling':
        return 'border-l-orange-500';
      case 'panic-attack':
        return 'border-l-red-500';
      case 'mixed-episode':
        return 'border-l-purple-500';
      default:
        return 'border-l-blue-500';
    }
  };

  const getMoodColor = (level: number) => {
    if (level <= 3) return 'text-red-400';
    if (level <= 5) return 'text-yellow-400';
    if (level <= 7) return 'text-blue-400';
    return 'text-green-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-white">Loading your mood entries...</div>
      </div>
    );
  }

  if (showHistory) {
    return (
      <MoodHistory 
        entries={moodEntries}
        onBack={() => setShowHistory(false)}
      />
    );
  }

  const todayEntries = moodEntries.filter(entry => 
    new Date(entry.timestamp).toDateString() === new Date().toDateString()
  );

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
          <Brain className="text-hot-pink" size={24} />
          <h2 className="text-2xl font-semibold text-foreground">Mood Tracker</h2>
        </div>
        <div className="flex gap-2 ml-auto">
          <Button
            onClick={() => setAddEntryOpen(true)}
            className="bg-hot-pink text-black hover:bg-hot-pink/90"
          >
            Log Mood
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

      <Card className="medication-card bg-gray-800 p-4">
        <h3 className="font-semibold text-foreground mb-3">Today's Mood Entries</h3>
        {todayEntries.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No mood entries logged today</p>
        ) : (
          <div className="space-y-3">
            {todayEntries.map((entry) => (
              <Card key={entry.id} className={`border-l-4 ${getTypeColor(entry.type)} bg-gray-700`}>
                <div className="flex items-start justify-between p-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getTypeIcon(entry.type)}
                      <span className="font-medium text-foreground capitalize">
                        {entry.type.replace('-', ' ')}
                      </span>
                      <span className={`font-bold text-lg ${getMoodColor(entry.moodLevel)}`}>
                        {entry.moodLevel}/10
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {new Date(entry.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    {entry.notes && (
                      <p className="text-sm text-champagne ml-6">{entry.notes}</p>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>

      <AddMoodEntryDialog
        open={addEntryOpen}
        onOpenChange={setAddEntryOpen}
        onSubmit={handleAddEntry}
      />
    </div>
  );
};

export default MoodTracker;
