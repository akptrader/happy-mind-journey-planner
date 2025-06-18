
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check, Edit2, Trash2 } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChecklistItemData {
  id: string;
  title: string;
  completed: boolean;
  category: 'medication' | 'meals' | 'selfcare';
  time?: string;
}

interface ChecklistItemProps {
  item: ChecklistItemData;
  onToggle: (id: string) => void;
  onEdit: (item: ChecklistItemData) => void;
  onDelete: (id: string) => void;
}

const ChecklistItem = ({ item, onToggle, onEdit, onDelete }: ChecklistItemProps) => {
  const isMobile = useIsMobile();

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'medication':
        return '💊';
      case 'meals':
        return '🍽️';
      case 'selfcare':
        return '💚';
      default:
        return '✓';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'medication':
        return 'border-l-hot-pink bg-gray-800';
      case 'meals':
        return 'border-l-gold bg-gray-800';
      case 'selfcare':
        return 'border-l-champagne bg-gray-800';
      default:
        return 'border-l-gray-300 bg-gray-800';
    }
  };

  return (
    <Card 
      className={`medication-card border-l-4 ${getCategoryColor(item.category)} ${
        item.completed ? 'completed-task' : ''
      } transition-all duration-200`}
    >
      <div className="flex items-center gap-3 sm:gap-4 p-4">
        <div 
          className={`flex-shrink-0 w-10 h-10 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center cursor-pointer touch-manipulation ${
            item.completed 
              ? 'bg-accent border-accent text-white' 
              : 'border-muted-foreground'
          }`} 
          onClick={() => onToggle(item.id)}
        >
          {item.completed && <Check size={isMobile ? 20 : 16} />}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
            <div className="flex items-center gap-2">
              <span className="text-lg">{getCategoryIcon(item.category)}</span>
              <span className={`font-medium text-sm sm:text-base ${item.completed ? 'line-through text-muted-foreground' : ''}`}>
                {item.title}
              </span>
            </div>
            {item.time && (
              <span className="text-xs sm:text-sm text-muted-foreground sm:ml-auto">
                {item.time}
              </span>
            )}
          </div>
        </div>

        <div className="flex gap-1">
          <Button 
            onClick={() => onEdit(item)}
            size="sm" 
            variant="ghost"
            className="h-12 w-12 sm:h-8 sm:w-8 p-0 touch-manipulation"
          >
            <Edit2 size={isMobile ? 18 : 14} />
          </Button>
          <Button 
            onClick={() => onDelete(item.id)}
            size="sm" 
            variant="ghost"
            className="h-12 w-12 sm:h-8 sm:w-8 p-0 text-red-400 hover:text-red-300 touch-manipulation"
          >
            <Trash2 size={isMobile ? 18 : 14} />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ChecklistItem;
