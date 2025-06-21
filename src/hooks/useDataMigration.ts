
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDataMigration = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [migrationComplete, setMigrationComplete] = useState(false);

  useEffect(() => {
    if (!user) {
      setMigrationComplete(false);
      return;
    }

    const migrateData = async () => {
      try {
        // Check if migration has already been done
        const migrationKey = `migration_complete_${user.id}`;
        const migrationDone = localStorage.getItem(migrationKey);
        
        if (migrationDone === 'true') {
          setMigrationComplete(true);
          return;
        }

        console.log('Starting data migration for user:', user.id);

        // Migrate medications
        const medicationsData = localStorage.getItem('medications');
        if (medicationsData) {
          try {
            const medications = JSON.parse(medicationsData);
            if (Array.isArray(medications) && medications.length > 0) {
              const medicationData = medications.map((med: any) => ({
                user_id: user.id,
                name: med.name || 'Unknown Medication',
                dosage: med.dosage || '1 tablet',
                frequency: med.frequency || 'Daily',
                time: med.takeMorning ? 'morning' : (med.takeEvening ? 'evening' : null),
                taken: false
              }));
              
              const { error: medError } = await supabase.from('medications').insert(medicationData);
              if (medError) {
                console.error('Medication migration error:', medError);
              } else {
                console.log('Migrated medications:', medications.length);
              }
            }
          } catch (error) {
            console.error('Error parsing medications:', error);
          }
        }

        // Migrate mood entries
        const moodData = localStorage.getItem('moodEntries');
        if (moodData) {
          try {
            const moodEntries = JSON.parse(moodData);
            if (Array.isArray(moodEntries) && moodEntries.length > 0) {
              const moodEntryData = moodEntries.map((entry: any) => ({
                user_id: user.id,
                mood: entry.moodLevel || entry.mood || 5,
                notes: entry.notes || '',
                timestamp: entry.timestamp || new Date().toISOString()
              }));
              
              const { error: moodError } = await supabase.from('mood_entries').insert(moodEntryData);
              if (moodError) {
                console.error('Mood migration error:', moodError);
              } else {
                console.log('Migrated mood entries:', moodEntries.length);
              }
            }
          } catch (error) {
            console.error('Error parsing mood entries:', error);
          }
        }

        // Migrate checklist items
        const checklistData = localStorage.getItem('checklistItems');
        if (checklistData) {
          try {
            const checklistItems = JSON.parse(checklistData);
            if (Array.isArray(checklistItems) && checklistItems.length > 0) {
              const checklistItemData = checklistItems.map((item: any) => ({
                user_id: user.id,
                title: item.title || 'Untitled Task',
                category: ['medication', 'meals', 'selfcare'].includes(item.category) ? item.category : 'selfcare',
                time: item.time || null,
                completed: item.completed || false,
                completed_at: item.completedAt || null
              }));
              
              const { error: checklistError } = await supabase.from('checklist_items').insert(checklistItemData);
              if (checklistError) {
                console.error('Checklist migration error:', checklistError);
              } else {
                console.log('Migrated checklist items:', checklistItems.length);
              }
            }
          } catch (error) {
            console.error('Error parsing checklist items:', error);
          }
        }

        // Mark migration as complete
        localStorage.setItem(migrationKey, 'true');
        setMigrationComplete(true);

        toast({
          title: "Data migration completed! ☁️",
          description: "Your wellness data has been backed up to the cloud",
        });

      } catch (error) {
        console.error('Migration error:', error);
        setMigrationComplete(true); // Allow app to continue even if migration fails
        
        toast({
          title: "Migration completed with warnings",
          description: "Some data may need to be re-entered",
          variant: "destructive",
        });
      }
    };

    // Add a small delay to ensure user authentication is fully established
    const migrationTimeout = setTimeout(() => {
      migrateData();
    }, 1000);

    return () => clearTimeout(migrationTimeout);
  }, [user, toast]);

  return { migrationComplete };
};
