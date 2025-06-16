
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Heart, Pill, FileText, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const QuickActions = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [quickMoodOpen, setQuickMoodOpen] = useState(false);
  const [quickNoteOpen, setQuickNoteOpen] = useState(false);
  const [moodLevel, setMoodLevel] = useState('');
  const [quickNote, setQuickNote] = useState('');
  const { toast } = useToast();

  const handleQuickMoodLog = () => {
    if (!moodLevel) return;
    
    const today = new Date().toISOString().split('T')[0];
    const existingMoods = JSON.parse(localStorage.getItem('moodEntries') || '[]');
    
    const newMoodEntry = {
      id: Date.now().toString(),
      date: today,
      mood: parseInt(moodLevel),
      notes: '',
      timestamp: new Date().toISOString()
    };
    
    const updatedMoods = [newMoodEntry, ...existingMoods];
    localStorage.setItem('moodEntries', JSON.stringify(updatedMoods));
    
    toast({
      title: "Mood logged! 😊",
      description: `Mood level ${moodLevel}/10 recorded`,
    });
    
    setMoodLevel('');
    setQuickMoodOpen(false);
    setIsExpanded(false);
  };

  const handleQuickNote = () => {
    if (!quickNote.trim()) return;
    
    const today = new Date().toISOString().split('T')[0];
    const existingNotes = JSON.parse(localStorage.getItem('dailyNotes') || '{}');
    
    if (!existingNotes[today]) {
      existingNotes[today] = [];
    }
    
    const newNote = {
      id: Date.now().toString(),
      text: quickNote,
      timestamp: new Date().toISOString()
    };
    
    existingNotes[today].push(newNote);
    localStorage.setItem('dailyNotes', JSON.stringify(existingNotes));
    
    toast({
      title: "Note added! 📝",
      description: "Quick note saved to today's entries",
    });
    
    setQuickNote('');
    setQuickNoteOpen(false);
    setIsExpanded(false);
  };

  const handleQuickMedication = () => {
    const medications = JSON.parse(localStorage.getItem('medications') || '[]');
    if (medications.length === 0) {
      toast({
        title: "No medications found",
        description: "Add medications first in the Medications tab",
      });
      return;
    }

    // Log the first medication as taken (simplified for quick action)
    const firstMed = medications[0];
    const medicationLog = JSON.parse(localStorage.getItem('medicationLog') || '[]');
    const now = new Date();
    
    const newLog = {
      id: Date.now().toString(),
      medicationId: firstMed.id,
      medicationName: firstMed.name,
      timestamp: now.toISOString(),
      taken: true,
    };
    
    const updatedLog = [newLog, ...medicationLog];
    localStorage.setItem('medicationLog', JSON.stringify(updatedLog));
    
    toast({
      title: "Medication logged! 💊",
      description: `${firstMed.name} marked as taken`,
    });
    
    setIsExpanded(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isExpanded && (
        <div className="flex flex-col gap-3 mb-4">
          {/* Quick Mood Dialog */}
          <Dialog open={quickMoodOpen} onOpenChange={setQuickMoodOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-hot-pink text-white hover:bg-hot-pink/90 shadow-lg"
                size="sm"
              >
                <Heart size={16} className="mr-2" />
                Log Mood
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Quick Mood Log</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Select value={moodLevel} onValueChange={setMoodLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select mood level (1-10)" />
                  </SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5,6,7,8,9,10].map(num => (
                      <SelectItem key={num} value={num.toString()}>
                        {num}/10 {num <= 3 ? '😢' : num <= 6 ? '😐' : '😊'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button 
                  onClick={handleQuickMoodLog} 
                  disabled={!moodLevel}
                  className="w-full"
                >
                  Log Mood
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Quick Note Dialog */}
          <Dialog open={quickNoteOpen} onOpenChange={setQuickNoteOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-champagne text-black hover:bg-champagne/90 shadow-lg"
                size="sm"
              >
                <FileText size={16} className="mr-2" />
                Add Note
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Quick Note</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Textarea
                  value={quickNote}
                  onChange={(e) => setQuickNote(e.target.value)}
                  placeholder="Write a quick note..."
                  rows={3}
                />
                <Button 
                  onClick={handleQuickNote} 
                  disabled={!quickNote.trim()}
                  className="w-full"
                >
                  Save Note
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Quick Medication Button */}
          <Button
            onClick={handleQuickMedication}
            className="bg-green-500 text-white hover:bg-green-500/90 shadow-lg"
            size="sm"
          >
            <Pill size={16} className="mr-2" />
            Took Meds
          </Button>
        </div>
      )}

      {/* Main FAB */}
      <Button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`rounded-full w-14 h-14 shadow-lg transition-all duration-300 ${
          isExpanded 
            ? 'bg-red-500 hover:bg-red-500/90 rotate-45' 
            : 'bg-hot-pink hover:bg-hot-pink/90'
        }`}
      >
        {isExpanded ? <X size={24} /> : <Plus size={24} />}
      </Button>
    </div>
  );
};

export default QuickActions;
