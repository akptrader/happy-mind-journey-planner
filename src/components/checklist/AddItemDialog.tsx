
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save } from 'lucide-react';

interface AddItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  newItemTitle: string;
  setNewItemTitle: (title: string) => void;
  newItemTime: string;
  setNewItemTime: (time: string) => void;
  newItemCategory: 'medication' | 'meals' | 'selfcare';
  setNewItemCategory: (category: 'medication' | 'meals' | 'selfcare') => void;
  onSubmit: () => void;
}

const AddItemDialog = ({
  open,
  onOpenChange,
  newItemTitle,
  setNewItemTitle,
  newItemTime,
  setNewItemTime,
  newItemCategory,
  setNewItemCategory,
  onSubmit
}: AddItemDialogProps) => {
  return (
    <DialogContent className="w-[95vw] max-w-md mx-auto">
      <DialogHeader>
        <DialogTitle className="text-lg">Add New Checklist Item</DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Title</label>
          <Input
            value={newItemTitle}
            onChange={(e) => setNewItemTitle(e.target.value)}
            placeholder="Enter item title..."
            className="min-h-[48px] touch-manipulation"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Time (optional)</label>
          <Input
            value={newItemTime}
            onChange={(e) => setNewItemTime(e.target.value)}
            placeholder="e.g., 8:00 AM"
            className="min-h-[48px] touch-manipulation"
          />
        </div>
        <div>
          <label className="text-sm font-medium text-foreground mb-2 block">Category</label>
          <select
            value={newItemCategory}
            onChange={(e) => setNewItemCategory(e.target.value as 'medication' | 'meals' | 'selfcare')}
            className="w-full p-3 min-h-[48px] rounded border bg-background text-foreground touch-manipulation"
          >
            <option value="selfcare">Self Care</option>
            <option value="medication">Medication</option>
            <option value="meals">Meals</option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={onSubmit} className="flex-1 min-h-[48px] touch-manipulation">
            <Save size={16} />
            <span className="ml-2">Add Item</span>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            className="flex-1 min-h-[48px] touch-manipulation"
          >
            <span className="ml-2">Cancel</span>
          </Button>
        </div>
      </div>
    </DialogContent>
  );
};

export default AddItemDialog;
