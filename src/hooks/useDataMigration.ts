
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDataMigration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [migrationComplete, setMigrationComplete] = useState(false);

  useEffect(() => {
    if (!user) return;

    const migrateData = async () => {
      try {
        // Check if migration has already been done
        const migrationKey = `migration_complete_${user.id}`;
        if (localStorage.getItem(migrationKey)) {
          setMigrationComplete(true);
          return;
        }

        // Migrate medications
        const medications = JSON.parse(localStorage.getItem('medications') || '[]');
        if (medications.length > 0) {
          const medicationData = medications.map((med: any) => ({
            user_id: user.id,
            name: med.name,
            dosage: med.dosage,
            frequency: med.frequency || 'Daily',
            time: med.takeMorning ? 'morning' : (med.takeEvening ? 'evening' : null),
            taken: false
          }));
          
          await supabase.from('medications').insert(medicationData);
          console.log('Migrated medications:', medications.length);
        }

        // Migrate mood entries
        const moodEntries = JSON.parse(localStorage.getItem('moodEntries') || '[]');
        if (moodEntries.length > 0) {
          const moodData = moodEntries.map((entry: any) => ({
            user_id: user.id,
            mood: entry.moodLevel,
            notes: entry.notes,
            timestamp: entry.timestamp
          }));
          
          await supabase.from('mood_entries').insert(moodData);
          console.log('Migrated mood entries:', moodEntries.length);
        }

        // Migrate checklist items
        const checklistItems = JSON.parse(localStorage.getItem('checklistItems') || '[]');
        if (checklistItems.length > 0) {
          const checklistData = checklistItems.map((item: any) => ({
            user_id: user.id,
            title: item.title,
            category: item.category || 'selfcare',
            time: item.time,
            completed: item.completed || false,
            completed_at: item.completedAt || null
          }));
          
          await supabase.from('checklist_items').insert(checklistData);
          console.log('Migrated checklist items:', checklistItems.length);
        }

        // Mark migration as complete
        localStorage.setItem(migrationKey, 'true');
        setMigrationComplete(true);

        toast({
          title: "Data migrated successfully! ☁️",
          description: "Your wellness data is now backed up to the cloud",
        });

      } catch (error) {
        console.error('Migration error:', error);
        toast({
          title: "Migration partially completed",
          description: "Some data may need to be re-entered",
          variant: "destructive",
        });
        setMigrationComplete(true);
      }
    };

    migrateData();
  }, [user, toast]);

  return { migrationComplete };
};
