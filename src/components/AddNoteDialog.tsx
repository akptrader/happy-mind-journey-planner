
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { StickyNote } from 'lucide-react';

interface AddNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (note: string) => void;
  medicationName: string;
}

const AddNoteDialog = ({ open, onOpenChange, onSubmit, medicationName }: AddNoteDialogProps) => {
  const [note, setNote] = useState('');

  const handleSubmit = () => {
    onSubmit(note.trim());
    setNote('');
  };

  const handleCancel = () => {
    setNote('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <StickyNote className="text-hot-pink" size={20} />
            Add Note for {medicationName}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Textarea
            placeholder="Add any notes about this medication (side effects, how you felt, etc.)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[100px]"
          />
          
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              className="bg-hot-pink text-black hover:bg-hot-pink/90"
            >
              Take Medication
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddNoteDialog;
