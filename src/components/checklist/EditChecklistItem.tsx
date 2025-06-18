
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, X } from 'lucide-react';

interface EditChecklistItemProps {
  editTitle: string;
  setEditTitle: (title: string) => void;
  editTime: string;
  setEditTime: (time: string) => void;
  editCategory: 'medication' | 'meals' | 'selfcare';
  setEditCategory: (category: 'medication' | 'meals' | 'selfcare') => void;
  onSave: () => void;
  onCancel: () => void;
}

const EditChecklistItem = ({
  editTitle,
  setEditTitle,
  editTime,
  setEditTime,
  editCategory,
  setEditCategory,
  onSave,
  onCancel
}: EditChecklistItemProps) => {
  return (
    <Card className="medication-card bg-gray-800">
      <div className="space-y-3 p-4">
        <div>
          <Input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="mb-3 min-h-[48px] touch-manipulation"
            placeholder="Item title"
          />
          <Input
            value={editTime}
            onChange={(e) => setEditTime(e.target.value)}
            placeholder="Time (optional)"
            className="mb-3 min-h-[48px] touch-manipulation"
          />
          <select
            value={editCategory}
            onChange={(e) => setEditCategory(e.target.value as 'medication' | 'meals' | 'selfcare')}
            className="w-full p-3 min-h-[48px] rounded border bg-background text-foreground touch-manipulation"
          >
            <option value="selfcare">Self Care</option>
            <option value="medication">Medication</option>
            <option value="meals">Meals</option>
          </select>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={onSave} size="sm" className="min-h-[48px] flex-1 touch-manipulation">
            <Save size={16} />
            <span className="ml-2">Save</span>
          </Button>
          <Button onClick={onCancel} variant="outline" size="sm" className="min-h-[48px] flex-1 touch-manipulation">
            <X size={16} />
            <span className="ml-2">Cancel</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EditChecklistItem;
